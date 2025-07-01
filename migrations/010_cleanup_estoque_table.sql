-- Migration 010: Remover coluna segmento_estoque obsoleta
-- Descrição: Limpar tabela estoque removendo campo desnormalizado

-- Remover a coluna segmento_estoque (agora usamos id_segmento normalizado)
ALTER TABLE estoque DROP COLUMN IF EXISTS segmento_estoque;

-- Verificação: Confirmar que a coluna foi removida
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'estoque' AND column_name = 'segmento_estoque';
-- (Deve retornar vazio)
