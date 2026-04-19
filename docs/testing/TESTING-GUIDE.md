# Guia de Testes Automatizados - Produtora

Este guia documenta as convenções, arquitetura e comandos para a infraestrutura de testes do projeto. Nossa fundação utiliza **Vitest** + **React Testing Library**.

## 1. Ferramentas Adotadas
- **Vitest:** Escolhido por performance, integração nativa com ESM e facilidade de setup em ambiente React/Next.
- **RTL (React Testing Library):** Foco em testar os componentes partindo da perspectiva do usuário (procurar botões por acessibilidade `getRole`, etc).
- **JSDOM:** Ambiente estático que emula janela do navegador via Node.js para rodar os testes renderizados na memória de forma extremamente rápida.

## 2. Padrões de Nomenclatura e Estrutura
- O teste de um arquivo `X.tsx` deve ser colocado em um arquivo irmão com finalização `.test.tsx`.
- Os testes devem ficar pertos de seus componentes na mesma árvore de pastas dentro do diretório `__tests__`.
  
  Exemplo de Estrtutura Válida:
  ```text
  src/components/ui/
    error-state.tsx
    __tests__/
      error-state.test.tsx
  ```

## 3. Comandos Principais
- `npm run test` -> Executa toda a rotina de testes de trás para frente no repósitorio e levanta summary final. (padrão nos ambientes de CI)
- `npm run test:watch` -> Roda em formato de Watcher. Fica escutando as mudanças dos arquivos. Use esse modo ativamente durante o desenvolvimento de suas User Stories localmente.

## 4. Filosofia e Direcionamento do QA
Sempre elabore "Edge Cases" de forma sistemática durante o desenvolvimento:
1. O que acontece se a API demorar? (Mock loading)
2. O que acontece se vier um Erro Crítico? (Error boundary, Alert state / Fallback actions)
3. Segurança no Fluxo de Negócios: Trave sempre o avanço da jornada de UX se faltar aprovação. Se a ação pedir dependências severas (ex: Gate de Publicação), o teste precisa validar ativamente não só o status aprovado *mas cada componente de falha individual* do checklist.

## 5. Flow na Integração Contínua (CI)
Nosso CI via GitHub Actions (`.github/workflows/pr-automation.yml`) intercepta todos os Pull Requests que mirem em integridade na branch principal (`main`).
Sempre que você criar um PR e a pipeline falhar no passo `Run Tests`, o PR será sumariamente barrado de fazer Merges. Isso assegura que zero códigos entrem estragados no motor principal do App.

---
*Escopo fundado durante a arquitetura da Story 3.4*
