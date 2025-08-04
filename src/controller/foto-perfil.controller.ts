import { Request, Response } from 'express';
import { logger } from '../utils';
import * as usuarioModel from '../model/usuario.model';
import { 
  uploadFotoPerfil, 
  excluirFotoPerfil, 
  listarFotosOrfas, 
  limparFotosOrfas, 
  obterEstatisticasUpload,
  uploadConfig 
} from '../services/foto-perfil.service';

/**
 * Controller para gerenciar fotos de perfil de usuários
 * Armazenamento local com exclusão automática da foto anterior
 */
export class FotoPerfilController {
  /**
   * Upload de foto de perfil via multipart/form-data
   * POST /usuario/foto-perfil
   */
  static async uploadFotoPerfil(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.usuario?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado' });
        return;
      }

      // Verificar se arquivo foi enviado
      if (!req.file) {
        res.status(400).json({ success: false, error: 'Nenhum arquivo foi enviado' });
        return;
      }

      // Verificar se usuário existe
      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        return;
      }

      // Fazer upload da foto
      const fotoUrl = await uploadFotoPerfil(userId, req.file);

      logger.info(`Upload concluído com sucesso para usuário ${userId}`, 'foto-perfil');
      res.status(200).json({
        success: true,
        message: 'Foto de perfil atualizada com sucesso',
        data: {
          fotoUrl: fotoUrl,
          usuario: {
            id: usuario.id_usuario,
            nome: `${usuario.nome_usuario} ${usuario.sobrenome_usuario}`
          }
        }
      });

    } catch (error: any) {
      logger.error(`Erro no upload: ${error.message}`, 'foto-perfil');
      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter foto de perfil do usuário logado
   * GET /usuario/foto-perfil
   */
  static async obterFotoPerfil(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.usuario?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado' });
        return;
      }

      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          fotoUrl: usuario.foto_perfil_url || null,
          temFoto: !!usuario.foto_perfil_url,
          usuario: {
            id: usuario.id_usuario,
            nome: `${usuario.nome_usuario} ${usuario.sobrenome_usuario}`
          }
        }
      });

    } catch (error: any) {
      logger.error('Erro ao obter foto de perfil', 'foto-perfil', error);
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Remover foto de perfil
   * DELETE /usuario/foto-perfil
   */
  static async removerFotoPerfil(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.usuario?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado' });
        return;
      }

      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        return;
      }

      if (!usuario.foto_perfil_url) {
        res.status(400).json({ success: false, error: 'Usuário não possui foto de perfil' });
        return;
      }

      // Excluir foto
      await excluirFotoPerfil(userId);

      logger.info(`Foto de perfil removida para usuário ${userId}`, 'foto-perfil');
      res.status(200).json({ 
        success: true, 
        message: 'Foto de perfil removida com sucesso' 
      });

    } catch (error: any) {
      logger.error(`Erro ao remover foto: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Obter foto de perfil de outro usuário (para admins ou próprio usuário)
   * GET /usuario/:id/foto-perfil
   */
  static async obterFotoPerfilUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuarioLogado = req.usuario;

      if (usuarioLogado?.tipo !== 'admin' && usuarioLogado?.id !== id) {
        res.status(403).json({ success: false, error: 'Acesso negado' });
        return;
      }

      const usuario = await usuarioModel.buscarPorId(id);
      if (!usuario) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          userId: usuario.id_usuario,
          nome: `${usuario.nome_usuario} ${usuario.sobrenome_usuario}`,
          fotoUrl: usuario.foto_perfil_url || null,
          temFoto: !!usuario.foto_perfil_url
        }
      });

    } catch (error: any) {
      logger.error(`Erro ao obter foto de usuário: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Listar fotos órfãs (admin)
   * GET /usuario/foto-perfil/orfas
   */
  static async listarFotosOrfas(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.usuario;
      if (!usuario || usuario.tipo !== 'admin') {
        res.status(403).json({ success: false, error: 'Acesso restrito a administradores' });
        return;
      }

      const fotosOrfas = await listarFotosOrfas();

      res.status(200).json({
        success: true,
        data: {
          total: fotosOrfas.length,
          arquivos: fotosOrfas
        }
      });

    } catch (error: any) {
      logger.error(`Erro ao listar fotos órfãs: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Limpar fotos órfãs (admin)
   * DELETE /usuario/foto-perfil/orfas
   */
  static async limparFotosOrfas(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.usuario;
      if (!usuario || usuario.tipo !== 'admin') {
        res.status(403).json({ success: false, error: 'Acesso restrito a administradores' });
        return;
      }

      const totalRemovidas = await limparFotosOrfas();

      res.status(200).json({
        success: true,
        message: `${totalRemovidas} fotos órfãs removidas com sucesso`,
        data: { totalRemovidas }
      });

    } catch (error: any) {
      logger.error(`Erro ao limpar fotos órfãs: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Obter estatísticas do sistema de upload (admin)
   * GET /usuario/foto-perfil/estatisticas
   */
  static async obterEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.usuario;
      if (!usuario || usuario.tipo !== 'admin') {
        res.status(403).json({ success: false, error: 'Acesso restrito a administradores' });
        return;
      }

      const estatisticas = await obterEstatisticasUpload();

      res.status(200).json({
        success: true,
        data: estatisticas
      });

    } catch (error: any) {
      logger.error(`Erro ao obter estatísticas: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Upload de foto de perfil via base64 (compatibilidade com frontend)
   * POST /usuario/foto-perfil/base64
   */
  static async uploadFotoPerfilBase64(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.usuario?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado' });
        return;
      }

      const { fileData, fileName, mimeType } = req.body;
      
      if (!fileData || !fileName || !mimeType) {
        res.status(400).json({ 
          success: false, 
          error: 'Dados obrigatórios: fileData (base64), fileName e mimeType' 
        });
        return;
      }

      // Verificar se usuário existe
      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        return;
      }

      // Converter base64 para buffer
      let buffer: Buffer;
      try {
        buffer = Buffer.from(fileData, 'base64');
      } catch (error) {
        res.status(400).json({ success: false, error: 'Dados da imagem inválidos (base64 esperado)' });
        return;
      }

      // Criar objeto file similar ao multer
      const file: Express.Multer.File = {
        buffer,
        originalname: fileName,
        mimetype: mimeType,
        size: buffer.length,
        fieldname: 'foto',
        encoding: '7bit',
        destination: '',
        filename: '',
        path: '',
        stream: null as any
      };

      // Fazer upload usando o serviço existente
      const fotoUrl = await uploadFotoPerfil(userId, file);

      logger.info(`Upload base64 concluído com sucesso para usuário ${userId}`, 'foto-perfil');
      res.status(200).json({
        success: true,
        message: 'Foto de perfil atualizada com sucesso',
        data: {
          fotoUrl: fotoUrl,
          usuario: {
            id: usuario.id_usuario,
            nome: `${usuario.nome_usuario} ${usuario.sobrenome_usuario}`
          }
        }
      });

    } catch (error: any) {
      logger.error(`Erro no upload base64: ${error.message}`, 'foto-perfil');
      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }
}

export default FotoPerfilController;
