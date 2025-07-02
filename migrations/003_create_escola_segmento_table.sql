-- Migration 003: Criar tabela escola_segmento
-- Descrição: Relacionamento N:N entre escolas e segmentos

CREATE TABLE escola_segmento (
    id_escola UUID NOT NULL,
    id_segmento UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    PRIMARY KEY (id_escola, id_segmento),
    FOREIGN KEY (id_escola) REFERENCES escola(id_escola) ON DELETE CASCADE,
    FOREIGN KEY (id_segmento) REFERENCES segmento(id_segmento) ON DELETE CASCADE
);

-- Verificação
SELECT 
    e.nome_escola,
    s.nome_segmento
FROM escola_segmento es
JOIN escola e ON es.id_escola = e.id_escola
JOIN segmento s ON es.id_segmento = s.id_segmento
ORDER BY e.nome_escola, s.nome_segmento;
