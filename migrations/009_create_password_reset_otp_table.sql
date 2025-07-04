-- Migration: 009_create_password_reset_otp_table.sql
-- Descrição: Cria tabela para armazenar códigos OTP temporários para redefinição de senha
-- Data: $(date)

-- Verifica se a tabela já existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'password_reset_otp') THEN
        
        RAISE NOTICE '📧 Criando tabela password_reset_otp...';
        
        CREATE TABLE password_reset_otp (
            id_otp UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            id_usuario UUID NOT NULL, -- Referência ao usuário
            email_usuario VARCHAR(100) NOT NULL, -- Mantido para facilitar logs e verificações
            codigo_otp VARCHAR(6) NOT NULL, -- Código de 6 dígitos
            tentativas INTEGER DEFAULT 0, -- Contador de tentativas de verificação
            usado BOOLEAN DEFAULT FALSE, -- Se o OTP já foi usado
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data_expiracao TIMESTAMP NOT NULL, -- OTP expira em X minutos
            
            -- Foreign Key para garantir integridade
            CONSTRAINT fk_password_reset_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
            
            -- Constraint única para usuário + código
            CONSTRAINT idx_usuario_otp UNIQUE (id_usuario, codigo_otp)
        );
        
        -- Criar índices para performance
        CREATE INDEX IF NOT EXISTS idx_password_reset_id_usuario ON password_reset_otp(id_usuario);
        CREATE INDEX IF NOT EXISTS idx_password_reset_email_usuario ON password_reset_otp(email_usuario);
        CREATE INDEX IF NOT EXISTS idx_password_reset_codigo_otp ON password_reset_otp(codigo_otp);
        CREATE INDEX IF NOT EXISTS idx_password_reset_data_expiracao ON password_reset_otp(data_expiracao);
        
        -- Comentários descritivos
        COMMENT ON TABLE password_reset_otp IS 'Tabela para armazenar códigos OTP temporários para redefinição de senha';
        COMMENT ON COLUMN password_reset_otp.id_otp IS 'Identificador único do OTP';
        COMMENT ON COLUMN password_reset_otp.id_usuario IS 'Referência ao usuário que solicitou a redefinição';
        COMMENT ON COLUMN password_reset_otp.email_usuario IS 'Email do usuário (para logs e verificações)';
        COMMENT ON COLUMN password_reset_otp.codigo_otp IS 'Código OTP de 6 dígitos';
        COMMENT ON COLUMN password_reset_otp.tentativas IS 'Número de tentativas de verificação do código';
        COMMENT ON COLUMN password_reset_otp.usado IS 'Indica se o OTP já foi utilizado';
        COMMENT ON COLUMN password_reset_otp.data_criacao IS 'Data e hora de criação do OTP';
        COMMENT ON COLUMN password_reset_otp.data_expiracao IS 'Data e hora de expiração do OTP';
        
        RAISE NOTICE '✅ Tabela password_reset_otp criada com sucesso!';
        
    ELSE
        RAISE NOTICE '⚠️  Tabela password_reset_otp já existe, pulando criação...';
    END IF;
END
$$;
