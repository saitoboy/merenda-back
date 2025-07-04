import { Router } from 'express';
import * as DiagnosticoController from '../controller/diagnostico.controller';

const diagnosticoRouter = Router();

// =====================================
// ROTAS DE DIAGNÓSTICO DO SISTEMA
// =====================================

// Diagnóstico completo do sistema
diagnosticoRouter.get('/sistema-completo', DiagnosticoController.diagnosticoCompleto);

// Histórico de emails simulados
diagnosticoRouter.get('/emails-enviados', DiagnosticoController.historicoEmails);

// Visualizar email específico (HTML)
diagnosticoRouter.get('/email/:id', DiagnosticoController.visualizarEmail);

// Teste completo de OTP com simulação
diagnosticoRouter.post('/teste-otp-completo', DiagnosticoController.testeOTPCompleto);

// Limpar histórico de emails para testes limpos
diagnosticoRouter.delete('/limpar-emails', DiagnosticoController.limparHistoricoEmails);

export default diagnosticoRouter;
