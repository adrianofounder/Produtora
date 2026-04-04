# AD_LABS - Frontend Architecture

## 1. Application Architecture

To implement the new dashboard without risking the existing structures, the UI architecture will adopt a structured, highly decoupled component model within the `src/` directory.

### 1.1 File Structure Strategy
```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx         # Macro Dashboard Layout (Sidebar + Topbar)
│   │   ├── page.tsx           # Home Bento Grid Component
│   │   ├── canais/            # Management Kanban
│   │   └── ...
├── components/
│   ├── layout/                # Main architectural frames
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── page-container.tsx # Standardized padding and max-width bounds
│   ├── dashboard/             # Specific complex widgets
│   │   ├── metric-card.tsx
│   │   ├── alerts-widget.tsx
│   │   └── bento-grid.tsx
│   ├── ui/                    # Base Shadcn/Aceternity UI atoms
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   └── badge.tsx
└── lib/
    ├── utils.ts               # tailwind-merge / clsx utilities for dynamic classes
```

## 2. Layout Integration (The Shell)

### The Macro Shell (`src/app/(dashboard)/layout.tsx`)
The shell will consist of a CSS Grid layout with two main areas: `nav` and `main`. 
- The Sidebar will sit fixed on the left (responsive collapsing for smaller screens).
- The Main container will possess `flex-col`, containing the `Topbar` and the `children` rendered within the `PageContainer`.

## 3. Third-party Library Integration
- **Styling**: TailwindCSS via classes. Custom variables mapped directly into `:root` in `globals.css` according to `front-end-spec.md`.
- **Icons**: `lucide-react` is to be used exclusively to maintain clean, geometric icon sets matching the "tech/premium" vibe.
- **UI Libraries**: We will incrementally bootstrap Shadcn CLI for base components to avoid cluttering our UI codebase with unneeded boilerplate, mutating them immediately to match dark-mode specs.

## 4. State Management for UI
For Phase 3 UI work, visual state (e.g., Sidebar open/close, Modals, Tabs) will be controlled with local React `useState` and Uncontrolled Components (via Shadcn standard patterns) to avoid adding heavy global stores. For cross-page complex data in the subsequent fullstack phase, we will utilize specific fetch caches or tools; however, UI states will be isolated entirely to Client Components (`"use client"`).
