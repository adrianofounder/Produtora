# Dossiê Mestre de Requisitos Não Funcionais (NFRs)

Este documento consolida as "leis inquebráveis" do ecossistema AD_LABS, derivadas diretamente da Seção 12 do `prd-revisado.md`. 
Todo novo agente técnico (Arquiteto, DevOps, QA, Data Engineer) **DEVE** referenciar este documento antes de projetar soluções ou validar PRs. O desvio destas normas compromete a viabilidade técnica e financeira do projeto.

---

## 1. Infraestrutura e Agnosticidade

### NFR01 — Doutrina de Agnosticidade e A/B Testing Contínuo
* **Regra:** Proibido o "Vendor Lock-in" (prisão a um único fornecedor).
* **Execução:** Todos os processadores pesados (LLMs, TTS, TTI) devem ser acoplados via injeção de dependências. O sistema deve suportar a troca imediata de provedores (ex: OpenAI para Claude, ElevenLabs para Google TTS). 
* **Priorização de Custo:** Ferramentas gratuitas ou proprietárias são a 1º escolha. APIs comerciais são a última escolha (após exaustivos testes de mesa balizando "Custo vs Qualidade").

### NFR02 — Aproveitamento de Ativos e Infraestrutura Elástica
* **Regra:** O núcleo nasce na Nuvem Pública usando créditos corporativos passivos (Google Cloud / AWS).
* **Execução:** Decisões de processamento (VM vs Serverless) devem focar primariamente em minimizar o consumo de *cash* real, prorrogando faturamento por 1 ano.

## 2. Segurança, Dados e Conformidade (Compliance)

### NFR03 — Isolamento Multi-Tenant Estrutural (Banco e Storage)
* **Regra:** Barreiras intransponíveis entre usuários.
* **Execução (DB):** Row-Level Security (RLS) estrito obrigatório em todas as queries. Tenant A nunca pode ler Tenant B.
* **Execução (Storage):** O cofre de mídia deve rodar auto-purge. Arquivos brutos e renderizações pesadas têm expiração máxima de **15 dias**, deletando-se automaticamente para não inflar o disco de lixo.
* **Criptografia:** Todas as chaves OAuth/APIs terceiras devem ser 100% criptografadas em repouso (AES-256 no banco).

### NFR06 — Trilha de Auditoria com Atores Híbridos (Audit Trail)
* **Regra:** Imutabilidade e rastreabilidade nas ações críticas.
* **Execução:** Qualquer aprovação na Fábrica (Roteiro, Título) deve gerar Timestamp + Status da "Versão Aprovada" no banco. É OBRIGATÓRIO salvar o UUID do autor: `Humano / Editor Freelancer` ou a anotação `[Automação Lvl 3]` se o sistema aprovou sozinho pelo Auto-Refill.

### NFR07 — Due Diligence e Isolamento Legal
* **Regra:** O software atua apenas como "canivete".
* **Execução:** O sistema obriga o clique nos Termos de Uso. Direitos autorais gerados na plataforma ou subidos aos provedores são de responsabilidade do dono da conta. O AD_LABS central se isenta de copyright strikes.

## 3. Desempenho e Engenharia (SLA)

### NFR04 — SLA Computacional e Processamento Distribuído
* **Regra:** O tempo de máquina não trava o cérebro do usuário. Micro-Workers separados.
* **Orquestração Paralela:** Áudio gerado simultaneamente à Imagem. Fim ao gargalo sequencial.
* **Separação de Peso Físico:** APIs rodam leve/serverless. A **renderização MP4** final obrigatoriamente vai para VM dedicada e acelerada para evitar timeout no App Principal.
* **SLA de Tempo Real:** Vídeo Curto (~5 min) | Docs Longos 15min (~30 a 45 min de tempo computacional real).

### NFR09 — Performance Caching Absoluto Front-End
* **Regra:** Resposta Tática Imediata (Cold Start < 3 segundos).
* **Execução:** Dados massivos de Analytics (Views, Tendências Gerais) visíveis no Dashboard ou Laboratório **NÃO SÃO REQUISITADOS** ao YouTube na hora do carregamento da tela do usuário.
* O Backend de Extração age em Background (CRON de D-1 ou De-hora-em-hora) e salva os dados no Cache nativo do AD_LABS.

## 4. Coleta de Inteligência e Automação Futura

### NFR05 — Fundações SaaS Nativas (Escalabilidade Vertical)
* **Regra:** Multi-tenant no Dia 1.
* **Execução:** Proibido uso de ID fixo contornando o modelo; todo fluxo requer o parâmetro universal de `tenant_id`.

### NFR08 — Engenharia de Dados Híbrida (Extração via Client-Hijacking)
* **Regra:** Contorno à burocracia de APIs oficiais (YouTube, TikTok) para fins *exclusivos* de Mineração de Mercado.
* **Execução:** Postagens (Writes) operam pela *API Oficial*. Contudo, *Mineração Visual (Garimpo)* usará a solução headless **OpenCLI-rs** (Client-hijacking de cookies da sessão logada no desktop do admin).
* **Proteção:** Obrigatório injeção de *Human Rate Limits* (limitação robótica simulada) para proteger o cookie de bans e evasivas de fingerprint.

### NFR10 — Arquitetura Omnichannel e Reenquadramento (Cropping)
* **Regra:** Videos agnósticos para qualquer formato num futuro recorte (Ex: YouTube para Shorts).
* **Execução:** O Front-end não "chumba" que o canal é só 16:9. A dimensão de vídeo/aspect ratio é variável no código, esperando que a Máquina Virtual final consiga aplicar o `Crop (9:16)` central dinamicamente sobre um arquivo renderizado preexistente.

---
*Fim do Dossiê NFR. Este documento blinda os requisitos não-funcionais que regem o código.*
