# Story 3.4 — Empacotamento Visual e Retaguarda do Asset (Aba 4 e 5)

**Story ID:** 3.4 (EPIC-03)
**Epic:** [EPIC-03 — A Máquina de Criação (Integração IA e Motores)](./EPIC-03-FABRICA-E-IA.md)
**Sprint:** 7 — Sonorização e Empacotamento
**Prioridade:** 🔴 P0 — Fechamento do escopo de Geração
**Estimativa:** 8h
**Assignee:** @dev
**Status:** ✅ **CONCLUÍDO**

---

## 📖 User Story

**Como** usuário do AD_LABS (Maestro),
**Quero** gerar de forma assistida a Thumbnail Visual a partir das diretrizes do meu Blueprint, revisar os assets criados nas etapas anteriores, empacotá-los em um único ZIP e finalizar o vídeo,
**Para que** eu tenha na minha máquina (.txt, .mp3, .png) os ingredientes brutos para a renderização física final em outros hardwares, e possa mover fluídamente o status do card no Kanban de Canais de volta para a minha estante.

---

## 🔍 Contexto / Problema

Esta story materializa o término do ciclo gerativo dentro da "Gaveta de Produção". É a ponte entre as criações puramente na nuvem/AI e o mundo de renderização offline das Editorias (Ex: Premiere / After Effects / CapCut).

### Diretrizes Críticas:
1. **Zero tolerância ao Happy-Path:** Integração visual de Thumb também deve possuir teto de gastos. A aba final de exportação deve considerar que se algo falhou nas abas anteriores (Text ou TTS), o sistema de Zip / Download deve lidar com os assets parciais ou alertar o usuário sem dar erro de "undefined is not an object".
2. **Download Nativo Client-Side:** Utilizar ferramentas otimizadas (como `jszip` ou API File do navegador) para baixar simultaneamente multiplos links do Supabase Storage. O tráfego de Blob pode ficar no front-end para juntar os pedaços.
3. **Persistência de Status do Vídeo:** Ao clicar no botão "Finalizar para a Estante", a Gaveta fará uma mutação Server Action no vídeo correspondente trocando o pipeline status dele (saindo do limbo de produção para "Concluído" no Laboratório/Kanban), seguido do fechamento da Gaveta de forma animada/limpa (optimistic updates).

---

## ✅ Acceptance Criteria (Definition of Done)

- [x] **AC1 (Interface Aba Capa - Modelagem Visual):** Na Aba 4, deve existir um conector (abstrato simulando ex. Midjourney/DALL-E) puxando o prompt do Blueprint, com botão "Esboçar Concept" e logando tokens de consumos. O Output (mock png) deve salvar no Storage do Supabase.
- [x] **AC2 (Aba Retaguarda & Resumo):** Na Aba 5, a view lista todos os artefatos "engatilhados": `[✓] Script.txt`, `[✓] Paragraph-x.mp3`, `[✓] Thumbnail.png`.
- [x] **AC3 (Download do Pacote):** Ação de "Realizar Download dos Arquivos Atuais" que baixa fisicamente um pacote ZIP local com tudo.
- [x] **AC4 (Action de Finalização Estante):** Botão principal verde de Finalização, que ao rodar, muta o status do video no banco global para o proximo status e fecha a Drawer com transição.

---

## 🛠️ Dev Notes — Contexto Técnico (Handoff para @dev)

### Architecture Context:
- O painel deve ser state-aware. O `video` e `blueprint` contexts vão alimentar `VideoDrawer`.
- Para arquivos Zip front-end em projetos Next, cuidado com tamanhos grandes, o ideal é usar blobs seguros com URL object URL, ex:
```typescript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// Lembrete: Cuidado com CORS ao baixar das URLs públicas do Supabase para injetar no JSZip na hora do agrupamento.
```

- Adicione dependências (`jszip`, `file-saver`) somente se julgar melhor do que window.open multi-tabs, que seria pior e bloquearia popup no chrome.
- Atualize transições de Kanban e faça um teste End-To-End de uma gaveta passando de "vazio" a completamente exportado.

---

## 📅 Tasks / Subtasks

- [x] 1. Aba 4 UI: Visão de Imagem (Thumbnail Previewer, geração mockada com tracking de teto).
- [x] 2. Aba 5 UI: Checklists visuais e Sumarização dos links publicos existentes no Storage.
- [x] 3. Função de Zipping Front-end (Fetch em blob -> jsZip -> saveAs).
- [x] 4. Atualização de status da tabela Videos + Fechar janela + React Revalidate do Kanban (SWR ou Next revalidatePath).

---

## 🧪 CodeRabbit Integration (Quality Planning)

**Story Type Analysis:** Frontend Workflow Closing, DOM File Blob Management, React Context/State Mutations com optimistic ui, CRUD State update.
**Specialized Agent Assignment:** `@dev` fará UI e interações do Zip. `@qa` testará baixar mock zip vazio, limites falhados na mock de IA, e se o componente quebra com CORS de Storage desconfigurado.
