---
title: "Story 5.3: Composição Principal no Bento Grid"
epic: 5
id: 5.3
status: "Draft"
status: "Ready for Review"
assignee: "@dev"
clickup:
  task_id: ""
  epic_task_id: ""
  list: "Backlog"
  url: ""
  last_sync: ""
---

# Story 5.3: Composição Principal no Bento Grid

## 🎯 Objetivo
Unificar os componentes de inteligência visual (**Matriz Oceano Azul** e **Nicho Cards**) em uma página de tendências `/tendencias` organizada via Bento Grid, garantindo que o design seja premium, responsivo e 100% fiel ao Design System do projeto (NFR01).

## 📝 User Story
**Como** operador de garimpo da Produtora,
**Quero** visualizar a análise de nichos e os resultados de garimpo em uma interface organizada e atraente,
**Para** que eu possa tomar decisões rápidas sobre quais conteúdos têm maior potencial de viralização no "Oceano Azul".

## ✅ Critérios de Aceitação

### 1. Header de Página (Standard)
- [x] Título: "Radar de Nichos Globais"
- [x] Ícone: `Radar` (lucide-react)
- [x] Badge: "BETA" usando `var(--color-accent)` com efeito de vidro ou brilho sutil.

### 2. Layout Bento Grid Premium
- [x] Container principal seguindo as margens do `PageContainer` (conforme `docs/architecture.md`).
- [x] O componente `<MatrizOceano />` deve ser o elemento de destaque (Featured Box), ocupando a largura total (ou 2 colunas em telas ultra-wide).
- [x] A listagem de `<NichoCard />` deve ser renderizada em um grid secundário dentro da seção inferior, preferencialmente 2 colunas.
- [x] O `gap` universal entre todos os elementos deve ser estritamente `24px` (`gap-6`).

### 3. Limpeza de Estilos Legados (NFR01 - MANDATÓRIO)
- [x] Remover qualquer vestígio de cores hardcoded da mockup original:
    - [x] `bg-slate-800`, `bg-slate-900`, `text-slate-400`.
    - [x] `bg-red-500`, `text-gray-500`.
- [x] Substituir por tokens do Design System:
    - [x] Fundo: `var(--color-bg-primary)` / `var(--color-bg-secondary)`.
    - [x] Bordas: `var(--color-border)`.
    - [x] Textos: `var(--color-text-primary)` / `var(--color-text-dimmed)`.
    - [x] Destaques: `var(--color-accent)`.

### 4. Integração de Dados (Mock por enquanto)
- [x] Injetar os `PONTOS` e `GARIMPOS` definidos na `docs/epic-5-tendencias.md`.
- [x] A matriz deve exibir os pontos com animação de entrada (fade-in/zoom-in).

### 5. Multi-Tenant (NFR03)
- [x] Garantir que a estrutura da página suporte o recebimento de dados baseados em `tenant_id` (preparação para integração backend real).

## 🛠️ Notas Técnicas (River's Dev Notes)

- **Arquivo Alvo:** `src/app/(dashboard)/tendencias/page.tsx`
- **Padrão de Layout:** Bento Grid. Se necessário, crie um wrapper flexivel ou use classes de grid fraccionadas.
- **Design System:** Use estritamente CSS Variables. Não use HEX ou RGB planos.
- **Agnosticidade:** O componente de página não deve depender de um provedor específico de dados, esperando props ou um hook centralizado de tendências.

[Source: docs/epic-5-tendencias.md#Story-03]
[Source: docs/prd-core-nfrs.md#NFR01]
[Source: docs/architecture.md#1.1-File-Structure-Strategy]

## 📋 Lista de Tarefas para o @dev

- [x] Criar/Limpar o arquivo `src/app/(dashboard)/tendencias/page.tsx`.
- [x] Implementar o Header com o Badge "BETA".
- [x] Estruturar o Bento Grid usando CSS Grid ou Tailwind `grid-cols`.
- [x] Importar e posicionar `<MatrizOceano />` na seção de destaque.
- [x] Importar e mapear `<NichoCard />` na seção de listagem (Grid 2 colunas).
- [x] Auditar o arquivo em busca de cores legacy e refatorar para variables.
- [x] Verificar responsividade: Matriz no topo (Full Width), Cards empilhados em Mobile e 2 colunas em Desktop.

## 🔍 QA Results

### Auditoria Técnica
- **Aderência ao Design System (NFR01):** Identificado uso de tokens legados (`--color-bg-primary`). Corrigido para `var(--color-background)` e `var(--color-surface)`. **[PASS]**
- **Consistência de Gaps (AC 2.4):** Ajustado de `gap-8`/`gap-4` para `gap-6` (24px) universal. **[PASS]**
- **Multi-tenancy (NFR03):** Estrutura de fetch compatível com RLS do Supabase. **[PASS]**

### Decisão de Gate
**Decisão:** ✅ **PASS**
**Data:** 2026-04-21
**Ajustes:** Auto-healing aplicado para tokens e espaçamentos.

---

## 📊 Relatório de Validação (Scrum Master)

| Categoria | Status | Observações |
| :--- | :--- | :--- |
| 1. Clareza de Objetivos | ✅ PASS | Metas de unificação e layout Bento bem definidas. |
| 2. Orientação Técnica | ✅ PASS | Arquivos alvo e padrões (gap-6, variáveis) especificados. |
| 3. Eficácia de Referências | ✅ PASS | Links diretos para NFR01, NFR03 e Epic 5. |
| 4. Auto-suficiência | ✅ PASS | ACs detalhados permitem execução imediata pelo @dev. |
| 5. Orientação de Testes | ✅ PASS | Lista de tarefas inclui validação visual e responsiva. |

**Parecer Final:** **READY** 🚀
A story está pronta para ser entregue ao @dev. O foco deve ser a precisão visual e a remoção de estilos legados.

---
— River, removendo obstáculos 🌊
