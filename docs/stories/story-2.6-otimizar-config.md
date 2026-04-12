# Story 2.6 — Otimizar Configuração do Next.js

**Story ID:** 2.6
**Epic:** EPIC-01 — Resolução de Débitos Técnicos
**Sprint:** 2 — Qualidade & Consistência
**Prioridade:** 🔵 P3
**Estimativa:** 2h
**Assignee:** @dev

---

## User Story

**Como** desenvolvedor,
**Quero** otimizar as configurações do `next.config.ts`,
**Para que** o sistema tenha melhor performance de entrega, segurança no carregamento de ativos e visibilidade sobre o tamanho do bundle.

---

## Contexto / Problema

**SYS-04:** O arquivo `next.config.ts` está vazio, perdendo oportunidades de otimização nativas do Next.js como compressão de ativos, restrição de domínios de imagem (segurança) e análise de bundle para evitar regressões de performance.

---

## Acceptance Criteria

- [x] **AC1:** Compressão (Gzip/Brotli) ativada.
- [x] **AC2:** Domínios de imagem do YouTube e Supabase configurados via `remotePatterns`.
- [x] **AC3:** `@next/bundle-analyzer` integrado e funcional via variável de ambiente `ANALYZE`.
- [x] **AC4:** Build do projeto completa sem erros.

---

## Tasks

- [x] **T1:** Criar este arquivo de estória.
- [x] **T2:** Instalar `@next/bundle-analyzer`.
- [x] **T3:** Configurar `next.config.ts` com as otimizações solicitadas.
- [x] **T4:** Validar build e geração de relatórios de bundle
- [x] Atualizar status para Ready for Review

---

## Dev Agent Record
**Agent Model Used:** Gemini 3.1 Pro (High)

### Completion Notes List
- Pacote `@next/bundle-analyzer` instalado e configurado. Relatórios HTML sendo gerados em `.next/analyze/` ao rodar com a flag `ANALYZE=true`.
- Ativada compressão nativa do Next.js.
- Configurados domínios de imagem (`i.ytimg.com`, `yt3.ggpht.com` e o bucket do Supabase do projeto) via `remotePatterns` para maior segurança.
- Build de produção e build de análise validados com sucesso.

### File List
- `next.config.ts` (MODIFICADO)
- `package.json` (MODIFICADO)
- `docs/stories/story-2.6-otimizar-config.md` (NOVO)

### Status
Ready for Review

---

## QA Results
**Review Date:** 2026-04-12
**QA Agent:** @qa (Quinn)
**Decision:** ✅ PASS

### Analysis
- **Build Status (AC4):** Build de produção (`npm run build`) concluído com sucesso. Zero erros encontrados. Uma única advertência de cache do Webpack foi observada, o que é comportamento padrão em ambientes Next.js 15.
- **Configurações de Otimização (AC1 & AC2):** Validado em `next.config.ts`. A compressão está ativa (`compress: true`) e os domínios de imagem para YouTube e Supabase estão corretamente restritos via `remotePatterns`.
- **Bundle Analyzer (AC3):** Verificado com sucesso. Ao disparar `$env:ANALYZE="true"; npm run build`, os relatórios visuais (`client.html`, `nodejs.html`, `edge.html`) são gerados com sucesso na pasta `.next/analyze`, permitindo auditoria detalhada do tamanho do bundle.

### Risks & Observations
- **Low Risk:** Configurações de infraestrutura estáveis.
- **Sugestão:** Recomenda-se integrar a verificação de tamanho de bundle no CI/CD futuramente para monitorar o crescimento do First Load JS.

### Evidence
- Production Build: ✅ PASS (Exit 0)
- Bundle Reports Generated: ✅ PASS (~1.3MB total de arquivos HTML gerados)
- RemotePatterns Configured: ✅ PASS

### Gate Conclusion
**Verdict: PASS**
A configuração do Next.js está otimizada e segura, resolvendo o débito SYS-04.
