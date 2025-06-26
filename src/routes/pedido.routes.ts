import { Router } from 'express';
import * as PedidoController from '../controller/pedido.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const pedidoRouter = Router();

// Rotas para listar pedidos
pedidoRouter.get('/', 
  autenticar, 
  PedidoController.listarPedidos
);

pedidoRouter.get('/:id_pedido', 
  autenticar, 
  PedidoController.buscarPedidoPorId
);

pedidoRouter.get('/escola/:id_escola', 
  autenticar, 
  PedidoController.buscarPedidosPorEscola
);

pedidoRouter.get('/periodo/:inicio/:fim', 
  autenticar, 
  PedidoController.buscarPedidosPorPeriodo
);

// Rotas para gerenciar pedidos
pedidoRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR,TipoUsuario.NUTRICIONISTA]), 
  PedidoController.criarPedido
);

pedidoRouter.put('/:id_pedido', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR, TipoUsuario.FORNECEDOR ,TipoUsuario.NUTRICIONISTA]), 
  PedidoController.atualizarPedido
);

pedidoRouter.delete('/:id_pedido', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR ,TipoUsuario.NUTRICIONISTA]), 
  PedidoController.excluirPedido
);

export default pedidoRouter;
