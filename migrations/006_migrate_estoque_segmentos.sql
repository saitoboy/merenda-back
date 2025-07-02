-- Migration 006: Migrar segmento_estoque para id_segmento
-- Descrição: Preencher id_segmento baseado no segmento_estoque

-- Preencher id_segmento baseado no segmento_estoque atual
UPDATE estoque SET id_segmento = (
    SELECT id_segmento FROM segmento 
    WHERE nome_segmento = estoque.segmento_estoque
);

-- Verificação: Conferir migração
SELECT 
    segmento_estoque,
    COUNT(*) as total_linhas,
    COUNT(id_segmento) as migradas,
    COUNT(*) - COUNT(id_segmento) as falhas
FROM estoque 
GROUP BY segmento_estoque
ORDER BY segmento_estoque;

-- Verificar se existem segmentos não migrados
SELECT DISTINCT segmento_estoque 
FROM estoque 
WHERE id_segmento IS NULL;
