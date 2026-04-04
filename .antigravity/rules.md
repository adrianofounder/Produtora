# Synkra AIOX Development Rules for AntiGravity

You are working with Synkra AIOX, an AI-Orchestrated System for Full Stack Development.

## Core Development Rules

### Agent Integration
- Recognize AIOX agent activations: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- Agent commands use * prefix: *help, *create-story, *task, *exit
- Follow agent-specific workflows and patterns

### Story-Driven Development
1. **Always work from a story file** in docs/stories/
2. **Update story checkboxes** as you complete tasks: [ ] → [x]
3. **Maintain the File List** section with all created/modified files
4. **Follow acceptance criteria** exactly as written

### Code Quality Standards
- Write clean, maintainable code following project conventions
- Include comprehensive error handling
- Add unit tests for all new functionality
- Follow existing patterns in the codebase

### Testing Protocol
- Run all tests before marking tasks complete
- Ensure linting passes: `npm run lint`
- Verify type checking: `npm run typecheck`
- Add tests for new features

## AIOX Framework Structure

```
aiox-core/
├── agents/       # Agent persona definitions
├── tasks/        # Executable task workflows
├── workflows/    # Multi-step workflows
├── templates/    # Document templates
└── checklists/   # Validation checklists

docs/
├── stories/      # Development stories
├── prd/          # Sharded PRD sections
└── architecture/ # Sharded architecture
```

## Development Workflow

1. **Read the story** - Understand requirements fully
2. **Implement sequentially** - Follow task order
3. **Test thoroughly** - Validate each step
4. **Update story** - Mark completed items
5. **Document changes** - Update File List

## Best Practices

### When implementing:
- Check existing patterns first
- Reuse components and utilities
- Follow naming conventions
- Keep functions focused and small

### When testing:
- Write tests alongside implementation
- Test edge cases
- Verify error handling
- Run full test suite

### When documenting:
- Update README for new features
- Document API changes
- Add inline comments for complex logic
- Keep story File List current

## Git & GitHub

- Use conventional commits: `feat:`, `fix:`, `docs:`, etc.
- Reference story ID in commits: `feat: implement IDE detection [Story 2.1]`
- Ensure GitHub CLI is configured: `gh auth status`
- Push regularly to avoid conflicts

## Common Patterns

### Error Handling
```javascript
try {
  // Operation
} catch (error) {
  console.error(`Error in ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
}
```

### File Operations
```javascript
const fs = require('fs-extra');
const path = require('path');

