# AD_LABS - Front-End UI/UX Specification

## 1. Design System: Lendária Application

### 1.1 Color Palette & Tokens
Implemented primarily via `tailwind.config.ts`.
- **Backgrounds**: Completely dark environment. Core surfaces at `#050505`. Elevated secondary cards at `#121214`.
- **Primary Brand (Neon/Tech)**: `#7C3AED` (Deep Violet) and `#6D28D9` for hover states. Glowing shadows heavily utilized.
- **Secondary (Premium Indicators)**: `#EAB308` (Gold).
- **Typography**: Inter (Body), Outfit or Space Grotesk (Headers). Light grey `#F8FAFC` for high contrast text.

### 1.2 Atoms & Overrides
- **Buttons**: Rounded (8px radius), using `shadow-glow` for primary actions. Ghost buttons for secondary actions with simple underlines.
- **Cards**: Soft radius (16px/24px) for dashboard widgets. Borders should be extremely subtle `1px solid rgba(255, 255, 255, 0.05)`.
- **Glassmorphism**: Modals, dropdown menus, and the top navigation will implement `backdrop-filter: blur(12px)` and `bg-opacity`.

### 1.3 Layout Guidelines (Bento Grid)
- Dashboard layout must be built recursively as a Bento Grid.
- 12-column foundation using CSS Grid / Tailwind Grid utilities.
- Gaps set to `24px` (`gap-6` in Tailwind) for breathing room.

### 1.4 Animations & VFX
- **Micro-interactions**: Hovering any card must trigger a `transform: translateY(-4px)` with a transition duration of `0.3s`.
- **Mesh Gradients**: Faint, large radial gradients positioned `absolute` and `z-[-1]` in the background of main views to provide a high-end feel (blur of 100px+).
- **Text Gradients**: Main hero metrics and main headers utilizing linear text gradients (Violet to Blue).

## 2. Component Pipeline
Base components will be sourced via Aceternity UI (for VFX) and Shadcn (for structural atoms), heavily customized down to the raw CSS in `globals.css` if necessary to ensure compliance.
