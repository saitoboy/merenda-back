import { Request, Response } from 'express';
import * as AuditoriaPedidoService from '../services/auditoria-pedido.service';
import { logInfo, logError } from '../utils/logger';

export const registrarAuditoriaPedido = (req: Request, res: Response) => {
  AuditoriaPedidoService.registrarAuditoriaPedido(req.body)
    .then(resultado => {
      logInfo('Auditoria de pedido registrada com sucesso', 'controller', resultado);
      res.status(201).json({ status: 'sucesso', ...resultado }); // tipo_pedido já incluso
    })
    .catch(error => {
      logError('Erro ao registrar auditoria de pedido', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: 'Erro ao registrar auditoria de pedido' });
    });
};

export const listarAuditoriasPedido = (req: Request, res: Response) => {
  AuditoriaPedidoService.listarAuditoriasPedido()
    .then(auditorias => {
      res.status(200).json({ status: 'sucesso', auditorias });
    })
    .catch(error => {
      logError('Erro ao listar auditorias de pedido', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: 'Erro ao listar auditorias de pedido' });
    });
};
