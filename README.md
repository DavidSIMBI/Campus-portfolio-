# CampusFlow — Student Workspace

CampusFlow is a responsive student-focused web application built with **HTML, CSS and vanilla JavaScript**. It helps students organise everyday academic work in one place.

## Features

- Dashboard with task, course and notes summaries
- Create, complete, search, filter and delete tasks
- Add courses and track progress
- Weekly sample study schedule
- Academic analytics for task completion and course progress
- Create and delete quick notes
- Light/dark theme toggle
- Responsive layout for desktop, tablet and mobile
- Local persistence with `localStorage` (data stays in the same browser)

## Tech stack

- HTML5
- CSS3 (Grid, Flexbox, responsive media queries)
- Vanilla JavaScript (DOM, events, array methods, localStorage)
- Lucide icons via CDN
- Google Fonts via CDN

## Run locally

No build tools or package installation are required.

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in a browser.

For a local development server, you can use the VS Code **Live Server** extension.

## Project structure

```text
campusflow-student-portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   └── .gitkeep
├── .gitignore
├── LICENSE
└── README.md
```

## Customisation

- Change the sample student name in `index.html`.
- Update the starter courses and tasks in `js/app.js`.
- Edit colours and spacing through CSS variables at the top of `css/styles.css`.
- The schedule is sample content; edit `renderSchedule()` in `js/app.js` to match your timetable.

## Data and privacy

This is a front-end demonstration project. Tasks, courses, notes and theme preference are stored locally in the browser using `localStorage`. There is no backend, user authentication, cloud sync or remote database. Do not use it to store sensitive information.

## Future improvements

- Add calendar dates and deadline reminders
- Add export/import for student data
- Add authentication and a backend API
- Add course-specific assignment tracking
- Add accessibility and automated tests

## Author

Created as a student portfolio project. Replace this section with your name, GitHub profile and contact links.

## License

MIT — see [LICENSE](LICENSE).
