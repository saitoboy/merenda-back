import { Router } from 'express';
import * as EscolaController from '../controller/escola.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const escolaRouter = Router();

// =====================================
// ROTAS BÁSICAS (CRUD)
// =====================================

// Rotas públicas
escolaRouter.get('/', EscolaController.listarEscolas);  // Suporta filtros: ?segmento=id&nome=nome&com_segmentos=true
escolaRouter.get('/:id', EscolaController.buscarEscolaPorId);

// Rotas protegidas - apenas administradores e nutricionistas podem criar escolas
escolaRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  EscolaController.criarEscola
);

escolaRouter.put('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA, TipoUsuario.NUTRICIONISTA]), 
  EscolaController.atualizarEscola
);

escolaRouter.delete('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  EscolaController.excluirEscola
);

// =====================================
// GESTÃO DE SEGMENTOS
// =====================================

// Adicionar segmento a uma escola
escolaRouter.post('/:id/segmentos', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  EscolaController.adicionarSegmentoEscola
);

// Remover segmento de uma escola
escolaRouter.delete('/:id/segmentos/:id_segmento', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  EscolaController.removerSegmentoEscola
);

// Listar segmentos de uma escola
escolaRouter.get('/:id/segmentos', EscolaController.listarSegmentosEscola);

// =====================================
// MÉTRICAS E DASHBOARD
// =====================================

// Obter métricas de uma escola
escolaRouter.get('/:id/metricas', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA, TipoUsuario.NUTRICIONISTA]), 
  EscolaController.obterMetricasEscola
);

// Obter dashboard de uma escola
escolaRouter.get('/:id/dashboard', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.ESCOLA, TipoUsuario.NUTRICIONISTA]), 
  EscolaController.obterDashboardEscola
);

// Importar escolas em massa (apenas administradores)
escolaRouter.post('/importar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  EscolaController.importarEscolasMassa
);

export default escolaRouter;
