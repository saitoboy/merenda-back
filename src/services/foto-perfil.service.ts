import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import { logger } from '../utils';
import * as UsuarioModel from '../model/usuario.model';

/**
 * Serviço simplificado para upload de fotos de perfil
 * Salva localmente na pasta /data/uploads/perfil
 * Exclui foto anterior automaticamente
 */

// Configurações
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  UPLOADS_DIR: path.join(__dirname, '../../data/uploads/perfil'),
  URL_BASE: '/uploads/perfil',
  // Sempre vem do .env - nunca hardcoded
  get SERVER_URL() {
    const serverUrl = process.env.SERVER_URL;
    
    if (!serverUrl) {
      throw new Error('SERVER_URL não está definido no arquivo .env');
    }
    
    // Remove barra final se existir
    return serverUrl.replace(/\/$/, '');
  }
};

/**
 * Garante que a pasta de uploads existe
 */
async function ensureUploadsDir(): Promise<void> {
  try {
    await fs.ensureDir(UPLOAD_CONFIG.UPLOADS_DIR);
    logger.info('Pasta de uploads verificada/criada', 'upload');
  } catch (error) {
    logger.error('Erro ao criar pasta de uploads', 'upload', error);
    throw new Error('Erro ao preparar pasta de uploads');
  }
}

/**
 * Gera nome único para o arquivo
 */
function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = path.extname(originalName).toLowerCase();
  return `user_${userId}_${timestamp}${extension}`;
}

/**
 * Valida o arquivo enviado
 */
