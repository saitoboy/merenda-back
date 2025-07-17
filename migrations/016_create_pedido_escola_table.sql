-- Migration 016: Criação da tabela pedido_escola para auditoria de lançamentos de estoque
CREATE TABLE pedido_escola (
    id_pedido_escola UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by VARCHAR(255) NOT NULL, -- nome da escola
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_periodo UUID NOT NULL REFERENCES periodo_lancamento(id_periodo),
    id_usuario UUID NOT NULL REFERENCES usuario(id_usuario),
    id_escola UUID NOT NULL REFERENCES escola(id_escola)
);
