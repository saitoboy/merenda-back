# Escolas

Esta seção contém as rotas relacionadas à gestão de escolas no sistema Merenda Smart Flow.

## Listar Escolas

Retorna todas as escolas cadastradas no sistema.

**URL**: `/escolas`

**Método**: `GET`

**Autenticação**: Opcional

### Parâmetros da Query

- `segmento` (opcional): Filtra escolas por segmento (ex: "fundamental", "infantil", "medio", "eja", "creche")

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escolas listadas com sucesso",
  "dados": [
    {
      "id_escola": "uuid-escola-1",
      "nome_escola": "Escola Municipal João da Silva",
      "endereco_escola": "Rua das Flores, 123",
      "email_escola": "joaodasilva@edu.exemplo.com",
      "segmento_escola": ["fundamental", "medio"]
    },
    {
      "id_escola": "uuid-escola-2",
      "nome_escola": "Creche Municipal Pequeno Príncipe",
      "endereco_escola": "Av. dos Sonhos, 456",
      "email_escola": "pequenoprincipe@edu.exemplo.com",
      "segmento_escola": ["infantil"]
    }
  ]
}
```

---

## Buscar Escola

Retorna os dados de uma escola específica.

**URL**: `/escolas/:id_escola`

**Método**: `GET`

**Autenticação**: Opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escola encontrada com sucesso",
  "dados": {
    "id_escola": "uuid-escola-1",
    "nome_escola": "Escola Municipal João da Silva",
    "endereco_escola": "Rua das Flores, 123",
    "email_escola": "joaodasilva@edu.exemplo.com",
    "segmento_escola": ["fundamental", "medio"]
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
}
```

---

## Criar Escola

Adiciona uma nova escola ao sistema.

**URL**: `/escolas`

**Método**: `POST`

**Autenticação**: Requerida (Admin, Nutricionista)

### Corpo da Requisição

```json
{
  "nome_escola": "Escola Municipal Monteiro Lobato",
  "endereco_escola": "Rua das Letras, 789",
  "email_escola": "monteirolobato@edu.exemplo.com",
  "segmento_escola": ["fundamental", "medio"]
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Escola criada com sucesso",
  "dados": {
    "id_escola": "uuid-nova-escola",
    "nome_escola": "Escola Municipal Monteiro Lobato",
    "endereco_escola": "Rua das Letras, 789",
    "email_escola": "monteirolobato@edu.exemplo.com",
    "segmento_escola": ["fundamental", "medio"]
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Nome, endereço, email e segmento são obrigatórios"
}
```

**Código**: `409 CONFLICT`

```json
{
  "status": "erro",
  "mensagem": "Já existe uma escola com este email"
}
```

---

## Atualizar Escola

Atualiza os dados de uma escola existente.

**URL**: `/escolas/:id_escola`

**Método**: `PUT`

**Autenticação**: Requerida (Admin, Gestor Escolar, Nutricionista)

### Corpo da Requisição

```json
{
  "nome_escola": "Escola Municipal Monteiro Lobato - Unidade II",
  "endereco_escola": "Rua das Letras, 790",
  "email_escola": "monteirolobato.u2@edu.exemplo.com",
  "segmento_escola": ["fundamental", "medio", "eja"]
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escola atualizada com sucesso",
  "dados": {
    "id_escola": "uuid-escola",
    "nome_escola": "Escola Municipal Monteiro Lobato - Unidade II",
    "endereco_escola": "Rua das Letras, 790",
    "email_escola": "monteirolobato.u2@edu.exemplo.com",
    "segmento_escola": ["fundamental", "medio", "eja"]
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
}
```

---

## Excluir Escola

Remove uma escola do sistema.

**URL**: `/escolas/:id_escola`

**Método**: `DELETE`

**Autenticação**: Requerida (Admin, Nutricionista)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Escola excluída com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Escola não encontrada"
}
```

---

## Importar Escolas

Importa múltiplas escolas a partir de um arquivo ou array JSON.

**URL**: `/escolas/importar`

**Método**: `POST`

**Autenticação**: Requerida (Admin)

### Corpo da Requisição

```json
[
  {
    "nome_escola": "Escola Municipal Paulo Freire",
    "endereco_escola": "Rua da Educação, 100",
    "email_escola": "paulofreire@edu.exemplo.com",
    "segmento_escola": ["fundamental"]
  },
  {
    "nome_escola": "Escola Municipal Anísio Teixeira",
    "endereco_escola": "Av. da Pedagogia, 200",
    "email_escola": "anisioteixeira@edu.exemplo.com",
    "segmento_escola": ["fundamental", "medio"]
  }
]
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Importação concluída: 2 escolas importadas com sucesso, 0 falhas",
  "dados": {
    "total": 2,
    "sucesso": 2,
    "falhas": 0,
    "resultados": [
      {
        "indice": 0,
        "id": "uuid-escola-1",
        "nome": "Escola Municipal Paulo Freire"
      },
      {
        "indice": 1,
        "id": "uuid-escola-2",
        "nome": "Escola Municipal Anísio Teixeira"
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
  "mensagem": "Formato inválido. Esperado um array de escolas."
}
```

```json
{
  "status": "erro",
  "mensagem": "Importação concluída: 1 escolas importadas com sucesso, 1 falhas",
  "dados": {
    "total": 2,
    "sucesso": 1,
    "falhas": 1,
    "resultados": [
      {
        "indice": 0,
        "id": "uuid-escola-1",
        "nome": "Escola Municipal Paulo Freire"
      }
    ],
    "erros": [
      {
        "indice": 1,
        "erro": "Já existe uma escola com este email"
      }
    ]
  }
}
```



## Notas de Implementação

- O campo `segmento_escola` é um array de strings que pode conter múltiplos segmentos
- Ao excluir uma escola, todos os dados relacionados (estoque, pedidos, etc.) serão mantidos para fins de histórico
- A importação em lote é processada em uma transação atômica
