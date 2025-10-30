# Video Game Tracking Web Application

## Overview

A modern web application for tracking video games across libraries, wishlists, and custom lists. The platform draws inspiration from Steam, PlayStation Store, Backloggd, and Linear, featuring a gaming-first aesthetic with rich visual content. Users can browse new releases, upcoming titles, manage their game library, create custom lists, and track gaming events and subscription services.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

### Authentication & Platform Tracking (October 30, 2025)
- **Replit Auth Integration:** Implemented full authentication using Replit's built-in auth system
  - Google, GitHub, Apple, and email/password login support
  - Session-based authentication with PostgreSQL session store
  - Protected routes - all game operations require authentication
  - User data stored with id, email, firstName, lastName, profileImageUrl
  - Landing page for logged-out users showcasing app features
- **Platform Selection:** Added platform field to games schema and UI
  - Users can now track which platform they own each game on (PS5, Xbox, PC, Switch, etc.)
  - Platform selector on GameDetail page alongside status selector
  - Optional field - games can be added without specifying platform
- **Calendar Feature:** Renamed "Events Calendar" to "Calendar" with dual functionality
  - **Gaming Events Tab:** Fetches real gaming events from IGDB Events API
    - Displays event name, date, description, logo, networks, and game count
    - Livestream URLs for events (YouTube links)
    - Handles IGDB timestamp bug (subtracts 3600 seconds)
  - **Wishlist Releases Tab:** Shows user's wishlisted games sorted by release date
    - Displays cover art, release date, and platform selection
    - Helps users track upcoming games they're interested in
- All game data now associated with authenticated user ID instead of "default-user"

### Removed Prepopulated Data (October 2025)
- Removed all prepopulated data from New Releases, Upcoming, and Lists pages per user request
- Pages now show empty states with helpful messages and CTAs
- Dashboard and Subscription Services pages retain mock data for demonstration purposes
- **Verified IGDB IDs still in use on Dashboard and Subscription Services:**
  - Baldur's Gate 3: 119171
  - Elden Ring: 119133
  - Spider-Man 2: 214905
  - The Last of Us Part II: 26192
  - Cyberpunk 2077: 103305
  - The Witcher 3: Wild Hunt: 1942
  - Red Dead Redemption 2: 25076
  - Starfield: 174604

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and optimized production builds
- **Routing:** Wouter for lightweight client-side routing
- **Styling:** Tailwind CSS with custom design system based on shadcn/ui components
- **State Management:** TanStack Query (React Query) for server state management
- **UI Components:** Radix UI primitives wrapped in custom components for accessibility

