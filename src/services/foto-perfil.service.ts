import * as usuarioModel from '../model/usuario.model';
import { logger } from '../utils';
import { UploadFotoResponse, RemoveFotoResponse } from '../types';

interface FotoPerfilServiceConfig {
  wpUrl: string;
  wpUser: string;
  wpAppPassword: string;
}

/**
 * Service para gerenciar fotos de perfil de usuários
 * Integra com WordPress REST API para upload/remoção
 */
export class FotoPerfilService {
  private readonly wpUrl: string;
  private readonly wpUser: string;
  private readonly wpAppPassword: string;

  constructor() {
    this.wpUrl = process.env.WP_URL!;
    this.wpUser = process.env.WP_USER!;
    this.wpAppPassword = process.env.WP_APP_PASSWORD!;

    if (!this.wpUrl || !this.wpUser || !this.wpAppPassword) {
      throw new Error('Configuração do WordPress ausente no .env');
    }
  }

  /**
   * Faz upload de uma foto de perfil para o WordPress
   * @param fileBuffer Buffer da imagem
   * @param fileName Nome do arquivo
   * @param mimeType Tipo MIME do arquivo
   * @param userId ID do usuário (para organização)
   * @returns Promise com resposta do upload
   */
  async uploadFotoPerfil(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    userId: string
  ): Promise<UploadFotoResponse> {
    try {
      // Criar nome único para o arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const uniqueFileName = `perfil_${userId}_${timestamp}_${fileName}`;

      logger.info(`Iniciando upload para usuário ${userId}, arquivo: ${uniqueFileName}`, 'foto-perfil');

      // Montar endpoint do WordPress
      const endpoint = `${this.wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/media`;
      const auth = Buffer.from(`${this.wpUser}:${this.wpAppPassword}`).toString('base64');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Disposition': `attachment; filename="${uniqueFileName}"`,
          'Content-Type': mimeType,
        },
        body: fileBuffer,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Erro HTTP WordPress: ${response.status} - ${errorText}`, 'foto-perfil');
        return {
          success: false,
          error: `Erro HTTP WordPress: ${response.status} - ${errorText}`
        };
      }

      const responseData = await response.json();
      logger.success('Upload concluído com sucesso no WordPress', 'foto-perfil', responseData);

      return {
        success: true,
        fileId: responseData.id?.toString(),
        fileName: responseData.title?.rendered || uniqueFileName,
        fotoUrl: responseData.source_url
      };
    } catch (error: any) {
      logger.error(`Erro na requisição de upload: ${error.message}`, 'foto-perfil');
      return {
        success: false,
        error: `Erro de comunicação com WordPress: ${error.message}`
      };
    }
  }

  /**
   * Remove uma foto de perfil do WordPress
   * @param fileId ID do arquivo no WordPress
   * @param userId ID do usuário (para logs)
   * @returns Promise com resposta da remoção
   */
  async removerFotoPerfil(fileId: string, userId: string): Promise<RemoveFotoResponse> {
    try {
      const endpoint = `${this.wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/media/${fileId}?force=true`;
      const auth = Buffer.from(`${this.wpUser}:${this.wpAppPassword}`).toString('base64');

      logger.info(`Removendo arquivo ${fileId} do usuário ${userId} no WordPress`, 'foto-perfil');

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Erro HTTP WordPress: ${response.status} - ${errorText}`, 'foto-perfil');
        return {
          success: false,
          error: `Erro HTTP WordPress: ${response.status} - ${errorText}`
        };
      }

      logger.success('Remoção concluída no WordPress', 'foto-perfil');
      return {
        success: true,
        message: 'Arquivo removido com sucesso do WordPress'
      };
    } catch (error: any) {
      logger.error(`Erro na remoção: ${error.message}`, 'foto-perfil');
      return {
        success: false,
        error: `Erro de comunicação com WordPress: ${error.message}`
      };
    }
  }

  /**
   * Testa se o WordPress está funcionando
   * @returns Promise com resultado do teste
   */
  async testarConexao(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      logger.info('Testando conexão com WordPress', 'foto-perfil');
      if (!this.wpUrl) {
        return { success: false, error: 'URL do WordPress não configurada' };
      }
      // Testa endpoint de mídia
      const endpoint = `${this.wpUrl.replace(/\/$/, '')}/wp-json/wp/v2/media?per_page=1`;
      const auth = Buffer.from(`${this.wpUser}:${this.wpAppPassword}`).toString('base64');
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const responseData = await response.json();
      logger.success('WordPress está online', 'foto-perfil', responseData);
      return {
        success: true,
        data: {
          status: response.status,
          response: responseData,
          url: this.wpUrl
        }
      };
    } catch (error: any) {
      logger.error(`Erro no teste de conexão: ${error.message}`, 'foto-perfil');
      return {
        success: false,
        error: `WordPress não está acessível: ${error.message}`
      };
    }
  }

  /**
   * Atualiza a URL da foto de perfil no banco de dados
   * @param userId ID do usuário
   * @param fotoUrl URL da foto (ou null para remover)
   */
  async atualizarFotoPerfilDB(userId: string, fotoUrl: string | null): Promise<void> {
    try {
      await usuarioModel.atualizar(userId, { foto_perfil_url: fotoUrl });
      logger.success(`URL da foto atualizada no BD para usuário ${userId}`, 'foto-perfil');
    } catch (error: any) {
      logger.error(`Erro ao atualizar BD: ${error.message}`, 'foto-perfil');
      throw new Error(`Erro ao atualizar banco de dados: ${error.message}`);
    }
  }

  /**
   * Extrai o fileId de uma URL do WordPress (padrão: .../media/{id})
   * @param fotoUrl URL da imagem
   * @returns fileId ou null se não encontrado
   */
  extractFileIdFromUrl(fotoUrl: string): string | null {
    try {
      // Exemplo de URL: https://site.com/wp-content/uploads/2025/07/perfil_xxx.jpg
      // Não há ID na URL, então precisamos salvar o ID no banco junto com a URL, ou extrair de metadados se disponível
      // Aqui, tentamos extrair do padrão .../media/{id} se for salvo assim
      const match = fotoUrl.match(/media\/(\d+)/);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    } catch (error) {
      logger.error('Erro ao extrair fileId da URL', 'foto-perfil', error);
      return null;
    }
  }

  /**
   * Valida se o arquivo é uma imagem válida
   * @param mimeType Tipo MIME do arquivo
   * @param fileSize Tamanho do arquivo em bytes
   * @returns true se válido, false caso contrário
   */
  validarArquivoImagem(mimeType: string, fileSize: number): { valid: boolean; error?: string } {
    // Tipos MIME permitidos
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];

    if (!allowedTypes.includes(mimeType)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido. Use: JPEG, PNG, WebP ou GIF'
      };
    }

    // Limite de 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (fileSize > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Limite máximo: 5MB'
      };
    }

    return { valid: true };
  }
}

const fotoPerfilService = new FotoPerfilService();
export default fotoPerfilService;
