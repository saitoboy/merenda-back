-- Migration 009: Inserir período de teste
-- Descrição: Adicionar período de junho/2025 para testes

INSERT INTO periodo_lancamento (
    mes, 
    ano, 
    data_referencia, 
    data_inicio, 
    data_fim, 
    ativo, 
    criado_por, 
    created_at, 
    updated_at
) VALUES (
    6,                                           -- junho
    2025,                                        -- ano
    '2025-07-04',                               -- data_referencia (4 de julho)
    '2025-06-01',                               -- data_inicio (01 de junho)
    '2025-06-15',                               -- data_fim (15 de junho)
    true,                                       -- ativo
    '8949ccab-f799-4adb-ad3f-4099bebb2916',    -- criado_por (usuário admin)
    NOW(),                                      -- created_at (agora)
    NOW()                                       -- updated_at (agora)
)
ON CONFLICT (mes, ano) DO NOTHING;              -- Evita duplicação se já existir

-- Verificação: Mostrar período criado
SELECT 
    id_periodo,
    mes,
    ano,
    data_referencia,
    data_inicio,
    data_fim,
    ativo
FROM periodo_lancamento 
WHERE mes = 6 AND ano = 2025;
