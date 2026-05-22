This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


# StadiumHub — Next.js 16 Frontend

A full-featured football stadium management system with role-based access for end users, managers, and admins.

---

## Tech stack

| Concern | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v3 |
| Components | shadcn/ui (Radix primitives) |
| Icons | react-icons (Remix Icons) |
| Data fetching | TanStack Query v5 |
| HTTP client | Axios (with interceptors) |
| Global state | Zustand v5 |
| Notifications | Sonner |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Install shadcn components

Run these to generate the required UI primitives:

```bash
npx shadcn@latest init
npx shadcn@latest add button input label card badge
npx shadcn@latest add dialog alert-dialog dropdown-menu
npx shadcn@latest add select tabs separator avatar
npx shadcn@latest add tooltip popover switch checkbox
npx shadcn@latest add sonner
```

### 3. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Run development server

```bash
npm run dev
```

---

## Project structure

```
src/
├── app/
│   ├── (public)/          End-user pages (stadiums, bookings, profile)
│   ├── (manager)/         Manager pages (dashboard, slots, reservations, reports)
│   ├── (admin)/           Admin pages (stadiums, managers, users, reports)
│   ├── (auth)/            Login / Register
│   └── api/               Route handlers
├── components/
│   ├── shared/            Navbar, Sidebar, shared UI
│   ├── stadium/           StadiumCard, StadiumGrid, StadiumFilters
│   ├── slots/             SlotCard, SlotCalendar, SlotForm
│   └── booking/           BookingCard, BookingForm
├── hooks/                 TanStack Query hooks
├── services/              API service layer (axios calls)
├── store/                 Zustand stores
├── lib/                   axios.ts, queryClient.ts, utils.ts
├── types/                 All TypeScript types
├── constants/             Routes, query keys, labels
└── middleware.ts          Role-based auth guard
```

---

## Auth & roles

Roles: `user` | `manager` | `admin`

The middleware reads the JWT from a cookie (`accessToken`) and checks the `role` claim against each route prefix:

| Prefix | Allowed roles |
|---|---|
| `/admin/**` | admin |
| `/dashboard`, `/slots`, `/reservations`, `/reports` | manager, admin |
| `/profile`, `/bookings` | user, manager, admin |
| `/stadiums`, `/` | public |

On login, users are redirected to their role dashboard automatically.

---

## Extending the app

### Add a new page
1. Create `src/app/(public|manager|admin)/your-page/page.tsx`
2. Add the route to `src/constants/index.ts` → `ROUTES`
3. Add a sidebar link to `src/components/shared/Sidebar.tsx` → `NAV_ITEMS`

### Add a new service
1. Create `src/services/your.service.ts` with typed axios calls
2. Create `src/hooks/useYour.ts` with TanStack Query hooks

### Add a new type
Add to `src/types/index.ts`.