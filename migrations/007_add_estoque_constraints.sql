-- Migration 007: Adicionar constraints na tabela estoque
-- Descrição: Primary key, foreign keys e constraints únicos

-- Remover primary key existente se houver
ALTER TABLE estoque DROP CONSTRAINT IF EXISTS estoque_pkey;

-- Definir primary key na nova coluna id_estoque
ALTER TABLE estoque ADD PRIMARY KEY (id_estoque);

-- Adicionar foreign keys
ALTER TABLE estoque ADD CONSTRAINT fk_estoque_periodo 
    FOREIGN KEY (id_periodo) REFERENCES periodo_lancamento(id_periodo);

ALTER TABLE estoque ADD CONSTRAINT fk_estoque_segmento 
    FOREIGN KEY (id_segmento) REFERENCES segmento(id_segmento);

-- Tornar campo obrigatório
ALTER TABLE estoque ALTER COLUMN id_segmento SET NOT NULL;

-- Constraint única: uma escola não pode ter o mesmo item no mesmo segmento no mesmo período
ALTER TABLE estoque ADD CONSTRAINT uk_escola_segmento_item_periodo 
    UNIQUE (id_escola, id_segmento, id_item, id_periodo);

-- Verificação: Conferir constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'estoque'::regclass
ORDER BY conname;
