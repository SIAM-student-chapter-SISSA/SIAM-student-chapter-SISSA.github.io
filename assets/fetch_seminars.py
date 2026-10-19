#!/usr/bin/env python3
"""
fetch_seminars.py
-----------------
Fetches the AnJunSem calendar from researchseminars.org and writes two JS
files in the seminar object shape used by the site:

  { day, month, title, speaker, university, website }

Usage:
  python fetch_seminars.py
  python fetch_seminars.py --seminar AnJunSem
  python fetch_seminars.py --seminar AnJunSem \\
      --academic-year 2026 \\
      --output-upcoming assets/js/upcoming-ajs-seminars.js \\
      --output-past     assets/js/past-ajs-seminars.js

Requirements:
  pip install icalendar   # optional but recommended; falls back to built-in parser
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from urllib.request import urlopen, Request
from urllib.error import URLError

try:
    from icalendar import Calendar
    USE_ICALENDAR = True
except ImportError:
    USE_ICALENDAR = False

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


# ── fetch & parse ─────────────────────────────────────────────────────────────

def fetch_ics(seminar_id):
    url = f"https://researchseminars.org/seminar/{seminar_id}/ics"
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (fetch_seminars.py)"})
    try:
        with urlopen(req, timeout=15) as resp:
            return resp.read().decode("utf-8")
    except URLError as e:
        sys.exit(f"Error fetching {url}:\n  {e}")


def _to_utc(dt):
    if not hasattr(dt, "hour"):
        return datetime(dt.year, dt.month, dt.day, tzinfo=timezone.utc)
    return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt.astimezone(timezone.utc)


def parse_with_icalendar(text):
    cal = Calendar.from_ical(text)
    events = []
    for c in cal.walk():
        if c.name != "VEVENT":
            continue
        events.append({
            "date":        _to_utc(c.get("DTSTART").dt),
            "summary":     str(c.get("SUMMARY", "")),
            "description": str(c.get("DESCRIPTION", "")),
            "url":         str(c.get("URL", "")),
        })
    return events


def parse_raw(text):
    events = []
    for block in text.split("BEGIN:VEVENT")[1:]:
        def get(key):
            # Collect first line + any folded continuation lines (start with space/tab)
            m = re.search(rf"^{re.escape(key)}[^:]*:(.+(?:\n[ \t].+)*)", block, re.MULTILINE)
            if not m:
                return ""
            # Unfold: join continuation lines, strip leading whitespace
            raw = re.sub(r"\n[ \t]", "", m.group(1))
            return raw.strip()
        raw = get("DTSTART")
        if not raw:
            continue
        utc = raw.endswith("Z")
        raw = raw.rstrip("Z")
        try:
            dt = datetime(int(raw[0:4]), int(raw[4:6]), int(raw[6:8]),
                          int(raw[9:11]) if len(raw) > 8 else 0,
                          int(raw[11:13]) if len(raw) > 10 else 0,
                          tzinfo=timezone.utc if utc else None)
            if not utc:
                dt = dt.replace(tzinfo=timezone.utc)
        except (ValueError, IndexError):
            continue
        events.append({"date": dt, "summary": get("SUMMARY"), "description": get("DESCRIPTION"), "url": get("URL")})
    return events


def parse_ics(text):
    return parse_with_icalendar(text) if USE_ICALENDAR else parse_raw(text)


# ── convert to JS object shape ────────────────────────────────────────────────

def to_js_obj(ev, seminar_url):
    d = ev["date"]

    # SUMMARY is "Speaker Name (University)" or "Speaker Name"
    summary = ev["summary"]
    m = re.match(r"^(.+?)\s*\((.+?)\)\s*$", summary)
    if m:
        speaker, university = m.group(1).strip(), m.group(2).strip()
    else:
        speaker, university = summary.strip(), ""

    # Title is in DESCRIPTION after "Title: <a href="...">...</a>"
    desc = ev.get("description", "")
    title_m = re.search(r"Title:\s*<a[^>]*>([^<]+)</a>", desc)
    title = title_m.group(1).strip() if title_m else ""

    return {
        "day":          str(d.day).zfill(2),
        "month":        MONTHS[d.month - 1],
        "year":         str(d.year),
        "title":        title or "(TBA)",
        "speaker":      speaker,
        "university":   university,
        "website_href": ev["url"] or seminar_url,
    }


def js_array(var_name, items, seminar_url):
    if not items:
        return f"window.{var_name} = [];\n"
    lines = [f"window.{var_name} = ["]
    for ev in items:
        obj = to_js_obj(ev, seminar_url)
        lines.append("  {")
        lines.append(f"    day:        {json.dumps(obj['day'])},")
        lines.append(f"    month:      {json.dumps(obj['month'])},")
        lines.append(f"    year:       {json.dumps(obj['year'])},")
        lines.append(f"    title:      {json.dumps(obj['title'])},")
        lines.append(f"    speaker:    {json.dumps(obj['speaker'])},")
        lines.append(f"    university: {json.dumps(obj['university'])},")
        lines.append(f"    website:    {{ href: {json.dumps(obj['website_href'])}, label: \"researchseminars.org\" }},")
        lines.append("  },")
    lines.append("];\n")
    return "\n".join(lines)


def file_content(var_name, seminar_id, flag, items, seminar_url):
    header = (
        f"// {var_name.lower().replace('_', '-')}.js\n"
        f"// AUTO-GENERATED — do not edit by hand.\n"
        f"// Re-run: python fetch_seminars.py --seminar {seminar_id} {flag} <this file>\n\n"
    )
    return header + js_array(var_name, items, seminar_url)


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--seminar", default="AnJunSem")
    ap.add_argument("--academic-year", default=None, type=int,
                    help="Type 2026 for a.y. 2026/2027")
    ap.add_argument("--output-upcoming", default=None)
    ap.add_argument("--output-past",     default=None)
    args = ap.parse_args()

    print(f"Fetching ICS for '{args.seminar}'…", file=sys.stderr)
    events = parse_ics(fetch_ics(args.seminar))
    if not events:
        sys.exit("No events found.")

    seminar_url = f"https://researchseminars.org/seminar/{args.seminar}"
    now = datetime.now(tz=timezone.utc)

    if args.academic_year:
        start_ay = datetime(args.academic_year, 9, 1, tzinfo=timezone.utc)
        end_ay = datetime(args.academic_year + 1, 9, 1, tzinfo=timezone.utc)
        events = [e for e in events if start_ay <= e["date"] < end_ay]
    else:
        args.academic_year = now.year if now.month >= 9 else now.year - 1

    upcoming = sorted([e for e in events if e["date"] >= now], key=lambda e: e["date"])
    past     = sorted([e for e in events if e["date"] <  now], key=lambda e: e["date"], reverse=True)
    print(f"  {len(upcoming)} upcoming, {len(past)} past.", file=sys.stderr)

    upcoming_js = file_content("UPCOMING_AJS_SEMINARS", args.seminar, "--output-upcoming", upcoming, seminar_url)
    past_js     = file_content("PAST_AJS_SEMINARS",     args.seminar, "--output-past",     past,     seminar_url)

    if args.output_upcoming:
        open(args.output_upcoming, "w", encoding="utf-8").write(upcoming_js)
        print(f"Written upcoming → {args.output_upcoming}", file=sys.stderr)
    else:
        print(upcoming_js)

    if args.output_past:
        open(args.output_past, "w", encoding="utf-8").write(past_js)
        print(f"Written past → {args.output_past}", file=sys.stderr)
    else:
        print(past_js)


if __name__ == "__main__":
    main()
