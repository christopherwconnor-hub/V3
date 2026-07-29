# StrongWeek

A polished, mobile-first React + TypeScript workout tracker built around a precise six-day training plan. StrongWeek runs entirely in the browser and stores workout logs, history, weight entries, progress photos, and theme preferences on the device.

## Features

- Monday–Saturday plan with every prescribed set, rep, time, and finisher
- Per-set weight, rep/time, and completion logging
- Previous-session awareness and progressive-overload prompts
- Automatic session volume and PR tracking
- Rest timer and cardio finisher timer
- Recovery-day checklist
- Body-weight trend chart
- On-device progress photo timeline
- Workout history, weekly completion, and streaks
- Dark/light themes
- Three selectable themes, including the pink-and-white Blush Studio theme
- Plain-text workout plan importing with saved plan selection
- Copy-and-paste workout plan creation with starting-weight recognition
- Rest-between-sets timer with 30, 60, 90, and 120-second presets
- Installable PWA with offline caching
- Responsive desktop and mobile interface

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
```

## Deploy to GitHub Pages

This starter uses a Cloudflare-compatible Next.js runtime for its hosted preview. For GitHub Pages, the simplest route is GitHub Actions:

1. Create a new GitHub repository and upload this project.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Add a static-export workflow and configure the project for static export, or deploy the project with a Next.js-compatible GitHub Pages action.

Because all user data is stored locally in the browser, no database or environment variables are required. If you prefer a one-click host with no configuration changes, the same project can be deployed directly to Cloudflare, Vercel, or Netlify.

## Privacy

StrongWeek has no accounts, analytics, or remote database. Training data and compressed progress photos remain in the current browser’s local storage. Clearing browser data also clears saved app data.

## Importing workout plans

Open **Plans & themes**, then choose a `.txt` file. Format day headings and exercises like this:

```text
Monday – Arms & Abs

Hammer Curl – 3 × 12
Cable Crunch – 3 × 15

Finish:

15–20 minutes incline treadmill
```

The importer supports Monday through Sunday, parenthetical day notes, recovery checklist items without set counts, `×` or `x` set notation, and cardio finishers. Imported schedules are stored on the current device and appear in the workout-plan selector.

You can also paste the same format directly into **Plans & themes → Paste & Build**. Starting weights are optional:

```text
Shoulder Press – 3 × 10 @ 25 lb
Cable Row – 3 × 12, 40 lb
```

When a starting weight is included, it is prefilled in every set and can still be edited during the workout.
