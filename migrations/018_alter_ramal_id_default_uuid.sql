-- Migration para garantir geração automática de UUID em ramal
DO $$
BEGIN
  -- Cria extensão se necessário
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    CREATE EXTENSION pgcrypto;
  END IF;

  -- Só altera se ainda não for default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ramal' 
      AND column_name = 'id_ramal' 
      AND column_default LIKE '%gen_random_uuid%'
  ) THEN
    EXECUTE 'ALTER TABLE ramal ALTER COLUMN id_ramal SET DEFAULT gen_random_uuid()';
  END IF;
END$$;
