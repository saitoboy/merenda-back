import { Router } from 'express';
import { registrarAuditoriaPedido, listarAuditoriasPedido } from '../controller/auditoria-pedido.controller';

const router = Router();

// POST /auditoria-pedido
router.post('/auditoria-pedido', registrarAuditoriaPedido);

// GET /auditoria-pedido
router.get('/auditoria-pedido', listarAuditoriasPedido);

export default router;
