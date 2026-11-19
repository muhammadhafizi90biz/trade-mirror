# TradeMirror — Trading Journal

A personal trading journal built with Next.js and Supabase, featuring trade logging, P&L tracking, and performance analytics.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.4 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 19.2.4 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase SSR Auth |
| **Data Access** | Supabase service-role client (server-only) |
| **Table Utilities** | @tanstack/react-table |
| **Linting** | ESLint + eslint-config-next |

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard
│   ├── auth/                     # Auth callback
│   ├── dashboard/                # User dashboard
│   │   ├── add-trade/            # New trade form
│   │   ├── components/           # Dashboard-specific components
│   │   ├── pnl-calendar/         # P&L calendar view
│   │   └── trades/               # Trade history with search/filter
│   ├── login/                    # Login page
│   ├── forgot-password/          # Password reset
│   ├── update-password/          # Password update
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── lib/                          # Server-side utilities
│   ├── admin/                    # Admin data fetching
│   ├── dashboard/                # Dashboard data fetching
│   └── supabase/                 # Supabase client & types
└── public/                       # Static assets
```

## Key Architecture Decisions

- **No REST API routes** — all data is fetched server-side in React Server Components using Supabase directly
- **Kuala Lumpur timezone (UTC+8)** — all date calculations use KL timezone
- **P&L Calculation** — `ticks × price_per_tick` from the `asset_settings` table
- **Per-asset tick sizing** - each asset stores `tick_size` (in price units, default `0.01`); ticks = price move / tick size. ZL uses `0.01` (e.g. `1250.50`), while MZS uses `0.5` so a 5.5 move = 11 ticks.
- **Two Supabase clients** — SSR client for auth, admin client (service role) for data queries
- **Charting** — all visualizations are hand-built with Tailwind CSS (no charting library)

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Requires a `.env.local` file with Supabase project credentials.
