# 🍎 Merenda Smart Flow - Backend

Sistema completo de gestão de merenda escolar com modelo normalizado, APIs RESTful e documentação abrangente.

## 🎯 Sobre o Projeto

O Merenda Smart Flow é uma plataforma moderna e completa para gestão de merenda escolar que conecta escolas, nutricionistas e fornecedores em um sistema integrado e eficiente. 

### 🏆 Sistema Completamente Refatorado
✅ **Banco normalizado** com relacionamentos adequados  
✅ **APIs RESTful** modernas e bem documentadas  
✅ **Gestão por segmentos** educacionais (Infantil, Fundamental, Médio)  
✅ **Controle temporal** através de períodos de lançamento  
✅ **Dashboard e métricas** em tempo real  
✅ **Importação em massa** de dados  
✅ **Sistema de alertas** inteligente  

O sistema permite controle detalhado de estoque por escola/segmento/período, geração automática de pedidos, gestão completa de fornecedores, relatórios avançados e auditoria completa de todas as operações.

## ✨ Características Principais

✅ **Modelo de Dados Normalizado**: Relacionamentos adequados entre entidades  
✅ **Gestão por Segmentos**: Controle separado por segmento educacional (Infantil, Fundamental, Médio, etc.)  
✅ **Controle Temporal**: Períodos de lançamento para organização temporal  
✅ **APIs RESTful Completas**: Endpoints modernos com documentação abrangente  
✅ **Importação em Massa**: Suporte para grandes volumes de dados via CSV/JSON  
✅ **Dashboard e Métricas**: Visão consolidada e estatísticas detalhadas  
✅ **Sistema de Alertas**: Notificações inteligentes para estoque baixo e validade  
✅ **Controle de Permissões**: Acesso granular por tipo de usuário (Admin, Nutricionista, Gestor, Fornecedor)  
✅ **Auditoria Completa**: Logs detalhados de todas as operações do sistema  
✅ **Automações Avançadas**: Geração automática de pedidos baseada em estoque baixo  

## 📊 Sistema de Gestão Completo

### 🏫 Para Escolas
- Controle de estoque por segmento educacional
- Dashboard com métricas em tempo real
- Geração automática de pedidos
- Alertas de estoque baixo e validade próxima

### 🍎 Para Nutricionistas
- Definição de valores ideais por escola/segmento
- Visão consolidada de todas as escolas
- Relatórios avançados de consumo
- Controle de qualidade nutricional

### 🚚 Para Fornecedores
- Visualização de pedidos em tempo real
- Gestão de produtos e preços
- Histórico de vendas e estatísticas
- Comunicação direta com escolas

### 👨‍💼 Para Administradores
- Controle total do sistema
- Gestão de usuários e permissões
- Importação em massa de dados
- Métricas consolidadas do sistema  

## 🏗️ Estrutura do Banco de Dados (Modelo Normalizado)

O sistema utiliza um banco de dados PostgreSQL normalizado com as seguintes entidades principais:

### 🏫 Escola
- **id_escola** (PK, UUID)
- **nome_escola** (VARCHAR 100)
- **endereco_escola** (VARCHAR 200)
- **email_escola** (VARCHAR 100)
- **created_at**, **updated_at** (TIMESTAMP)

### 🏷️ Segmento (NOVO)
- **id_segmento** (PK, UUID)
- **nome_segmento** (VARCHAR 100) - Ex: "Ensino Fundamental", "Educação Infantil"
- **descricao_segmento** (TEXT) - Descrição detalhada
- **created_at**, **updated_at** (TIMESTAMP)

### 📅 Período de Lançamento (NOVO)
- **id_periodo** (PK, UUID)
- **nome_periodo** (VARCHAR 100) - Ex: "1º Semestre 2023"
- **data_inicio** (DATE)
- **data_fim** (DATE)
- **ativo** (BOOLEAN) - Apenas um período pode estar ativo
- **created_at**, **updated_at** (TIMESTAMP)

### 🔗 Escola-Segmento (Relacionamento N:N)
- **id_escola** (FK, UUID)
- **id_segmento** (FK, UUID)
- **created_at** (TIMESTAMP)

### 🚚 Fornecedor
- **id_fornecedor** (PK, UUID)
- **nome_fornecedor** (VARCHAR 100)
- **cnpj_fornecedor** (VARCHAR 20)
- **whatsapp_fornecedor** (VARCHAR 20)
- **email_fornecedor** (VARCHAR 100)
- **senha_fornecedor** (VARCHAR 100)

