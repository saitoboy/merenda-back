import { Request, Response } from 'express';
import fotoPerfilService from '../services/foto-perfil.service';
import * as usuarioModel from '../model/usuario.model';
import { logger } from '../utils';

/**
 * Controller para gerenciar fotos de perfil de usuários
 * Recebe imagens em formato base64 via JSON
 * Integração com WordPress REST API
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
        res.status(401).json({ success: false, error: 'Usuário não autenticado' });
        return;
      }
      const { fileData, fileName, mimeType } = req.body;
      if (!fileData || !fileName || !mimeType) {
        res.status(400).json({ success: false, error: 'Dados obrigatórios: fileData (base64), fileName e mimeType' });
        return;
      }
      let fileBuffer: Buffer;
      try {
        fileBuffer = Buffer.from(fileData, 'base64');
      } catch (error) {
        res.status(400).json({ success: false, error: 'Dados da imagem inválidos (base64 esperado)' });
        return;
      }
      const validation = fotoPerfilService.validarArquivoImagem(mimeType, fileBuffer.length);
      if (!validation.valid) {
        res.status(400).json({ success: false, error: validation.error });
        return;
      }
      const usuario = await usuarioModel.buscarPorId(userId);
      if (!usuario) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        return;
      }
      // Se já tem foto de perfil, remover a anterior (WordPress: salva o ID do anexo na URL ou campo separado)
      let previousFileId: string | null = null;
      if (usuario.foto_perfil_url) {
        previousFileId = fotoPerfilService.extractFileIdFromUrl(usuario.foto_perfil_url);
        if (previousFileId) {
          logger.info(`Removendo foto anterior do WordPress: ${previousFileId}`, 'foto-perfil');
          await fotoPerfilService.removerFotoPerfil(previousFileId, userId);
        }
      }
      // Fazer upload da nova foto
      logger.info(`Fazendo upload de nova foto para usuário ${userId} (WordPress)`, 'foto-perfil');
      const uploadResult = await fotoPerfilService.uploadFotoPerfil(
        fileBuffer,
        fileName,
        mimeType,
        userId
      );
      if (!uploadResult.success) {
        res.status(500).json({ success: false, error: uploadResult.error || 'Erro no upload da imagem' });
        return;
      }
      // Atualizar URL no banco de dados
      const fotoUrl = uploadResult.fotoUrl || null;
      await fotoPerfilService.atualizarFotoPerfilDB(userId, fotoUrl);
      logger.success(`Upload concluído com sucesso para usuário ${userId} (WordPress)`, 'foto-perfil');
      res.status(200).json({
        success: true,
        message: 'Foto de perfil atualizada com sucesso',
        data: {
          fileId: uploadResult.fileId,
          fileName: uploadResult.fileName,
          fotoUrl: fotoUrl
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
          temFoto: !!usuario.foto_perfil_url
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
      // Extrair fileId da URL do WordPress
      const fileId = fotoPerfilService.extractFileIdFromUrl(usuario.foto_perfil_url);
      if (!fileId) {
        logger.warning(`Não foi possível extrair fileId da URL: ${usuario.foto_perfil_url}`, 'foto-perfil');
        await fotoPerfilService.atualizarFotoPerfilDB(userId, null);
        res.status(200).json({
          success: true,
          message: 'Foto removida do perfil (arquivo pode não ter sido removido do WordPress)',
          warning: 'Não foi possível identificar o arquivo no WordPress'
        });
        return;
      }
      // Remover do WordPress
      logger.info(`Removendo foto do WordPress: ${fileId}`, 'foto-perfil');
      const removeResult = await fotoPerfilService.removerFotoPerfil(fileId, userId);
      await fotoPerfilService.atualizarFotoPerfilDB(userId, null);
      if (removeResult.success) {
        res.status(200).json({ success: true, message: 'Foto de perfil removida com sucesso' });
      } else {
        res.status(200).json({
          success: true,
          message: 'Foto removida do perfil, mas houve erro na remoção do WordPress',
          warning: removeResult.error
        });
      }
    } catch (error: any) {
      logger.error(`Erro ao remover foto: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
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
   * Testar se a integração com o WordPress está funcionando
   * GET /usuario/foto-perfil/status
   */
  static async testarWordPress(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Testando integração com WordPress via controller', 'foto-perfil');
      const testResult = await fotoPerfilService.testarConexao();
      if (testResult.success) {
        res.status(200).json({ success: true, message: 'WordPress está online', data: testResult.data });
      } else {
        res.status(500).json({ success: false, error: testResult.error || 'WordPress não está acessível' });
      }
    } catch (error: any) {
      logger.error(`Erro no teste do WordPress: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'WordPress não está acessível', details: error.message });
    }
  }

  /**
   * Listar todas as mídias do WordPress (admin)
   * GET /usuario/foto-perfil/midias?page=1&perPage=20
   */
  static async listarMidiasWordPress(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.usuario;
      if (!usuario || usuario.tipo !== 'admin') {
        res.status(403).json({ success: false, error: 'Acesso restrito a administradores' });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 20;
      const result = await fotoPerfilService.listarMidiasWordPress(page, perPage);
      if (result.success) {
        res.status(200).json({ success: true, data: result.data });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error: any) {
      logger.error(`Erro ao listar mídias: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Buscar mídia do WordPress por ID (admin)
   * GET /usuario/foto-perfil/midia/:id
   */
  static async buscarMidiaPorId(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.usuario;
      if (!usuario || usuario.tipo !== 'admin') {
        res.status(403).json({ success: false, error: 'Acesso restrito a administradores' });
        return;
      }
      const { id } = req.params;
      const result = await fotoPerfilService.buscarMidiaPorId(id);
      if (result.success) {
        res.status(200).json({ success: true, data: result.data });
      } else {
        res.status(404).json({ success: false, error: result.error });
      }
    } catch (error: any) {
      logger.error(`Erro ao buscar mídia: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  /**
   * Deletar mídia do WordPress por ID (admin)
   * DELETE /usuario/foto-perfil/midia/:id
   */
  static async deletarMidiaPorId(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.usuario;
      if (!usuario || usuario.tipo !== 'admin') {
        res.status(403).json({ success: false, error: 'Acesso restrito a administradores' });
        return;
      }
      const { id } = req.params;
      const result = await fotoPerfilService.removerFotoPerfil(id, usuario.id);
      if (result.success) {
        res.status(200).json({ success: true, message: result.message });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error: any) {
      logger.error(`Erro ao deletar mídia: ${error.message}`, 'foto-perfil');
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }
}

export default FotoPerfilController;
