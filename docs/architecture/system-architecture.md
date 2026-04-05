# System Architecture - Produtora (temp-app)

## 🏗️ Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|------------|---------|
| **Core** | Next.js (App Router) | 15.1.6 |
| **Linguagem** | TypeScript | ^5 |
| **Estilização** | Tailwind CSS | ^4 |
| **Backend/Auth** | Supabase (SSR) | ^0.10.0 |
| **Componentes UI** | Radix (Base UI), shadcn/ui | - |
| **Animações** | Framer Motion | ^12.38.0 |

## 📁 Estrutura de Pastas (src/)

```text
src/
├── app/                  # Roteamento Next.js (App Router)
│   ├── (auth)/           # Grupo de rotas de autenticação
│   ├── (dashboard)/      # Grupo de rotas principais do painel
│   ├── api/              # Endpoints da API (Alertas, IA, Vídeos, etc.)
│   ├── auth/             # Callbacks de autenticação
│   ├── layout.tsx        # Layout raiz
│   └── page.tsx          # Landing page/Entry point
├── components/           # Componentes React organizados por domínio
│   ├── studio/           # Editor e ferramentas de criação
│   ├── laboratorio/      # Pesquisa e experimentação
│   ├── hq/               # Gestão central
│   ├── ui/               # Componentes base (Design System)
│   └── ...               # Outros domínios (canais, dashboard, layout)
├── lib/                  # Bibliotecas e utilitários
│   ├── supabase/         # Configuração do cliente Supabase (SSR/Server/Client)
│   └── utils.ts          # Utilitários gerais (tailwind-merge, clsx)
└── middleware.ts         # Proteção de rotas e persistência de sessão (JWT)
```

## 🔌 Pontos de Integração

- **Supabase**: Integração nativa para Auth, Database e Storage via `@supabase/ssr`.
- **API Interna**: Endpoints estruturados em `/api/` para:
  - `ia/`: Processamento de inteligência artificial.
  - `videos/`: Gestão e processamento de mídia.
  - `blueprints/`: Definições de estruturas de produção.
  - `alertas/`, `canais/`, `perfil/`.

## ⚙️ Configurações Críticas

- **TypeScript**: Configurado com caminhos absolutos (`@/*` -> `./src/*`).
- **Tailwind 4**: Utilizando `@tailwindcss/postcss`.
- **Middleware**: Protege todas as rotas exceto estáticos e rotas públicas explicitadas (`/login`, `/cadastro`, `/auth/callback`).

## ⚠️ Débitos Técnicos Sistêmicos (Identificados)

1. **Clutter na Raiz**: Excesso de arquivos temporários/txt na raiz do projeto (`workmeu`, `veterano.txt`, `comandos aios.txt`).
2. **Naming**: O projeto ainda está nomeado como `"temp-app"` no `package.json`.
3. **Linting**: O arquivo `lint-out.txt` indica um volume massivo de erros de linting pendentes.
4. **Configurações**: `next.config.ts` vazio; oportunidades de otimização de build/vizinhança não exploradas.
5. **Types**: O arquivo `database.types.ts` parece gerado mas precisa ser verificado se está em sincronia com o banco atual.
