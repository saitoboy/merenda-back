# 🔄 Guia de Migração - Modelos Antigos → Novos

Este guia ajuda desenvolvedores a migrarem código que usava os modelos antigos para os novos modelos normalizados.

## 📋 Sumário de Mudanças

| Componente | Status | Ação Necessária |
|------------|--------|-----------------|
| `Escola` interface | ✅ Atualizada | Remover referências a `segmento_escola` |
| `Estoque` interface | ✅ Atualizada | Usar novos campos `id_estoque`, `id_segmento`, `id_periodo` |
| `EscolaModel` | ✅ Refatorado | Usar novas funções para gestão de segmentos |
| `EstoqueModel` | ✅ Refatorado | Adaptar para novo modelo com FKs |
| Banco de dados | ✅ Normalizado | Executar migrations |

## 🔄 Migração de Código

### 1. Interface Escola

#### ❌ Código Antigo
```typescript
interface Escola {
  id_escola: string;
  nome_escola: string;
  endereco_escola: string;
  email_escola: string;
  segmento_escola: string[]; // ❌ Campo removido
}

// Uso antigo
const escola: Escola = {
  id_escola: 'uuid',
  nome_escola: 'Escola A',
  endereco_escola: 'Rua A',
  email_escola: 'escola@edu.gov.br',
  segmento_escola: ['creche', 'pre-escola'] // ❌ Não existe mais
};
```

#### ✅ Código Novo
```typescript
import { Escola, EscolaComSegmentos } from '../types';

// Para dados básicos da escola
const escola: Escola = {
  id_escola: 'uuid',
  nome_escola: 'Escola A',
  endereco_escola: 'Rua A',
  email_escola: 'escola@edu.gov.br'
  // ✅ Segmentos gerenciados separadamente
};

// Para escola com segmentos
const escolaCompleta: EscolaComSegmentos = {
  id_escola: 'uuid',
  nome_escola: 'Escola A',
  endereco_escola: 'Rua A',
  email_escola: 'escola@edu.gov.br',
  segmentos: [
    { id_segmento: 'uuid-creche', nome_segmento: 'Creche' },
    { id_segmento: 'uuid-pre', nome_segmento: 'Pré-escola' }
  ]
};
```

### 2. Interface Estoque

#### ❌ Código Antigo
```typescript
interface Estoque {
  id_escola: string;
  id_item: string;
  segmento_estoque: string; // ❌ Campo removido
  quantidade_item: number;
  numero_ideal: number;
}

// Uso antigo
const estoque: Estoque = {
  id_escola: 'uuid-escola',
  id_item: 'uuid-item',
  segmento_estoque: 'creche', // ❌ Não existe mais
  quantidade_item: 100,
  numero_ideal: 150
};
```

#### ✅ Código Novo
```typescript
import { Estoque, CriarEstoque } from '../types';

// Para criação de estoque
const novoEstoque: CriarEstoque = {
  id_escola: 'uuid-escola',
  id_item: 'uuid-item',
  id_segmento: 'uuid-creche',      // ✅ FK para segmento
  id_periodo: 'uuid-periodo',      // ✅ FK para período
  quantidade_item: 100,
  numero_ideal: 150,
  validade: new Date('2025-12-31'), // ✅ Novo campo opcional
  observacao: 'Lote A123'          // ✅ Novo campo opcional
};

// Estoque completo (após criação)
const estoque: Estoque = {
  id_estoque: 'uuid-estoque',      // ✅ Nova PK
  id_escola: 'uuid-escola',
  id_item: 'uuid-item',
  id_segmento: 'uuid-creche',      // ✅ FK
  id_periodo: 'uuid-periodo',      // ✅ FK
  quantidade_item: 100,
  numero_ideal: 150,
  validade: new Date('2025-12-31'),
  observacao: 'Lote A123'
};
```

### 3. Funções do EscolaModel

#### ❌ Código Antigo
```typescript
// Buscar escolas por segmento (JSONB problemático)
const escolas = await connection('escola')
  .whereRaw("segmento_escola::jsonb @> ?::jsonb", [JSON.stringify(['creche'])])
  .select('*');

// Criar escola com segmentos (JSONB)
const escola = {
  nome_escola: 'Escola A',
  endereco_escola: 'Rua A',
  email_escola: 'escola@edu.gov.br',
  segmento_escola: ['creche', 'pre-escola'] // ❌ JSONB problemático
};
await EscolaModel.criar(escola);
```

#### ✅ Código Novo
```typescript
import * as EscolaModel from '../model/escola.model';

// Buscar escolas por segmento (JOIN otimizado)
const escolas = await EscolaModel.buscarPorSegmento('uuid-creche');

// Criar escola com segmentos (relacionamento normalizado)
const id_escola = await EscolaModel.criarComSegmentos(
  {
    nome_escola: 'Escola A',
    endereco_escola: 'Rua A',
    email_escola: 'escola@edu.gov.br'
  },
  ['uuid-creche', 'uuid-pre-escola'] // ✅ Array de UUIDs
);

// Buscar escola com segmentos
const escolaCompleta = await EscolaModel.buscarComSegmentos('uuid-escola');

// Gerenciar segmentos de uma escola
await EscolaModel.adicionarSegmento('uuid-escola', 'uuid-fundamental');
await EscolaModel.atualizarSegmentos('uuid-escola', ['uuid-creche', 'uuid-pre']);
```

### 4. Funções do EstoqueModel

