# SmartStrawberry Farms - Cloud-Based Agriculture Dashboard

## Overview

SmartStrawberry Farms is a cloud-based IoT monitoring dashboard for smart agriculture. The application simulates a real-time monitoring system for 7 strawberry farms, tracking environmental conditions (temperature, humidity, light levels) and providing ML-based disease risk predictions. Built as an academic demonstration project, it showcases modern web development practices with a full-stack TypeScript architecture.

The system displays live sensor data, historical trends via charts, farm status indicators, and actionable ML predictions through a professional, data-focused dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: Shadcn/ui (Radix UI primitives) with custom styling. The design follows Material Design principles adapted for dashboard use, emphasizing data clarity and professional presentation. All components use the "new-york" style variant with Tailwind CSS for styling.

**State Management**: TanStack Query (React Query) for server state management with aggressive caching strategies. Queries refetch every 5 seconds to simulate real-time updates. No global client state management library is used - component state and React Query handle all state needs.

**Routing**: Wouter for lightweight client-side routing. Currently implements a single dashboard route with a catch-all 404 page.

**Data Visualization**: Chart.js for rendering time-series temperature and humidity charts. Charts are rendered on a canvas element with responsive dimensions.

**Styling System**: 
- Tailwind CSS with custom theme configuration
- CSS variables for theme colors (supporting light mode)
- Custom spacing primitives (2, 4, 6, 8 units)
- Typography uses Inter for UI text and Roboto Mono for numerical data
- Responsive grid layouts with mobile-first breakpoints

### Backend Architecture

**Runtime**: Node.js with Express framework running in ESM module mode.

**Development vs Production**: Separate entry points for dev (`index-dev.ts`) and production (`index-prod.ts`). Development mode integrates Vite middleware for HMR and serves the app through Vite's dev server. Production mode serves pre-built static assets from the `dist/public` directory.

**API Design**: RESTful JSON API with four main endpoints:
- `GET /api/sensors` - Current sensor readings (temperature, humidity, light)
- `GET /api/prediction` - Latest ML disease risk prediction
- `GET /api/farms` - Status and metrics for all 7 farms
- `GET /api/history` - Historical data points for charting

**Data Storage**: In-memory storage implementation (`MemStorage` class) that simulates a live system. No persistent database is used. Data is generated on server startup and updated every 5 seconds via `setInterval`. This approach was chosen for simplicity in an academic demonstration context.

**ML Simulation**: The prediction endpoint returns simulated ML results. A `generatePrediction()` function uses sensor thresholds to calculate risk levels (Low/Medium/High) and probability scores. No actual ML model is deployed - this is intentional for the demo scope.

**Data Generation**: Realistic sensor data is generated with random variations within acceptable ranges:
- Temperature: 18-26°C
- Humidity: 60-85%
- Light levels: 5000-15000 lux
- Farm status: healthy/warning/critical based on threshold logic

### Type Safety

**Shared Schema**: Zod schemas defined in `shared/schema.ts` provide runtime validation and TypeScript type generation. Types are exported and used across both frontend and backend to ensure API contract consistency.

**Type Flow**: 
1. Zod schemas define the contract (`sensorDataSchema`, `farmSchema`, etc.)
2. TypeScript types are inferred via `z.infer<>`
3. Frontend uses these types for API responses
4. Backend uses them for data generation and validation

### Build & Deployment Strategy

**Build Process**: 
- Frontend: Vite bundles React app into static assets in `dist/public`
- Backend: esbuild bundles Node.js server code into `dist/index.js`
- Single command builds both: `npm run build`

**Deployment Model**: 
- Designed for platforms like Replit, Netlify, or AWS
- Frontend can be deployed as static files to any CDN
- Backend can run on any Node.js hosting (AWS Lambda, EC2, containers)
- Environment variables control database connections (though not currently used)

### Development Workflow

**Development Mode**: Running `npm run dev` starts:
1. Node.js server with Express
2. Vite dev server middleware integrated into Express
3. Hot Module Replacement (HMR) for instant frontend updates
4. TypeScript compilation in watch mode
5. Replit-specific plugins for enhanced DX (cartographer, dev banner, error overlay)

**Type Checking**: TSConfig enables strict mode with path aliases (`@/` for client, `@shared/` for shared code). The `check` script runs type checking without emitting files.

## External Dependencies

### Core Runtime Dependencies

**Frontend**:
- `react` & `react-dom` - UI framework
- `@tanstack/react-query` - Server state management
- `wouter` - Routing
- `chart.js` - Data visualization

**Backend**:
- `express` - HTTP server framework
- `drizzle-orm` - ORM (configured but not actively used)
- `@neondatabase/serverless` - PostgreSQL driver (provisioned for future use)

**Shared**:
- `zod` - Runtime type validation and schema definition
- `drizzle-zod` - Integration between Drizzle ORM and Zod

### UI Component Libraries

**Radix UI**: Headless, accessible component primitives:
- Dialog, Dropdown Menu, Popover, Tooltip - for overlays
- Accordion, Tabs, Collapsible - for content organization
- Select, Checkbox, Radio Group, Switch - for form controls
- Avatar, Badge, Progress - for data display
- And 20+ more primitives

**Styling Utilities**:
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe variant styling
- `clsx` & `tailwind-merge` - Conditional class composition

### Build Tools

- `vite` - Frontend build tool and dev server
- `esbuild` - Backend bundler (production builds)
- `tsx` - TypeScript execution for development
- `typescript` - Type checking and compilation
- `@vitejs/plugin-react` - Vite React integration

### Database Infrastructure (Configured)

**Drizzle ORM Setup**: Configuration exists in `drizzle.config.ts` for PostgreSQL with Neon serverless driver. Schema file location is defined (`shared/schema.ts`), but the current implementation uses in-memory storage instead. This infrastructure is ready for future database integration.

**Migration Strategy**: Drizzle Kit is configured with output directory `./migrations`. The `db:push` script exists for schema synchronization.

### Replit Integration

Development plugins enhance the Replit environment:
- `@replit/vite-plugin-cartographer` - Code navigation
- `@replit/vite-plugin-dev-banner` - Environment indicators
- `@replit/vite-plugin-runtime-error-modal` - Error overlays

These are conditionally loaded only in development mode on Replit.

### Font Dependencies

**Google Fonts CDN**:
- Inter (weights: 400, 500, 600, 700) - Primary UI font
- Roboto Mono (weights: 400, 500, 700) - Monospaced numbers/data

Fonts are loaded via CDN in the HTML head for optimal performance.