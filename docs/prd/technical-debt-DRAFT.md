# Technical Debt Assessment - DRAFT
## Para Revisão dos Especialistas (Fases 5-7)

Este documento consolida todos os débitos técnicos identificados durante as Fases 1, 2 e 3 do workflow de descoberta. Os itens abaixo requerem validação e estimativa de esforço pelos especialistas (@data-engineer, @ux-design-expert e @qa).

---

### 1. Débitos de Sistema (Arquitetura)
*Identificados por @architect*

| ID | Débito | Impacto | Risco | Notas |
| :--- | :--- | :--- | :--- | :--- |
| **SYS-01** | Next.js 16 Canary | 🔥 Crítico | Alto | Versão experimental pode causar instabilidades no build e runtime. Recomendo downgrade para v15 estável. |
| **SYS-02** | Ruído de Linting | 🟡 Médio | Baixo | 3700+ linhas de erros, principalmente no `.aiox-core`. Dificulta a identificação de bugs reais no código da app. |
| **SYS-03** | Inconsistência de Import | 🔵 Baixo | Baixo | Mistura de `require()` e `import` em arquivos legados. |

---

### 2. Débitos de Database (Dados)
*Identificados por @data-engineer*
⚠️ **PENDENTE: Revisão do Especialista**

| ID | Débito | Impacto | Risco | Notas |
| :--- | :--- | :--- | :--- | :--- |
| **DB-01** | Gestão Manual de Schema | 🟠 Alto | Médio | Dependência de `schema.sql` manual em vez de migrations versionadas (ex: Supabase CLI). |
| **DB-02** | Unicidade de ID Vídeo | 🟡 Médio | Baixo | Falta constraint UNIQUE em `youtube_video_id` na tabela `videos`. |
| **DB-03** | Booleans de Workflow | 🟡 Médio | Baixo | 7 colunas `step_*` na tabela `videos`. Pode se tornar rígido se o workflow mudar. |

---

### 3. Débitos de Frontend/UX (Interface)
*Identificados por @ux-design-expert*
✅ **REVISADO: STATUS ESTÁVEL**

| ID | Débito | Impacto | Risco | Notas |
| :--- | :--- | :--- | :--- | :--- |
| **UX-01** | Estados de Carregamento | 🟡 Médio | Baixo | Ausência de Skeletons ou Loading States em views que dependem do Supabase. |
| **UX-02** | Contraste de Acessibilidade | 🔵 Baixo | Baixo | Verificar contraste de textos secundários em backgrounds ultra-dark. |

---

### 4. Matriz de Priorização Preliminar (ATUALIZADA)

| Prioridade | ID | Área | Esforço (Est.) | Valor / Impacto |
| :--- | :--- | :--- | :--- | :--- |
| **1 (Crítica)** | SYS-01 | Sistema | Médio | Estabilização total do projeto (Downgrade Next.js). |
| **2 (Crítica)** | INF-01 | Infra | Alta | **CONTINGÊNCIA: REATIVAR/MIGRAR CONTA GOOGLE/SUPABASE**. |
| **3 (Alta)** | DB-01 | Database | Médio | Segurança e versionamento da infraestrutura. |
| **4 (Média)** | SYS-02 | Sistema | Baixo | Limpeza do ambiente de desenvolvimento. |

---

### 5. Perguntas para Especialistas

- **@data-engineer**: O `schema.sql` atual reflete 100% do que está em produção no Supabase? Recomenda migrar para Supabase CLI agora?
- **@ux-design-expert**: Existe algum componente do Shadcn que ainda não foi estilizado para o padrão "Lendária" e que será necessário nas próximas telas?
- **@qa**: Qual o risco de regressão ao realizar o downgrade do Next.js de v16 para v15? Existem features de v16 sendo usadas no Dashboard?

---

**Salve em:** `docs/prd/technical-debt-DRAFT.md`
