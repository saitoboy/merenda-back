import { Router } from 'express';
import FotoPerfilController from '../controller/foto-perfil.controller';
import { autenticar } from '../middleware/auth.middleware';

const router = Router();

/**
 * Rotas para gerenciamento de fotos de perfil (WordPress)
 * Todas as rotas requerem autenticação, exceto status
 */

// Testar se o WordPress está funcionando
router.get('/status', FotoPerfilController.testarWordPress);

// Upload de foto de perfil (recebe base64 via JSON)
router.post('/', autenticar, FotoPerfilController.uploadFotoPerfil);

// Obter foto de perfil do usuário logado
router.get('/', autenticar, FotoPerfilController.obterFotoPerfil);

// Remover foto de perfil do usuário logado
router.delete('/', autenticar, FotoPerfilController.removerFotoPerfil);

// Obter foto de perfil de outro usuário (apenas para admins ou próprio usuário)
router.get('/:id', autenticar, FotoPerfilController.obterFotoPerfilUsuario);

export default router;