-- Migration 014: Criação da tabela auditoria_pedido
CREATE TABLE auditoria_pedido (
    id_auditoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_periodo UUID NOT NULL,
    CONSTRAINT fk_periodo_auditoria FOREIGN KEY (id_periodo) REFERENCES periodo_lancamento(id_periodo),
    CONSTRAINT fk_usuario_auditoria FOREIGN KEY (created_by) REFERENCES usuario(id_usuario)
);
