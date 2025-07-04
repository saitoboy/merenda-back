import { Router } from 'express';
import * as AuthController from '../controller/auth.controller';
import * as OTPController from '../controller/otp.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const authRouter = Router();

// =====================================
// ROTAS DE AUTENTICAÇÃO BÁSICA
// =====================================
authRouter.post('/login', AuthController.login);
authRouter.post('/registrar', AuthController.registrar);

// =====================================
// ROTAS DE REDEFINIÇÃO DE SENHA (OTP)
// =====================================

// Enviar código OTP para email
authRouter.post('/enviar-otp', OTPController.enviarOTP);
authRouter.post('/esqueci-senha', OTPController.esqueciSenha); // Alias

// Verificar código OTP e redefinir senha
authRouter.post('/verificar-otp', OTPController.verificarOTP);
authRouter.post('/redefinir-senha', OTPController.redefinirSenha); // Alias

// =====================================
// ROTAS ADMINISTRATIVAS (OTP)
// =====================================

// Estatísticas do sistema OTP (apenas admin)
authRouter.get('/otp/stats', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  OTPController.obterEstatisticasOTP
);

// Limpeza de OTPs expirados (apenas admin)
authRouter.post('/otp/limpar-expirados', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  OTPController.limparOTPsExpirados
);

// Testar configuração de email (apenas admin)
authRouter.post('/otp/testar-email', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  OTPController.testarEmail
);

export default authRouter;
