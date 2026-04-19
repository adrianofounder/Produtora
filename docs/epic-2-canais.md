# Epic 02: Gestão de Canais — Kanban de Vídeos

**Status**: Done (Retroativo)
**Route**: `/canais`
**Commit de referência**: `539f97c feat(ui): Epic 1 + Epic 2 — Lendária Dark Mode Cockpit`
**Nota**: Story criada retroativamente para fechar a governança do ciclo SM → Dev → QA. O código foi implementado junto com o Epic 1 numa única sessão antes do processo AIOX ser formalizado.

---

## Story 01: Seletor de Canal com Pipeline Stats
**Agent**: `dev`
**Componente**: embutido em `src/app/(dashboard)/canais/page.tsx`

### Descrição
Grid de 3 colunas com cards clicáveis de canal. Cada card exibe nome, badge "Maré Ativa" e contadores de pipeline (Plan / Prod / OK / Pub). O canal ativo recebe borda violeta.

### Critérios de Aceitação (Verificados ✅)
- [x] Grid responsivo: 1 col mobile, 3 col desktop
- [x] Card ativo com `border: 1px solid rgba(124,58,237,0.35)`
- [x] Badge "Maré Ativa" com `badge-accent` e ícone `<Activity />`
- [x] Contadores com cores semânticas: Prod = `var(--color-accent)`, OK = `var(--color-success)`
- [x] Estado gerenciado via `useState(canalAtivo)`

---

## Story 02: Barra de Filtros + Busca
**Agent**: `dev`
**Componente**: embutido em `src/app/(dashboard)/canais/page.tsx`

### Descrição
Row de filtros por status de vídeo (Todos / Planejamento / Em Produção / Prontos / Agendados / Publicados) com contagem dinâmica, campo de busca por título e botão "Novo Vídeo".

### Critérios de Aceitação (Verificados ✅)
- [x] Filtros com estado ativo: `background: rgba(124,58,237,0.15)`, cor `var(--color-accent)`
- [x] `countPorStatus()` atualiza contagem em tempo real
- [x] Input de busca usa classe `.input` do design system
- [x] Botões "Filtrar" e "Novo Vídeo" usam `.btn-ghost` e `.btn-primary`

---

## Story 03: Kanban Vertical de Vídeos
**Agent**: `dev`
**Componente**: `src/components/dashboard/video-card.tsx`

### Descrição
Componente atômico `<VideoCard />` que representa cada vídeo no pipeline. Exibe título, eixo temático, data de previsão, status badge e barra de steps de produção (7 etapas: Título → Roteiro → Áudio → Imagens → Montagem → Thumb → Agendado).

### Critérios de Aceitação (Verificados ✅)
- [x] Status: `planejamento` (muted), `producao` (accent), `pronto` (success), `agendado` (azul), `publicado` (muted)
- [x] Progress steps com círculo preenchido (`var(--color-success)`) para steps concluídos
- [x] Filtro aplicado filtra `videosFiltrados` em tempo real
- [x] Estado vazio com mensagem estilizada (border dashed)
- [x] Mock data com 5 vídeos reais do eixo "Trabalho"

---

## Arquivos Entregues

| Arquivo | Status |
|---|---|
| `src/app/(dashboard)/canais/page.tsx` | ✅ Implementado |
| `src/components/dashboard/video-card.tsx` | ✅ Implementado |

## Definition of Done
- ✅ Tela funcional com filtros e busca reativos
- ✅ Componente `VideoCard` atômico no design system Lendária
- ✅ Zero cores hardcoded fora do design system
- ✅ Incluído no commit `539f97c`

---

## 🧠 Doutrina de Engenharia e Negócios (Injetada pelo PRD)

> **ATENÇÃO @dev e @qa**: Extrato do PRD (Seções 4, 6.2 e 10). Estas são as leis da "Fábrica" que não aparecem puramente nos Mocks mas regem o Workflow.

### 1. Gaveta de Produção (A Linha de Montagem)
O clique num `<VideoCard />` abre uma modal lateral de **5 Abas Sequenciais Inquebráveis**:
1.  `📝 Título`: IA injeta Blueprint para gerar variações.
2.  `📜 Roteiro`: Editor de texto alimentado pela receita do Studio.
3.  `🎙️ Narração`: Áudio ElevenLabs gerado em **blocos/parágrafos soltos**, para evitar recálculo (e CUSTO financeiro de API) no vídeo inteiro se o usuário corrigir apenas o parágrafo B.
4.  `🖼️ Thumb`: Assets visuais e título final cravado.
5.  `📦 Pacote`: Renderização/Auditoria Final (`.mp4 + mp3`). Auto-retry de 3x se a API do YouTube falhar o envio.

### 2. Máquina de Auto-Refill (Automação Background)
Regida pela Seção 10. O Kanban de Canal **precisa** interagir com Cronjobs:
*   O usuário configura o **Estoque Mínimo** de produção.
*   Se o usuário aprova 2 pacotes na Gaveta e os despacha, a coluna Diminui. A IA de madrugada roda sozinha: Extrai o Eixo em Alta, puxa o Blueprint vigente, e **gera N roteiros** injetando direto como cards novos na coluna "Em Produção".

### 3. Autoria de Aprovação (Audit Trail - NFR06)
Sempre que uma etapa da Gaveta é aprovada, o sistema deve registrar via timestamp + autor. Autor deve suportar flags lógicas: `Administrador`, `Editor Freelance` ou `[Auto-Refill Lv3 automática]`.
