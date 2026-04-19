# AD_LABS — Contexto do Agente (Handoff)

> **Leia este arquivo primeiro.** Ele contém tudo que o agente precisa saber para continuar o desenvolvimento sem reler o histórico de conversas.

## Estado Atual do Projeto

**Workflow ativo**: `brownfield-discovery.yaml` ou `epic-orchestration.yaml`
**Fase atual**: Phase 10 — Planning (Epic + User Stories) - Início do EPIC-02
**Último commit**: Encerramento oficial do EPIC-01 (Resolução de Débitos Técnicos)

---

## Epics e Status

| Epic | Tela | Status |
|------|------|--------|
| Epic 1 | Dashboard `/` — Base Shell, Design Tokens, Bento Grid | ✅ Concluído |
| Epic 2 | Canais `/canais` — Kanban de vídeos, filtros, pipeline | ✅ Concluído |
| Epic 3 | Studio `/studio` — Blueprint e montagem de roteiros | ✅ Concluído |
| Epic 4 | Laboratório `/laboratorio` — Análise de tendências | ✅ Concluído |
| Epic 5 | Tendências `/tendencias` — Market insights | ✅ Concluído |
| Epic 6 | HQ `/hq` — God Mode / visão global | ✅ Concluído |
| Epic 7 | Configurações `/configuracoes` — Integrações & APIs | ✅ Concluído |

---

## Stack e Arquitetura

- **Framework**: Next.js 16.2.2 (App Router)
- **Estilo**: TailwindCSS v4 + CSS custom via `globals.css`
- **Ícones**: `lucide-react`
- **Animações**: `framer-motion` (disponível, ainda não utilizado)
- **Dev Server**: `npm run dev` na porta 3000

### Estrutura de componentes criados

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Macro shell (Sidebar + Topbar + mesh-bg)
│   │   ├── page.tsx            ← Home Bento Grid (usando MetricCard + ChannelCard)
│   │   ├── canais/page.tsx     ← Kanban de vídeos (usando VideoCard)
│   │   └── ...demais rotas ainda não refatoradas
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         ← Sidebar modular com pathname ativo
│   │   └── topbar.tsx          ← Topbar com data PT-BR + glassmorphism
│   └── dashboard/
│       ├── metric-card.tsx     ← KPI card reutilizável
│       ├── channel-card.tsx    ← Card do canal com métricas de pipeline
│       └── video-card.tsx      ← Card de vídeo com progress bar e steps
│   └── studio/
│       ├── blueprint-section.tsx ← Seção editável do roteiro (A/B/C)
│       ├── maestro-verdict.tsx   ← Painel de veredito com score ring SVG
│       └── template-selector.tsx ← TemplateSelector + TriggerGrid
└── app/globals.css             ← Design System Lendária completo
```

---

## Design System — Protocolo Lendária

Tokens principais em `globals.css` (`@theme inline`):

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-background` | `#050505` | Fundo base |
| `--color-surface` | `#121214` | Cards primários |
| `--color-accent` | `#7C3AED` | Violeta primário (CTAs, destaques) |
| `--color-accent-dim` | `#6D28D9` | Hover do accent |
| `--color-premium` | `#EAB308` | Gold (indicadores premium) |
| `--color-success` | `#10B981` | Verde (aprovado/publicado) |
| `--color-error` | `#EF4444` | Vermelho (erros/atrasados) |
| `--color-text-1` | `#F8FAFC` | Texto principal |
| `--color-text-3` | `#475569` | Texto de label/muted |

**Classes utilitárias disponíveis no CSS**: `.card`, `.card-inner`, `.card-accent`, `.btn-primary`, `.btn-ghost`, `.badge`, `.badge-accent`, `.badge-success`, `.nav-active`, `.nav-item`, `.icon-box`, `.icon-box-accent`, `.icon-box-success`, `.icon-box-error`, `.mesh-bg`, `.section-label`, `.divider`, `.input`

**Nota técnica**: O warning `@theme Unknown at rule` no linter CSS é inofensivo — é uma diretiva válida do Tailwind v4 que linters mais antigos não reconhecem.

---

## Regras do Protocolo Veterano (respeitadas neste projeto)

1. **Sem placeholders visuais** — toda tela usa dados mock reais
2. **Componentização atômica** — nenhum componente com mais de uma responsabilidade
3. **Sem cores hardcoded** — sempre usar variáveis CSS `var(--color-*)` ou `rgba(124,58,237,...)`
4. **Dark Mode exclusivo** — sem fallback claro
5. **Commits atômicos** — um commit por Epic concluído

---

## Como retomar o trabalho

Execute no terminal (se não estiver rodando):
```bash
npm run dev
```

Em seguida, o agente deve:
1. Ler este arquivo e os docs em `docs/`
2. Confirmar o Epic atual (Epic 4 — `/laboratorio`)
3. Ver a tela atual em `src/app/(dashboard)/laboratorio/page.tsx`
4. Seguir o ciclo: SM → Dev → QA do `brownfield-ui.yaml`