### 📦 Item
- **id_item** (PK, UUID)
- **nome_item** (VARCHAR 100)
- **unidade_medida** (VARCHAR 20)
- **sazonalidade** (VARCHAR 50)
- **validade** (DATE)
- **observacao** (TEXT)
- **id_fornecedor** (FK, UUID)
- **preco_item** (NUMERIC 10,2)

### 🏪 Estoque (Modelo Normalizado) ⭐
- **id_estoque** (PK, UUID)
- **id_escola** (FK, UUID) - Referência à escola
- **id_item** (FK, UUID) - Referência ao item/produto
- **id_segmento** (FK, UUID) - Referência ao segmento educacional
- **id_periodo** (FK, UUID) - Referência ao período de lançamento
- **quantidade_item** (INTEGER) - Quantidade atual em estoque
- **numero_ideal** (INTEGER) - Quantidade ideal definida
- **validade** (DATE) - Data de validade específica do lote
- **observacao** (TEXT) - Observações específicas
- **created_at**, **updated_at** (TIMESTAMP)

*Chave única: escola + item + segmento + período*

### 📋 Pedido
- **id_pedido** (PK, UUID)
- **quantidade_pedido** (INTEGER)
- **id_item** (FK, UUID) - Referência ao item
- **id_escola** (FK, UUID) - Referência à escola
- **data_pedido** (DATE) - Data de criação do pedido
- **status_pedido** (VARCHAR 50) - pendente, aprovado, entregue, etc.
- **observacoes** (TEXT) - Observações do pedido
- **data_entrega_desejada** (DATE) - Data desejada para entrega
- **valor_total** (NUMERIC 10,2) - Valor total calculado
- **created_at**, **updated_at** (TIMESTAMP)

### 👤 Usuario
- **id_usuario** (PK, UUID)
- **nome_usuario** (VARCHAR 100)
- **sobrenome_usuario** (VARCHAR 100)
- **id_escola** (FK, UUID) - Pode ser NULL para admin/nutricionista
- **email_usuario** (VARCHAR 100) - Email único
- **senha_usuario** (VARCHAR 100) - Hash da senha
- **tipo_usuario** (VARCHAR 20) - admin, escola, nutricionista, fornecedor
- **created_at**, **updated_at** (TIMESTAMP)

## Estrutura do Projeto

### Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript
- **TypeScript**: Superset tipado de JavaScript para desenvolvimento mais seguro
- **Express**: Framework web para Node.js
## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript para backend
- **TypeScript**: Superset tipado do JavaScript para maior segurança
- **Express**: Framework web minimalista e flexível
- **Knex.js**: Query builder SQL avançado com suporte a migrations
- **PostgreSQL**: Banco de dados relacional robusto (modelo normalizado)
- **JWT**: JSON Web Tokens para autenticação stateless
- **bcrypt**: Biblioteca para criptografia segura de senhas
- **CORS**: Middleware para controle de acesso entre domínios
- **dotenv**: Carregamento seguro de variáveis de ambiente

## 📁 Estrutura do Projeto

