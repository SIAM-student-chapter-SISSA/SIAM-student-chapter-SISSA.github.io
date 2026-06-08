#!/usr/bin/env python3
"""
fetch_seminars.py
-----------------
Fetches the AnJunSem calendar from researchseminars.org and writes two JS
files whose objects match the shape used in upcoming-seminars.js exactly:

  { day, month, title, meta, website }

Usage:
  python fetch_seminars.py
  python fetch_seminars.py --seminar AnJunSem
  python fetch_seminars.py --seminar AnJunSem \\
      --output-upcoming assets/js/upcoming-ajs-seminars.js \\
      --output-past     assets/js/past-ajs-seminars.js
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

DAYS   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
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
            "date":    _to_utc(c.get("DTSTART").dt),
            "summary": str(c.get("SUMMARY", "")),
            "url":     str(c.get("URL", "")),
        })
    return events


def parse_raw(text):
    events = []
    for block in text.split("BEGIN:VEVENT")[1:]:
        def get(key):
            m = re.search(rf"^{re.escape(key)}[^:]*:(.+)", block, re.MULTILINE)
            return m.group(1).strip() if m else ""
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
        events.append({"date": dt, "summary": get("SUMMARY"), "url": get("URL")})
    return events


def parse_ics(text):
    return parse_with_icalendar(text) if USE_ICALENDAR else parse_raw(text)


# ── convert to JS object shape ────────────────────────────────────────────────

def to_js_item(ev, seminar_url):
    d = ev["date"]
    summary = ev["summary"]

    # split "Speaker: Title" or keep as title only
    idx = summary.find(": ")
    if 0 < idx < 60:
        speaker, title = summary[:idx].strip(), summary[idx + 2:].strip()
    else:
        speaker, title = "", summary.strip()

    day_name = DAYS[d.weekday()]
    hh = d.strftime("%H")
    mm = d.strftime("%M")
    meta = f"{day_name} {d.day:02d}/{d.month:02d}/{d.year}, {hh}:{mm} UTC"
    if speaker:
        meta += f" \u2014 {speaker}"

    return {
        "day":   str(d.day).zfill(2),
        "month": MONTHS[d.month - 1],
        "title": title or "(TBA)",
        "meta":  meta,
        "website_href": ev["url"] or seminar_url,
    }


def js_array(var_name, items, seminar_url):
    if not items:
        return f"window.{var_name} = [];\n"
    lines = [f"window.{var_name} = ["]
    for ev in items:
        obj = to_js_item(ev, seminar_url)
        lines.append("  {")
        lines.append(f"    day: {json.dumps(obj['day'])},")
        lines.append(f"    month: {json.dumps(obj['month'])},")
        lines.append(f"    title: {json.dumps(obj['title'])},")
        lines.append(f"    meta: {json.dumps(obj['meta'])},")
        lines.append(f"    website: {{ href: {json.dumps(obj['website_href'])}, label: \"researchseminars.org\" }},")
        lines.append("  },")
    lines.append("];\n")
    return "\n".join(lines)


def file_header(var_name, seminar_id, flag):
    return (
        f"// {var_name.lower().replace('_', '-')}.js\n"
        f"// AUTO-GENERATED — do not edit by hand.\n"
        f"// Re-run: python fetch_seminars.py --seminar {seminar_id} {flag} <this file>\n\n"
    )


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--seminar", default="AnJunSem")
    ap.add_argument("--output-upcoming", default=None,
                    help="Write upcoming array to this file (default: stdout)")
    ap.add_argument("--output-past", default=None,
                    help="Write past array to this file (default: stdout)")
    args = ap.parse_args()

    print(f"Fetching ICS for '{args.seminar}'…", file=sys.stderr)
    events = parse_ics(fetch_ics(args.seminar))
    if not events:
        sys.exit("No events found.")

    seminar_url = f"https://researchseminars.org/seminar/{args.seminar}"
    now = datetime.now(tz=timezone.utc)

    upcoming = sorted([e for e in events if e["date"] >= now], key=lambda e: e["date"])
    past     = sorted([e for e in events if e["date"] <  now], key=lambda e: e["date"], reverse=True)
    print(f"  {len(upcoming)} upcoming, {len(past)} past.", file=sys.stderr)

    upcoming_js = (file_header("UPCOMING_AJS_SEMINARS", args.seminar, "--output-upcoming")
                   + js_array("UPCOMING_AJS_SEMINARS", upcoming, seminar_url))
    past_js     = (file_header("PAST_AJS_SEMINARS", args.seminar, "--output-past")
                   + js_array("PAST_AJS_SEMINARS", past, seminar_url))

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
