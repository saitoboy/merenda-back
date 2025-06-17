import { Router } from 'express';
import * as EstoqueController from '../controller/estoque.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const estoqueRouter = Router();

// Rotas para listar estoque
estoqueRouter.get('/escola/:id_escola', EstoqueController.listarEstoquePorEscola);
estoqueRouter.get('/escola/:id_escola/abaixo-ideal', EstoqueController.listarItensAbaixoIdeal);
estoqueRouter.get('/escola/:id_escola/metricas', EstoqueController.obterMetricas);

// Rotas para operações de estoque (protegidas)
estoqueRouter.post('/adicionar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR]), 
  EstoqueController.adicionarItemAoEstoque
);

estoqueRouter.put('/quantidade/:id_escola/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR, TipoUsuario.NUTRICIONISTA]), 
  EstoqueController.atualizarQuantidade
);

estoqueRouter.put('/numero-ideal/:id_escola/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR, TipoUsuario.NUTRICIONISTA]), 
  EstoqueController.atualizarNumeroIdeal
);

estoqueRouter.delete('/:id_escola/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR]), 
  EstoqueController.removerItemDoEstoque
);

export default estoqueRouter;
