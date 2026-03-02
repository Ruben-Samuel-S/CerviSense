
# Add Clinical Metrics to Dashboard and Enhance Reports

## Overview
Add four new clinical posture metric cards to the Dashboard in a 2x2 grid, and add four new charts to the Reports page -- all using mock data and the existing dark medical-tech design system.

---

## Dashboard Changes (`src/pages/Dashboard.tsx`)

### New Mock Data
Add constants for the four clinical metrics:
- `forwardHeadIndex = 32` (percentage)
- `avgCorrectionTime = 4.2` (seconds)
- `activeWearTime = 4.5` (hours out of 6 target)
- `weeklyImprovement = 12` (percent)
- Small sparkline data array for weekly improvement (7 data points)

### New "Clinical Metrics" Section
Insert below the Posture Trend chart card and above the "View Reports" button:

1. **Section header** -- "Clinical Metrics" label styled like existing section titles
2. **2x2 responsive grid** (`grid grid-cols-2 gap-3`) containing:

**Card 1 -- Forward Head Index (FHI)**
- Icon: `AlertTriangle` from lucide-react
- Large percentage value display
- Small description: "% of time above safe posture threshold"
- Color-coded Badge: Green (<25%), Yellow (25-50%), Red (>50%)
- Same card styling as existing cards

**Card 2 -- Avg Correction Time**
- Icon: `Clock` from lucide-react
- Value in seconds with "sec" unit
- Small description: "Time to return to neutral after alert"
- Trend arrow indicator (ArrowDown in teal = improving, ArrowUp in red = worsening)

**Card 3 -- Active Wear Time**
- Icon: `Watch` from lucide-react
- Hours display (e.g., "4.5 hrs")
- Progress bar showing progress toward 6hr daily goal (using the existing `Progress` component)
- Small text: "of 6 hr goal"

**Card 4 -- Posture Improvement**
- Icon: `TrendingUp` from lucide-react
- Percentage value colored teal (positive) or red (negative)
- "vs last week" label
- Tiny inline sparkline using Recharts `LineChart` (no axes, just the line, ~40px tall)

All four cards use the existing Card/CardContent components with `border-border/50 shadow-xl shadow-primary/5` classes and staggered `animate-fade-in` delays.

---

## Reports Page Changes (`src/pages/Reports.tsx`)

### New Mock Data Arrays
- `fhiTrendData` -- 7 daily FHI percentage values
- `correctionLatencyData` -- 7 daily avg correction times
- `complianceData` -- 7 daily wear hours
- `strainCorrelationData` -- 7 data points with `strain` and `fhi` fields

### New Charts Section
Add below the existing Weekly Report card:

1. **FHI Trend Over Time** -- Line chart (same styling as weekly report chart), dataKey `fhi`, teal stroke
2. **Correction Latency Trend** -- Line chart, dataKey `latency`, uses a yellow/amber stroke to differentiate
3. **Compliance Duration** -- Bar chart showing daily wear hours, teal bars, with a ReferenceLine at 6hrs for the goal
4. **Strain Score Correlation** -- Line chart with two lines (strain + fhi) to show correlation, using two different colors

Each chart wrapped in the same Card component with matching styles, staggered animation delays.

### Updated Stats Row
Expand the top stats grid from 3 to include additional metric: add "FHI Avg" stat card showing "32%".

---

## Files Modified
| File | Change |
|------|--------|
| `src/pages/Dashboard.tsx` | Add clinical metrics section with 4 cards in 2x2 grid, import Progress component and additional icons |
| `src/pages/Reports.tsx` | Add 4 new chart cards with mock data, update stats row, import ReferenceLine from recharts |

## No Changes To
- Design system / CSS variables
- Other pages (Login, Register, ProfileSetup)
- Routing or authentication
- Any UI component files
