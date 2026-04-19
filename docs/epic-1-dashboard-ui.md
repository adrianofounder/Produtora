# Epic 01: AD_LABS Cockpit Dashboard UI

**Status**: Sharded / Ready for Development
**Objective**: Build out the Macro Dashboard, layout shell, and component foundations following the "Lendária" Dark Mode protocol.

## Story 01: Base Shell Architecture & Design Tokens
**Agent**: `dev`
- **Desc**: Establish the Next.js `(dashboard)/layout.tsx` grid base and apply the CSS variables (`globals.css`) mapped out in `front-end-spec.md`. Install Lucide-React for icons.
- **Goal**: A blank dashboard workspace with a fixed Sidebar scaffold, Dark Mode lock, and core layout bounds.

## Story 02: Sidebar & Topbar Components
**Agent**: `dev`
- **Desc**: Create `sidebar.tsx` and `topbar.tsx` in `src/components/layout/`.
- **Goal**: Implement standard navigation items (Home, Canais, Laboratório, etc.) with Glassmorphism overlay effects, active-route highlighting, and Topbar user/notification placeholders.

## Story 03: Home Bento Grid & Metric Cards
**Agent**: `dev`
- **Desc**: Implement `page.tsx` on the `/` route using a CSS Grid (Bento style). Create `<MetricCard />` atom in `src/components/dashboard`. 
- **Goal**: Populate the top KPIs (Total Channels, Planning, Active Tide) and layout the 3 sections (Alerts, Queue, Tropa Grid).

## Story 04: The Channel Tropa Grid (Kanban Macro View)
**Agent**: `dev`
- **Desc**: Build the specific Channel Card component utilizing the `spotlight-card.tsx` effect and position it inside the Bento Grid's bottom section.
- **Goal**: Visual representation of "Histórias Ocultas" and "Jesus Reage" showing Maré status and Pipeline metrics without editing functionality.

## Story 05: UI Polish & Mesh Gradients (QA & Finish)
**Agent**: `qa` / `ux-expert`
- **Desc**: Add the `.mesh-bg` radial gradient blobs behind the main container (translating Lendária's VFX). Add hover translation (`transform: translateY(-4px)`) to all cards.
- **Goal**: Final graphical tune-up guaranteeing the interface looks premium, dark, and highly responsive.

---

## 🧠 Doutrina de Engenharia e Negócios (Injetada pelo PRD)

> **ATENÇÃO @dev e @qa**: Extrato do PRD (Seções 2 e 6). Cockpit/Home não é um feed estático, é o radar central executivo.

### 1. Indicadores Financeiros e KPIs Globais
Os componentes de KPI (`<MetricCard />`) na Home devem, no futuro (quando conectados no banco), rodar funções de agregação SUM() sobre as tabelas:
*   Valores de Receita de Adsense dos canais.
*   Custo operacional de Tokens API/Hora na Fábrica.
*(Dashboard = Faturamento - Custo de Fábrica).*

### 2. Painel de Notificações Ativas
O Painel de Alertas não listará spam. Só registrará ocorrências severas:
*   "API da OpenAI Fora do Ar (Kill Switch acionado)".
*   "Strike de Copyright recebido no Canal X".
*   "Conta Kiwify Desconectada".
