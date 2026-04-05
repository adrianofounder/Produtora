# Frontend & UX Specification - Produtora

Este documento detalha o estado atual da interface de usuário e experiência do usuário (UX) do projeto Produtora, mapeado durante a Fase 3 do workflow de Brownfield Discovery.

## 1. Inventário de Componentes (Atomic Design)

Mapeamento da hierarquia de componentes atual:

### ⚛️ Atoms (Base)
| Componente | Localização | Descrição |
|------------|-------------|-----------|
| `Button` | `src/components/ui/button.tsx` | Botão padrão baseado em variants. |
| `Skeleton` | `src/components/ui/skeleton.tsx` | Placeholder de carregamento. |
| `SpotlightCard` | `src/components/ui/spotlight-card.tsx` | Card com efeito de luz ao passar o mouse. |
| `IconBox` | `globals.css` (class) | Container para ícones Lucide com cores de status. |

### 🧪 Molecules (Compostos)
| Componente | Localização | Descrição |
|------------|-------------|-----------|
| `BaseModal` | `src/components/ui/base-modal.tsx` | Estrutura base para diálogos. |
| `Sidebar` | `src/components/layout/sidebar.tsx` | Navegação lateral com estados ativos. |
| `Topbar` | `src/components/layout/topbar.tsx` | Barra superior de contexto. |

### 🧬 Organisms (Complexos)
| Componente | Localização | Descrição |
|------------|-------------|-----------|
| `VideoCard` | `src/components/dashboard/video-card.tsx` | Card de vídeo com barra de progresso e indicadores de status. |
| `VideoDrawer` | `src/components/canais/video-drawer.tsx` | **Crítico**: Gerencia todo o fluxo de produção (Ideia -> Roteiro -> Narração). |
| `CanalModal` | `src/components/modals/canal-modal.tsx` | Cadastro e edição de canais/blueprints. |

---

## 2. Design System & Tokens

O projeto utiliza **Tailwind CSS 4** com tokens definidos em `src/app/globals.css`.

### Paleta de Cores (Tokens CSS)
- `background`: `#050505` (Deep Dark)
- `surface`: `#121214` / `#1A1A1E` / `#202024`
- `accent`: `#7C3AED` (Purple)
- `premium`: `#EAB308` (Gold)
- `success`: `#10B981` (Green)
- `error`: `#EF4444` (Red)

### Efeitos Especiais (Utilities)
- `.mesh-bg`: Background animado com gradiente radial.
- `.glass`: Efeito de vidro com `backdrop-filter`.
- `.depth-card`: Transformação 3D suave no hover.

---

## 3. Débitos Técnicos Identificados

### 🔴 Crítico (Urgente)
1. **Complexidade do VideoDrawer**: O componente `VideoDrawer.tsx` possui +400 linhas e gerencia múltiplos estados de API e UI. Precisa ser decomposto em moléculas menores por aba.
2. **Estilização Hardcoded**: Uso extensivo de `style={{ ... }}` com valores `rgba` e cores hexadecimais diretamente nos arquivos `.tsx`, ignorando o sistema de tokens.
3. **Falta de Acessibilidade (a11y)**: Ausência de tags ARIA em modais e drawers. Falta de suporte a navegação por teclado (foco) em elementos interativos customizados.

### 🟡 Médio (Importante)
1. **Inconsistência de Botões**: Uso misto de classes utilitárias (`btn-primary`) e estilização ad-hoc.
2. **Duplicação de Lógica de Status**: Cores e labels de status de vídeo estão definidos localmente no `VideoCard`, mas deveriam ser centralizados.

---

## 4. Auditoria de UX (Sally & Brad)

### Pontos Positivos
- **Estética Visual**: O design é moderno, utiliza glassmorphism de forma elegante e passa uma sensação "premium".
- **Feedback Visual**: Micro-interações (hover, barra de progresso) são bem implementadas.

### Oportunidades de Melhoria
- **Estados de Erro**: Melhorar a visualização de falhas na geração por IA.
- **Loading UX**: Centralizar skeletons e spinners para uma experiência mais fluida durante chamadas assíncronas.

---
**Documento gerado por:** @ux-design-expert (Uma)
**Data:** 05/04/2026
