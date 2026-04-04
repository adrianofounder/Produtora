Write-Host "Instalando utilitarios via npm..."
npm install -g pnpm supabase @railway/cli

Write-Host "Instalando bun..."
irm bun.sh/install.ps1 | iex

Write-Host "Instalando Docker Desktop..."
winget install --id Docker.DockerDesktop --accept-source-agreements --accept-package-agreements

Write-Host "Instalando coderabbit via WSL..."
wsl bash -c "curl -fsSL https://coderabbit.ai/install.sh | bash"

Write-Host "Processo concluído! Você já pode fechar esta janela."
Pause
