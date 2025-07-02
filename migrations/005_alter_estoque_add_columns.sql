-- Migration 005: Adicionar colunas na tabela estoque
-- Descrição: Adicionar id_estoque, id_periodo e id_segmento

-- Adicionar novas colunas
ALTER TABLE estoque ADD COLUMN id_estoque UUID DEFAULT gen_random_uuid();
ALTER TABLE estoque ADD COLUMN id_periodo UUID;
ALTER TABLE estoque ADD COLUMN id_segmento UUID;
