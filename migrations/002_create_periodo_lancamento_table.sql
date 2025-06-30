-- Migration 002: Criar tabela periodo_lancamento
-- Descrição: Sistema de períodos globais para lançamento de estoque

CREATE TABLE periodo_lancamento (
    id_periodo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mes INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    data_referencia DATE NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN DEFAULT FALSE,
    criado_por UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(mes, ano),
    FOREIGN KEY (criado_por) REFERENCES usuario(id_usuario)
);

-- Verificação
SELECT * FROM periodo_lancamento ORDER BY ano DESC, mes DESC;
