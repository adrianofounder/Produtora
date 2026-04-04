# Epic 05: Tendências & Garimpo — Radar de Nichos Globais

**Status**: Approved / Ready for Development
**Route**: `/tendencias`
**Agent Sequence**: `sm` → `dev` → `qa`
**Objective**: Desenvolver o "Radar de Nichos Globais" (Garimpo Inteligente). Nesta aba o operador mapeia oportunidades de mercado identificando nichos "Lotados" vs nichos de "Oceano Azul" e analisa concorrentes convertendo suas ideias em conteúdo original em massa.

---

## Story 01: Matriz Oceano Azul (Dispersão)
**Agent**: `dev`
**Componente**: `src/components/tendencias/matriz-oceano.tsx`

### Descrição
Criar o grid gráfico `<MatrizOceano />` mapeando pontos num plano cartesiano (Alta/Baixa Oferta vs Alta/Baixa Demanda). Os nichos "Gap" (Oceano Azul) recebem mais destaque enquanto os nichos "Lotados" ficam pálidos e desfocados.

### Critérios de Aceitação
- [ ] Container visual baseado em um Grid 2D fixo ou flex com pontos absolutos.
- [ ] Fundo deve ter marca d'água de grade sutil (`radial-gradient` pontilhado, ou grids).
- [ ] Pontos representam nichos:
  - Lotado: fundo avermelhado da paleta (misturando `var(--color-error)` com `transparent`), `blur-sm`, z-index baixo.
  - Gap/Oceano Azul: glow forte (`shadow-glow`), badge-primary (violeta `var(--color-accent)`), z-index alto, hover animado (`scale-110`).
- [ ] Nenhum uso de código de cor RGB raw/puro: utilizar var(--color-*).
- [ ] Dados mock reais mostrando os quadrantes de oportunidade.

### Mock Data
```ts
const PONTOS = [
  { id: 1, label: 'True Crime US',  type: 'lotado', x: 20, y: 30, opacity: 0.5 },
  { id: 2, label: 'React Cristão',  type: 'lotado', x: 15, y: 70, opacity: 0.6 },
  { id: 3, label: 'Shorts de Tech', type: 'lotado', x: 80, y: 20, opacity: 0.4 },
  { id: 4, label: 'Relatos VIP',    type: 'gap',    x: 85, y: 80, pulse: true  },
  { id: 5, label: 'Gringo Dublado', type: 'gap',    x: 75, y: 65, pulse: false },
]
```

---

## Story 02: Cards de Garimpo de Vídeo (Nicho Card)
**Agent**: `dev`
**Componente**: `src/components/tendencias/nicho-card.tsx`

### Descrição
Criar o componente atômico `<NichoCard />` que exibe um resultado do Crawler extraindo vídeos que provam o conceito de um nicho, com os call-to-action para replicar/clonar.

### Critérios de Aceitação
- [ ] Estrutura `.card` ou `.card-inner` com hover actions.
- [ ] Lado esquerdo abriga uma "div" simulando thumbnail do YouTube (bg escuro e tempo no canto inferior direito).
- [ ] Lado direito abriga título (limite 2 linhas), views e canal.
- [ ] Botões de ação em formato `.btn-primary` e `.btn-ghost`, com ícones do pacote `lucide-react`.

### Mock Data
```ts
const GARIMPOS = [
  { id: 1, titulo: 'The boss who lost $2M on purpose to teach a lesson', canal: 'Corporate Tales', views: '4.2M', tag: 'Gap: Relatos' },
  { id: 2, titulo: 'Why everyone is quitting their $100k tech jobs',     canal: 'Tech Dropout',    views: '1.8M', tag: 'Gap: Carreiras' },
  { id: 3, titulo: 'I stayed in the worlds most illegal hotel',          canal: 'Urbex Worldwide', views: '8.4M', tag: 'Lotado: Urbex' },
]
```

---

## Story 03: Composição Principal no Bento Grid
**Agent**: `dev`
**Arquivo**: `src/app/(dashboard)/tendencias/page.tsx`

### Descrição
Compor a integração da página unindo o topo (descritivo), a Matriz e a Listagem num Bento Grid elegante.

### Critérios de Aceitação
- [ ] Header padrão: Título, ícone e badge BETA.
- [ ] Remoção de todo e qualquer CSS `bg-slate-800`, `text-slate-400`, e `bg-red-500` originais.
- [ ] Importação de MatrizOceano no bloco superior (ocupando as colunas, estilo destaque).
- [ ] Listagem grid 2 colunas com `NichoCard` na seção inferior.
- [ ] Todos os gaps mantendo `24px` (`gap-6`) para respirar.
