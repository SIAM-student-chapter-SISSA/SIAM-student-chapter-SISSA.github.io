// past-events.js
// ------------------
// Manually maintained past events.
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
    day: "12",
    month: "Jun",
    year: "2026",
    title: "SISSA Women in Mathematics (2026)",
    speaker: "Sara Daneri, Harini Desiraju, Giovanna Marcelli",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2026"
    },
  },
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
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2022"
    },
  },
  {
    year: "2021",
    title: "SIAM Chapter Colloquia (2021)",
  },
  {
    year: "2021",
    title: "SISSA Women in Mathematics (2021)",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/sissa-women-mathematics-2021"
    },
  },
  {
    year: "2020",
    title: "SIAM Chapter Colloquia (2020)",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/siam-chapter-colloquia-2020"
    },
  },
  {
    year: "2019",
    title: "SIAM Chapter Colloquia (2019)",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/siam-chapter-colloquia-2019-sparse-grids-and-their-impact-hpc-and-big-data"
    },
  },
  {
    year: "2019",
    title: "Junior Math Days (2019)",
    website: {
      label: "Event website",
      href: "https://people.sissa.it/~vfantini/JMD2019/SchoolMath.html"
    },
  },
  {
    year: "2018",
    title: "SIAM Chapter Colloquia (2018)",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/siam-chapter-colloquia-2018"
    },
  },
  {
    year: "2018",
    title: "Junior Math Days (2018)",
    website: {
      label: "Event website",
      href: "https://people.sissa.it/~vfantini/JMD2018w/ScuolaMate.html"
    },
  },
  {
    year: "2017",
    title: "SIAM Chapter Colloquia (2017)",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/siam-chapter-colloquia-2017"
    },
  },
  {
    day: "12",
    month: "Sep",
    year: "2017",
    title: "A Day in Applied Mathematics: second edition (2017)",
    website: {
      label: "Event website",
      href: "https://math.sissa.it/workshop/day-applied-mathematics-second-edition"
    },
  },
  {
    day: "21",
    month: "Apr",
    year: "2016",
    title: "A Day in Applied Mathematics: first joint meeting of the PoliMi and SISSA Student Chapters of SIAM (2016)",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/workshop/day-applied-mathematics-first-joint-meeting-polimi-and-sissa-student-chapters-siam"
    },
  },
  {
    day: "09",
    month: "May",
    year: "2016",
    title: "SIAM Chapter Colloquia (2016)",
    speaker: "Guido De Philippis, Antonio Lerario",
    website: {
      label: "Event website",
      href: "https://www.math.sissa.it/seminar/siam-chapter-colloquia"
    },
  },
];
