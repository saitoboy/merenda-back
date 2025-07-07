import { Request, Response } from 'express';
import fotoPerfilService from '../services/foto-perfil.service';
import * as usuarioModel from '../model/usuario.model';
import { logger } from '../utils';

/**
 * Controller para gerenciar fotos de perfil de usuários
 * Recebe imagens em formato base64 via JSON
 */
export class FotoPerfilController {

  /**
   * Upload de foto de perfil
   * POST /usuario/foto-perfil
   * Body: { fileData: string, fileName: string, mimeType: string }
   */
  static async uploadFotoPerfil(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.usuario?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
        return;
      }

      const { fileData, fileName, mimeType } = req.body;

      // Validar dados recebidos
      if (!fileData || !fileName || !mimeType) {
        res.status(400).json({
          success: false,
          error: 'Dados obrigatórios: fileData (base64), fileName e mimeType'
        });
        return;
      }

      // Validar se é base64 válido
      let fileBuffer: Buffer;
      try {
        fileBuffer = Buffer.from(fileData, 'base64');
      } catch (error) {
        res.status(400).json({
          success: false,
          error: 'Dados da imagem inválidos (base64 esperado)'
        });
        return;
      }

      // Validar arquivo
      const validation = fotoPerfilService.validarArquivoImagem(mimeType, fileBuffer.length);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          error: validation.error
        });
        return;
      }

      // Buscar usuário para verificar se existe
      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
        return;
      }

      // Se já tem foto de perfil, remover a anterior
      if (usuario.foto_perfil_url) {
        const fileId = fotoPerfilService.extractFileIdFromUrl(usuario.foto_perfil_url);
        if (fileId) {
          logger.info(`Removendo foto anterior: ${fileId}`, 'foto-perfil');
          await fotoPerfilService.removerFotoPerfil(fileId, userId);
        }
      }

      // Fazer upload da nova foto
      logger.info(`Fazendo upload de nova foto para usuário ${userId}`, 'foto-perfil');
      const uploadResult = await fotoPerfilService.uploadFotoPerfil(
        fileBuffer,
        fileName,
        mimeType,
        userId
      );

      if (!uploadResult.success) {
        res.status(500).json({
          success: false,
          error: uploadResult.error || 'Erro no upload da imagem'
        });
        return;
      }

      // Atualizar URL no banco de dados
      const fotoUrl = uploadResult.webContentLink || uploadResult.webViewLink;
      await fotoPerfilService.atualizarFotoPerfilDB(userId, fotoUrl);

      logger.success(`Upload concluído com sucesso para usuário ${userId}`, 'foto-perfil');

      res.status(200).json({
        success: true,
        message: 'Foto de perfil atualizada com sucesso',
        data: {
          fileId: uploadResult.fileId,
          fileName: uploadResult.fileName,
          fotoUrl: fotoUrl,
          webViewLink: uploadResult.webViewLink,
          webContentLink: uploadResult.webContentLink
        }
      });

    } catch (error: any) {
      logger.error(`Erro no upload: ${error.message}`, 'foto-perfil');
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
        return;
      }

      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          fotoUrl: usuario.foto_perfil_url || null,
          temFoto: !!usuario.foto_perfil_url
        }
      });

    } catch (error: any) {
      logger.error('Erro ao obter foto de perfil', 'foto-perfil', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
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
        res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
        return;
      }

      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
        return;
      }

      if (!usuario.foto_perfil_url) {
        res.status(400).json({
          success: false,
          error: 'Usuário não possui foto de perfil'
        });
        return;
      }

      // Extrair fileId da URL
      const fileId = fotoPerfilService.extractFileIdFromUrl(usuario.foto_perfil_url);
      if (!fileId) {
        logger.warning(`Não foi possível extrair fileId da URL: ${usuario.foto_perfil_url}`, 'foto-perfil');
        // Mesmo assim, remover do banco
        await fotoPerfilService.atualizarFotoPerfilDB(userId, null);
        
        res.status(200).json({
          success: true,
          message: 'Foto removida do perfil (arquivo pode não ter sido removido do Drive)',
          warning: 'Não foi possível identificar o arquivo no Google Drive'
        });
        return;
      }

      // Remover do Google Drive
      logger.info(`Removendo foto do Drive: ${fileId}`, 'foto-perfil');
      const removeResult = await fotoPerfilService.removerFotoPerfil(fileId, userId);

      // Remover do banco independentemente do resultado do Drive
      await fotoPerfilService.atualizarFotoPerfilDB(userId, null);

      if (removeResult.success) {
        res.status(200).json({
          success: true,
          message: 'Foto de perfil removida com sucesso'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Foto removida do perfil, mas houve erro na remoção do Drive',
          warning: removeResult.error
        });
      }

    } catch (error: any) {
      logger.error(`Erro ao remover foto: ${error.message}`, 'foto-perfil');
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter foto de perfil de outro usuário (para admins)
   * GET /usuario/:id/foto-perfil
   */
  static async obterFotoPerfilUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuarioLogado = req.usuario;

      // Verificar se é admin ou se está consultando próprio perfil
      if (usuarioLogado?.tipo !== 'admin' && usuarioLogado?.id !== id) {
        res.status(403).json({
          success: false,
          error: 'Acesso negado'
        });
        return;
      }

      const usuario = await usuarioModel.buscarPorId(id);
      if (!usuario) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
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
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Testar se o Google Apps Script está funcionando
   * GET /usuario/foto-perfil/status
   */
  static async testarGoogleAppsScript(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Testando Google Apps Script via controller', 'foto-perfil');
      
      // Usar o service para testar a conexão
      const testResult = await fotoPerfilService.testarConexao();

      if (testResult.success) {
        res.status(200).json({
          success: true,
          message: 'Google Apps Script está online',
          data: testResult.data
        });
      } else {
        res.status(500).json({
          success: false,
          error: testResult.error || 'Google Apps Script não está acessível'
        });
      }

    } catch (error: any) {
      logger.error(`Erro no teste do Google Apps Script: ${error.message}`, 'foto-perfil');
      res.status(500).json({
        success: false,
        error: 'Google Apps Script não está acessível',
        details: error.message
      });
    }
  }
}

export default FotoPerfilController;