```
merenda-back/
├── migrations/                 # 🔄 Scripts de migração do banco
│   ├── 001_create_segmento_table.sql
│   ├── 002_create_periodo_lancamento_table.sql
│   ├── 003_create_escola_segmento_table.sql
│   ├── 004_normalize_estoque_table.sql
│   └── ... (11 migrations no total)
├── scripts/                   # 🔧 Scripts utilitários
│   ├── run-migrations.js
│   ├── run-migrations.sh
│   └── run-migrations.ps1
├── src/
│   ├── controller/           # 🎮 Controllers das rotas
│   │   ├── escola.controller.ts      # ✅ Refatorado completo
│   │   ├── segmento.controller.ts    # 🆕 Novo (gestão de segmentos)
│   │   ├── periodo-lancamento.controller.ts # 🆕 Novo (períodos)
│   │   ├── estoque.controller.ts     # ✅ Atualizado (modelo normalizado)
│   │   ├── pedido.controller.ts      # ✅ Aprimorado (automações)
│   │   ├── fornecedor.controller.ts  # ✅ Autenticação e gestão
│   │   ├── item.controller.ts        # ✅ Gestão completa
│   │   ├── usuario.controller.ts     # ✅ Permissões granulares
│   │   └── index.ts                  # 📋 Exports centralizados
│   ├── model/               # 📊 Models para banco de dados
│   │   ├── escola.model.ts           # ✅ Refatorado (com segmentos)
│   │   ├── escola-segmento.model.ts  # 🆕 Novo (relacionamento N:N)
│   │   ├── segmento.model.ts         # 🆕 Novo
│   │   ├── periodo-lancamento.model.ts # 🆕 Novo
│   │   ├── estoque.model.ts          # ✅ Normalizado (4 FKs)
│   │   ├── pedido.model.ts           # ✅ Aprimorado
│   │   ├── fornecedor.model.ts       # ✅ Gestão completa
│   │   ├── item.model.ts             # ✅ Relacionamentos
│   │   ├── usuario.model.ts          # ✅ Tipos e permissões
│   │   └── index.ts                  # 📋 Exports centralizados
│   ├── routes/              # 🛣️ Rotas da API
│   │   ├── escola.routes.ts          # ✅ Novas rotas + dashboard
│   │   ├── segmento.routes.ts        # 🆕 CRUD completo
│   │   ├── periodo-lancamento.routes.ts # 🆕 Gestão de períodos
│   │   ├── estoque.routes.ts         # ✅ Rotas normalizadas + alertas
│   │   ├── pedido.routes.ts          # ✅ Automações + relatórios
│   │   ├── fornecedor.routes.ts      # ✅ Autenticação + gestão
│   │   ├── item.routes.ts            # ✅ CRUD + relacionamentos
│   │   ├── usuario.routes.ts         # ✅ Gestão + permissões
│   │   └── index.ts                  # 📋 Exports centralizados
│   ├── services/            # ⚙️ Lógica de negócio
│   │   ├── escola.service.ts         # ✅ Refatorado completo
│   │   ├── segmento.service.ts       # 🆕 Novo
│   │   ├── periodo-lancamento.service.ts # 🆕 Novo
│   │   ├── estoque.service.ts        # ✅ Modelo normalizado + alertas
│   │   ├── pedido.service.ts         # ✅ Automações + relatórios
│   │   ├── fornecedor.service.ts     # ✅ Gestão completa
│   │   ├── item.service.ts           # ✅ Lógica de negócio
│   │   ├── usuario.service.ts        # ✅ Autenticação + permissões
│   │   └── index.ts                  # 📋 Exports centralizados
│   ├── types/               # 📝 Tipos TypeScript
│   │   └── index.ts                  # ✅ Interfaces refatoradas
│   ├── utils/               # 🔧 Utilitários
│   │   ├── index.ts                  # JWT, criptografia, validações
│   │   └── logger.ts                 # Sistema de logs
│   ├── middleware/          # 🔒 Middlewares
│   │   └── auth.middleware.ts        # Autenticação e autorização
│   ├── connection.ts        # 🔌 Conexão com banco
│   └── index.ts            # 🚀 Ponto de entrada
│   ├── docs/                   # 📖 Documentação completa
│   │   ├── api/                # 📋 Documentação da API
│   │   │   ├── README.md               # 🏠 Índice principal atualizado
│   │   │   ├── escolas.md              # 🏫 Rotas de escolas (completo)
│   │   │   ├── segmentos.md            # 🏷️ Rotas de segmentos (novo)
│   │   │   ├── periodos.md             # 📅 Rotas de períodos (novo)
│   │   │   ├── estoque.md              # 📦 Rotas de estoque (normalizado)
│   │   │   ├── pedidos.md              # 📋 Rotas de pedidos (completo)
│   │   │   ├── fornecedores.md         # 🚚 Rotas de fornecedores
│   │   │   ├── itens.md                # 📦 Rotas de itens
│   │   │   ├── usuarios.md             # 👤 Rotas de usuários
│   │   │   ├── autenticacao.md         # 🔐 Autenticação e JWT
│   │   │   ├── importacao.md           # 📊 Importação em massa
│   │   │   ├── rotas_teste.md          # 🧪 Rotas de desenvolvimento
│   │   │   └── troubleshooting.md      # 🔧 Solução de problemas
│   │   ├── gestao_valores_ideais.md    # 📈 Gestão de valores ideais
│   │   └── database-migration.md       # 🔄 Histórico de migrations
├── .env                    # 🔐 Variáveis de ambiente
├── package.json           # 📦 Dependências e scripts
├── tsconfig.json         # ⚙️ Configuração TypeScript
└── MIGRATIONS.md         # 📋 Histórico de migrations
```

## 🔧 Models Implementados

O sistema possui um conjunto completo de models que implementam toda a lógica de acesso a dados, validações e relacionamentos entre entidades.

### ✅ Models Principais (Refatorados e Novos)

