# Ativação de Período e Duplicação de Estoques

## Visão Geral

Esta funcionalidade implementa a lógica de ativação de períodos no sistema Merenda Smart Flow com duplicação automática e inteligente de estoques. Quando um novo período é ativado, o sistema verifica se esse período já possui estoques cadastrados e, caso não possua, duplica automaticamente os estoques do período ativo anterior.

## Regras de Negócio

### 1. **Controle de Período Ativo**
- Apenas um período pode estar ativo por vez no sistema
- Ao ativar um novo período, todos os outros períodos são automaticamente desativados

### 2. **Duplicação de Estoques**
- A duplicação só ocorre na **primeira ativação** de um período
- Se o período já possui estoques, a ativação apenas reativa o período sem duplicar dados
- A duplicação é feita a partir do período que estava ativo anteriormente
- Se não houver período ativo anterior, a ativação ocorre sem duplicação

### 3. **Dados Duplicados**
- **Copiados:** `id_escola`, `id_item`, `id_segmento`, `quantidade_item`, `numero_ideal`, `validade`
- **Alterados:** `id_periodo` (novo período), `data_criacao`, `data_atualizacao`
- **Gerados:** Novos IDs únicos para cada item de estoque

## Implementação

### Arquivos Modificados

#### 1. `src/services/estoque.service.ts`
Nova função `duplicarEstoquesParaNovoPeriodo`:
- Utiliza transações para garantir consistência
- Verifica se o período de destino já possui estoques
- Busca período ativo anterior se não especificado
- Duplica estoques em lote para melhor performance
- Inclui logs detalhados e rollback em caso de erro

#### 2. `src/services/periodo-lancamento.service.ts`
Função `ativarPeriodo` modificada:
- Busca período ativo anterior antes da ativação
- Chama duplicação de estoques automaticamente
- Retorna informações detalhadas sobre a duplicação
- Continua a ativação mesmo se a duplicação falhar

#### 3. `src/controller/periodo-lancamento.controller.ts`
Controller `ativarPeriodo` atualizado:
- Retorna informações completas sobre período e duplicação
- Estrutura de resposta padronizada

## Endpoint

### POST `/periodo-lancamento/:id/ativar`

**Autenticação:** Obrigatória (Admin ou Nutricionista)

**Parâmetros:**
- `id` (path): ID do período a ser ativado

**Resposta de Sucesso (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Período 7/2025 ativado com sucesso",
  "dados": {
    "periodo": {
      "id": "uuid-periodo",
      "mes": 7,
      "ano": 2025,
      "ativo": true
    },
    "duplicacao_estoques": {
      "realizada": true,
      "total_itens": 150,
      "periodo_origem": "uuid-periodo-anterior",
      "mensagem": "Estoques duplicados com sucesso: 150 itens copiados."
    }
  }
}
```

**Resposta quando período já tem estoques:**
```json
{
  "status": "sucesso",
  "mensagem": "Período 7/2025 ativado com sucesso",
  "dados": {
    "periodo": {
      "id": "uuid-periodo",
      "mes": 7,
      "ano": 2025,
      "ativo": true
    },
    "duplicacao_estoques": {
      "realizada": false,
      "total_itens": 0,
      "periodo_origem": "uuid-periodo-anterior",
      "mensagem": "Período já possui estoques. Duplicação não realizada."
    }
  }
}
```

**Resposta de Erro (400):**
```json
{
  "status": "erro",
  "mensagem": "Período não encontrado"
}
```

## Cenários de Uso

### 1. **Primeira Ativação de um Período**
- Sistema busca período ativo anterior
- Duplica todos os estoques para o novo período
- Ativa o novo período
- Retorna sucesso com informações da duplicação

### 2. **Reativação de um Período**
- Sistema detecta que período já possui estoques
- Apenas ativa o período sem duplicar
- Retorna sucesso indicando que duplicação não foi necessária

### 3. **Primeiro Período do Sistema**
- Não há período anterior para duplicar
- Apenas ativa o período
- Retorna sucesso indicando ausência de período anterior

### 4. **Erro na Duplicação**
- Período é ativado mesmo se duplicação falhar
- Erro é logado mas não impede a ativação
- Resposta indica falha na duplicação

## Logs e Monitoramento

### Logs Gerados
- Início e fim da ativação de período
- Início e resultado da duplicação de estoques
- Erros detalhados em caso de falha
- Quantidade de itens duplicados

### Exemplo de Logs
```
2025-07-03 17:02:30 ℹ️ [PERIODO] Iniciando ativação do período: abc-123
2025-07-03 17:02:30 ℹ️ [PERIODO] Iniciando duplicação de estoques do período def-456 para abc-123
2025-07-03 17:02:30 ℹ️ [SERVICE] Encontrados 150 itens para duplicar do período def-456
2025-07-03 17:02:31 ℹ️ [SERVICE] Duplicação concluída: 150 itens duplicados do período def-456 para abc-123
2025-07-03 17:02:31 ✅ [PERIODO] Duplicação concluída: 150 itens
2025-07-03 17:02:31 ✅ [PERIODO] Período 7/2025 ativado com sucesso
```

## Segurança e Performance

### Transações
- Toda duplicação é feita dentro de uma transação
- Rollback automático em caso de erro
- Garantia de consistência dos dados

### Performance
- Inserção em lote para melhor performance
- Verificações prévias para evitar operações desnecessárias
- Logs otimizados para não impactar performance

### Validações
- Verificação de existência de períodos
- Validação de permissões de usuário
- Prevenção de duplicações indevidas

## Casos de Teste Sugeridos

1. **Ativar período novo sem estoques** → Deve duplicar estoques
2. **Ativar período que já tem estoques** → Não deve duplicar
3. **Ativar primeiro período do sistema** → Deve ativar sem duplicar
4. **Ativar período inexistente** → Deve retornar erro
5. **Usuário sem permissão** → Deve retornar erro de autorização
6. **Falha na duplicação** → Período deve ser ativado mesmo assim

## Notas Técnicas

- A função usa UUID v4 para novos IDs de estoque
- Datas de criação e atualização são definidas no momento da duplicação
- A validação de expiry do período é mantida (não pode ativar período expirado)
- Compatibilidade total com sistema de logs existente