function validateFile(file: Express.Multer.File): void {
  // Validar tipo de arquivo
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error(`Tipo de arquivo não permitido. Use: ${UPLOAD_CONFIG.ALLOWED_TYPES.join(', ')}`);
  }

  // Validar tamanho
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    throw new Error(`Arquivo muito grande. Máximo: ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  logger.info(`Arquivo validado: ${file.originalname} (${file.size} bytes)`, 'upload');
}

/**
 * Exclui foto anterior do usuário
 */
async function excluirFotoAnterior(userId: string): Promise<void> {
  try {
    // Buscar usuário para pegar URL da foto atual
    const usuario = await UsuarioModel.buscarPorId(userId);

    if (usuario?.foto_perfil_url) {
      // Extrair nome do arquivo da URL (funciona com URL completa ou relativa)
      const fileName = path.basename(usuario.foto_perfil_url);
      const filePath = path.join(UPLOAD_CONFIG.UPLOADS_DIR, fileName);

      // Verificar se arquivo existe e excluir
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        logger.info(`Foto anterior excluída: ${fileName}`, 'upload');
      }
    }
  } catch (error) {
    logger.warning('Erro ao excluir foto anterior (continuando)', 'upload', error);
    // Não interromper o processo por erro na exclusão
  }
}

/**
 * Configuração do Multer para upload
 */
export const uploadConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    try {
      // Validar tipo de arquivo
      if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.mimetype)) {
        return cb(new Error(`Tipo de arquivo não permitido. Use: ${UPLOAD_CONFIG.ALLOWED_TYPES.join(', ')}`));
      }
      cb(null, true);
    } catch (error) {
      cb(error as Error);
    }
  }
});

/**
 * Upload de foto de perfil
 */
export const uploadFotoPerfil = async (userId: string, file: Express.Multer.File): Promise<string> => {
  try {
    logger.info(`Iniciando upload de foto para usuário ${userId}`, 'upload');

    // Validar arquivo
    validateFile(file);

    // Garantir que pasta existe
    await ensureUploadsDir();

    // Excluir foto anterior
    await excluirFotoAnterior(userId);

    // Gerar nome único
    const fileName = generateFileName(userId, file.originalname);
    const filePath = path.join(UPLOAD_CONFIG.UPLOADS_DIR, fileName);

    // Salvar arquivo
    await fs.writeFile(filePath, file.buffer);
    logger.info(`Arquivo salvo: ${fileName}`, 'upload');

    // Gerar URL de acesso completa
    const fotoUrl = `${UPLOAD_CONFIG.SERVER_URL}${UPLOAD_CONFIG.URL_BASE}/${fileName}`;

    // Atualizar banco de dados
    await UsuarioModel.atualizar(userId, { foto_perfil_url: fotoUrl });
    logger.info(`Foto de perfil atualizada no banco para usuário ${userId}: ${fotoUrl}`, 'upload');

    return fotoUrl;

  } catch (error) {
    logger.error('Erro no upload de foto', 'upload', error);
    throw error;
  }
};

/**
 * Excluir foto de perfil
 */
export const excluirFotoPerfil = async (userId: string): Promise<void> => {
  try {
    logger.info(`Excluindo foto de perfil do usuário ${userId}`, 'upload');

    // Excluir arquivo físico
    await excluirFotoAnterior(userId);

    // Remover URL do banco
    await UsuarioModel.atualizar(userId, { foto_perfil_url: null });
    logger.info(`Foto de perfil removida do banco para usuário ${userId}`, 'upload');

  } catch (error) {
    logger.error('Erro ao excluir foto de perfil', 'upload', error);
    throw error;
  }
};

/**
 * Listar fotos órfãs (arquivos que não estão no banco)
 */
export const listarFotosOrfas = async (): Promise<string[]> => {
  try {
    // Garantir que pasta existe
    await ensureUploadsDir();

    // Listar todos os arquivos na pasta
    const arquivos = await fs.readdir(UPLOAD_CONFIG.UPLOADS_DIR);

    // Buscar todas as URLs no banco
    const usuarios = await UsuarioModel.listarTodos();
    const urlsNoBanco = usuarios
      .filter(u => u.foto_perfil_url)
      .map(u => path.basename(u.foto_perfil_url!));

    // Encontrar órfãos
    const orfaos = arquivos.filter(arquivo => !urlsNoBanco.includes(arquivo));

    logger.info(`Encontradas ${orfaos.length} fotos órfãs`, 'upload');
    return orfaos;

  } catch (error) {
    logger.error('Erro ao listar fotos órfãs', 'upload', error);
    throw error;
  }
};

/**
 * Limpar fotos órfãs
 */
export const limparFotosOrfas = async (): Promise<number> => {
  try {
    const orfaos = await listarFotosOrfas();

    for (const arquivo of orfaos) {
      const filePath = path.join(UPLOAD_CONFIG.UPLOADS_DIR, arquivo);
      await fs.remove(filePath);
    }

    logger.info(`${orfaos.length} fotos órfãs removidas`, 'upload');
    return orfaos.length;

  } catch (error) {
    logger.error('Erro ao limpar fotos órfãs', 'upload', error);
    throw error;
  }
};

/**
 * Estatísticas do sistema de upload
 */
export const obterEstatisticasUpload = async () => {
  try {
    // Garantir que pasta existe
    await ensureUploadsDir();

    // Contar arquivos na pasta
    const arquivos = await fs.readdir(UPLOAD_CONFIG.UPLOADS_DIR);

    // Calcular tamanho total
    let tamanhoTotal = 0;
    for (const arquivo of arquivos) {
      const filePath = path.join(UPLOAD_CONFIG.UPLOADS_DIR, arquivo);
      const stats = await fs.stat(filePath);
      tamanhoTotal += stats.size;
    }

    // Contar usuários com foto
    const usuarios = await UsuarioModel.listarTodos();
    const usuariosComFoto = usuarios.filter(u => u.foto_perfil_url).length;

    return {
      total_arquivos: arquivos.length,
      usuarios_com_foto: usuariosComFoto,
      tamanho_total_mb: Math.round(tamanhoTotal / 1024 / 1024 * 100) / 100,
      pasta_uploads: UPLOAD_CONFIG.UPLOADS_DIR,
      tipos_permitidos: UPLOAD_CONFIG.ALLOWED_TYPES,
      tamanho_maximo_mb: UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024
    };

  } catch (error) {
    logger.error('Erro ao obter estatísticas de upload', 'upload', error);
    throw error;
  }
};


