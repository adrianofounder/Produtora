# Guia de Execução — EPIC-02: Validação do Fluxo MVP (Pré-Produção)

**Status**: Ready for Planning / Em Discussão
**Objetivo Escopo**: Substituir o repositório de "Mock Data" (dados falsos construídos na etapa de UI) por integrações reais com o Supabase, permitindo que as áreas já construídas (Tendências → Laboratório → Studio → Canais) conversem entre si. O propósito é testar de ponta a ponta o planejamento de conteúdo, ANTES de começarmos a construir a "Fábrica de Vídeos" (Renderização/Edição pesada).

> **Atenção PM/PO**: O intuito deste Epic não é criar novas telas visuais (UI), mas sim **dar vida funcional** ao que foi desenhado nos Epics de 1 a 7.

---

## 🏗️ Requisitos Estratégicos (Product)

1. **Gestão de Estado Global/API**: O front-end deve parar de ler `const MOCK_DATA` e passar a consumir `supabase.from('...')`.
2. **Ciclo de Vida do Conteúdo (Pré-Produção)**: 
   - Uma ideia observada em `/tendencias` pode ser garimpada.
   - Vai para o `/laboratorio` para testes e é aprovada.
   - Envia-se para o `/studio` para a escrita do Blueprint.
   - Sai do Studio aprovada e cai no pipeline do veículo em `/canais` (Kanban).
3. **Simulação da IA (Stub/Proxy)**: Ainda não gastaremos grandes recursos desenvolvendo agentes de IA extratores profundos. No lugar, utilizaremos chamadas simples para LLM ou "Simulação/Mock de delay" apenas para validar se o fluxo de estados (Loading -> Success -> Interface) da plataforma quebra ou funciona na prática.

---

## 🗺️ Mapa de Histórias (User Stories Inicial)

### Story 2.1 — Supabase Seeding & Data Fetching Base
- **Objetivo**: Criar scripts de seed reais no Supabase com os dados que estavam nos mocks de laboratório e tendências, e configurar os repositórios para buscar esses dados na raiz dos Server Components do Next.js.
- **Milestone**: O dashboard carrega sem quebrar, mas agora a partir da nuvem.

### Story 2.2 — Integração do Pipeline (Kanban Canais)
- **Objetivo**: O Kanban de canais (epic-2) precisa refletir alterações em tempo real no banco. Arrastar um vídeo de `planejamento` para `producao` (ou clicar em um botão de ação) deve disparar um server action que atualiza a row no banco e revalida a página.

### Story 2.3 — Fluxo Tendências → Laboratório
- **Objetivo**: Implementar a lógica de negócios da aba Laboratório. Clicar em "Analisar/Enviar pra IA" deve criar um registro de Análise no banco com status `pendente`. Quando aprovada, a ideia tem seu status atualizado para ir à fábrica ou estúdio (conforme fluxo do negócio).

### Story 2.4 — Studio Blueprint Engine (CRUD Real)
- **Objetivo**: Ao abrir `/studio`, ele deve conseguir buscar do banco as informações reais pré-populadas ou receber um ID por URL (ex: `/studio?ideiaId=123`). O Blueprint construído no React (hook, dev, CTA) deve ser salvo no supabase como um payload de roteiro finalizado atrelado à ideia, mudando seu step no kanban.

---

## 🚦 Critério de Sucesso do EPIC-02

O EPIC-02 será considerado "Concluído" no momento em que um usuário (nós mesmos iterando como QA) conseguir:
1. Logar no Dashboard
2. Entrar no Laboratório e aprovar 1 Ideia nova simulada.
3. Levar essa Ideia para o Studio e escrever/salvar o roteiro.
4. Conferir a Ideia aprovada parada no status "Aguardando Produção" no Kanban de Canais.

Nesse momento, a teoria é validada. Estaremos prontos, seguros e com a arquitetura firme para entrar no EPIC da **Fábrica de Vídeos**.

---

*Gerado por @pm (Morgan) — AIOX Workflows*
