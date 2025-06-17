import { Router } from 'express';
import * as ItemController from '../controller/item.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const itemRouter = Router();

// Rotas públicas
itemRouter.get('/', ItemController.listarItens);
itemRouter.get('/:id_item', ItemController.buscarItemPorId);
itemRouter.get('/fornecedor/:id_fornecedor', ItemController.buscarItensPorFornecedor);

// Rotas de teste para desenvolvimento (remover em produção)
itemRouter.post('/teste', ItemController.criarItem);
itemRouter.post('/importar-teste', ItemController.importarItens);

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
