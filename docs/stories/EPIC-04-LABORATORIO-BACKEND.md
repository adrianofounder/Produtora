# EPIC-04: Laboratório — Integração Backend, AI e Auto-Refill

### 🤖 Motores Recomendados (Otimização de Tokens / Custo)
*   ✍️ **Claude Sonnet / Gemini 3.1 Pro (High)**: Para orquestrar as nuances complexas de negócio, estruturação das `User Stories` e refinamento inicial do guia.
*   🧠 **Claude Opus / Sonnet (Thinking)**: Essencial para desenhar o Database schema complexo do "DNA de Eixos/Tendências" e estruturar o Background Job (Cron `Auto-Refill`) lidando com regras pesadas de negócio sem desvios.
*   🛠️ **Gemini 3.1 Pro (Low) / GPT-OSS 120B**: Ótimo para integrações lineares de UI -> Backend (consertar componentes TypeScript, gerenciar estado do UI React) e hooks do banco de dados (Supabase `select`/`update`).
*   ⚡ **Gemini 3 Flash**: Para processos de Code Review extensivos sobre `RLS` e testes exaustivos das travas de auto-consumo nas madrugadas.

## Epic Goal
Transformar a UI estática do Laboratório (Epic 4 MVP) em um motor dinâmico e inteligente de experimentação e tendências, conectado ao Supabase e impulsionado por background jobs (Cron) para a geração automatizada de conteúdo ("Auto-Refill"), respeitando o teto orçamentário do EPIC-03.

## Existings System Context
- **Funcionalidade Atual**: A página `/laboratorio` possui a UI pronta (Bento Grid, EixoCard, IdeiasTable, TrendAnalysis) mas renderiza mock data. 
- **Tecnologias**: Next.js (App Router), Supabase (PostgreSQL + RLS), Tailwind v4.
- **Integração**: Conecta o "Módulo 5 (Laboratório)" com o "Módulo 4 (Canais/Fábrica)". Depende do `IConfig` e cofre de senhas do EPIC-03.

## Enhancement Details
- O que será alterado/adicionado:
  1. **Acesso Dinâmico ao Banco**: Consumir Eixos e Ideias reais do banco com RLS estrito (NFR03).
  2. **Motor Analítico (Marés)**: Cálculo do `score_mare` e taxa de aprovação normalizada em tempo real para rankear eixos.
  3. **Auto-Refill (Cronjob)**: Serviço de retaguarda (background/API route) para preenchimento de pauta. Se a fila do Kanban "Fábrica" estiver `< 2 vídeos`, o cronjob chama a IA para gerar +5 ideias do "Eixo Vencedor" sem ação humana, registrando auditoria `[Automação Lvl 3]` (NFR06).
  4. **Controle Manual (Master Override)**: Botão no Frontend que anula o ranqueamento numérico e define manualmente qual eixo "Venceu".
  5. **Disparo Manual**: Funcionalidade real no botão `[+ Enviar Lote de 5 para a Fábrica]` que transita Ideias para o status `[planejamento]`.

## Histórias Planejadas (Designação para o SM)

> **Executores (Dynamic Executor Assignment)**:
> Seguir a tabela: Lógica (@dev / Gate: @architect), Banco de Dados (@data-engineer / Gate: @dev).

1. **Story 4.1: Modelo de Dados e RLS do Laboratório**
   - **Executor**: `@data-engineer`, **Quality Gate**: `@dev`
   - Tarefa: Estruturar as tabelas (Eixos com 20 campos de DNA e Ideias), configurar as RLS entre tenants, e validar a consistência com o banco do Módulo Canais. Integração da Ficha Técnica Mestre.

2. **Story 4.2: Integração da UI e Master Override**
   - **Executor**: `@dev`, **Quality Gate**: `@architect`
   - Tarefa: Remover o mock data do front-end (`/laboratorio`). Consumir os dados ao vivo do Supabase. Implementar a mutação do botão "Venceu" (Override) e do botão "Enviar P/ Fábrica".

3. **Story 4.3: O Motor Marés (Analytics e Score)**
   - **Executor**: `@dev`, **Quality Gate**: `@pm`
   - Tarefa: Lógica de ingestão e normalização do `score_mare` (0-100) para calcular a cor das barras e definir o Líder do Ranking de forma orgânica. 

4. **Story 4.4: Auto-Refill e Automação de Madrugada (Cronjob)**
   - **Executor**: `@devops` (Infra/API) e `@dev`, **Quality Gate**: `@architect`
   - Tarefa: Criar endpoint seguro / cron schedule capaz de acordar, consultar a fila do Kanban, validar que faltam vídeos (`< 2`) e ordenar ao `ITextEngine` (construído no EPIC-03) que crie novos blocos salvando-os. Auditoria via NFR06.

## Compatibility Requirements e Risk Mitigation
- [x] O limite de tokens do EPIC-03 DEVE ser validado na hora do `Auto-Refill`. Se o limite esgotar na "madrugada", a automação para de gerar. (Risco contido).
- [x] NFR01: Agnosticidade Total. O provedor LLM invocado pelo Laboratório deve usar a mesma fachada `ITextEngine` implementada antes.
- **Rollback:** Em caso de overflow lógico na geração do Cronjob, implementar um "kill switch" global acessível via Configurações.

## Handoff para o @sm (Story Manager)
"River (@sm), por favor redija o **EXECUTION-GUIDE-EPIC-04** e destrinche as Stories deste documento. Lembre-se de exigir do @dev o cumprimento impecável das NFRs de desempenho (Cache de analytics) e rastreio de auditoria no Auto-Refill."
