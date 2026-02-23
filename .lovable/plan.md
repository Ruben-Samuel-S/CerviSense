

# CerviSense – Track. Analyze. Align.

A mobile-first cervical posture tracking web application with a sleek dark medical-tech aesthetic.

## Design System
- **Dark navy background** (#0F172A) with slate card surfaces (#1E293B)
- **Teal accent** (#14B8A6) for highlights, buttons, and status indicators
- Rounded cards with soft shadows, smooth fade/scale animations
- Modern clean typography with a healthcare startup feel

## Pages

### 1. Login Page
- Centered card with email/password fields and login button
- "Create Account" link to registration
- Subtle CerviSense branding at top

### 2. Register Page
- Name, email, password, and confirm password fields
- Register button with link back to login
- Form validation for matching passwords and required fields

### 3. Profile Setup Page
- Post-registration onboarding form
- Fields: Age, Gender (dropdown), Occupation, Average daily screen time, Baseline neck angle
- Save button to proceed to dashboard

### 4. Live Dashboard
- "CerviSense" header with app tagline
- **Current Neck Angle** – large prominent numeric display
- **Status Indicator** – color-coded badge (Green = Good, Yellow = Moderate, Red = Poor)
- **Health Score** – circular or prominent 0–100 gauge
- **Real-time Line Chart** – live posture angle trend (using Recharts with mock data)
- "View Reports" button navigating to reports page

### 5. Reports Page
- **Daily Report** – bar chart showing hourly posture data
- **Weekly Report** – line chart showing daily averages
- Summary stats cards: Average angle, Total poor posture duration, Strain score
- All charts use Recharts with placeholder/mock data

## Technical Notes
- All pages are frontend-only with mock/static data (no backend initially)
- Navigation via React Router between all pages
- Fully responsive, optimized for mobile viewports first
- Teal-accented dark theme applied globally via Tailwind CSS variables

