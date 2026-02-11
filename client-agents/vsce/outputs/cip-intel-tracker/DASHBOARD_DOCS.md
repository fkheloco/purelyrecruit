# Dashboard Component Documentation

## File Location
`/sessions/keen-sleepy-shannon/cip-intel-tracker/src/app/page.tsx`

## Overview
A "use client" React component that displays a comprehensive dashboard for the CIP Intel Tracker application. Built with Next.js 15, TypeScript, and Tailwind CSS v4 dark theme.

## Components & Sections

### 1. Header
- Displays "Dashboard" title
- Shows current date in long format (e.g., "Monday, February 10, 2026")
- Bordered top section with consistent styling

### 2. Stats Row (4 Cards)
Four responsive stat cards displaying:
- **Total Projects**: Count of all active pipeline projects (indigo icon)
- **Unprocessed News**: Count of news items pending AI processing
  - Warning styling (orange border/text) when > 0
  - Green checkmark when all processed
- **Active Agencies**: Count of monitored agencies (purple icon)
- **Upcoming Deadlines**: Count of projects with RFP deadlines in next 90 days (cyan icon)

Each card has:
- Icon with appropriate lucide-react icon
- Large count number
- Descriptive subtitle
- Hover state with border color change

### 3. Pipeline Overview
Horizontal bar chart visualization showing project distribution across 9 active pipeline stages:
1. CIP Identified (#6366f1 - indigo)
2. Monitoring (#8b5cf6 - purple)
3. Pre-Sell (#a855f7 - purple-alt)
4. Pre-Solicitation (#d946ef - pink)
5. Solicitation (#ec4899 - pink-alt)
6. Wheelhouse Review (#f97316 - orange)
7. Go/No-Go (#eab308 - yellow)
8. Proposal Dev (#22c55e - green)
9. Submitted (#14b8a6 - teal)

Features:
- Height represents project count (responsive scaling)
- Count displays on hover
- Stage label and count shown below each bar
- Smooth hover animations

### 4. Territory Breakdown
Three cards showing project counts by territory:
- Southern California (red #ef4444)
- Northern California (amber #f59e0b)
- Pacific Northwest (blue #3b82f6)

Each with:
- Color dot indicator
- Territory name
- Project count
- "projects" label

### 5. Recent News
Display of last 5 unarchived news items with:
- News title
- Agency short name
- Time-relative stamp ("2h ago", "1d ago", etc.)
- Relevance score badge (color-coded):
  - 85+: Green (high relevance)
  - 70-84: Yellow (medium-high)
  - 50-69: Orange (medium)
  - <50: Gray (low)
- Hover state with subtle background change
- Fallback message if no news available

### 6. Upcoming RFP Deadlines
Table of projects with approaching deadlines (next 90 days), showing:
- Project name
- Agency short name
- Deadline date (formatted)
- Days remaining (color-coded):
  - Red if ≤ 7 days
  - Yellow if ≤ 30 days
  - Green if > 30 days
- Pipeline stage (color-tagged badge)
- Pagination indicator if > 8 deadlines

## Styling Features

### Dark Theme Colors
- Background: `#0a0a0f` (darkest)
- Cards: `#111119` (dark)
- Accents: `#13131d`, `#1a1a25` (lighter)
- Borders: `#2a2a3a`
- Primary text: `#e8e8f0`
- Secondary text: `#9898ac`
- Tertiary text: `#6b6b80`

### Accent Colors
- Indigo: `#6366f1` / `#4f46e5`
- Purple: `#8b5cf6` / `#7c3aed`
- Pink: `#ec4899`
- Orange: `#f97316`
- Green: `#22c55e`
- Teal: `#14b8a6`

### Responsive Design
- Stats row: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- Territory cards: 1 column (mobile), 3 columns (desktop)
- Pipeline bar: Responsive with wrapping stage labels
- Table: Horizontal scroll on mobile
- Max-width container: `7xl` (80rem)

## Data Source

Fetches data from `@/lib/store`:
- `getDashboardStats()`: Main stats aggregation
- `getNewsItems()`: Recent news items with filters
- `getAgency()`: Agency details for news items

Uses types from `@/lib/types`:
- `DashboardStats`
- `NewsItem`
- `CIPProject`
- `PipelineStage`
- `Territory`

## Icons Used

From `lucide-react`:
- Activity (Total Projects)
- Newspaper (Unprocessed News, Recent News header)
- Building2 (Active Agencies)
- Clock (Upcoming Deadlines)
- TrendingUp (Pipeline Overview header)
- AlertCircle (Warning for unprocessed news)
- ArrowRight (Pagination indicator)

## Performance Considerations

- Uses `useEffect` to fetch data on component mount
- State management for stats, news items, and loading state
- Conditional rendering for empty states
- Loads limited news items (5) and deadline rows (8) for performance
- Uses `cn()` utility for conditional class names

## Accessibility

- Semantic HTML with proper heading hierarchy
- Alt text for icons through labeled sections
- Color contrast meets WCAG standards on dark theme
- Keyboard-navigable table structure
- Loading and error states communicated to users

## Future Enhancements

- Real-time data updates with polling
- Drill-down navigation to detailed views
- Export dashboard as PDF
- Custom date range filtering
- Save custom dashboard layouts
- Performance metric tracking
