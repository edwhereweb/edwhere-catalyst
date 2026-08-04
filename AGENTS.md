# Edwhere Mobile — Agent Reference (Includes Placement App Module)

## Project Overview

Student-facing mobile app for the Edwhere LMS platform. Built with React Native (Expo SDK 52), targeting iOS and Android. No instructor module — focused entirely on learning consumption (discovering courses, watching lessons, completing quizzes) and **Career Placement** (an access-controlled module for authorized students to view job listings, apply for roles, and track application statuses).

## Tech Stack

- **Framework**: React Native 0.76, Expo SDK 52, Expo Router v4 (file-based routing)
- **Language**: TypeScript (strict mode, `@/*` path alias → `src/*`)
- **State**: Redux Toolkit + RTK Query — no Zustand, no MobX
- **Auth**: Clerk (`@clerk/clerk-expo`) with `expo-secure-store` token cache
- **Styling**: React Native StyleSheet with centralized theme tokens — **no NativeWind, no Tamagui**
- **i18n**: i18next + react-i18next (en, hi)
- **Fonts**: Poppins (headings), Open Sans (body), Inter (UI) — loaded via expo-font

## Design System

### Color Tokens (35 per theme)

All colors live in `src/theme/themes.ts` and are consumed via `useTheme().theme.colors.*`. Never use hardcoded hex values in components.

**Core** (shadcn/ui-style): `background`, `foreground`, `card`, `cardForeground`, `popover`, `popoverForeground`, `primary` (#f70a09), `primaryForeground`, `secondary`, `secondaryForeground`, `muted`, `mutedForeground`, `accent`, `accentForeground`, `destructive`, `destructiveForeground`, `border`, `input`, `ring`

**Semantic**: `success` / `successForeground` / `successLight`, `warning` / `warningForeground` / `warningLight`, `info` / `infoForeground` / `infoLight`

**Gamification**: `xp` / `xpLight` (violet), `streak` / `streakLight` (orange), `badge` / `badgeLight` (cyan)

### Typography (8 variants)

Defined in `src/theme/tokens.ts`. Access via `theme.typography[variant]`.

| Variant | Font | Size/Line | Weight |
|---------|------|-----------|--------|
| h1 | Poppins-Bold | 32/40 | 700 |
| h2 | Poppins-Bold | 24/32 | 700 |
| h3 | Poppins-SemiBold | 20/28 | 600 |
| h4 | Poppins-SemiBold | 18/26 | 600 |
| body | OpenSans-Regular | 16/24 | 400 |
| small | OpenSans-Regular | 14/20 | 400 |
| label | Inter-Medium | 12/16 | 500 |
| button | Inter-SemiBold | 14/20 | 600 |

### Spacing (4px base)

`xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `2xl: 48`, `3xl: 64`

### Border Radius

`sm: 4`, `md: 6`, `lg: 8` (buttons/inputs), `xl: 12` (cards), `full: 9999` (pills/avatars)

### Shadows

`none`, `sm` (elev 2), `md` (elev 4), `lg` (elev 8), `card` (elev 3)

## Component Inventory

All components are in `src/components/` and consume theme tokens exclusively via `useTheme()`.

### Primitives (`src/components/ui/`)

| Component | Purpose | Variants |
|-----------|---------|----------|
| `Text` | Semantic typography | h1, h2, h3, h4, body, small, label, button |
| `Button` | Primary CTA with loading | primary, secondary, outline, destructive, ghost |
| `Input` | Text field with label/error | default (uses focus ring + error state) |
| `Card` | Elevated container | default (xl radius, card shadow) |
| `Screen` | SafeArea wrapper | scroll / fixed mode, padded option |
| `Badge` | Status chip (pill shape) | default, success, warning, destructive, info |

*(Note: Standard primitives like ProgressBar, Avatar, IconButton, and Skeleton remain unchanged and should be reused for the Placement App).*

### Feedback (`src/components/feedback/`)

| Component | Purpose |
|-----------|---------|
| `LoadingView` | Centered spinner + optional message |
| `ErrorState` | Error message + retry button |
| `EmptyState` | Empty message + optional action |
| `RestrictedAccessView` | **[NEW]** Fallback UI for users without Placement access |

### Domain (`src/components/course/`, `src/components/profile/`)
*(Existing LMS components remain unchanged)*

### Placement App (`src/components/placement/`) **[NEW]**

| Component | Purpose |
|-----------|---------|
| `JobCard` | Displays job title, company, salary, and tags |
| `CompanyHeader` | Company logo and profile overview |
| `ApplicationStatusBadge` | Custom badge showing applied/shortlisted/rejected status |
| `PlacementAccessGate` | HOC or Wrapper to protect placement-specific views |

## Folder Structure
app/                          # Expo Router file-based routes
├── (auth)/                   # Sign in, sign up
├── (protected)/(tabs)/       # Bottom tab screens (home, catalog, my-courses, profile)
├── (protected)/placement/    # [NEW] Placement App Module
│   ├── index.tsx             # Job listings dashboard
│   ├── [jobId].tsx           # Job details and application screen
│   └── applications.tsx      # User's job application tracking
├── (protected)/course/[courseId]/
├── (protected)/batches/
src/
├── components/
│   ├── ui/                   # Primitives (Text, Button, Input, Card, etc.)
│   ├── feedback/             # LoadingView, ErrorState, EmptyState, RestrictedAccessView
│   ├── course/               # LMS Course components
│   └── placement/            # [NEW] Placement specific UI components
├── theme/                    # tokens.ts, themes.ts, ThemeProvider
├── store/                    # Redux store
│   └── api/                  # Contains courseApi.ts and [NEW] placementApi.ts
├── services/                 # Auth (Clerk), storage, device
├── types/                    # Course, UserProfile, and [NEW] Placement types

## Architecture Rules

1. **Dependencies flow downward**: UI → Feature → State → Service → Infrastructure. No circular imports.
2. **Theme tokens only**: Never hardcode colors, font sizes, font families, spacing, or radii. Always use `useTheme()`. **This strictly applies to the new Placement designs as well.**
3. **RTK Query for data**: All API calls go through RTK Query slices in `src/store/api/` (e.g., `placementApi.ts`). Use cache tags for invalidation.
4. **Clerk for auth**: Token injection happens automatically via `tokenAccessor`.
5. **File size limit**: No file exceeds 500 lines. Split into modules if approaching the limit.
6. **Component pattern**: Every UI component accepts a `style` override prop, uses `useTheme()`, and supports dark mode automatically.
7. **Access Control [NEW]**: The Placement App module must not be universally accessible. All routes under `app/(protected)/placement/` and any placement entry points (buttons/tabs) must be protected by a user-specific access flag (e.g., `hasPlacementAccess`) fetched via Clerk metadata or RTK Query.
