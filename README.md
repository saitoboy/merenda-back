# Merenda Smart Flow - Backend

Backend para o sistema de gestão de merenda escolar "Merenda Smart Flow".

## Sobre o Projeto

O Merenda Smart Flow é um sistema de gestão para merenda escolar que conecta escolas, nutricionistas e fornecedores em uma única plataforma integrada. O sistema permite o controle de estoque, geração de pedidos, gestão de fornecedores e relatórios de consumo de alimentos nas escolas.

Backend para o sistema de gestão de merenda escolar "Merenda Smart Flow".

## Sobre o Projeto

O Merenda Smart Flow é um sistema de gestão para merenda escolar que conecta escolas, nutricionistas e fornecedores em uma única plataforma integrada. O sistema permite o controle de estoque, geração de pedidos, gestão de fornecedores e relatórios de consumo de alimentos nas escolas.

## Estrutura do Banco de Dados

O sistema utiliza um banco de dados PostgreSQL com as seguintes tabelas:

### Escola
- **id_escola** (PK, UUID)
- **nome_escola** (VARCHAR 100)
- **endereco_escola** (VARCHAR 200)
- **email_escola** (VARCHAR 100)
- **segmento_escola** (VARCHAR 50)

### Fornecedor
- **id_fornecedor** (PK, UUID)
- **nome_fornecedor** (VARCHAR 100)
- **cnpj_fornecedor** (VARCHAR 20)
- **whatsapp_fornecedor** (VARCHAR 20)
- **email_fornecedor** (VARCHAR 100)
- **senha_fornecedor** (VARCHAR 100)

### Item
- **id_item** (PK, UUID)
- **nome_item** (VARCHAR 100)
- **unidade_medida** (VARCHAR 20)
- **sazonalidade** (VARCHAR 50)
- **validade** (DATE)
- **observacao** (TEXT)
- **id_fornecedor** (FK, UUID)
- **preco_item** (NUMERIC 10,2)

### Estoque
- **id_escola** (PK, FK, UUID)
- **id_item** (PK, FK, UUID)
- **quantidade_item** (INTEGER)
- **numero_ideal** (INTEGER)

### Pedido
- **id_pedido** (PK, UUID)
- **quantidade_pedido** (INTEGER)
- **id_item** (FK, UUID)
- **id_escola** (FK, UUID)
- **data_pedido** (DATE)

### Usuario
- **id_usuario** (PK, UUID)
- **nome_usuario** (VARCHAR 100)
- **sobrenome_usuario** (VARCHAR 100)
- **id_escola** (FK, UUID)
- **email_usuario** (VARCHAR 100)
- **senha_usuario** (VARCHAR 100)

## Estrutura do Projeto

### Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript
- **TypeScript**: Superset tipado de JavaScript para desenvolvimento mais seguro
- **Express**: Framework web para Node.js
- **Knex.js**: Query builder SQL para Node.js
- **PostgreSQL**: Banco de dados relacional
- **JWT**: JSON Web Tokens para autenticação
- **bcrypt**: Biblioteca para criptografia de senhas

### Organização de Arquivos

```
merenda-back/
├── src/
│   ├── business/       # Regras de negócio
│   ├── controller/     # Controladores para as rotas da API
│   ├── data/           # Dados iniciais (seeders, etc)
│   ├── model/          # Modelos para acesso ao banco de dados
│   │   ├── EscolaModel.ts
│   │   ├── EstoqueModel.ts
│   │   ├── FornecedorModel.ts
│   │   ├── ItemModel.ts
│   │   ├── PedidoModel.ts
│   │   ├── UsuarioModel.ts
│   ├── routes/         # Rotas da API
│   ├── services/       # Serviços (lógica de aplicação)
│   ├── types/          # Definições de tipos TypeScript
│   │   ├── index.ts    # Interfaces e tipos para todas as entidades
│   ├── utils/          # Utilitários e funções auxiliares
│   │   ├── index.ts    # Funções para JWT, criptografia, etc
│   ├── connection.ts   # Configuração de conexão com o banco de dados
│   ├── index.ts        # Ponto de entrada da aplicação
├── .env                # Variáveis de ambiente
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração do TypeScript
```

## Modelos Implementados

