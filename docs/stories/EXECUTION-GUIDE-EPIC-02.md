# Guia de Execução — EPIC-02: Integração e Validação do MVP

> **Como usar:** Copie e cole o comando no chat na ordem indicada.
> O fluxo padrão de cada story é: **Refinamento (@sm) → Implementar (@dev) → Validar (@qa) → Commitar**.
> *Nota: Os arquivos de story individuais serão gerados pelo @sm (Scrum Master) antes da implementação pelo @dev, seguindo a estrutura AIOX.*

---

### 🤖 Motores Recomendados (Otimização de Tokens)

*   ✍️ **Claude Sonnet / Gemini 3.1 Pro (High)**: Escrita abstrata, detalhamento de Requisitos e Histórias (@sm).
*   🧠 **Claude Opus / Sonnet (Thinking)**: Decisões de Arquitetura, Queries Complexas e Estrutura de Banco de Dados.
*   🎯 **Gemini 3.1 Pro (High)**: Design System (UX) e Integração de Alta Fidelidade.
*   🛠️ **Gemini 3.1 Pro (Low) / GPT-OSS 120B**: Implementação de lógica contínua no Front e Server Components (CRUD básico).
*   ⚡ **Gemini 3 Flash**: Validações de QA, revisão de linting, commits e fluxos rápidos.

---

## 🔵 SPRINT 4 — Fundação de Dados (Integração Core)

> Substituir "Mock Data" por consumo verídico do banco de dados com Server Components, testando o Kanban (Canais).

---

### ⏳ Story 2.1 — Supabase Seeding & Fetching Base (Tendências & Eixos)
> **Objetivo:** Estabelecer arquitetura inicial de busca. Criar script de seed real e fazer as rotas lerem do BD as ideias base e eixos de laboratório.

**Passo 1 — Refinamento da Story (✍️ @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-2.1 de seeding e fetching baseando-se no escopo do @[docs/stories/EPIC-02-VALIDACAO-MVP.md]
```
ok
**Passo 2 — Implementar (🎯 @dev):**
```
@[.agent/workflows/dev.md] implemente a story-2.1 definida pelo sm
```
ok
**Passo 3 — Validar (⚡ @qa):**
```
@[.agent/workflows/qa.md] valide a implementacao da story-2.1
```
ok
**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-2): story-2.1 - integrar dados base e seeding do Supabase nas rotas iniciais"
```

---

### ⏳ Story 2.2 — Integração Completa do Pipeline (Kanban / Canais)
> **Objetivo:** Transformar o drag/click no Kanban de canais em chamadas de Server Action que salvam o status real da ideia (`planejamento`, `producao`, etc).

**Passo 1 — Refinamento (✍️ @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-2.2 para interacao e update de status dinamico no Kanban de canais
```

**Passo 2 — Implementar (🎯 @dev):**
```
@[.agent/workflows/dev.md] implemente a story-2.2
```

**Passo 3 — Validar (⚡ @qa):**
```
@[.agent/workflows/qa.md] valide a story-2.2
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-2): story-2.2 - integrar kanban do dashboard com chamadas Server Actions"
```

---

## 🟣 SPRINT 5 — Laboratório e Studio (CRUD MVP)

> Plugar as aprovações no Laboratório e o processo de validação de roteiro real no Studio.

---

### ⏳ Story 2.3 — Fluxo Tendências → Laboratório
> **Objetivo:** Permitir ao usuário aprovar ideias na aba laboratório. O banco registrará a transição e a ideia ficará pronta para o roteiro.

**Passo 1 — Refinamento (✍️ @sm):**
```
@[.agent/workflows/sm.md] redija a story-2.3 detalhando a transicao de states no laboratorio e DB
```

**Passo 2 — Implementar (🧠 @dev):**
```
@[.agent/workflows/dev.md] implemente a story-2.3
```

**Passo 3 — Validar (⚡ @qa):**
```
@[.agent/workflows/qa.md] verifique a transicao entre tendencias, laboratorio e db na story-2.3
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-2): story-2.3 - ciclo de vida das ideias no laboratorio"
```

---

### ⏳ Story 2.4 — Studio Blueprint Engine de Ponta a Ponta
> **Objetivo:** `/studio` recebe um ID via query string (ex: `?id=1`), carrega o banco, o usuário rascunha as partes A/B/C e ao salvar, finaliza o processo.

**Passo 1 — Refinamento (✍️ @sm):**
```
@[.agent/workflows/sm.md] crie o documento da story-2.4 de finalizacao do MVP salvando blueprints
```

**Passo 2 — Implementar (🧠 @dev):**
```
@[.agent/workflows/dev.md] finalize a implementacao do epic desenvolvendo a story-2.4
```

**Passo 3 — Teste Completo MVP (⚡ @qa):**
```
@[.agent/workflows/qa.md] implemente validações finais do fluxo completo (Tendencias -> Laboratorio -> Studio -> Canais)
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-2): story-2.4 - Studio CRUD completo - ENDPOINT MVP ALCANCADO"
```

---

## 📊 Tracker de Progresso - EPIC-02

| Story | Título | Sprint | Status | Responsável Design |
|-------|--------|--------|--------|---------------------|
| 2.1 | Supabase Seeding & Fetching | 4 | ⏳ Documentar | @sm |
| 2.2 | Pipeline Real (Kanban Canais) | 4 | ⏳ Documentar | @sm |
| 2.3 | Laboratório: Transições de Estado | 5 | ⏳ Documentar | @sm |
| 2.4 | Studio Blueprint de Ponta a Ponta | 5 | ⏳ Documentar | @sm |

---

## 🏁 Próximos Passos (Workflow AIOX)

Para você **nunca se perder**, sempre que todas as stories acima estiverem finalizadas (commitadas e validadas), você deve decretar o encerramento da frente de engenharia e voltar ao planejamento estratégico (Level UP na fase).

**Comando para encerrar o Epic-02:**
Quando o QA der aprovação da Story 2.4 e tudo estiver commitado, ative a camada estratégica com:

```
@[.agent/workflows/pm.md] O EPIC-02 foi 100% implementado. Feche as pendências no guia e inicie o briefing do próximo grande objetivo do projeto no contexto AIOX.
```
*(Esse comando vai me avisar (Morgan) que terminei meu ciclo passivo nesta onda e assumo o volante para planejar o EPIC-03 ou a Fábrica).*

---

*Guia Técnico Gerado por @pm (Morgan).*
