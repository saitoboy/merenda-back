# Autenticação

Esta seção contém as rotas relacionadas à autenticação no sistema Merenda Smart Flow.

## Login

Autentica um usuário e retorna um token JWT para acesso ao sistema.

**URL**: `/auth/login`

**Método**: `POST`

**Autenticação**: Não requerida

### Corpo da Requisição

```json
{
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "uuid-do-usuario",
      "nome": "Nome do Usuário",
      "email": "usuario@exemplo.com",
      "tipo": "nutricionista"
    }
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Email e senha são obrigatórios"
}
```

**Código**: `401 UNAUTHORIZED`

```json
{
  "status": "erro",
  "mensagem": "Usuário não encontrado"
}
```

```json
{
  "status": "erro",
  "mensagem": "Senha incorreta"
}
```

---

## Registro

Registra um novo usuário no sistema.

**URL**: `/auth/registrar`

**Método**: `POST`

**Autenticação**: Não requerida

### Corpo da Requisição

```json
{
  "nome_usuario": "Nome",
  "sobrenome_usuario": "Sobrenome",
  "email_usuario": "usuario@exemplo.com",
  "senha_usuario": "senha123",
  "tipo_usuario": "nutricionista",
  "id_escola": null
}
```

Campos especiais:
- `tipo_usuario`: Pode ser "admin", "nutricionista", "escola", "gestor_escolar" ou "fornecedor"
- `id_escola`: Obrigatório apenas quando `tipo_usuario` é "escola" ou "gestor_escolar"

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "Usuário registrado com sucesso",
  "dados": {
    "id": "uuid-do-usuario",
    "nome": "Nome",
    "email": "usuario@exemplo.com",
    "tipo": "nutricionista"
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Nome, email e senha são obrigatórios"
}
```

```json
{
  "status": "erro",
  "mensagem": "Email já cadastrado"
}
```

```json
{
  "status": "erro",
  "mensagem": "Tipo de usuário inválido"
}
```

```json
{
  "status": "erro",
  "mensagem": "ID da escola é obrigatório para usuários do tipo escola"
}
```

## Notas de Implementação

- As senhas são criptografadas usando bcrypt antes de serem armazenadas no banco de dados
- O token JWT gerado no login tem validade de 12 horas
- As informações no token incluem o ID, email e tipo do usuário
