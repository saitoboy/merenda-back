# Fornecedores

Esta seção contém as rotas relacionadas à gestão de fornecedores no sistema Merenda Smart Flow.

## Listar Fornecedores

Retorna todos os fornecedores cadastrados no sistema.

**URL**: `/fornecedores`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Fornecedores listados com sucesso",
  "dados": [
    {
      "id_fornecedor": "uuid-fornecedor-1",
      "nome_fornecedor": "Alimentos Naturais LTDA",
      "cnpj_fornecedor": "12.345.678/0001-90",
      "whatsapp_fornecedor": "(11) 98765-4321",
      "email_fornecedor": "contato@alimentosnaturais.com.br"
    },
    {
      "id_fornecedor": "uuid-fornecedor-2",
      "nome_fornecedor": "Hortifruti Regional",
      "cnpj_fornecedor": "98.765.432/0001-10",
      "whatsapp_fornecedor": "(11) 91234-5678",
      "email_fornecedor": "vendas@hortifrutiregional.com.br"
    }
  ]
}
```

---

## Buscar Fornecedor

Retorna os dados de um fornecedor específico.

**URL**: `/fornecedores/:id_fornecedor`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Fornecedor encontrado com sucesso",
  "dados": {
    "id_fornecedor": "uuid-fornecedor-1",
    "nome_fornecedor": "Alimentos Naturais LTDA",
    "cnpj_fornecedor": "12.345.678/0001-90",
    "whatsapp_fornecedor": "(11) 98765-4321",
    "email_fornecedor": "contato@alimentosnaturais.com.br"
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Fornecedor não encontrado"
}
```

---

## Criar Fornecedor

Adiciona um novo fornecedor ao sistema.

**URL**: `/fornecedores`

**Método**: `POST`

**Autenticação**: Requerida (Admin, Nutricionista)

### Corpo da Requisição

```json
{
  "nome_fornecedor": "Laticínios Sul Mineiro",
  "cnpj_fornecedor": "45.678.901/0001-23",
  "whatsapp_fornecedor": "(35) 98765-4321",
  "email_fornecedor": "vendas@laticiniosul.com.br",
  "senha_fornecedor": "senha123"
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Fornecedor criado com sucesso",
  "dados": {
    "id_fornecedor": "uuid-novo-fornecedor",
    "nome_fornecedor": "Laticínios Sul Mineiro",
    "cnpj_fornecedor": "45.678.901/0001-23",
    "whatsapp_fornecedor": "(35) 98765-4321",
    "email_fornecedor": "vendas@laticiniosul.com.br"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Nome, CNPJ, WhatsApp, email e senha são obrigatórios"
}
```

**Código**: `409 CONFLICT`

```json
{
  "status": "erro",
  "mensagem": "Já existe um fornecedor com este CNPJ"
}
```

```json
{
  "status": "erro",
  "mensagem": "Já existe um fornecedor com este email"
}
```

---

## Atualizar Fornecedor

Atualiza os dados de um fornecedor existente.

**URL**: `/fornecedores/:id_fornecedor`

**Método**: `PUT`

**Autenticação**: Requerida (Admin, Nutricionista, Fornecedor correspondente)

### Corpo da Requisição

```json
{
  "nome_fornecedor": "Laticínios Sul Mineiro - Matriz",
  "whatsapp_fornecedor": "(35) 98888-7777",
  "email_fornecedor": "comercial@laticiniosul.com.br"
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Fornecedor atualizado com sucesso",
  "dados": {
    "id_fornecedor": "uuid-fornecedor",
    "nome_fornecedor": "Laticínios Sul Mineiro - Matriz",
    "cnpj_fornecedor": "45.678.901/0001-23",
    "whatsapp_fornecedor": "(35) 98888-7777",
    "email_fornecedor": "comercial@laticiniosul.com.br"
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Fornecedor não encontrado"
}
```

**Código**: `409 CONFLICT`

```json
{
  "status": "erro",
  "mensagem": "Já existe outro fornecedor com este email"
}
```

---

## Excluir Fornecedor

Remove um fornecedor do sistema.

**URL**: `/fornecedores/:id_fornecedor`

**Método**: `DELETE`

**Autenticação**: Requerida (Admin)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Fornecedor excluído com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Fornecedor não encontrado"
}
```

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Não é possível excluir este fornecedor pois existem itens associados a ele"
}
```

---

## Importar Fornecedores

Importa múltiplos fornecedores a partir de um arquivo ou array JSON.

**URL**: `/fornecedores/importar`

**Método**: `POST`

**Autenticação**: Requerida (Admin)

### Corpo da Requisição

```json
[
  {
    "nome_fornecedor": "Orgânicos do Vale",
    "cnpj_fornecedor": "11.222.333/0001-44",
    "whatsapp_fornecedor": "(12) 98765-4321",
    "email_fornecedor": "contato@organicosdovale.com.br",
    "senha_fornecedor": "senha123"
  },
  {
    "nome_fornecedor": "Cereais e Grãos LTDA",
    "cnpj_fornecedor": "55.666.777/0001-88",
    "whatsapp_fornecedor": "(13) 91234-5678",
    "email_fornecedor": "vendas@cereaisgraos.com.br",
    "senha_fornecedor": "senha456"
  }
]
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Importação concluída: 2 fornecedores importados com sucesso, 0 falhas",
  "dados": {
    "total": 2,
    "sucesso": 2,
    "falhas": 0,
    "resultados": [
      {
        "indice": 0,
        "id": "uuid-fornecedor-1",
        "nome": "Orgânicos do Vale"
      },
      {
        "indice": 1,
        "id": "uuid-fornecedor-2",
        "nome": "Cereais e Grãos LTDA"
      }
    ],
    "erros": []
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato inválido. Esperado um array de fornecedores."
}
```

```json
{
  "status": "erro",
  "mensagem": "Importação concluída: 1 fornecedores importados com sucesso, 1 falhas",
  "dados": {
    "total": 2,
    "sucesso": 1,
    "falhas": 1,
    "resultados": [
      {
        "indice": 0,
        "id": "uuid-fornecedor-1",
        "nome": "Orgânicos do Vale"
      }
    ],
    "erros": [
      {
        "indice": 1,
        "erro": "Já existe um fornecedor com este CNPJ"
      }
    ]
  }
}
```

## Notas de Implementação

- O CNPJ do fornecedor deve ser único no sistema
- O email do fornecedor também deve ser único
- A senha do fornecedor é armazenada com criptografia bcrypt
- Ao excluir um fornecedor, o sistema verifica se existem itens associados a ele
- A importação em lote é processada em uma transação atômica
- Existe também uma rota de teste `/fornecedores/importar-teste` que não requer autenticação para facilitar testes durante o desenvolvimento
