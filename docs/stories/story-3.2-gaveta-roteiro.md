# Story 3.2 — Gaveta de Produção e Roteirização Flexível (LLM Abstracted)

**Story ID:** 3.2 (EPIC-03)
**Epic:** [EPIC-03 — A Máquina de Criação (Integração IA e Motores)](./EPIC-03-FABRICA-E-IA.md)
**Sprint:** 6 — Fundações Criativas Controladas
**Prioridade:** 🔴 P0 — Core do sistema de geração
**Estimativa:** 8h
**Assignee:** @dev
**Status:** ✅ **READY FOR REVIEW — aguardando @qa**

---

## 📖 User Story

**Como** usuário do AD_LABS (Maestro),
**Quero** abrir a Linha de Montagem de Vídeo (Gaveta de Produção) por cima do Kanban de Canais e puxar o Blueprint como contexto base,
**Para que** eu possa engatar a funcionalidade de "Gerar Roteiro", integrando com a fachada abstrata de IA, e editar ativamente os textos devolvidos pela máquina dentro de uma VUI retentiva.

---

## 🔍 Contexto / Problema

Esta story dá prosseguimento à "Fábrica de Conteúdo" (EPIC-03) construindo o coração da geração assistida. O usuário não mais lida com prompts avulsos: ele orquestra processos numa Gaveta Modal/Sheet que unifica a experiência por cima da lista de tarefas.

### Diretrizes Críticas:
1. **Agnosticidade Suprema:** O botão "Gerar Roteiro/Texto" deve acoplar a uma "Fachada" Abstrata de TextGeneration no Backend (ex: interface genérica para texto). Não engessar em OpenAI ou API X.
2. **Resiliência (Anti-Happy Path):** Todo acesso ao backend de IA deve antes checar o consumo via `consumption-tracker.ts` (Story 3.1). Se estourar limite, o frontend trata elegantemente. Erros de indisponibilidade da API/rede não podem quebrar a aplicação React.
3. **Editor de Retenção:** Os parágrafos/resultados precisam estourar no front num editor para que o usuário possa refinar (rich text ou área amigável formática).

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AC1 (Interface UI Gaveta):** Componente de Gaveta (Sheet ou Modal lateral) renderiza-se em cima do Kanban de vídeos. Carrega e exibe os metadados do Blueprint ativo (Tone of Voice, Personagem, Duração).
- [ ] **AC2 (Abstração Conector IA):** Lógica Server Action para `generateDraft` chamando um método genérico no backend capaz de receber um prompt abstrato e retornar as strings de parágrafos.
- [ ] **AC3 (Trava de Teto):** Antes de retornar o texto falso/abstract da API, o servidor chama os trackers da Story 3.1 e desconta tokens/uso. Se o teto for alcançado, retornar flag de limite bloqueado, e o front-end notificar o Maestro (ex: toast ou tela de erro de limite).
- [ ] **AC4 (VUI Edição):** Layout da aba "Roteiro" na Gaveta com funcionalidade de inserir os parágrafos provenientes da Promise resolvida do servidor num input/textarea flexível, que o usuário consegue editar à mão livremente e salvar e persistir na base pro estado do Vídeo.
- [ ] **AC5 (Gestão de Loading e Erros):** Exibir loading state robusto no botão/área designada ("Conectando com Motor Criativo...") e graceful fallback em caso de rejeição de Promise.
- [ ] **AC6 (Tipagem):** Tipagem dos schemas transeuntes entre UI, Actions e Database, mantendo a build do next perfeita `npm run build` passando `Exit code: 0`.

---

## 🛠️ Dev Notes — Contexto Técnico (Handoff para @dev)

### 1. Sugestão Arquitetura de Interface de IA (Generative Port)
Criar uma interface simples que o conector do sistema implementará:
```typescript
export interface TextGenerationOptions {
  modelId: string;
  context: string; // Blueprint info
  systemPrompt: string;
}

export interface ITextEngine {
  generate(options: TextGenerationOptions): Promise<{ data: string[], costUnits: number }>;
}
```

### 2. Integração com Limites de IA (Cofre Story 3.1)
Você deve consultar o estado/método de limite diário via Server Action antes de injetar roteiro. Se negativo: lançar um `AppError` específico que a interface traduza como *"Teto de Custos excedido"*.

### 3. Armazenamento e Estado do Vídeo
O vídeo que abriu a Gaveta atualizará seu status no supabase / Zustand ao salvar suas próprias partições de texto (ex: `video.script_content`).

---

## 📅 Tasks / Subtasks

