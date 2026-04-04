# AD_LABS — Novo PRD (Construção Iterativa)

Este documento está sendo construído passo a passo com foco na usabilidade, clareza e adoção dos princípios do **Protocolo Veterano**.

---

## 1. Fluxo de Entrada do Usuário (Onboarding)

### Topo do Funil
```text
Landing Page
├── Botão: Ativar Sistema (Novo Assinante)
│   ├── Escolha de Plano
│   ├── Checkout (Pagamento)
│   ├── Cadastro Simples (Nome, Login/Email, Senha)
│   └── Redirecionamento para Login
│
└── Botão: Entrar no Sistema (Usuário Existente)
    └── Login e Senha → Redireciona para Dashboard (Home)
```

### 1.3 Conectividade Estratégica (O Sistema Circulatório)

Para desenvolvedores e arquitetos, o AD_LABS opera como um ecossistema rigorosamente integrado onde os dados fluem transversalmente entre os módulos. Esta é a regra de passagem de bastão das nossas automações:
1. **Garimpo → Cofre/Matriz:** Os canais com buracos no mercado ("Oceano Azul") encontrados anonimamente pela IA (via *OpenCLI-rs*) alimentam imediatamente a geração de teses do Cofre Global (Sec 8) e o Kanban de Ideias (Sec 4).
2. **X-Ray → Blueprint:** A análise técnica e clonagem de um concorrente alvo (Raio-X) autodesenha e impõe todas as variáveis estéticas e de formato do modelo de conteúdo daquele canal (Blueprint).
3. **Blueprint → 5 Eixos:** A Maternidade ("A forma" de sucesso do canal) é desdobrada em 5 variações estratégicas (Sub-nichos) geradas no Laboratório para pescar o algoritmo e testar onde dá Maré.
4. **Dashboard Macro → Central de Comando:** O cockpit corporativo consolida widgets extraídos das Fábricas (Canais) em tempo real via Cache (NFR09), permitindo ajustes executivos do Maestro sem abrir planilhas separadamente.

---

## 2. Visão do Administrativo Corporativo (Cockpit)

O AD_LABS adota o princípio de visão em "macro" na tela principal. O sistema atua como uma fábrica, permitindo ao usuário observar tudo de cima.

### 2.1 Tela: Home (Dashboard Central)

**Conceito:** O usuário não analisa vídeos individuais na Home. Ele analisa o "estado da operação", engarrafamentos (vídeos atrasados) e vitórias (Marés detectadas).

#### Wireframe (Desktop)

```text
[Menu Lateral]                        [Top] Data de Hoje | Olá, [Nome do Usuário]
 AD_LABS Logo
 --------------------------------------------------------------------------------------------------
 🏠 Home (Ativo)                     [KPIs Globais da Operação]
 📺 Canais                           | Total Canais: 3 | Em Planejamento: 12 | Em Produção: 8 |
                                      | Prontos: 5 | Agendados: 10 | Atrasados: 2 |
                                      | 🌊 MARÉS ATIVAS: 1 (Eixo X explodiu!) |
 --------------------------------------------------------------------------------------------------

 [Esquerda: ALERTAS IMEDIATOS]                         [Direita: PRÓXIMAS PUBLICAÇÕES]
  • 🛑 Canal "Jesus" tem 2 vídeos atrasados             • (Hoje) Jesus Reage #15 - 18:00
  • 🌊 EIXO 05 bateu meta! Escalar canal.               • (Amanha) Relatos de Escola #02 - 12:00
  • ⏳ Conta YouTube XYZ precisa reconectar             • (Sábado) Histórias Ocultas #08 - 19:00

 --------------------------------------------------------------------------------------------------
 [A TROPA: GRID DE CANAIS]

  [Canal: Histórias Ocultas]            [Canal: Jesus Reage]                 [Canal: Escola Drama]
  🌊 Maré: Aguardando                   🌊 Maré: Ativada no Eixo 05!         🌊 Maré: Testes rodando
  Plan/Prod/Pronto: 4 | 2 | 1           Plan/Prod/Pronto: 0 | 5 | 2          Plan/Prod/Pronto: 8 | 1 | 2
  Agendado/Atrasado: 3 | 0              Agendado/Atrasado: 6 | 2             Agendado/Atrasado: 1 | 0
  Publicados: 12                        Publicados: 48                       Publicados: 5
```

---

## 3. Fluxo Iniciar Canal (+ Novo Canal)

O botão **[+ Novo Canal]** (existente na Home e na Topbar) abre um modal ou leva a uma tela de decisão inicial, visando cobrir tanto quem começa do zero quanto quem já tem audiência.

### 3.1 Tela de Decisão (Ponto de Partida)

```text
[+] ADICIONAR OU CRIAR CANAL

 O que você deseja fazer?


 [ 📥 Importar Canal Existente ] 
 (O sistema redireciona o usuário para as Configurações Externas para plugar a Conta via OAuth. Ao integrar, o sistema roda o motor X-Ray nos vídeos dele mesmo para "nascer" o Blueprint autoral daquele canal e já lida o Kanban puxando o histórico real de publicações).

 [ ✨ Criar um Novo Canal do Zero ]
 (Deixe o sistema planejar e lançar um novo canal dark para você. *Ref. FR24: Ao escolher esta opção, o motor de Imagem da plataforma já gera automaticamente a Identidade Visual Inicial do canal, como o Logotipo/Avatar, o Banner Base e a Paleta/Template Padrão das Thumbnails*).
```

Se o usuário escolher **Criar um Novo Canal do Zero**, o sistema apresenta as 3 opções fundamentais do projeto:

```text
 [ 💡 Tenho uma Ideia ]
 (Você diz o nicho/tags, nós validamos os dados)

 [ 🎲 Não Tenho Ideia ]
 (O sistema te mostra os nichos mais lucrativos e virais de hoje)

 [ 📺 Sei qual canal modelar ]
 (Cole o link do canal gringo/concorrente e nosso X-Ray fará a clonagem estrutural)
```

**Comportamento Arquitetural da Criação:** Em vez de construir telas repetidas, esses 3 botões funcionam como **atalhos de contexto** para as ferramentas de Inteligência de Mercado (Módulo 8). 
- **[💡 Tenho uma Ideia]** redireciona para a Tela 8.1 (Garimpo de Vídeos) ativando a barra de busca focada em Tags/Nichos.
- **[🎲 Não Tenho Ideia]** redireciona para a Tela 8.3 (Nichos Virais) exibindo a lista mastigada de oportunidades e canais em alta.
- **[📺 Sei qual canal modelar]** redireciona direto para a Tela 8.2 (Insights / X-Ray) focada no input de URL do canal alvo.

A diferença estrutural: Ao acessar o Módulo 8 por meio desses botões, o sistema entende que está em *"Modo de Criação"* e injeta o botão **[ 🚀 CRIAR CANAL BASEADO NISTO ]** diretamente nos cards de vídeos/canais da pesquisa. Clicando nele, o usuário é atirado na Tela de Blueprint com tudo pré-montado.

---

## 4. Visão Interna do Canal (Gestão Específica)

Ao clicar em um canal específico, saímos da visão "Macro/Fábrica" e entramos na visão "Micro/Gestão" focado apenas nos processos deste canal.

### 4.1 Tela: Gestão de Canal (Dashboard Interno)

**Conceito:** Uma tela gerencial que reúne as informações do canal e uma lista no formato "Kanban/Checklist" visual para todos os vídeos daquele canal.

#### Wireframe (Desktop)

