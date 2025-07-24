import { Router } from 'express';
import { registrarAuditoriaPedido, listarAuditoriasPedido } from '../controller/auditoria-pedido.controller';

const router = Router();

// POST /auditoria-pedido
router.post('/criar', registrarAuditoriaPedido);

// GET /auditoria-pedido
router.get('/', listarAuditoriasPedido);

export default router;
