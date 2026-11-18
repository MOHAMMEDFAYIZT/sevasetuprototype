# Seva Setu — Frontend Prototype

A high-fidelity frontend prototype for **Seva Setu**, a concept for connecting people who need local services with skilled workers in nearby communities.

> **Project status:** UI/UX prototype. This repository showcases the frontend experience and interaction design. It is not a production application and is not connected to a live backend.

## Live Demo

Explore the hosted prototype: **[sevasetuprototype.vercel.app](https://sevasetuprototype.vercel.app)**

> The live deployment is a frontend prototype and uses sample data and local demo state.

## Screenshots

| Splash Screen | Home Screen |
| --- | --- |
| ![Seva Setu splash screen](public/images/mockups/01-splash-screen.png) | ![Seva Setu home screen](public/images/mockups/02-home-screen.png) |

### Worker Selection

![Seva Setu worker selection screen](public/images/mockups/03-worker-selection.png)

## What the prototype explores

- **Onboarding experience** — splash screen, login, OTP entry, and profile setup.
- **Service discovery** — browse service categories and explore a sample worker directory.
- **Worker profiles** — view sample worker information and manage favorites.
- **Job creation flow** — configure a service request with category, schedule, location, description, and wage range.
- **Worker selection** — select workers and simulate sending job requests.
- **Job management** — explore active and past jobs, job details, and notifications.
- **Interaction design** — confirmation dialogs, cancellation and completion states, ratings, and toast feedback.
- **Responsive interface** — layouts designed for a mobile-first local-services experience.

All displayed workers and job information are sample data. Interactions are demonstrations of the intended product experience.

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS 4
- Lucide React
- Browser localStorage for prototype state

## Run locally

**Requirements:** Node.js and npm.

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

## Prototype boundary

This repository focuses on the frontend prototype. Authentication and OTP screens are visual flows; job creation, worker selection, notifications, and other actions use local demo state. There is no live authentication provider, backend API, real worker dispatch, or production data persistence.

The repository also retains standalone HTML exports and supporting design assets used during prototyping.

## About

**Seva Setu** explores a digital way to make local services easier to discover and access, while helping skilled workers connect with opportunities in their communities.

Developed by [Mohammed Fayiz T](https://github.com/MOHAMMEDFAYIZT).
