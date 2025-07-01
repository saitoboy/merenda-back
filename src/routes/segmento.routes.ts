import { Router } from 'express';
import * as SegmentoController from '../controller/segmento.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const segmentoRouter = Router();

// =====================================
// ROTAS BÁSICAS (CRUD)
// =====================================

// Rotas públicas - consulta de segmentos
segmentoRouter.get('/', SegmentoController.listarSegmentos);
segmentoRouter.get('/buscar', SegmentoController.buscarSegmentoPorNome); // ?nome=valor
segmentoRouter.get('/:id', SegmentoController.buscarSegmentoPorId);

// Rotas protegidas - apenas administradores e nutricionistas podem gerenciar segmentos
segmentoRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  SegmentoController.criarSegmento
);

segmentoRouter.put('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  SegmentoController.atualizarSegmento
);

segmentoRouter.delete('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  SegmentoController.excluirSegmento
);

// =====================================
// RELACIONAMENTOS E ESTATÍSTICAS
// =====================================

// Listar escolas de um segmento
segmentoRouter.get('/:id/escolas', SegmentoController.listarEscolasPorSegmento);

// Obter estatísticas de um segmento
segmentoRouter.get('/:id/estatisticas', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  SegmentoController.obterEstatisticasSegmento
);

// =====================================
// IMPORTAÇÃO EM MASSA
// =====================================

// Importar segmentos em massa (apenas administradores)
segmentoRouter.post('/importar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  SegmentoController.importarSegmentos
);

export default segmentoRouter;
