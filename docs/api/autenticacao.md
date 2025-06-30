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
      "tipo": "escola",
      "id_escola": "uuid-da-escola"
    }
  }
}
```

**Observação**: O campo `id_escola` é incluído automaticamente quando o usuário é do tipo `escola`.

### Exemplo para usuário Nutricionista

```json
{
  "status": "sucesso",
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "uuid-do-usuario",
      "nome": "Ana Silva",
      "email": "ana@nutricao.edu.br",
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
- `tipo_usuario`: Pode ser "admin", "nutricionista", "escola" ou "fornecedor"
- `id_escola`: Obrigatório apenas quando `tipo_usuario` é "escola"

### Resposta de Sucesso

**Código**: `201 CREATED`

**Para usuários do tipo escola:**

```json
{
  "status": "sucesso",
  "mensagem": "Usuário registrado com sucesso",
  "dados": {
    "id": "uuid-do-usuario",
    "nome": "Maria",
    "email": "maria@escola.edu.br",
    "tipo": "escola",
    "id_escola": "uuid-da-escola"
  }
}
```

**Para outros tipos de usuário:**

```json
{
  "status": "sucesso",
  "mensagem": "Usuário registrado com sucesso",
  "dados": {
    "id": "uuid-do-usuario",
    "nome": "Ana",
    "email": "ana@nutricao.edu.br",
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
  "mensagem": "ID da escola é obrigatório para usuários do tipo escola/gestor escolar"
}
```

## Notas de Implementação

- As senhas são criptografadas usando bcrypt antes de serem armazenadas no banco de dados
- O campo `id_escola` é incluído automaticamente no retorno do login e registro quando o usuário é do tipo `escola`
- O token JWT também inclui o `id_escola` no payload para usuários ligados a escolas, facilitando o acesso às informações da escola sem consultas adicionais
- O token JWT gerado no login tem validade de 12 horas
- As informações no token incluem o ID, email, tipo do usuário e `id_escola` (quando aplicável)
