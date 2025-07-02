-- Migration 004: Migrar dados escola para escola_segmento
-- Descrição: Migrar array segmento_escola para tabela normalizada

-- Migrar dados do array JSONB para a tabela de relacionamento
INSERT INTO escola_segmento (id_escola, id_segmento)
SELECT 
    e.id_escola,
    s.id_segmento
FROM escola e
CROSS JOIN LATERAL jsonb_array_elements_text(e.segmento_escola) AS seg_nome
JOIN segmento s ON s.nome_segmento = seg_nome;

-- Verificação: Comparar dados antigos com novos
SELECT 
    e.nome_escola,
    e.segmento_escola as array_antigo,
    array_agg(s.nome_segmento ORDER BY s.nome_segmento) as segmentos_novos
FROM escola e
LEFT JOIN escola_segmento es ON e.id_escola = es.id_escola
LEFT JOIN segmento s ON es.id_segmento = s.id_segmento
GROUP BY e.id_escola, e.nome_escola, e.segmento_escola
ORDER BY e.nome_escola;
