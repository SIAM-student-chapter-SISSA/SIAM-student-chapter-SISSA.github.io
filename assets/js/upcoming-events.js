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
  // {
  //   day: "DD",
  //   month: "MMM",
  //   title: "Event title",
  //   meta: "Day DD/MM, HH:MM-HH:MM, room",
  //   speaker: "First Last",
  //   website: {
  //     label: "Event website",
  //     href: "https://..."
  //   },
  //   online: {
  //     label: "Join online",
  //     href: "https://..."
  //   },
  //   paragraphs: [
  //     "Short description."
  //   ],
  //   flyer: {
  //     href: "assets/images/file.pdf",
  //     image: "assets/images/file.png",
  //     alt: "Flyer description"
  //   }
  // }
];
