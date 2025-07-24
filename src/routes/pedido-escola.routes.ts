import { Router } from 'express';
import { registrarPedidoEscola, listarPedidosEscola } from '../controller/pedido-escola.controller';

const router = Router();

// POST /pedido-escola
router.post('/criar', registrarPedidoEscola);

// GET /pedido-escola
router.get('/', listarPedidosEscola);

export default router;
