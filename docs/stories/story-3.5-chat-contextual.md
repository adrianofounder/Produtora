# Story 3.5 — Chat Contextual e Personas de Produção

**Story ID:** 3.5 (EPIC-03)
**Epic:** [EPIC-03 — A Máquina de Criação (Integração IA e Motores)](./EPIC-03-FABRICA-E-IA.md)
**Sprint:** 7 — Sonorização e Empacotamento
**Prioridade:** 🟡 P1 — Aprimoramento da Governança de IA
**Estimativa:** 12h
**Assignee:** @dev
**Status:** ⏳ **TO DO**

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

- [ ] **AC1 (Interface Multitab):** O componente do Chat Assistant é renderizado na Gaveta de Produção, podendo se recolher (collapse). Ele acompanha as mudanças de abas da gaveta.
- [ ] **AC2 (Mutações de Persona):** Quando a aba ativa muda (ex: de Roteiro para Ouvir), o chat zera (ou troca escopo) e adota um **System Prompt** diferente. Em "Roteiro": Persona Diretora Criativa/Roteirista. Em "Ouvir": Persona Diretor de Som/Copydesk de áudio.
- [ ] **AC3 (Acesso Abstrato Server Action):** Uma nova Server Action (`chatAssistantAction`) para lidar com mensagens, chamando a fachada provedora genérica e persistindo uso.
- [ ] **AC4 (Integração com Tracker):** Qualquer requisição ao chat deve acionar preventivamente a `Story 3.1` (Teto de Custos). Esgotando, o bot retorna uma bolha nativa de ui de erro ("Teto Diário Atingido, libere configurações").
- [ ] **AC5 (Gestão de Estado de UI):** Mensagem de carregamento local otimista ("O Diretor está digitando..."), tipografia correta e scroll em tela no caso de longas resoluções.
- [ ] **AC6 (Sem Quebras de Build):** TypeScript estrito no Schema das trocas de chat. `npm run build` deve passar com Exit code: 0.

---

## 🛠️ Dev Notes — Contexto Técnico (Handoff para @dev)

### Dicas de Implementação
- **Componentização:** Considere um `ContextualChat.tsx` que recebe a property `activeTab` para identificar qual injeção de config ele puxa:
```typescript
const systemPrompts = {
  SCRIPT: "Você é um roteirista de alto nível focado no canal...",
  AUDIO: "Você é um técnico de som avaliando dicção tonal...",
  ASSETS: "Você é um editor de multimídia empacotando exports..."
};
```
- A Server Action recebe não só o questionamento (`prompt`), mas o **Blueprint Context** para não ficar amnésico ao que o canal produz.
- Se possível, usar a propriedade "streaming" do `ITextEngine` ou fallback para requisição atrelada. Lembre-se, não travar o frontend em caso de timeout de respostas.
- Certifique-se de expor via Zustand o Histórico das últimas mensagens para não limpar ao fechar e abrir a Gaveta muito rápido.

---

## 📅 Tasks / Subtasks

### Task 1 — Modificação de Store e UI Base
- [ ] 1.1 Criar mini estado com Zustand ou React State para o array de `Message` (role: user | assistant), por aba.
- [ ] 1.2 Layout inicial (Sidebar flexível contrapondo com a VUI) em `gaveta-producao.tsx`.

### Task 2 — Arquitetura de Back-end (Server Action)
- [ ] 2.1 Criar a Action `gavetaChatAction(messages: Message[], contextType: TabType, blueprint: Blueprint)`.
- [ ] 2.2 Integrar a action no `consumption-tracker.ts` antes de consultar mock/API real.

### Task 3 — Integração e Anti-happy Path
- [ ] 3.1 Tratamento de falhas: Renderizar mensagem estilo bolha de "Mensagem não entregue devido à desconexão" ou "Timeout".
- [ ] 3.2 Otimizar tipagens (strict type-checking).

### Task 4 — Quality Gate
- [ ] 4.1 Validação do Linter (`npm run lint`).
- [ ] 4.2 Execução de verificação de limites falsificada (Testar esgotamento de quota via proxy bot).

---

## 🧪 CodeRabbit Integration (Quality Planning)

**Story Type Analysis:** Frontend Interaction (Chat VUI), API Abstraction (Continuous Conversation), Resource Limit Verification.
**Specialized Agent Assignment:** `@dev` responsável pelo state management do novo chat e conexão sem quebrar editor VUI. `@qa` testar transição rápida de abas e estouro de chamadas.