#### 1. **EscolaModel.ts** (✅ Refatorado Completo)
- `buscarPorId()` - Busca escola com segmentos associados
- `buscarPorEmail()` - Busca por email único
- `listarTodas()` - Lista com filtros avançados (segmento, nome, endereço)
- `criar()` - Cria nova escola com validações
- `atualizar()` - Atualiza dados da escola
- `excluir()` - Remove escola (com validações de integridade)
- `filtrarEscolas()` - 🆕 Filtros avançados por múltiplos critérios
- `obterDashboard()` - 🆕 Métricas consolidadas da escola

#### 2. **SegmentoModel.ts** (🆕 Novo)
- `listarTodos()` - Lista todos os segmentos educacionais
- `buscarPorId()` - Busca segmento por ID
- `buscarPorNome()` - Busca por nome (parcial)
- `criar()` - Cria novo segmento
- `atualizar()` - Atualiza dados do segmento
- `excluir()` - Remove segmento (com validações)
- `listarEscolasPorSegmento()` - Lista escolas associadas
- `obterEstatisticas()` - 🆕 Estatísticas por segmento

#### 3. **PeriodoLancamentoModel.ts** (🆕 Novo)
- `listarTodos()` - Lista períodos (com filtro ativo)
- `buscarAtual()` - Busca período ativo no momento
- `buscarPorId()` - Busca período por ID
- `buscarPorNome()` - Busca por nome
- `buscarPorIntervalo()` - Busca por intervalo de datas
- `criar()` - Cria novo período
- `atualizar()` - Atualiza período
- `excluir()` - Remove período
- `ativar()` - Ativa período (desativa outros automaticamente)
- `desativar()` - Desativa período

#### 4. **EscolaSegmentoModel.ts** (🆕 Novo - Relacionamento N:N)
- `associar()` - Associa escola a segmento
- `desassociar()` - Remove associação
- `listarSegmentosPorEscola()` - Lista segmentos da escola
- `listarEscolasPorSegmento()` - Lista escolas do segmento
- `verificarAssociacao()` - Verifica se existe associação

#### 5. **EstoqueModel.ts** (✅ Completamente Normalizado)
- `listar()` - Lista com filtros por escola/segmento/período
- `buscarPorId()` - Busca entrada específica do estoque
- `criar()` - Cria nova entrada (validando chave única)
- `atualizar()` - Atualiza quantidade/ideal/validade
- `excluir()` - Remove entrada do estoque
- `buscarPorEscolaSegmento()` - Lista por escola e segmento
- `buscarAlertasEstoque()` - 🆕 Itens com estoque baixo
- `buscarProximosVencimento()` - 🆕 Itens próximos ao vencimento
- `obterEstatisticas()` - 🆕 Métricas consolidadas
- `atualizarValoresIdeais()` - 🆕 Atualização em lote

#### 6. **PedidoModel.ts** (✅ Aprimorado)
- `listar()` - Lista com filtros avançados
- `buscarPorId()` - Busca pedido específico
- `criar()` - Cria novo pedido
- `atualizar()` - Atualiza pedido (quantidade, status, etc.)
- `excluir()` - Remove pedido
- `buscarPorEscola()` - Lista pedidos da escola
- `buscarPorFornecedor()` - Lista pedidos do fornecedor
- `buscarPorPeriodo()` - Lista por intervalo de datas
- `atualizarStatus()` - 🆕 Atualização de status
- `gerarAutomatico()` - 🆕 Pedidos automáticos por estoque baixo
- `obterRelatorios()` - 🆕 Relatórios avançados

### 📊 Models de Apoio

#### 7. **FornecedorModel.ts** (✅ Gestão Completa)
- `listarTodos()` - Lista fornecedores
- `buscarPorId()` - Busca por ID
- `buscarPorEmail()` - Busca por email
- `buscarPorCnpj()` - Busca por CNPJ
- `criar()` - Cria novo fornecedor
- `atualizar()` - Atualiza dados
- `excluir()` - Remove fornecedor
- `autenticar()` - 🆕 Autenticação de fornecedor

#### 8. **ItemModel.ts** (✅ Relacionamentos Completos)
- `listarTodos()` - Lista itens
- `buscarPorId()` - Busca por ID
- `buscarPorFornecedor()` - Lista itens do fornecedor
- `buscarPorSazonalidade()` - Filtra por sazonalidade
- `criar()` - Cria novo item
- `atualizar()` - Atualiza dados
- `excluir()` - Remove item
- `buscarComEstoque()` - 🆕 Itens com informações de estoque

