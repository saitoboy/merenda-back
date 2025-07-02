import { Router } from 'express';
import * as PeriodoLancamentoController from '../controller/periodo-lancamento.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const periodoLancamentoRouter = Router();

// =====================================
// ROTAS BÁSICAS (CRUD)
// =====================================

// Rotas públicas - consulta de períodos
periodoLancamentoRouter.get('/', PeriodoLancamentoController.listarPeriodos); // ?ativos=true
periodoLancamentoRouter.get('/atual', PeriodoLancamentoController.buscarPeriodoAtual);
periodoLancamentoRouter.get('/buscar', PeriodoLancamentoController.buscarPeriodoPorMesAno); // ?mes=1&ano=2024
periodoLancamentoRouter.get('/intervalo', PeriodoLancamentoController.buscarPeriodosPorIntervalo); // ?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD
periodoLancamentoRouter.get('/:id', PeriodoLancamentoController.buscarPeriodoPorId);

// Rotas protegidas - apenas administradores e nutricionistas podem gerenciar períodos
periodoLancamentoRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  PeriodoLancamentoController.criarPeriodo
);

periodoLancamentoRouter.put('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  PeriodoLancamentoController.atualizarPeriodo
);

periodoLancamentoRouter.delete('/:id', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  PeriodoLancamentoController.excluirPeriodo
);

// =====================================
// GESTÃO DE STATUS
// =====================================

// Ativar período (desativa outros automaticamente)
periodoLancamentoRouter.post('/:id/ativar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  PeriodoLancamentoController.ativarPeriodo
);

// Desativar período
periodoLancamentoRouter.post('/:id/desativar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.NUTRICIONISTA]), 
  PeriodoLancamentoController.desativarPeriodo
);

export default periodoLancamentoRouter;
