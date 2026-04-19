# Guia de Escopo — EPIC-03: A Máquina de Criação (Integração IA e Motores)

**Status**: Planning Finalizado / Ready for Engineering
**Objetivo Escopo**: Injetar a capacidade gerativa dentro do AD_LABS, implementando centralmente a **Gaveta de Produção** (Módulo 4.2 do PRD). Neste Epic, a interface permitirá que o Maestro, ativamente, comande a transição de um vídeo entre as fases de: Ideia Inicial → Geração de Roteiro (Text) → Narração (TTS/Voz) → Geração de Imagem (Thumb/Pacote Final).

> **Diretrizes Estratégicas Essenciais (Aprovadas pelo Maestro)**
> - **Zero tolerância ao "Happy Path" (Perfeição):** A resiliência é a prioridade. Toda chamada externa terá captura nativa de erros, aviso claro ao usuário, e o mais importante: Os **Limites de Tokens/Gastos Diários** ganham uma interface dedicada no dashboard de Configurações, contendo chave de ligar/desligar esses tetos (conforme requisitado). Se passar do teto, a IA aciona o "freio".
> - **Agnosticidade Suprema (Portas, não Correntes):** Neste épico, o time de engenharia não atrelará o código à empresa XYZ definidamente. Utilizaremos Padrões e Interfaces abstratas provisórias para validarmos a passagem de dados na Gaveta. O Maestro realizará ativamente pesquisas refinadíssimas de Motores Open-Source/Alta Qualidade paralelamente e fará a determinação técnica depois sobre qual LLM ou API entrará no conector oficial final. A engenharia garantirá que trocar este modelo no futuro leve segundos, nunca dias.
> - **Criação Híbrida/Manual (Síncrona):** O "Cronjob Noturno/Auto-Refill" foi repassado oficialmente para o escopo do **EPIC-04**. O EPIC-03 garante o poder brutal de geração **assistida e governada** com o usuário acordado e guiando ativamente o botão na Gaveta.

---

## 🏗️ Requisitos Funcionais e Mapa de Histórias

### Story 3.1 — Arquitetura do Cofre de Credenciais e Limites (Módulo 7)
- **Objetivo**: Criar interface visual de `Configurações > Inteligência e Custos`.
- **Escopo**: 
  1. CRUD de Inserção de Chaves (Ex: Campos flexíveis para colocar URLs, Keys ou parâmetros de IAs LLM/TTS independentemente de qual será no final).
  2. Switcher "Ativar Teto de Gastos (Tokens)" on/off e campos de volume tolerável base.
  3. Amarração RLS no Supabase para salvar de forma criptografada as chaves para esse usuário/tenant.

### Story 3.2 — Gaveta de Produção (Aba 1 e 2): A Injeção de Roteiro
- **Objetivo**: Permitir a abertura da Linha de Montagem de Vídeo por cima do Kanban.
- **Escopo**: Ao abrir, o sistema carrega os metadados fixos do "Blueprint" do canal (Tone of Voice, Personagem, Duração). No clique de gerar texto, a lógica pega as infos, acopla à API provisória (via padrão Abstrato) definida no backend de `Generation` e exibe os parágrafos de roteiro num editor formatado do React no front-end, travando ou tratando casos falhos de rede imediatamente e logando os "Tokens Simulados" gastos nas métricas criadas na Story 3.1.

### Story 3.3 — Gaveta de Produção (Aba 3): O Motor de Emissão Sonora (TTS)
- **Objetivo**: A Aba contígua deve lidar com áudio daquele roteiro lido.
- **Escopo**: Extrair texto aprovado no passo anterior e engatar chamada (Via Interface TTS injetada simulando, pro ex ElevenLabs) para fatiar retornos de parágrafos. Deve-se gravar no Supabase Storage do usuário os fragmentos de MP3 originados, apresentando tocadores em UI amigável e permitindo ao Maestro substituir individualmente um parágrafo que ficou ruim, regenerando uma vez ou pulando.

### Story 3.4 — Empacotamento Visual e Retaguarda do Asset (Aba 4 e 5)
- **Objetivo**: Completar as extremidades criativas empacotando o Rascunho final (Exportação).
- **Escopo**: Acionamento visual (Thumb/Capa) usando prompt fixo do Blueprint (podendo ser apenas um conector temporário) e uma aba final de revisão (Pacote Completo) com botão "Realizar Download dos Arquivos Atuais (.txt, .mp3, .png)" e "Finalizar Para a Estante".

---

## 🚦 Critério de Sucesso do EPIC-03

O EPIC-03 será consolidado e entregue com chave de ouro no instante em que o Maestro ou o QA conseguirem, a partir da listagem de vídeos:
1. Abrir o Perfil de API, setar falsas/verdadeiras chaves seguras limitadas por teto.
2. Iniciar o "Gerar Roteiro", vendo a abstração do servidor obedecer ou segurar gasto em caso de estouro.
3. Avançar para o "Gerar Áudio", escutar faixas originadas guardadas em nuvem pelo próprio player do projeto.
4. Exportar (download real) o conjunto final em formato de pacote local do computador dele (ZIP ou multi-arquivos) finalizando o papel do Agente-Criador antes de renderizações físicas do AfterEffects.

---
*Gerado por @pm (Morgan) — AIOX Workflows*
