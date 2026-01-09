# Video Game Tracking Web Application

## Overview

A modern web application for tracking video games across libraries, wishlists, and custom lists, inspired by platforms like Steam and Backloggd. The platform offers a gaming-first aesthetic, allowing users to browse new and upcoming titles, manage their game library with status tracking, create custom lists, and track gaming events and subscription service availability. The project aims to provide a comprehensive and visually rich experience for managing a personal video game collection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:** React 18 with TypeScript, Vite, Wouter for routing, Tailwind CSS (with shadcn/ui components), TanStack Query for state management, and Radix UI for accessible UI primitives.

**Design System:** Custom theming with a gaming-focused color palette (vibrant purple accent, electric blue secondary), Inter and Outfit fonts, service-specific brand colors, and a responsive, mobile-first design.

**Key Features:**
- Full authentication using Replit Auth (Google, GitHub, Apple, email/password).
- Platform tracking for owned games (PS5, Xbox, PC, Switch, etc.).
- Real-time game search and detailed game pages via IGDB API.
- Game library management with status tracking (playing, completed, backlog, dropped, wishlist).
- Calendar featuring gaming events (from IGDB Events API) and wishlisted game releases.
- Multiple view types (grid cards, list views).
- Metacritic score integration and platform icon display.
- Theme toggle (dark/light mode).
- Subscription service badges for game availability.
- Universal navigation pattern: all game cards navigate to a detailed game page before adding to the library.

### Backend Architecture

**Technology Stack:** Node.js with TypeScript, Express.js for REST API, Drizzle ORM for database interactions, and esbuild for bundling.

**Core Services:**
- **IGDB Integration:** Handles Twitch OAuth for IGDB API access, token caching, rate limit compliance, and serves as a CORS proxy. Fetches comprehensive game metadata, including details, media, and gaming events.
- **Storage Layer:** Interface-based design for flexibility, currently using an in-memory implementation (`MemStorage`), designed for easy migration to a database.
- **Authentication:** Replit Auth integration for user authentication, JWT verification, and session management using `express-session` with a PostgreSQL store.

### Data Storage

**Database Technology:** PostgreSQL (via Neon serverless driver) configured with Drizzle ORM.

**Schema Design:**
- **Users:** Stores Replit Auth user data (id, email, names, profile image).
- **Sessions:** Stores session data for `connect-pg-simple`.
- **Games:** Stores user-tracked game data, including IGDB ID, name, cover URL, release date, platforms, genres, Metacritic score, summary, and user-defined status (playing, completed, backlog, dropped, wishlist). Includes subscription service flags (gamePassConsole, gamePassPC, psPlus, geforceNow) and playtime fields (mainStoryHours, completionistHours).
- Schema is type-safe with Drizzle Zod integration and supports migrations via `drizzle-kit`.

## External Dependencies

### Core Framework & Data
- **@tanstack/react-query**: Server state management.
- **react**, **react-dom**: UI framework.
- **express**: Web server.
- **wouter**: Client-side routing.
- **drizzle-orm**, **@neondatabase/serverless**: PostgreSQL ORM and driver.
- **connect-pg-simple**, **express-session**: PostgreSQL session store and middleware.

### UI & Styling
- **@radix-ui/***: Unstyled, accessible UI primitives.
- **lucide-react**, **react-icons**: Icon libraries.
- **tailwindcss**, **postcss**, **autoprefixer**: CSS framework and processing.
- **class-variance-authority**, **clsx**, **tailwind-merge**: CSS utility.

### Forms & Validation
- **react-hook-form**, **@hookform/resolvers**: Form management.
- **zod**: Schema validation.

### Development Tools
- **vite**, **@vitejs/plugin-react**: Build tooling.
- **typescript**, **tsx**, **esbuild**: Language and bundling.
- **drizzle-kit**: Database migration.

### Key Integrations & Utilities
- **cmdk**: Command menu.
- **embla-carousel-react**: Carousel.
- **date-fns**: Date manipulation.
- **nanoid**: ID generation.
- **vaul**: Drawer component.
- **react-day-picker**: Calendar/date picker.
- **howlongtobeat**: Game completion time estimates (npm package).
- **IGDB API**: Game data, events, and search.
- **catalog.gamepass.com + displaycatalog.mp.microsoft.com**: Xbox Game Pass data (two-step API: product IDs → metadata).
- **PlayStation Plus**: Curated static list of 88 popular games (no API available).
- **GeForce NOW**: Curated static list of 85 popular games (no API available).

## Recent Changes

### January 2026
- **Removed Subscription Services navigation tab**: Simplified sidebar navigation by removing the Subscription Services page.
- **Platform icons redesigned**: Platform icons now use recognizable brand logos (PlayStation, Xbox, Nintendo Switch, Steam) instead of generic gamepad icons. Uses react-icons (SiPlaystation, FaXbox, SiNintendoswitch, SiSteam).
- **Upcoming page enhancement**: Now fetches and displays games from user's library with upcoming release dates (games releasing in the future or within the last 30 days).
- **Release date refresh feature**: Added POST `/api/games/refresh-release-dates` endpoint and "Refresh Dates" button on Upcoming page to manually update release dates from IGDB for all games in the user's library.
- **Back button navigation**: All back buttons now use `window.history.back()` for proper navigation flow across pages.

### December 2025
- **Event Detail Pages**: Added individual event detail pages at `/event/:eventId`. Users can click on any event from the Calendar page to see full event artwork, title, date, description, a "Watch Recording/Livestream" button (if available), and a grid of all featured games. Each game links to its game detail page where users can add it to their library.
- **Calendar Enhancement**: Calendar now shows two sections - "Upcoming Events" and "Previous Events (Last 6 Months)". Events display featured games with clickable buttons that navigate to the game detail page where users can add games to their wishlist. Uses IGDB Events API with expanded game data including covers.
- **Search Redesign**: Search now navigates to a dedicated `/search` page with all results displayed in a grid. Header search bar shows live suggestions as you type (5 max), and pressing Enter takes you to the full results page.
- **Game Pass Fix**: Fixed false positive matching issue where all games were incorrectly showing as Game Pass. Now uses two-step API to fetch actual game titles and platform data (458 games).
- **Platform Selector**: Now dynamically shows only platforms where each game is actually available (based on IGDB data), with fallback to common platforms.
- **Subscription Services**: PS Plus and GeForce NOW now use curated static lists since external scraping is blocked.