### 1. EscolaModel.ts
- buscarPorId
- buscarPorEmail
- criar
- atualizar
- excluir
- listarTodas
- buscarPorSegmento

### 2. EstoqueModel.ts
- buscar
- buscarPorEscola
- buscarDetalhesEstoquePorEscola
- buscarItensAbaixoIdeal
- criar
- atualizarQuantidade
- atualizarNumeroIdeal
- atualizar
- remover
- obterMetricasEstoque

### 3. FornecedorModel.ts
- buscarPorId
- buscarPorEmail
- buscarPorCnpj
- criar
- atualizar
- excluir
- listarTodos

### 4. ItemModel.ts
- buscarPorId
- buscarPorFornecedor
- buscarPorSazonalidade
- criar
- atualizar
- excluir
- listarTodos
- buscarProximosValidade

### 5. PedidoModel.ts
- buscarPorId
- buscarPorEscola
- buscarPorItem
- criar
- atualizar
- excluir
- listarTodos
- buscarPedidosDetalhados
- buscarPorPeriodo
- contarPedidosPorEscola

### 6. UsuarioModel.ts
- buscarPorId
- buscarPorEmail
- buscarPorEscola
- criar
- atualizar
- excluir
- listarTodos

## Utilitários Implementados

- **JWT**: Geração e verificação de tokens de autenticação
- **Criptografia**: Funções para hash e comparação de senhas
- **Permissões**: Verificação de permissões por tipo de usuário
- **Formatação**: Funções para formatação de datas
- **Estoque**: Cálculos para validação de estoque baixo e validade próxima
- **UUID**: Geração de identificadores únicos

## Tipos e Interfaces

Foram criados tipos e interfaces TypeScript para todas as entidades do sistema, garantindo tipagem forte e prevenção de erros em tempo de compilação.

## Dependências

- **knex**: Query builder SQL
- **pg**: Driver PostgreSQL para Node.js
- **express**: Framework web
- **jsonwebtoken**: Geração e verificação de JWTs
- **bcrypt**: Criptografia de senhas
- **dotenv**: Carregamento de variáveis de ambiente
- **cors**: Middleware para habilitar CORS

## Próximos Passos

1. Implementação dos controllers
2. Implementação das rotas da API
3. Implementação dos serviços
4. Implementação de middleware de autenticação
5. Documentação da API
6. Testes unitários e de integração

## Como Executar o Projeto

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute o projeto em modo de desenvolvimento: `npm run dev`

## Notas de Desenvolvimento

O sistema foi projetado para se integrar com o frontend Merenda Smart Flow, permitindo uma gestão completa do fluxo de merenda escolar, desde o controle de estoque até a geração de pedidos e relatórios.

## Documentação Completa da API

A documentação completa da API está disponível na pasta `docs/api` e contém informações detalhadas sobre todas as rotas disponíveis, exemplos de requisição e resposta, e guias para uso correto da API.

### Principais Seções da Documentação

- [Visão Geral e Índice](./docs/api/README.md)
- [Autenticação](./docs/api/autenticacao.md)
- [Escolas](./docs/api/escolas.md)
- [Estoque](./docs/api/estoque.md)
- [Fornecedores](./docs/api/fornecedores.md)
- [Itens](./docs/api/itens.md)
- [Pedidos](./docs/api/pedidos.md)
- [Usuários](./docs/api/usuarios.md)
- [Importação em Massa](./docs/api/importacao.md)
- [Rotas de Teste](./docs/api/rotas_teste.md)
- [Troubleshooting](./docs/api/troubleshooting.md)

## Documentação das Rotas para Gestão de Valores Ideais

### Visão Geral

A gestão de valores ideais permite que a nutricionista defina, para cada escola e item, qual a quantidade ideal que deve ser mantida em estoque. Isso facilita o processo de tomada de decisão sobre quais itens precisam ser repostos.

### Modelo de Dados

Na tabela `estoque`, o campo `numero_ideal` armazena essa informação para cada combinação de escola e item. Um estoque abaixo do ideal pode ser identificado quando `quantidade_item < numero_ideal`.

### Endpoints Disponíveis

#### 1. Definir Valores Ideais em Lote

```
POST /estoque/ideais
```

Permite definir valores ideais para múltiplas combinações de escola e item de uma vez.

