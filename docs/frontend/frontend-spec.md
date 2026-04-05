# Frontend UI/UX Specification - Lendária

**Status:** Phase 3 Complete (Data Collection: Frontend/UX)  
**Agent:** UX Design Expert (@ux-design-expert)  
**Version:** 1.0  

---

## 1. Design System: "Lendária"

The interface is designed for high-performance, professional "Dark Mode" environments, emphasizing depth, premium aesthetics, and technical precision.

### 1.1 Visual Tokens (HSL)
Extracted from `src/app/globals.css`.
- **Background**: `#050505` (Deep Black)
- **Surface**: `#121214` (Base Card)
- **Secondary Surface**: `#1A1A1E` (Sub-cards)
- **Accent**: `#7C3AED` (Violet Glow)
- **Success**: `#10B981` | **Warning**: `#F59E0B` | **Error**: `#EF4444`

### 1.2 Layout: Bento Grid
- Dashboard uses a **12-column recursive Bento Grid**.
- **Gap**: Fixed `24px` (`gap-6`).
- **Container**: `max-w-7xl` or full-width with specific padding (`px-6`).

---

## 2. Component Guidelines

### 2.1 Cards & Elevation
- **`.card`**: Main widget container. Features a 6-layer box-shadow for a 3D volumetric feel.
- **`.card-inner`**: Used for list items or nested alerts. Uses a lighter gradient for contrast.
- **`.card-accent`**: Highlights active states (e.g., Active Tide/Maré). Includes a subtle purple glow.

### 2.2 Icons (Lucide)
- **Mandatory**: Icons must be wrapped in an `.icon-box` or `.icon-box-sm`.
- **Cor**: Color-coded by theme (Accent, Success, Warning, Error, Muted).
- **Rule**: NO emojis allowed.

### 2.3 Visual Effects
- **Mesh Gradients**: Large, blurred radial gradients (`rgba(124, 58, 237, 0.15)`) for high-end ambient lighting.
- **Glassmorphism**: Backdrop blur (12px) applied to Modals, Sidebar navigation, and Topbar.
- **Micro-interactions**: Hover transforms (`translateY(-1px)`) and brightness shifts.

---

## 3. Frontend Technical Debt

| ID | Issue | Severity | Area | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **UX-001** | UI Inconsistency | 🟠 High | Dashboard Pages | `/canais`, `/laboratorio`, `/tendencias`, etc., are currently placeholders or legacy. Redo based on approved Home (Cockpit) layout. |
| **UX-002** | Accessibility (a11y) | 🟡 Medium | Components | Color contrast on `.color-text-3` (#475569) against `#050505` background might be below AAA. |
| **UX-003** | Loading/Error States | 🟡 Medium | UX | Missing skeleton components for data-intensive views during hydration or API fetch. |
| **UX-004** | Responsive Refinement | 🔵 Low | Layout | Bento Grid layout needs fine-tuning for tablet (MD) breakpoints. |

---

## 4. Typography
- **Body/UI**: `Inter` (Sans-serif) via Google Fonts.
- **Data/Monospace**: `JetBrains Mono` (specifically for numbers, metric values, and IDs).

---

**Next Steps (Phase 4):**  
Proceed to **Initial Consolidation** (`consolidate_findings_draft`) with the `@architect` agent.
