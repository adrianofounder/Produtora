# Guia de Execução — EPIC-04: Laboratório — Integração Backend, AI e Auto-Refill

> **Como usar:** Copie e cole o comando no chat na ordem indicada.
> O fluxo padrão de cada story é: **Refinamento (@sm) → Implementar (@dev/@data-eng) → Validar (@qa) → Commitar**.
> *⚠️ Atenção @dev/@data-engineer:* As NFRs de Isolamento Multi-Tenant (NFR03), Agnosticidade de Provedor (NFR01) e Trilha de Auditoria (NFR06) são **leis inquebráveis** neste EPIC. Consulte `docs/prd-core-nfrs.md` antes de codificar qualquer coisa.

---

### 🤖 Motores Recomendados (Otimização de Tokens / Custo)

*   ✍️ **Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High)**: Escrita abstrata, detalhamento de Requisitos e Histórias do Laboratório e Cronjobs (@sm).
*   🧠 **Anthropic Claude 3.7 Opus / Anthropic Claude 3.7 Sonnet (Thinking Mode)**: Essencial para abstração de Arquitetura, Schema complexo do "DNA de Eixos", e estruturar RLS e o Cron de `Auto-Refill` com precisão.
*   🎯 **Google Gemini 3.1 Pro (High)**: Design de estado no Server/Client, componentização inteligente e Mutações de transição para a fila de Ideias.
*   🛠️ **Google Gemini 3.1 Pro (Low) / Meta Llama 3.3 70B (Open Source)**: Implementação linear de hooks no React, Supabase `select`/`update` e tratamentos básicos de erro `catch`.
*   ⚡ **Google Gemini 3.1 Flash**: Validações de QA velozes, testes vitais do fluxo noturno, checagem dos limites orçamentários temporais e falhas de RLS.

---

## 🔵 SPRINT 8 — Fundações Dinâmicas do Laboratório

> Conectar o banco real ao Laboratório: Schema, RLS e dados ao vivo substituindo o mock data estático.

---

### ⏳ Story 4.1 — Modelo de Dados e RLS do Laboratório

> **Objetivo:** Criar as tabelas `eixos` (com os 20 campos do DNA Temático) e `ideias` no Supabase com RLS estrito multi-tenant, garantindo que Tenant A nunca acesse dados de Tenant B.