```text
[Menu Lateral]                        [Top bar] 
 AD_LABS Logo                          [Selecionar Canal: Histórias Ocultas ▾]  [+ Novo Canal]
 --------------------------------------------------------------------------------------------------
 🏠 Home                             [ 🎬 Canal: HISTÓRIAS OCULTAS ]
 📺 Canais (Ativo)                   🌊 STATUS DA MARÉ: Eixo "Relatos TRABALHO" bombando!
                                     
                                     Planejamento: 4 | Produção: 2 | Prontos: 1 | Agendados: 3 | Atrasados: 0 | Publicados: 12
                                     
                                     Idioma: PT-BR  | Frequência: 1/dia | Horário padrão: 18h00 | E-mail: contato@...
                                     Anotações/Descrição: Canal focado em relatos dark. Não usar narração com voz aguda.
                                     [ 📊 Visualizar Analytics e X-Ray do Canal ] (Abre modal exibindo Engajamento, RPM, Retenção, Região e dados avançados)
 --------------------------------------------------------------------------------------------------
 [Tabs/Filtros de Vídeos]
 | Todos (22) | Planejamento (4) | Produção (2) | Finalizados (1) | Agendados/Publicados (15) |

 🔍 [Buscar títulos...]      Visualização: (•) KANBAN  ( ) CALENDÁRIO (Arrastar e Soltar)     [+ Adicionar Novo Vídeo]
 --------------------------------------------------------------------------------------------------
 [LISTA DE VÍDEOS - PIPELINE DO CANAL]

 Status: [Em Produção]  |  Data: 06/04  |  [✏️ Editar] [🗑️ Excluir]
 Título: O chefe que não sabia de nada
 Eixo/Ideia: Relatos TRABALHO
 Checklist Operacional: [✅ Título] [✅ Roteiro] [⏳ Áudio] [ ] Imagens [ ] Montagem [ ] Thumb [ ] Agendado  
                                          (Botão de Ação: Ver Roteiro / Aprovar Áudio)
 --------------------------------------------------------------------------------------------------
 Status: [Planejamento]  |  Data: 07/04  |  [✏️ Editar] [🗑️ Excluir]
 Título: Fui demitida e olha no que deu
 Eixo/Ideia: Relatos TRABALHO
 Checklist Operacional: [✅ Título] [⏳ Roteiro] [ ] Áudio [ ] Imagens [ ] Montagem [ ] Thumb [ ] Agendado  
                                          (Botão de Ação: Revisar Ideia)
 --------------------------------------------------------------------------------------------------
 Status: [Agendado]     |  Data: 05/04  |  [✏️ Editar] [🗑️ Excluir]
 Título: O colega que roubava ideias
 Eixo/Ideia: Relatos TRABALHO
 Checklist Operacional: [✅ Título] [✅ Roteiro] [✅ Áudio] [✅ Imagens] [✅ Montagem] [✅ Thumb] [✅ Agendado]  
                                          (Botão de Ação: Ver no Calendário)

```

---

### 4.2 Gaveta de Produção: Linha de Montagem de Vídeo

Quando o usuário clica em qualquer card de vídeo no Kanban (Tela 4.1), uma **gaveta lateral (modal)** desliza sobre a tela. É aqui que ocorre a execução tática de cada vídeo.

**Conexão com o Blueprint:** O segredo desta gaveta é que ela **não** opera no vazio. Quando a IA gera o Roteiro aqui dentro, ela carrega silenciosamente toda a receita do seu Blueprint (O Tom, O Gancho, A Narrativa ditados no Módulo 9).

O funil de produção é dividido em **5 abas sequenciais**:

1. **[ 📝 1. Ideia/Título ]**: Onde o Eixo validado no Lab vira uma premissa clara e a IA cospe 5 variações de Título Magnético.
2. **[ 📜 2. Roteiro ]**: Onde o texto bruto é gerado (já formatado para retenção). O Humano só lê, faz ajustes finos e aprova.
3. **[ 🎙️ 3. Narração ]**: A IA de voz (Ex: ElevenLabs) lê o roteiro aprovado. O usuário pode ouvir e pedir regravação de parágrafos específicos.
4. **[ 🖼️ 4. Thumbnails ]**: O Prompt do Blueprint gera os assets visuais para a capa.
5. **[ 📦 5. Exportar / Postar ]**: O pacote empacotado para o Editor Humano fazer a montagem final (ou envio direto pro YouTube).

#### Wireframe (Gaveta Lateral Direita - Foco na Aba de Roteiro)

```text
[Gaveta Lateral: LINHA DE MONTAGEM DO VÍDEO]                     [X Fechar]

 🎥 Vídeo: "O chefe que não sabia de nada"
 Status Atual: Aguardando Aprovação de Roteiro
 -------------------------------------------------------------------------
 [ 📝 Título ] [ 📜 Roteiro (Ativo) ] [ 🎙️ Narração ] [ 🖼️ Thumb ] [ 📦 Pacote ]
 -------------------------------------------------------------------------
 
 ⚠️ Background da IA: Injetando receita do Blueprint "Histórias Ocultas" (Tom: Drama/Tensão)
 
 [ ⚡ GERAR ROTEIRO COMPLETO COM IA ]  
 
 [Editor de Texto Enriquecido]
 -------------------------------------------------------------------------
 | (0:00 - 0:05) HOOK INQUEBRÁVEL (Regra #1 do Blueprint):               |
 | "Você já teve um chefe que ganhava 30 mil reais por mês apenas para   |
 | jogar Paciência? Bem, eu tive. E o que eu fiz para derrubar ele...    |
 | custou 2 milhões à empresa."                                          |
 |                                                                       |
 | (0:06 - 1:20) DESENVOLVIMENTO (Micro-Tensão):                         |
 | "Tudo começou numa terça-feira chuvosa..."                            |
 |                                                                       |
 | [ Cursor piscando - O usuário pode digitar e editar livremente... ]   |
 -------------------------------------------------------------------------
 [ ↺ Refazer Roteiro inteiro ]  [ ✨ Refazer só o Gancho (Hook) ] 
 [ 💬 Deixar linguagem mais informal ]  [ ✂️ Encurtar para Shorts/TikTok ]
 
 [ ✅ APROVAR ROTEIRO ➔ IR PARA NARRAÇÃO ]
```

Neste modelo de esteira (Linha de Montagem), o gargalo cognitivo vai a zero. O usuário entra apenas como o "Maestro" que aperta botões de "Refazer" ou "Aprovar", navegando da Esquerda para a Direita nas abas até o pacote estar 100% pronto.

#### Aba: 🎙️ Narração (Áudio)

Na aba de áudio, a ferramenta acessa APIs como ElevenLabs. Para evitar custos desnecessários de TTS (Text-to-Speech) re-gerando um áudio de 15 minutos inteiro por causa de um erro de pronúncia, o texto é quebrado em parágrafos/blocos.

```text
[Gaveta Lateral: LINHA DE MONTAGEM DO VÍDEO]                     [X Fechar]
 -------------------------------------------------------------------------
 [ ✅ Título ] [ ✅ Roteiro ] [ 🎙️ Narração (Ativo) ] [ 🖼️ Thumb ] [ 📦 Pacote ]
 -------------------------------------------------------------------------
 Voz Selecionada (Herdada do Blueprint): [ ▾ Avatar: "Marcus - Drama Hushed" ]
 
 [ ⚡ GERAR TODAS AS TRILHAS DE VOZ ]
 
 -------------------------------------------------------------------------
 [Player Global: ▶️ OUVIR O VÍDEO COMPLETO (12:45) ]       🔊 Volume [||||]
 -------------------------------------------------------------------------
 
 Bloco 1 (0:00 - 0:15) - Hook Inquebrável 
 Voz: [ ▾ Padrão do Blueprint (Marcus) ]
 "Você já teve um chefe que ganhava..." 
 [ ▶️ Play trecho ]  [ ↺ Regravar este bloco ]  [ ✏️ Ajustar texto / pronúncia ]
 
 Bloco 2 (0:15 - 1:20) - Desenvolvimento (Fala do Convidado)
 Voz: [ ▾ Personagem B (Sarah_Angry) ]
 "Tudo começou numa terça-feira..." 
 [ ▶️ Play trecho ]  [ ↺ Regravar este bloco ]  [ ✏️ Ajustar texto / pronúncia ]
 
 -------------------------------------------------------------------------
 [ 🎵 Adicionar Trilha Sonora de Fundo (Música) ▾ ] 
 [ 🌍 Auto-Dubbing (FR25): Traduzir e Gerar faixa extra em [ES-ES] e [EN-US] ]
 
 [ ✅ APROVAR ÁUDIO ➔ IR PARA THUMB E TÍTULO FINAIS ]
```

#### Aba: 🖼️ Thumbnails e Empacotamento

A última checagem criativa antes de despachar o vídeo para a edição humana das imagens (ou autoportagem). A IA gera as capas visuais baseadas na "Estética Visual" exigida pelo Canal.

```text
[Gaveta Lateral: LINHA DE MONTAGEM DO VÍDEO]                     [X Fechar]
 -------------------------------------------------------------------------
 [ ✅ Título ] [ ✅ Roteiro ] [ ✅ Narração ] [ 🖼️ Thumb (Ativo) ] [ 📦 Pacote ]
 -------------------------------------------------------------------------
 
 1. ESCOLHA DE CAPAS (Baseadas no Prompt Visual do Blueprint)
 [ 🖼️ Imagem 1 ]  [ 🖼️ Imagem 2 ]  [ 🖼️ Imagem 3 ]  [ 🖼️ Imagem 4 ]
 (•) Escolher     ( ) Escolher     ( ) Escolher     ( ) Escolher
 
 [ ↺ Gerar mais 4 opções visuais ]   [ ✏️ Editar Prompt da Imagem à Mão ]
 
 2. ESCOLHA DO TÍTULO FINAL
 (•) O chefe que não sabia de nada (E perdeu 2 milhões)
 ( ) Fui demitida e a empresa faliu: Relato 
 ( ) Como eu destruí a carreira do pior chefe do mundo
 
 -------------------------------------------------------------------------
 [ ✅ APROVAR PACOTE COMPLETO ➔ ENVIAR PARA EDIÇÃO OU POSTAR DIRETAMENTE ]
```

