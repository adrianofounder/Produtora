# UX Specialist Review
**Projeto:** Produtora (AD_LABS)
**Data:** 2026-04-05
**Reviewer:** Uma (Sally + Brad Frost) — @ux-design-expert
**Fase:** 6 — Validação: UX/Frontend
**Referência:** `docs/prd/technical-debt-DRAFT.md`
**Componentes analisados:** `video-drawer.tsx` (444 linhas), `video-card.tsx` (166 linhas), `globals.css` (345 linhas), `src/components/ui/`

---

## Gate Status: ✅ APPROVED com 2 débitos adicionais

O DRAFT capturou os 7 débitos mais visíveis. Após análise linha a linha dos componentes reais, **2 débitos adicionais** foram identificados e as perguntas do @architect foram respondidas com precisão técnica.

---

## 1. Débitos Validados

| ID | Débito | Severidade | Status | Ajuste | Horas | Prioridade Final |
|----|--------|------------|--------|--------|-------|-----------------|
| FE-01 | `VideoDrawer.tsx` +400 linhas / múltiplas responsabilidades | 🔴 Crítico | ✅ Confirmado — 444 linhas reais | Decomposição por ABA (5 subcomponentes) | 8h | **P0** |
| FE-02 | `style={{}}` hardcoded ignorando tokens | 🔴 Crítico | ⚠️ Refinado — 32 ocorrências, mas ~40% são dinâmicas | Distinguir estático vs. dinâmico antes de refatorar | 4h | **P0** |
| FE-03 | Ausência de ARIA e suporte a teclado | 🔴 Crítico | ✅ Confirmado — zero ARIA no Drawer | Adicionar role=dialog, aria-modal, tablist, focus trap | 5h | **P0** |
| FE-04 | Uso misto de variantes de botão | 🟡 Médio | ⚠️ Refinado — falta `btn-danger` no design system | globals.css tem btn-primary/ghost, botão Excluir é inline | 3h | **P1** |
| FE-05 | Lógica de status duplicada em `VideoCard` | 🟡 Médio | ⚠️ Refinado — oportunidade maior que o previsto | `statusConfig` duplica valores dos tokens `.glow-*` do CSS | 2h | **P1** |
| FE-06 | Estados de erro de IA sem tratamento visual | 🟡 Médio | ✅ Confirmado — `gerarRoteiro()` usa try/finally sem catch visual | Nenhum feedback ao usuário em caso de erro da API | 3h | **P2** |
| FE-07 | Skeletons/spinners não centralizados | 🟡 Médio | ✅ Confirmado — cada aba usa `Loader2` ad-hoc | Criar `<LoadingState>` e `<EmptyState>` atoms reutilizáveis | 2h | **P2** |

---

## 2. Débitos Adicionados (Não Identificados no DRAFT)

### 🔴 FE-08 — Formulários sem Associação `id/aria-labelledby` (a11y Crítico)
> **Localização:** `VideoDrawer.tsx`, linha 306-311 (aba Narração)

O `<label>` "Voz do Blueprint" e o `<select>` não estão associados via `htmlFor`/`id`. Usuários de screen reader não conseguem navegar ao campo a partir do label. Adicionalmente, o `<input>` na aba Exportar (linha 402) usa `defaultValue` sem `id` nem aria.

```tsx
// ❌ Atual (inacessível)
<label className="section-label">Voz do Blueprint</label>
<select className="input w-full">...</select>

// ✅ Correto
<label htmlFor="voz-blueprint" className="section-label">Voz do Blueprint</label>
<select id="voz-blueprint" className="input w-full" aria-required="false">...</select>
```

**Severidade:** 🔴 Crítico (WCAG 2.1 AA — SC 1.3.1 Info and Relationships)
**Esforço:** ⚡ Baixo (componentes isolados, mudança cirúrgica)
**Prioridade:** **P0** (agrupado com FE-03)

---

### 🟡 FE-09 — Layout Mobile do VideoDrawer Ausente
> **Localização:** `VideoDrawer.tsx`, linha 103-109

O drawer usa `flex justify-end` + `max-w-2xl` sem breakpoint responsivo. Em viewports `< 640px` (mobile), o drawer ocupa 100vw mas as abas horizontais (`overflow-x-auto`) não têm suporte a swipe touch e o overlay não fecha ao deslizar para baixo (padrão mobile esperado).

