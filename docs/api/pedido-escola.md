# Endpoint: Pedido-Escola

## POST /pedido-escola/criar
Registra o responsável pelo lançamento de estoque de uma escola.

### Body (JSON)
```json
{
  "created_by": "Nome da Escola",
  "id_periodo": "uuid-do-periodo-ativo",
  "id_usuario": "uuid-do-usuario",
  "id_escola": "uuid-da-escola"
}
```

- `created_by`: Nome da escola responsável pelo lançamento
- `id_periodo`: UUID do período ativo (deve ser capturado do sistema)
- `id_usuario`: UUID do usuário responsável
- `id_escola`: UUID da escola

### Exemplo de requisição
```json
{
  "created_by": "EMEF João XXIII",
  "id_periodo": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "id_usuario": "e1a2b3c4-d5f6-7890-1234-56789abcdef0",
  "id_escola": "b1c2d3e4-f5a6-7890-1234-56789abcdef0"
}
```

### Resposta de sucesso
```json
{
  "status": "sucesso",
  "mensagem": "Registro de pedido-escola criado com sucesso",
  "id_pedido_escola": "uuid-gerado"
}
```

### Resposta de erro
```json
{
  "status": "erro",
  "mensagem": "Erro ao registrar pedido-escola"
}
```

---

## GET /pedido-escola
Lista todos os registros de lançamentos de estoque por escola.

### Resposta de sucesso
```json
{
  "status": "sucesso",
  "pedidos": [
    {
      "id_pedido_escola": "uuid-gerado",
      "created_by": "EMEF João XXIII",
      "created_at": "2025-07-17T14:00:00.000Z",
      "id_periodo": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "id_usuario": "e1a2b3c4-d5f6-7890-1234-56789abcdef0",
      "id_escola": "b1c2d3e4-f5a6-7890-1234-56789abcdef0"
    }
    // ... outros registros ...
  ]
}
```

### Resposta de erro
```json
{
  "status": "erro",
  "mensagem": "Erro ao listar pedidos-escola"
}
```
