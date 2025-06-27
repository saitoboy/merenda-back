import { Router } from 'express';
import * as ItemController from '../controller/item.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const itemRouter = Router();

// Rotas públicas
itemRouter.get('/', ItemController.listarItens);
itemRouter.get('/estatisticas/precos', ItemController.obterEstatisticasPrecos);
itemRouter.get('/estatisticas/precos-por-fornecedor', ItemController.obterEstatisticasPrecosPorFornecedor);
itemRouter.get('/:id_item', ItemController.buscarItemPorId);
itemRouter.get('/fornecedor/:id_fornecedor', ItemController.buscarItensPorFornecedor);

// Rotas protegidas - apenas nutricionistas e admins podem manipular itens
itemRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  ItemController.criarItem
);

itemRouter.post('/importar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  ItemController.importarItens
);

itemRouter.put('/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  ItemController.atualizarItem
);

itemRouter.delete('/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  ItemController.excluirItem
);

export default itemRouter;