#### ❌ Código Antigo
```typescript
// Buscar estoque por escola e segmento
const estoque = await EstoqueModel.buscar('uuid-escola', 'uuid-item', 'creche');

// Buscar estoque por escola
const estoques = await EstoqueModel.buscarPorEscola('uuid-escola');

// Atualizar quantidade
await EstoqueModel.atualizarQuantidade('uuid-escola', 'uuid-item', 200, 'creche');

// Criar estoque
await EstoqueModel.criar({
  id_escola: 'uuid-escola',
  id_item: 'uuid-item',
  segmento_estoque: 'creche', // ❌ Campo antigo
  quantidade_item: 100,
  numero_ideal: 150
});
```

#### ✅ Código Novo
```typescript
import * as EstoqueModel from '../model/estoque.model';

// Buscar estoque específico
const estoque = await EstoqueModel.buscar(
  'uuid-escola', 
  'uuid-item', 
  'uuid-segmento', 
  'uuid-periodo'
);

// Buscar estoque por escola com filtros
const estoques = await EstoqueModel.buscarPorEscola('uuid-escola', {
  id_segmento: 'uuid-creche',
  id_periodo: 'uuid-periodo-ativo'
});

// Buscar com dados relacionados
const estoquesCompletos = await EstoqueModel.buscarDetalhesEstoquePorEscola('uuid-escola', {
  id_segmento: 'uuid-creche'
});

// Atualizar por ID do estoque
await EstoqueModel.atualizarQuantidade('uuid-estoque', 200);

// Criar estoque
const id_estoque = await EstoqueModel.criar({
  id_escola: 'uuid-escola',
  id_item: 'uuid-item',
  id_segmento: 'uuid-creche',    // ✅ FK para segmento
  id_periodo: 'uuid-periodo',    // ✅ FK para período
  quantidade_item: 100,
  numero_ideal: 150,
  validade: new Date('2025-12-31'),
  observacao: 'Lote A123'
});
```

### 5. Métricas e Dashboard

#### ❌ Código Antigo
```typescript
// Métricas básicas
const metricas = await EstoqueModel.obterMetricasEstoque('uuid-escola');
// Retornava apenas: total_itens, itens_baixo_estoque, itens_proximos_validade
```

#### ✅ Código Novo
```typescript
// Métricas básicas (com filtros)
const metricas = await EstoqueModel.obterMetricasEstoque('uuid-escola', {
  id_segmento: 'uuid-creche'
});

// Métricas por segmento
const metricasPorSegmento = await EstoqueModel.obterMetricasPorSegmento('uuid-escola');
/*
Retorna:
[
  {
    id_segmento: 'uuid-creche',
    nome_segmento: 'Creche',
    total_itens: 25,
    itens_baixo_estoque: 5,
    itens_proximos_validade: 2
  }
]
*/

// Dashboard completo
const dashboard = await EstoqueModel.obterResumoDashboard('uuid-escola');
/*
Retorna:
{
  total_itens: 150,
  itens_baixo_estoque: 15,
  itens_proximos_validade: 8,
  segmentos_ativos: 3,          // ✅ Novo
  periodo_ativo: "Junho/2025"   // ✅ Novo
}
*/
```

## 🗄️ Migração de Dados

Para migrar dados existentes, execute as migrations:

```bash
# Executar todas as 11 migrations
npm run migrate

# Ou manualmente
node scripts/run-migrations.js
```

As migrations são **idempotentes** - podem ser executadas múltiplas vezes sem problemas.

## 🛠️ Novos Recursos Disponíveis

### 1. Gestão de Segmentos
```typescript
import * as SegmentoModel from '../model/segmento.model';

// Listar todos os segmentos
const segmentos = await SegmentoModel.listarTodos();

// Criar novo segmento
const id_segmento = await SegmentoModel.criar({
  nome_segmento: 'EJA',
  descricao_segmento: 'Educação de Jovens e Adultos'
});

// Buscar segmentos de uma escola
const segmentosEscola = await SegmentoModel.buscarPorEscola('uuid-escola');
```

### 2. Gestão de Períodos
```typescript
import * as PeriodoModel from '../model/periodo-lancamento.model';

// Buscar período ativo
const periodoAtivo = await PeriodoModel.buscarAtivo();

// Criar novo período
const id_periodo = await PeriodoModel.criar({
  nome_periodo: 'Julho/2025',
  data_inicio: new Date('2025-07-01'),
  data_fim: new Date('2025-07-31'),
  ativo: false
});

// Ativar período (desativa os outros)
await PeriodoModel.ativar('uuid-periodo');
```

### 3. Filtros Avançados
```typescript
// Buscar estoque com múltiplos filtros
const estoque = await EstoqueModel.buscarPorEscola('uuid-escola', {
  id_segmento: 'uuid-creche',
  id_periodo: 'uuid-periodo-ativo',
  quantidade_minima: 50,
  validade_proxima: new Date('2025-12-31')
});
```

## ❓ Dúvidas Frequentes

### Q: Onde estão os segmentos da escola agora?
**R:** Os segmentos agora são gerenciados via relacionamento N:N na tabela `escola_segmento`. Use `EscolaModel.buscarComSegmentos()` para obter uma escola com seus segmentos.

### Q: Como criar estoque para um segmento específico?
**R:** Use `EstoqueModel.criar()` passando o `id_segmento` e `id_periodo` junto com os outros dados.

### Q: O que aconteceu com o campo `segmento_estoque`?
**R:** Foi substituído por `id_segmento` (FK) que referencia a tabela `segmento`. Isso permite maior flexibilidade e integridade dos dados.

### Q: Preciso atualizar meu frontend?
**R:** Sim, APIs que retornavam `segmento_escola` array agora retornam objetos `Segmento` completos. Verifique as novas interfaces.

### Q: As migrations são seguras?
**R:** Sim, todas as migrations são idempotentes e incluem verificações de segurança. Dados existentes são migrados automaticamente.

---

Para mais detalhes, consulte a [documentação completa da Fase 1](./refatoracao-fase-1.md).
