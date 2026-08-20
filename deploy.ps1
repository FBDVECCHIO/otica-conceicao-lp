# Script de Automação de Deploy - Ópticas Conceição x FILA
# Uso: .\deploy.ps1 "Sua mensagem de commit aqui"

param (
    [string]$CommitMessage = "Update landing page"
)

Write-Host "==========================================" -ForegroundColor Blue
Write-Host " Iniciando Sincronização com GitHub & Vercel " -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue

# 1. Adicionar alterações
Write-Host "-> Adicionando arquivos..." -ForegroundColor Cyan
git add .

# 2. Criar o commit
Write-Host "-> Criando commit com a mensagem: '$CommitMessage'..." -ForegroundColor Cyan
git commit -m $CommitMessage

# 3. Enviar para o GitHub
Write-Host "-> Enviando arquivos para o GitHub (main)..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host " 🎉 Sucesso! Alterações enviadas." -ForegroundColor Green
    Write-Host " A Vercel atualizará o site em alguns segundos." -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host " ❌ Erro durante o deploy." -ForegroundColor Red
    Write-Host " Verifique sua conexão ou credenciais do GitHub." -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
}
