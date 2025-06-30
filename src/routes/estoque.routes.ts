import { Router } from 'express';
import * as EstoqueController from '../controller/estoque.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const estoqueRouter = Router();

// Rotas para listar estoque
estoqueRouter.get('/escola/:id_escola', EstoqueController.listarEstoquePorEscola);
estoqueRouter.get('/escola/:id_escola/segmentos', EstoqueController.listarSegmentosPorEscola);
estoqueRouter.get('/escola/:id_escola/abaixo-ideal', EstoqueController.listarItensAbaixoIdeal);
estoqueRouter.get('/escola/:id_escola/proximos-validade/:dias', EstoqueController.listarItensProximosValidade);
estoqueRouter.get('/escola/:id_escola/metricas', EstoqueController.obterMetricas);

// Novas rotas para gestão de valores ideais
estoqueRouter.post('/ideais', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]),
  EstoqueController.definirValoresIdeaisEmLote
);

estoqueRouter.post('/ideais/:id_escola', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  EstoqueController.definirIdeaisPorEscola
);

// Rotas para operações de estoque (protegidas)
estoqueRouter.post('/adicionar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA]), 
  EstoqueController.adicionarItemAoEstoque
);

estoqueRouter.put('/quantidade/:id_escola/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA, TipoUsuario.NUTRICIONISTA]), 
  EstoqueController.atualizarQuantidade
);

estoqueRouter.put('/numero-ideal/:id_escola/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA, TipoUsuario.NUTRICIONISTA]), 
  EstoqueController.atualizarNumeroIdeal
);

estoqueRouter.delete('/:id_escola/:id_item', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA]), 
  EstoqueController.removerItemDoEstoque
);

export default estoqueRouter;
