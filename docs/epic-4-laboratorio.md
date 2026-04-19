# Epic 04: Laboratório & Marés — Análise de Tendências

**Status**: Approved / Ready for Development
**Route**: `/laboratorio`
**Agent Sequence**: `sm` → `dev` → `qa`
**Objective**: Construir a tela de Laboratório como o motor de experimentação e análise de tendências do AD_LABS. O operador deve conseguir identificar qual eixo temático está "vencendo", avaliar ideias por score de IA e alimentar a Fábrica de conteúdo.

---

## Story 01: Matriz dos 5 Eixos Temáticos
**Agent**: `dev`
**Componente**: `src/components/laboratorio/eixo-card.tsx`

### Descrição
Criar o componente `<EixoCard />` e a grade de 5 eixos temáticos na página. Cada card exibe o nome do eixo, nicho, status, quantidade de vídeos testados, média de views e taxa de aprovação (barra de progresso).

### Critérios de Aceitação
- [ ] Grid de 5 colunas (responsivo: 1 col mobile, 3 col tablet, 5 col desktop)
- [ ] Card vencedor usa classe `.card-accent` com glow violeta/verde
- [ ] Status: `Testando` (badge-accent), `Aguardando` (badge-muted), `Venceu 👑` (badge-success)
- [ ] Mini barra de progresso animada com `transition-all duration-700`
- [ ] Cards clicáveis (via `onClick`) para filtrar ideias abaixo
- [ ] Dados mock: 5 eixos reais (Escola, Hospital, Igreja, Rua, Trabalho) — Eixo Trabalho é o vencedor

### Mock Data
```ts
const EIXOS: EixoData[] = [
  { id: 1, nome: 'Escola', nicho: 'Justiça Dramática', status: 'testando',  videos: 8,  mediaViews: '124K', taxaAprovacao: 62 },
  { id: 2, nome: 'Hospital',nicho: 'Emoção Extrema',  status: 'aguardando',videos: 3,  mediaViews: '47K',  taxaAprovacao: 38 },
  { id: 3, nome: 'Igreja',  nicho: 'Fé & Conflito',   status: 'testando',  videos: 12, mediaViews: '210K', taxaAprovacao: 74 },
  { id: 4, nome: 'Rua',     nicho: 'Superação Real',  status: 'aguardando',videos: 5,  mediaViews: '83K',  taxaAprovacao: 51 },
  { id: 5, nome: 'Trabalho',nicho: 'Chefe vs. Tropa', status: 'venceu',    videos: 21, mediaViews: '487K', taxaAprovacao: 89 },
];
```

---

## Story 02: Banco de Ideias do Eixo Vencedor
**Agent**: `dev`
**Componente**: `src/components/laboratorio/ideias-table.tsx`

### Descrição
Criar o componente `<IdeiasTable />` exibindo as ideias validadas do eixo vencedor em formato de tabela com nota de IA, tags e ação de envio para a Fábrica.

### Critérios de Aceitação
- [ ] Tabela com colunas: `Ideia / Premissa`, `Nota IA`, `Tags`, `Ação`
- [ ] Score de IA com cores semânticas: ≥9 verde, ≥7 violeta, ≥5 amarelo, <5 vermelho
- [ ] Botão `P/ Fábrica` com ícone `<Send />` usando classe `.btn-primary`
- [ ] Ideias já enviadas exibem badge `badge-accent` "Na Fábrica"
- [ ] Ideias publicadas exibem badge `badge-success` "Publicado"
- [ ] Hover na linha com `background: rgba(255,255,255,0.025)` 
- [ ] Dados mock: mínimo 7 ideias com premissas reais

### Mock Data
```ts
const IDEIAS: IdeiaData[] = [
  { id: 1, titulo: 'O chefe que não sabia de NADA',       premissa: 'Funcionário corrige chefe ao vivo sem perceber', notaIA: 9.2, tags: ['viral','trabalho'], status: 'fabrica'   },
  { id: 2, titulo: 'Jesus e o pastor mentiroso',           premissa: 'Fiel descobre fraude da liderança em culto',    notaIA: 8.7, tags: ['drama','fé'],      status: 'pendente'  },
  { id: 3, titulo: 'Criança humilhada dá o troco',         premissa: 'Bully da turma pega o que merece na frente de todos', notaIA: 8.1, tags: ['escola'],   status: 'pendente'  },
  { id: 4, titulo: 'O estagiário que salvou a empresa',    premissa: 'CEO descobre que apenas o júnior sabia a solução', notaIA: 7.9, tags: ['trabalho'],    status: 'publicado' },
  { id: 5, titulo: 'Médico descobre que é o paciente',     premissa: 'Ironia trágica em diagnóstico hospitalar',     notaIA: 7.4, tags: ['hospital'],      status: 'pendente'  },
  { id: 6, titulo: 'A mãe que ninguém esperava',           premissa: 'Sacrifício anônimo revelado no pior momento',   notaIA: 9.5, tags: ['emoção','viral'], status: 'fabrica'   },
  { id: 7, titulo: 'Diretora x professora substituta',     premissa: 'Hierarquia invertida gera crise na escola',    notaIA: 6.8, tags: ['escola'],        status: 'pendente'  },
];
```

---

## Story 03: Motor de Análise de Tendências
**Agent**: `dev`
**Componente**: `src/components/laboratorio/trend-analysis.tsx`

### Descrição
Criar o painel `<TrendAnalysis />` com barras de progresso rankando todos os eixos por score de performance, com KPIs inline (views 7d, CTR, retenção) e indicador de direção (subindo/estável/caindo).