#### Aba: 📦 Pacote / Exportação

É a última fronteira antes do vídeo nascer. Aqui o usuário revisa todos os metadados finais e garante o compliance exigido pelo sistema de IA.

```text
[Gaveta Lateral: LINHA DE MONTAGEM DO VÍDEO]                     [X Fechar]
 -------------------------------------------------------------------------
 [ ✅ Título ] [ ✅ Roteiro ] [ ✅ Narração ] [ ✅ Thumb ] [ 📦 Pacote (Ativo) ]
 -------------------------------------------------------------------------
 
 METADADOS FINAIS
 Título Oficial: O chefe que não sabia de nada (E perdeu 2 milhões)
 Descrição: Texto gerado pela IA cobrindo as SEO tags...
 Arquivo: roteiroFinal_v3.mp3
 
 [ 👀 RENDERIZAR PREVIEW DE 20s (Compliance Squad) ]
 (Gera um snippet rápido com Imagem+Áudio para aprovação do Diretor sem gastar GPUs de render pesado no vídeo todo)
 
 -------------------------------------------------------------------------
 CONCLUIR PROCESSO:
 [ 📥 Baixar Todos os Assets para o meu Editor de Vídeo Próprio ]
 [ 🚀 Agendar/Publicar Automaticamente no YouTube via API ]
 *(Nota Técnica FR19: Caso a API do YouTube falhe no upload por timeout ou erro, o Cronjob de backoff executará o Auto-Retry a cada 15 minutos. Caso falhe 3 vezes consecutivas, o status volta para "Erro" e notifica o Maestro no Telegram).*
```

---

### 4.3 Tela: Perfil e Setup do Canal (O Espelho do YouTube)

Esta aba é o "documento de identidade" do canal. É a tela de configuração vital que fica na Gestão do Canal, e deve ser preenchida obrigatoriamente antes do primeiro vídeo subir.

#### Wireframe (Desktop)
```text
[Header - Top bar] ⚙️ Identidade do Canal: HISTÓRIAS OCULTAS
 --------------------------------------------------------------------------------------------------
 [ Abas: 👤 PERFIL GERAL (Ativo) | Equipe | Automação (Auto-Refill) | Integrações YouTube ]
 
 [Avatar Redondo]  [Banner Retangular 16:9]
 
 DESCRIÇÃO PADRÃO (Bio): 
 [ Textarea: Canal focado em histórias narradas sobre exploração laboral... ]
 
 METADADOS DE SUBIDA:
 Idioma Principal: [ PT-BR ▾ ]    País/Região: [ Brasil ▾ ]
 Categoria Padrão: [ Entretenimento ▾ ]
 Privacidade Padrão: [ Não Listado (Para aprovação final no app) ▾ ]
 
 [x] OBRIGATÓRIO (FR18): Marcar automaticamente a flag "Conteúdo Sintético ou Alterado" 
     nos metadados do YouTube Studio para evitar Shadowban por IA.
 
 [ 💾 Salvar Perfil do Canal ]
```

---
---
## 5. Laboratório (Gestão de Marés e Inteligência)

Esta tela é o "cérebro" do sistema. A Fábrica trabalha com lotes limitados enviados pelo Laboratório.

### 5.1 Tela: Motor de Marés e Eixos

#### Wireframe (Desktop)

```text
[Menu Lateral]                        [Top bar] 
 AD_LABS Logo                          [Selecionar Canal: Histórias Ocultas ▾]  [Configurações Maré]
 --------------------------------------------------------------------------------------------------
 🏠 Home                             [ 🌊 LABORATÓRIO E MARÉS — HISTÓRIAS OCULTAS ]
 📺 Canais                           
 🌊 Laboratório (Ativo)              Status Atual: [Aguardando Desempenho...]
 --------------------------------------------------------------------------------------------------
 [A Matriz de 5 Eixos]
 
 [Eixo 1: Escola]    [Eixo 2: Hospital]    [Eixo 3: Igreja]    [Eixo 4: Rua]    [Eixo 5: Trabalho]
 Status: Testando    Status: Aguardando    Status: Testando    Status: Aguard.  Status: VENCEU! 👑
 
 --------------------------------------------------------------------------------------------------
 [Tabs] | Ideias do Eixo Vencedor (30) | Ideias Não-Aprovadas (120) | Ideias Descartadas |
 
 🔍 [Buscar...]                         [+ Enviar Lote de 5 para a Fábrica]
 --------------------------------------------------------------------------------------------------
 [LISTA DE IDEIAS/SINOPSES DO BANCO]
 (Exibindo as 30 ideias pré-geradas referentes ao Eixo que você clicou/selecionou acima)

 Ideia: Jesus e o pastor mentiroso     | Eixo 3   | Nota IA: 9/10  | Status: No Kanban da Fábrica
 Ideia: O chefe que não sabia de nada  | Eixo 5   | Nota IA: 8/10  | Status: Agendado p/ Fábrica  [Mandar Agora]
 Ideia: Criança humilhada dá o troco   | Eixo 1   | Nota IA: 7/10  | Status: Bloqueada (Eixo Cancelado) 
```

### 5.2 Modal/Gaveta: Ficha Técnica do Eixo (O DNA do Cluster)

Quando o canal é iniciado, o próprio sistema lê o alvo (concorrente ou tags do usuário) e gera **automaticamente 5 vertentes de teste (os 5 Eixos)**. 
Para que a IA consiga cruzar o mercado e gerar as "30 de ideias" depois, cada Eixo possui sua Ficha Técnica de 20 variáveis. 

Se o usuário clica num Eixo no Lab, ele vê essa ficha se abrir de lado, podendo forçar alterações visuais ou temas, antes do Eixo rodar para valer.

**Os 20 Campos do Eixo (Gerados pela IA / Ref. FR04):**

- *Identidade Temática:*
 1. **Nome do Eixo:** (Ex: Vinganças Escolares / Bullying Revertido)
 2. **Premissa Básica Central:** (A definição de 1 parágrafo do Universo do Eixo)
 3. **Público-Alvo Demográfico:** (Idade / Gênero / Região previstos)
 4. **Sentimento / Emoção Dominante:** (Ex: Injustiça seguida de Catarse)
 5. **Gatilho de Curiosidade (Curiosity Gap):** (O "Ímã" psicológico)

- *Narrativa e Dramaturgia:*
 6. **Arquétipo do Protagonista:** (Ex: O Aluno Invisível)
 7. **Arquétipo do Antagonista:** (Ex: O Diretor Corrupto)
 8. **Tipo de Conflito Estendido:** (Ex: Impotência Hierárquica vs Genialidade Espontânea)
 9. **Cenário Recorrente:** (Ex: Salas de aula, Reuniões)
 10. **A "Virada" Padrão do Eixo (Payoff):** (Como a vingança é consumada?)
 11. **Estilo Narrativo (Hook):** (Obriga a narrativa a começar pelo ponto mais tenso).

- *Variáveis Comerciais e SEO:*
 12. **Taxa de Concorrência Estimada:** (Alta / Média / Baixa)
 13. **Score Esperado de Retenção:** (Escala 0 a 10 projetada pelo algoritmo)
 14. **RPM Estimado:** (Mapeado na API do nicho primário).
 15. **Estrutura Matemátíca de Título:** (A fórmula do Copywriting do lote de ideias).
 16. **Palavras-Chaves Negativas / Tabus (Safety):** (Listar o que a IA não pode colocar nas ideias. Ex: sangue, palavras de baixo calão).

- *Fábrica e Execução Visual:*
 17. **Cores Predominantes da Thumb do Eixo:** (Paleta via Neuromarketing)
 18. **Elemento Visual Âncora:** (O que precisa ter em toda Thumbnail deste eixo? Ex: Olhar com raiva + Papel na mão)
 19. **Complexidade de Edição Visual:** (Grau técnico de exigência na Montagem)
 20. **Limitação de Duração da História:** (Vídeos de 8 a 12 minutos).

> **A Mágica da Automação:** O usuário NÃO preenche isso manual. A IA gera de madrugada e o usuário só "lê, entende o viés de criação e aprova".

---

## 6. Mapeamento de Botões e Interações (Por Tela)

