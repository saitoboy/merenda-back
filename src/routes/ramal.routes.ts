import { Router } from 'express';
import * as RamalController from '../controller/ramal.controller';
import { autenticar } from '../middleware/auth.middleware';
import { autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const router = Router();

// Listar todos os ramais (qualquer usuário autenticado)
router.get('/', autenticar, RamalController.listarRamais);

// Buscar ramal por ID (qualquer usuário autenticado)
router.get('/:id_ramal', autenticar, RamalController.buscarRamalPorId);

// Criar ramal (apenas ADMIN)
router.post('/', autenticar, autorizarPor([TipoUsuario.ADMIN]), RamalController.criarRamal);

// Editar ramal (apenas ADMIN)
router.put('/:id_ramal', autenticar, autorizarPor([TipoUsuario.ADMIN]), RamalController.editarRamal);

// Deletar ramal (apenas ADMIN)
router.delete('/:id_ramal', autenticar, autorizarPor([TipoUsuario.ADMIN]), RamalController.deletarRamal);

export default router;
