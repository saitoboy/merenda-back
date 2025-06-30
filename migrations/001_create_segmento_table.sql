-- Migration 001: Criar tabela segmento
-- Descrição: Normalização dos segmentos das escolas

CREATE TABLE segmento (
    id_segmento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_segmento VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir segmentos padrão
INSERT INTO segmento (nome_segmento) VALUES 
('creche'),
('escola'),
('brasil alfabetizado'),
('proeja');

-- Verificação
SELECT * FROM segmento ORDER BY nome_segmento;
