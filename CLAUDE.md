# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server (port 5000) with HMR
npm run build        # Build client (Vite) and server (esbuild) to /dist
npm start            # Run production build from /dist/index.js
```

### Database
```bash
npm run db:push      # Apply schema changes to database using drizzle-kit
```

### Type Checking
```bash
npm run check        # Run TypeScript compiler in check mode (no emit)
```

## Architecture Overview

GameVault is a full-stack TypeScript monorepo tracking users' game libraries with IGDB integration and subscription service availability.

### Project Structure
```
client/              # React SPA (Vite)
  src/
    pages/          # Route components (Library, GameDetail, Calendar, etc.)
    components/     # Reusable UI components
    hooks/          # Custom React hooks (useAuth)
    lib/            # Utilities (queryClient, authUtils)
server/             # Express API server
  index.ts          # Server initialization
  routes.ts         # API endpoint definitions
  storage.ts        # Data access layer (IStorage interface)
  igdb.ts           # IGDB API service
  subscriptionServices.ts  # Game Pass/PS+/GeForce NOW catalog matching
  hltbService.ts    # HowLongToBeat integration
shared/
  schema.ts         # Drizzle ORM schemas + Zod validation
```

### Tech Stack
- **Frontend**: React + Vite, TanStack Query (state), Wouter (routing), Radix UI + Tailwind
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect) with session-based storage
- **External APIs**: IGDB (via Twitch OAuth), HowLongToBeat, Game Pass API

## Critical Architecture Patterns

### Data Storage Pattern
The application uses an **interface-based storage layer** (`IStorage` in server/storage.ts). Currently implemented as `MemStorage` (in-memory Maps) for development. **Important**: All data is lost on server restart.

When implementing a persistent storage layer:
1. Create a new class implementing the `IStorage` interface
2. Use Drizzle ORM to interact with PostgreSQL tables defined in shared/schema.ts
3. Replace the `storage` export in server/storage.ts
4. All routes will work without modification

### Database Schema (shared/schema.ts)
- **sessions**: Express session storage (connect-pg-simple)
- **users**: Replit Auth user data (OIDC claims)
- **games**: User's game library with status tracking
  - Contains subscription flags (gamePassConsole, gamePassPC, psPlus, geforceNow)
  - Contains playtime data (mainStoryHours, completionistHours)
- **subscriptionCatalog**: Global catalog of games on subscription services

### IGDB Integration Flow
1. On startup: Fetch Twitch OAuth token (cached with expiry tracking)
2. User searches: Query IGDB API v4 with token
3. Game details: Fetch comprehensive game data (media, developers, events)
4. Token refresh: Automatic when expired (checked before each request)

Key service: `IGDBService` in server/igdb.ts
- `searchGames()`: Full-text search
- `getGameDetails()`: Complete game metadata with screenshots/videos
- `getUpcomingEvents()`, `getPastEvents()`: Gaming event data

### Subscription Service Matching
The `SubscriptionService` (server/subscriptionServices.ts) maintains catalogs and matches games:

**Update Flow** (runs on startup + every 24 hours):
1. Fetch Game Pass catalog from Microsoft APIs (two-step process)
2. Load curated PS+ and GeForce NOW lists (static data)
3. For each game in user libraries: fuzzy-match titles against catalogs
4. Update subscription flags in database

**Title Matching**: Normalizes titles (lowercase, remove punctuation) with similarity threshold

### Authentication & Sessions
- **Provider**: Replit Auth (OpenID Connect)
- **Session Store**: PostgreSQL via connect-pg-simple (7-day TTL)
- **Protected Routes**: Middleware checks `req.user.claims.sub` (user ID from OIDC)
- **Client Hook**: `useAuth()` queries `/api/auth/user`, redirects to Landing if unauthenticated

### Client-Side State Management
TanStack Query configuration (client/src/lib/queryClient.ts):
- `staleTime: Infinity` - Data never goes stale (manual invalidation only)
- No automatic refetching (disabled on window focus, interval)
- All API requests include `credentials: "include"` for session cookies

Mutation pattern:
```typescript
useMutation({
  mutationFn: async (data) => apiRequest("POST", "/api/games", data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/games'] })
})
```

## Environment Variables

Required for development/production:
```bash
DATABASE_URL=postgresql://...          # Neon PostgreSQL connection string
TWITCH_CLIENT_ID=...                   # For IGDB API access
TWITCH_CLIENT_SECRET=...               # For IGDB API access
SESSION_SECRET=...                     # Express session encryption key
REPL_ID=...                           # Replit deployment ID
PORT=5000                             # Server port (default, required on Replit)
NODE_ENV=development|production       # Environment mode
```

Optional:
```bash
ISSUER_URL=https://replit.com/oidc    # OpenID Connect provider (defaults to Replit)
```

## Server Startup Sequence

1. Express app created with JSON parsing and request logging middleware
2. Routes registered (auth, games, events)
3. Global error handler attached
4. Vite dev middleware (development) OR static file serving (production)
5. Server listens on PORT (5000)
6. **Subscription data update triggered** (`subscriptionService.updateSubscriptionData()`)
7. 24-hour interval timer set for catalog refresh

## Key Development Patterns

### Adding a New API Route
1. Define route in `server/routes.ts`
2. Add `isAuthenticated` middleware if protected
3. Use `storage.*` methods for data access
4. Return JSON responses (automatic error handling via middleware)

### Adding a New Game Field
1. Update `games` table schema in `shared/schema.ts`
2. Run `npm run db:push` to apply migration
3. Update TypeScript types (auto-inferred from schema)
4. Update `MemStorage` implementation if needed
5. Client types automatically inherit from shared schema

### Client Routing (Wouter)
Routes defined in `client/src/App.tsx`:
- `/`: Library (main game grid)
- `/game/:igdbId`: Game detail page
- `/upcoming`: Games with future release dates
- `/calendar`: Events + wishlist releases
- `/event/:eventId`: Event detail page
- `/search`: Search results page

### Type Safety
- Drizzle ORM generates TypeScript types from schema (`$inferSelect`, `$inferInsert`)
- Zod schemas validate API inputs (`insertGameSchema`)
- Shared types via `@shared` path alias
- Client uses `@` alias for `client/src`

## Important Notes

### Current Storage Limitation
**MemStorage is in-memory only**. All user data (games, users) is lost on server restart. For production:
- Implement `SQLStorage` class with Drizzle ORM queries
- Use existing schema in shared/schema.ts
- Swap implementation in server/storage.ts

### Port Requirements
Server **must** run on port 5000 on Replit (other ports are firewalled). This is enforced in server/index.ts.

### IGDB API Limits
Twitch OAuth tokens expire (tracked in IGDBService). The service automatically refreshes when needed. Rate limits apply to IGDB API requests.

### Subscription Catalog Updates
Runs automatically every 24 hours. Can be manually triggered by restarting the server. Title matching uses fuzzy comparison due to naming inconsistencies between IGDB and service catalogs.
