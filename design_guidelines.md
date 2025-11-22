# SmartStrawberry Farms Dashboard - Design Guidelines

## Design Approach
**System Selected:** Material Design with dashboard-specific adaptations
**Rationale:** Data-heavy agricultural monitoring interface requiring clear information hierarchy, efficient data visualization, and professional credibility for academic presentation.

## Core Design Principles
- **Clarity First:** Information density balanced with scannable layouts
- **Data Prominence:** Charts and metrics take visual priority
- **Professional Credibility:** Clean, structured interface appropriate for technical demonstration
- **Responsive Efficiency:** Mobile-optimized data views without sacrificing desktop power

---

## Typography System

**Font Family:** Inter (via Google Fonts) for UI, Roboto Mono for numerical data
- Page Title: 32px, semibold
- Section Headings: 24px, semibold
- Card Titles: 18px, medium
- Body Text: 16px, regular
- Sensor Values: 28px, bold (Roboto Mono)
- Data Labels: 14px, medium
- Footer: 14px, regular

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (rare use of 12 for major section breaks)
- Card padding: p-6
- Section spacing: mb-8
- Grid gaps: gap-6
- Container margins: mx-4 (mobile), mx-8 (desktop)

**Grid Structure:**
- Dashboard Container: max-w-7xl mx-auto
- Farm Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Sensor Metrics: grid-cols-2 md:grid-cols-4
- Main Content Area + Sidebar: lg:grid-cols-3 (2:1 ratio)

---

## Component Library

### Navigation Bar
- Full-width sticky header
- Logo/title left-aligned with farm icon
- Navigation links right-aligned (Dashboard, Farms, Analytics, Settings)
- Height: h-16
- Elevation: subtle shadow (shadow-md)

### Sensor Value Cards
- Compact cards displaying current readings
- Large numerical value (Roboto Mono, 28px) centered
- Label above (temperature, humidity, light level)
- Small icon (thermometer, droplet, sun) top-left
- Subtle border (border border-gray-200)
- Padding: p-4

### ML Prediction Card
- Prominent placement (top of dashboard or sidebar)
- Risk level badge (pill-shaped, uppercase)
- Probability percentage displayed below badge
- Timestamp of last prediction
- Icon indicating analysis status
- Padding: p-6

### Farm Status Table
- Responsive table with horizontal scroll on mobile
- 7 rows (one per farm) + header
- Columns: Farm Name, Status Indicator, Temperature, Humidity, Last Update
- Status dots: 12px circles (green/yellow/red) with subtle glow
- Alternating row backgrounds for scanability
- Sticky header on scroll

### Chart Section
- Full-width chart container
- Chart.js line graph for temperature/humidity trends
- Height: h-80 on desktop, h-64 on mobile
- Legend positioned top-right
- Grid lines subtle
- Tooltips on hover
- Card wrapper with p-6

### System Overview Card
- Markdown-style content layout
- Icons for cloud, sensors, ML components
- 3-column grid showing: Data Collection → Processing → Prediction
- Each column has icon + heading + description
- Padding: p-8

### Footer
- Full-width, minimal design
- Centered text: "Powered by Cloud Architecture & ML Simulation"
- Academic disclaimer text (smaller)
- Height: h-16
- Subtle top border

---

## Page Layout Structure

**Dashboard View:**
1. Navigation bar (sticky)
2. Hero stats bar (4 key metrics across full width: Total Farms, Active Sensors, Latest Prediction, System Status)
3. Two-column layout (desktop):
   - Left (2/3 width): Chart section → Farm status table
   - Right (1/3 width): ML Prediction card → System overview
4. Footer

**Responsive Breakpoints:**
- Mobile: Single column, stacked components
- Tablet (md:): 2-column farm cards, single column main layout
- Desktop (lg:): Full grid layouts activated

---

## Images

**Icon Usage:**
- Heroicons via CDN for UI elements (navigation, cards, status)
- Farm/agriculture icons: leaf, tractor, cloud, wifi signal
- Weather icons: sun, cloud-rain, thermometer
- Status icons: check-circle, exclamation-triangle, x-circle

**Optional Visual Elements:**
- Subtle strawberry pattern background (very low opacity) in header
- Small illustrative icons for each farm in status table (use emoji as placeholders: 🍓)

**No hero image required** - Dashboard UIs prioritize immediate data access over imagery.

---

## Accessibility & Interaction

- Status colors must include text labels (not color-only indicators)
- Chart tooltips provide full data context
- Table rows have hover states (subtle background shift)
- Cards have subtle hover elevation (shadow-lg)
- All interactive elements minimum 44px touch target
- Focus states visible for keyboard navigation

---

## Visual Hierarchy

**Priority Levels:**
1. **Critical:** Live sensor values, ML prediction risk level
2. **High:** Chart, farm status indicators
3. **Medium:** Table data, system overview
4. **Low:** Footer, timestamps

Achieve through: Size contrast, spacing, elevation (shadows), and strategic borders.