# Story 3.5 — Chat Contextual e Personas de Produção

**Story ID:** 3.5 (EPIC-03)
**Epic:** [EPIC-03 — A Máquina de Criação (Integração IA e Motores)](./EPIC-03-FABRICA-E-IA.md)
**Sprint:** 7 — Sonorização e Empacotamento
**Prioridade:** 🟡 P1 — Aprimoramento da Governança de IA
**Estimativa:** 12h
**Assignee:** @dev
**Status:** 🟢 **Ready for Review**

---

## 📖 User Story

**Como** usuário do AD_LABS (Maestro),
**Quero** ter acesso a um mini-chat contextualizado em cada aba dentro da Gaveta de Produção (Roteiro, Áudio, Assets),
**Para que** eu possa tirar dúvidas e pedir ajustes finos aos textos, áudios e pacotes, conversando com "System Prompts" de especialistas (ex: Roteirista, Técnico de Som), sem precisar sair do fluxo de trabalho.

---

## 🔍 Contexto / Problema

Enquanto as Stories anteriores preveem a geração *one-shot* e edição manual (VUI) do conteúdo, a complexidade inerente da criação audiovisual frequentemente pede refinamentos assistivos iterativos ("refaça esse parágrafo para ficar mais engraçado"; "esse áudio devia ter mais energia").

A inclusão de um Chat Contextual serve como a "interface de conversa direcional" na Gaveta, respeitando a arquitetura existente.

### Diretrizes Críticas:
1. **Agnosticidade Preservada:** O chat utilizará a fachada `ITextEngine` ou similar, sem engessamento direto com APIs, trafegando um System Prompt trocado dinamicamente conforme a aba atual.
2. **Respeito aos Tetos de Custos:** Como ocorre toda vez que tocamos em um motor, o chat deve checar e faturar no `consumption-tracker.ts`. O bloqueio "Anti-Happy Path" impede respostas do bot se o usuário estiver estourado.
3. **Design System:** O Chat deve ser sutil e não competir em espaço com a funcionalidade primária da aba (textareas de edição ou players de áudio).

---

## ✅ Acceptance Criteria (Definition of Done)

- [x] **AC1 (Interface Multitab):** O componente do Chat Assistant é renderizado na Gaveta de Produção, podendo se recolher (collapse). Ele acompanha as mudanças de abas da gaveta.
- [x] **AC2 (Mutações de Persona):** Quando a aba ativa muda (ex: de Roteiro para Ouvir), o chat zera (ou troca escopo) e adota um **System Prompt** diferente. Em "Roteiro": Persona Diretora Criativa/Roteirista. Em "Ouvir": Persona Diretor de Som/Copydesk de áudio.
- [x] **AC3 (Acesso Abstrato Server Action):** Uma nova API Endpoint em `/api` ou Server Action para lidar com mensagens, chamando a fachada provedora genérica e persistindo uso.
- [x] **AC4 (Integração com Tracker):** Qualquer requisição ao chat deve acionar preventivamente a trava de teto de custos (`consumption-tracker.ts`). Esgotando, o bot retorna uma bolha nativa de ui de erro ("Teto Diário Atingido").
- [x] **AC5 (Gestão de Estado de UI):** Mensagem de carregamento local otimista ("O Diretor está digitando..."), tipografia carreta do shadcn/ui.
- [x] **AC6 (QA Sem Quebras):** Funcionalidade testada falhando requisições intencionalmente para atestar o tratamento de erros.

---

## 🛠️ Dev Notes — Contexto Técnico (Handoff para @dev)

- **API Specifications:** As requisições do chat devem possuir endpoints protegidos alinhados com o App Router do Next.js `[Source: architecture/system-architecture.md#🔌 Pontos de Integração]`.
- **File Locations:** A funcionalidade de chat possivelmente ficará aninhada aos componentes da gaveta de produção sob `src/components/` interligada a uma rota handler em `/app/api/ia/chat` ou similar `[Source: architecture/system-architecture.md#📁 Estrutura de Pastas (src/)]`.
- **Tech Constraints:** Usar tipagens rigorosas em TypeScript e gerenciar o histórico de `messages` com base em `useState` local ou Server Action patterns para evitar perda de dados e compatibilidade com React 19 `[Source: architecture/system-architecture.md#🏗️ Stack Tecnológico]`.
- **Project Structure Notes:** Todo componente visual do chat deverá seguir a padronização das classes de TailwindCss v4 integráveis ao Radix/shadcn `[Source: architecture/system-architecture.md#🏗️ Stack Tecnológico]`.

---

## 📅 Tasks / Subtasks

- [x] Task 1 (AC: 1, 5) — Criar layout base `ContextualChat.tsx` integrável nas abas da Gaveta de Produção (com suporte a collapse).
- [x] Task 2 (AC: 2) — Lógica de state management para manter Arrays de Mensagens e carregar *System Prompts* de acordo com a aba visível (`activeTab`).
- [x] Task 3 (AC: 3) — Criar Server Action ou Rota de API (ex: `gavetaChatAction`) para processamento LLM Agnóstico.
- [x] Task 4 (AC: 4) — Acoplar `consumption-tracker.ts`. Checar limite antes, bloquear requisição e retornar alerta real à interface caso quota esgotada.
- [x] Task 5 (AC: 6) — Teste Manual e Tratamento de Exceções (`try/catch` nativo para TIMEOUT/500). Validação do Linter (`npm run lint`).

---

## 🤖 CodeRabbit Integration

  Story Type Analysis:
    Primary Type: API
    Secondary Type(s): Frontend
    Complexity: Medium

  Specialized Agent Assignment:
    Primary Agents:
      - @dev (pre-commit reviews)

    Supporting Agents:
      - @qa (verificar estouro de consumos e troca de tabs)

  Quality Gate Tasks:
    - [x] Pre-Commit (@dev): Verificar linter, tipagem TypeScript (strict) e ausência de placeholders temporários na action do LLM.
    - [x] Pre-PR (@github-devops): Garantir conformidade com os tetos de token anti-happy path antes de merge final.

---

## 🔬 QA Results

### 🧪 Test Scenarios & Verdicts

| Scenario | Given | When | Then | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Tab Context Transition** | Drawer is open | Switch between 'Roteiro' & 'Áudio' tabs | Chat persona (Header & identity) changes correctly | **PASS** |
| **History Isolation** | Message sent in Tab A | Switch to Tab B and back to A | History in Tab A is preserved, Tab B starts clean | **PASS** |
| **Consumption Locking** | Daily limit is reached | Send message to Chat | `checkSpendLimit` blocks request with proper UI error | **PASS (Audit)** |
| **Identity Injection** | Blueprint is active | Send message to Chat | Response uses Blueprint data (Voice, Emotion) in and Identity | **PASS** |

### 🚩 Notes & Risk Assessment
- **State Persistence**: The current implementation handles history in volatile React state. This is acceptable for the current MVP scope, but should be monitored if users expect long-lived conversations.
- **Spending Accuracy**: `contextualChatAction` correctly invokes `incrementSpend` only after success, adhering to the anti-happy path doctrine.

**Gate Decision:** 🟢 **PASS** (Ready for Merge)
— Quinn, guardião da qualidade 🛡️
