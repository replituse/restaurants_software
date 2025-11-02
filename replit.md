# Restaurant POS System

## Overview

This is a comprehensive restaurant Point of Sale (POS) and management system built as a full-stack web application. The system aims to match or exceed PetPooja software in functionality, providing a complete solution for restaurant operations including billing, table management, kitchen display, inventory, staff management, reporting, and customer engagement features.

The application is designed as a single-page application (SPA) with no page reloads, featuring a professional, clean, and minimalist design approach with modern UI/UX patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Language**: React with TypeScript, following component-based architecture with strict type safety.

**UI Component System**: Utilizes shadcn/ui components (Radix UI primitives) configured in "new-york" style with a custom design system. The component configuration supports both RSC and client-side rendering patterns.

**Styling Approach**: 
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming (light/dark mode support built-in)
- Custom color palette defined in design guidelines featuring primary red (#E74C3C), secondary blue (#3498DB), and status colors
- Typography system using Inter, Poppins, and Roboto font families

**State Management**: Hybrid approach using React Context API and Redux Toolkit for complex state. TanStack Query (React Query) handles server state with custom query functions.

**Routing**: Wouter for lightweight client-side routing, supporting the SPA architecture.

**Form Handling**: React Hook Form with Hookform Resolvers for validation, using Yup schemas.

**Data Visualization**: Recharts for charts and analytics dashboards.

**Interactions & Animations**: 
- Framer Motion for smooth animations
- Custom hover/active states using elevation utilities
- Toast notifications for user feedback

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API architecture with routes prefixed under `/api`. The route registration system is modular and extensible.

**Database Layer**: 
- Uses Drizzle ORM for type-safe database operations
- Configured for PostgreSQL via Neon serverless database
- WebSocket support for real-time database connections
- Schema-first approach with type generation

**Data Storage Strategy**: Dual-mode storage implementation:
- `MemStorage`: In-memory storage for development/testing
- Database storage through Drizzle ORM for production
- Storage interface (`IStorage`) allows swapping implementations

**Session Management**: Prepared for session handling with connect-pg-simple for PostgreSQL-backed sessions.

**Development Tooling**: 
- Vite for fast development server with HMR
- Replit-specific plugins for enhanced development experience
- Custom error overlays and runtime error handling

### Application Structure

**Page Organization**: Modular page components for each major feature:
- Core Operations: Dashboard, Billing, Tables, Kitchen (KDS)
- Menu & Inventory: Menu management, Inventory, Purchase Orders, Suppliers
- Customer Management: Customers, Loyalty, Reservations, Feedback
- Staff & HR: Staff, Attendance, User Roles
- Financial: Expenses, Payment Settlement, Accounting, Invoices, Tax Reports
- Marketing: Offers, Coupons, Gift Cards, Email Templates
- Analytics: Reports, Sales Analysis, Item Performance, Kitchen Performance
- System: Settings, Multi-location, Audit Logs, Backup, Integrations

**Component Architecture**:
- Reusable UI components (AppHeader, StatCard, TableCard, MenuItemCard, etc.)
- Feature-specific components (KDSOrderCard, OrderCart, CategorySidebar)
- Sidebar navigation with hierarchical menu structure
- Responsive layout with mobile detection hooks

**Design Philosophy**:
- Three-column layout for billing (category sidebar, items grid, order cart)
- Visual layouts for table management with color-coded status
- Kitchen Display System with real-time order tracking
- Single-window application principle - no page reloads
- Material Design principles for data-heavy enterprise UI

### Data Models

**Current Schema**: Minimal starter schema with users table, designed to be extended for:
- Menu items and categories
- Orders and order items
- Tables and reservations
- Inventory items and stock tracking
- Customers and loyalty programs
- Staff and attendance records
- Financial transactions and reports

**Schema Strategy**: Uses Drizzle-Zod integration for runtime validation and type safety across the stack.

## External Dependencies

### Database & ORM
- **Neon Serverless PostgreSQL**: Cloud-hosted PostgreSQL database
- **Drizzle ORM**: Type-safe ORM with schema migrations
- **Drizzle Kit**: Schema management and migration tooling

### UI Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Navigation Menu, Popover, Select, Slider, Tabs, Toast, Tooltip, etc.
- **CMDK**: Command palette component
- **Lucide React**: Icon library

### State & Data Management
- **TanStack React Query**: Server state management with caching
- **date-fns**: Date manipulation and formatting

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety across the codebase
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS & Autoprefixer**: CSS processing
- **ESBuild**: Fast bundler for production builds

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Error handling overlay
- **@replit/vite-plugin-cartographer**: Development navigation
- **@replit/vite-plugin-dev-banner**: Development mode indicator

### Utility Libraries
- **clsx & tailwind-merge**: Conditional class name utilities
- **class-variance-authority**: Component variant management
- **nanoid**: ID generation
- **ws**: WebSocket support for database connections

### Planned Integrations
- Payment gateways (Stripe, PayTM)
- Online ordering platforms (Zomato, Swiggy)
- Analytics (Google Analytics)
- Email/SMS services for notifications