**Design System:**
- Custom theming with dark mode as default (light mode optional)
- Gaming-focused color palette with vibrant purple primary accent (#265 85% 58%) and electric blue secondary (#200 95% 55%)
- Custom font stack: Inter for UI/body text, Outfit for headings and game titles
- Service-specific brand colors for PlayStation Plus, Game Pass, Apple Arcade, and GeForce Now
- Responsive design with mobile-first approach using Tailwind breakpoints

**Component Architecture:**
- Modular component structure in `client/src/components/`
- Reusable UI primitives in `client/src/components/ui/`
- Feature-specific components (GameCard, EventCard, ListCard, etc.)
- Page-level components in `client/src/pages/`
- Custom hooks in `client/src/hooks/`

**Key Features:**
- **Authentication:** Replit Auth with Google, GitHub, Apple, email/password login
- **Platform tracking:** Users can specify which platform they own each game on
- Real-time game search via IGDB API integration
- Command dialog interface for search with instant results
- **Comprehensive game detail pages** with full metadata, screenshots, developer info, and summary
- **Enhanced navigation flow:** Search results and library cards navigate to detail pages before adding to library
- Game library management with status tracking (playing, completed, backlog, dropped, wishlist)
- **Calendar with dual tabs:**
  - Gaming Events: IGDB Events API integration with livestream links
  - Wishlist Releases: Upcoming releases from user's wishlist
- Multiple view types: Grid cards for games, list views for releases
- Metacritic score integration with color-coded badges
- Platform icon display (PS5, Xbox, Switch, PC, Mac)
- Theme toggle between dark and light modes
- Subscription service badges for game availability (planned)
- Custom list creation and management (planned)

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js for REST API
- **Database ORM:** Drizzle ORM for type-safe database queries
- **Module System:** ES Modules (ESM)
- **Build Tool:** esbuild for server bundling

**Server Structure:**
- Entry point: `server/index.ts` with Express setup
- Route registration: `server/routes.ts` for API endpoints (prefixed with `/api`)
- Storage abstraction: `server/storage.ts` with in-memory implementation
- IGDB service: `server/igdb.ts` for game data integration
- Vite integration: `server/vite.ts` for development middleware and HMR

**Storage Layer:**
- Interface-based storage design (`IStorage`) for flexibility
- Currently implements `MemStorage` (in-memory storage using Maps)
- Designed for easy migration to database-backed storage
- CRUD operations for games and user management

**IGDB Integration:**
- Twitch OAuth authentication for IGDB API access
- Token caching and automatic refresh (~60 day lifetime)
- Rate limit compliance (4 requests/sec)
- Backend serves as CORS proxy for browser-safe API calls
- Fetches comprehensive game metadata:
  - Basic: cover art, platforms, Metacritic scores, release dates, genres
  - Extended: developers, publishers, game modes, player perspectives, themes
  - Media: screenshots (high-resolution images), video trailers
  - Story: detailed summary and storyline text
- Gaming events data from IGDB Events API:
  - Event name, description, start/end times, livestream URLs
  - Event logos, networks, and associated games
  - Timestamp correction for IGDB API bug (-3600 seconds)
- Three game endpoints: `/api/games/search` for search results, `/api/games/igdb/:id` for detailed game info, `/api/events` for gaming events

**Development Features:**
- Hot Module Replacement (HMR) via Vite in development
- Request logging with timing and response capture
- Error handling middleware with status code management
- Custom logger with timestamp formatting

### Data Storage

**Database Technology:**
- PostgreSQL as the target database (configured in drizzle.config.ts)
- Neon serverless PostgreSQL driver for scalability
- Connection via `DATABASE_URL` environment variable

**Schema Design (shared/schema.ts):**
- Users table for Replit Auth:
  - id (user's Replit Auth sub from JWT), email, firstName, lastName, profileImageUrl
  - createdAt, updatedAt timestamps
  - UpsertUser type for creating/updating users from auth claims
- Sessions table for PostgreSQL session storage (connect-pg-simple)
- Games table with IGDB integration:
  - id (UUID), userId (references users)
  - igdbId: Unique IGDB game identifier
  - name, coverUrl, releaseDate (with date coercion)
  - platforms (array), platform (single selected platform - optional)
  - genres (array)
  - metacriticScore, summary
  - status tracking (playing/completed/backlog/dropped/wishlist)
  - addedAt timestamp
- Drizzle Zod integration for runtime schema validation
- Type-safe schema inference for TypeScript
- Migration system via drizzle-kit (npm run db:push)

### Authentication & Authorization

**Implementation:**
- Replit Auth integration via `server/replitAuth.ts`
- OAuth providers: Google, GitHub, Apple, email/password
- JWT verification using JWKS from Replit's identity provider
- Session storage in PostgreSQL via connect-pg-simple
- User upsert on login (creates/updates user from auth claims)
- Protected routes via `isAuthenticated` middleware
- Auth routes:
  - `/api/login` - Initiates Replit Auth flow
  - `/api/callback` - Handles OAuth callback and session creation
  - `/api/logout` - Destroys session and clears cookies
  - `/api/auth/user` - Returns current authenticated user

**Security:**
- Session-based authentication with httpOnly cookies
- JWKS-based JWT verification
- User ID from JWT sub claim
- All game routes protected with isAuthenticated middleware
- Landing page for unauthenticated users

### Game Detail Page Feature

**Implementation (October 2025):**
- Dedicated game detail page route: `/game/:igdbId`
- Comprehensive game information display:
  - Hero background with cover image
  - Full game metadata (title, platforms, genres, release date)
  - Developer and publisher information
  - Metacritic score with color-coded badge
  - Game summary and storyline
  - Screenshot gallery with responsive grid
  - Game modes and player perspectives
  
**User Flow:**
1. Search for game via command dialog → click result → navigate to `/game/:igdbId`
2. View full game details and information
3. Select desired status (backlog, playing, completed, wishlist, dropped)
4. Click "Add to Library" → game added with selected status
5. From library/wishlist, click game card → navigate back to detail page
6. For existing library games, shows "In your library" badge and allows status updates

**API Integration:**
- GET `/api/games/igdb/:igdbId` - Fetches detailed game data from IGDB
- POST `/api/games` - Adds game to user library with selected status
- PATCH `/api/games/:id/status` - Updates existing game status
- Uses `apiRequest(method, url, data)` helper for all mutations
- TanStack Query for caching and invalidation

**Components:**
- `GameDetail.tsx` - Main detail page component
- Updated `GameSearchBar.tsx` - Navigate to detail instead of direct add
- Updated `GameCard.tsx` - Navigate to detail on click with igdbId prop (used in Library, Wishlist, Dashboard, Subscription Services)
- Updated `ReleaseGameCard.tsx` - Navigate to detail on click with igdbId prop (used in New Releases, Upcoming)
- Status selector with dropdown for all game statuses

**Universal Navigation Pattern:**
- All game cards across the application (GameCard and ReleaseGameCard) navigate to detail page when clicked
- Cards use igdbId prop for navigation; falls back to onClick handler if no igdbId provided
- Pages updated: Dashboard, Subscription Services, New Releases, Upcoming, Library, Wishlist

### Build & Deployment

**Development Mode:**
- Vite dev server with middleware mode for integrated development
- Hot Module Replacement for fast iteration
- Source maps via @jridgewell/trace-mapping
- TypeScript type checking separate from build process

**Production Build:**
- Client: Vite build output to `dist/public`
- Server: esbuild bundle to `dist/index.js`
- Static asset serving from built client
- Environment-based configuration (NODE_ENV)

**Build Commands:**
- `dev`: Development server with tsx for TypeScript execution
- `build`: Production build for both client and server
- `start`: Production server execution
- `db:push`: Database schema synchronization

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query** (v5.60.5): Server state management and caching
- **react** & **react-dom**: UI framework
- **express**: Web server framework
- **wouter**: Client-side routing
- **drizzle-orm** (v0.39.1): Type-safe database ORM
- **@neondatabase/serverless** (v0.10.4): PostgreSQL database driver

### UI Component Libraries
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives including:
  - Dialog, Dropdown Menu, Popover, Select, Tabs, Toast
  - Accordion, Alert Dialog, Avatar, Checkbox, Slider
  - Navigation Menu, Context Menu, Hover Card
  - And 20+ other component primitives
- **lucide-react**: Icon library
- **react-icons**: Additional icons (specifically `react-icons/si` for platform icons)

### Styling & Theming
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **clsx** & **tailwind-merge**: Conditional class name utilities
- **autoprefixer** & **postcss**: CSS processing

### Form Management
- **react-hook-form**: Form state management
- **@hookform/resolvers** (v3.10.0): Form validation resolvers
- **zod**: Schema validation (integrated with Drizzle)

### Development Tools
- **vite** & **@vitejs/plugin-react**: Build tooling and React integration
- **typescript**: Type safety
- **tsx**: TypeScript execution for development
- **esbuild**: Server bundling for production
- **drizzle-kit**: Database migration toolkit

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation (dev only)
- **@replit/vite-plugin-dev-banner**: Development banner (dev only)

### Additional Utilities
- **cmdk**: Command menu component
- **embla-carousel-react** (v8.6.0): Carousel functionality
- **date-fns** (v3.6.0): Date manipulation
- **nanoid**: Unique ID generation
- **vaul**: Drawer component primitive
- **react-day-picker**: Calendar/date picker
- **recharts**: Charting library (prepared for stats)
- **input-otp**: OTP input component

### Session Management
- **express-session**: Session middleware
- **connect-pg-simple** (v10.0.0): PostgreSQL session store

### Database
- PostgreSQL (via Neon serverless driver)
- Connection string required via `DATABASE_URL` environment variable
- Schema managed via Drizzle ORM with migration support