**Permissões**: Nutricionista, Admin

**Corpo da requisição**:
```json
{
  "ideais": [
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-1",
      "numero_ideal": 6
    },
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-2",
      "numero_ideal": 3
    },
    {
      "id_escola": "uuid-escola-2",
      "id_item": "uuid-item-1",
      "numero_ideal": 10
    }
  ]
}
```

**Resposta (sucesso)**:
```json
{
  "status": "sucesso",
  "mensagem": "Valores ideais definidos com sucesso",
  "dados": {
    "mensagem": "3 valores ideais processados com sucesso",
    "detalhes": [
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-1",
        "numero_ideal": 6,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-2",
        "numero_ideal": 3,
        "acao": "criado"
      },
      {
        "id_escola": "uuid-escola-2",
        "id_item": "uuid-item-1",
        "numero_ideal": 10,
        "acao": "atualizado"
      }
    ]
  }
}
```

#### 2. Definir Valores Ideais para uma Escola Específica

```
POST /estoque/ideais/:id_escola
```

Permite definir valores ideais para vários itens de uma mesma escola.

**Permissões**: Nutricionista, Admin

**Corpo da requisição**:
```json
{
  "itens_ideais": [
    { "id_item": "uuid-item-1", "numero_ideal": 6 },
    { "id_item": "uuid-item-2", "numero_ideal": 3 },
    { "id_item": "uuid-item-3", "numero_ideal": 2 },
    { "id_item": "uuid-item-4", "numero_ideal": 10 }
  ]
}
```

**Resposta (sucesso)**:
```json
{
  "status": "sucesso",
  "mensagem": "Valores ideais definidos com sucesso para a escola uuid-escola-1",
  "dados": {
    "mensagem": "4 valores ideais processados com sucesso",
    "detalhes": [
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-1",
        "numero_ideal": 6,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-2",
        "numero_ideal": 3,
        "acao": "atualizado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-3",
        "numero_ideal": 2,
        "acao": "criado"
      },
      {
        "id_escola": "uuid-escola-1",
        "id_item": "uuid-item-4",
        "numero_ideal": 10,
        "acao": "criado"
      }
    ]
  }
}
```

#### 3. Atualizar um Valor Ideal Individual

```
PUT /estoque/numero-ideal/:id_escola/:id_item
```

Permite atualizar o valor ideal para uma combinação específica de escola e item.

**Permissões**: Nutricionista, Gestor Escolar, Admin

**Corpo da requisição**:
```json
{
  "numero_ideal": 5
}
```

**Resposta (sucesso)**:
```json
{
  "status": "sucesso",
  "mensagem": "Número ideal atualizado com sucesso",
  "dados": {
    "mensagem": "Número ideal atualizado com sucesso"
  }
}
```

#### 4. Consultar Itens Abaixo do Ideal

```
GET /estoque/escola/:id_escola/abaixo-ideal
```

Retorna todos os itens cujo estoque está abaixo do valor ideal definido.

**Resposta (sucesso)**:
```json
{
  "status": "sucesso",
  "mensagem": "Itens abaixo do ideal listados com sucesso",
  "dados": [
    {
      "id_escola": "uuid-escola-1",
      "id_item": "uuid-item-1",
      "quantidade_item": 2,
      "numero_ideal": 6,
      "nome_item": "Arroz Integral",
      "unidade_medida": "Kg",
      "validade": "2023-12-31",
      "preco_item": 7.50
    }
  ]
}
```

### Importando Valores Ideais de uma Planilha

Para facilitar a migração de dados, é possível converter uma planilha Excel para o formato JSON aceito pela API. O procedimento recomendado é:

1. Exportar a planilha como CSV
2. Converter o CSV para JSON usando uma ferramenta online ou script
3. Formatar o JSON conforme o modelo esperado pela API
4. Enviar os dados para o endpoint apropriado

### Comportamento do Sistema

- Se um item não existir previamente no estoque de uma escola, um novo registro será criado com `quantidade_item = 0` e o valor ideal especificado.
- Se um item já existir no estoque, apenas o valor ideal será atualizado.
- O sistema valida a existência de escolas e itens antes de criar ou atualizar registros.
- O processo é transacional: ou todos os registros são processados com sucesso, ou nenhum é alterado.
