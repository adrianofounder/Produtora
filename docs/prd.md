# AD_LABS - Brownfield UI PRD

## 1. Objective
Refactor and rebuild the AD_LABS frontend interfaces, implementing a top-tier, zero-visual-clutter "Dark Mode" aesthetic. The goal is to provide a "Macro Dashboard / God Mode" for the operation, converting the initial bootstrapped repository into a production-ready Bento Grid Cockpit.

## 2. Scope & Features

### 2.1 Core Navigation & Layout
- **Sticky Glassmorphism Topbar**: Contains the unified date/greeting block, notifications placeholder, and Macro KPIs (Total Channels, Planning, Active Tide).
- **Collapsible Sidebar**: A sleek, dark vertical navigation menu housing: Home, Canais, Laboratório, Tendências, Studio, Configurações.
- **Bento Grid Architecture**: The core layouts of pages like Home, HQ, and Canais must utilize a responsive Bento grid to present analytics widgets efficiently without scroll fatigue.

### 2.2 Dashboard (Home) Components
- **Alerts Widget (Left)**: Immediate alerts regarding stuck pipelines or API failures.
- **Queue Widget (Right)**: Next published video queue ("Timeline").
- **Tropa Grid (Bottom)**: Cards representing managed YouTube/TikTok channels containing Maré stats and production pipeline statuses.

### 2.3 Creation Modals & Micro-interactions
- **+ Novo Canal Flow**: A highly refined UI modal guiding users between "Import Existing", "Start from Zero", or "Clone via X-Ray". Micro-interactions and smooth transitions are required to reflect the Lendária quality standard.

## 3. Exclusions (Out of Scope for this specific UI Sprint)
- The execution of background cronjobs, API logic connected to YouTube/ElevenLabs, or database schema configuration. **This sprint is purely frontend architecture, component layout, UX consistency, and the mock-up state representation.**

## 4. UI/UX Rules
- Strictly adhere to the Protocolo Veterano design system.
- Avoid all unstyled elements; utilize Shadcn UI base components but heavily theme them to match the "Lendária" aesthetics.
