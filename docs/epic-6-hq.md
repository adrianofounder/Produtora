# Epic 06: HQ (God Mode) & Governança do Ecossistema

**Status**: Approved / Ready for Development
**Route**: `/hq`
**Agent Sequence**: `sm` → `dev` → `qa`
**Objective**: Construir o "Centro Nervoso" administrativo do AD_LABS. A tela fornece recursos de visão executiva em alto nível, focando em duas métricas críticas gerenciais: Monitoramento em tempo real de consumo da API (OpenAI/ElevenLabs) e Gestão dos Clientes Tenants via sistema SaaS.

---

## Story 01: Componente de Custos de Inteligência Artificial
**Agent**: `dev`
**Componente**: `src/components/hq/financial-widget.tsx`

### Descrição
Refatorar o card de controle financeiro removendo tailwind em raw (`bg-red-600`) e transformando em um `<Widget />` que suporte múltiplos provedores.

### Critérios de Aceitação
- [ ] Renderizar tabela ou lista com colunas "Provedor" e "Custo Acumulado".
- [ ] Aplicar estilo `card` e efeitos `mesh-bg` usando tokens do sistema (`var(--color-error)` de forma sutilizada apenas para representar despesas, se necessário, ou `var(--color-accent)`).
- [ ] Indicador de total estimado mensal destacado como a principal métrica.
- [ ] Incluir dados mock para OpenAI (Tokens), ElevenLabs (Áudio), e Midjourney/Fal.ai (Imagens).

### Mock Data
```ts
const COSTS = [
  { provider: 'OpenAI (GPT-4o)', type: 'Tokens/Texto', amount: '$4.50' },
  { provider: 'ElevenLabs',      type: 'Tts/Áudios',   amount: '$12.20' },
  { provider: 'Fal.ai',          type: 'Imagens/Flux', amount: '$1.80' }
];
const TOTAL_EST = '$150.00';
```

---

## Story 02: Gestão de Assinantes (Tenant Manager)
**Agent**: `dev`
**Componente**: `src/components/hq/tenant-manager.tsx`

### Descrição
Substituir o esqueleto legado do gerenciador de usuários por um `.card` de listagem elegante, exibindo tenants VIP (clientes do sistema). Uso de cores semânticas de sistema para licenças ativas, atrasadas e canceladas.

### Critérios de Aceitação
- [ ] O componente deve extrair uma lista de clientes mock via Map.
- [ ] Badges para status: "Ativo" (`badge-success`), "Pendente" (`badge-warning`), e "Cancelado" (`badge-error`). Sem `emerald-500/20` ou `bg-red-500`.
- [ ] Botão "Sincronizar Webhooks Kiwify" utilizando `.btn-ghost` estilizado no bottom do card.
- [ ] Informações a mostrar por Cliente: Nome, Plano (Anual/Mensal) e Status.

### Mock Data
```ts
const TENANTS = [
  { id: 1, name: 'Produtora VIP #1 (Mestres do Canal)', plan: 'Anual via Kiwify', status: 'ativo' },
  { id: 2, name: 'Lucas (Agência X)', plan: 'Mensal via Kiwify', status: 'pendente' },
  { id: 3, name: 'Canal Cortes Express', plan: 'Anual via Kiwify', status: 'cancelado' },
];
```

---

## Story 03: Bento Grid e Page Wrapper Final
**Agent**: `dev`
**Arquivo**: `src/app/(dashboard)/hq/page.tsx`

### Descrição
Página de junção dos componentes num Bento Grid formal que conclui o Epic 6 e, por consequência, toda a Fase 3 da reconstrução da UI.

### Critérios de Aceitação
- [ ] Criação do `Header` da tela HQ em padrão igual às demais (Laboratório/Tendências) mas com título `HQ (God Mode)`.
- [ ] Div Container com layout `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (A gestão financeira e de Tenant dividem o mesmo peso ou se rearranjam confomelugares disponíveis).
- [ ] Zero resquícios do boilerplate anterior.

---

## 🧠 Doutrina de Engenharia e Negócios (Injetada pelo PRD)

> **ATENÇÃO @dev e @qa**: Extrato do PRD (Seção 11 e NFRs). O HQ é a Sala de Guerra. Ele obedece a regras de arquitetura de Segurança Máxima.

### 1. Isolamento de Segurança (God Mode)
A rota `/hq` é absoluta e inacessível por usuários comuns (Tenants). Deve possuir um middleware ou RLS no Supabase verificando a Role `SuperAdmin` obrigatoriamente. Nenhum Cliente VIP enxerga essa rota.

### 2. Kill Switch (Disjuntor Global)
O `financial-widget.tsx` não é só leitura. Futuramente ele terá um evento de Disjuntor (Kill Switch). Se a somatória do budget derreter de madrugada ou se prever um estouro em conta, o God Mode aciona um Lock/Flag no banco impedindo que a "Máquina de Auto-Refill" consuma 1 centavo sequer na OpenAI, pausando toda a "Fábrica" imediatamente até nova ordem.