Para garantir que a engenharia front-end saiba a consequência de cada ação, o comportamento visual e técnico dos botões está mapeado:

### 6.1 Home (Dashboard Central)
- **[+ Novo Canal]**: Abre o modal de decisão (Importar Canal ou Criar do Zero).
- **Cards de Canal (Grid)**: Toda a área do card é clicável. Redireciona o usuário para a *Visão Interna* (A Fábrica/Kanban) do respectivo canal.
- **[Alertas Imediatos]**: Links diretos. Usado para avisar gargalos na Fábrica (ex: vídeos atrasados) ou **Erros de Sistema (ex: "A Chave da API de Imagens expirou/falhou")**. Clicar no erro joga o usuário diretamente para resolver a pendência correspondente (Fábrica ou Tela de Configurações).

### 6.2 Visão Interna do Canal (A Fábrica)
- **[Selecionar Canal (Dropdown)]**: Alterna rapidamente a visualização entre canais sem voltar para a Home.
- **[+ Adicionar Novo Vídeo / Ideia]**: Permite que o usuário insira um script manual de fora do Laboratório (furar a fila) ou crie vídeos extras.
- **Botões Ação no Checklist (Ex: Ver Roteiro, Aprovar Áudio)**: Abrem um **Overlay/Modal lateral (Side-Drawer)**. O usuário lê o roteiro gerado ou dá play no áudio lado a lado com a tela, sem "mudar de página", garantindo velocidade na aprovação.
- **[✏️ Editar]**: Em um vídeo na esteira, abre um modal para editar o título oficial de postagem, as tags planejadas e a thumb alvo.
- **[🗑️ Excluir]**: Dá timeout na produção/publicação. Se o vídeo veio da Maré, ele é retornado ao Laboratório com o status de "Sistema/Usuário Descartou".

### 6.3 Laboratório (Marés)
- **[Configurações Maré]**: Define as réguas de temperatura da IA — Ex: o quão bom o vídeo tem que performar antes do sistema coroá-lo vencedor (critérios de retenção e RPM).
- **[Card de Eixo]**: O usuário pode clicar sobre [Eixo 5: Venceu] para forçar e anular o algoritmo (Intervenção Humana = Mestre).
- **[+ Enviar Lote de 5 para a Fábrica]**: Acionamento em massa. Despacha logicamente os vídeos do banco de dados do Laboratório para as tabelas de montagem/produção na esteira do Canal. **(Regra Auto-Refill: se a fila da Fábrica cair para apenas 2 vídeos inativos/pendentes, o sistema aciona este disparo automaticamente para o canal não "morrer" de fome).**
- **[Mandar Agora] (Ação de Linha)**: Injeta uma única ideia específica lá para a Fábrica.

---

## 7. Configurações Globais e Integrações

Área administrativa do sistema onde o usuário conecta suas contas de redes sociais (para as publicações agendadas do Laboratório/Fábrica) e gerencia as chaves de API das inteligências utilizadas na automação.

### 7.1 Tela de Credenciais (Contas e APIs)

#### Wireframe (Desktop)

```text
[Menu Lateral]                        [Top bar] 
 AD_LABS Logo                          🔑 Configurações do Sistema
 --------------------------------------------------------------------------------------------------
 🏠 Home                             [ + Conectar Nova Conta ]      [ + Inserir Nova API ]
 📺 Canais                           
 🌊 Laboratório 
 ⚙️ Configurações (Ativo)
 --------------------------------------------------------------------------------------------------
 [Tabs] | 📺 Contas Conectadas (Redes) |  🧠 Chaves de API  |  💳 Assinatura e Billing |
 --------------------------------------------------------------------------------------------------
 
 [Seção: Contas e Canais Conectados]
 
 [YouTube Card]                             [TikTok Card]
 (Avatar) Histórias Ocultas                 (Avatar) Histórias Ocultas Oficial
 ID: UC123xyz...                            ID: @hist_ocultas
 Status: 🟢 [Ativa]                           Status: 🔴 [Aviso: Relogar]
 Botões: (Desconectar) (Atualizar Auth)     Botões: (Desconectar) (Atualizar Auth)

 --------------------------------------------------------------------------------------------------
 [Seção: APIs e Motores de IA (Geradas Dinamicamente)]
 
 (O sistema exibe automaticamente os campos de APIs que a aplicação estiver exigindo no momento)
 API Exigida pelo Sistema   Status                Data de Inserção      Ações
 --------------------------------------------------------------------------------------------------
 [API] Provedor de Texto    🟢 [ON]                 03/04/2026          [✏️ Editar] [🗑️ Excluir]
 [API] Provedor de Imagem   🔴 [FALHOU / ERRO]      03/04/2026          [✏️ Atualizar Chave] 
 [API] Provedor de Áudio    🔴 [OFF / FALTANDO]     --/--/----          [🔑 Inserir Key]
```

### 7.2 Tela: Perfil do Maestro e Sistema Nervoso (Notificações)

Para o usuário não precisar morar dentro do Dashboard, nós plugamos a operação no bolso dele (Telegram). Nesta aba (dentro de Configurações), o usuário conecta seu perfil mensageiro para o "Sistema Nervoso" da Fábrica avisar quando problemas ou vitórias acontecem.

#### Wireframe (Desktop)

```text
[Header - Top bar] ⚙️ Notificações e Perfil Global
 --------------------------------------------------------------------------------------------------
 [ Abas: 📺 Contas Conectadas | 🧠 Chaves de API  | 💳 Billing | 🔔 NOTIFICAÇÕES (Ativo) ]
 --------------------------------------------------------------------------------------------------
 
 CONECTAR TELEGRAM BOT (Ref. FR14 / FR16):
 Seu ID Telegram: [ @adriano_labs           ]   Status: 🟢 Conectado
 
 QUANDO DEVEMOS INCOMODAR VOCÊ? (Regras de Alerta)
 
 📈 Vitórias e Marés
 [x] Avisar IMEDIATAMENTE se o Laboratório coroar um Eixo como "Vencedor" (Maré Detectada).
 [ ] Avisar sempre que um vídeo for Publicado (Pode causar flood visual se houver muitos canais).
 
 🛑 Alertas Críticos da Fábrica
 [x] Avisar se houver "Erro de Upload" ou falha de conexão na API do YouTube/TikTok.
 [x] Avisar se o Saldo/Tokens das APIs (OpenAI/ElevenLabs) acabar.
 [x] Avisar se um Canal secar (Ficar com 0 vídeos no Kanban pela manhã).
 
 [ 💾 Salvar Preferências de Contato ]
```

### 7.3 Asset Library Global e Multi-Vozes

O AD_LABS já possui uma biblioteca NATIVA robusta embutida (dezenas de trilhas livres de direitos e vozes de alto padrão já linkadas). Contudo, o usuário **poderá** (se desejar) abastecer o sistema com mídias extras/exclusivas e cadastrar/clonar as Múltiplas Vozes novas pelo ElevenLabs. Dessa biblioteca conjunta o sistema reconhece quando um roteiro cita o `[Narrador A]` e o `[Convidado B]` e designa vozes diferentes na aba de Montagem automaticamente.

```text
[ Aba Oculta/Modal: 🎵 ASSET LIBRARY ]
 Vozes Salvas: [ Marcus_Hushed ] [ Sarah_Angry ] [ Kid_Voice ]  (+ Criar/Clonar Nova Voz)
 Trilhas Sonoras: [ Suspense_Bass.mp3 ] [ Happy_Lofi.mp3 ] 
```

### 7.4 Governança: Limite de Faturamento e Acesso de Equipe (RBAC)

Para proteger a integridade da plataforma e evitar "furos no bolso" com APIs que rodam enquanto o usuário dorme:
1. **Hardstop de Custo:** Na tela de Billing, o usuário cadastra um "Teto de Gastos Manteúdo" (ex: $50 dólares/mês). Se a Automação / Auto-Refill tentar rodar a fábrica de madrugada e bater esse teto, o Laboratório entra em Pausa automática e manda um Telegram de alerta.
2. **Cargo (Role) Editor de Vídeo:** O sistema permite convidar a equipe/freelancers. Uma pessoa com a flag "Editor/Freelancer" possui as telas Home, Configurações, Laboratório e Tendências bloqueadas e só consegue visualizar o **Kanban (Tela 4.1) dos Canais para os quais foi designada**.

---

## 8. Tendências e Pesquisa (Inteligência de Mercado)

