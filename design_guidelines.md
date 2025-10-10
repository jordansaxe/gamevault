# Design Guidelines: Video Game Tracking Web App

## Design Approach
**Reference-Based**: Drawing inspiration from Steam, PlayStation Store, Backloggd, and Linear to create a modern gaming-focused tracking platform that balances rich visual content with clean organization.

**Core Principles:**
- Gaming-first aesthetic with bold game imagery
- Dark mode default with optional light mode
- Information density without clutter
- Quick access to streaming service availability

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 217 25% 8% (deep blue-black)
- **Surface**: 217 20% 12% (elevated cards)
- **Surface Elevated**: 217 18% 16% (modal/dropdown backgrounds)
- **Border**: 217 15% 25% (subtle dividers)
- **Text Primary**: 0 0% 98%
- **Text Secondary**: 217 10% 65%

### Brand Colors
- **Primary Accent**: 265 85% 58% (vibrant purple - for CTAs and highlights)
- **Secondary Accent**: 200 95% 55% (electric blue - for links and interactive elements)

### Service Tier Colors
- **PlayStation Plus**: 0 85% 60% (red)
- **Game Pass**: 142 75% 50% (green)
- **Apple Arcade**: 25 95% 55% (orange)
- **GeForce Now**: 85 70% 55% (lime green)

### Light Mode
- **Background**: 217 40% 98%
- **Surface**: 0 0% 100%
- **Text Primary**: 217 25% 12%
- **Text Secondary**: 217 15% 45%

---

## Typography

**Font Families:**
- Primary: Inter (Google Fonts) - UI text, body content
- Display: Outfit (Google Fonts) - Headings, game titles

**Hierarchy:**
- **Hero/Page Titles**: Outfit, 600 weight, 3xl-5xl
- **Section Headings**: Outfit, 600 weight, xl-2xl
- **Card Titles**: Inter, 600 weight, base-lg
- **Body Text**: Inter, 400 weight, sm-base
- **Metadata/Labels**: Inter, 500 weight, xs-sm, uppercase tracking

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-6
- Container max-width: max-w-7xl

**Grid Patterns:**
- Game cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Dashboard widgets: grid-cols-1 lg:grid-cols-3
- Event calendar: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Component Library

### Navigation
- **Top Bar**: Sticky header with logo, search bar, profile dropdown
- **Sidebar**: Collapsible navigation (Dashboard, Library, Lists, Calendar, Streaming Services)
- **Breadcrumbs**: For nested navigation in lists and game details

### Game Cards
- **Cover Art**: 3:4 aspect ratio with subtle hover lift
- **Overlay**: Gradient overlay on hover revealing quick actions (Add to List, View Details)
- **Status Badge**: Top-right corner showing playing/completed/wishlist
- **Service Icons**: Bottom row showing streaming availability
- **Metadata**: Small text showing platform icons, Metacritic score

### Dashboard Widgets
- **Stats Cards**: Large numbers with icons (Total Games, Hours Played, Completion Rate)
- **Recently Added**: Horizontal scrolling game cards
- **Upcoming Events**: Timeline-style event cards with featured game imagery
- **Streaming Highlights**: "New to Game Pass" / "Leaving PS Plus" alerts

### Lists Management
- **List Cards**: Visual preview of list contents (4-6 game covers in grid)
- **Drag Handles**: Visible on hover for reordering
- **List Header**: Title, description, game count, share button

### Gaming Events Calendar
- **Event Cards**: Large hero image, event logo, date badge
- **Announced Games Grid**: Nested game cards within event detail view
- **Quick Actions**: "Add All to Wishlist" button, individual game quick-add

### Game Detail Page
- **Hero Section**: Full-width background with game artwork (blurred), large cover art left, metadata right
- **Info Tabs**: Overview, Screenshots, Streaming Availability, Community Stats
- **Streaming Service Panel**: Dedicated section showing all service tiers with availability badges
- **Action Bar**: Sticky bottom bar with "Add to Library", "Add to List" CTAs

### Forms & Inputs
- **Search Bar**: Prominent with autocomplete dropdown showing game covers
- **Filter Chips**: Multi-select for platforms, genres, services
- **Date Pickers**: For event calendar filtering
- **Custom List Creation**: Modal with cover image upload option

### Data Displays
- **Metacritic Score**: Color-coded badge (green >75, yellow 50-74, red <50)
- **HowLongToBeat**: Icon-based display for Main Story, Completionist times
- **Platform Icons**: Small, monochrome icons for consoles/PC
- **Service Tier Badges**: Pill-shaped with service color and tier text

### Overlays
- **Modals**: Centered with backdrop blur for list creation, game quick-add
- **Sidepanels**: Right-side drawer for filters, game preview
- **Tooltips**: For service tier explanations, icon meanings

---

## Images

### Hero Image
Large hero section on Dashboard featuring rotating featured game artwork (blurred background with sharp foreground game cover). 

### Throughout App
- Game cover art: Primary visual element on all game cards
- Event banners: Full-width promotional images for gaming events
- Screenshots: Gallery view in game detail pages
- Service logos: Small branded icons for streaming services
- Console icons: Platform availability indicators

---

## Visual Polish

**Shadows:**
- Cards: shadow-lg on hover, shadow-md at rest
- Modals: shadow-2xl
- Dropdowns: shadow-xl

**Borders:**
- Subtle 1px borders on cards (border-white/10 in dark mode)
- Accent borders on active/selected states

**Transitions:**
- Smooth hover states: transition-all duration-200
- Page transitions: fade-in for content loading
- Minimal animation: Focus on polish, not distraction

**Icons:**
- Heroicons for UI elements
- Custom service/platform icons via CDN or inline SVG