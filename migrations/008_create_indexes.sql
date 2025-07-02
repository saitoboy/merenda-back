-- Migration 008: Criar índices para performance
-- Descrição: Índices para otimizar consultas frequentes

-- Índices para tabela estoque
CREATE INDEX idx_estoque_escola ON estoque(id_escola);
CREATE INDEX idx_estoque_item ON estoque(id_item);
CREATE INDEX idx_estoque_periodo ON estoque(id_periodo);
CREATE INDEX idx_estoque_segmento ON estoque(id_segmento);

-- Índices para tabela periodo_lancamento
CREATE INDEX idx_periodo_ativo ON periodo_lancamento(ativo);
CREATE INDEX idx_periodo_mes_ano ON periodo_lancamento(mes, ano);

-- Índices para tabela escola_segmento
CREATE INDEX idx_escola_segmento_escola ON escola_segmento(id_escola);
CREATE INDEX idx_escola_segmento_segmento ON escola_segmento(id_segmento);

-- Verificação: Listar índices criados
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('estoque', 'periodo_lancamento', 'escola_segmento', 'segmento')
ORDER BY tablename, indexname;
