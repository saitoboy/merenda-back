# Documentação para Desenvolvedor - Gestão de Valores Ideais

## Visão Geral

Este documento explica como funciona o sistema de gestão de valores ideais para o estoque de merenda escolar. O objetivo é permitir que a nutricionista defina as quantidades ideais de cada item para cada escola, facilitando a tomada de decisão sobre reposição de estoque.

## Arquitetura da Implementação

### 1. Model (`estoque.model.ts`)

O model é responsável pelo acesso direto ao banco de dados e implementa a função:

```typescript
definirIdeaisEmLote(ideais: Array<{id_escola: string, id_item: string, numero_ideal: number}>)
```

Essa função:
- Utiliza transactions do Knex para garantir atomicidade
- Para cada item, verifica se já existe um registro no estoque
- Se existir, atualiza apenas o campo `numero_ideal`
- Se não existir, cria um novo registro com `quantidade_item = 0`
- Retorna um array detalhado com o resultado de cada operação

### 2. Service (`estoque.service.ts`)

O service implementa a lógica de negócio com as funções:

```typescript
definirValoresIdeaisEmLote(ideais: Array<{id_escola: string, id_item: string, numero_ideal: number}>)
definirIdeaisPorEscola(id_escola: string, itens_ideais: Array<{id_item: string, numero_ideal: number}>)
```

Estas funções:
- Validam a existência de escolas e itens
- Validam os valores ideais fornecidos
- Chamam o model para realizar as operações no banco
- Fornecem feedback detalhado sobre as operações

### 3. Controller (`estoque.controller.ts`)

O controller expõe as interfaces da API com as funções:

```typescript
definirValoresIdeaisEmLote(req: Request, res: Response)
definirIdeaisPorEscola(req: Request, res: Response)
```

Estas funções:
- Validam o formato dos dados recebidos na requisição
- Chamam os serviços apropriados
- Formatam as respostas para o cliente
- Tratam erros de forma adequada

### 4. Routes (`estoque.routes.ts`)

As rotas definem os endpoints disponíveis:

```typescript
POST /estoque/ideais
POST /estoque/ideais/:id_escola
```

E configuram middlewares para:
- Autenticação (JWT)
- Autorização (Nutricionista/Admin)

## Fluxo de Execução

1. O cliente (frontend) envia um POST para `/estoque/ideais` ou `/estoque/ideais/:id_escola`
2. O middleware de autenticação valida o token JWT
3. O middleware de autorização verifica se o usuário é nutricionista ou admin
4. O controller valida o formato dos dados
5. O service valida a existência de escolas e itens
6. O model executa as operações no banco de dados
7. A resposta segue o caminho inverso até o cliente

## Pontos Importantes a Considerar

### Transactions

Utilizamos transactions para garantir que todas as operações sejam bem-sucedidas ou nenhuma seja aplicada. Isso é crucial para manter a integridade dos dados:

```typescript
return await connection.transaction(async (trx) => {
  // Operações no banco
});
```

### Validações em Camadas

As validações são feitas em múltiplas camadas:
- **Controller**: Valida formato dos dados
- **Service**: Valida regras de negócio
- **Model**: Executa as operações no banco

### Tratamento de Exceções

Cada camada trata exceções apropriadamente:
- **Model**: Captura erros do banco
- **Service**: Adiciona contexto de negócio aos erros
- **Controller**: Formata os erros para o cliente

## Exemplos de Uso

### Definir valores ideais para múltiplas escolas

```javascript
// Requisição para /estoque/ideais
const response = await fetch('/estoque/ideais', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu-token-jwt'
  },
  body: JSON.stringify({
    ideais: [
      { id_escola: "uuid1", id_item: "uuid2", numero_ideal: 10 },
      { id_escola: "uuid1", id_item: "uuid3", numero_ideal: 5 }
    ]
  })
});
```

### Definir valores ideais para uma escola específica

```javascript
// Requisição para /estoque/ideais/:id_escola
const response = await fetch('/estoque/ideais/uuid-da-escola', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu-token-jwt'
  },
  body: JSON.stringify({
    itens_ideais: [
      { id_item: "uuid2", numero_ideal: 10 },
      { id_item: "uuid3", numero_ideal: 5 }
    ]
  })
});
```

## Possíveis Melhorias Futuras

1. **Importação via CSV/Excel**: Adicionar endpoint para receber arquivo Excel/CSV diretamente
2. **Validação em lote mais eficiente**: Otimizar as consultas de validação para grandes lotes
3. **Histórico de alterações**: Registrar quem fez cada alteração nos valores ideais
4. **Valores ideais sazonais**: Permitir definir valores ideais diferentes por época do ano

## Dicas de Debugging

- **Logs**: Os logs detalhados ajudam a identificar onde um problema ocorre
- **Transações**: Se houver erro em uma transação, nada será modificado no banco
- **Middleware de Autorização**: Certifique-se de estar usando um token de nutricionista ou admin

## Notas Adicionais

Este sistema foi projetado para dar flexibilidade à nutricionista na gestão dos valores ideais de estoque, permitindo tanto atualizações individuais quanto em lote. A interface espera formatos JSON específicos, então é importante verificar a documentação ao desenvolver frontends que irão interagir com estas APIs.

Em caso de dúvidas adicionais, consulte o código-fonte comentado ou entre em contato com o desenvolvedor sênior responsável.