#### 9. **UsuarioModel.ts** (✅ Permissões Granulares)
- `listarTodos()` - Lista usuários
- `buscarPorId()` - Busca por ID
- `buscarPorEmail()` - Busca por email
- `buscarPorEscola()` - Lista usuários da escola
- `criar()` - Cria novo usuário
- `atualizar()` - Atualiza dados
- `excluir()` - Remove usuário
- `alterarSenha()` - 🆕 Alteração segura de senha
- `verificarPermissoes()` - 🆕 Validação de permissões

## 🔧 Utilitários e Funcionalidades

### 🔐 Sistema de Autenticação e Segurança
- **JWT**: Geração e verificação de tokens de autenticação com expiração
- **Criptografia**: Funções seguras para hash e comparação de senhas (bcrypt)
- **Permissões**: Sistema granular de verificação por tipo de usuário
- **Middleware**: Proteção automática de rotas baseada em permissões

### 📊 Sistema de Métricas e Alertas
- **Dashboard**: Métricas consolidadas em tempo real por escola
- **Alertas Inteligentes**: Notificações automáticas para estoque baixo e validade próxima
- **Relatórios**: Geração de relatórios avançados por período, escola, segmento
- **Estatísticas**: Análises comparativas e tendências de consumo

### 📥 Importação e Automação
- **Importação em Massa**: Suporte para CSV e JSON com validação avançada
- **Pedidos Automáticos**: Geração automática baseada em regras de estoque
- **Processamento em Lote**: Atualização simultânea de múltiplos registros
- **Validação**: Sistema robusto de validação de dados importados

### 🔧 Ferramentas de Desenvolvimento
- **Formatação**: Funções para formatação de datas, valores e textos
- **Validação**: Validadores para email, CNPJ, CPF e outros formatos
- **UUID**: Geração de identificadores únicos para todas as entidades
- **Logs**: Sistema completo de logging para auditoria e debugging

## 📝 Tipos e Interfaces TypeScript

O sistema utiliza TypeScript com interfaces e tipos rigorosamente definidos para todas as entidades, garantindo:

✅ **Tipagem Forte**: Prevenção de erros em tempo de compilação  
✅ **Intellisense**: Melhor experiência de desenvolvimento  
✅ **Documentação**: Tipos servem como documentação viva  
✅ **Refatoração Segura**: Mudanças propagadas automaticamente  

### Interfaces Principais
- `Escola`, `EscolaComSegmentos` - Gestão de escolas e relacionamentos
- `Segmento` - Segmentos educacionais
- `PeriodoLancamento` - Controle temporal
- `Estoque`, `EstoqueCompleto` - Estoque normalizado com dados relacionados
- `Pedido`, `ResumoPedido` - Gestão de pedidos e relatórios
- `Usuario`, `RespostaToken` - Autenticação e perfis
- `FiltroEstoque`, `FiltrosEscola` - Filtros tipados para consultas

## 📦 Dependências e Tecnologias

### Dependências Principais
```json
{
  "express": "^4.18.x",          // Framework web
  "typescript": "^5.x",          // Linguagem tipada
  "knex": "^2.x",               // Query builder
  "pg": "^8.x",                 // Driver PostgreSQL
  "jsonwebtoken": "^9.x",       // JWT para autenticação
  "bcrypt": "^5.x",             // Criptografia
  "cors": "^2.x",               // CORS middleware
  "dotenv": "^16.x"             // Variáveis ambiente
}
```

### Dependências de Desenvolvimento
```json
{
  "@types/node": "^20.x",       // Tipos Node.js
  "@types/express": "^4.x",     // Tipos Express
  "@types/bcrypt": "^5.x",      // Tipos bcrypt
  "@types/jsonwebtoken": "^9.x", // Tipos JWT
  "nodemon": "^3.x",           // Hot reload
  "ts-node": "^10.x"           // Execução TypeScript
}
```

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos
- **Node.js** 18+ 
- **PostgreSQL** 13+
- **npm** ou **yarn**

