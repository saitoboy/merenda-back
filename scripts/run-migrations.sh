#!/bin/bash

# 🗄️ Script de Normalização do Banco de Dados - Merenda Smart Flow
# 
# Este script executa todas as migrations para normalizar o banco.
# ✅ Funciona mesmo se as migrations já foram executadas
# ✅ Detecta automaticamente o que precisa ser feito
# 
# Uso: ./run-migrations.sh

echo "🚀 NORMALIZAÇÃO DO BANCO DE DADOS - MERENDA SMART FLOW"
echo "========================================================="
echo "🎯 Objetivo: Normalizar tabelas escola, estoque e segmentos"
echo ""

# Carregar variáveis do .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "✅ Credenciais carregadas do .env"
    echo "   🗄️ Banco: $DB_NAME"
    echo "   🌐 Host: $DB_HOST"
    echo "   👤 Usuário: $DB_USER"
else
    echo "❌ Arquivo .env não encontrado!"
    echo "💡 Crie o arquivo .env com as credenciais do banco"
    exit 1
fi

echo ""

# Executar via Node.js (mais robusto e inteligente)
echo "⚡ Executando migrations via Node.js..."
if command -v node > /dev/null 2>&1; then
    node scripts/run-migrations.js
else
    echo "❌ Node.js não encontrado!"
    echo "💡 Instale o Node.js ou execute manualmente:"
    echo "   psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_create_segmento_table.sql"
    echo "   (continue com os demais arquivos em ordem)"
    exit 1
fi
