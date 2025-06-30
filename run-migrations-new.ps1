# 🗄️ Script de Normalização do Banco de Dados - Merenda Smart Flow (PowerShell)
# 
# Este script executa todas as migrations para normalizar o banco.
# ✅ Funciona mesmo se as migrations já foram executadas
# ✅ Detecta automaticamente o que precisa ser feito
# 
# Uso: .\run-migrations.ps1

Write-Host "🚀 NORMALIZAÇÃO DO BANCO DE DADOS - MERENDA SMART FLOW" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "🎯 Objetivo: Normalizar tabelas escola, estoque e segmentos" -ForegroundColor Yellow
Write-Host ""

# Verificar se .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "💡 Crie o arquivo .env com as credenciais do banco" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
Write-Host ""

# Executar via Node.js (mais robusto e inteligente)
Write-Host "⚡ Executando migrations via Node.js..." -ForegroundColor Cyan

# Verificar se Node.js está disponível
if (Get-Command "node" -ErrorAction SilentlyContinue) {
    node scripts/run-migrations.js
} else {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "💡 Instale o Node.js ou execute manualmente via psql" -ForegroundColor Yellow
    Write-Host "   Exemplo: psql -h host -U usuario -d banco -f migrations/001_create_segmento_table.sql" -ForegroundColor Gray
    exit 1
}
