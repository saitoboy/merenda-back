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
- ✅ **Limpeza do estoque** - Remove colunas obsoletas (segmento_estoque)
- ✅ **Limpeza da escola** - Remove coluna obsoleta (segmento_escola)

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
📦 Total de migrations: 11

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
├── 010_cleanup_estoque_table.sql
└── 011_remove_escola_segmento_column.sql

scripts/
└── run-migrations.js

run-migrations.sh      # Script Bash
run-migrations.ps1     # Script PowerShell
```

---

## 🔄 Status da Refatoração do Backend

### ✅ Fase 1: Types/Models (CONCLUÍDA)

#### Atualizações realizadas:

**📝 Types (`src/types/index.ts`)**
- ✅ Atualizada interface `Escola` (removido `segmento_escola`)
- ✅ Atualizada interface `Estoque` (novo modelo com FKs)
- ✅ Criadas interfaces: `Segmento`, `PeriodoLancamento`, `EscolaSegmento`
- ✅ Criados DTOs: `CriarEstoque`, `AtualizarEstoque`, `EstoqueCompleto`
- ✅ Criadas interfaces auxiliares: `EscolaComSegmentos`, `FiltroEstoque`
- ✅ Atualizada interface `ResumoDashboardEscola`

**🗃️ Models**
- ✅ Criado `segmento.model.ts` - CRUD completo para segmentos
- ✅ Criado `periodo-lancamento.model.ts` - CRUD completo para períodos
- ✅ Criado `escola-segmento.model.ts` - Gestão do relacionamento N:N
- ✅ Atualizado `estoque.model.ts` - Refatorado para novo modelo normalizado
- ✅ Atualizado `escola.model.ts` - Integração completa com sistema de segmentos

#### Principais melhorias implementadas:
- 🔄 **Estoque**: Agora funciona com FKs (id_segmento, id_periodo)
- 🔍 **Filtros**: Sistema de filtros avançado para consultas de estoque
- 📊 **Joins**: Consultas com informações relacionadas (EstoqueCompleto)
- 🏫 **Escola-Segmento**: Gestão flexível do relacionamento N:N
- ⚡ **Performance**: Queries otimizadas com joins e índices
- 📈 **Métricas**: Dashboard com dados por segmento e período
- 🔗 **Integração**: Models integrados usando imports entre si

### 🔄 Próximas Fases

#### 📋 Fase 2: Services
- [x] Refatorar `EstoqueService` para usar novo modelo
- [x] Refatorar `EscolaService` para usar relacionamentos
- [x] Criar `SegmentoService`
- [x] Criar `PeriodoLancamentoService`
- [ ] Atualizar validações e regras de negócio

#### 🎮 Fase 3: Controllers e Rotas
- [ ] Atualizar `EstoqueController` para novos endpoints
- [ ] Atualizar `EscolaController` para gestão de segmentos
- [ ] Criar `SegmentoController`
- [ ] Criar `PeriodoController`
- [ ] Atualizar rotas e middlewares

#### 📖 Fase 4: Documentação e Testes
- [ ] Atualizar documentação da API
- [ ] Atualizar schemas de validação
- [ ] Testes de integração
- [ ] Migração de dados legados (se necessário)

### 💡 Observações Importantes

1. **Compatibilidade**: O novo modelo mantém compatibilidade com dados existentes
2. **Performance**: Índices criados para otimizar consultas frequentes
3. **Integridade**: Foreign Keys garantem consistência dos dados
4. **Flexibilidade**: Sistema permite múltiplos segmentos por escola e períodos globais

---

## ✅ Status do Projeto

### 🎯 Fase 1 - Banco de Dados ✅ **CONCLUÍDA**
- ✅ **11 migrations executadas e validadas**
- ✅ **Scripts de execução atualizados**
- ✅ **Banco normalizado e otimizado**
- ✅ **Types/interfaces refatorados**
- ✅ **Models atualizados para o novo modelo**

### 🎯 Fase 2 - Services ✅ **CONCLUÍDA**
- ✅ **EscolaService refatorado** para modelo N:N
- ✅ **SegmentoService criado** com funcionalidades completas
- ✅ **PeriodoLancamentoService criado** com validações avançadas
- ✅ **EstoqueService mantido** (já estava atualizado)
- ✅ **Eliminação total** de campos obsoletos
- ✅ **Zero erros** de compilação TypeScript

### 🔄 Fase 3 - Controllers e Rotas (Próxima)
- 🔄 **Atualização dos controllers** para usar services refatorados
- 🔄 **Implementação de rotas** para novos services
- 🔄 **Schemas de validação** para APIs
- 🔄 **Testes de integração** end-to-end
- 🔄 **Documentação de endpoints** atualizada

📖 **Documentação completa**: `docs/api/refatoracao-fase-1.md` e `docs/api/refatoracao-fase-2.md`

---

## 📚 Documentação Completa

Para informações detalhadas sobre a refatoração, consulte:

- **[Documentação Técnica da Fase 1](./docs/api/refatoracao-fase-1.md)** - Guia completo com exemplos
- **[Guia de Migração](./docs/api/guia-migracao.md)** - Como atualizar código existente  
- **[Resumo Executivo](./docs/api/resumo-executivo-fase-1.md)** - Visão geral dos benefícios
- **[Documentação da API](./docs/api/README.md)** - Referência completa da API
