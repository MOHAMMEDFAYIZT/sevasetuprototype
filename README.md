# Seva Setu — Frontend Prototype

Seva Setu is a frontend prototype exploring a way to connect people who need local services with nearby workers. The interface demonstrates customer-facing job creation and worker discovery workflows.

<sub>Status: frontend prototype with mock data. This repository is not a production platform and does not provide a live backend, real worker accounts, or real job dispatch.</sub>

## Prototype flows

- **Onboarding screens:** Splash, login, OTP verification, and profile setup interfaces.
- **Worker discovery:** Browse a sample worker directory and open worker profiles.
- **Job creation:** Configure a job with category, schedule, location, description, and wage range.
- **Worker selection:** Select workers, manage favorites, and simulate sending job requests.
- **Job management:** View job details, active and past jobs, and notification screens.
- **Interaction states:** Confirmation dialogs, cancellation and completion flows, ratings, and toast feedback.
- **Preferences:** English and Hindi interface text, with selected demo state persisted in browser storage.

## Technology

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Browser localStorage for demo persistence

## Important implementation boundary

The current prototype uses local mock data and client-side state. Actions such as creating jobs, requesting workers, and simulating worker acceptance demonstrate the intended user experience only. They do not contact real workers or create records on a production server.

Authentication screens are visual prototype flows; OTP verification is not connected to a real authentication provider.

## Run locally

### Requirements

- Node.js compatible with the Vite version in this project
- npm

### Setup

```bash
git clone https://github.com/MOHAMMEDFAYIZT/sevasetuprototype.git
cd sevasetuprototype
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

## Project direction

This prototype is an exploration of the user experience for a local-services and employment platform. A production version would require a backend, real authentication, persistent server-side data, location-aware matching, notifications, and secure job-request workflows.

---

**Developer:** [Mohammed Fayiz T](https://github.com/MOHAMMEDFAYIZT)
