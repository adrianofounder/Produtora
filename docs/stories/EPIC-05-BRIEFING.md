# Briefing Estratégico — EPIC-05: Radar de Nichos Globais (Garimpo)

## 🎯 Visão do Produto
O objetivo do EPIC-05 é transformar a Produtora em uma ferramenta de **inteligência competitiva**. Não basta mais apenas produzir vídeos; precisamos produzir vídeos em nichos onde a demanda é alta e a oferta de qualidade é baixa (Oceano Azul).

O "Radar de Nichos" permitirá que o usuário identifique canais "explodindo" (canais novos com views massivas) e "clonar" a estratégia de sucesso de forma ética, gerando conteúdos originais baseados em benchmarks reais.

## 🛠️ Pilares Técnicos

### 1. Matriz Oceano Azul (Visualização de Dados)
- **O que é**: Um gráfico de dispersão 2D.
- **Eixo X (Sentimento/Emoção)**: Identificado via IA nas descrições/títulos.
- **Eixo Y (Concorrência)**: Densidade de canais semelhantes.
- **Diferencial**: Identificação visual imediata de "Gaps" (nicho com alta demanda e poucos players).

### 2. Crawler "D-1" (Engine de Garimpo)
- **Estratégia**: Uso do `OpenCLI-rs` para extração via hijacking de cookies (evitando custos proibitivos da API oficial do YouTube).
- **Inteligência**: Filtros automáticos para classificar canais:
  - **🚀 Explodindo**: < 15 dias de vida, > 100k views.
  - **📈 Em Alta**: 15-30 dias, > 500k views.
  - **🧟 Removidos**: Detecção de morte de canal (oportunidade de migração de audiência).

### 3. Integração Cross-Module
- **Output para o Studio**: Botão "Criar Canal Baseado Nisto" que pré-popula o Blueprint.
- **Output para a Fábrica**: Botão "Salvar Ideia" que envia o vídeo benchmark direto para o Kanban.

## 📈 KPIs de Sucesso
- Redução no tempo de pesquisa de nicho (de horas para minutos).
- Aumento da taxa de "viralização" dos canais criados via blueprint pré-validado.
- Custo de extração de dados próximo de zero (NFR08).

---

## ⏭️ Próximos Passos
1. **Ativar @sm (River)**: Para decompor este briefing nas histórias técnicas e criar o `EXECUTION-GUIDE-EPIC-05.md`.
2. **Setup do Crawler**: Validar a integração com o `OpenCLI-rs`.
3. **Desenvolvimento da Matriz**: Iniciar o componente de dispersão visual.

— Morgan, planejando o futuro 📊
