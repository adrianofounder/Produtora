# Guia de Execução — EPIC-05: Tendências & Garimpo — Radar de Nichos Globais

> **Como usar:** Copie e cole o comando no chat na ordem indicada.
> O fluxo padrão de cada story é: **Refinamento (@sm) → Implementar (@dev/@data-eng) → Validar (@qa) → Commitar**.
> *⚠️ Atenção @dev/@qa:* A **NFR08 (Custo de Dados)** é vital aqui. O Garimpo deve priorizar o `OpenCLI-rs` e cookies de navegador antes de queimar cotas de API oficial.

---

### 🤖 Motores Recomendados (Otimização de Tokens / Custo)

*   ✍️ **Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High)**: Escrita abstrata, detalhamento de Requisitos e Histórias de Garimpo e Nichos (@sm).
*   🧠 **Anthropic Claude 3.7 Opus / Anthropic Claude 3.7 Sonnet (Thinking Mode)**: Essencial para a lógica do Crawler "D-1", integração com `OpenCLI-rs` e algoritmos de classificação de nichos.
*   🎯 **Google Gemini 3.1 Pro (High)**: Design da Matriz Oceano Azul (componente carteseano), Bento Grid e estados de hover complexos.
*   🛠️ **Google Gemini 3.1 Pro (Low) / Meta Llama 3.3 70B**: Implementação linear de NichoCards, estruturação de grids e tratamento de dados mock.
*   ⚡ **Google Gemini 3.1 Flash**: Validações de QA em massa, testes de scraping e checagem de limites de rate-limiting comportamental.

---

## 🔵 SPRINT 10 — Interface de Inteligência Visual

> Construir a fundação visual do Radar de Nichos: Matriz de Dispersão, Cards de Resultado e a Página Principal.

---

### ⏳ Story 5.1 — Matriz Oceano Azul (Dispersão)

> **Objetivo:** Criar o componente `<MatrizOceano />` que plota nichos num plano cartesiano (Oferta vs Demanda), destacando visualmente as oportunidades de "Gaps" com glows e animações.

