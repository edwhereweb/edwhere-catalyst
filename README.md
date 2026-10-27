# Edwhere Catalyst

Edwhere Catalyst is the student-facing Expo app for placement opportunities.

## Requirements

- Node.js 20 or newer
- npm
- A Clerk project configured for the app
- The Edwhere LMS deployment that serves `/api/mobile/placement/*`

## Setup and run

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and set:
   - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: your Clerk publishable key.
   - `EXPO_PUBLIC_API_BASE_URL`: the LMS origin only (for example, `https://lms.example.com`, without `/api`).
3. Start Expo with `npm start`, then open the project in an iOS or Android simulator/device.
4. Sign in with an Edwhere Clerk account. A placement profile must be active in the LMS to access job listings and applications.

For native builds, use `npm run ios` or `npm run android` with the corresponding development tools installed. `npm run type-check` and `npm run lint` run the configured static checks.

## Troubleshooting

- If the app shows a Clerk configuration message, verify the publishable key in `.env` and restart Expo.
- If placement screens cannot load data, verify the API URL is the LMS origin and that the deployment exposes `/api/mobile/placement/jobs`, `/api/mobile/placement/profile`, and `/api/mobile/placement/applications`.
- A missing or inactive placement profile is reported as restricted access by the LMS; ask the institution administrator to activate it.
- If `npm ci` reports a lockfile mismatch, use `npm install` to resynchronize `package-lock.json`, then commit the lockfile with the manifest.
