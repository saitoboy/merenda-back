import { Router } from 'express';
import FotoPerfilController from '../controller/foto-perfil.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

/**
 * Rotas para gerenciamento de fotos de perfil
 * Todas as rotas requerem autenticação
 */

// Testar se o Google Apps Script está funcionando
router.get('/status', FotoPerfilController.testarGoogleAppsScript);

// Upload de foto de perfil (recebe base64 via JSON)
router.post('/', autenticar, FotoPerfilController.uploadFotoPerfil);

// Obter foto de perfil do usuário logado
router.get('/', autenticar, FotoPerfilController.obterFotoPerfil);

// Remover foto de perfil do usuário logado
router.delete('/', autenticar, FotoPerfilController.removerFotoPerfil);

// Obter foto de perfil de outro usuário (apenas para admins ou próprio usuário)
router.get('/:id', autenticar, FotoPerfilController.obterFotoPerfilUsuario);

export default router;
