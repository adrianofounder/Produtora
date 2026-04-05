# Specialist Review Report (Fases 5, 6 e 7)

Este relatório consolida as revisões técnicas realizadas pelos especialistas da Squad AIOX sobre o estado atual do projeto AD_LABS.

---

## 1. Revisão de Database (@data-engineer) - Fase 5
**Foco:** Integridade, Normalização e Migração.

- **Status:** **CRÍTICO**. 
- **Parecer:** A falta de versionamento de banco (migrations) é o maior risco operacional. Qualquer alteração manual no Dashboard do Supabase pode quebrar o ambiente local.
- **Recomendação:** Prioridade máxima para inicializar o **Supabase CLI** e converter o `schema.sql` em uma baseline de migration formal.
- **Dívida de Dados:** Manter os steps booleanos na tabela `videos` por enquanto para evitar refactoring disruptivo, mas adicionar validação de tipos `CHECK` para garantir integridade.

---

## 2. Revisão de UX (@ux-design-expert) - Fase 6
**Foco:** Consistência visual e performance percebida.

- **Status:** **ESTÁVEL / POLIMENTO**.
- **Parecer:** O sistema visual "Lendária" está bem implementado em `canais` e `laboratorio`. A hierarquia visual está correta.
- **Recomendação:** Implementar **Skeletons (Framer Motion)** para os cards de vídeo. Atualmente, a transição entre telas vazias e telas com dados é muito brusca, prejudicando a sensação "premium".
- **Acessibilidade:** Confirmar se o cinza secundário (`var(--color-text-3)`) passa nos testes de contraste do WCAG AA.

---

## 3. Revisão de QA & Estabilidade (@qa) - Fase 7
**Foco:** Compilação, Versões e Build.

- **Status:** **ALERTA**.
- **Parecer:** O uso do Next.js 16 (Canary) detectado no log (`▲ Next.js 16.2.2 (Turbopack)`) é desnecessário para as features atuais e gera riscos de segurança não catalogados.
- **Recomendação:** Downgrade para **Next.js 15.1.x Stable**. O aviso do console sobre `middleware` vs `proxy` deve ser endereçado durante o downgrade.
- **Linting:** Resolver os 3000+ avisos é essencial para que o CI/CD funcione no futuro.

---

**Salve em:** `docs/prd/specialist-reviews.md`