**Passo 1 — Refinamento da Story (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-5.1 da Matriz Oceano Azul baseando-se no briefing @[docs/stories/EPIC-05-BRIEFING.md] e na spec @[docs/epic-5-tendencias.md]
```
**Passo 2 — Implementar (Google Gemini 3.1 Pro (High) · @dev):**
> ⚠️ **NFR obrigatória:** NFR01 (Agnosticidade de tokens/cores), NFR03 (Multi-tenant).
```
@[.agent/workflows/dev.md] execute a story-5.1 criando o componente src/components/tendencias/matriz-oceano.tsx. ATENÇÃO: Use apenas variáveis do Design System (NFR01). A matriz deve parecer viva com micro-interações.
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-5.1 verificando a dispersão via Mock Data e garantindo que não há cores hardcoded (NFR01).
```
**Passo 4 — Commitar:**
```bash
git add -A && git commit -m "feat(epic-5): story-5.1 - componente matriz oceano azul funcional"
```

---

### ⏳ Story 5.2 — Cards de Garimpo de Vídeo (Nicho Card)

> **Objetivo:** Criar o componente `<NichoCard />` para exibir resultados do Crawler, com títulos, visualizações e botões de ação para clonar/salvar conteúdo.

**Passo 1 — Refinamento (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-5.2 de Nicho Cards detalhando a estrutura visual e os call-to-actions de garimpo.
```
**Passo 2 — Implementar (Google Gemini 3.1 Pro (Low) · @dev):**
> ⚠️ **NFR obrigatória:** NFR01 (Design System).
```
@[.agent/workflows/dev.md] implemente a story-5.2 criando src/components/tendencias/nicho-card.tsx. USE APENAS --color-* do Design System (NFR01).
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-5.2 testando responsividade e se as cores seguem estritamente o Design System (NFR01).
```
**Passo 4 — Commitar:**
```bash
git add -A && git commit -m "feat(epic-5): story-5.2 - componente nicho card para listagem de garimpo"
```

---

### ⏳ Story 5.3 — Composição Principal no Bento Grid

> **Objetivo:** Montar a página `/tendencias` unindo a Matriz e a Listagem de Cards num layout Bento Grid premium.

**Passo 1 — Refinamento (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-5.3 detalhando a composicao da pagina tendencias via Bento Grid e limpeza de estilos legados.
```
**Passo 2 — Implementar (Google Gemini 3.1 Pro (High) · @dev):**
> ⚠️ **NFR obrigatória:** NFR01, NFR03.
```
@[.agent/workflows/dev.md] finalize a story-5.3 montando a page.tsx no Bento Grid. ATENÇÃO: Respeite o gap-6 (24px) e use apenas tokens do Design System (NFR01).
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-5.3 garantindo que o layout Bento está pixel-perfect e segue as NFR01 e NFR03.
```
**Passo 4 — Commitar:**
```bash
git add -A && git commit -m "ui(epic-5): story-5.3 - pagina tendencias composta via bento grid"
```

---

## 🟣 SPRINT 11 — Motor de Garimpo e Pontes de Integração

> O cérebro do Épico: extração de dados reais, algoritmos de classificação e conexão com o Studio/Fábrica.

---

### ⏳ Story 5.4 — Engine de Garimpo D-1 (Crawler Analytics)

> **Objetivo:** Implementar a lógica de scraping via `OpenCLI-rs` e o algoritmo de classificação (Explodindo, Em Alta, Crescendo, etc) no backend, alimentando a Matriz com dados reais.

**Passo 1 — Refinamento (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-5.4 do Motor de Garimpo detalhando a integracao com OpenCLI-rs, cookies de sessao e algoritmos de classificacao de buckets.
```
**Passo 2 — Implementar (Claude 3.7 Opus / Claude 3.7 Sonnet Thinking Mode · @dev + @data-eng):**
> ⚠️ **NFR obrigatória:** NFR08 (Custo Zero: USE OpenCLI-rs), NFR03 (Multi-tenant).
```
@[.agent/workflows/data-engineer.md] implemente a story-5.4 conectando o garimpo ao OpenCLI-rs. LEI INQUEBRÁVEL: NFR08 - prioritize cookies e comportamento humano para custo zero de API.
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-5.4. AUDITE A NFR08: Verifique se o consumo de API oficial é zero ou mínimo e se o RLS (NFR03) está bloqueando cruzamento de dados.
```
**Passo 4 — Commitar:**
```bash
git add -A && git commit -m "feat(epic-5): story-5.4 - engine de garimpo D-1 integrada com classificacao automatica"
```

---

### ⏳ Story 5.5 — Cross-Module Bridge (Studio & Kanban)

> **Objetivo:** Implementar as pontes: Botão "Criar Canal" lança o Blueprint no Studio; Botão "Salvar" envia o card para a coluna Planejamento no Kanban.

**Passo 1 — Refinamento (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-5.5 detalhando os eventos de dispatch entre os modulos de Tendencias, Studio e Fabrica (Kanban).
```
**Passo 2 — Implementar (Google Gemini 3.1 Pro (High) · @dev):**
> ⚠️ **NFR obrigatória:** NFR03.
```
@[.agent/workflows/dev.md] implemente a story-5.5. Garanta que o "Salvar Ideia" respeite o tenant_id do usuário (NFR03).
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-5.5 testando o fluxo ponta-a-ponta. Verifique o RLS (NFR03) ao salvar ideias entre usuários diferentes.
```
**Passo 4 — Commitar:**
```bash
git add -A && git commit -m "feat(epic-5): story-5.5 - integracao completa entre tendencias, studio e kanban"
```

---

## 📊 Tracker de Progresso — EPIC-05

| Story | Título | Sprint | Status | Responsável |
|-------|--------|--------|--------|-------------|
| 5.1 | Matriz Oceano Azul (Dispersão) | 10 | ⏳ A Fazer | @dev / @qa |
| 5.2 | Nicho Cards (Garimpo UI) | 10 | ⏳ A Fazer | @dev / @qa |
| 5.3 | Página Principal Bento Grid | 10 | ⏳ A Fazer | @dev / @qa |
| 5.4 | Engine de Garimpo D-1 | 11 | ⏳ A Fazer | @data-eng / @qa |
| 5.5 | Pontes Studio & Kanban | 11 | ⏳ A Fazer | @dev / @qa |

---

## ⚠️ Lembretes Críticos para o @dev

1. **NFR08 — Custo Zero:** O scraping deve ser cirúrgico. Use cookies de sessão para evitar bloqueios e minimize chamadas à API v3 do YouTube.
2. **NFR01 — Agnosticidade:** Estilos e cores devem vir do `Design System`. Nada de `hex` ou `rgb` soltos.
3. **NFR03 — Multi-Tenant:** Garantir que nichos salvos por um Usuário/Tenant não apareçam em outros ambientes.
4. **UX de Inteligência:** A Matriz deve parecer viva. Use micro-interações ao carregar os pontos.

---
*Guia Técnico Gerado por @sm (River). Visão original: @pm (Morgan).*
