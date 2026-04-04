# 🌌 Design System: Academia Lendária (Modelo)

## 1. Fundamentos (Design Tokens)

### 1.1. Cores (Color Palette)
A paleta baseia-se em fundos escuros profundos para dar destaque aos elementos em neon/gradiente, remetendo a tecnologia e IA.

*   **Fundos (Backgrounds & Surfaces):**
    *   `bg-base`: #050505 (Preto quase absoluto - fundo principal)
    *   `bg-surface-1`: #121214 (Cinza muito escuro - cards e seções secundárias)
    *   `bg-surface-2`: #1A1A1E (Cinza escuro - hovers e modais)
    *   `bg-glass`: rgba(18, 18, 20, 0.6) + Backdrop Blur (para menus e headers)
*   **Cores Primárias (Ação e Destaque):**
    *   `primary-base`: #7C3AED (Roxo elétrico / IA)
    *   `primary-hover`: #6D28D9 (Roxo mais denso)
    *   `primary-glow`: rgba(124, 58, 237, 0.4) (Efeito de sombra/neon)
*   **Cores Secundárias (Premium/Lendário):**
    *   `secondary-base`: #EAB308 (Dourado/Amarelo - para estrelas, selos, destaques premium)
    *   `accent-blue`: #2563EB (Azul tech - para detalhes e gradientes mistos)
*   **Texto (Typography Colors):**
    *   `text-primary`: #F8FAFC (Branco gelo - títulos e textos principais)
    *   `text-secondary`: #94A3B8 (Cinza azulado - descrições, subtítulos)
    *   `text-disabled`: #475569 (Cinza escuro)
*   **Semânticas (Feedback):**
    *   `success`: #10B981 (Verde esmeralda)
    *   `error`: #EF4444 (Vermelho rubi)
    *   `warning`: #F59E0B (Laranja)

### 1.2. Tipografia (Typography)
Estilo moderno, limpo e com excelente legibilidade nas telas. Sugestão de fontes: **Inter**, **Space Grotesk** (para um toque mais tech) ou **Outfit**.

*   **Font Family:** `Inter`, sans-serif (Corpo) | `Outfit`, sans-serif (Títulos)
*   **Escala de Tamanhos:**
    *   `Display (H1 Hero)`: 64px / 72px (Mobile: 40px) | Peso: Bold/ExtraBold | Letter-spacing: -2%
    *   `H2 (Seções)`: 48px | Peso: Bold | Letter-spacing: -1%
    *   `H3 (Cards)`: 24px | Peso: SemiBold
    *   `Body Large`: 18px | Peso: Regular | Line-height: 160%
    *   `Body Base`: 16px | Peso: Regular | Line-height: 150%
    *   `Caption (Tags/Dicas)`: 14px ou 12px | Peso: Medium | Uppercase opcional