// Always use absolute paths
const filePath = path.join(__dirname, 'relative/path');
```

### Async/Await
```javascript
async function operation() {
  try {
    const result = await asyncOperation();
    return result;
  } catch (error) {
    // Handle error appropriately
  }
}
```

---
*Synkra AIOX AntiGravity Configuration v1.0*


Extrai os maiores insights das minhas regras no Claude e vou compartilhar com vocês:

PRINCÍPIOS DE VETERANO -
Destilado de +10.000 sessões reais de Claude Code

O Mantra
“Never take the lazy path. Do the hard work now. The shortcut is forbidden.”
Atalho hoje = debugging amanhã. Sem exceção.

A Equação que Governa Tudo

30 minutos de análise agora = 10 horas de debugging evitadas depois


O trabalho da IA é devolver tempo ao humano. Isso significa:
	∙	Análise sempre profunda e completa
	∙	Relatórios que reduzem carga cognitiva do decisor
	∙	Nunca otimizar para menos tokens às custas de profundidade
Atalhos criam dívida invisível. Dívida invisível cobra juros compostos.

PARTE I: MODELO MENTAL
1. A Inversão Fundamental
A maioria usa assim:

Eu penso → Eu peço → Claude executa


O modelo correto:

Claude explora → Claude propõe arquitetura → Eu valido/ajusto → Claude executa → Claude verifica


Você não é o executor que delega tarefas.
Você é o arquiteto que valida decisões.
A diferença de produtividade entre esses dois modelos: 10x a 50x.

2. Gradiente de Permissão

READ     → Livre (faça sem perguntar)
MOVE     → Após aprovação de direção
CREATE   → Verificar se similar existe primeiro
DELETE   → SEMPRE confirmar


Quanto mais destrutiva a ação, mais explícita a permissão necessária.
Corolário: Aprovação de direção = execute até completar. Só pare para DELETE significativo ou dúvida genuína. Nunca “Quer que eu continue?” após aprovação já dada.

3. A Regra do 2x

Se o usuário repetiu algo 2x → você não entendeu


Repetição não é ênfase. É sinal de erro.
Ação: PARE e faça EXATAMENTE o que foi pedido.
Corolário: Se você corrigiu o mesmo tipo de erro 2x, falta uma regra no CLAUDE.md. Adicione imediatamente.

PARTE II: ANTES DE EXECUTAR
4. Verificação Física Antes de Teoria
Regra de Ouro: VERIFIQUE FISICAMENTE ANTES DE TEORIZAR
4 Checagens obrigatórias antes de declarar “completo”:

1. 📁 Arquivo existe onde o código espera? → ls -la /caminho/exato/
2. 🌐 Servidor serve? → curl -I http://localhost:PORT/path
3. 👂 Usuário repetiu input 2x? → PARE, faça EXATAMENTE o que ele disse
4. ✅ Testou com hard refresh? → Cmd+Shift+R (limpa cache)


Red Flags de que você está assumindo:
	∙	Assumindo caminhos sem ls -la
	∙	Teorizando antes de evidência física
	∙	Ignorando input repetido
	∙	Lendo arquivos parcialmente antes de editar

5. Leitura Completa ou Nada
NUNCA leia arquivos parcialmente.

❌ Read(file, limit: 100) + Edit = Conflitos, duplicações, quebras
✅ Read(file) + Edit = Contexto completo, mudanças corretas


“Mas tokens?” → Ler completamente ECONOMIZA tokens prevenindo erros que custam 10x mais para consertar.

6. Discovery Antes de Implementação
Mapeie sistemas existentes antes de criar novos.

Fase 1: Query sistemas existentes
"O que já existe relacionado a [X]?"

Fase 2: Verificar volume/uso
"Quantos registros? Última atualização?"

Fase 3: Apresentar findings ANTES de propor
"Existente: [o que já existe + stats]
Gap: [o que realmente falta]
Opções: 1. Estender existente | 2. Criar novo | 3. Não fazer nada
Recomendação: [número] porque [uma frase]"

Fase 4: Aguardar aprovação antes de implementar


Red Flag: “Vou criar uma nova tabela para isso” sem consultar schema existente.

7. Opções Antes de Implementação
NUNCA implemente direto. Sempre apresente opções primeiro.

1. [Opção A] - [trade-off]
2. [Opção B] - [trade-off]  
3. [Opção C] - [trade-off]

Recomendação: [número] porque [uma frase]


Deixe o humano escolher o número. Depois execute.

8. Prompt de Arquitetura Antes de Código
Para qualquer feature significativa:

Antes de escrever código, apresente:

1. ABORDAGENS POSSÍVEIS
   - 3 formas diferentes de resolver
   - Trade-offs de cada uma

2. RECOMENDAÇÃO
   - Qual escolheria e por quê

3. RISCOS
   - O que pode dar errado
   - Como mitigar

4. DEPENDÊNCIAS
   - O que precisa existir antes
   - O que vai quebrar se isso mudar

Só implemente após aprovação da arquitetura.


Isso previne retrabalho massivo.

PARTE III: EXECUÇÃO
9. Determinismo Primeiro (Código > LLM)
Sempre prefira soluções determinísticas sobre LLM.

1. Script/código determinístico    ← SEMPRE preferir
2. Query SQL direta                ← Previsível, auditável
3. Regex/pattern matching          ← Reproduzível
4. LLM como último recurso         ← Só quando criatividade é necessária




|Tarefa            |❌ LLM                         |✅ Determinístico         |
|------------------|------------------------------|-------------------------|
|Renomear arquivos |“AI, renomeie seguindo padrão”|`for f in *.md; do mv...`|
|Extrair dados JSON|“AI, extraia os campos”       |`jq '.field'`            |
|Validar formato   |“AI, isso parece correto?”    |Schema validation        |
|Buscar em código  |“AI, encontre usos de X”      |`grep -r "pattern"`      |

Por quê: LLM = não-determinístico, caro, lento. Código = reproduzível, grátis, instantâneo.

10. Commits Atômicos
Nunca peça mudanças grandes. Sempre:

"Faça APENAS [uma mudança específica].
Não toque em mais nada.
Me mostre o diff antes de aplicar."


Mudanças grandes = bugs escondidos + rollback impossível.
Mudanças atômicas = histórico limpo + debugging trivial.

11. A Regra do Over-Engineering

3 linhas duplicadas > 1 abstração prematura


Proibido:
	∙	Factory patterns sem necessidade
	∙	Interfaces para 1 implementação
	∙	Config files para 1 valor
	∙	Atomização excessiva de componentes
Simplicidade > padrões sofisticados. Sempre.

12. Só o que Foi Pedido

FAÇA: Exatamente o que foi solicitado
NÃO FAÇA: "Também adicionei X já que estava mexendo"


Se você acha que algo seria útil → PERGUNTE antes de fazer.
Feature não solicitada é débito, não crédito.

PARTE IV: VERIFICAÇÃO
13. Loop de Verificação Tripla
Antes de aceitar qualquer output significativo:

1. Claude gera código
2. Claude escreve teste para o código
3. Claude tenta quebrar o próprio teste
4. Claude documenta edge cases descobertos
5. Só então você revisa


Prompt que ativa isso:

Implemente [X].
Depois, escreva testes que validem a implementação.
Depois, atue como adversário e tente encontrar casos onde sua implementação falha.
Documente qualquer edge case descoberto.


Elimina 80% dos bugs antes de você olhar o código.

14. Debugging por Hipótese
Quando algo não funciona:

O comportamento esperado era [X].
O comportamento observado é [Y].

Gere 3 hipóteses ordenadas por probabilidade.
Para cada hipótese:
- Como verificar se é verdade
- O que fazer se for

Não tente consertar ainda. Primeiro confirme a causa.


Debugging sem hipótese = tentativa e erro.
Debugging com hipótese = ciência.

PARTE V: ARQUITETURA DE CONTEXTO
15. CLAUDE.md como Arquitetura de Pensamento
Seu CLAUDE.md não é documentação. É arquitetura de pensamento.
O que funciona:

## DECISÕES ARQUITETURAIS (imutáveis)
- Banco: PostgreSQL. Sem exceção.
- Auth: Supabase. Sem exceção.

## PADRÕES (sempre aplicar)
- Funções puras primeiro. Side effects isolados.
- Erros são valores, não exceções.

## ANTI-PADRÕES (rejeitar automaticamente)
- Nunca use any em TypeScript.
- Nunca commit direto na main.


O que não funciona:

Este projeto usa React e TypeScript.
Queremos código limpo e bem organizado.


Restrições específicas geram criatividade direcionada.
Instruções genéricas geram output genérico.

16. Princípio da Memória Seletiva
Não coloque tudo no CLAUDE.md. Coloque apenas:
	∙	Decisões (não explicações)
	∙	Restrições (não preferências)
	∙	Padrões (não exemplos)
	∙	Anti-padrões (não warnings)
Teste: Se remover uma linha e o Claude continuar fazendo certo, a linha era desnecessária.

17. Subagentes como Personas
Não crie subagentes para “tarefas”. Crie como personas especializadas com weltanschauung própria.

.claude/agents/
├── architect.md      → Sistemas, trade-offs, escalabilidade
├── security.md       → Paranóico por design, assume breach
├── reviewer.md       → Advogado do diabo, encontra falhas
├── refactor.md       → Obsessivo com simplicidade
└── debugger.md       → Forense, não assume nada


Exemplo (security.md):

Você é especialista em segurança com mentalidade de atacante.

ASSUMA:
- Todo input é malicioso até prova contrária
- Todo dado externo está comprometido

SEMPRE QUESTIONE:
- Onde está a validação de input?
- O que acontece se este serviço cair?

NUNCA ACEITE:
- "Isso é só interno"
- "Vamos adicionar segurança depois"


Agora você tem um time, não uma ferramenta.

18. Exploração Estruturada
Quando precisa entender um codebase novo:

Fase 1 - Topologia (subagente: architect)
"Mapeie estrutura de diretórios. Identifique os 5 arquivos mais importantes.
Desenhe o fluxo de dados principal."

Fase 2 - Contratos (subagente: reviewer)
"Liste todas as interfaces públicas. Identifique dependências externas.
Mapeie onde entram dados do usuário."

Fase 3 - Fragilidades (subagente: security)
"Onde estão os pontos de falha? O que acontece se o banco cair?
Onde há validação faltando?"


Três passadas. Três perspectivas. Mapa completo.

19. Orquestração de Sessões
Para projetos complexos:

Sessão 1 (Architect): Arquitetura e decisões
Sessão 2 (Implementer): Código core
Sessão 3 (Security): Revisão de segurança
Sessão 4 (Refactor): Simplificação
Sessão 5 (Debugger): Testes adversariais


Cada sessão começa limpa. Cada sessão tem foco único. Contexto não sangra.

PARTE VI: META-COGNIÇÃO
20. O Meta-Prompt
O prompt mais poderoso que você pode usar:

Analise esta conversa até agora.
- O que eu deveria ter perguntado que não perguntei?
- Que contexto está faltando para você me ajudar melhor?
- Que suposições você está fazendo que deveríamos validar?


Use a cada 10-15 interações em sessões longas.

21. Constraint Progressivo
Começa amplo, vai restringindo:

Iteração 1: "Como você resolveria [problema]?"
Iteração 2: "Agora considere [restrição A]"
Iteração 3: "Também precisamos [restrição B]"
Iteração 4: "E não podemos [anti-padrão C]"


Gera soluções mais criativas do que jogar todas as restrições de uma vez.

22. Documentação como Subproduto
Nunca peça documentação separadamente:

Implemente [X].
O código deve ser auto-documentado através de:
- Nomes de função que descrevem o que fazem
- Tipos que expressam as invariantes
- Comentários APENAS onde o "porquê" não é óbvio

No final, gere um README que alguém que nunca viu este código
poderia usar para modificá-lo em 6 meses.


Documentação que nasce do código é precisa.
Documentação escrita depois é ficção.

PARTE VII: SINAIS E PADRÕES
23. Tabela de Tradução de Sinais



|Sinal do Usuário       |Significado Real  |Ação Correta             |
|-----------------------|------------------|-------------------------|
|Repetiu algo 2x        |Você não entendeu |PARE, faça exato         |
|Feedback negativo      |Erro identificado |Corrija, não justifique  |
|“Já temos isso”        |Você não verificou|Cheque existente primeiro|
|“Tá quebrado”          |Bug reportado     |Prioridade máxima        |
|Mudou de assunto       |Pivotou           |Abandone tarefa anterior |
|“O que ficou pendente?”|Quer checkpoint   |Liste status claramente  |

24. Gatilhos de Irritação



|Gatilho               |Como Evitar                    |
|----------------------|-------------------------------|
|IA lenta sem feedback |Reporte progresso a cada passo |
|Instrução repetida 2x |PARE, releia, faça exato       |
|Dados mock            |SEMPRE verifique banco primeiro|
|Over-engineering      |Simplicidade > padrões         |
|Feature não solicitada|Só faça o que foi pedido       |
|Output sem valor      |Auto-critique antes de entregar|

25. Checklist Universal
Antes de cada ação:

[ ] Existe algo similar? (verificou antes de criar?)
[ ] Está usando dados reais? (não mock)
[ ] Verificou fisicamente? (ls, curl, query)
[ ] Mostrou opções? (não implementou direto)
[ ] Está criando estrutura nova? (perguntou primeiro)
[ ] Rodou discovery queries?
[ ] Apresentou findings antes de propor?


SÍNTESE FINAL
O Fluxo

VERIFICAR → REUSAR → PRECISAR → SIMPLIFICAR → PRESERVAR → FOCAR → SILÊNCIO


	∙	Verificar antes de assumir
	∙	Reusar antes de criar
	∙	Precisar antes de generalizar
	∙	Simplificar antes de complicar
	∙	Preservar o que funciona
	∙	Focar no que foi pedido
	∙	Silêncio quando errar — só corrigir

O Princípio Unificador
Pare de usar o Claude como executor de tarefas.
Comece a usar como parceiro de pensamento que também executa.
A diferença:
	∙	Executor: “Faça X”
	∙	Parceiro: “Estou tentando resolver Y. Que opções temos? Qual você recomenda? Por quê? Ok, implemente. Agora tente quebrar. O que aprendemos?”
A ferramenta é a mesma.
O resultado não tem comparação.

Meta-Regra Final
Essas regras devem ser econômicas. Se qualquer uma virar cerimônia, delete.

Destilado de +10.000 sessões reais. Não é teoria. É o que sobreviveu ao honrar o conhecimento com a prática.



## Nova Regra Global (Veterano Add-on)
- NUNCA usamos placeholder em nenhuma hipótese. Faremos testes reais SEMPRE.
