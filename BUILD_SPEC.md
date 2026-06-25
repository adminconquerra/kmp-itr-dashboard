# KMP ITR Dashboard — Build Specification

## Project Overview

A Next.js 14 (App Router) dashboard for KMP Associates (The Ledger Squad) to
view their ITR client pipeline. Data is fetched from an n8n webhook that wraps
the master Excel file on OneDrive. No Microsoft auth in the dashboard layer —
n8n handles all Graph authentication.

Access to the dashboard is gated by HTTP Basic Auth at the Edge Middleware
layer.

## Stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- Edge Middleware for HTTP Basic Auth
- Recharts for visualisations
- lucide-react for icons
- date-fns for date handling
- Inter font (loaded via next/font)

## Environment Variables (.env.local)

```
# Basic Auth (for dashboard access)
AUTH_USER=<choose username>
AUTH_PASS=<choose strong password>

# Data API (n8n webhook)
DATA_API_URL=https://n8n.pracxcel.com.au/webhook/tls-dashboard-data
DATA_API_KEY=<the API key configured in n8n>

# Feature flags
USE_MOCK_DATA=true
```

---

# VISUAL DESIGN SYSTEM

## Design Philosophy

**Inspired by:** The Ledger Squad's existing brand (navy + bright blue palette)
combined with the refinement of Stripe Dashboard and the typographic precision
of Linear.

**Core principles:**

1. **Data is the hero.** Chrome should recede. Blue accents are used sparingly
   for emphasis, not decoration.
2. **Density with breath.** High information density per screen, but
   generous spacing within each element. Tight overall, breathing locally.
3. **Considered weight.** Every border, shadow, and color choice is
   deliberate. No default Tailwind shadows. No purple accents. No
   gradients except in two specific places (KPI hero, sidebar).
4. **Tabular precision.** Numbers always use tabular figures.
5. **Sharp transitions.** 150ms ease-out for everything. No springy
   animations.

## Color System

### Brand Colors (extracted from TLS website)

```css
/* Brand — Navy (anchor color, used in sidebar and emphasis) */
--navy-50:  #f0f4f8;
--navy-100: #d9e2ec;
--navy-200: #bcccdc;
--navy-300: #9fb3c8;
--navy-400: #627d98;
--navy-500: #486581;
--navy-600: #334e68;
--navy-700: #1e3a5f;   /* primary navy */
--navy-800: #14304a;
--navy-900: #0f2a47;   /* deepest navy — sidebar, large CTAs */
--navy-950: #0a1e36;

/* Brand — Cyan/Blue (accent, used for active states + key metrics) */
--blue-50:  #f0f9ff;
--blue-100: #e0f2fe;
--blue-200: #bae6fd;
--blue-300: #7dd3fc;
--blue-400: #38bdf8;
--blue-500: #1B9CD8;   /* primary brand blue (TLS extracted) */
--blue-600: #0284c7;
--blue-700: #0369a1;
--blue-800: #075985;
--blue-900: #0c4a6e;
```

### Neutral Scale (for surfaces and text)

```css
--neutral-0:   #ffffff;   /* card backgrounds */
--neutral-25:  #fcfcfd;   /* page background */
--neutral-50:  #f9fafb;   /* subtle bg, hover states on white */
--neutral-100: #f3f4f6;   /* dividers in dense lists */
--neutral-200: #e5e7eb;   /* default borders */
--neutral-300: #d1d5db;   /* strong borders, dividers */
--neutral-400: #9ca3af;   /* muted text, placeholders */
--neutral-500: #6b7280;   /* secondary text */
--neutral-600: #4b5563;   /* secondary headings */
--neutral-700: #374151;   /* primary body text */
--neutral-800: #1f2937;   /* primary headings */
--neutral-900: #111827;   /* highest emphasis text */
```

### Semantic Colors

```css
/* Success — Paid, Onboarding Complete */
--success-50:  #f0fdf4;
--success-500: #16a34a;
--success-700: #15803d;

/* Warning — FU1/FU2, mild attention */
--warning-50:  #fffbeb;
--warning-500: #d97706;
--warning-700: #b45309;

/* Danger — FU3, Lost, Overdue */
--danger-50:  #fef2f2;
--danger-500: #dc2626;
--danger-700: #b91c1c;

/* Info — Replied, Form Submitted */
--info-50:  #eff6ff;
--info-500: #2563eb;
--info-700: #1d4ed8;
```

