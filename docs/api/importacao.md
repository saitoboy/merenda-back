# Importação em Massa

Esta seção contém as rotas relacionadas à importação em massa de dados no sistema Merenda Smart Flow.

## Visão Geral

O sistema Merenda Smart Flow permite a importação em massa de diversos tipos de dados através de arquivos CSV ou JSON. Isso é especialmente útil durante a configuração inicial do sistema ou quando é necessário adicionar um grande volume de dados.

## Formatos de Arquivo Suportados

### CSV

Os arquivos CSV devem:
- Usar vírgula (,) como separador
- Incluir cabeçalho na primeira linha
- Seguir a estrutura exata conforme especificado para cada tipo de importação
- Ser codificados em UTF-8

Exemplo de arquivo CSV para importação de escolas:
```
nome_escola,endereco_escola,email_escola,segmento_escola
E.M. Maria da Silva,"Rua das Flores, 123",maria.silva@escola.edu.br,"fundamental1,fundamental2"
E.M. João Pedro,"Av. Principal, 456",joao.pedro@escola.edu.br,"infantil,fundamental1"
```

### JSON

Os arquivos JSON devem:
- Conter um array de objetos
- Seguir a estrutura exata conforme especificado para cada tipo de importação
- Ser codificados em UTF-8

Exemplo de arquivo JSON para importação de escolas:
```json
[
  {
    "nome_escola": "E.M. Maria da Silva",
    "endereco_escola": "Rua das Flores, 123",
    "email_escola": "maria.silva@escola.edu.br",
    "segmento_escola": ["fundamental1", "fundamental2"]
  },
  {
    "nome_escola": "E.M. João Pedro",
    "endereco_escola": "Av. Principal, 456",
    "email_escola": "joao.pedro@escola.edu.br",
    "segmento_escola": ["infantil", "fundamental1"]
  }
]
```

## Rotas de Importação

### Importar Escolas

**URL**: `/escolas/importar`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin)

**Corpo da Requisição**: Form-data com arquivo CSV/JSON

**Estrutura do Arquivo**:
- `nome_escola`: Nome da escola (obrigatório)
- `endereco_escola`: Endereço completo (obrigatório)
- `email_escola`: Email de contato (obrigatório)
- `segmento_escola`: Lista de segmentos separados por vírgula (CSV) ou array (JSON) (obrigatório)

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "5 escolas importadas com sucesso",
  "dados": {
    "total": 5,
    "sucesso": 5,
    "falha": 0
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato de arquivo inválido ou dados inconsistentes",
  "dados": {
    "total": 5,
    "sucesso": 3,
    "falha": 2,
    "erros": [
      {
        "linha": 3,
        "erro": "Email já cadastrado no sistema"
      },
      {
        "linha": 5,
        "erro": "Segmento escolar inválido"
      }
    ]
  }
}
```

---

### Importar Fornecedores

**URL**: `/fornecedores/importar`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin)

**Corpo da Requisição**: Form-data com arquivo CSV/JSON

**Estrutura do Arquivo**:
- `nome_fornecedor`: Nome do fornecedor (obrigatório)
- `cnpj_fornecedor`: CNPJ (obrigatório)
- `whatsapp_fornecedor`: Número de WhatsApp (obrigatório)
- `email_fornecedor`: Email de contato (obrigatório)
- `senha_fornecedor`: Senha inicial (obrigatório)

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "3 fornecedores importados com sucesso",
  "dados": {
    "total": 3,
    "sucesso": 3,
    "falha": 0
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato de arquivo inválido ou dados inconsistentes",
  "dados": {
    "total": 3,
    "sucesso": 2,
    "falha": 1,
    "erros": [
      {
        "linha": 2,
        "erro": "CNPJ inválido"
      }
    ]
  }
}
```

---

### Importar Itens

**URL**: `/itens/importar`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin ou Nutricionista)

**Corpo da Requisição**: Form-data com arquivo CSV/JSON

**Estrutura do Arquivo**:
- `nome_item`: Nome do item (obrigatório)
- `unidade_medida`: Unidade de medida (kg, l, unidade, etc.) (obrigatório)
- `sazonalidade`: Período de disponibilidade (obrigatório)
- `validade`: Data de validade no formato YYYY-MM-DD (obrigatório)
- `observacao`: Observações adicionais (opcional)
- `id_fornecedor`: ID do fornecedor ou nome_fornecedor para associação (obrigatório)
- `preco_item`: Preço unitário do item (obrigatório)

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "10 itens importados com sucesso",
  "dados": {
    "total": 10,
    "sucesso": 10,
    "falha": 0
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato de arquivo inválido ou dados inconsistentes",
  "dados": {
    "total": 10,
    "sucesso": 8,
    "falha": 2,
    "erros": [
      {
        "linha": 5,
        "erro": "Fornecedor não encontrado"
      },
      {
        "linha": 9,
        "erro": "Formato de data inválido"
      }
    ]
  }
}
```

---

### Importar Valores Ideais de Estoque

**URL**: `/estoque/ideais/importar`

**Método**: `POST`

**Autenticação**: Sim (apenas Admin ou Nutricionista)

**Corpo da Requisição**: Form-data com arquivo CSV/JSON

**Estrutura do Arquivo**:
- `id_escola` ou `nome_escola`: ID ou nome da escola (obrigatório)
- `id_item` ou `nome_item`: ID ou nome do item (obrigatório)
- `numero_ideal`: Quantidade ideal do item para a escola (obrigatório)

### Resposta de Sucesso

**Código**: `201 CREATED`

```json
{
  "status": "sucesso",
  "mensagem": "25 valores ideais importados com sucesso",
  "dados": {
    "total": 25,
    "sucesso": 25,
    "falha": 0
  }
}
```

### Respostas de Erro

**Código**: `400 BAD REQUEST`

```json
{
  "status": "erro",
  "mensagem": "Formato de arquivo inválido ou dados inconsistentes",
  "dados": {
    "total": 25,
    "sucesso": 22,
    "falha": 3,
    "erros": [
      {
        "linha": 8,
        "erro": "Escola não encontrada"
      },
      {
        "linha": 15,
        "erro": "Item não encontrado"
      },
      {
        "linha": 20,
        "erro": "Número ideal deve ser maior que zero"
      }
    ]
  }
}
```

---

## Dicas para Importação

1. **Prepare seus dados cuidadosamente**: Verifique se todos os campos obrigatórios estão preenchidos e no formato correto.

2. **Divida arquivos grandes**: Se tiver muitos registros para importar, divida em arquivos menores (500-1000 registros por arquivo).

3. **Teste com poucos registros**: Antes de importar um arquivo grande, teste com poucos registros para verificar se a estrutura está correta.

4. **Verifique as dependências**: Importe na ordem correta - primeiro escolas, depois fornecedores, itens e por último os valores ideais de estoque.

5. **Backup dos dados**: Sempre faça backup dos dados existentes antes de realizar importações em massa.

6. **Tratamento de erros**: Verifique os erros retornados pela API e corrija os registros com problemas.

7. **Codificação UTF-8**: Certifique-se de que seus arquivos estão codificados em UTF-8 para evitar problemas com caracteres especiais.

---