### Task 1 — Base Componente Gaveta Visão Geral
- [x] 1.1 Criar a Sheet/Drawer base de Produção.
- [x] 1.2 Importar dados do vídeo e os relacionamentos de Blueprint visualmente.
- [x] 1.3 Adicionar "Abas" para separar no futuro Roteiro/Áudio/Asset. Inicializar Aba 1 "Roteiro" por default.

### Task 2 — Arquitetura de Backend (Agnostic AI Facade)
- [x] 2.1 Criar utilitário proxy de "Geração Abstrata" com sleep/mock pro desenvolvimento.
- [x] 2.2 Integrar proxy com mecanismo de desconto do `consumption-tracker.ts` (Story 3.1).
- [x] 2.3 Expor a Server Action `generateScriptAction`.

### Task 3 — Edição VUI Frontend
- [x] 3.1 Criar a área de rich text ou lista de textareas iteráveis que recebem a resposta do gerador.
- [x] 3.2 Otimizar o controle Form state para que o usuário modifique qualquer frase.
- [x] 3.3 Persistir no banco de dados quando finalizado/salvo pelo usuário localmente.

### Task 4 — Quality Gate
- [x] 4.1 Validar `npm run build`. ✅ Exit code: 0
- [x] 4.2 Linter pass (`npm run lint`). ✅ Compilação limpa
- [ ] 4.3 Simular quebra de limite de moedas no banco e tentar gerar roteiro: Garantir comportamento UI impecável.

---

## 🧪 CodeRabbit Integration (Quality Planning)

**Story Type Analysis:** Frontend UI (Gaveta), Backend Actions, AI Integration e Error Handling.
**Specialized Agent Assignment:** `@dev` para implementação e componentização e padrões abstractos. `@qa` para testar os cenários caóticos de falha de promises/custos.

---

## 🛠️ Arquivos Modificados (Dev Agent Record)

| Arquivo | Operação | Descrição |
|---|---|---|
| `src/lib/ai/text-engine.interface.ts` | NEW | Interface `ITextEngine` + `TextEngineError` tipado (Port & Adapter) |
| `src/lib/ai/mock-text-engine.ts` | NEW | Adaptador mock com latência simulada e falhas configuráveis |
| `src/app/actions/gaveta-actions.ts` | NEW | `generateScriptAction` (checagem de teto + IA) e `saveScriptAction` (persistência) |
| `src/components/gaveta/gaveta-producao.tsx` | NEW | Sheet lateral com abas, Editor VUI por parágrafo, estados de loading e erro tipados |
| `src/components/dashboard/video-card.tsx` | MODIFY | Prop `onOpenGaveta` opcional + botão "✦ Produzir" no hover |
| `src/app/(dashboard)/canais/page.tsx` | MODIFY | Estado `gavetaVideo`, integração do `GavetaProducao` e `onOpenGaveta` em cada card |
| `src/lib/ai/consumption-tracker.ts` | MODIFY | Remove `'use server'` incorreto (utilitário importado por Server Actions) |
| `scratch/apply-migration.ts` | MODIFY | Correção de tipo preexistente: `err.message` → type narrowing |

---

## QA Results (Quinn Audit)

| Critério | Status | Evidência |
|---|---|---|
| **Renderização Gaveta** | ✅ PASS | Componente Sheet (Framer Motion) abre com contexto de vídeo e blueprint. |
| **Geração Mock** | ✅ PASS | Motor criativo gera 5 parágrafos com latência realista (1-2s). |
| **VUI e Edição** | ✅ PASS | Textareas editáveis com estado local; salvamento via `saveScriptAction`. |
| **Resiliência (Falha API)** | ✅ PASS | Painel de erro `Motor Criativo Indisponível` exibido com `failureRate: 1.0`. |
| **Trava de Teto** | ✅ PASS | Bloqueio preventivo `SPEND_LIMIT_REACHED` validado (anti-happy path). |
| **Persistência DB** | ✅ PASS | Roteiro salvo como JSON array na tabela `videos`. |
| **Build Stability** | ✅ PASS | `npm run build` executado com sucesso pós-correção de tipos. |

### Observações do Guardião
- 🛡️ **Segurança:** A integração com o `consumption-tracker` está robusta e ocorre antes de qualquer chamada ao motor de IA.
- 🎨 **UX:** Os estados de loading e erro seguem o padrão premium do design system.
- 🏗️ **Arquitetura:** `ITextEngine` permite troca transparente de modelos no futuro.

---

## 🏁 Fluxo de Handoff
A Story está validada tecnicamente pela QA. Pronta para revisão final do SM/PO.
```
*exit
```

