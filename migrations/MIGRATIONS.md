# 📋 Como Executar as Migrations - Normalização do Banco

Este projeto contém migrations para normalizar o banco de dados do sistema de merenda escolar. 

## 📦 O que as Migrations Fazem

As migrations normalizam o banco criando:
- ✅ **Tabela `segmento`** - Normaliza os segmentos (escola, creche, proeja, brasil alfabetizado)
- ✅ **Tabela `periodo_lancamento`** - Sistema de períodos globais
- ✅ **Tabela `escola_segmento`** - Relacionamento N:N entre escola e segmento
- ✅ **Colunas normalizadas na tabela `estoque`** - FKs para as novas tabelas
- ✅ **Foreign Keys e constraints** - Garantem integridade referencial
- ✅ **Índices** - Otimizam a performance das consultas
- ✅ **Período de teste** - Insere junho/2025 para validação
- ✅ **Limpeza** - Remove colunas obsoletas (segmento_estoque)

## 🚀 Como Executar

### Opção 1: NPM (Recomendado)
```bash
npm run migrate
```

### Opção 2: Node.js direto
```bash
node scripts/run-migrations.js
```

### Opção 3: Bash (Linux/Mac/Git Bash)
```bash
./run-migrations.sh
```

### Opção 4: PowerShell (Windows)
```powershell
.\run-migrations.ps1
```

## ⚠️ Pré-requisitos

1. **Node.js** instalado
2. **Arquivo `.env`** com as credenciais do banco:
   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   DB_PORT=5432
   ```
3. **PostgreSQL** rodando e acessível

## ✅ Funcionalidades Inteligentes

- 🔍 **Detecta automaticamente** quais migrations já foram executadas
- ⏭️ **Pula migrations** que já estão aplicadas
- ⚠️ **Trata erros esperados** (dados duplicados, tabelas existentes)
- 📊 **Relatório detalhado** do que foi executado
- 🔌 **Testa a conexão** antes de executar

## 📊 Exemplo de Saída

```
🚀 NORMALIZAÇÃO DO BANCO DE DADOS - MERENDA SMART FLOW
============================================================
🎯 Objetivo: Normalizar tabelas escola, estoque e segmentos
📦 Total de migrations: 10

🔌 Testando conexão com o banco de dados...
✅ Conexão estabelecida com sucesso!

📁 Encontrados 8 arquivos de migration:

🔄 Processando: 001_create_segmento_table.sql
⏭️  001_create_segmento_table.sql - Já executada, pulando...

🔄 Processando: 002_create_periodo_lancamento_table.sql
⏭️  002_create_periodo_lancamento_table.sql - Já executada, pulando...

... (continua para todas as migrations)

📊 RELATÓRIO FINAL:
==============================
✅ Executadas: 0
⏭️  Puladas: 8
❌ Erros: 0

🎉 NORMALIZAÇÃO CONCLUÍDA COM SUCESSO!
✅ Banco de dados normalizado e pronto para uso!
```

## 🛠️ Solução de Problemas

### ❌ Erro de Conexão
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -h host -U usuario -d banco`

### ❌ Node.js não encontrado
- Instale o Node.js: https://nodejs.org
- Ou execute manualmente via `psql`

### ❌ Permissão negada (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📁 Estrutura dos Arquivos

```
migrations/
├── 001_create_segmento_table.sql
├── 002_create_periodo_lancamento_table.sql
├── 003_create_escola_segmento_table.sql
├── 004_migrate_escola_segmentos.sql
├── 005_alter_estoque_add_columns.sql
├── 006_migrate_estoque_segmentos.sql
├── 007_add_estoque_constraints.sql
├── 008_create_indexes.sql
├── 009_insert_test_period.sql
└── 010_cleanup_estoque_table.sql

scripts/
└── run-migrations.js

run-migrations.sh      # Script Bash
run-migrations.ps1     # Script PowerShell
```
