# Database Schema Reference

**Status:** Phase 2 Complete (Data Collection: Database)  
**Agent:** Data Engineer (@data-engineer)  
**Version:** 1.0  

---

## 1. Entity Relationship Overview

The database uses a multi-tenant structure where most entities are owned by a `user_id` (referencing `auth.users`).

### Core Tables

#### `profiles`
Mirror of `auth.users` for application-level metadata.
- **PK**: `id` (UUID, references `auth.users.id`)
- **Fields**: `email`, `full_name`, `avatar_url`, `role` (admin/editor/viewer)

#### `canais`
Central entity for video production channels.
- **PK**: `id` (UUID)
- **FK**: `user_id` -> `auth.users.id`
- **Keys**: `youtube_channel_id`, OAuth tokens.
- **Logic**: Stores "Auto-Refill Motor" configurations and "Tide" (Maré) status.

#### `videos`
Production unit for content.
- **PK**: `id` (UUID)
- **FK**: `canal_id` -> `canais.id`
- **FK**: `user_id` -> `auth.users.id`
- **Status**: `planejamento`, `producao`, `pronto`, `agendado`, `publicado`, `erro`.
- **Checklist**: 7 boolean steps for operational tracking.

#### `eixos` (Motor de Marés)
Creative axes for testing content performance.
- **PK**: `id` (UUID)
- **FK**: `canal_id` -> `canais.id`
- **Fields**: Strategic metadata (Arquetipo, Conflito, Payoff, etc.).

#### `blueprints` (Studio)
Deep analysis of channel/video benchmarks.
- **PK**: `id` (UUID)
- **FK**: `canal_id` -> `canais.id` (Unique)

---

## 2. Infrastructure & Automation

### Triggers
- `on_auth_user_created`: Automatically creates a `public.profiles` entry when a user signs up.
- `set_updated_at`: Generic trigger to update the `updated_at` timestamp on `canais`, `videos`, `eixos`, and `blueprints`.

### Extensions
- `uuid-ossp`: For UUID generation.
- `pgcrypto`: For cryptographic functions (used for API key storage).

---

## 3. TypeScript Integration

Types are located at `src/lib/supabase/database.types.ts`.  
They are currently synchronized with the physical schema, ensuring full type-safety for database operations via the Supabase client.