### Application

Use blue sparingly. Most of the dashboard should read as white/neutral with
strategic use of:
- **Navy:** Sidebar background, dashboard logo area, large numbers in KPI cards
- **Blue:** Hover states on cards, active nav item indicator, primary button bg, links
- **Semantic colors:** Status badges only, no other usage

Never use blue or navy for ordinary text or borders. Borders are always
neutral-200 or neutral-300.

## Typography

### Font

Inter from Google Fonts via `next/font`. Load weights: 400, 500, 600, 700.
Apply `font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'` and `tabular-nums`
on number-heavy elements.

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

### Type Scale

| Use case | Size | Line height | Weight | Letter spacing | Notes |
|---|---|---|---|---|---|
| KPI hero number | 36px | 40px | 600 | -0.025em | tabular-nums |
| Page title (H1) | 24px | 32px | 600 | -0.015em | |
| Section heading (H2) | 18px | 28px | 600 | -0.01em | |
| Card heading (H3) | 13px | 20px | 600 | 0.05em | UPPERCASE |
| Body large | 15px | 24px | 400 | 0 | |
| Body | 14px | 20px | 400 | 0 | |
| Body small | 13px | 18px | 400 | 0 | |
| Caption | 12px | 16px | 500 | 0.02em | for metadata |
| Micro caps | 11px | 14px | 600 | 0.06em | UPPERCASE; section labels |

### TLS Brand Cue: Section Labels in CAPS

