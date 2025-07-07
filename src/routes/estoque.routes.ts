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
estoqueRouter.get('/escola/:id_escola/consolidado', EstoqueController.consolidadoEstoquePorSegmento);

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

estoqueRouter.put('/quantidade/:id_estoque', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA, TipoUsuario.NUTRICIONISTA]), 
  EstoqueController.atualizarQuantidade
);

estoqueRouter.put('/numero-ideal/:id_estoque', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  EstoqueController.atualizarNumeroIdeal
);

// Nova rota: Atualizar data de validade (apenas ESCOLA pode)
estoqueRouter.put('/validade/:id_estoque', 
  autenticar, 
  autorizarPor([TipoUsuario.ESCOLA]), 
  EstoqueController.atualizarDataValidade
);

estoqueRouter.delete('/:id_estoque', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA]), 
  EstoqueController.removerItemDoEstoque
);

export default estoqueRouter;
