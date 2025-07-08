import { Request, Response, NextFunction } from 'express';
import { verificarToken, temPermissao } from '../utils';
import { TipoUsuario } from '../types';

// Interface para estender o tipo Request do Express e incluir o objeto de usuário autenticado
declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: string;
        nome: string;
        email: string;
        tipo: TipoUsuario;
        id_escola?: string;
      };
    }
  }
}

// Middleware para verificar se o usuário está autenticado
export const autenticar = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        status: 'erro',
        mensagem: 'Token não fornecido'
      });
      return;
    }
    
    const token = authHeader.split(' ')[1]; // Formato: Bearer <token>
    
    if (!token) {
      res.status(401).json({
        status: 'erro',
        mensagem: 'Token não fornecido'
      });
      return;
    }
    
    const usuarioDecodificado = verificarToken(token);
    req.usuario = {
      id: usuarioDecodificado.id,
      nome: usuarioDecodificado.nome,
      email: usuarioDecodificado.email,
      tipo: usuarioDecodificado.tipo,
      ...(usuarioDecodificado.id_escola && { id_escola: usuarioDecodificado.id_escola })
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      status: 'erro',
      mensagem: 'Token inválido ou expirado'
    });
    return;
  }
};

// Middleware para verificar permissões de acordo com o tipo de usuário
export const autorizarPor = (tiposPermitidos: TipoUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.usuario) {
        res.status(401).json({
          status: 'erro',
          mensagem: 'Usuário não autenticado'
        });
        return;
      }
      
      if (!temPermissao(req.usuario.tipo, tiposPermitidos)) {
        res.status(403).json({
          status: 'erro',
          mensagem: 'Acesso negado. Você não possui permissão para acessar este recurso.'
        });
        return;
      }
      
      next();
    } catch (error) {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao verificar permissões'
      });
      return;
    }
  };
};