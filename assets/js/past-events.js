// past-events.js
// ------------------
// Manually maintained upcoming events.
//
// Event object shape:
// {
//   day:        "DD",
//   month:      "Mon",
//   year:       "YYYY",
//   title:      "Event title",
//   speaker:    "First Last",                                        // optional
//   meta:       "Day DD/MM, HH:MM-HH:MM, room",                     // optional
//   website:    { href: "https://...", label: "Event website" },     // optional
//   online:     { href: "https://...", label: "Participate online" }, // optional
//   paragraphs: ["Short description.", "Further details."],          // optional
//   abstracts:  [                                                     // optional
//     { speaker: "Name", title: "Talk title", text: "Abstract." }
//   ],
//   flyer:      { image: "assets/...", href: "assets/...", alt: "", label: "Open flyer" }, // optional
// }

window.PAST_EVENTS = [
  {
    day: "14",
    month: "Apr",
    year: "2025",
    title: "SISSA Women in Mathematics (2025)",
    speaker: "Veronica Felli, Roberta Ghezzi, Annamaria Ortu",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2025"
    },
    },
    {
    day: "13",
    month: "May",
    year: "2024",
    title: "SISSA Women in Mathematics (2024)",
    speaker: "Valentina Beorchia, Valeria Chiadò Piat, Maria Strazullo",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2024"
    },
    },
{
    day: "22",
    month: "May",
    year: "2023",
    title: "SISSA Women in Mathematics (2023)",
    speaker: "Daniela Tonon, Sara Farinelli, Laura Meneghetti",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2023"
    },
    },
{
    day: "12",
    month: "May",
    year: "2022",
    title: "SISSA Women in Mathematics (2022)",
    speaker: "Veronica Fantini, Monica Nonino",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2023"
    },
    },
];
