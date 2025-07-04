-- Migration 011: Remover coluna obsoleta segmento_escola da tabela escola
-- Descrição: Remove a coluna segmento_escola após migração para modelo normalizado

-- Verificação inicial: verificar se a coluna ainda existe
DO $$
BEGIN
    -- Se a coluna não existe mais, pular a migration
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'escola' 
        AND column_name = 'segmento_escola'
    ) THEN
        RAISE NOTICE '⏭️  Coluna segmento_escola já foi removida anteriormente, pulando migration...';
        RETURN;
    END IF;
    
    RAISE NOTICE '📧 Coluna segmento_escola encontrada, iniciando processo de remoção...';
    
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
    
    -- Remover a coluna segmento_escola da tabela escola
    ALTER TABLE escola DROP COLUMN segmento_escola;
    
    -- Verificação final: confirmar que a coluna foi removida
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'escola' 
        AND column_name = 'segmento_escola'
    ) THEN
        RAISE EXCEPTION 'ERRO: Coluna segmento_escola ainda existe na tabela escola';
    ELSE
        RAISE NOTICE '✅ SUCESSO: Coluna segmento_escola removida da tabela escola';
    END IF;
END $$;
