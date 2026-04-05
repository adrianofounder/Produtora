# API Security Audit & Hardening Report

## Sumário Executivo
Este documento cataloga o inventário completo da API REST (`src/app/api`) da Produtora, mapeando todas as rotas e garantindo que o hardening de segurança (conforme especificado na **Story 1.3 - API-01**) foi concluído com sucesso.

### Camadas de Proteção Ativas:
1. **Autenticação (L1):** `supabase.auth.getUser()` invocado via `requireAuth()` em todos os endpoints para bloquear acesso não-autenticado (`HTTP 401`).
2. **Resource Ownership (L2):** Cada endpoint dinâmico verifica explicitamente se o ID do recurso solicitado (Video, Canal, Alerta) pertence ao usuário ativo antes de acionar a ação principal (`HTTP 403`).
3. **Validação Estrutural (L3):** Uso rígido do ecossistema [Zod](https://zod.dev/) assegurando que objetos do Body sigam a tipagem e constraints de schemas requeridas (`HTTP 422`).
4. **Isolamento RLS (Supabase):** Além das APIS, o Row Level Security opera no banco mitigando vazamentos sistêmicos caso um loop escape as malhas lógicas.

---

## Inventário Refatorado de Endpoints

### 📺 1. Domínio de Vídeos
| Endpoint | Method | Zod Schema | Ownership / Auth Checks | Error State |
| :--- | :---: | :--- | :--- | :--- |
| `/api/videos` | `GET` | *N/A (Query)* | `requireAuth()`, `checkOwnership('canais', query)` | `401`, `403` |
| `/api/videos` | `POST` | `CreateVideoSchema` | `requireAuth()`, `checkOwnership('canais', body)` | `401`, `422`, `403` |
| `/api/videos/[id]`| `PATCH` | `UpdateVideoSchema` | `requireAuth()`, `checkOwnership('videos')` | `401`, `422`, `403` |
| `/api/videos/[id]`| `DELETE`| *N/A* | `requireAuth()`, `checkOwnership('videos')` | `401`, `403` |

### 🎬 2. Domínio de Canais
| Endpoint | Method | Zod Schema | Ownership / Auth Checks | Error State |
| :--- | :---: | :--- | :--- | :--- |
| `/api/canais` | `GET` | *N/A* | `requireAuth()` | `401` |
| `/api/canais` | `POST` | `CreateCanalSchema` | `requireAuth()` | `401`, `422` |
| `/api/canais/[id]`| `GET` | *N/A* | `requireAuth()`, `checkOwnership('canais')` | `401`, `403` |
| `/api/canais/[id]`| `PATCH` | `UpdateCanalSchema` | `requireAuth()`, `checkOwnership('canais')` | `401`, `422`, `403` |
| `/api/canais/[id]`| `DELETE`| *N/A* | `requireAuth()`, `checkOwnership('canais')` | `401`, `403` |
| `/api/canais/[id]/perfil`| `GET` | *N/A* | `requireAuth()`, `checkOwnership('canais')` | `401`, `403` |
| `/api/canais/[id]/perfil`| `PATCH`| `UpdateCanalSchema` | `requireAuth()`, `checkOwnership('canais')` | `401`, `422`, `403` |

### 🧠 3. Domínio de Inteligência Artificial
*(Custos associados à LLM e alto risco de manipulação abusiva)*

| Endpoint | Method | Zod Schema | Ownership / Auth Checks | Error State |
| :--- | :---: | :--- | :--- | :--- |
| `/api/ia/gerar-roteiro` | `POST` | `GerarRoteiroSchema` | `requireAuth()`, `checkOwnership('canais'/'videos')` | `401`, `422`, `403` |
| `/api/ia/gerar-titulos` | `POST` | `GerarTitulosSchema` | `requireAuth()`, `checkOwnership('canais')` | `401`, `422`, `403` |
| `/api/ia/analisar-canal`| `POST` | `AnalisarCanalSchema`| `requireAuth()`, `checkOwnership('canais')` | `401`, `422`, `403` |
| `/api/ia/auto-refill` | `POST` | `AutoRefillSchema` | `requireAuth()`, `checkOwnership('canais')` | `401`, `422`, `403` |

### 🧬 4. Domínio Complementar (Eixos, Blueprints, Alertas, Perfil)
| Endpoint | Method | Zod Schema | Ownership / Auth Checks | Error State |
| :--- | :---: | :--- | :--- | :--- |
| `/api/eixos` | `GET` | *N/A* | `requireAuth()`, `checkOwnership('canais', query)` | `401`, `403` |
| `/api/eixos` | `POST` | `CreateEixoSchema` | `requireAuth()`, `checkOwnership('canais', body)` | `401`, `422`, `403` |
| `/api/blueprints` | `GET` | *N/A* | `requireAuth()`, `checkOwnership('canais', query)` | `401`, `403` |
| `/api/blueprints` | `POST` | `CreateBlueprintSchema` | `requireAuth()`, `checkOwnership('canais', body)` | `401`, `422`, `403` |
| `/api/blueprints/[id]`| `GET` | *N/A* | `requireAuth()`, `checkOwnership('canais')` | `401`, `403` |
| `/api/blueprints/[id]`| `PUT` | `UpdateBlueprintSchema` | `requireAuth()`, `checkOwnership('canais')` | `401`, `422`, `403` |
| `/api/alertas` | `GET` | *N/A* | `requireAuth()` | `401` |
| `/api/alertas` | `POST` | `ReadAlertaSchema` | `requireAuth()`, `checkOwnership('alertas', body)` | `401`, `422`, `403` |
| `/api/perfil` | `GET` | *N/A* | `requireAuth()` | `401` |
| `/api/perfil` | `PATCH` | `UpdatePerfilSchema` | `requireAuth()` | `401`, `422` |

---

## Estrutura do Helper de Erros

A API agora lida com de-coupled responses via helpers centrais instanciáveis em `src/lib/api-utils.ts`:
- **`requireAuth()`:** Resolve dados da sessão ou interrompe o fluxo.
- **`checkOwnership(table, id, user_id)`:** Verifica propriedade.
- **`handleApiError(err)`:** Se `err` for instância de `ZodError`, emite um `HTTP 422` formatado com as falhas detectadas; em caso contrário, assume `500 Server Error`.

**Status de Segurança da API:** `✅ Hardened`.
