# Rotas de Teste e Desenvolvimento

Esta seção contém rotas que são úteis durante o desenvolvimento e testes do sistema Merenda Smart Flow. Estas rotas **não devem ser utilizadas em ambiente de produção**.

## Verificação de Saúde (Health Check)

Verifica se a API está funcionando corretamente.

**URL**: `/health`

**Método**: `GET`

**Autenticação**: Não

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "API funcionando normalmente",
  "dados": {
    "versao": "1.0.0",
    "uptime": "2d 5h 30m",
    "banco_dados": "conectado"
  }
}
```

---

## Informações do Servidor

Retorna informações sobre o servidor e o ambiente de execução.

**URL**: `/dev/info`

**Método**: `GET`

**Autenticação**: Sim (apenas Admin)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Informações do servidor",
  "dados": {
    "ambiente": "desenvolvimento",
    "versao_node": "16.14.2",
    "memoria_uso": "120MB / 512MB",
    "sistema_operacional": "Linux",
    "versao_banco": "PostgreSQL 14.5",
    "conexoes_ativas": 3
  }
}
```

---

## Resetar Banco de Dados de Teste

Limpa todas as tabelas no banco de dados de teste e insere dados iniciais para testes.

**URL**: `/dev/reset-db`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin)

**Disponível apenas em ambiente de teste e desenvolvimento**

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Banco de dados resetado com sucesso",
  "dados": {
    "tabelas_limpas": ["usuario", "escola", "fornecedor", "item", "estoque", "pedido"],
    "dados_inseridos": {
      "escolas": 3,
      "fornecedores": 2,
      "itens": 10,
      "usuarios": 5
    }
  }
}
```

---

## Gerar Dados de Teste

Gera dados aleatórios para testes.

**URL**: `/dev/gerar-dados`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin)

**Disponível apenas em ambiente de teste e desenvolvimento**

**Corpo da Requisição**:

```json
{
  "quantidade_escolas": 5,
  "quantidade_fornecedores": 3,
  "quantidade_itens": 20,
  "quantidade_usuarios": 10,
  "quantidade_pedidos": 30
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Dados de teste gerados com sucesso",
  "dados": {
    "escolas_criadas": 5,
    "fornecedores_criados": 3,
    "itens_criados": 20,
    "usuarios_criados": 10,
    "pedidos_criados": 30
  }
}
```

---

## Logs do Sistema

Retorna os logs recentes do sistema.

**URL**: `/dev/logs`

**Método**: `GET`

**Autenticação**: Sim (apenas Admin)

**Parâmetros de Query**:
- `nivel`: Nível dos logs (error, warn, info, debug) - opcional
- `limite`: Número máximo de logs a retornar - opcional, padrão 100
- `data_inicio`: Data de início para filtrar logs (YYYY-MM-DD) - opcional
- `data_fim`: Data de fim para filtrar logs (YYYY-MM-DD) - opcional

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Logs recuperados com sucesso",
  "dados": [
    {
      "timestamp": "2023-09-20T15:32:45Z",
      "nivel": "error",
      "mensagem": "Erro ao conectar com o banco de dados",
      "detalhes": "Connection refused"
    },
    {
      "timestamp": "2023-09-20T15:30:22Z",
      "nivel": "info",
      "mensagem": "Usuário logado",
      "detalhes": "ID: uuid-usuario-1"
    }
  ]
}
```

---

## Simular Erro

Endpoint para simular diferentes tipos de erros para testes de tratamento de erros.

**URL**: `/dev/simular-erro/:tipo`

**Método**: `GET`

**Autenticação**: Sim (apenas Admin)

**Parâmetros de URL**:
- `tipo`: Tipo de erro a simular (db, auth, validacao, servidor)

### Resposta de Erro (depende do tipo solicitado)

**Código**: Varia conforme o tipo de erro

```json
{
  "status": "erro",
  "mensagem": "Erro simulado para testes",
  "detalhes": "Detalhes específicos do erro simulado"
}
```

---

## Métricas de Performance

Retorna métricas de performance da API.

**URL**: `/dev/metricas`

**Método**: `GET`

**Autenticação**: Sim (apenas Admin)

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Métricas recuperadas com sucesso",
  "dados": {
    "requisicoes_por_minuto": 45,
    "tempo_medio_resposta": "120ms",
    "rotas_mais_usadas": [
      {
        "rota": "/estoque/escola/uuid-escola-1",
        "chamadas": 250,
        "tempo_medio": "85ms"
      },
      {
        "rota": "/auth/login",
        "chamadas": 180,
        "tempo_medio": "150ms"
      }
    ],
    "erros_recentes": 5,
    "uso_memoria": "210MB"
  }
}
```

---

## Considerações Importantes

1. **Segurança**: Estas rotas devem ser desabilitadas em ambiente de produção.

2. **Dados Sensíveis**: Tenha cuidado com as informações retornadas pelas rotas de desenvolvimento, pois podem expor dados sensíveis do sistema.

3. **Isolamento de Ambiente**: Sempre use um banco de dados separado para testes e desenvolvimento.

4. **Autenticação**: Mesmo em ambiente de desenvolvimento, mantenha a autenticação para estas rotas para evitar acesso não autorizado.

5. **Logs**: Monitore o uso destas rotas, mesmo em ambiente de desenvolvimento.

---
