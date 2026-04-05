# Relatório Final de Débitos Técnicos (Discovery)

**Data:** 05/04/2026  
**Status:** Discovery Complete ✅

Este documento é a versão final para aprovação da Phase 10 (Transição para Resolução).

---

## 🔝 Top 3 Prioridades (Impacto Máximo)

| ID | Descrição | Esforço | Motivação |
| :--- | :--- | :--- | :--- |
| **01** | Downgrade Next.js 16 -> 15.1.x | 🟠 Médio | Garantir estabilidade e suporte técnico. |
| **02** | Inicializar Supabase CLI (Migrations) | 🟢 Baixo | Segurança e versionamento do banco de dados. |
| **03** | Limpeza de Linting (3000+ avisos) | 🟠 Médio | Silenciar o "ruído" para que erros reais apareçam. |

---

## 🎨 Frontend (UX/UI)
*Otimização do ambiente já aprovado.*

- **O que fazer:** Implementar Skeletons/Loading nos cards e tabelas.
- **Status:** Estável.

---

## 🏗️ Gestão de Crise (Infra)
*Monitoramento contínuo da conta Google.*

- **O que fazer:** Manter o monitoramento das chaves de API. Caso o acesso ao Supabase caia, executar o Plano de Migração (Cenário B) no novo projeto.

---

**Salve em:** `docs/prd/technical-debt-FINAL.md`