```tsx
// ❌ Atual — não responsivo
<div className="h-full w-full max-w-2xl flex flex-col overflow-hidden">

// ✅ Recomendado — drawer bottom sheet em mobile, side panel em desktop
<div className="h-full w-full sm:max-w-2xl flex flex-col overflow-hidden sm:ml-auto">
```

**Severidade:** 🟡 Médio (impacto direto em usuários mobile — ~50% do tráfego)
**Esforço:** 🧪 Médio (requer mudança de layout paradigm em mobile)
**Prioridade:** **P1**

---

## 3. Estimativas de Esforço Revisadas

| ID | Ação | Horas Estimadas | Tipo |
|----|------|-----------------|------|
| FE-01 | Decompor `VideoDrawer` em 5 subcomponentes de aba | 8h | Refatoração |
| FE-03 + FE-08 | Implementar ARIA completo + focus trap + labels | 5h | Acessibilidade |
| FE-02 | Substituir `style={{}}` estáticos por CSS vars | 4h | Tokens |
| FE-04 | Criar variant `btn-danger` + unificar botões | 3h | Design System |
| FE-06 | Criar `<ErrorState>` atom + tratar erros da API | 3h | UX |
| FE-05 | Unificar `statusConfig` com tokens CSS `.glow-*` | 2h | DRY |
| FE-09 | Responsividade mobile do Drawer | 2h (mín.) | Layout |
| FE-07 | Criar atoms `<LoadingState>` e `<EmptyState>` | 2h | Componentes |
| | **TOTAL FE** | **29h** | — |

---

## 4. Respostas ao Architect (5 Perguntas da Fase 4)

### Pergunta 1: FE-01 — Decomposição por ABA ou por RESPONSABILIDADE?
**Resposta:** **Por ABA** — e isso também é a decomposição por responsabilidade neste caso, pois cada aba (`ideia`, `roteiro`, `narracao`, `thumb`, `pacote`) tem seu próprio estado de API, UI e navegação. A estrutura já está implícita nos blocos `{abaAtiva === 'X' && (...)}` do código atual.

**Arquitetura recomendada:**
```
VideoDrawer.tsx (container — ~80 linhas)
├── VideoDrawerHeader.tsx (header + barra de progresso)
├── VideoDrawerTabs.tsx (navegação de abas)
├── tabs/
│   ├── IdeiaTab.tsx (geração de títulos)
│   ├── RoteiroTab.tsx (geração + aprovação de roteiro)
│   ├── NarracaoTab.tsx (seleção de voz + aprovação)
│   ├── ThumbTab.tsx (grid thumbnails + aprovação)
│   └── PacoteTab.tsx (metadados finais + agendamento)
└── hooks/
    └── useVideoDrawer.ts (estado compartilhado: aprovado, abaAtiva, loading)
```

**Impacto do esforço:** Mantém as 8h estimadas — é cirúrgica e não muda comportamento.

---

### Pergunta 2: FE-02 — Refatoração separada ou integrada ao VideoDrawer?
**Resposta:** **Integrada** à decomposição do VideoDrawer, com uma distinção crítica:

**Categorias de `style={{}}`:**
| Tipo | Exemplo | Ação |
|------|---------|------|
| 🔴 Estático (substituir) | `style={{ color: 'var(--color-text-3)' }}` | → usar classe Tailwind `text-[var(--color-text-3)]` |
| 🟡 Token sem classe (extrair) | `style={{ background: 'rgba(255,255,255,0.06)' }}` | → criar utility class em globals.css |
| 🟢 Dinâmico (manter) | `style={{ width: `${pct}%` }}` | Manter como `style` — não tem equivalente estático |
| 🟢 CSS var direto (manter) | `style={{ background: 'var(--color-surface)' }}` | Manter — é o uso correto de tokens |

**Risco de regressão visual:** Baixo, se a distinção acima for respeitada. Os tokens já estão definidos e consistentes.

---

### Pergunta 3: FE-03 — Nível WCAG e ordem de prioridade?
**Resposta:** **WCAG 2.1 AA** como target mínimo. Ordem de prioridade de componentes:

