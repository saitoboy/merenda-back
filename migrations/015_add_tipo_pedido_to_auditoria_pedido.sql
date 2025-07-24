-- Migration 015: Adiciona coluna tipo_pedido à tabela auditoria_pedido
ALTER TABLE auditoria_pedido
ADD COLUMN tipo_pedido VARCHAR(255);
