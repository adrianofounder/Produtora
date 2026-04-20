# Story 5.1: Matriz Oceano Azul (Dispersão visual de Nichos)

## 📌 Metadados
- **Épico:** EPIC-05: Radar de Nichos Globais
- **Responsável:** @dev (Codificação) / @qa (Validação)
- **Status:** Approved / Ready for Integration
- **Componente Alvo:** `src/components/tendencias/matriz-oceano.tsx`

## 📖 História do Usuário
**Como** operador de inteligência de conteúdo competitivo
**Quero** visualizar os nichos mapeados em um gráfico de dispersão cartesiano focado em Concorrência vs. Sentimento
**Para que** eu possa identificar visualmente e com imediatismo os "Gaps" (Oceanos Azuis) com alta emoção/demanda e baixa oferta.

## ✨ Critérios de Aceitação (AC)
- [x] O componente `<MatrizOceano />` deve exibir um Grid 2D fixo ou flex contendo os pontos com posições absolutas baseadas em coordenadas X/Y (0-100).
- [x] O grid deve possuir uma marca d'água sutil ao fundo (usando grids pontilhados ou um leve `radial-gradient`).
- [x] Os pontos no gráfico variam de estilo com base na sua classificação:
  - **Lotado:** Fundo avermelhado pálido com desfoque leve (`blur-sm`). Deve misturar `var(--color-error)` com fundo transparente, e possuir Z-index baixo.
  - **Gap (Oceano Azul):** Efeito "glow" acentuado (`shadow-glow`), coloração violeta `var(--color-accent)`, hover animado com crescimento (`scale-110`) e alto Z-index. Pode emitir um "pulse" visual se o dado pedir.
- [x] Cada ponto deve ser interativo revelando seu "label" num tooltip elegante nativo ou customizado.

## ⚠️ Restrições e NFRs Aplicáveis (Leis Inquebráveis)
- **NFR01 (Design System e Agnosticidade):** É **estritamente proibido** o uso de cores raw/hardcoded em Hexadecimal, RGB puro ou diretrizes de paleta direta do Tailwind (ex: `bg-red-500` não é permitido). TODAS as cores do gráfico, backgrounds e glows DEVEM consumir as CSS Variables globais do sistema de design, como `var(--color-error)`, `var(--color-accent)`, e `var(--color-background)`.

## 📦 Detalhes Técnicos e Data Model

### Dependências
- `lucide-react` (se necessário usar ícones internos aos tooltips).

### Parâmetros Cartesianos
O Algoritmo de Backend calculará a plotagem do gráfico com base em:
- **Eixo Y (Ordenadas):** Nível de Concorrência (Quantidade de canais similares detectados). Posição mais baixa indica menor concorrência, o que é ideal.
- **Eixo X (Abscissas):** Emoção / Sentimento Dominante do eixo de conteúdo, mapeado via NLP.

### Dados de Mock para a Renderização Inicial
Durante o desenvolvimento desta story e antes do Backend (Story 5.4) estar pronto, implemente este Mock garantindo que os objetos renderizem conforme o tipo.

```typescript
export interface NichoPonto {
  id: number;
  label: string;
  type: 'lotado' | 'gap';
  x: number;  // Posição percentual no Eixo X (0-100)
  y: number;  // Posição percentual no Eixo Y (0-100)
  opacity?: number;
  pulse?: boolean;
}

export const PONTOS_MOCK: NichoPonto[] = [
  { id: 1, label: 'True Crime US',  type: 'lotado', x: 20, y: 30, opacity: 0.5 },
  { id: 2, label: 'React Cristão',  type: 'lotado', x: 15, y: 70, opacity: 0.6 },
  { id: 3, label: 'Shorts de Tech', type: 'lotado', x: 80, y: 20, opacity: 0.4 },
  { id: 4, label: 'Relatos VIP',    type: 'gap',    x: 85, y: 80, pulse: true  },
  { id: 5, label: 'Gringo Dublado', type: 'gap',    x: 75, y: 65, pulse: false },
];
```

## 🔍 CodeRabbit Quality Gates & QA Predito
- **Revisor Dev (@dev):** Deve validar via devtools se os pontos estão referenciando apenas tokens CSS (`var(--color-*)`) no DOM.
- **Auditoria QA (@qa):** Validará se um container Flex relativo está renderizando as bolinhas absolutamente dentro de sua caixa delimitadora sem causar scroll horizontal em telas menores. E checará se animações de pulse e escala ocorrem de forma fluída, sem re-renderizações desnecessárias ao sistema.

---

## 🛠️ Dev Agent Record

### Completion Notes
- O componente `MatrizOceano` foi implementado utilizando design componentizado `card`, `glass` e utilitários flexíveis.
- **NFR01 (Design System):** Todas as cores de texto (`var(--color-text-1)`, `var(--color-text-3)`), backgrounds customizados (`var(--color-error)`, `var(--color-accent)`) e bordas foram aplicadas usando variáveis CSS puras definidas em `globals.css`.
- Interatividade local adicionada via estado (`hoveredPonto`) com tooltips exibindo com base no Z-index e hover para garantir experiência responsiva sem vazar cor.

### File List
- `[NEW] src/components/tendencias/matriz-oceano.tsx`
- `[MODIFIED] docs/stories/story-5.1-matriz-oceano.md`

---

## ✅ QA Results (Quality Gate)

### 🛡️ Auditoria NFR01 (Design System)
- **Status**: [PASS]
- **Observações**: Verificado via scan estático. O componente não utiliza cores hardcoded. Todas as referências de cor utilizam `var(--color-*)`.

### 📊 Validação de Dispersão
- **Status**: [PASS]
- **Observações**: Mapeamento X/Y via Mock Data validado. O Eixo Y foi corretamente invertido nas labels para refletir visualmente que o topo do gráfico representa a menor concorrência (Oceano Azul).

### 🧪 Critérios de Aceitação
- **Container Visual**: Validado (Absolute Grid).
- **Pulse/Glow**: Implementado conforme spec para Gaps.
- **Interatividade**: Tooltips e hover effects operacionais.

**Gate Decision**: **APPROVED** 🛡️
**Data**: 2026-04-20
**Assinado**: Quinn (Guardian)