Esta área centraliza os motores de busca e extração de canais. É onde o usuário audita a concorrência e minera os vídeos recentes para gerar eixos e ideias, consolidando o módulo "O quê criar?".
*(Nota de Arquitetura Tech: Toda a mineração de dados desta seção - Garimpo D-1, Leitura de Canais, Extração de Legendas - será alimentada oficialmente pela ferramenta **OpenCLI-rs**. Operando com Client-Hijacking de cookies do navegador via Server Headless, ele nos permite interceptar métricas do YouTube, TikTok e redes fechadas como Bilibili com custo zero de API oficial e imunidade algorítmica).*

### 8.1 Tela de Vídeos Virais (Garimpo)

#### Wireframe (Desktop)

```text
[Menu Lateral]                        [Top bar] 
 AD_LABS Logo                          📈 Vídeos Virais
 --------------------------------------------------------------------------------------------------
 🏠 Home                             [Filtros de Pesquisa]
 📺 Canais                           Palavras-chave: [              ]  | Publicado há: [ Select ▾ ]
 🌊 Laboratório                      Duração mín: [      ] seg         | Após: [  /  /  ] Antes: [  /  /  ]
 ⚙️ Configurações                    Views mínimas: [          ]       
 📈 Tendências (Ativo)               (Buscar Vídeos) (Limpar Filtros)
 --------------------------------------------------------------------------------------------------
 [Tabs] | 🔍 Buscar Vídeos | 📌 Vídeos Salvos |     Qtd: n vídeos encontrados | Ordenar por: [ Select ▾ ] 
 --------------------------------------------------------------------------------------------------
 [RESULTADOS DA PESQUISA]
 
 [Thumbnail]      Título do Vídeo Gringo/Concorrente...
 (Tempo)          Canal Autor
                  Views | Likes | Coment | VPH | Engajamento % | Score | Data
                  Ações: [📌 Salvar Ideia/Vídeo] (Envia um Card em Branco para a coluna 'Planejamento' do Kanban) | [▶️ Ver no YouTube] | [🕵️ Analisar Canal Autor]
                  (Visível no Modo Criação): [ 🚀 CRIAR CANAL BASEADO NISTO ]
 (repetir cards)
```

### 8.2 Tela: Insights de Canal (Auditoria X-Ray)

Quando o usuário pesquisa um canal específico para entender seu mecanismo de viralidade.

#### Wireframe (Desktop)

```text
[Header - Top bar] 🕵️ Insights de Canal
 --------------------------------------------------------------------------------------------------
 URL do canal: [                                                      ]
 Amostra: (•) 50  ( ) 100  ( ) 200  ( ) 300    Ordenar Extracão: (•) Recentes  ( ) Mais Vistos
 [ Analisar ]
 --------------------------------------------------------------------------------------------------
 [RESULTADO ESPELHADO DO CANAL]
 
 [Foto Avatar] Nome da Conta (@arroba) | 🌐 Região 
 Bio / Descrição (read-only)
 KPIs Globais: Inscritos | Vídeos Totais | Views Totais       (Abrir no YouTube)
 
 --------------------------------------------------------------------------------------------------
 [ 📊 DADOS GERAIS E PERFORMANCE ]
 > Parâmetros do Canal: [Formato] [Temperatura] [Duração Média] [Narração] [Trilha] [Legendas] [Cenas]
 > Comportamento: [Poder de Retenção] [Tendência de Views] [Dificuldade de Criação]
 > Métricas da Amostra: Média de Views | Mediana Views | Engajamento % 

 [ 💰 ESTIMATIVA FINANCEIRA E DEMOGRAFIA ]
 > Receita: Receita Mensal Estimada | RPM Médio global | Formato de Distribuição de Views
 > Análise de RPM por Duração: Até 15 min ($) | Até 45 min ($) | Mais de 45 min ($)
 > Demografia de Público: Perfil de Gênero (%) | Faixa Etária | Top Localização
 
 --------------------------------------------------------------------------------------------------
 [ TOP 10 (Amostra Extraída) ]
 #1 [Thumb] Título do Vídeo 1 | Data | 4M Views | Eng: 11% 
 #2 [Thumb] Título do Vídeo 2 | Data | 2M Views | Eng: 10%
 ...
 Exportar Dados p/ Auditoria Externa: [ 📥 CSV ] [ 📥 TXT ] 
 *(Nota de Arquitetura: O envio destes dados complexos para a IA é feito 100% via API (Background) de forma silenciosa para o usuário final durante a criação. Os botões de exportar são meramente um brinde para o usuário arquivar nas planilhas próprias).*
 --------------------------------------------------------------------------------------------------
 [ 🧠 ENGENHARIA REVERSA AD_LABS (Insights de Clonagem) ]
 - Estrutura e Padrões Matemáticos de Títulos ("Exatos Mapeamentos de Copywriting")
 - Engenharia Reversa do Vídeo (Decupagem da estrutura narrativa)
 - Padrões de Roteiros Identificados (Hooks que geram o Poder de Retenção lido acima)
 - Identidade de Thumbnails (Cores, Fontes, Emotion)
 
 [ 🚀 CRIAR CANAL BASEADO NESTE BENCHMARK ] (Visível no Modo Criação)
```

### 8.3 Tela: Nichos Virais / Removidos (Monitoramento)

O radar geral do mercado. Serve tanto para caçar oportunidades validadas quanto para monitorar um "Cemitério de Canais" (para saber exatamente o que NÃO modelar).

**Regras de Classificação (Algoritmo de Filtros):**
- **🚀 Explodindo:** < 15 dias postando vídeos E > 100.000 views.
- **📈 Em Alta:** 15 a 30 dias postando E > 500.000 views.
- **🌱 Crescendo:** 15 a 60 dias postando E views entre 100.000 e 500.000.
- **🐣 Novos Canais:** Canais nascentes na faixa de 50.000 a 100.000 views.
- **🧟 Removidos:** Canais banidos/removidos pelo YouTube (para evitar replicar estratégias ruins).

#### Wireframe (Desktop)

```text
[Header - Top bar] 🦠 Nichos Virais / Removidos
 --------------------------------------------------------------------------------------------------
 (Importar JSON) (Atualizar Dados) (+ Adicionar Canal) (Atualizar Matriz Completa)
 
 [Filtros KPI] 
 | 🚀 Explodindo | 📈 Em Alta | 🌱 Crescendo | 🐣 Novos Canais | Outros | 🧟 Removidos | Todos |
 Buscar canais: [                                ]
 --------------------------------------------------------------------------------------------------
 [CARDS DE CONTA MONITORADA]
 
 [Foto/Avatar] Nome do Canal       [Badge da Categoria ou REMOVIDO]   [🗑️ Excluir]
 [Thumb Menor] "Título do vídeo super recente de sucesso..."
 Views Totais | Inscritos | Qtd vídeos | Mini Gráfico Histórico
 (Visitado / Ver canal)  |  Ação: [ 🚀 CRIAR CANAL BASEADO NISTO ] (Visível no Modo Criação)
 
 (repetir cards)
```

### 8.4 Tela: Análise de Gap (Matriz Oceano Azul)

Esta aba cruza todos os dados mapeados na pesquisa para localizar buracos no mercado de canais Dark (Ref. FR22). O usuário visualiza graficamente onde há pouca concorrência e alta demanda.

#### Wireframe (Desktop)

```text
[Header - Top bar] 🌊 Matriz Oceano Azul
 --------------------------------------------------------------------------------------------------
 [ Filtros: Região | Idioma | Duração | (Analisar Mercado) ]
 --------------------------------------------------------------------------------------------------
 
 📊 GRÁFICO DE DISPERSÃO (OPORTUNIDADES)
 
 Eixo Y: Nível de Concorrência (Quantidade de Canais)
 Eixo X: Emoção / Sentimento Dominante
 
 [ Bolha Grande: Tensão Militar (Oceano Vermelho - Lotado) ]
 [ Bolha Pequena: Justiça Escolar (Oceano Azul - Gap Detectado!) ]
 
 💡 INSIGHTS GERADOS PELA IA (Sugestões de Canais):
 1. [Oceano Azul] "Histórias de Justiça no Trabalho VIP" (Foco: Satisfação / Formato: Docs de 15min) -> [🚀 CRIAR CANAL DESTE GAP]
 2. [Oceano Azul] "Mistérios Históricos do Interior" (Foco: Curiosidade Regional / Formato: Shorts) -> [🚀 CRIAR CANAL DESTE GAP]
```

### 8.5 Tela: Cofre Global (O Baú de Ganchos)

Muitas vezes, a pesquisa de mercado (Garimpo) joga na cara do usuário uma ideia genial de um nicho que ele *ainda não atua*. Se ele não quer criar o canal agora, mas também não quer perder a ideia, ele salva no **Cofre Central**. É um repositório agnóstico de canais onde recortes, ideias e thumbnails ficam salvos esperando a hora de virarem uma operação da Fábrica (Canal) no futuro.