### 🔧 Configuração Inicial

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd merenda-back
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   # Banco de Dados
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=merenda_smart_flow
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   
   # Servidor
   PORT=3001
   
   # JWT
   JWT_SECRET=sua_chave_secreta_super_segura
   JWT_EXPIRES_IN=24h
   
   # Ambiente
   NODE_ENV=development
   ```

4. **Prepare o banco de dados**
   
   Execute as migrations para criar as tabelas:
   ```bash
   # Windows (PowerShell)
   npm run migrate:windows
   
   # Linux/Mac (Bash)
   npm run migrate:linux
   
   # Ou manualmente com Node.js
   node scripts/run-migrations.js
   ```

5. **Execute o projeto**
   ```bash
   # Desenvolvimento (com hot reload)
   npm run dev
   
   # Produção
   npm run build
   npm start
   ```

### 🌐 Acessando a API

Após iniciar o servidor, a API estará disponível em:
- **URL Base**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/health`
- **Documentação**: Consulte os arquivos em `docs/api/`

### 🔧 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Compila TypeScript para JavaScript
npm start            # Executa versão compilada
npm run migrate:windows   # Executa migrations (Windows)
npm run migrate:linux     # Executa migrations (Linux/Mac)
npm run test         # Executa testes (quando implementados)
```

## 📖 Documentação Completa da API

A documentação completa está organizada na pasta `docs/api/` com informações detalhadas sobre todas as funcionalidades:

### 🏠 Documentação Principal
- **[Visão Geral e Índice](./docs/api/README.md)** - Portal principal da documentação
- **[Guia de Migração](./docs/api/guia-migracao.md)** - Como migrar dados existentes

### 🔐 Autenticação e Usuários
- **[Autenticação](./docs/api/autenticacao.md)** - Login, JWT e permissões
- **[Usuários](./docs/api/usuarios.md)** - Gestão de usuários do sistema

### 🏫 Gestão Educacional  
- **[Escolas](./docs/api/escolas.md)** - CRUD completo + dashboard + métricas
- **[Segmentos](./docs/api/segmentos.md)** ⭐ *NOVO* - Gestão de segmentos educacionais
- **[Períodos](./docs/api/periodos.md)** ⭐ *NOVO* - Controle de períodos letivos

### 📦 Gestão de Estoque e Pedidos
- **[Estoque](./docs/api/estoque.md)** ⭐ *NORMALIZADO* - Modelo escola+segmento+período
- **[Pedidos](./docs/api/pedidos.md)** - Gestão completa + automações
- **[Itens](./docs/api/itens.md)** - Produtos e alimentos
- **[Fornecedores](./docs/api/fornecedores.md)** - Gestão de fornecedores

### 🛠️ Ferramentas e Utilitários  
- **[Importação de Dados](./docs/api/importacao.md)** - Importação em massa
- **[Rotas de Teste](./docs/api/rotas_teste.md)** - Desenvolvimento e debugging
- **[Troubleshooting](./docs/api/troubleshooting.md)** - Solução de problemas

### 📊 Documentação Especializada
- **[Gestão de Valores Ideais](./docs/gestao_valores_ideais.md)** - Como configurar estoques ideais
- **[Database Migration](./docs/database-migration.md)** - Detalhes técnicos das migrations

## 🎯 Próximos Passos e Roadmap

### ✅ Concluído (Sistema Operacional)
- ✅ Modelo de dados normalizado com migrations
- ✅ Services completos para todas as entidades
- ✅ Controllers com lógica de negócio robusta
- ✅ Rotas RESTful bem documentadas
- ✅ Sistema de autenticação JWT
- ✅ Documentação completa da API
- ✅ Sistema de importação em massa
- ✅ Dashboard e métricas em tempo real
- ✅ Alertas inteligentes de estoque

### 🔄 Em Desenvolvimento
- 🔄 Testes unitários e de integração
- 🔄 Logs avançados e monitoramento
- 🔄 Cache Redis para performance
- 🔄 Rate limiting e proteção DDoS

### 📋 Próximas Funcionalidades
- 📋 Notificações por email/SMS
- 📋 Relatórios PDF automatizados
- 📋 API GraphQL complementar
- 📋 Webhooks para integrações
- 📋 Backup automático de dados
- 📋 Documentação Swagger/OpenAPI

## 🤝 Contribuição

Este projeto segue as melhores práticas de desenvolvimento backend com TypeScript e está preparado para escalabilidade e manutenibilidade. A arquitetura modular permite fácil extensão e modificação de funcionalidades.

## 📞 Suporte

Para dúvidas técnicas ou sugestões:
- 📖 Consulte a [documentação de troubleshooting](./docs/api/troubleshooting.md)
- 🔧 Verifique os [logs de migração](./MIGRATIONS.md)
- 📧 Entre em contato com a equipe de desenvolvimento

---

**🍎 Merenda Smart Flow** - Sistema moderno e completo para gestão inteligente de merenda escolar.