### Critérios de Aceitação
- [ ] Barra de progresso normalizada: eixo com score máximo recebe `width: 100%` relativo
- [ ] Eixo líder recebe badge `👑 LÍDER` (badge-success)
- [ ] Barra do líder usa `var(--color-success)`, demais usam gradiente violeta
- [ ] Indicadores de direção: `▲ Subindo` (verde), `→ Estável` (amarelo), `▼ Caindo` (vermelho)
- [ ] KPIs inline com ícones `<Eye />`, `<ThumbsUp />`, `<Clock />` do `lucide-react`
- [ ] Animação da barra com `transition-all duration-700`

### Mock Data
```ts
const TRENDS: TrendMetrica[] = [
  { eixo: 'Trabalho (Chefe vs. Tropa)', score: 94, views7d: '2.1M', ctr: '8.4%', retencao: '73%', direcao: 'up'     },
  { eixo: 'Igreja (Fé & Conflito)',     score: 71, views7d: '980K', ctr: '6.1%', retencao: '61%', direcao: 'up'     },
  { eixo: 'Escola (Justiça Dramática)', score: 58, views7d: '640K', ctr: '5.2%', retencao: '54%', direcao: 'stable' },
  { eixo: 'Rua (Superação Real)',       score: 43, views7d: '380K', ctr: '4.8%', retencao: '49%', direcao: 'stable' },
  { eixo: 'Hospital (Emoção Extrema)',  score: 29, views7d: '190K', ctr: '3.1%', retencao: '41%', direcao: 'down'   },
];
```

---

## Story 04: Página `/laboratorio` — Composição Final
**Agent**: `dev`
**Arquivo**: `src/app/(dashboard)/laboratorio/page.tsx`

### Descrição
Compor a página final usando os 3 componentes acima, com cabeçalho (`PageHeader`), layout em Bento Grid (matriz no topo, tabela + motor de tendências na linha inferior) e estado de eixo selecionado (`useState`) para filtrar as ideias.

### Critérios de Aceitação
- [ ] `'use client'` no topo (usa `useState` para eixo ativo)
- [ ] Header com título `🌊 Laboratório & Marés`, subtítulo e badge `BETA` em `badge-accent`
- [ ] Linha 1: `<EixoCard />` × 5 em grid de 5 cols
- [ ] Linha 2: `<IdeiasTable />` (col-span-3) + `<TrendAnalysis />` (col-span-2) em `grid-cols-5`
- [ ] Botão `+ Enviar Lote (5) p/ Fábrica` em `.btn-primary` no header das Ideias
- [ ] Eixo ativo filtra as ideias (ideias são todas do eixo vencedor por enquanto)
- [ ] Zero classes Tailwind de cor hardcoded
- [ ] Componentes de layout importados de `@/components/laboratorio/`

---

## Story 05: QA & Polish
**Agent**: `qa`

### Checklist de Revisão
- [ ] Verificar que nenhuma cor hardcoded existe nos componentes
- [ ] Confirmar que `.card`, `.card-accent`, `.btn-primary`, `.badge-*` são usados corretamente
- [ ] Validar grid responsivo (mobile: stack vertical)
- [ ] Checar que barras de progresso têm `overflow-hidden` no container
- [ ] Verificar que hover states funcionam em todos os elementos interativos
- [ ] Confirmar que `'use client'` está nos componentes que usam `useState`/`onClick`
- [ ] Garantir que o page.tsx não tem mais de 80 linhas (componentização correta)

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/laboratorio/eixo-card.tsx` | CRIAR |
| `src/components/laboratorio/ideias-table.tsx` | CRIAR |
| `src/components/laboratorio/trend-analysis.tsx` | CRIAR |
| `src/app/(dashboard)/laboratorio/page.tsx` | MODIFICAR |

## Definition of Done
- Tela `/laboratorio` funcional com dados mock reais
- 3 componentes atômicos no design system Lendária
- Commit: `feat(ui): Epic 4 — Laboratório & Motor de Tendências`
- `docs/agent-context.md` atualizado: Epic 4 → ✅ Concluído, Epic 5 → ⏳ Próximo

---

## 🧠 Doutrina de Engenharia e Negócios (Injetada pelo PRD)

> **ATENÇÃO @dev e @qa**: As regras abaixo foram extraídas do PRD (Seções 5 e 6.3). Elas governam a Lógica do Laboratório e não são apenas estéticas.

### 1. Ficha Técnica do Eixo (O DNA de 20 Campos)
A arquitetura de banco de dados deve prever ou interagir com os **20 Campos obrigatórios** da Ficha Técnica de um Eixo, divididos em:
*   **Identidade:** Nome, Premissa, Demografia, Emoção, Gatilho.
*   **Dramaturgia:** Protagonista, Antagonista, Conflito, Payoff, Hook.
*   **Comercial (SEO):** Concorrência (Alta/Média/Baixa), Retenção Estimada, RPM Estimado, Safewords/Tabus.
*   **Fábrica:** Cores da Thumb, Elemento âncora, Duração limitada.
*(Estes dados não são digitados pelo usuário, mas preenchidos passivamente pela IA nas Madrugadas).*

### 2. Ações do Motor (Botão Auto-Refill Mestre)
O botão **`[+ Enviar Lote de 5 para a Fábrica]`**:
*   É a ação que conecta o Módulo 5 (Laboratório) ao Módulo 4 (Canais). Despacha status lógicos `[planejamento]` no Supabase.
*   **Regra de Auto-Refill Subliminar:** Se a fila da Fábrica cair para `< 2 vídeos`, o cronjob de background executa essa "clicada" automaticamente sem ação humana, para não deixar o canal engessado de manhã.

### 3. Hierarquia do Eixo
O card de eixo possui `onClick` permitindo intervenção humana (Master Override), anulando os algoritmos numéricos de `taxaAprovacao` para forçar um status de "VENCEU!".
