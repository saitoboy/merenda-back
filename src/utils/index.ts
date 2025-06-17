import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { TipoUsuario } from '../types';
import logger from './logger';

// Gerenciamento de tokens JWT
export const gerarToken = (usuario: { id_usuario: string; email_usuario: string; tipo: TipoUsuario }): string => {
  const secret = process.env.JWT_SECRET || 'merenda-smart-flow-secret';
  const token = jwt.sign(
    {
      id: usuario.id_usuario,
      email: usuario.email_usuario,
      tipo: usuario.tipo
    },
    secret,
    { expiresIn: '12h' }
  );
  return token;
};

export const verificarToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || 'merenda-smart-flow-secret';
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
};

// Gerenciamento de senhas
export const criptografarSenha = async (senha: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(senha, saltRounds);
};

export const compararSenha = async (senha: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(senha, hash);
};

// Verificação de permissões baseada em tipo de usuário
export const temPermissao = (tipoUsuario: TipoUsuario, tiposPermitidos: TipoUsuario[]): boolean => {
  return tiposPermitidos.includes(tipoUsuario);
};

// Formatação de datas
export const formatarData = (data: Date): string => {
  return data.toLocaleDateString('pt-BR');
};

// Funções auxiliares para estoque
export const estoqueBaixo = (quantidade: number, numeroIdeal: number): boolean => {
  return quantidade < numeroIdeal * 0.5; // 50% do ideal ou menos é considerado baixo
};

// Função para calcular validade próxima (em dias)
export const validadeProxima = (dataValidade: Date, dias: number = 7): boolean => {
  if (!dataValidade) return false;
  
  const hoje = new Date();
  const diasDiferenca = Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  return diasDiferenca >= 0 && diasDiferenca <= dias;
};

// Gerar UUID v4
export const gerarUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Exportar logger
export { default as logger } from './logger';
