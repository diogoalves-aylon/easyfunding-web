# Vue 3 Professional Boilerplate

This is a robust and scalable boilerplate built with Vue 3.5+, TypeScript, Pinia, internal tooling, and Tailwind CSS.

## Features

- **Vue 3.5+**: Script Setup & Composition API
- **TypeScript**: Strict typing for reliability
- **Pinia**: Global State Management (Auth, Theme)
- **Vue Router**: Protected routes and Role-Based Access Control (RBAC)
- **Tailwind CSS**: Modern styling with Dark Mode support
- **Architecture**: Modular structure (modules/core/layouts)
- **Axios**: Centralized API with Interceptors
- **Icons**: Lucide-Vue for beautiful consistent icons

## Directory Structure

```
src/
├── assets/      # Global static assets and styles
├── config/      # App configuration (menu, colors)
├── core/        # Core utilities (API interceptors)
├── layouts/     # Layout components (Main, Auth)
├── modules/     # Feature modules (Auth, Admin, Dashboard)
├── router/      # Route definitions
├── services/    # API abstractions & Mocks
├── stores/      # Pinia Stores
```

## Getting Started

### Prerequisites

- Node.js > 18
- npm or pnpm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Configuration

Modify `src/config/appConfig.ts` to change:

- App Name
- Colors
- Menu Items (Route, Label, Icon, Required Permission)

## Authentication & Roles

The app comes with a **Mock Authentication Service**.
Default credentials:

- **Admin**: `admin@example.com` / `123456`
- **Manager**: `manager@example.com` / `123456`
- **User**: `user@example.com` / `123456`

To implement real auth, update `src/services/authService.ts` to call your backend API.

---

## Mobile (Android with Capacitor)

This boilerplate includes full Android support using Capacitor with Live Reload, optimized for fast development and reuse across multiple projects.

All mobile-related configuration files are generated locally and are not versioned in the repository.

### Mobile Prerequisites

- Java JDK 21
- Android Studio
- Android SDK installed
- Android Emulator using API 34 or 35 (x86_64)

Preview APIs (e.g. API 36) are not supported.

### Initial Mobile Setup (Run Once)

After cloning the project, run:

```bash
npm install
npm run mobile:init
```

This command will automatically:

- Generate Capacitor configuration files (development and production)
- Configure Android SDK path (`android/local.properties`)
- Create the Android native project
- Create `.env` and `.env.example` if missing
- Synchronize Capacitor

### Running on Android (Live Reload)

Start the frontend in mobile mode:

```bash
npm run dev:mobile
```

In another terminal, run the Android app:

```bash
npm run cap:run:android:dev
```

The application will open in the Android emulator with live reload enabled.

### Backend (Local API)

When running a local backend (e.g. Django, NestJS):

```bash
python manage.py runserver 0.0.0.0:8000
```

The Android app will access the API using:

```
http://10.0.2.2:8000
```

Do not use `127.0.0.1` in mobile environments.

### Android Production Build

Before generating a production build:

```bash
npm run build
npm run cap:run:android
```

Open the Android project in Android Studio only for signing and publishing.
