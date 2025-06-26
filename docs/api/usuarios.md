# Usuários

Esta seção contém as rotas relacionadas à gestão de usuários no sistema Merenda Smart Flow.

## Listar Usuários

Retorna todos os usuários cadastrados no sistema.

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
      "tipo_usuario": "gestor_escolar"
    },
    {
      "id_usuario": "uuid-usuario-2",
      "nome_usuario": "Ana",
      "sobrenome_usuario": "Oliveira",
      "id_escola": null,
      "email_usuario": "ana.oliveira@nutricao.edu.br",
      "tipo_usuario": "nutricionista"
    }
  ]
}
```

Observação: A senha nunca é retornada nas consultas.

---

## Buscar Usuário

Retorna os detalhes de um usuário específico pelo seu ID.

**URL**: `/usuarios/:id_usuario`

**Método**: `GET`

**Autenticação**: Sim (Admin ou o próprio usuário)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Usuário encontrado com sucesso",
  "dados": {
    "id_usuario": "uuid-usuario-1",
    "nome_usuario": "Maria",
    "sobrenome_usuario": "Silva",
    "id_escola": "uuid-escola-1",
    "email_usuario": "maria.silva@escola.edu.br",
    "tipo_usuario": "gestor_escolar"
  }
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Usuário não encontrado"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

## Buscar Usuários por Escola

Retorna todos os usuários associados a uma escola específica.

**URL**: `/usuarios/escola/:id_escola`

**Método**: `GET`

**Autenticação**: Sim (Admin, Nutricionista ou Gestor da escola)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Usuários da escola listados com sucesso",
  "dados": [
    {
      "id_usuario": "uuid-usuario-1",
      "nome_usuario": "Maria",
      "sobrenome_usuario": "Silva",
      "id_escola": "uuid-escola-1",
      "email_usuario": "maria.silva@escola.edu.br",
      "tipo_usuario": "gestor_escolar"
    },
    {
      "id_usuario": "uuid-usuario-3",
      "nome_usuario": "João",
      "sobrenome_usuario": "Santos",
      "id_escola": "uuid-escola-1",
      "email_usuario": "joao.santos@escola.edu.br",
      "tipo_usuario": "escola"
    }
  ]
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

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
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
  "tipo_usuario": "gestor_escolar"
}
```

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Usuário criado com sucesso",
  "dados": {
    "id_usuario": "uuid-novo-usuario"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Email já cadastrado no sistema"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

## Atualizar Usuário

Atualiza os dados de um usuário existente.

**URL**: `/usuarios/:id_usuario`

**Método**: `PUT`

**Autenticação**: Sim (Admin ou o próprio usuário)

**Corpo da Requisição**:

```json
{
  "nome_usuario": "Pedro",
  "sobrenome_usuario": "Mendes da Silva",
  "email_usuario": "pedro.mendes.silva@escola.edu.br"
}
```

Para alterar a senha, utilize a rota específica de alteração de senha.

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Usuário atualizado com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Usuário não encontrado"
}
```

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Email já cadastrado para outro usuário"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

## Alterar Senha

Altera a senha de um usuário existente.

**URL**: `/usuarios/:id_usuario/senha`

**Método**: `PUT`

**Autenticação**: Sim (Admin ou o próprio usuário)

**Corpo da Requisição**:

```json
{
  "senha_atual": "senha_atual_123",
  "nova_senha": "nova_senha_segura_456"
}
```

Observação: O campo `senha_atual` é obrigatório apenas quando o próprio usuário está alterando sua senha. Administradores podem alterar senhas sem fornecer a senha atual.

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Senha alterada com sucesso"
}
```

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Usuário não encontrado"
}
```

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Senha atual incorreta"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
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

### Respostas de Erro

**Código**: `404 NOT FOUND`

```json
{
  "status": "erro",
  "mensagem": "Usuário não encontrado"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autorizado"
}
```

---

## Meu Perfil

Retorna as informações do usuário autenticado.

**URL**: `/usuarios/perfil`

**Método**: `GET`

**Autenticação**: Sim

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Perfil carregado com sucesso",
  "dados": {
    "id_usuario": "uuid-usuario-1",
    "nome_usuario": "Maria",
    "sobrenome_usuario": "Silva",
    "id_escola": "uuid-escola-1",
    "email_usuario": "maria.silva@escola.edu.br",
    "tipo_usuario": "gestor_escolar",
    "escola": {
      "id_escola": "uuid-escola-1",
      "nome_escola": "E.M. Maria da Silva"
    }
  }
}
```

### Respostas de Erro

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Não autenticado"
}
```

---

## Matriz de Permissões por Tipo de Usuário

Esta seção detalha as permissões de acesso a recursos do sistema por tipo de usuário.

### Escolas

| Endpoint | Método | Admin | Nutricionista | Gestor Escolar |
|----------|--------|:-----:|:-------------:|:--------------:|
| `/escolas` | GET | ✅ | ✅ | ✅ |
| `/escolas/:id` | GET | ✅ | ✅ | ✅ |
| `/escolas` | POST | ✅ | ✅ | ❌ |
| `/escolas/:id` | PUT | ✅ | ✅ | ✅ |
| `/escolas/:id` | DELETE | ✅ | ✅ | ❌ |
| `/escolas/importar` | POST | ✅ | ❌ | ❌ |

### Estoque

| Endpoint | Método | Admin | Nutricionista | Gestor Escolar |
|----------|--------|:-----:|:-------------:|:--------------:|
| `/estoque/escola/:id_escola` | GET | ✅ | ✅ | ✅ |
| `/estoque/escola/:id_escola/abaixo-ideal` | GET | ✅ | ✅ | ✅ |
| `/estoque/escola/:id_escola/metricas` | GET | ✅ | ✅ | ✅ |
| `/estoque/ideais` | POST | ✅ | ✅ | ❌ |
| `/estoque/ideais/:id_escola` | POST | ✅ | ✅ | ❌ |
| `/estoque/adicionar` | POST | ✅ | ❌ | ✅ |
| `/estoque/quantidade/:id_escola/:id_item` | PUT | ✅ | ✅ | ✅ |
| `/estoque/numero-ideal/:id_escola/:id_item` | PUT | ✅ | ✅ | ✅ |
| `/estoque/:id_escola/:id_item` | DELETE | ✅ | ❌ | ✅ |

### Usuários

| Endpoint | Método | Admin | Nutricionista | Gestor Escolar |
|----------|--------|:-----:|:-------------:|:--------------:|
| `/usuarios` | GET | ✅ | ❌ | ❌ |
| `/usuarios/:id` | GET | ✅ | Próprio | Próprio |
| `/usuarios/escola/:id_escola` | GET | ✅ | ✅ | Própria escola |
| `/usuarios` | POST | ✅ | ❌ | ❌ |
| `/usuarios/:id` | PUT | ✅ | Próprio | Próprio |
| `/usuarios/:id` | DELETE | ✅ | ❌ | ❌ |
| `/usuarios/perfil` | GET | ✅ | ✅ | ✅ |

> **Legenda:**
> - ✅ = Acesso permitido
> - ❌ = Acesso negado
> - "Próprio" = Apenas acesso ao próprio recurso
> - "Própria escola" = Apenas acesso aos recursos da própria escola

---