**Passo 1 — Refinamento da Story (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-4.1 de modelo de dados e RLS do Laboratorio baseando-se no briefing @[docs/stories/EPIC-04-LABORATORIO-BACKEND.md]
```
**Passo 2 — Implementar (Anthropic Claude 3.7 Opus / Claude 3.7 Sonnet Thinking Mode · @data-engineer):**
> ⚠️ **NFR obrigatória:** Leia `docs/prd-core-nfrs.md` — NFR03 (RLS multi-tenant), NFR01 (agnosticidade de provedor).
```
@[.agent/workflows/data-engineer.md] execute a story-4.1 criando as tabelas eixos e ideias com os 20 campos do DNA Tematico e configurando RLS multi-tenant rigoroso no Supabase.
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-4.1 tentando cruzar dados entre tenants diferentes e verificando que as politicas RLS bloqueiam acesso indevido.
```
**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-4): story-4.1 - schema de eixos e ideias com RLS multi-tenant"
```

---

### ⏳ Story 4.2 — Integração da UI e Master Override

> **Objetivo:** Substituir todo o mock data do `/laboratorio` por dados reais do Supabase. Implementar as mutações do botão "Venceu" (Master Override) e "Enviar Lote P/ Fábrica" que transiciona Ideias para `status = 'planejamento'` no Kanban.

**Passo 1 — Refinamento (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-4.2 de integracao da UI do Laboratorio com dados reais e Master Override baseando-se no @[docs/stories/EPIC-04-LABORATORIO-BACKEND.md]
```
**Passo 2 — Implementar (Google Gemini 3.1 Pro (High) · @dev):**
> ⚠️ **NFR obrigatória:** Leia `docs/prd-core-nfrs.md` — NFR03 (RLS: `.eq('tenant_id', ...)` em toda query), NFR01 (fachada `ITextEngine` ao disparar geração).
```
@[.agent/workflows/dev.md] implemente a story-4.2 removendo todos os mock data do laboratorio, conectando ao Supabase e implementando o Master Override e o disparo manual para a Fabrica.
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-4.2 testando o fluxo completo: dados reais carregando no Laboratorio, Master Override reordenando o eixo vencedor, e o envio de lote transitando status no Kanban.
```
**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-4): story-4.2 - laboratorio conectado ao supabase com master override"
```

---

## 🟣 SPRINT 9 — Motor de Inteligência e Automação Noturna

> O cérebro do Laboratório: cálculo de marés, ranqueamento de performance e o cronjob de Auto-Refill autônomo.

---

### ⏳ Story 4.3 — Motor Marés (Analytics e Score Normalizado)

> **Objetivo:** Implementar a lógica de cálculo e normalização do `score_mare` (0-100) no backend. O eixo com maior score recebe o badge `👑 LÍDER`, as barras de progresso são coloridas semanticamente e os indicadores de direção (▲▼→) são calculados a partir de dados históricos no banco. Cache obrigatório para não sobrecarregar o banco no carregamento da tela (NFR09).

**Passo 1 — Refinamento (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-4.3 do Motor Mares detalhando a logica de score_mare, normalizacao das barras, indicadores de direcao e caching de analytics conforme NFR09.
```
**Passo 2 — Implementar (Google Gemini 3.1 Pro (Low) / Meta Llama 3.3 70B · @dev):**
> ⚠️ **NFR obrigatória:** Leia `docs/prd-core-nfrs.md` — NFR09 (cache: dados de analytics pré-computados, nunca consultar no `page.tsx`), NFR03 (RLS em todo acesso ao banco).
```
@[.agent/workflows/dev.md] implemente a story-4.3 do Motor Mares com calculo de score_mare normalizado, coloracao semantica das barras de progresso e caching obrigatorio dos dados de analytics.
```
**Passo 3 — Validar (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] valide a story-4.3 verificando que o eixo lider e corretamente identificado, que o cache evita queries excessivas ao banco e que os indicadores de direcao refletem dados historicos reais.
```
**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-4): story-4.3 - motor mares com score normalizado e cache de analytics"
```

---

### ⏳ Story 4.4 — Auto-Refill e Automação de Madrugada (Cronjob)

> **Objetivo:** Criar um endpoint seguro (`/api/cron/auto-refill`) que pode ser acionado por um scheduler externo (Vercel Cron / Supabase Edge Functions). O job verifica se a fila do Kanban tem `< 2 vídeos` em `status = 'planejamento'`, e se sim, chama o `ITextEngine` do EPIC-03 para gerar +5 ideias do Eixo Vencedor corrente. Toda geração automática deve gravar `origem = '[Automação Lvl 3]'` na trilha de auditoria (NFR06). O teto de tokens do EPIC-03 é verificado ANTES de qualquer geração — se esgotado, o job para limpo sem erro silencioso.

**Passo 1 — Refinamento (Anthropic Claude 3.7 Sonnet / Google Gemini 3.1 Pro (High) · @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-4.4 do Auto-Refill noturno detalhando o endpoint seguro, a logica de gatilho por fila vazia, integracao com ITextEngine, auditoria NFR06 e kill-switch via configuracoes.
```
**Passo 2 — Implementar (Anthropic Claude 3.7 Opus / Claude 3.7 Sonnet Thinking Mode · @dev + @devops):**
> ⚠️ **NFR obrigatória:** Leia `docs/prd-core-nfrs.md` — NFR01 (use `ITextEngine`, nunca SDK direto), NFR06 (auditoria: gravar `[Automação Lvl 3]` em toda geração automática), NFR03 (RLS em toda escrita no banco).
```
@[.agent/workflows/dev.md] implemente a story-4.4 criando o endpoint /api/cron/auto-refill com verificacao de teto de tokens, chamada ao ITextEngine, gravacao de auditoria [Automacao Lvl 3] e kill-switch global nas Configuracoes.
```
**Passo 3 — Validar Completo (Google Gemini 3.1 Flash · @qa):**
```
@[.agent/workflows/qa.md] audite a story-4.4 simulando: (1) fila vazia disparando o auto-refill, (2) teto de tokens esgotado interrompendo a geracao sem erro silencioso, (3) auditoria gravada corretamente com [Automacao Lvl 3], (4) kill-switch bloqueando o job.
```
**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-4): story-4.4 - auto-refill noturno com auditoria e kill-switch"
```

---

## 📊 Tracker de Progresso — EPIC-04

| Story | Título | Sprint | Status | Responsável |
|-------|--------|--------|--------|-------------|
| 4.1 | Modelo de Dados e RLS do Laboratório | 8 | ⏳ A Fazer | @data-engineer / @dev |
| 4.2 | Integração da UI e Master Override | 8 | ⏳ A Fazer | @dev / @qa |
| 4.3 | Motor Marés (Analytics e Score) | 9 | ⏳ A Fazer | @dev / @qa |
| 4.4 | Auto-Refill e Automação de Madrugada | 9 | ⏳ A Fazer | @dev / @devops / @qa |

---

## 🏁 Próximos Passos (Workflow AIOX)

Sempre que concluir uma Story e fazer commit, atualize o Tracker acima. Quando **TODAS** estiverem concluídas, chame o PM novamente:
```
@[.agent/workflows/pm.md] O EPIC-04 foi 100% implementado. Feche as pendências no guia e inicie o briefing do próximo grande objetivo (EPIC-05).
```

---

## ⚠️ Lembretes Críticos para o @dev

1. **NFR01 — Agnosticidade:** O `Auto-Refill` DEVE usar a fachada `ITextEngine` do EPIC-03. Proibido chamar qualquer SDK de LLM diretamente.
2. **NFR03 — RLS:** Todo `select`, `insert` ou `update` nas tabelas `eixos` e `ideias` obrigatoriamente passa pelo filtro `.eq('tenant_id', session.user.id)`.
3. **NFR06 — Auditoria:** Geração automática grava `origem = '[Automação Lvl 3]'`. Geração humana grava o UUID do usuário autenticado.
4. **NFR09 — Cache:** Dados de analytics do Laboratório são pré-computados em background. A tela NUNCA consulta o YouTube ou APIs externas no `page.tsx`.
5. **Kill-Switch:** O toggle de desativar o `Auto-Refill` na tela de Configurações deve ser verificado como PRIMEIRA instrução do cronjob.

---
*Guia Técnico Gerado por @sm (River). Briefing estratégico original: @pm (Morgan).*