Section labels (e.g., "PIPELINE OVERVIEW", "ACTION REQUIRED", "BY REFERENCE
SOURCE") use the micro caps style — 11px, 600 weight, 0.06em letter spacing,
uppercase, neutral-500 color. This echoes their website's section treatments
without copying them.

## Spacing System

Base unit: 4px. Use Tailwind defaults.

| Token | Value | Use |
|---|---|---|
| 1 | 4px | tight inline gaps |
| 2 | 8px | small spacing inside compact components |
| 3 | 12px | between related items |
| 4 | 16px | inside cards, between form fields |
| 5 | 20px | card internal padding (default) |
| 6 | 24px | between major sections within a page |
| 8 | 32px | page padding, between distinct content areas |
| 10 | 40px | between page header and content |
| 12 | 48px | sparingly, for major separators |

## Borders & Radii

```css
--border-default: 1px solid #e5e7eb;
--border-strong:  1px solid #d1d5db;
--border-emphasis: 1px solid #1B9CD8;  /* used for focus/active states only */

--radius-sm: 4px;    /* small badges, tags */
--radius-md: 6px;    /* buttons, inputs */
--radius-lg: 8px;    /* cards (default) */
--radius-xl: 12px;   /* large feature cards */
```

No rounded-full pills except for status badges and avatars.

## Shadows

Use shadows sparingly. Most cards rely on borders, not shadows. Shadows only
appear on:

1. Hover states for clickable cards
2. Sidebar (right edge shadow)
3. Modal overlays (none in v1)

```css
/* Hover shadow on interactive cards */
--shadow-card-hover: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(15, 42, 71, 0.06);

/* Sidebar shadow (subtle right edge) */
--shadow-sidebar: 1px 0 0 rgba(0, 0, 0, 0.06);
```

## Layout

### App Shell

- **Sidebar:** Fixed left, 240px wide, full height, navy-900 background
- **Main content:** Margin-left 240px (collapses on mobile), max-w-screen-2xl,
  px-8 py-8
- **Mobile:** Sidebar becomes top bar with hamburger menu (60px tall),
  px-4 py-6 main padding

### Sidebar Anatomy

Top: 64px height containing the logo area
- Text logo: "KMP" in white, 18px, 700 weight, letter-spacing -0.02em
- Below in smaller text: "ITR DASHBOARD" in 11px micro caps, neutral-300 color

Middle: Nav items
- Each item: 40px height, 14px text, 12px horizontal padding inside a 16px
  outer padding
- Default: neutral-300 text
- Hover: white text, navy-800 bg
- Active: white text, blue-500 left border (3px), navy-800 bg
- Icon on left (16x16), 8px gap before label

Bottom: Footer area
- Small caption text: "v1.0 · Powered by Conquerra"
- Neutral-400 color, 11px

### Page Header

Every page has a header with:
- Page title (H1) on left
- Optional: action button(s) on right (none in v1)
- 32px bottom margin before content
- No bottom border

## Components

### KPICard

White card, 1px neutral-200 border, rounded-lg, p-5.

Structure (top to bottom):
1. Micro caps label (11px, neutral-500, uppercase)
2. KPI hero number (36px, navy-900, semibold, tabular-nums)
3. Optional: small trend indicator (12px, success/danger color)

Hover: border becomes neutral-300, no shadow change.

Grid:
- Desktop: 6 cards in a row, gap-4
- Tablet: 3 wide, 2 rows
- Mobile: 2 wide, 3 rows

### FunnelChart

Built with horizontal bars, not Recharts Funnel (which looks dated).

Each stage row:
- Left: stage label (14px, neutral-700, semibold)
- Center: horizontal bar with width proportional to count vs. total
- Right: count and % of previous stage (tabular-nums)

Bar styling:
- Background track: neutral-100, 8px height, rounded-full
- Fill: blue-500, smooth width transition
- The first stage (Total) is always 100% width

Stack vertically with 12px gap between rows.

### Card (generic)

White bg, 1px neutral-200 border, rounded-lg, p-5.

If interactive (links to detail):
- Cursor pointer
- Hover: border neutral-300, shadow-card-hover, translate-y -1px
- Transition: 150ms ease-out

### StatusBadge

Pill-shaped (rounded-full), inline-flex, px-2.5 py-1, 12px text, 500 weight.

Color mapping (background uses -50, text uses -700):

| Status | Background | Text |
|---|---|---|
| Campaign Sent | neutral-100 | neutral-700 |
| Replied - Awaiting Call | info-50 | info-700 |
| Form Submitted | info-50 | info-700 |
| Invoice Sent | warning-50 | warning-700 |
| FU1 Sent | warning-50 | warning-700 |
| FU2 Sent | warning-50 | warning-700 |
| FU3 Sent | danger-50 | danger-700 |
| Lost - Manual Review | danger-50 | danger-700 |
| Paid | success-50 | success-700 |
| Onboarding Sent | success-50 | success-700 |
| Onboarding Complete | success-50 | success-700 |
| default | neutral-100 | neutral-700 |

### ActionList

Card with title (H3 micro caps treatment), then up to 5 rows.

Each row:
- 48px height
- Left: client name (14px, neutral-800, medium)
- Right: days-waiting badge (12px, neutral-500, tabular-nums)
- Bottom border between rows: 1px neutral-100
- Last row: no bottom border
- Entire row is clickable, hover: neutral-50 bg

If list is empty: show "All caught up" in neutral-400, 14px, italic, py-6
centered.

If more than 5 items: "View all (N)" link at bottom in blue-600.

### DonutChart

Recharts PieChart with innerRadius 60%, outerRadius 80%.

Color palette for slices (cycled):
- blue-500
- navy-600
- blue-300
- navy-400
- blue-700
- navy-800

Center label: total count in 24px navy-900 tabular-nums, "TOTAL" label below in
micro caps neutral-500.

Legend below the chart with colored dots + label + value.

### ClientTable

White card wrapping the table. 

Filters row above table (in card padding):
- Search input on left (40% width, with search icon)
- Status dropdown (right of search)
- Reference dropdown (right of status)
- All inputs: white bg, 1px neutral-300 border, rounded-md, 36px height

Table:
- No outer border (lives inside the card)
- Header row: neutral-50 bg, 11px micro caps, neutral-500 text, 40px height,
  bottom border neutral-200
- Data rows: 56px height, bottom border neutral-100, hover bg neutral-50
- Cell padding: px-4
- Right-aligned for numeric columns (tabular-nums)
- Client name cell: name in 14px neutral-800 + email in 12px neutral-500 below

Sort indicators: small chevron next to active sort column header (blue-500).

Pagination bar below table:
- Left: "Showing X-Y of Z" in 13px neutral-500
- Right: Previous/Next buttons (secondary button style) + page number
- 56px height, neutral-50 bg, top border neutral-200

### Button

**Primary:**
- bg blue-500, white text, 14px semibold, px-4 py-2, rounded-md, 36px height
- Hover: bg blue-600
- Active: bg blue-700
- Focus: ring-2 ring-blue-500/30

**Secondary:**
- white bg, 1px neutral-300 border, neutral-700 text, otherwise same as primary
- Hover: bg neutral-50, border neutral-400

**Ghost:**
- transparent bg, neutral-600 text
- Hover: bg neutral-100, neutral-800 text

### Timeline (per-client detail page)

Vertical timeline with date dots.

Each event:
- Left column (80px): date in 12px neutral-500 tabular-nums (e.g., "Jun 19, 2026")
- Middle (16px wide vertical line in neutral-200, with a 12px circle dot at
  the event row in blue-500)
- Right: event label (14px neutral-800 semibold) + description (13px neutral-500)
- Vertical spacing: 24px between events

### Sidebar (Navigation)

Already specified in Layout section above.

### Per-Client Detail Page

Layout:
- Top: back link "← Back to dashboard" in 13px blue-600
- Header card: white bg, p-6, rounded-lg, 1px neutral-200 border
  - Left: client name (24px H1), email (14px neutral-600), mobile (14px
    neutral-600), reference (12px micro caps neutral-500 + value)
  - Right: large status badge (px-4 py-2, 14px) + Sr. No. caption above
- Below: two-column grid (60/40 split on desktop, stacks on mobile, gap-6)
  - Left column: Timeline card
  - Right column: stacked details
    - Invoice card (full invoice info)
    - Income & Reference card
    - Notes card (if notes present)
    - OneDrive links card

## Loading & Error States

### Loading

`loading.tsx` per route:
- Show skeleton placeholders for KPI cards (neutral-100 shimmer, same shape
  as real cards)
- 6 KPI skeleton cards, then a funnel skeleton, then table skeleton
- Use Tailwind's `animate-pulse`

### Error

`error.tsx` per route:
- Centered card with neutral-200 border
- Icon (AlertCircle from lucide-react, 32px, danger-500)
- Heading: "Unable to load data" (18px navy-900)
- Description: "There was a problem fetching the latest information. This is
  usually temporary." (14px neutral-600)
- Retry button (primary)

### Empty States

For action lists with zero items: "All caught up" in italic neutral-400,
center-aligned with py-6.

For empty client table results (filters return nothing): "No clients match
your filters" + "Clear filters" ghost button.

## Iconography

Use **lucide-react** exclusively. No other icon libraries.

Sizing:
- Sidebar nav: 16x16
- Card headers: 16x16
- Inline with text: 14x14
- KPI card accent (if used): 20x20

Stroke: 1.5 (lucide default is 2; override globally).

Color: usually neutral-500. Blue-500 only for active/emphasis.

## Responsive Breakpoints

Use Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px).