---

## 9. Studio de Criação e Engenharia de Retenção (Blueprint)

### 9.1 Onde esta tela se posiciona na Arquitetura?

A tela do **Studio (Blueprint)** é um item fixo e permanente no Menu Lateral para rápido acesso. 

Como o Blueprint é a "receita" de um canal específico, ao clicar em "Studio" no menu lateral, haverá um seletor no topo da tela indicando qual canal você está mexendo no momento (ex: `Canal Alvo: [ Histórias Ocultas ▾ ]`). 

Quando o usuário está na tela de Pesquisa/Tendências (Módulo 8) e aperta o botão `[🚀 CRIAR CANAL BASEADO NISTO]`, o sistema o redireciona automaticamente para esta aba lateral do `🧪 Studio`, com o novo canal já selecionado no topo e os 20 campos pré-preenchidos pela IA.

### 9.2 O Papel Funcional do Blueprint

Toda a Inteligência do Blueprint (campos como *Estrutura Emocional*, *Gancho Inquebrável*, e *Fórmula Matemática*) **é o que alimenta os Prompts Geração de Roteiro nas etapas seguintes**. Sem o Blueprint preenchido aqui, as abas de "Aprovação de Roteiro" e "Áudio" individuais de cada vídeo na linha de montagem da Fábrica viriam vazias ou genéricas. O Blueprint é a "Alma" do vídeo que dita o tom da IA de escrita.

### 9.3 Tela: Studio de Configuração (Blueprint)

#### Wireframe (Desktop)

```text
[Menu Lateral]                        [Top bar] 
 AD_LABS Logo                          🧪 Studio de Criação — Blueprint de Engenharia do Canal
 --------------------------------------------------------------------------------------------------
 🏠 Home                             [ CANAL ALVO: ▾ Histórias Ocultas ]   [ Salvar Edição ]
 📺 Canais                           
 🌊 Laboratório                      [ 🪄 EXTRATOR IA ] Cole um link e a inteligência faz engenharia reversa.
 📈 Tendências                       🔗 URL do Benchmark: [ https://youtube.com/watch?v=viral ] [ ⚡ Analisar ]
 🧪 Studio (Ativo)                   
 ⚙️ Configurações                    
 --------------------------------------------------------------------------------------------------
 [Sidebar Interna: BLOCOS]             [Área Principal de Edição]
                                       
 • A. Identidade do Benchmark          [ A. IDENTIDADE DO BENCHMARK ] 
   B. Estrutura de Engajamento         1. Título Original: [ Input Text longo...               ]
   C. Narrativa e Dramaturgia          2. Canal Pai: [ Input Text...                           ]
   D. Especificações Técnicas          3. Performance Score (Views/Subs): [ Badge Verde: 9.8   ]
   E. Auditoria e Veredito             
                                       -------------------------------------------------------------
                                       [ B. ESTRUTURA DE ENGAJAMENTO ]
                                       4. Hook Inquebrável (0-5s): 
                                          [ Textarea: A frase ousada ou visual inusitado...    ]
                                       5. Mapeamento de Vozes (Narrador): 
                                          [ ▾ ElevenLabs - Marcus (Drama) | Alterar            ]
                                       6. Emoção Dominante: 
                                          [ ▾ Sentimento Alvo: Choque Moral | Alterar          ]
                                       7. Retention Loop (SFX/VFX): 
                                          [ Input: Drop de Bass grave a cada plot twist...     ]
                                          
                                       -------------------------------------------------------------
                                       [ C. NARRATIVA E DRAMATURGIA ]
                                       8. Conflito Central: [ Textarea ]
                                       9. A "Virada" (Plot Twist): [ Textarea ]
                                       10. Estrutura Emocional: [ Ex: Tensão -> Pico -> Payoff ]
                                       11. Tipo de Narrativa: [ ▾ Narrador Onisciente ]
                                       
                                       -------------------------------------------------------------
                                       [ D. ESPECIFICAÇÕES TÉCNICAS ]
                                       12. Estética Visual: [ ▾ Estilo IA: Foto-Real Cinematic ]
                                       13. Ritmo de Edição: [ Input: Jump cuts ultra rápidos ]
                                       14. Fórmula Emocional: [ Input: Injustiça + Reparação ]
                                       15. Cenários de Escala: [ ▾ Selecionáveis (Múltiplos)   ]
                                       
                                       [ ⬇️ Rolar para o Final (Auditoria)                     ]
 --------------------------------------------------------------------------------------------------
 [Painel Inferior Fixo: O VEREDITO DO MAESTRO ]
 
 📊 Quality Score (IA): [ 8.5 / 10 ]        🧠 Gatilhos: [ Curiosity Gap, Dissonância ]  
 💰 Market Signal (RPM/Risco): [ Alto/Seguro ]   
 
 VEREDITO: [ ▾ Pronto para Maré ]       [ 🚀 INJETAR BLUEPRINT NO MOTOR CENTRAL ] (Ou "Salvar Edição")
```

---

## 10. Automação Global e Regras de Auto-Refill (A Máquina Contínua)

O motor do AD_LABS funciona sob a premissa de que **"A Fábrica nunca pode parar ou secar"**. Para eliminar a síndrome da página em branco e a necessidade de o usuário ficar "pedindo/criando" vídeos manualmente todos os dias, introduzimos a arquitetura de **Auto-Refill** (Reabastecimento Automático).

### 10.1 A Lógica Matemática do Auto-Refill

Esta é uma automação de retaguarda (background/cronjob) configurada individualmente para cada Canal. 

**Como funciona a mecânica:**
1. O usuário entra nas `[⚙️ Configurações do Canal]` e define um **Estoque Mínimo Operacional** para a coluna "Em Produção" do seu Kanban (Exemplo: *"Quero sempre 5 vídeos rodando no funil"*).
2. O usuário entra na Gaveta de Produção (Seção 4.2), aprova 2 pacotes e os move para a coluna de "Agendados/Prontos".
3. A coluna "Em Produção" cai para 3 (gerando um déficit de -2).
4. O Cronjob da engrenagem detecta o déficit à meia-noite (ou no intervalo definido) e executa silenciosamente o seguinte fluxo gravitacional:
   - Vai no Módulo de **Laboratório** (Seção 5) e identifica qual Eixo/Cluster está com a flag *"Ativo / Em Alta"* no momento.
   - Puxa a "Receita" do **Blueprint** daquele canal (Seção 9) para injetar o Prompt de Identidade.
   - Pede para a IA gerar **2 Roteiros Brutos Inéditos**.
   - Cria e insere **2 novos cards** automaticamente na base da coluna "Em Produção".
5. Quando o Maestro logar no sistema pela manhã, a esteira terá novamente 5 vídeos esperando apenas a sua leitura para "Aprovar" ou "Refazer". O estoque auto-regula seu próprio volume.

### 10.2 Tela: Configuração do Auto-Refill (Nível Canal)

Esta aba de regras fica localizada nas configurações do próprio canal, onde o usuário determina o nível de "liberdade" preditiva para a IA.

#### Wireframe (Desktop)

```text
[Header - Top bar] ⚙️ Configurações do Canal: HISTÓRIAS OCULTAS
 --------------------------------------------------------------------------------------------------
 [ Abas: Geral | Equipe | Faturamento | 🤖 AUTOMAÇÃO (Ativo) | Integrações YouTube ]
 
 [ 🤖 CONTROLE DA FÁBRICA / AUTO-REFILL ]
 
 Status do Motor: [ 🟢 LIGADO ] (Pausar Motor)
 
 1. REGRAS DE ESTOQUE (Kanban)
 Manter na coluna "Planejamento (Ideias)": [ 10 ] cards gerados sempre.
 Manter na coluna "Em Produção (Roteiros)":  [  5 ] cards criados sempre.
 
 2. REGRAS DE BUSCA DE EIXO (De onde a IA puxa os temas inéditos?)
 (•) Somente usar Eixos Marcados como "Seguros / Validados".
 ( ) Pode extrair de Eixos "Novos / Em Teste" (10% de margem de risco).
 
 3. AUTO-APROVAÇÃO (Grau de Autonomia)
 [ ] Aprovar Títulos Automaticamente (Pula a "Aba 1" na gaveta de montagem).
 [ ] Aprovar Roteiros Automaticamente (Perigoso. A IA enviaria tudo direto para Narração sem a leitura humana).
 [ ] Auto-Post: Agendar publicação via API do YouTube caso o "Editor Final" dê OK.
 
 [ 💾 SALVAR REGRAS DO MOTOR DE AUTO-REFILL ]
```

Esse painel é a pedra angular da produtividade do "Veterano". Ele desloca o esforço da *criação* para a pura *curadoria*.

