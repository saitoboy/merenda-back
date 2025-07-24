-- Migration para permitir exclusão de usuário e valores nulos em criado_por
-- Executa apenas se necessário (idempotente)

DO $$
BEGIN
  -- Remove constraint se existir
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'periodo_lancamento_criado_por_fkey'
      AND table_name = 'periodo_lancamento'
  ) THEN
    EXECUTE 'ALTER TABLE periodo_lancamento DROP CONSTRAINT periodo_lancamento_criado_por_fkey';
  END IF;

  -- Remove NOT NULL se existir
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'periodo_lancamento'
      AND column_name = 'criado_por'
      AND is_nullable = 'NO'
  ) THEN
    EXECUTE 'ALTER TABLE periodo_lancamento ALTER COLUMN criado_por DROP NOT NULL';
  END IF;

  -- Adiciona constraint se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'periodo_lancamento_criado_por_fkey'
      AND table_name = 'periodo_lancamento'
  ) THEN
    EXECUTE 'ALTER TABLE periodo_lancamento ADD CONSTRAINT periodo_lancamento_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL';
  END IF;
END$$;
