# Epic 03: Studio Blueprint — Engenharia de Retenção

**Status**: Done (Retroativo)
**Route**: `/studio`
**Commit de referência**: `ab3b742 feat(ui): Epic 3 — Lendária Studio Blueprint`
**Nota**: Story criada retroativamente para fechar a governança do ciclo SM → Dev → QA. O código foi implementado numa sessão anterior ao estabelecimento do processo formal de documentação por Epic.

---

## Story 01: Config Bar — Canal, Voz e Emoção
**Agent**: `dev`
**Componente**: embutido em `src/app/(dashboard)/studio/page.tsx`

### Descrição
Header da tela com seletor de canal alvo (dropdown com avatar + badge de nicho), campo de URL para análise de vídeo viral e botão "Analisar com Extrator IA".

### Critérios de Aceitação (Verificados ✅)
- [x] Seletor de canal usa `<select>` estilizado com `bg-transparent` e tokens CSS
- [x] URL bar usa classe `.input` + ícone de link SVG inline
- [x] Botão usa `.btn-primary` com ícone ⚡
- [x] Estado `canalId` via `useState` filtra `canalAtivo`

---

## Story 02: Template Selector + Trigger Grid
**Agent**: `dev`
**Componente**: `src/components/studio/template-selector.tsx`

### Descrição
Dois painéis lado a lado dentro de um `.card`: seletor de Template de narrativa (4 templates) e grid de Gatilhos psicológicos (8 triggers toggleáveis).

### Critérios de Aceitação (Verificados ✅)
- [x] Template ativo com borda e fundo `var(--color-accent)`
- [x] Trigger ativo com badge `badge-accent`, inativo com `badge-muted`
- [x] Toggle de trigger via `onClick` atualiza `useState(triggers)`
- [x] Componente exporta `<TemplateSelector />` e `<TriggerGrid />` do mesmo arquivo

---

## Story 03: Blueprint Editor A/B/C
**Agent**: `dev`
**Componente**: `src/components/studio/blueprint-section.tsx`

### Descrição
Componente atômico `<BlueprintSection />` que encapsula cada seção do roteiro (Hook / Desenvolvimento / CTA). Cada seção tem um índice letra (A, B, C) em badge violeta, título, descrição e slot para filhos (textarea editável).

### Critérios de Aceitação (Verificados ✅)
- [x] Container `.card-inner` com padding consistente
- [x] Badge de índice com `background: rgba(124,58,237,0.14)`, `border: rgba(124,58,237,0.25)`
- [x] Slot `{children}` recebe `<textarea className="input" />`
- [x] Prop `accentColor` permite variação de cor por seção

---

## Story 04: Maestro Verdict — Painel de Score
**Agent**: `dev`
**Componente**: `src/components/studio/maestro-verdict.tsx`

### Descrição
Sidebar direita com ring SVG de score (0–10), lista de métricas do blueprint e botão de injeção na fábrica. Score ≥ 8.5 → verde, ≥ 7 → amarelo, < 7 → vermelho.

### Critérios de Aceitação (Verificados ✅)
- [x] SVG `<circle>` com `strokeDashoffset` calculado dinamicamente pelo score
- [x] Cor do ring usa `var(--color-success)` / `var(--color-warning)` / `var(--color-error)`
- [x] Histórico de Blueprints com barra colorida de status à esquerda
- [x] Insight do Maestro em card dourado `var(--color-premium)`

---

## Story 05: Bento de Métricas Estimadas
**Agent**: `dev`
**Componente**: embutido em `src/app/(dashboard)/studio/page.tsx`

### Descrição
Grid de 4 mini-cards com métricas estimadas do blueprint: Retenção Est., CTR Previsto, Virabilidade e Tempo de Produção.

### Critérios de Aceitação (Verificados ✅)
- [x] Usa `.card-inner` com emoji de ícone + `section-label`
- [x] Cores das métricas via `style={{ color: m.color }}` com `var(--color-*)` tokens

---

## Arquivos Entregues

| Arquivo | Status |
|---|---|
| `src/app/(dashboard)/studio/page.tsx` | ✅ Implementado |
| `src/components/studio/blueprint-section.tsx` | ✅ Implementado |
| `src/components/studio/maestro-verdict.tsx` | ✅ Implementado |
| `src/components/studio/template-selector.tsx` | ✅ Implementado |

## Definition of Done
- ✅ Tela interativa com estado de canal, template, triggers, voz, emoção e seções editáveis
- ✅ 3 componentes atômicos no design system Lendária
- ✅ Score ring SVG dinâmico com cores semânticas
- ✅ Zero cores hardcoded
- ✅ Incluído no commit `ab3b742`

---

## 🧠 Doutrina de Engenharia e Negócios (Injetada pelo PRD)

> **ATENÇÃO @dev e @qa**: Extrato do PRD (Seção 9). O Studio não é um mero bloquinho de notas. É o injetor de Prompt Mestre.

### 1. O Papel Estrutural do Blueprint
A Inteligência de Campos (Hook Inquebrável, Emoção Dominante, Fórmula Matemática) preenchida aqui não fica no vácuo. **Ela é herdada** pelas abas de "Aprovação de Roteiro" da Gaveta de Produção da Fábrica (`Epic 2`). Sem ela, as chamadas às APIs da OpenAI baterão em "prompts em branco" e gerarão textos genéricos.

### 2. Arquitetura de Redirecionamento
Quando o usuário aciona `[🚀 CRIAR CANAL BASEADO NISTO]` na aba *Tendências*, o sistema injeta o canal via UUID e **pré-popula** todos os campos baseados na Engenharia Reversa daquela URL de Benchmark enviada via Payload.