---

## 11. Headquarters (Painel Super Admin / God Mode)

Este é o `/HQ`, uma rota oculta no sistema com acesso restrito apenas aos fundadores (Adriano Lima e sócios). É o centro nervoso tributário e doutrinário de todo o AD_LABS.

### 11.1 O Motor Suprem0 (Ref. FR17)

Enquanto os usuários (Tenants) enxergam apenas seus canais, o Super Admin enxerga a física do software inteiro.

#### Wireframe (Desktop)

```text
[Header - Top bar] 👁️ AD_LABS Headquarters (God Mode)
 --------------------------------------------------------------------------------------------------
 [ Abas: 🌍 RADAR DE NICHOS GLOBAIS | 🧬 INJEÇÃO DE DOUTRINA (Fórmulas) | 💰 CUSTOS DE IA | 👥 USUÁRIOS ]
 --------------------------------------------------------------------------------------------------
 
 [ 🌍 RADAR DE NICHOS (O que os usuários estão validando agora?) ]
 (Ranking anônimo de eixos que "Venceram a Maré" ontem dentro da plataforma)
 #1 Relatos Dark Hospitais (12 canais ativaram maré)
 #2 Finanças Pessoais (8 canais ativaram maré)
 
 --------------------------------------------------------------------------------------------------
 [ 🧬 INJEÇÃO DE DOUTRINA (O controle sobre a Inteligência) ]
 Padrão Global de Títulos Magnéticos:
 [ Textarea: Inserir Prompt de Copywriting Matemático...                                    ]
 [ 🚀 FORÇAR ATUALIZAÇÃO NOS BLUEPRINTS DE TODOS OS USUÁRIOS (Override) ]
 
 Setup de IA Base:
 Fornecedor NLP: [ OpenAI (GPT-4o) ▾ ]    Fornecedor Áudio: [ ElevenLabs  ▾ ]
 
 --------------------------------------------------------------------------------------------------
 [ 💰 CUSTOS TRIUBUTÁRIOS E SAÚDE DO SISTEMA ]
 
 Tokens Gastos Hoje (OpenAI): 4.5M ($ 45,00)
 Caracteres Gastos Hoje (ElevenLabs): 12M ($ 120,00)
 Servidor (AWS/Render): OK 🟢
 
 [ 🛑 KILL SWITCH GERAL (Pausar todos os crons de Auto-Refill para estancar custos repentinos) ]
```

O Super Admin governa a "Forma" de como a IA pensa para todos. Se o mercado de canais dark mudar amanhã, o HQ edita o Prompt Global e instantaneamente todos os usuários da base passam a gerar roteiros atualizados contra o novo algoritmo do YouTube. 

---

## 12. Requisitos Não Funcionais (O Chassi Técnico)

Esta seção define as restrições arquiteturais, limites de segurança e infraestrutura basal sob a qual o AD_LABS deve ser codificado. *Nota: Nenhuma ferramenta específica de mercado é imposta; a engenharia fará as escolhas visando aderência a estas métricas.*

**NFR01 — Doutrina de Agnosticidade e A/B Testing Contínuo:**
A arquitetura não nascerá dependente de serviços terceirizados (No-Vendor Lock-in). Todos os processadores pesados do pipeline (Texto para Texto, Texto para Voz, Prompt para Imagem) deverão ser construídos sob o princípio de Injeção de Dependências. A plataforma deverá suportar trocas imediatas entre provedores. Toda ferramenta deverá ser amplamente testada pela engenharia (Testes de Mesa) balizando Custo vs. Qualidade, optando primeiro pelo "Gratuito ou Proprietário", consumindo infraestruturas comerciais apenas quando estritamente necessário.

**NFR02 — Aproveitamento de Ativos e Infraestrutura Elástica:**
O projeto nasce alavancando os dólares de crédito corporativo existentes nos cofres de Nuvem Pública. Logo, a tomada de decisão da arquitetura (Se instanciamos uma máquina virtual com GPU dedicada para renderizar, ou se pagamos função genérica para rodar scripts) deve derivar da otimização drástica dessa cota financeira. Postergaremos o uso de faturamento extra em "dinheiro vivo" ao máximo absoluto durante o primeiro ano de validação do produto.

**NFR03 — Isolamento Multi-Tenant Estrutural (Banco e Storage):**
O isolamento de dados vai além do Banco de dados textual (Que usará segurança RLS estrita para Tenant A não ler Tenant B). A nuvem de "Storage" que empacotará os vídeos e áudios brutais exigirá pastamento físico intransponível. Além disso, regras de expiração automáticas de limpeza (Cofres que duram no máximo 15 dias para arquivos brutos renderizados e depois se auto-deletam na AWS/GCP) devem ser implementadas para não encher discos virtualizados inutilmente com lixo morto. As chaves de APIs/OAuth de terceiros devem ser 100% criptografadas em repouso.

**NFR04 — SLA Computacional e Processamento Físico Distribuído:**
O tempo de processamento não deve engarrafar o usuário. Para isso, a arquitetura de "Fábrica" adotará uma estratégia de processamento distribuído (Micro-Workers):
1. **Orquestração Paralela:** Enquanto um Worker (Processador) menor gera a Narração do Bloco 2, outra Máquina Virtual ou Função Paralela levanta a Imagem do Bloco 1. Sem gargalos sequenciais puros.
2. **Separação de Peso Físico:** As requisições leves (Gerar Roteiros, Bater em APIs) rodam em nós mais baratos. O "Render Final" (Juntar e exportar o MP4 pesado) é atirado para uma Máquina Virtual Específica e com aceleração acelerada, dedicada puramente a engolir e compilar vídeos, evitando travar a aplicação principal.
- **SLA Alvo:** Vídeos Verticais (Geração em ~5 minutos) | Documentários Longos de 15min (Pipeline cruzada em **~30 a 45 minutos** de tempo real computado).

**NFR05 — Fundações SaaS Nativas (Escalabilidade Vertical):**
O software deve nascer suportando múltiplos usuários sem necessidade futura de "refatoração de escopo longo". Mesmo que usado como um app *"Solo-Creator"* nas primeiras semanas, seu núcleo será multi-tenant desde o commit número 1.

**NFR06 — Trilha de Auditoria com Atores Híbridos (Audit Trail):**
Para fins de recuperação de dados, depuração e compliance, toda iteração crítica (ex: "Aprovar versão de Roteiro X" ou "Aprovar Título Y") deverá gravar no banco o carimbo temporal (Timestamp) e o status da "Versão Aprovada". Crucialmente, o DB deve registrar um UUID de quem ordenou a aprovação: se foi o próprio Humano, se foi o "Editor Freelancer", ou se foi operado autonomamente através da Regra de Auto-Refill (Nesse caso logando um UUID `[Aprovado Pela Máquina // Automação Lvl 3]`).

**NFR07 — Isolamento de Responsabilidade Legal (Due Diligence):**
A plataforma é apenas um canivete de inteligência. Os Termos de Uso (checkbox obrigatório no login) devem declarar que toda a responsabilidade de direitos autorais e legalidade de imagens/áudios publicados ou gerados pertence ao dono da conta operante no site de vídeo terceiro blindando a marca mãe do sistema contra strikes alheios.

**NFR08 — Engenharia de Dados Híbrida (Extração via Client-Hijacking):**
Para não ficarmos reféns das restrições drásticas e burocracia de Desenvolvedor das APIs Oficiais (X, TikTok, YouTube), assumimos uma arquitetura Híbrida: Postagens críticas operam pela API Oficial, mas toda a "Mineração de Dados" (Garimpo de Vídeos e Perfis) é liderada pela ferramenta **OpenCLI-rs** operante no modelo de "Session Cookie Hijacking" (Extraindo dados usando os cookies do navegador do usuário autenticado nativamente via headless server). *Restrição de Segurança:* Esse pilar robótico deverá aplicar "Human Rate Limits" com folgas de navegação imperfeita para impedir banimentos das contas originais no Chromium.

**NFR09 — Performance Caching Absoluto Front-End:**
A "Rapidez da Tela" da plataforma não pode depender da velocidade do YouTube em devolver respostas. O sistema se compromete em servir a tela (Cold Start) em **< 3 segundos**. 
Para isso, os dados de Insights (Views, Inscritos de ontem, etc) vistos na aba de "Tendências" e na "Home" não são requisitados em tempo real na máquina do usuário. O Back-end de Extração (NFR08) roda varreduras em segundo plano a cada 1 hora ou D-1, gravando no nosso próprio Banco de Dados, para que a Dashboard exiba tudo instantaneamente a partir do nosso cache espelhado.

