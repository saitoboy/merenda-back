import { Router } from 'express';
import * as EscolaController from '../controller/escola.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const escolaRouter = Router();

// Rotas públicas
escolaRouter.get('/', EscolaController.listarEscolas);
escolaRouter.get('/:id', EscolaController.buscarEscolaPorId);
escolaRouter.get('/segmento/:segmento', EscolaController.buscarEscolasPorSegmento);

// Rotas protegidas - apenas administradores e gestores escolares podem criar, atualizar e excluir escolas
escolaRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  EscolaController.criarEscola
);

// Rota para importação em massa de escolas (protegida)
escolaRouter.post('/importar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  EscolaController.importarEscolasMassa
);

// Rota temporária para testes de importação em massa sem autenticação
escolaRouter.post('/importar-teste', 
  EscolaController.importarEscolasMassa
);

escolaRouter.put('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.GESTOR_ESCOLAR]), 
  EscolaController.atualizarEscola
);

escolaRouter.delete('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  EscolaController.excluirEscola
);

export default escolaRouter;