1. **VideoDrawer** (maior risco — modal/drawer sem `role="dialog"` + sem focus trap = falha crítica SC 2.1.2)
2. **CanalModal** (mesmo problema, ainda não auditado)
3. **Botões interativos** (`<button className="btn-ghost h-8 w-8">` sem `aria-label` no ✕ de fechar)
4. **Formulários** (FE-08 — labels sem associação)
5. **VideoCard** (hover states sem alternativa de teclado)

**Critérios de Sucesso que falham atualmente:**
- SC 1.3.1 — Info and Relationships ❌
- SC 2.1.1 — Keyboard ❌ (focus trap)
- SC 2.1.2 — No Keyboard Trap ❌ (inverso — foco vaza do modal)
- SC 4.1.2 — Name, Role, Value ❌ (role=dialog ausente)

---

### Pergunta 4: FE-04 — Unificar via shadcn/ui ou btn-primary atual?
**Resposta:** **Manter o sistema atual `btn-primary`/`btn-ghost`** e adicionar uma variant `btn-danger` que está faltando.

**Justificativa:** O `globals.css` já tem um design system coerente e bem construído — `.btn-primary` tem gradiente, shadow, hover states. Migrar para shadcn/ui variants seria over-engineering neste momento e introduziria uma dependência pesada desnecessária (Radix + class-variance-authority).

**Ação concreta:**
```css
/* Adicionar em globals.css */
.btn-danger {
  background: rgba(239,68,68,0.10);
  border: 1px solid rgba(239,68,68,0.20);
  color: var(--color-error);
  font-size: 13px; font-weight: 600;
  border-radius: 9px; cursor: pointer;
  transition: all 0.18s ease;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 14px;
}
.btn-danger:hover {
  background: rgba(239,68,68,0.20);
  border-color: rgba(239,68,68,0.40);
  color: #F87171;
}
```

---

### Pergunta 5: Débitos de UX não listados?
**Resposta:** Sim — **FE-08** e **FE-09** (detalhados acima), mais:

- **Empty States ausentes:** Quando não há vídeos em um canal, a lista renderiza vazio sem estado explicativo. Cria confusão ("o sistema quebrou ou está vazio?").
- **Aba "Pacote/Exportar" prematura:** O botão "Agendar Publicação no YouTube" fica disponível sem verificar se o áudio e thumbnail foram realmente gerados — apenas `!aprovado.roteiro` é verificado (linha 430). É um bug de fluxo UX que pode resultar em publicação de vídeos incompletos.
- **Titles de Página ausentes:** Observação sistêmica — as rotas do App Router provavelmente não têm títulos dinâmicos de página (`<title>` por rota), o que afeta SEO e acessibilidade de screen readers.

---

## 5. Recomendações de Design — Priorização UX

```
Sprint 1 — Funcional (P0):   FE-03 + FE-08 → FE-01 → FE-02
Sprint 2 — Qualidade (P1):   FE-04 → FE-05 → FE-09
Sprint 3 — Excelência (P2):  FE-06 → FE-07
```

**Recomendação estratégica — Bug de Fluxo:**
> Antes de qualquer outro trabalho de frontend, corrigir a verificação de gate na aba "Pacote":
> ```tsx
> // Trocar
> {!aprovado.roteiro && (...)}
> // Por
> {(!aprovado.roteiro || !aprovado.audio || !aprovado.thumb) && (...)}
> ```
> Isso é um bug funcional, não apenas débito técnico.

---

## 6. Inventário de Componentes Atualizado

Adicionando componentes não mapeados no DRAFT original:

| Tipo | Componente | Local | Status |
|------|------------|-------|--------|
| Atom | `Button` | `ui/button.tsx` | ✅ Mapeado |
| Atom | `Skeleton` | `ui/skeleton.tsx` | ✅ Mapeado |
| Atom | **`btn-danger`** | `globals.css` | ❌ **FALTANDO** |
| Atom | **`<EmptyState>`** | — | ❌ **FALTANDO** |
| Atom | **`<ErrorState>`** | — | ❌ **FALTANDO** |
| Molecule | `BaseModal` | `ui/base-modal.tsx` | ✅ Mapeado |
| Organism | `VideoDrawer` | `canais/video-drawer.tsx` | 🔴 Refatorar → 7 peças |

---

**Documento gerado por:** @ux-design-expert (Uma)
**Status:** ✅ Completo — pronto para Fase 7 (@qa)

*— Uma, desenhando com empatia 💝*