Specific breakpoint behaviors:
- < md: Sidebar becomes top bar with hamburger
- < md: KPI cards 2 wide
- < lg: KPI cards 3 wide
- ≥ lg: KPI cards 6 wide
- < md: Two-column sections stack vertically
- < md: Client table horizontally scrolls

## Microinteractions

- All transitions: 150ms ease-out
- Hover cards: translate-y -1px + shadow-card-hover
- Hover rows: background change only
- Focus states: 2px ring at 30% opacity of element color
- Click feedback: brief 50ms scale to 0.98 on buttons

---

# AUTH CONFIGURATION

HTTP Basic Authentication via Vercel Edge Middleware. Browser shows native
username/password prompt. Middleware checks credentials against `AUTH_USER`
and `AUTH_PASS` before allowing access to any page or API route.

File: `middleware.ts` at project root.

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="KMP Dashboard"' },
    });
  }

  const [scheme, encoded] = authHeader.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Invalid authentication', { status: 401 });
  }

  const decoded = atob(encoded);
  const [user, pass] = decoded.split(':');

  if (user !== process.env.AUTH_USER || pass !== process.env.AUTH_PASS) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="KMP Dashboard"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

# DATA ACCESS

The dashboard fetches client data from an n8n webhook. The dashboard does NOT
authenticate to Microsoft directly. The n8n workflow handles Graph auth and
returns pre-shaped JSON.

