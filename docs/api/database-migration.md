# 🗄️ Normalização do Banco de Dados - Merenda Smart Flow

Este diretório contém as migrations necessárias para normalizar o banco de dados do sistema de merenda escolar.

## 📋 O que será normalizado

- **Tabela `segmento`**: Armazena os segmentos de ensino (escola, creche, proeja, brasil alfabetizado)
- **Tabela `periodo_lancamento`**: Períodos globais para lançamento de estoque  
- **Tabela `escola_segmento`**: Relacionamento N:N entre escola e segmento
- **Tabela `estoque`**: Adição de FKs normalizadas (id_segmento, id_periodo, id_estoque)
- **Constraints e Índices**: Para garantir integridade e performance

## 🚀 Como executar

### Opção 1: Script Node.js (Recomendado)
```bash
# Executar diretamente
node scripts/run-migrations.js
```

### Opção 2: Script Bash (Linux/Mac/Git Bash)
```bash
# Dar permissão de execução
chmod +x run-migrations.sh

# Executar
./run-migrations.sh
```

### Opção 3: Script PowerShell (Windows)
```powershell
# Executar no PowerShell
.\run-migrations.ps1
```

## ⚙️ Pré-requisitos

1. **Node.js** instalado (para a opção recomendada)
2. **Arquivo `.env`** configurado com:
   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   DB_PORT=5432
   ```
3. **PostgreSQL** rodando e acessível
4. **Dependências** instaladas: `npm install`

## 📦 Migrations incluídas

1. **001_create_segmento_table.sql** - Cria tabela segmento
2. **002_create_periodo_lancamento_table.sql** - Cria tabela periodo_lancamento  
3. **003_create_escola_segmento_table.sql** - Cria tabela escola_segmento (N:N)
4. **004_migrate_escola_segmentos.sql** - Migra dados JSONB para relacionamento
5. **005_alter_estoque_add_columns.sql** - Adiciona colunas na tabela estoque
6. **006_migrate_estoque_segmentos.sql** - Migra segmentos do estoque
7. **007_add_estoque_constraints.sql** - Adiciona constraints e FKs
8. **008_create_indexes.sql** - Cria índices para performance

## ✅ Verificação pós-execução

Após executar as migrations, o script automaticamente verifica:

- ✅ Tabelas normalizadas criadas
- ✅ Dados migrados corretamente  
- ✅ Relacionamentos N:N funcionando
- ✅ Constraints aplicadas
- ✅ Índices criados

## 🔄 Execução segura

- As migrations são **idempotentes** - podem ser executadas múltiplas vezes
- Dados antigos são **preservados** durante a migração
- Verificações automáticas garantem a **integridade dos dados**

## 🆘 Troubleshooting

### Erro de conexão
- Verifique se PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -h localhost -U usuario -d banco`

### Migration já executada
- As migrations detectam dados já migrados automaticamente
- É seguro executar novamente em caso de falha parcial

### Problemas de permissão
- **Linux/Mac**: `chmod +x run-migrations.sh`
- **Windows**: Execute como Administrador se necessário

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs de erro detalhados nos scripts
2. Conexão com banco de dados
3. Versão do PostgreSQL (17.0+ recomendado)
4. Dependências Node.js instaladas