**NFR10 — Arquitetura Omnichannel e Engenharia de Reenquadramento (Cropping):**
Toda a base de programação do agendador não deve nascer engessada no "Formato YouTube TV (16:9)". O Aspect Ratio (Geometria do vídeo) é tratado como uma dimensão variável no código. Se futuramente o sistema decidir "reciclar" os canais próprios (Pegar o arquivo de 10 minutos postado no YouTube e fatiar em Shorts/Reels), a Arquitetura já estará pronta para receber o mesmo vídeo, aplicar o Crop (Corte central em 9:16) no Render Físico do NFR04 e publicá-lo em mídias verticais integradas.

---

## 13. System Design e UX (Protocolo Veterano)

### 13.1 Visão UX Geral
> **Princípio Universal do AD_LABS:** *"Humano trabalha pouco, mas controla tudo."*

O AD_LABS atua perante o usuário estritamente sob o paradigma de um **cockpit de missão** — e não como uma planilha ou painel comum. O usuário visualiza o andamento do seu canal como num centro de controle em tempo real, monitorando com precisão cartesiana os gargalos do fluxo de produção e a eficácia de cada Eixo/Maré.

### 13.2 Paradigmas de Interação
- **Aprovação em Massa e Granular:** Nas Gavetas de Produção, o Maestro pode liquidar fluxos inteiros aprovando pacotes consolidados (Massa), mas mantendo o poder de rejeitar um único trecho de roteiro de 10 segundos sem regenerar o vídeo todo (Granular).
- **Notificações Proativas (Nervoso Central):** A dependência visual é quebrada pelo Telegram Bot. O maestro não procura o erro; o sistema o alerta.
- **Progressive Disclosure:** A tela não sufoca o usuário. Variáveis complexas de API, tokens JSON e detalhes profundos do Blueprint são ocultados/empacotados até serem solicitados mediante a flag "God Mode" ou nas abas gerenciais.

### 13.3 Arquitetura de Telas Consolidadas
Optou-se por eliminar o excesso de *Page Reloads*. O fluxo das 13 telas do PRD original foi arquitetado em um ecossistema com duas velocidades:
1. **Visão Macro (Dashboards):** Home, Tendências, Nichos Virais, Painel de Integrações.
2. **Visão Micro (Modais, Side-Drawers e Gavetas):** Pipeline de Produção, Blueprint de Roteirização e Laboratório Operacional funcionam "flutuando" acima das planilhas Kaban, garantindo ao usuário a finalização de tarefas sem perda de contexto ou atraso visual.

### 13.4 Acessibilidade
Conformidade WCAG AA para interações estruturais essenciais (Botões de Aprovação, Fluxo de Publicação e Alertas).

### 13.5 Design System & Branding: Academia Lendária
O design oficial do "Protocolo Veterano" incorpora a estética *Dark Mode* tecnológica e premium. É obrigatória a adoção dos seguintes tokens baseados no modelo da marca (prontos para Tailwind, Shadcn e Aceternity UI):
- **Fundos (Backgrounds):** **Preto Quase Absoluto** (`#050505`). Superfícies de cards e modais em tons muito escuros (`#121214` a `#1A1A1E`). Header fixo com efeito de vidro (Glassmorphism + Backdrop blur).
- **Cores Primárias (Ação/Neon):** **Roxo Elétrico** (`#7C3AED`). Usado para botões principais, hover (`#6D28D9`) e sombras em neon brilhante (Glow).
- **Cores Secundárias (Premium):** **Dourado/Amarelo Lendário** (`#EAB308`). Utilizado para estrelas, coroas de marés, selos e tags essenciais.
- **Tipografia:** Fonte **Outfit** para Títulos (High-tech) e **Inter** para o Corpo, utilizando textos brancos-gelo (`#F8FAFC`) contra menus escuros para contraste superior. Títulos monumentais heroicos aplicam text-gradient (ex: Roxo para Azul `linear-gradient`).
- **Cards e Botões:** Bordas sólidas e sutis (`8px` a `16px`). Interação com Ghost loading e elevações visuais suaves (`transform: translateY`).

### 13.6 Plataformas Alvo
Web Responsive (Prioritário). Com **enfoque cirúrgico no Mobile-first** atrelado às camadas de Aprovação e Gestão Rápida — garantindo a excelência do controle assíncrono via smartphone.

---

## 14. Suposições Técnicas (Infrastructure & Tech Stack)

Baseado nos recursos orçamentários disponíveis ($1000 Google Cloud, $136 AWS, Acesso AI Ilimitado Google), a arquitetura consolida as seguintes decisões para maximizar o capital em nuvem.

### 14.1 O Núcleo (Google Cloud Platform, Next.js & Supabase)
Toda a operação pesada será orquestrada para usufruir da abundância de créditos do Google Cloud.
- **Front-end & Aplicação Core:** Desenvolvido em **Next.js (React)**. É a espinha dorsal que roda o nosso "Cockpit" (Interface). A estilização e os componentes visuais são regidos pelo **TailwindCSS + Shadcn UI** (ancorando o nosso Design System nativo "Veterano").
- **Database, Storage & Auth:** Ecossistema Supabase para provisionar o PostgreSQL, controle de RLS (Isolamento de Tenants) e estocagem de mídias pesadas.

### 14.2 Extração de Dados e Secundários
- **Pesquisa Viral:** Todo o fluxo de pesquisa viral e listagem de canais em alta será alimentado pela **API Oficial do YouTube/Google**, economizando cota por meio de caches do nosso banco.
- **Nó Satélite (AWS $136):** Este saldo será destinado apenas para isolar operários de notificação (bots como do Telegram) operando em standby contínuo até a extinção do valor.

### 14.3 Motores de Criação e Composição Físicas
Toda a base de programação e tecnologia que ditará a "Fábrica" criativa do AD_LABS está debaixo de uma incubadora tecnológica de Pesquisa e Desenvolvimento. A stack exata para cada vertente será definida futuramente, priorizando o melhor custo/benefício dento da cota do Google Cloud:
- **Inteligência Central (Roteiro e Lógica):** A DEFINIR.
- **Motor de Áudio (SFX e Voz):** A DEFINIR.
- **Motor de Imagem (Geração Visual):** A DEFINIR.
- **Motor de Vídeo (Renderização Física):** A DEFINIR.

### 14.4 Requisitos de Autenticação e Segurança
A camada de permissões do núcleo opera sob os seguintes mandamentos arquiteturais para garantir a proteção dos canais conectados:
- OAuth 2.0 nativo e isolado para as plataformas publicadoras (Ex: Integração YouTube).
- Renovação autônoma de tokens: O sistema lida com o ciclo de vida da API, sem derrubar a automação ou pedir re-login diário ao usuário.
- Criptografia profunda em repouso (AES-256 ou superior) para todas as credenciais do banco.
- Arquitetura "Multi-Conta": O banco nasce permitindo atrelar "N" contas do YouTube/TikTok debaixo de uma única assinatura (God Mode).

### 14.5 Doutrina de Engenharia e Testes
O projeto repudia a filosofia de "deploy cego". Toda a infraestrutura exige bater nas seguintes chaves de validação (Testes Automatizados a cargo do @QA e @Devops):
- **Testes Unitários:** Serão obrigatórios nos cálculos matemáticos críticos do banco (Filtros Finance, Deep Sea, Bolt), lógica de pontuação e peso da Matriz de Auditoria, e algoritmos de identificação e troca de Maré.
- **Testes de Integração:** Mecanismos que intermedeiam comunicação pesada: Filas lógicas da *Fábrica*, processos de Upload (I/O) e Webhooks reagindo às plataformas.
- **Testes E2E (Fim a Fim):** Navegação automatizada no "Cockpit" para garantir que o macro-fluxo (Aprovar Ideia → Blueprint → Geração → Vídeo em Tela) nunca se quebre após atualizações na Vercel/GCP.

---

## 15. Modelo de Negócio

| Plano | Preço | Vídeos/mês | Canais | Qualidade |
|-------|-------|------------|--------|-----------|
| Gratuito | R$0 | 5 | 1 | 720p |
| Básico | $29/mês | 30 | 3 | 1080p |
| Premium | $99/mês | 100 | 10 | 1080p + Suporte prioritário |
| Enterprise | Custom | Ilimitado | Ilimitado | 4K + Dedicado |

> **Fase 1:** Uso pessoal (Adriano Lima) — sem limites, sem cobrança. Limites por plano entram na fase SaaS pública.

### Metas de Sucesso

| Meta | Critério |
|------|----------|
| **Operacional** | Produzir 10 canais de tipos diferentes com sucesso |
| **Negócio** | 1 dos 10 canais monetizar dentro de 30 dias |
