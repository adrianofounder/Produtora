# AD_LABS — Handoff para Próxima Sessão

## Estado Atual: HOME APROVADA ✅

O usuário aprovou o design da tela Home. O padrão visual está definido e 
deve ser replicado em TODAS as telas restantes.

---

## Design System Estabelecido (NÃO ALTERAR)

### Paleta
- Fundo: `#0A0A0A`
- Card principal: `linear-gradient(160deg, #1A1A1E 0%, #141416 100%)`
- Card inner (sub-item): `linear-gradient(160deg, #202024 0%, #1A1A1E 100%)`
- Card accent (marco/maré ativa): `linear-gradient(160deg, #1C1C24 0%, #141418 100%)`
- Accent: `#5E6AD2`
- Source of truth: `c:\Projetos\Produtora\src\app\globals.css`

### Classes CSS (gravar para todas as telas)
- `.card` → card principal com elevação 3D (6 box-shadows)
- `.card-inner` → sub-item dentro de card (igual padrão Alertas/Publicações)
- `.card-accent` → card com borda roxa e glow (canal com maré ativa)
- `.icon-box` / `.icon-box-sm` → container quadrado colorido para ícones
- `.icon-box-accent` / `.icon-box-success` / `.icon-box-warning` / `.icon-box-error` / `.icon-box-muted`
- `.btn-primary` / `.btn-ghost` → botões
- `.badge` + `.badge-accent` / `.badge-success` / `.badge-error` / `.badge-warning` / `.badge-muted`
- `.section-label` → labels de seção (10px, uppercase, tracking-wider)
- `.input` → campos de formulário
- `.nav-active` / `.nav-item` → estados da sidebar

### Fonte
- Corpo: Inter (Google Fonts via CSS @import)
- Mono (números/dados): JetBrains Mono

### Regras de Ícones (OBRIGATÓRIO)
- Todo ícone DEVE ter um `icon-box` ou `icon-box-sm` com cor temática
- NUNCA usar emojis — sempre Lucide Icons
- Ícones na sidebar: `icon-box-sm` + classe de cor correspondente

---

## Estrutura de Arquivos Atual

```
src/app/
├── globals.css              ✅ Design system completo
├── layout.tsx               ✅ Root layout (limpo, sem next/font)
├── (auth)/
│   └── login/page.tsx       ✅ Tela de login (estilo Linear)
└── (dashboard)/
    ├── layout.tsx            ✅ Sidebar 3 seções + Topbar
    ├── page.tsx              ✅ HOME APROVADA
    ├── canais/page.tsx       ❌ PRECISA REFAZER
    ├── laboratorio/page.tsx  ❌ PRECISA REFAZER
    ├── tendencias/page.tsx   ❌ PRECISA REFAZER
    ├── studio/page.tsx       ❌ PRECISA REFAZER
    ├── configuracoes/page.tsx❌ PRECISA REFAZER
    └── hq/page.tsx           ❌ PRECISA REFAZER
```

---

## Próximas Telas — Ordem de Execução

### 1. `/canais` — Fábrica/Kanban (PRÓXIMA)
PRD Seção 4.1. Elementos obrigatórios:
- Dropdown seletor de canal no topbar
- Status da Maré em destaque
- KPIs do canal (Planej/Prod/Pronto/Agend/Atras/Publicados) em linha
- Metadados: Idioma, Frequência, Horário, Email, Anotações
- Botão: `[📊 Visualizar Analytics]` → modal
- Tabs: Todos / Planejamento / Produção / Finalizados / Agendados
- Busca + Toggle Kanban/Calendário + `[+ Adicionar Vídeo]`
- Cards de vídeo com Checklist Operacional (7 badges: Título/Roteiro/Áudio/Imagens/Montagem/Thumb/Agendado)
- Botão "Ver Roteiro / Aprovar Áudio" → abre Gaveta Lateral (Side-drawer de 5 abas)

### 2. `/laboratorio` — Motor de Marés
PRD Seção 5.1. Elementos:
- Dropdown seletor de canal + `[Configurações Maré]`
- Matriz de 5 Eixos clicáveis (Escola/Hospital/Igreja/Rua/Trabalho)
- Status por eixo (Testando / Aguardando / VENCEU!)
- Gaveta da Ficha Técnica com 20 campos
- Tabs: Eixo Vencedor / Não-Aprovadas / Descartadas
- Botão: `[+ Enviar Lote de 5 para a Fábrica]`

### 3. `/tendencias` — 4 sub-abas
PRD Seção 8:
- Garimpo de Vídeos (8.1)
- X-Ray de Canal (8.2)
- Nichos Virais (8.3)
- Oceano Azul (8.4)

### 4. `/studio` — Blueprint
PRD Seção 9.3. Layout de 2 painéis (sidebar interna + área de edição).

### 5. `/configuracoes` — Configurações
PRD Seção 7. 4 abas.

### 6. `/hq` — God Mode
PRD Seção 11. 4 abas.

---

## Regra de Ouro para Próximas Telas

> Cada item de lista, alerta, publicação ou dado deve estar em `.card-inner`  
> Cada ícone deve ter `.icon-box-sm` com cor temática  
> Nunca inventar conteúdo — seguir estritamente o wireframe do PRD

---

## Referência PRD
Arquivo completo em: `c:\Projetos\Produtora\prd-revisado.md`

Checklist completo de campos: ver `implementation_plan.md` nos artefatos desta conversa.

---

## Comandos para continuar
```
npm run dev   (já está rodando na porta 3000)
```
