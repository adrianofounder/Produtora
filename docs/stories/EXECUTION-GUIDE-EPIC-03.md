# Guia de Execução — EPIC-03: A Máquina de Criação (Integração IA e Motores)

> **Como usar:** Copie e cole o comando no chat na ordem indicada.
> O fluxo padrão de cada story é: **Refinamento (@sm) → Implementar (@dev) → Validar (@qa) → Commitar**.
> *Atenção PM/PO:* Garanta que as diretrizes rigorosas contra o *Happy Path* e Agnósticas decretadas no [EPIC-03-FABRICA-E-IA.md](./EPIC-03-FABRICA-E-IA.md) sejam seguidas rigorosamente pelo `dev`.

---

### 🤖 Motores Recomendados (Otimização de Tokens)

*   ✍️ **Claude Sonnet / Gemini 3.1 Pro (High)**: Escrita abstrata, detalhamento de Requisitos e Histórias (@sm).
*   🧠 **Claude Opus / Sonnet (Thinking)**: Abstração de Interfaces / SOLID, Design patterns para Injeção de Interfaces de Motores (LLM/TTS agnósticos).
*   🎯 **Gemini 3.1 Pro (High)**: Design System (UX) e Gaveta de Produção Perfeita.
*   🛠️ **Gemini 3.1 Pro (Low) / GPT-OSS 120B**: Implementação de lógica contínua no Front e tratamentos básicos de erro `catch`.
*   ⚡ **Gemini 3 Flash**: Validações de QA de exceções de rede e limite de tokens, e fluxos rápidos.

---

## 🔵 SPRINT 6 — Fundações Criativas Controladas

> Construção das amarras de teto orçamentário (Limites) e a injeção do primeiro simulador de motor LLM robusto.

---

### ⏳ Story 3.1 — Cofre Central de APIS e Limites (Settings)
> **Objetivo:** Adicionar tela de inserção de Credenciais no painel Global e Toggle Switches que liguem/desliguem a trava de limite (ex: teto token). As senhas das apis ganham armazenamento RLS criptografado.

**Passo 1 — Refinamento da Story (✍️ @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-3.1 de Cofre de APIs e Teto de Limites baseando-se no escopo do @[docs/stories/EPIC-03-FABRICA-E-IA.md]
```
ok
**Passo 2 — Implementar (🎯 @dev):**
```
@[.agent/workflows/dev.md] implemente a story-3.1 definida pelo sm, sem esquecer de validar a seguranca do Supabase RLS.
```
ok
**Passo 3 — Validar (⚡ @qa):**
```
@[.agent/workflows/qa.md] valide a implementacao da story-3.1 (Tente ultrapassar tetos simulados ou inserir invalid keys).
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-3): story-3.1 - estrutura de teto de custos e apis do tenant"
```

---

### ⏳ Story 3.2 — Gaveta de Produção e Roteirização Flexível (LLM Abstracted)
> **Objetivo:** Abre-se a interface por cima do Kanban. O botão de Roteirizar vai puxar o Blueprint como contexto, acoplar-se à "Fachada da IA" no backend, prever erros e estourar os textos na caixa de edição da VUI de retenção.

**Passo 1 — Refinamento (✍️ @sm):**
```
@[.agent/workflows/sm.md] crie o arquivo da story-3.2 para montagem inicial da Gaveta e injecao de texto agnostica. 
```

**Passo 2 — Implementar (🧠 @dev):**
```
@[.agent/workflows/dev.md] implemente a arquitetura e gaveta da story-3.2, com design pattern e zero happy-path default.
```

**Passo 3 — Validar (⚡ @qa):**
```
@[.agent/workflows/qa.md] valide a story-3.2, testando tratamento de recusa simulada de api e atualizacao react da UI.
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-3): story-3.2 - modal gaveta e geracao simulada abstrata de gui"
```

---

## 🟣 SPRINT 7 — Sonorização e Empacotamento

> Lidar com buffers de áudio, geração visual simples e empacotamento em estante para exportação pelo Maestro.

---

### ⏳ Story 3.3 — Gaveta (Aba 3): Motor de Emissão Sonora (TTS)
> **Objetivo:** A Aba "Ouvir" transforma blocos extraidos do DB em amostras TTS provisórias/simuladas que baixam o MP3 final gerado para nuvem e mostram botão play nativo do painel.

**Passo 1 — Refinamento (✍️ @sm):**
```
@[.agent/workflows/sm.md] redija a story-3.3 detalhando armazenamento de som, interface agnostica de voz e edicao parágrafo.
```

**Passo 2 — Implementar (🎯 @dev):**
```
@[.agent/workflows/dev.md] implemente dinamicamente a story-3.3
```

**Passo 3 — Validar (⚡ @qa):**
```
@[.agent/workflows/qa.md] verifique estricto manuseio do buffer de áudio do storage na ui da story-3.3
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-3): story-3.3 - integracao mp3 blocks gerados na fabrica"
```

---

### ⏳ Story 3.4 — Empacotamento Visual e Asset Final
> **Objetivo:** Botão de Thumbnails, aprovação visual final e zíper (`Package`) de exportação do kit `.mp3`/`.txt`/`.png` no navegador do Maestro.

**Passo 1 — Refinamento (✍️ @sm):**
```
@[.agent/workflows/sm.md] crie o documento da story-3.4 de empacotamento visual
```

**Passo 2 — Implementar (🎯 @dev):**
```
@[.agent/workflows/dev.md] finalize a implementacao do epic-3 empacotando mídias via story-3.4
```

**Passo 3 — Teste Completo MVP (⚡ @qa):**
```
@[.agent/workflows/qa.md] implemente auditoria do fluxo "Gaveta -> Texto Aberto -> Audicao Play -> Download Pacote Completo" interceptando limites ficticios de Custos.
```

**Passo 4 — Commitar:**
```
git add -A && git commit -m "feat(epic-3): story-3.4 - compilador final de download e fim do epic3"
```

---

## 📊 Tracker de Progresso - EPIC-03

| Story | Título | Sprint | Status | Responsável Design |
|-------|--------|--------|--------|---------------------|
| 3.1 | Cofre de APIS e Limites/Teto | 6 | ⏳ A Fazer | @sm / @dev |
| 3.2 | Gaveta: Roteirização Abstrata | 6 | ⏳ A Fazer | @sm / @dev |
| 3.3 | Gaveta: Mecanismo de TTS/Voz | 7 | ⏳ A Fazer | @sm / @dev |
| 3.4 | Gaveta: Asset Visual Final e ZIP| 7 | ⏳ A Fazer | @sm / @dev |

---

## 🏁 Próximos Passos (Workflow AIOX)

Sempre que concluir um Story e fazer commit, atualize o Tracker acima. Quando TODAS estiverem concluídas, chame o PM novamente:
```
@[.agent/workflows/pm.md] O EPIC-03 foi 100% implementado. Feche as pendências no guia e inicie o briefing do próximo grande objetivo (EPIC-04).
```

---
*Guia Técnico Gerado por @pm (Morgan).*
