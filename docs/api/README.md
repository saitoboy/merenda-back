# Documentação da API Merenda Smart Flow

## Visão Geral

Esta documentação contém todas as rotas disponíveis na API do sistema Merenda Smart Flow, incluindo exemplos de requisição e resposta em JSON.

## Índice

1. [Autenticação](./autenticacao.md)
   - Login
   - Registro
   - Verificação de Token

2. [Escolas](./escolas.md)
   - Listar Escolas
   - Buscar Escola
   - Criar Escola
   - Atualizar Escola
   - Excluir Escola
   - Importar Escolas

3. [Estoque](./estoque.md)
   - Listar Estoque por Escola
   - Itens Abaixo do Ideal
   - Métricas de Estoque
   - Atualizar Quantidade
   - Atualizar Número Ideal
   - Definir Valores Ideais em Lote
   - Adicionar Item ao Estoque
   - Remover Item do Estoque

4. [Fornecedores](./fornecedores.md)
   - Listar Fornecedores
   - Buscar Fornecedor
   - Criar Fornecedor
   - Atualizar Fornecedor
   - Excluir Fornecedor
   - Importar Fornecedores

5. [Itens](./itens.md)
   - Listar Itens
   - Buscar Item
   - Buscar Itens por Fornecedor
   - Criar Item
   - Atualizar Item
   - Excluir Item
   - Importar Itens
   - Itens Próximos da Validade

6. [Pedidos](./pedidos.md)
   - Listar Pedidos
   - Buscar Pedido
   - Buscar Pedidos por Escola
   - Criar Pedido
   - Atualizar Pedido
   - Excluir Pedido
   - Pedidos por Período
   - Métricas de Pedidos

7. [Usuários](./usuarios.md)
   - Listar Usuários
   - Buscar Usuário
   - Buscar Usuários por Escola
   - Criar Usuário
   - Atualizar Usuário
   - Excluir Usuário

## Convenções

### Formato de Resposta

Todas as respostas da API seguem o seguinte formato:

**Sucesso:**

```json
{
  "status": "sucesso",
  "mensagem": "Mensagem descritiva do sucesso",
  "dados": { ... }
}
```

**Erro:**

```json
{
  "status": "erro",
  "mensagem": "Mensagem descritiva do erro"
}
```

### Autenticação

A maioria das rotas requer autenticação por token JWT. O token deve ser enviado no cabeçalho da requisição:

```
Authorization: Bearer seu-token-jwt
```

### Níveis de Acesso

O sistema possui diferentes níveis de acesso:

- **Admin**: Acesso total ao sistema
- **Nutricionista**: Gerencia cardápio, define valores ideais, visualiza escolas
- **Gestor Escolar**: Gerencia estoque e pedidos de sua escola
- **Fornecedor**: Visualiza pedidos relacionados aos seus produtos

### Códigos de Status HTTP

- **200**: Sucesso (GET, PUT)
- **201**: Criado com sucesso (POST)
- **400**: Erro no cliente (dados inválidos)
- **401**: Não autenticado (token ausente ou inválido)
- **403**: Não autorizado (sem permissão)
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## Informações Adicionais

Para instruções sobre como executar e configurar o servidor da API, consulte o [README principal](../README.md) do projeto.

## Importação em Massa

Para informações detalhadas sobre como importar dados em massa (escolas, fornecedores, itens e valores ideais), consulte a [Documentação de Importação](./importacao.md).

## Rotas de Teste e Desenvolvimento

Para informações sobre rotas úteis durante o desenvolvimento e testes do sistema, consulte a [Documentação de Rotas de Teste](./rotas_teste.md).

## Solução de Problemas

Encontrou algum problema ao utilizar a API? Confira nossa [Documentação de Troubleshooting](./troubleshooting.md) com erros comuns e suas soluções.
