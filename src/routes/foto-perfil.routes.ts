import { Router } from 'express';
import FotoPerfilController from '../controller/foto-perfil.controller';
import { autenticar } from '../middleware/auth.middleware';
import { uploadConfig } from '../services/foto-perfil.service';

const router = Router();

/**
 * Rotas para gerenciamento de fotos de perfil (armazenamento local)
 * Todas as rotas requerem autenticação
 */

// Upload de foto de perfil (multipart/form-data)
router.post('/', autenticar, uploadConfig.single('foto'), FotoPerfilController.uploadFotoPerfil);

// Upload de foto de perfil via base64 (compatibilidade com frontend)
router.post('/base64', autenticar, FotoPerfilController.uploadFotoPerfilBase64);

// Obter foto de perfil do usuário logado
router.get('/', autenticar, FotoPerfilController.obterFotoPerfil);

// Remover foto de perfil do usuário logado
router.delete('/', autenticar, FotoPerfilController.removerFotoPerfil);

// Obter foto de perfil de outro usuário (apenas para admins ou próprio usuário)
router.get('/:id', autenticar, FotoPerfilController.obterFotoPerfilUsuario);

// === Rotas administrativas ===

// Listar fotos órfãs (apenas admin)
router.get('/admin/orfas', autenticar, FotoPerfilController.listarFotosOrfas);

// Limpar fotos órfãs (apenas admin)
router.delete('/admin/orfas', autenticar, FotoPerfilController.limparFotosOrfas);

// Obter estatísticas do sistema de upload (apenas admin)
router.get('/admin/estatisticas', autenticar, FotoPerfilController.obterEstatisticas);

export default router;