---
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: [security_scan, audit_trail_validation, token_limit_check, integration_test]
epic: "EPIC-04"
story: "4.4"
sprint: 9
depends_on: ["story-4.3", "epic-03-itext-engine"]
---

# Story 4.4 — Auto-Refill e Automação de Madrugada (Cronjob)

## Objetivo
Criar o endpoint seguro `/api/cron/auto-refill` que opera como um job noturno autônomo. O job verifica se a fila de produção do tenant tem menos de 2 vídeos em `status = 'planejamento'`; em caso afirmativo, consome o `ITextEngine` do EPIC-03 para gerar 5 novas Ideias do Eixo Vencedor corrente, gravando trilha de auditoria obrigatória (`[Automação Lvl 3]`) em conformidade com NFR06. O teto orçamentário de tokens do EPIC-03 é verificado como **primeira instrução** — se esgotado, o job encerra silenciosamente sem geração e sem logs de erro falso.

---

## Contexto do Sistema Existente

- **ITextEngine (`EPIC-03`):** Interface agnóstica de geração de texto. Localização: `src/lib/engines/text-engine.ts` (ou equivalente). Aceita `prompt: string` e retorna `{ text: string, tokensUsed: number }`.
- **consumption-tracker.ts (`EPIC-03`):** Utilitário para verificar e registrar consumo de tokens. Funções: `checkDailyLimit(tenantId)` e `registerUsage(tenantId, tokens)`.
- **Tabelas:** `videos`, `ideias`, `eixos`, `api_credentials` (criadas nos EPICs anteriores).
- **Kill-switch:** Flag `auto_refill_enabled` (boolean) na tabela `tenant_settings` ou em `api_credentials`.

---

## Critérios de Aceitação

### AC1 — Endpoint criado e seguro

```
POST /api/cron/auto-refill
Authorization: Bearer {CRON_SECRET_TOKEN}
```

- O endpoint valida o header `Authorization` contra a variável de ambiente `CRON_SECRET` (variável segura, nunca exposta no client).
- Resposta 401 imediata se o token estiver ausente ou incorreto.
- Pode ser acionado pela infraestrutura externa (Vercel Cron Jobs / Supabase Edge Functions Scheduler).
- Lógica principal é executada por tenant (iteração sobre todos os tenants ativos — ou um tenant específico se `tenant_id` for passado no body).

### AC2 — Kill-switch verificado como primeira instrução

```ts
const settings = await getTenantSettings(tenantId);
if (!settings.auto_refill_enabled) {
  return { skipped: true, reason: 'Kill-switch ativo' };
}
```

- Se o usuário desativou o Auto-Refill em `/configuracoes`, o job retorna imediatamente sem processar nada.
- O toggle de ativação/desativação deve ser visível em `/configuracoes` (UI básica: toggle switch).

### AC3 — Verificação de teto de tokens ANTES de gerar

```ts
const canGenerate = await checkDailyLimit(tenantId);
if (!canGenerate) {
  console.log(`[Auto-Refill] Tenant ${tenantId}: teto de tokens atingido. Abortando.`);
  return { skipped: true, reason: 'Teto de tokens esgotado' };
}
```

- Se o `consumption-tracker` indicar que o limite foi atingido, o job encerra **sem erro, sem exceção**, apenas com log informativo.
- Nunca lançar `throw` neste cenário — é comportamento esperado.

### AC4 — Verificação da fila de produção

```ts
const { count } = await supabase
  .from('videos')
  .select('*', { count: 'exact', head: true })
  .eq('tenant_id', tenantId)
  .eq('status', 'planejamento');

if (count >= 2) {
  return { skipped: true, reason: 'Fila suficiente' };
}
```

- Só prossegue se a contagem de vídeos em `status = 'planejamento'` for `< 2`.

### AC5 — Geração via ITextEngine (NFR01 — Agnosticidade)

```ts
const eixoVencedor = await getEixoVencedor(tenantId);
const prompt = buildAutoRefillPrompt(eixoVencedor);

const { text, tokensUsed } = await ITextEngine.generate(prompt);
const novasIdeias = parseIdeiasFromText(text); // parseia as 5 ideias do output LLM
```