Response format:

```json
{
  "clients": [ { "srNo": 1, "clientName": "...", ... }, ... ],
  "count": 230,
  "fetchedAt": "2026-06-24T06:57:05.641Z"
}
```

Module: `src/lib/data.ts`

```typescript
import type { Client } from './types';
import { mockClients } from './mock-data';

export async function getClientList(): Promise<Client[]> {
  if (process.env.USE_MOCK_DATA === 'true') {
    return mockClients;
  }

  const url = process.env.DATA_API_URL!;
  const apiKey = process.env.DATA_API_KEY!;

  const response = await fetch(url, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Data API error: ${response.status}`);
  }

  const data = await response.json();
  return data.clients as Client[];
}
```

# SCHEMA

```typescript
export type Client = {
  srNo: number;
  clientName: string;
  email: string;
  mobile: string;
  reference: string;
  incomeSource: string;
  contactId: string;
  campaignSent: string | null;          // YYYY-MM-DD or null
  replied: string | null;
  autoReplySent: string | null;
  formSubmitted: string | null;
  invoiceId: string;
  invoiceCreated: string | null;
  invoiceAmount: number | null;
  fu1Sent: string | null;                // YYYY-MM-DD, "no", or null
  fu2Sent: string | null;
  fu3Sent: string | null;
  lastFollowUpDate: string | null;
  paymentReceived: string | null;        // YYYY-MM-DD, "no", or null
  onboardingFormSent: string | null;
  onboardingFormSubmitted: string | null;
  status: string;
  notes: string;
  oneDriveFolderId: string;
  oneDriveFileId: string;
};
```

Helper functions in `lib/utils.ts`:
- `isCompleted(field: string | null): boolean` — true if field is a date, false if null or "no"
- `parseDate(field: string | null): Date | null`
- `daysSince(dateString: string | null): number | null`
- `formatDate(d: string | null): string` — "Jun 19, 2026" format
- `formatCurrency(n: number | null): string` — "$1,250" or "—" if null
- `cn(...inputs: ClassValue[]): string` — Tailwind class merger (use clsx + tailwind-merge)

# PAGES

## `/` (root)

Server component. Redirects to `/dashboard`. Basic Auth middleware gates access.

## `/dashboard` (main page)

**Page header:**
- H1: "ITR Pipeline"
- Subtitle (14px neutral-500): "FY 2026 Individual Tax Returns" + last fetch
  timestamp in caption style

**Top KPI cards (6 cards in a grid):**
1. Total Clients — count of all rows
2. Campaigns Sent — count where campaignSent is a date
3. Replies — count where replied is a date
4. Forms Submitted — count where formSubmitted is a date
5. Invoices Paid — count where paymentReceived is a date (not "no" or null)
6. Onboarding Complete — count where onboardingFormSubmitted is a date

Each card: micro caps label, large navy-900 number, optional small trend.

**Pipeline funnel (full width below KPIs):**

Card with H2 title "PIPELINE OVERVIEW" (micro caps).
Horizontal bar funnel as specified in FunnelChart component.

Stages:
- Total Clients → Campaigns Sent → Replies → Forms Submitted → Invoices Sent → Paid → Onboarding Complete

**Two columns below funnel:**

Left column (60%): "ACTION REQUIRED" card containing three sub-lists:
1. Awaiting Jimit's call (replied present, formSubmitted null)
2. Payment overdue (invoiceCreated > 9 days ago AND paymentReceived is "no" or null)
3. Onboarding form pending (paymentReceived is date, onboardingFormSubmitted null)

Sub-lists are stacked with H3 micro caps headers and 16px gap between.

Right column (40%): "BY REFERENCE SOURCE" card containing:
- Donut chart at top
- Table below: Reference Source | Total | Paid | Conversion %

**Client table (full width at bottom):**

H2 micro caps title "ALL CLIENTS" above the card.
Card containing the filters + table + pagination as specified in ClientTable.

## `/dashboard/clients/[id]`

Per-client detail page. URL uses `srNo` as the ID.

Layout as specified in "Per-Client Detail Page" component section.

# CRITICAL RULES

1. **No data persistence.** No database, no localStorage of client data,
   no server-side caching. Every page load fetches fresh from the API.

2. **No client data in URL params.** Use srNo for routing only.

3. **Read-only.** No mutations. The app only reads.

4. **Error boundaries.** Every async fetch needs try/catch. Show graceful
   error state, not crash.

5. **Type safety.** Use Client type throughout. No `any` except at parsing
   boundaries.

6. **Mock data toggle.** USE_MOCK_DATA=true routes through mock-data.ts.

7. **Tabular numbers.** All numeric displays use `font-variant-numeric:
   tabular-nums` (Tailwind class `tabular-nums`).

8. **No purple, no gradients (except sidebar and KPI hero numbers).**
   Stick to the defined palette.

9. **Consistent transition timing.** Everywhere: 150ms ease-out.

# FILE STRUCTURE

```
src/
  app/
    dashboard/
      layout.tsx
      page.tsx
      clients/[id]/page.tsx
      loading.tsx
      error.tsx
    layout.tsx
    page.tsx
    globals.css
  components/
    KPICard.tsx
    FunnelChart.tsx
    ClientTable.tsx
    StatusBadge.tsx
    ActionList.tsx
    Sidebar.tsx
    Timeline.tsx
    DonutChart.tsx
    Card.tsx              # Generic Card wrapper
    Button.tsx
    Skeleton.tsx          # For loading states
  lib/
    data.ts
    mock-data.ts
    types.ts
    metrics.ts
    utils.ts
