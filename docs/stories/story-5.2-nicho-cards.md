# Story 5.2: Cards de Garimpo de Vídeo (Nicho Card)

## 📌 Metadados
- **Épico:** EPIC-05: Radar de Nichos Globais
- **Responsável:** @dev (Codificação) / @qa (Validação)
- **Status:** Ready for Review
- **Componente Alvo:** `src/components/tendencias/nicho-card.tsx`

## 📖 História do Usuário
**Como** estrategista de conteúdo concorrente,
**Quero** visualizar os vídeos garimpados em cards detalhados com métricas de engajamento,
**Para que** eu possa avaliar o potencial de um nicho e despachar ideias validadas para o Studio ou Kanban da Fábrica.

## ✨ Critérios de Aceitação (AC)
- [ ] O componente `<NichoCard />` deve possuir uma estrutura base `.card` ou `.card-inner` com estados de hover definidos pelo Design System.
- [ ] **Lado Esquerdo (Visual):**
    - Simular uma thumbnail do YouTube (proporção 16:9 ou similar).
    - Background escuro (`var(--color-bg-dark)`) com placeholder de imagem.
    - Tag de tempo no canto inferior direito (ex: "12:34") com fundo semi-transparente.
- [ ] **Lado Direito (Informação):**
    - Título do vídeo com limite de 2 linhas (`line-clamp-2`).
    - Exibição de métricas: Nome do Canal e Volume de Visualizações (Views).
    - Badge de categoria (ex: "Gap: Relatos") usando cores do Design System.
- [ ] **Call-to-Actions (CTAs):**
    - Botão **[🚀 CRIAR CANAL BASEADO NISTO]** (classe `.btn-primary`): Deve disparar ação para o Studio.
    - Botão **[📌 Salvar Ideia]** (classe `.btn-ghost`): Deve disparar ação para o Kanban.
    - Uso obrigatório de ícones do pacote `lucide-react`.

## ⚠️ Restrições e NFRs Aplicáveis (Leis Inquebráveis)
- **NFR01 (Design System):** Proibido o uso de cores hexadecimais ou RGB puros. Utilizar estritamente `var(--color-text-*)`, `var(--color-accent)`, etc. [Source: docs/prd-core-nfrs.md]
- **NFR03 (Multi-Tenant):** Embora seja um componente UI, a lógica de "Salvar" deve estar preparada para respeitar o `tenant_id` do usuário logado.
- **NFR08 (Custo Zero):** A UI deve refletir dados extraídos via `OpenCLI-rs`, priorizando a exibição de métricas sem chamadas constantes à API oficial.

## 📦 Detalhes Técnicos e Data Model

### Estrutura Visual Detalhada
O card deve seguir o layout Bento Grid do dashboard, mantendo o `gap-6` (24px) entre elementos se estiver em lista. O hover deve aplicar uma leve elevação ou borda de destaque (`var(--color-accent)` suave).

### Mock Data para Implementação
```typescript
export interface GarimpoVideo {
  id: string | number;
  titulo: string;
  canal: string;
  views: string;
  tempo: string;
  tag: string;
  thumbnailUrl?: string;
}

export const GARIMPOS_MOCK: GarimpoVideo[] = [
  { 
    id: 1, 
    titulo: 'The boss who lost $2M on purpose to teach a lesson', 
    canal: 'Corporate Tales', 
    views: '4.2M', 
    tempo: '14:20',
    tag: 'Gap: Relatos' 
  },
  { 
    id: 2, 
    titulo: 'Why everyone is quitting their $100k tech jobs', 
    canal: 'Tech Dropout', 
    views: '1.8M', 
    tempo: '08:45',
    tag: 'Gap: Carreiras' 
  },
  { 
    id: 3, 
    titulo: 'I stayed in the worlds most illegal hotel', 
    canal: 'Urbex Worldwide', 
    views: '8.4M', 
    tempo: '22:10', 
    tag: 'Lotado: Urbex' 
  },
];
```

## 🔍 CodeRabbit Quality Gates & QA Predito
- **Revisor Dev (@dev):** Validar se os CTAs utilizam os componentes base de botão (`src/components/ui/button.tsx`) e se o CSS respeita o `line-clamp` para não quebrar o layout do Bento Grid.
- **Auditoria QA (@qa):** Testar a responsividade do card em grids de 1, 2 e 3 colunas. Verificar se as cores do hover e dos badges estão alinhadas com o `prd-core-nfrs.md`.

## 🛠️ Tasks / Subtasks
- [x] **Setup Visual (AC 1):**
    - Criar `src/components/tendencias/nicho-card.tsx`.
    - Implementar container base com micro-interações de hover.
- [x] **Thumbnail Engine (AC 2):**
    - Criar sub-componente de thumbnail com overlay de tempo.
- [x] **Content Mapping (AC 3):**
    - Mapear título, canal e views do Mock Data.
    - Implementar badges dinâmicos baseados no tipo de nicho.
- [x] **Ações e Integração (AC 4):**
    - Adicionar botões com `lucide-react`.
    - Preparar stubs para funções de `onClick` (Studio/Kanban).

## 🛠️ Dev Agent Record

### Agent Model Used
Gemini 3.1 Pro (High)

### Completion Notes List
- Componente `NichoCard` atualizado e adequado 100% à especificação e ao Design System (NFR01).
- Utilizamos a classe padrão `.card-inner` e botões `.btn-primary` e `.btn-ghost` estilizados via Tailwind classes nativas do projeto (`globals.css`).
- Estrutura otimizada e testada com Lint.
- CTAs mapeados com as funções via props `onCriarCanal` e `onSalvarIdeia`.
- Componente responsivo utilizando Flexbox.

### File List
- `[MODIFIED] src/components/tendencias/nicho-card.tsx`
- `[MODIFIED] docs/stories/story-5.2-nicho-cards.md`

## ✅ QA Results (Quality Gate)

### 🛡️ Auditoria NFR01 (Design System)
- **Status**: [PASS] ✅
- **Observações**: O componente foi refatorado com sucesso. Todas as cores hardcoded (RGB e literais como 'white') foram removidas. 
  - O uso de `var(--color-accent)]/20` e `style={{ backgroundColor: 'var(--color-background)', opacity: 0.8 }}` garante a conformidade com a doutrina de agnosticidade.
- **Ação**: Validação concluída via inspeção estática e visual.

### 📱 Validação de Responsividade
- **Status**: [PASS] ✅
- **Observações**: 
  - Implementado layout colapsável `flex-col md:flex-row`.
  - Em mobile (375px), o thumbnail ocupa a largura total com proporção preservada e as informações são exibidas abaixo, garantindo legibilidade perfeita.
  - CTAs ocupam largura total em telas pequenas, melhorando a área de toque.

### 🧪 Critérios de Aceitação
- **Container Visual**: OK (Usa `.card-inner`).
- **Ações**: OK (CTAs funcionais via props).
- **Design de Thumbnail**: OK (Aspect-ratio preservado e layout responsivo).

**Gate Decision**: **PASS** ✅
**Data**: 2026-04-20
**Assinado**: Quinn (Guardian)

---

*Gerado por @sm (River) em 2026-04-20.*
