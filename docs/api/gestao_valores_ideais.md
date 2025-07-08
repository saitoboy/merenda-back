# Gestão de Valores Ideais de Estoque

Este documento detalha o funcionamento e as boas práticas para a gestão de valores ideais de estoque no sistema Merenda Smart Flow.

## Conceito

Os valores ideais de estoque representam as quantidades mínimas recomendadas de cada item que as escolas devem manter para atender adequadamente às demandas alimentares. O sistema permite definir valores ideais específicos por:

- Escola
- Item
- Segmento escolar (infantil, fundamental, médio, etc.)

Esta estrutura flexível permite um ajuste fino das necessidades de cada escola considerando as características específicas de cada segmento educacional.

## Estrutura de Dados

A gestão de valores ideais é baseada na seguinte estrutura:

- **id_escola**: Identificador único da escola
- **id_item**: Identificador único do item alimentar
- **segmento_estoque**: Segmento da escola (ex: "infantil", "fundamental", "escola")
- **numero_ideal**: Quantidade ideal do item a ser mantida em estoque
- **quantidade_item**: Quantidade atual do item em estoque (usado para comparações)

A combinação de `id_escola`, `id_item` e `segmento_estoque` forma a chave primária que identifica unicamente cada registro de estoque no sistema.

## Funcionalidades Principais

### 1. Definição de Valores Ideais em Lote

Permite configurar valores ideais para múltiplas combinações de escola-item-segmento de uma só vez, otimizando o processo de configuração inicial ou atualização em massa.

**Endpoint**: `POST /estoque/ideais`

**Exemplo**:
```json
{
  "ideais": [
    {
      "id_escola": "3295a626-8a93-49ec-a89f-7a49450f765e",
      "id_item": "6cdaed48-6816-4725-8e82-b65a5e712ac8",
      "numero_ideal": 5,
      "segmento": "escola"
    },
    {
      "id_escola": "3295a626-8a93-49ec-a89f-7a49450f765e",
      "id_item": "9be73f02-6ed5-4001-80b7-981633e05e1d",
      "numero_ideal": 5,
      "segmento": "infantil"
    }
  ]
}
```

### 2. Definição de Valores Ideais por Escola

Permite configurar valores ideais para múltiplos itens de uma mesma escola, facilitando a gestão específica por unidade escolar.

**Endpoint**: `POST /estoque/ideais/:id_escola`

**Exemplo**:
```json
{
  "itens_ideais": [
    { "id_item": "6cdaed48-6816-4725-8e82-b65a5e712ac8", "numero_ideal": 5 },
    { "id_item": "9be73f02-6ed5-4001-80b7-981633e05e1d", "numero_ideal": 10, "segmento": "infantil" }
  ]
}
```

### 3. Atualização Individual de Valores Ideais

Permite atualizar o valor ideal de um item específico em uma escola e segmento.

**Endpoint**: `PUT /estoque/numero-ideal/:id_escola/:id_item`

**Exemplo**:
```json
{
  "numero_ideal": 15,
  "segmento": "fundamental"
}
```

## Monitoramento e Alertas

O sistema utiliza os valores ideais para:

1. **Identificar itens abaixo do ideal**: Lista disponível via endpoint `/estoque/escola/:id_escola/abaixo-ideal`
2. **Gerar métricas**: Disponíveis via endpoint `/estoque/escola/:id_escola/metricas`
3. **Sugerir pedidos**: O sistema pode gerar sugestões de pedidos baseadas na diferença entre valores atuais e ideais

## Segmentação por Tipo de Escola

A segmentação por tipo de escola permite uma gestão mais precisa dos estoques, considerando as necessidades nutricionais específicas de cada faixa etária:

| Segmento | Características |
|----------|----------------|
| Infantil | Porções menores, maior variedade de nutrientes |
| Fundamental | Porções médias, balanceamento nutricional |
| Médio | Porções maiores, foco em energia e proteínas |
| EJA | Adaptado para educação de jovens e adultos |
| Escola (padrão) | Estoque geral da unidade escolar |

## Boas Práticas

1. **Estabelecer valores ideais realistas**: Baseados no histórico de consumo, número de alunos e cardápio
2. **Revisar periodicamente**: Atualizar valores ideais pelo menos a cada semestre
3. **Considerar sazonalidade**: Ajustar valores para períodos de férias, eventos escolares, etc.
4. **Diferenciar por segmento**: Aproveitar a capacidade do sistema de gerenciar valores ideais por segmento
5. **Usar importação em lote**: Para escolas com padrões similares, usar a importação em lote para agilizar a configuração

## Integração com Outros Módulos

- **Pedidos**: Os valores ideais orientam a geração automática de pedidos
- **Cardápios**: Mudanças nos cardápios podem demandar ajustes nos valores ideais
- **Relatórios**: Análise de discrepância entre valores ideais e reais

## Anexos e Referências

Para detalhes técnicos completos sobre os endpoints de API relacionados à gestão de estoque e valores ideais, consulte a [documentação da API de Estoque](./api/estoque.md).
