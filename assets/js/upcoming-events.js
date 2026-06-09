// upcoming-events.js
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

window.UPCOMING_EVENTS = [
  {
    day: "12",
    month: "JUN",
    title: "SISSA Women in Mathematics 2026",
    meta: "Friday 12/06, 14:00-17:00, SISSA, big meeting room",
    speaker: "Sara Daneri, Harini Desiraju, Giovanna Marcelli",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2026"
    },
    online: {
      label: "Join online",
      href: "https://sissa-it.zoom.us/j/81527884331?pwd=0jpWaO9hsjfnZuovnC7FanRHncba5y.1"
    },
    paragraphs: [
      "The event aims to foster discussion and reflection on the role of women in academia, with a particular focus on the challenges and barriers women still face in university environments today.",
      "Three SISSA-alumnae, Sara Daneri (GSSI), Harini Desiraju (University of Oxford), and Giovanna Marcelli (Universita di Roma Tre), will share their experiences and perspectives on these topics.",
      "The afternoon will begin with a panel discussion moderated by Marta Fornasier, mathematician and science communicator currently working at MediaLab (SISSA). This will be followed by short talks by each speaker, introducing their research fields and interests."
    ],
    flyer: {
      href: "assets/images/swim2026.pdf",
      image: "assets/images/swim2026.png",
      alt: "SISSA Women in Mathematics flyer"
    }
  }
];
