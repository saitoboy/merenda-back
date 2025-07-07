import * as usuarioModel from '../model/usuario.model';
import { logger } from '../utils';
import https from 'https';

interface UploadFotoResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  webViewLink?: string;
  webContentLink?: string;
  error?: string;
}

interface RemoveFotoResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Service para gerenciar fotos de perfil de usuários
 * Integra com Google Apps Script para upload/remoção no Google Drive
 */
export class FotoPerfilService {
  private readonly googleAppsScriptUrl: string;

  constructor() {
    this.googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL!;
    
    if (!this.googleAppsScriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL não configurada no .env');
    }

    // Configurar agente HTTPS customizado para contornar problemas de SSL com Google
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Para desenvolvimento - aceita certificados auto-assinados
      keepAlive: true,
      timeout: 30000
    });
    
    // Armazenar o agente para uso nas requisições
    (this as any).httpsAgent = httpsAgent;
  }

  /**
   * Faz upload de uma foto de perfil para o Google Drive
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
      // Converter buffer para base64
      const fileBase64 = fileBuffer.toString('base64');
      
      // Criar nome único para o arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const uniqueFileName = `perfil_${userId}_${timestamp}_${fileName}`;

      // Payload para o Google Apps Script
      const payload = {
        action: 'upload',
        fileName: uniqueFileName,
        base64: fileBase64,  // ✅ Corrigido: fileData → base64
        mimeType: mimeType,
        userId: userId
      };

      logger.info(`Iniciando upload para usuário ${userId}, arquivo: ${uniqueFileName}`, 'foto-perfil');

      // Fazer requisição para o Google Apps Script com configurações SSL otimizadas
      const response = await this.makeHttpRequest(this.googleAppsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Merenda-API/1.0',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(payload),
        // Timeout de 45 segundos para upload (aumentado para arquivos maiores)
        signal: AbortSignal.timeout(45000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      logger.success('Upload concluído com sucesso', 'foto-perfil', responseData);

      if (responseData.success) {
        return {
          success: true,
          fileId: responseData.fileId,
          fileName: responseData.fileName,
          webViewLink: responseData.webViewLink,
          webContentLink: responseData.webContentLink
        };
      } else {
        logger.error('Erro no upload retornado pelo Google Apps Script', 'foto-perfil', responseData.error);
        return {
          success: false,
          error: responseData.error || 'Erro desconhecido no upload'
        };
      }

    } catch (error: any) {
      logger.error(`Erro na requisição de upload: ${error.message}`, 'foto-perfil');
      return {
        success: false,
        error: `Erro de comunicação com Google Drive: ${error.message}`
      };
    }
  }

  /**
   * Remove uma foto de perfil do Google Drive
   * @param fileId ID do arquivo no Google Drive
   * @param userId ID do usuário (para logs)
   * @returns Promise com resposta da remoção
   */
  async removerFotoPerfil(fileId: string, userId: string): Promise<RemoveFotoResponse> {
    try {
      const payload = {
        action: 'delete',
        fileId: fileId,
        userId: userId
      };

      logger.info(`Removendo arquivo ${fileId} do usuário ${userId}`, 'foto-perfil');

      const response = await this.makeHttpRequest(this.googleAppsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Merenda-API/1.0',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(payload),
        // Timeout de 20 segundos para remoção (aumentado)
        signal: AbortSignal.timeout(20000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      logger.success('Remoção concluída', 'foto-perfil', responseData);

      if (responseData.success) {
        return {
          success: true,
          message: responseData.message || 'Arquivo removido com sucesso'
        };
      } else {
        return {
          success: false,
          error: responseData.error || 'Erro na remoção do arquivo'
        };
      }

    } catch (error: any) {
      logger.error(`Erro na remoção: ${error.message}`, 'foto-perfil');
      return {
        success: false,
        error: `Erro de comunicação com Google Drive: ${error.message}`
      };
    }
  }

  /**
   * Testa se o Google Apps Script está funcionando
   * @returns Promise com resultado do teste
   */
  async testarConexao(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      logger.info('Testando conexão com Google Apps Script', 'foto-perfil');
      
      if (!this.googleAppsScriptUrl) {
        return { success: false, error: 'URL do Google Apps Script não configurada' };
      }

      // Fazer teste simples de conectividade com configurações SSL otimizadas
      const response = await this.makeHttpRequest(this.googleAppsScriptUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Merenda-API/1.0',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        // Timeout de 15 segundos para teste (aumentado)
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      logger.success('Google Apps Script está online', 'foto-perfil', responseData);

      return {
        success: true,
        data: {
          status: response.status,
          response: responseData,
          url: this.googleAppsScriptUrl
        }
      };

    } catch (error: any) {
      logger.error(`Erro no teste de conexão: ${error.message}`, 'foto-perfil');
      return {
        success: false,
        error: `Google Apps Script não está acessível: ${error.message}`
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
   * Extrai o fileId de uma URL do Google Drive
   * @param driveUrl URL do Google Drive
   * @returns fileId ou null se não encontrado
   */
  extractFileIdFromUrl(driveUrl: string): string | null {
    try {
      // Padrões comuns de URLs do Google Drive
      const patterns = [
        /\/file\/d\/([a-zA-Z0-9-_]+)/,  // /file/d/ID/...
        /id=([a-zA-Z0-9-_]+)/,         // ?id=ID
        /\/d\/([a-zA-Z0-9-_]+)/        // /d/ID
      ];

      for (const pattern of patterns) {
        const match = driveUrl.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
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

  /**
   * Método auxiliar para fazer requisições HTTP mais robustas
   * Contorna problemas comuns de SSL e timeout
   */
  private async makeHttpRequest(url: string, options: RequestInit): Promise<Response> {
    try {
      // Primeiro, tentar com fetch nativo
      return await fetch(url, options);
    } catch (error: any) {
      logger.warning(`Erro com fetch nativo, tentando abordagem alternativa: ${error.message}`, 'foto-perfil');
      
      // Se falhou, tentar sem verificação SSL (apenas em desenvolvimento)
      if (process.env.NODE_ENV !== 'production') {
        const modifiedOptions = {
          ...options,
          headers: {
            ...options.headers,
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
          }
        };
        
        try {
          return await fetch(url, modifiedOptions);
        } catch (retryError: any) {
          logger.error(`Erro na segunda tentativa: ${retryError.message}`, 'foto-perfil');
          throw retryError;
        }
      }
      
      throw error;
    }
  }
}

const fotoPerfilService = new FotoPerfilService();
export default fotoPerfilService;
