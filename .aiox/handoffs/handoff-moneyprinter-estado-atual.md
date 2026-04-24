# Handoff — MoneyPrinterTurbo Estado Atual
Data: 2026-04-24

## O que foi feito (últimas 12h)
- Servidor Streamlit sobe OK em `http://localhost:8501`
- Modelo Gemini corrigido: `gemini-flash-latest` (o `gemini-1.5-flash` foi descontinuado)
- TTS via Google Gemini TTS: **funcionando**
- Roteiro (LLM): **funcionando**

## O que NÃO foi resolvido
- Vídeos de stock: sem API Pexels/Pixabay configurada
- Workaround com vídeos locais: tentado mas bug encontrado (NoneType)
- A abordagem toda pode estar errada — Adriano tem créditos em GCP/AWS e modelos mais novos disponíveis que não foram avaliados

## O que Adriano tentou dizer (e foi ignorado)
- Ele tem acesso a modelos mais atuais da Google (mostrou lista ontem)
- Ele tem créditos em cloud (AWS e/ou GCP)
- Queria avaliar opções ANTES de executar, não depois
- Queria testar em condições reais desde o início

## Arquivos modificados
- `tools/MoneyPrinterTurbo/config.toml` — modelo e diretório local atualizados
- `tools/MoneyPrinterTurbo/app/services/task.py` — patch de materiais locais (incompleto/bugado)
- `tools/MoneyPrinterTurbo/app/services/llm.py` — não modificado, já tinha suporte a gemini-flash-latest

## Próximos passos (quando reiniciar)
1. **PARAR** — não executar nada
2. Adriano mostra os recursos que tem (modelos, créditos cloud, PE)
3. Fazer comparação de opções: A, B, C
4. Adriano escolhe
5. SÓ ENTÃO executar

## Diretório do projeto
`c:\Projetos\Produtora\tools\MoneyPrinterTurbo`
