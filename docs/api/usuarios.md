# Usuários

Esta seção contém as rotas relacionadas à gestão de usuários no sistema Merenda Smart Flow.

## Listar Usuários

Retorna todos os usuários cadastrados no sistema (exceto o campo senha).

**URL**: `/usuarios`

**Método**: `GET`

**Autenticação**: Sim (apenas Admin)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Usuários listados com sucesso",
  "dados": [
    {
      "id_usuario": "uuid-usuario-1",
      "nome_usuario": "Maria",
      "sobrenome_usuario": "Silva",
      "id_escola": "uuid-escola-1",
      "email_usuario": "maria.silva@escola.edu.br",
      "tipo_usuario": "escola"
    }
  ]
}
```

---

## Buscar Usuário por ID

Retorna os detalhes de um usuário específico pelo seu ID.

**URL**: `/usuarios/:id_usuario`

**Método**: `GET`

**Autenticação**: Sim (Admin ou o próprio usuário)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "dados": {
    "id_usuario": "uuid-usuario-1",
    "nome_usuario": "Maria",
    "sobrenome_usuario": "Silva",
    "id_escola": "uuid-escola-1",
    "email_usuario": "maria.silva@escola.edu.br",
    "tipo_usuario": "escola"
  }
}
```

---

## Criar Usuário

Cria um novo usuário no sistema.

**URL**: `/usuarios`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin)

**Corpo da Requisição**:

```json
{
  "nome_usuario": "Pedro",
  "sobrenome_usuario": "Mendes",
  "id_escola": "uuid-escola-2",
  "email_usuario": "pedro.mendes@escola.edu.br",
  "senha_usuario": "senha_segura_123",
  "tipo_usuario": "escola"
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Usuário criado com sucesso",
  "dados": {
    "id_usuario": "uuid-novo-usuario",
    "nome_usuario": "Pedro",
    "sobrenome_usuario": "Mendes",
    "id_escola": "uuid-escola-2",
    "email_usuario": "pedro.mendes@escola.edu.br",
    "tipo_usuario": "escola"
  }
}
```

---

## Criar Usuários em Lote

Cria múltiplos usuários de uma vez, útil para cadastrar todas as escolas rapidamente.

**URL**: `/usuarios/lote`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin)

**Corpo da Requisição** (array de objetos):

```json
[
  {
    "nome_usuario": "CRECHE ALFREDO COUTO",
    "email_usuario": "creacouto@gmail.com",
    "senha_usuario": "@Merenda2025",
    "tipo_usuario": "escola"
  },
  {
    "nome_usuario": "E M ALZIRA CHAVES LACERDA",
    "email_usuario": "emalzirachaveslacerda@edu.muriae.mg.gov.br",
    "senha_usuario": "@Merenda2025",
    "tipo_usuario": "escola"
  }
  // ... demais escolas ...
]
```

- `nome_usuario`: Nome da escola
- `email_usuario`: Email da escola
- `senha_usuario`: Senha padrão (`@Merenda2025`)
- `tipo_usuario`: Sempre "escola"

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "usuarios": [
    {
      "id_usuario": "uuid-usuario-1",
      "nome_usuario": "CRECHE ALFREDO COUTO",
      "email_usuario": "creacouto@gmail.com",
      "tipo_usuario": "escola"
    },
    {
      "id_usuario": "uuid-usuario-2",
      "nome_usuario": "E M ALZIRA CHAVES LACERDA",
      "email_usuario": "emalzirachaveslacerda@edu.muriae.mg.gov.br",
      "tipo_usuario": "escola"
    }
    // ... demais escolas ...
  ]
}
```

### Resposta de Erro

```json
{
  "status": "erro",
  "mensagem": "Erro ao criar usuários em lote"
}
```

---

## Atualizar Usuário

Atualiza os dados de um usuário existente.

**URL**: `/usuarios/:id_usuario`

**Método**: `PATCH`

**Autenticação**: Sim (Admin ou o próprio usuário)

**Corpo da Requisição** (envie apenas os campos que deseja atualizar):

```json
{
  "nome_usuario": "Pedro",
  "sobrenome_usuario": "Mendes da Silva",
  "email_usuario": "pedro.mendes.silva@escola.edu.br"
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Usuário atualizado com sucesso",
  "dados": {
    "id_usuario": "uuid-usuario-1",
    "nome_usuario": "Pedro",
    "sobrenome_usuario": "Mendes da Silva",
    "id_escola": "uuid-escola-2",
    "email_usuario": "pedro.mendes.silva@escola.edu.br",
    "tipo_usuario": "escola"
  }
}
```

---

## Excluir Usuário

Remove um usuário do sistema.

**URL**: `/usuarios/:id_usuario`

**Método**: `DELETE`

**Autenticação**: Sim (apenas Admin)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Usuário excluído com sucesso"
}
```

---

## Troca de Senha

Permite que o próprio usuário altere sua senha, ou que um admin redefina a senha de qualquer usuário.

**URL**: `/usuarios/:id_usuario/senha`

**Método**: `PUT`

**Autenticação**: Sim (admin ou próprio usuário)

**Corpo da Requisição**:

- Admin:
```json
{
  "nova_senha": "novaSenhaSegura123"
}
```
- Usuário comum:
```json
{
  "senha_atual": "senhaAntiga123",
  "nova_senha": "novaSenhaSegura123"
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Senha alterada com sucesso"
}
```

---

> **Observação:** O campo `senha_usuario` nunca é retornado nas respostas da API.

---
