# System Architecture & Technical Debt Assessment

**Status:** Phase 1 Complete (Data Collection: System)  
**Agent:** Architect (@architect)  
**Version:** 1.0  

---

## 1. Technical Stack

| Category | Technology | Version | Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.2.2 (Canary) | ⚠️ **Critical Risk**: Experimental version. Downgrade to v15 Stable recommended. |
| **Language** | TypeScript | 5.x | Strict mode enabled. Current build is stable (`tsc` pass). |
| **Runtime** | React | 19.2.4 | Using modern hooks and Concurrent features. |
| **Styling** | Tailwind CSS | 4.x | Using new `@theme` block in `globals.css`. |
| **Database/Auth** | Supabase | ^2.101.1 | Integrated via `@supabase/ssr`. RLS enabled. |
| **Components** | Radix / Shadcn | Latest | Atomic UI components following Lendária spec. |
| **Animations** | Framer Motion | 12.38.0 | Used for micro-interactions and transitions. |

---

## 2. Directory Structure (`src/`)

```text
src/
├── app/
│   ├── (auth)/            # Authentication flows (Login/Register)
│   ├── (dashboard)/       # Main application shell (Sidebar + Topbar)
│   │   ├── canais/        # [REWORK] Channel factory & Kanban
│   │   ├── laboratorio/   # [REWORK] Tide motor & axis matrix
│   │   ├── tendencias/    # [REWORK] Viral trends analysis
│   │   └── page.tsx       # [APPROVED] Cockpit Home (Bento Grid)
│   ├── api/               # Backend-as-a-Service routes
│   └── globals.css        # Design System "Lendária" source of truth
├── components/
│   ├── layout/            # Sidebar, Topbar, PageContainer
│   ├── ui/                # Base atoms (Button, Badge, Input)
│   └── dashboard/         # Shared widgets (Metric Cards, Alerts)
├── lib/
│   ├── supabase/          # Client/Server initialization
│   └── utils.ts           # tailwind-merge and clsx helpers
```

---

## 3. Design System: "Lendária"

The system follows a high-end, professional "Dark Mode" aesthetic inspired by the Linear design system.

### Core Tokens
- **Background**: `#050505`
- **Surface**: `#121214` (Cards)
- **Accent**: `#7C3AED` (Purple)
- **Typography**: `Inter` (UI) / `JetBrains Mono` (Data)

### Component Patterns
- **`.card`**: Multi-layered shadow (6 layers) for 3D depth.
- **`.card-inner`**: Sub-items with subtle contrast.
- **`.icon-box`**: Square containers with themed background opacity (12-14%).
- **`.btn-primary`**: Gradient background with purple glow.

---

## 4. Technical Debt Inventory

Detailed breakdown of current codebase health.

| ID | Issue | Severity | Area | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **TD-001** | Next.js Canary Version | 🔥 Critical | System/Build | Downgrade to `next@15.1.x` for production stability. |
| **TD-002** | Unfinished Dash Pages | 🟠 High | Frontend | Reconstruct `canais`, `laboratorio`, etc., to match the approved Home design. |
| **TD-003** | ESLint Noise | 🟡 Medium | DX/Linting | Filter `.aiox-core` from project linting or fix `require()` vs `import` rules. |
| **TD-004** | Hardcoded Labels | 🔵 Low | Frontend | Move UI strings and labels to a dedicated constants file or i18n layer. |

---

## 5. Integration Points

### Supabase Connectivity
- **Server-Side**: Using `createBrowserClient` and `createServerClient` from `@supabase/ssr`.
- **Middleware**: Managing session refresh and route protection in `src/middleware.ts`.

### Design Implementation
- Styles are strictly utility-first but consolidated into `globals.css` using Tailwind 4 `@theme` and `@layer utilities` to ensure consistency and prevent class-bloat.

---

**Next Steps (Phase 2):**  
Proceed to **Database Documentation** (`db-schema-audit`) with the `@data-engineer` agent.
