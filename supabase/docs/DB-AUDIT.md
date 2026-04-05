# Database Audit & Security Reference

**Status:** Phase 2 Complete (Data Collection: Database)  
**Agent:** Data Engineer (@data-engineer)  
**Version:** 1.0  

---

## 1. Security Audit: Row Level Security (RLS)

All public tables have RLS enabled to ensure multi-tenant isolation.

| Table | Policy Name | Logic | Security Status |
| :--- | :--- | :--- | :--- |
| **`profiles`** | `profiles_own` | `auth.uid() = id` | ✅ Secure |
| **`canais`** | `canais_own` | `auth.uid() = user_id` | ✅ Secure |
| **`videos`** | `videos_own` | `auth.uid() = user_id` | ✅ Secure |
| **`eixos`** | `eixos_own` | `canal_id IN (SELECT id FROM canais WHERE user_id = auth.uid())` | ✅ Secure |
| **`blueprints`** | `blueprints_own` | `canal_id IN (SELECT id FROM canais WHERE user_id = auth.uid())` | ✅ Secure |
| **`alertas`** | `alertas_own` | `auth.uid() = user_id` | ✅ Secure |
| **`api_keys`** | `api_keys_own` | `auth.uid() = user_id` | ✅ Secure |

---

## 2. Performance Audit: Indexes

Existing indexes to optimize common queries.

| Index Name | Target Column(s) | Purpose |
| :--- | :--- | :--- |
| `idx_canais_user_id` | `public.canais(user_id)` | Fast lookup for user-owned channels. |
| `idx_videos_user_id` | `public.videos(user_id)` | Fast lookup for user-owned videos. |
| `idx_videos_canal_id`| `public.videos(canal_id)`| Fast lookup for videos per channel. |
| `idx_videos_status` | `public.videos(status)` | Optimized for dashboard filtering. |
| `idx_alertas_user_lido`| `public.alertas(user_id, lido)` | Optimized for unread notifications count. |

---

## 3. Database Technical Debt

| ID | Issue | Severity | Data Area | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **DB-001** | Lack of Unit Uniqueness | 🟡 Medium | `videos` | Consider unique constraint on `youtube_video_id` for better data integrity. |
| **DB-002** | Workflow Steps Complexity | 🟡 Medium | `videos` | 7 boolean `step_*` columns might be better represented as a single JSONB or state machine table if steps scale. |
| **DB-003** | Missing Constraints | 🔵 Low | `canais` | Add validation constraints to `horario_padrao` (e.g., regex for HH:MM). |
| **DB-004** | Manual Schema Syync | 🟠 High | System | Implement a proper migration tool (like Supabase CLI) instead of manual `schema.sql` updates. |

---

**Next Steps (Phase 3):**  
Proceed to **Frontend/UX Documentation** (`create-front-end-spec`) with the `@ux-design-expert` agent.
