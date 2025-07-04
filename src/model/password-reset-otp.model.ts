import connection from '../connection';
import { PasswordResetOTP } from '../types';

const table = 'password_reset_otp';

// Criar novo OTP
export const criar = async (otp: Omit<PasswordResetOTP, 'id_otp'>): Promise<string> => {
  const [result] = await connection(table)
    .insert(otp)
    .returning('id_otp');
  
  return result.id_otp;
};

// Buscar OTP válido por usuário e código
export const buscarPorUsuarioECodigo = async (
  id_usuario: string, 
  codigo_otp: string
): Promise<PasswordResetOTP | undefined> => {
  const otp = await connection(table)
    .where({ 
      id_usuario, 
      codigo_otp,
      usado: false
    })
    .where('data_expiracao', '>', new Date()) // Não expirado
    .orderBy('data_criacao', 'desc') // Mais recente primeiro
    .first();
  
  return otp;
};

// Buscar último OTP válido por usuário (para controle de rate limiting)
export const buscarUltimoPorUsuario = async (
  id_usuario: string
): Promise<PasswordResetOTP | undefined> => {
  const otp = await connection(table)
    .where({ id_usuario })
    .where('data_expiracao', '>', new Date()) // Não expirado
    .orderBy('data_criacao', 'desc')
    .first();
  
  return otp;
};

// Incrementar tentativas de um OTP
export const incrementarTentativas = async (id_otp: string): Promise<void> => {
  await connection(table)
    .where({ id_otp })
    .increment('tentativas', 1);
};

// Marcar OTP como usado
export const marcarComoUsado = async (id_otp: string): Promise<void> => {
  await connection(table)
    .where({ id_otp })
    .update({ usado: true });
};

// Invalidar todos os OTPs ativos de um usuário
export const invalidarOTPsAtivos = async (id_usuario: string): Promise<void> => {
  await connection(table)
    .where({ 
      id_usuario,
      usado: false
    })
    .where('data_expiracao', '>', new Date())
    .update({ usado: true });
};

// Limpar OTPs expirados (para limpeza de rotina)
export const limparExpirados = async (): Promise<number> => {
  const deletedCount = await connection(table)
    .where('data_expiracao', '<=', new Date())
    .orWhere('usado', true)
    .delete();
  
  return deletedCount;
};

// Contar tentativas por usuário nas últimas horas (para rate limiting)
export const contarTentativasRecentes = async (
  id_usuario: string, 
  horasAtras: number = 1
): Promise<number> => {
  const dataLimite = new Date();
  dataLimite.setHours(dataLimite.getHours() - horasAtras);
  
  const result = await connection(table)
    .where({ id_usuario })
    .where('data_criacao', '>=', dataLimite)
    .count('* as total')
    .first();
  
  return Number(result?.total || 0);
};
