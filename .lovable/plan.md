

## Multi-Step Registration UI for CerviSense

Replace the current single-page `ProfileSetup` with a clean 3-step wizard that collects richer profile data for AI personalization, persists to `localStorage`, and shows a confirmation screen before routing to the dashboard.

### Approach

Rebuild `src/pages/ProfileSetup.tsx` as a stateful multi-step form. Keep the existing dark medical-tech theme (navy bg, slate cards, teal accent) — no new design system, no heavy animation. Reuse existing shadcn components (`Card`, `Input`, `Select`, `Slider`, `Switch`, `Button`, `Progress`, `Label`) and `lucide-react` icons.

### Step Structure

**Progress indicator** — top of card: `Step X of 3` label + thin `Progress` bar (33 / 66 / 100). Section icon + title under it.

**Step 1 — Basic Info** (User icon)
- Name (text, required)
- Age (number, 10–80, validated)
- Sex (Select: Male / Female / Prefer not to say)

**Step 2 — Body Metrics** (Activity icon)
- Height cm (number, 100–220)
- Weight kg (number, 30–150)
- Live-calculated BMI shown in a small inline readout below inputs (`weight / (height/100)²`, 1 decimal) with category label (Underweight / Normal / Overweight / Obese)

**Step 3 — Usage Pattern** (Monitor icon)
- Screen time hrs/day — `Slider` 0–16 with current value displayed
- Work type — Select: Student / Office / Mixed
- Neck pain — `Switch` (Yes/No)

### Navigation

- Back / Next buttons at card footer (Back hidden on step 1)
- Next validates current step's fields before advancing; inline error text under invalid fields
- On step 3, Next becomes "Create Profile" → validates → saves → shows confirmation

### Persistence & Confirmation

- Single `formData` state object holding all fields
- On submit: `localStorage.setItem("userProfile", JSON.stringify({...formData, bmi}))`
- Confirmation screen replaces the form: CheckCircle2 icon (teal), heading "Profile created successfully", subtext, "Go to Dashboard" button → navigates to `/dashboard`

### Files Modified

| File | Change |
|---|---|
| `src/pages/ProfileSetup.tsx` | Rewrite as 3-step wizard with progress, validation, BMI calc, localStorage save, confirmation screen |

### Out of Scope (unchanged)
- Routing in `App.tsx` (already routes `/profile-setup` → ProfileSetup → `/dashboard`)
- Login, Register, Dashboard, Reports pages
- Design tokens / Tailwind config / global CSS
- No backend, no auth changes