### 1.3. Espaçamento (Spacing) - Base 8px
*   `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 32px | `2xl`: 48px | `3xl`: 64px | `4xl`: 96px

### 1.4. Bordas e Sombras (Radii & Shadows)
*   **Border Radius:**
    *   Botões e Inputs: `8px` (Levemente arredondado)
    *   Cards e Modais: `16px` ou `24px` (Mais amigável)
*   **Sombras (Dark Mode Shadows):**
    *   `shadow-sm`: 0 2px 4px rgba(0,0,0, 0.5)
    *   `shadow-glow`: 0 0 24px rgba(124, 58, 237, 0.3) (Para botões primários)
    *   `border-subtle`: 1px solid rgba(255, 255, 255, 0.05) (Contorno de cards no fundo escuro)

---

## 2. Componentes (Átomos)

### 2.1. Botões (Buttons)
*   **Primary Button:** Fundo Roxo (`primary-base`), Texto Branco, `border-radius: 8px`, Efeito de `shadow-glow` ao passar o mouse. Transição suave (0.3s).
*   **Secondary Button:** Fundo transparente, borda `1px solid text-secondary`, texto `text-primary`. Ao passar o mouse, o fundo fica `bg-surface-2`.
*   **Ghost/Link Button:** Sem fundo, sem borda. Texto Roxo ou Branco. Underline ao passar o mouse.
*   **States:** `Default`, `Hover` (escala +1.02), `Active` (escala 0.98), `Disabled` (opacidade 50%, sem pointer).

### 2.2. Inputs e Formulários
*   **Input Box:** Fundo `bg-surface-1`, Borda `1px solid rgba(255,255,255,0.1)`.
*   **Placeholder:** `text-secondary`.
*   **Focus State:** A borda muda para `primary-base` e ganha um leve glow.
*   **Labels:** `text-primary`, 14px, mb-2.

### 2.3. Tags / Badges
Usados para classificar aulas, módulos ou ferramentas de IA.
*   **Estilo "Novo/IA":** Fundo `rgba(124, 58, 237, 0.1)`, Texto `primary-base`, Borda `1px solid primary-base`, Padding 4px 8px, Radius 999px (Pill).
*   **Estilo "Premium":** Fundo dourado/transparente com texto `secondary-base`.

---

## 3. Componentes Complexos (Moléculas e Organismos)

### 3.1. Card de Curso/Módulo
*   **Estrutura:** Container com `bg-surface-1`, borda sutil (`border-subtle`), Radius 16px.
*   **Imagem/Capa:** Proporção 16:9 no topo.
*   **Corpo:** Tag da categoria (ex: "ChatGPT"), Título `H3`, Descrição breve truncada (2 linhas).
*   **Rodapé do Card:** Avatar do professor + Nome, Barra de progresso (se for logado) ou Botão "Acessar" / "Ver mais".
*   **Interação:** No `hover`, o card sobe -4px (`transform: translateY(-4px)`) e a borda brilha levemente.

### 3.2. Navbar (Header)
*   **Background:** `bg-glass` (Efeito de vidro/translúcido) que fica fixo (`sticky`) no topo ao rolar a página.
*   **Esquerda:** Logo (Tipografia ou Ícone em branco/gradiente).
*   **Centro:** Links de navegação (Home, Cursos, Ferramentas, Comunidade) com efeito de linha inferior ao passar o mouse.
*   **Direita:** Botão "Entrar" (Secundário) e Botão "Assinar Agora" (Primário).

### 3.3. Hero Section (A primeira dobra do site)
*   **Layout:** Centralizado ou dividido (Texto 50% Esq / Imagem 50% Dir).
*   **Título:** Gigante (`Display`), muitas vezes usando um **Texto com Gradiente** (ex: do Roxo para o Azul ou Roxo para Dourado).
*   **Subtítulo:** Texto persuasivo, tamanho `Body Large`, cor `text-secondary`.
*   **Call to Action (CTA):** Botão Primário grande + Botão Secundário de vídeo/play.
*   **Fundo:** Malha de gradiente difusa (Mesh Gradient) muito escura ou elementos em 3D de IA borrados no fundo.

### 3.4. Depoimentos / Social Proof
*   Cards horizontais ou em grid de alvenaria (Masonry).
*   5 estrelas em Dourado (`secondary-base`).
*   Foto de perfil do aluno (redonda).
*   Texto em itálico ou regular com aspas sutis.

---

## 4. Layout e Grid

*   **Grid System:** 12 colunas padrão.
*   **Container Max-width:** 1200px ou 1440px (para manter focado no centro em telas gigantes).
*   **Gutter (Espaço entre colunas):** 24px.
*   **Breakpoints (Responsivo):**
    *   Mobile: `< 768px` (Stack vertical de tudo, padding 16px).
    *   Tablet: `768px - 1024px` (Grid de 2 colunas para cards).
    *   Desktop: `> 1024px` (Grid de 3 a 4 colunas para cards).

---

## 5. Efeitos Visuais, VFX e Animações (O "Tchan" do site)

Para atingir a qualidade "Academia Lendária", o CSS e o design precisam desses detalhes:

1.  **Text Gradient (Textos com Gradiente):**
    Usado em palavras-chave importantes nos títulos.
    ```css
    background: linear-gradient(90deg, #7C3AED 0%, #2563EB 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    ```
2.  **Mesh Gradients no Fundo:** Borrões de cor gigantes (Roxo e Azul) colocados com `filter: blur(100px)` e `opacity: 0.1` atrás do Hero e de blocos importantes.
3.  **Reveal on Scroll:** Elementos aparecem suavemente de baixo para cima (`fade-up`) à medida que o usuário rola a página.
4.  **Glassmorphism:** Usado em modais e menus dropdown. Fundo translúcido com `backdrop-filter: blur(12px)`.

---

## 6. Voz e Tom (UX Writing & Copy)

Um Design System também inclui como a marca se comunica.
*   **Arquétipo:** O Sábio / O Mago (Tecnológico, mentor, que destrava poderes).
*   **Tom:** Autoritativo, Direto, Motivacional, Premium, Futuro.
*   **Exemplos de Copy:**
    *   *Em vez de:* "Compre nosso curso" -> *Use:* "Desbloqueie seu acesso lendário".
    *   *Em vez de:* "Aulas de IA" -> *Use:* "Domine a Inteligência Artificial".
    *   *Em vez de:* "Clique aqui" -> *Use:* "Iniciar Jornada".

---

## 7. Como implementar isso rápido (Para Desenvolvedores)

Se você for codar isso, a stack recomendada para chegar nesse visual é:

*   **Framework CSS:** Tailwind CSS (As cores e espaçamentos acima se encaixam perfeitamente no `tailwind.config.js`).
*   **Componentes base:** Shadcn UI ou Aceternity UI (Especialmente o Aceternity, que tem exatamente esses efeitos de bordas brilhantes, neon e tech).
*   **Ícones:** Lucide Icons ou Phosphor Icons (linhas limpas, estilo regular/light).
