# Bitnova - Crypto Trading UI (React + Vite)

A responsive, multi-language crypto exchange UI built with React, Vite, Tailwind CSS and Firebase for auth and data.

This repository provides a production-ready front-end for a trading/dashboard style web app. It includes spot and futures pages, charts (ApexCharts), real-time tickers, order book UI, authentication (Firebase), and i18n support.

## Quick facts

- Stack: React 19, Vite, Tailwind CSS, ApexCharts, Firebase, react-router-dom
- Language support: i18next (locales in `src/i18n/locales`)
- Linting: ESLint

## Getting started

Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)

Clone and install

```powershell
git clone <your-repo-url> bitnova
cd bitnova
npm install
```

Run dev server

```powershell
npm run dev
```

Open http://localhost:5173 (Vite default) to view the app.

Build for production

```powershell
npm run build
npm run preview
```

Linting

```powershell
npm run lint
```

## Environment & Firebase

This project uses Firebase (Auth, Firestore, Analytics). A minimal `src/firebase.js` is included and currently contains a Firebase config object. For production you should move credentials to environment variables instead of committing them.

Recommended steps

1. Create a Firebase project and enable Authentication (Email/Password or providers you want).
2. Create a `.env` file in the project root and add the following (example names used by the repo):

```text
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Then update `src/firebase.js` to read from `import.meta.env.VITE_FIREBASE_API_KEY` etc. (Vite exposes `VITE_` prefixed env vars automatically).

Note: The repository currently includes a config in `src/firebase.js` (for convenience/testing). Replace it with environment-based config before deploying.

## Project structure (important files)

- `index.html` — app entry
- `src/main.jsx` — React root, providers (Auth, Theme)
- `src/App.jsx` — routes and layout
- `src/firebase.js` — firebase initialization (replace with env vars)
- `src/i18n/locales/*` — translation JSON for supported languages
- `src/components/` — reusable UI components (charts, modals, forms)
- `src/pages/` — top-level pages (Home, Markets, Spot/Futures, Auth)
- `src/context/` — React context providers (Auth, Theme, Ticker)

## Features

- Multi-page React app with routing and protected routes
- Firebase authentication and Firestore wiring
- Responsive layouts and dark mode support via `ThemeContext`
- Real-time market UI: charts, order books, trade feeds
- Internationalization using `react-i18next` (locales in `src/i18n/locales`)

## Development notes

- The app uses React 19 and Vite. Hooks and context are used extensively for global state.
- Charting is powered by `apexcharts` and `react-apexcharts`.
- To add a new locale, create a folder under `src/i18n/locales` (e.g., `fr`) and add `home.json`/`about.json` translations, then register it in your i18n setup (see `src/context/i18.js`).

Security and deployment

- Remove any hard-coded API keys from source before publishing the repository.
- Recommended deployment targets: Vercel, Netlify, or static hosting with a CDN. Ensure environment variables are added in the host's settings.

## Tests

There are no automated tests included. Consider adding a small test suite with Vitest + React Testing Library for critical components like `PrivateRoute`, auth flows, and chart rendering.

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add ..."`
4. Push and open a PR

Please run `npm run lint` before opening a PR.

## Useful commands

```powershell
npm install        # install deps
npm run dev        # start dev server
npm run build      # build production bundle
npm run preview    # preview built bundle
npm run lint       # run eslint
```

## License

Add a LICENSE file if you plan to open-source this project. If it's private, keep the `private: true` in `package.json`.

---

If you'd like, I can also:

- replace the inline Firebase config with an env-based implementation and update `src/firebase.js` (safe change),
- add a short deploy guide for Vercel/Netlify, or
- generate a minimal test for `PrivateRoute`.

Tell me which you'd prefer and I'll make the change.
