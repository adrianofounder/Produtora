# Epic 07: Configurações — Integrações & Contas

**Status**: Approved / Ready for Development
**Route**: `/configuracoes`
**Agent Sequence**: `sm` → `dev` → `qa`
**Objective**: Refatorar a tela de Configurações do boilerplate legado para o Design System Lendária. A tela gerencia dois blocos: Contas/Canais conectados (OAuth YouTube) e Chaves de API dos provedores de IA.

---

## Story 01: Card de Conta Conectada
**Agent**: `dev`
**Componente**: `src/components/configuracoes/account-card.tsx`

### Descrição
Componente atômico `<AccountCard />` exibindo uma conta OAuth conectada (YouTube, TikTok, etc) com avatar colorido, nome do canal, status e botão "Desconectar".

### Critérios de Aceitação
- [ ] Container usa `.card-inner` com hover
- [ ] Avatar: `icon-box` de tamanho 36px com cor específica da plataforma via `var(--color-error)` (YouTube) ou `var(--color-accent)` (TikTok)
- [ ] Status "Ativa" usa `badge-success`, "Expirada" usa `badge-error`, "Pendente" usa `badge-warning`
- [ ] Botão "Desconectar" usa `.btn-ghost` de altura 7 (pequeno)
- [ ] Zero uso de `text-emerald-400`, `bg-red-600` ou similares

### Mock Data
```ts
const CONTAS = [
  { id: 1, plataforma: 'YouTube', canal: 'Histórias Ocultas', status: 'ativa',   cor: 'var(--color-error)'   },
  { id: 2, plataforma: 'YouTube', canal: 'Jesus Reage',        status: 'ativa',   cor: 'var(--color-error)'   },
  { id: 3, plataforma: 'TikTok', canal: '@historiasocultas',   status: 'pendente',cor: 'var(--color-accent)'  },
]
```

---

## Story 02: Card de Chave de API
**Agent**: `dev`
**Componente**: `src/components/configuracoes/api-key-card.tsx`

### Descrição
Componente `<ApiKeyCard />` que lista provedores de IA com status de conexão (ON/FALTANDO), data de última verificação e botão de ação inline.

### Critérios de Aceitação
- [ ] Status "ON" usa `dot-live` + texto `var(--color-success)`, "FALTANDO" usa `dot-error` + texto `var(--color-error)`
- [ ] Botão "Editar Chave" usa `.btn-ghost` pequeno
- [ ] Layout em 3 colunas: Provedor | Status | Ação
- [ ] Sem `text-primary` (não existe no design system — usar `var(--color-accent)`)

### Mock Data
```ts
const APIS = [
  { id: 1, provider: 'OpenAI (GPT-4o)',   tipo: 'Texto/Roteiros',  status: 'on',       data: '03/04/2026' },
  { id: 2, provider: 'ElevenLabs',        tipo: 'TTS/Áudios',      status: 'faltando', data: '--/--/----' },
  { id: 3, provider: 'Fal.ai',            tipo: 'Imagens/Flux',    status: 'on',       data: '01/04/2026' },
  { id: 4, provider: 'Supabase',          tipo: 'Backend Auth',    status: 'on',       data: 'Integrado'  },
]
```

---

## Story 03: Composição da Página
**Agent**: `dev`
**Arquivo**: `src/app/(dashboard)/configuracoes/page.tsx`

### Critérios de Aceitação
- [ ] Header padrão com título "⚙️ Configurações" e subtítulo
- [ ] Seção "Contas Conectadas" com grid responsivo de `<AccountCard />`
- [ ] Botão "+ Nova Conta" em `.btn-ghost` no header da seção
- [ ] Seção "Chaves de API" com painel usando `<ApiKeyCard />`
- [ ] Layout `max-w-3xl` centralizado para melhor legibilidade
- [ ] Remoção total do boilerplate: `glass-panel`, `border-white/5`, `text-slate-400`, `bg-red-600`, `text-emerald-400`
