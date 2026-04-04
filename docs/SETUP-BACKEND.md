# 🚀 Guia de Setup do Banco — AD_LABS

## Pré-requisitos
- Projeto Supabase criado (URL e chaves já estão no `.env`)
- Acesso ao SQL Editor do Dashboard

## Etapa 1: Executar o Schema

1. Acesse: https://supabase.com/dashboard/project/ahntcswcfuscmuyiadre/sql
2. Cole o conteúdo de `docs/schema.sql` e clique **Run**
3. Verifique que todas as tabelas foram criadas na aba **Table Editor**

### Tabelas criadas:
| Tabela | Descrição |
|--------|-----------|
| `profiles` | Usuários (espelho de auth.users) |
| `canais` | Canais YouTube gerenciados |
| `videos` | Pipeline de produção |
| `eixos` | Motor de Marés — eixos temáticos |
| `blueprints` | Studio Blueprint por canal |
| `alertas` | Notificações do sistema |
| `api_keys` | Chaves de API criptografadas |

## Etapa 2: Configurar Auth no Supabase

### Google OAuth
1. Supabase → Authentication → Providers → Google
2. Habilitar e preencher:
   - Client ID: `842588850639-po7gmfr6gqn0jbqfanj41n1ouqtrk23m.apps.googleusercontent.com`
   - Client Secret: (do `.env`)
3. Copiar a **Callback URL** fornecida e adicionar no Google Cloud Console

### Google Cloud Console
1. https://console.cloud.google.com/apis/credentials
2. Projeto → Credenciais → OAuth 2.0 Client IDs
3. Adicionar URI de redirecionamento autorizado:
   - `https://ahntcswcfuscmuyiadre.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (dev)

## Etapa 3: Rodar o Projeto

```bash
npm run dev
# Acesse: http://localhost:3000
```

## Etapa 4: Criar Primeiro Canal

Via API (com token de usuário após login):
```bash
curl -X POST http://localhost:3000/api/canais \
  -H "Content-Type: application/json" \
  -d '{"nome": "Histórias Ocultas", "idioma": "pt-BR", "pais": "BR"}'
```

Ou via UI: Login → Dashboard → Novo Canal

## Etapa 5: Testar Auto-Refill (Motor de Marés)

1. Criar um canal
2. Criar pelo menos 1 eixo para o canal via `/api/eixos`
3. Atualizar o canal com `motor_ativo: true`
4. Chamar o endpoint:
```bash
curl -X POST http://localhost:3000/api/ia/auto-refill \
  -H "Content-Type: application/json" \
  -d '{"canal_id": "SEU_CANAL_ID"}'
```
O motor vai verificar o estoque, gerar títulos via Gemini e criar vídeos automaticamente.

## APIs Disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/canais` | Lista canais do usuário |
| POST | `/api/canais` | Cria canal |
| GET | `/api/canais/[id]` | Detalhes do canal |
| PATCH | `/api/canais/[id]` | Atualiza canal |
| PATCH | `/api/canais/[id]/perfil` | Salva perfil (4.3) |
| GET | `/api/videos?canal_id=x` | Lista vídeos do canal |
| POST | `/api/videos` | Cria vídeo |
| PATCH | `/api/videos/[id]` | Atualiza steps/status/aprovação |
| GET | `/api/alertas` | Lista alertas não lidos |
| GET | `/api/blueprints/[canalId]` | Blueprint do canal |
| PUT | `/api/blueprints/[canalId]` | Salva Blueprint |
| GET | `/api/eixos?canal_id=x` | Lista eixos |
| POST | `/api/eixos` | Cria eixo |
| POST | `/api/ia/gerar-roteiro` | Gera roteiro via Gemini |
| POST | `/api/ia/gerar-titulos` | Gera 5 títulos via Gemini |
| POST | `/api/ia/analisar-canal` | Analisa benchmark via Gemini |
| POST | `/api/ia/auto-refill` | Motor de reabastecimento automático |
| GET | `/api/perfil` | Perfil do usuário logado |
| POST | `/auth/callback` | OAuth callback |

## Arquitetura Backend

```
src/
├── app/
│   ├── api/
│   │   ├── canais/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET, PATCH, DELETE
│   │   │       └── perfil/
│   │   │           └── route.ts  # GET, PATCH
│   │   ├── videos/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/route.ts     # PATCH, DELETE
│   │   ├── blueprints/
│   │   │   └── [id]/route.ts     # GET, PUT
│   │   ├── eixos/route.ts        # GET, POST
│   │   ├── alertas/route.ts      # GET, POST
│   │   ├── perfil/route.ts       # GET, PATCH
│   │   └── ia/
│   │       ├── gerar-roteiro/route.ts
│   │       ├── gerar-titulos/route.ts
│   │       ├── analisar-canal/route.ts
│   │       └── auto-refill/route.ts
│   └── auth/callback/route.ts    # OAuth
├── lib/supabase/
│   ├── client.ts                 # Browser client
│   ├── server.ts                 # Server client
│   └── database.types.ts         # TypeScript types
├── middleware.ts                  # Route protection
└── components/canais/
    └── video-drawer.tsx           # Linha de Montagem (5 abas)
```
