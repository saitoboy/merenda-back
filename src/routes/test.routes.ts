import { Router, Request, Response } from 'express';
import { sendOTPEmail, isEmailServiceReady } from '../utils/email-service';
import { logInfo, logError } from '../utils/logger';

const router = Router();

/**
 * Endpoint para testar o envio de email
 * POST /test/email
 */
const testarEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    // Verificar se o serviço de email está pronto
    if (!isEmailServiceReady()) {
      return res.status(500).json({
        success: false,
        message: 'Serviço de email não está configurado'
      });
    }

    logInfo(`Testando envio de email para: ${email}`, 'test');

    // Enviar email de teste com código fictício
    const result = await sendOTPEmail(email, '123456', 15);

    if (result.success) {
      logInfo(`Email de teste enviado com sucesso: ${result.messageId}`, 'test');
      
      const response: any = {
        success: true,
        message: 'Email de teste enviado com sucesso',
        messageId: result.messageId
      };

      // Se estiver em desenvolvimento, incluir URL de preview
      if (result.previewUrl) {
        response.previewUrl = result.previewUrl;
      }

      return res.json(response);
    } else {
      logError(`Falha ao enviar email de teste: ${result.error}`, 'test');
      return res.status(500).json({
        success: false,
        message: 'Falha ao enviar email de teste',
        error: result.error
      });
    }

  } catch (error) {
    logError('Erro no teste de email', 'test', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

/**
 * Endpoint para verificar status do serviço de email
 * GET /test/email-status
 */
const verificarStatusEmail = (req: Request, res: Response) => {
  try {
    const isReady = isEmailServiceReady();
    
    return res.json({
      success: true,
      emailServiceReady: isReady,
      message: isReady ? 'Serviço de email está funcionando' : 'Serviço de email não configurado'
    });
  } catch (error) {
    logError('Erro ao verificar status do email', 'test', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar status',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

router.post('/email', testarEmail);
router.get('/email-status', verificarStatusEmail);

export default router;
