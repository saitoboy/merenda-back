import { Request, Response } from 'express';
import * as PedidoEscolaService from '../services/pedido-escola.service';
import { logInfo, logError } from '../utils/logger';

export const registrarPedidoEscola = (req: Request, res: Response) => {
  PedidoEscolaService.registrarPedidoEscola(req.body)
    .then(resultado => {
      logInfo('Pedido-escola registrado com sucesso', 'controller', resultado);
      res.status(201).json({ status: 'sucesso', ...resultado });
    })
    .catch(error => {
      logError('Erro ao registrar pedido-escola', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: 'Erro ao registrar pedido-escola' });
    });
};

export const listarPedidosEscola = (req: Request, res: Response) => {
  PedidoEscolaService.listarPedidosEscola()
    .then(pedidos => {
      res.status(200).json({ status: 'sucesso', pedidos });
    })
    .catch(error => {
      logError('Erro ao listar pedidos-escola', 'controller', error);
      res.status(500).json({ status: 'erro', mensagem: 'Erro ao listar pedidos-escola' });
    });
};
