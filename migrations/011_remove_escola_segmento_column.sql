-- Migration 011: Remover coluna obsoleta segmento_escola da tabela escola
-- Descrição: Remove a coluna segmento_escola após migração para modelo normalizado

-- Verificação prévia: confirmar que dados foram migrados
DO $$
BEGIN
    -- Verificar se existem dados na tabela escola_segmento
    IF NOT EXISTS (SELECT 1 FROM escola_segmento LIMIT 1) THEN
        RAISE EXCEPTION 'ERRO: Tabela escola_segmento está vazia. Execute primeiro as migrations de migração de dados.';
    END IF;
    
    -- Verificar se todas as escolas têm pelo menos um segmento
    IF EXISTS (
        SELECT 1 FROM escola e 
        WHERE NOT EXISTS (
            SELECT 1 FROM escola_segmento es 
            WHERE es.id_escola = e.id_escola
        )
    ) THEN
        RAISE NOTICE 'AVISO: Existem escolas sem segmentos na tabela normalizada';
    END IF;
    
    RAISE NOTICE 'Verificação passou - prosseguindo com remoção da coluna segmento_escola';
END $$;

-- Remover a coluna segmento_escola da tabela escola
ALTER TABLE escola DROP COLUMN IF EXISTS segmento_escola;

-- Verificação final: confirmar que a coluna foi removida
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'escola' 
        AND column_name = 'segmento_escola'
    ) THEN
        RAISE EXCEPTION 'ERRO: Coluna segmento_escola ainda existe na tabela escola';
    ELSE
        RAISE NOTICE 'SUCESSO: Coluna segmento_escola removida da tabela escola';
    END IF;
END $$;
