# API de Ramais

Endpoints para gerenciamento de ramais (locais de entrega) e suas associações com escolas.

## Regras de acesso
- **Listar e buscar ramais:** qualquer usuário autenticado.
- **Criar, editar e deletar ramal:** apenas usuários com perfil ADMIN.
- **Não é possível deletar ramal com escolas associadas.**

---

## Endpoints

### Listar todos os ramais
`GET /ramais`

**Resposta:**
```json
{
  "status": "sucesso",
  "mensagem": "Ramais listados com sucesso",
  "dados": [
    {
      "id_ramal": "uuid",
      "nome_ramal": "RAMAL SÃO FRANCISCO",
      "escolas": [
        { "id_escola": "uuid", "nome_escola": "E M DR ANTÔNIO CANÊDO", ... }
      ]
    },
    ...
  ]
}
```

---

### Buscar ramal por ID
`GET /ramais/:id_ramal`

**Resposta:**
```json
{
  "status": "sucesso",
  "mensagem": "Ramal encontrado",
  "dados": {
    "id_ramal": "uuid",
    "nome_ramal": "RAMAL SÃO FRANCISCO",
    "escolas": [ ... ]
  }
}
```

---

### Criar ramal
`POST /ramais`

**Body:**
```json
{
  "nome_ramal": "RAMAL NOVO"
}
```

**Resposta:**
```json
{
  "status": "sucesso",
  "mensagem": "Ramal criado com sucesso",
  "dados": { "id_ramal": "uuid", "nome_ramal": "RAMAL NOVO" }
}
```

---

### Editar ramal
`PUT /ramais/:id_ramal`

**Body:**
```json
{
  "nome_ramal": "RAMAL EDITADO"
}
```

**Resposta:**
```json
{
  "status": "sucesso",
  "mensagem": "Ramal atualizado com sucesso"
}
```

---

### Deletar ramal
`DELETE /ramais/:id_ramal`

**Resposta de sucesso:**
```json
{
  "status": "sucesso",
  "mensagem": "Ramal deletado com sucesso"
}
```

**Erro se houver escolas associadas:**
```json
{
  "status": "erro",
  "mensagem": "Não é possível deletar ramal com escolas associadas"
}
```

---

## Observações
- Todos os endpoints exigem autenticação via token JWT.
- Apenas ADMIN pode criar, editar ou deletar ramais.
- O campo `escolas` em cada ramal traz a lista de escolas associadas.
