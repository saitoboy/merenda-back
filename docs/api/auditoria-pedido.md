# Auditoria de Pedido

## POST /auditoria-pedido/criar

Registra uma auditoria de geração de pedido.

### Body (JSON)
```json
{
  "created_by": "<uuid_do_usuario>",
  "id_periodo": "<uuid_do_periodo>"
}
```

- `created_by`: UUID do usuário que gerou o pedido
- `id_periodo`: UUID do período de lançamento

### Exemplo
```json
{
  "created_by": "e1a2b3c4-d5f6-7890-1234-56789abcdef0",
  "id_periodo": "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
}
```

### Resposta de sucesso
```json
{
  "status": "sucesso",
  "mensagem": "Auditoria registrada com sucesso",
  "dados": {
    "id_auditoria": "...",
    "created_by": "...",
    "created_at": "...",
    "id_periodo": "..."
  }
}
```

### Resposta de erro
```json
{
  "status": "erro",
  "mensagem": "<mensagem de erro>"
}
```