middleware.ts
tailwind.config.ts        # Extended with brand color tokens
.env.local.example
README.md
```

# TAILWIND CONFIG EXTENSIONS

Extend `tailwind.config.ts` with the color tokens:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8', 100: '#d9e2ec', 200: '#bcccdc', 300: '#9fb3c8',
          400: '#627d98', 500: '#486581', 600: '#334e68', 700: '#1e3a5f',
          800: '#14304a', 900: '#0f2a47', 950: '#0a1e36',
        },
        brand: {
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
          400: '#38bdf8', 500: '#1B9CD8', 600: '#0284c7', 700: '#0369a1',
          800: '#075985', 900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',  // ease-out
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
export default config;
```

# MOCK DATA

Generate 30 realistic Client rows covering every status:
- 5 clients: only campaignSent
- 4 clients: campaignSent + replied
- 4 clients: through formSubmitted
- 4 clients: invoice created, no FU
- 3 clients: FU1 sent
- 2 clients: FU2 sent
- 2 clients: FU3 sent, lost
- 4 clients: paid, onboarding sent
- 2 clients: fully complete

Use realistic Australian names (Aniket Powar, Priya Sharma, Lachlan Murphy,
etc.), gmail/outlook email patterns, mobile starting 04, references like
"Varun Kalia", "Jimit Doshi", "Sohil Patel". Invoice amounts $99-$499.
Dates spread over last 30 days.

# BUILD TASKS (in order)

1. Update tailwind.config.ts with the color tokens and font config
2. Load Inter font in root layout
3. Set up HTTP Basic Auth middleware
4. Define types in `lib/types.ts`
5. Build `lib/utils.ts` with date/currency helpers + cn()
6. Build mock data (`lib/mock-data.ts`)
7. Build `lib/metrics.ts` with pure calculation functions
8. Build `lib/data.ts` with mock/real switching
9. Build base components: Card, Button, Skeleton, StatusBadge
10. Build Sidebar component
11. Build dashboard layout (`app/dashboard/layout.tsx`)
12. Build KPICard component
13. Build FunnelChart component
14. Build DonutChart component
15. Build ActionList component
16. Build ClientTable component (search, filters, sort, pagination)
17. Wire up main dashboard page
18. Build Timeline component
19. Wire up client detail page
20. Add loading.tsx with skeletons
21. Add error.tsx with retry
22. Polish styling and responsive behavior
23. Switch USE_MOCK_DATA to false and test against n8n webhook
24. Deploy to Vercel
25. Add production env vars
26. Smoke test

Start with task 1. Build one task at a time. After each task, stop and wait
for the user to confirm before proceeding.

# VERCEL DEPLOYMENT

- Framework: Next.js (auto-detected)
- Environment variables: copy from .env.local
- Mark AUTH_PASS and DATA_API_KEY as Sensitive
- Deployment Protection: enable for previews
- Git: only deploy from main branch