- **Proibido** importar SDK de qualquer LLM diretamente (OpenAI, Anthropic etc.) fora da fachada `ITextEngine`.
- O `prompt` deve incluir: nome do eixo, premissa, gancho, persona do canal, e instrução para gerar 5 ideias no formato JSON.
- `parseIdeiasFromText()` deve tratar falha de parse (output malformado da IA) sem quebrar o job — retornar array vazio com log de aviso.

### AC6 — Persistência das Ideias com Auditoria (NFR06)

```ts
for (const ideia of novasIdeias) {
  await supabase.from('ideias').insert({
    tenant_id: tenantId,
    eixo_id: eixoVencedor.id,
    titulo: ideia.titulo,
    premissa: ideia.premissa,
    nota_ia: ideia.nota_ia,
    status: 'pendente',
    origem: '[Automação Lvl 3]',    // ← OBRIGATÓRIO (NFR06)
    origem_uuid: null,               // null = origem não-humana
  });
}

await registerUsage(tenantId, tokensUsed);
```

- Todas as ideias geradas automaticamente TÊM `origem = '[Automação Lvl 3]'`.
- O uso de tokens é registrado APÓS a geração bem-sucedida.

### AC7 — Recálculo de score_mare disparado pós-geração

- Após inserir as novas ideias, o job dispara `calcularScoreMare()` (do Motor Marés — Story 4.3) e salva os novos scores no banco.
- Isso garante que ao acordar, o usuário já vê os dados de analytics atualizados.

### AC8 — Toggle de Kill-switch na UI de `/configuracoes`

- Seção "Automação de Conteúdo" com:
  - Toggle Switch: "Auto-Refill Noturno" (liga/desliga)
  - Texto de status: "Última execução: {data/hora}" ou "Nunca executado"
  - Indicador do teto: "Tokens usados hoje: X / Y"

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/app/api/cron/auto-refill/route.ts` | CRIAR — endpoint POST seguro |
| `src/lib/auto-refill.ts` | CRIAR — lógica core do job (pura, testável) |
| `src/lib/prompt-builder.ts` | CRIAR — função `buildAutoRefillPrompt()` |
| `src/app/(dashboard)/configuracoes/page.tsx` | MODIFICAR — toggle de kill-switch + status |
| `supabase/migrations/YYYYMMDD_add_tenant_settings.sql` | CRIAR — tabela ou coluna `auto_refill_enabled` |
| `.env.example` | MODIFICAR — adicionar `CRON_SECRET` |

---

## Notas de Implementação Críticas

> **NFR01 (Agnosticidade):** `auto-refill.ts` importa `ITextEngine`, NUNCA `openai` ou `anthropic` diretamente.

> **NFR06 (Auditoria):** A ausência do campo `origem = '[Automação Lvl 3]'` é um BUG CRÍTICO. O @qa deve verificar este campo em TODA ideia gerada pelo job.

> **Erro silencioso permitido:** Quando teto esgotado ou kill-switch ativo, retornar `{ skipped: true }` com HTTP 200. Um 4xx/5xx aqui causaria alarmes falsos na infra.

> **Segurança do `CRON_SECRET`:** Deve ser uma variável de ambiente gerada com `openssl rand -base64 32`. NUNCA commitar o valor real.

---

## Definition of Done

- [ ] Endpoint `/api/cron/auto-refill` retorna 401 sem o token correto
- [ ] Kill-switch `auto_refill_enabled = false` encerra o job sem gerar nada
- [ ] Teto de tokens esgotado encerra o job com HTTP 200 e log informativo
- [ ] Fila `>= 2` vídeos encerra o job sem gerar nada
- [ ] Ideias geradas têm `origem = '[Automação Lvl 3]'` e `origem_uuid = null`
- [ ] `ITextEngine` é o único ponto de chamada LLM (sem SDKs diretos)
- [ ] Toggle de kill-switch funcional em `/configuracoes`
- [ ] @architect aprova o design de segurança do endpoint e a cadeia de verificações
