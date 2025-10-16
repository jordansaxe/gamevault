# Video Game Tracking Web Application

## Overview

A modern web application for tracking video games across libraries, wishlists, and custom lists. The platform draws inspiration from Steam, PlayStation Store, Backloggd, and Linear, featuring a gaming-first aesthetic with rich visual content. Users can browse new releases, upcoming titles, manage their game library, create custom lists, and track gaming events and subscription services.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- Game search functionality with search bar component
- Multiple view types: Grid cards for games, list views for releases
- Status tracking (playing, completed, backlog, dropped, wishlist)
- Metacritic score integration with color-coded badges
- Platform icon display (PS5, Xbox, Switch, PC, Mac)
- Subscription service badges for game availability
- Custom list creation and management
- Events calendar for gaming announcements
- Theme toggle between dark and light modes

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
- Vite integration: `server/vite.ts` for development middleware and HMR

**Storage Layer:**
- Interface-based storage design (`IStorage`) for flexibility
- Currently implements `MemStorage` (in-memory storage using Maps)
- Designed for easy migration to database-backed storage
- CRUD operations for user management (extensible for games, lists, etc.)

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
- Users table with UUID primary keys, username, and password fields
- Drizzle Zod integration for runtime schema validation
- Type-safe schema inference for TypeScript
- Migration system via drizzle-kit

**Schema Extensibility:**
- Current schema supports basic user authentication
- Designed to be extended with tables for:
  - Games catalog
  - User game libraries
  - Custom lists
  - Wishlist items
  - Game status tracking
  - Events and announcements

### Authentication & Authorization

**Current Implementation:**
- Basic user schema with username/password fields
- Storage interface includes user lookup methods
- Session management via connect-pg-simple (PostgreSQL session store)

**Security Considerations:**
- Password storage prepared (implementation pending)
- UUID-based user IDs for security
- Session-based authentication ready for implementation

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