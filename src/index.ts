import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import connection from "./connection";
import { logger } from './utils';
import { initializeEmailService } from './utils/email-service';

// Importação das rotas
import authRouter from './routes/auth.routes';
import escolaRouter from './routes/escola.routes';
import segmentoRouter from './routes/segmento.routes';
import periodoLancamentoRouter from './routes/periodo-lancamento.routes';
import estoqueRouter from './routes/estoque.routes';
import fornecedorRouter from './routes/fornecedor.routes';
import pedidoRouter from './routes/pedido.routes';
import itemRouter from './routes/item.routes';
import diagnosticoRouter from './routes/diagnostico.routes';
import fotoPerfilRouter from './routes/foto-perfil.routes';
import usuarioRouter from './routes/usuario.routes';

const app = express();

logger.info('Inicializando Merenda Smart Flow API', 'server');

// Aumentando o limite do tamanho do payload para 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Configuração detalhada do CORS
app.use(cors({
  origin: '*', // Permite todas as origens em ambiente de desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
logger.success('Middlewares básicos configurados', 'server');

// Middleware para log de requisições
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log inicial da requisição
  logger.info(`${req.method} ${req.originalUrl}`, 'route');
  
  // Interceptando o método de resposta para logar quando finalizar
  const originalSend = res.send;
  res.send = function(body): Response {
    const time = Date.now() - start;
    const status = res.statusCode;
    const statusEmoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
    
    logger.log(
      status >= 200 && status < 300 ? 'success' : status >= 400 ? 'error' : 'warn',
      `${req.method} ${req.originalUrl} ${status} - ${time}ms ${statusEmoji}`,
      'route'
    );
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Rota raiz
app.get("/", async (req: Request, res: Response) => {
  try {
    logger.info('Acesso à rota raiz', 'route');
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'API Merenda Smart Flow v1.0',
      documentacao: '/docs'
    });
  } catch (e: any) {
    logger.error(`Erro na rota raiz: ${e.message}`, 'route');
    res.status(500).json({
      status: 'erro',
      mensagem: e.message || 'Erro interno do servidor'
    });
  }
});

// Endpoint para testar a conexão com o banco de dados
app.get("/test-connection", async (req: Request, res: Response) => {
  try {
    logger.info('Testando conexão com o banco de dados...', 'database');
    // Testa a conexão fazendo uma consulta simples
    const result = await connection.raw('SELECT 1+1 AS result');
    logger.success('Teste de conexão com o banco de dados bem-sucedido!', 'database', result.rows[0]);
    res.status(200).json({
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso!",
      dbResult: result.rows[0]
    });
  } catch (error: any) {
    logger.error(`Falha ao conectar com o banco de dados: ${error.message}`, 'database');
    res.status(500).json({
      success: false,
      message: "Falha ao conectar com o banco de dados.",
      error: error.message
    });
  }
});

// Registrar as rotas
logger.info('Registrando rotas da aplicação...', 'route');

app.use('/auth', authRouter);
logger.debug('Rotas de autenticação registradas', 'route');

app.use('/escolas', escolaRouter);
logger.debug('Rotas de escolas registradas', 'route');

app.use('/segmentos', segmentoRouter);
logger.debug('Rotas de segmentos registradas', 'route');

app.use('/periodos', periodoLancamentoRouter);
logger.debug('Rotas de períodos de lançamento registradas', 'route');

app.use('/estoque', estoqueRouter);
logger.debug('Rotas de estoque registradas', 'route');

app.use('/fornecedores', fornecedorRouter);
logger.debug('Rotas de fornecedores registradas', 'route');

app.use('/pedidos', pedidoRouter);
logger.debug('Rotas de pedidos registradas', 'route');

app.use('/itens', itemRouter);
logger.debug('Rotas de itens registradas', 'route');

app.use('/diagnostico', diagnosticoRouter);
logger.debug('Rotas de diagnóstico registradas', 'route');

app.use('/usuario/foto-perfil', fotoPerfilRouter);
logger.debug('Rotas de foto de perfil registradas', 'route');

app.use('/usuarios', usuarioRouter);
logger.debug('Rotas de usuários registradas', 'route');

logger.success('Todas as rotas registradas com sucesso!', 'route');

// Inicializar serviço de email
initializeEmailService()
  .then(() => {
    logger.success('Serviço de email inicializado com sucesso', 'email');
  })
  .catch((error) => {
    logger.warning('Falha ao inicializar serviço de email, continuando sem ele', 'email', error);
  });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  if (server) {
    const address = server.address();
    const port = typeof address === 'string' ? PORT : address ? address.port : PORT;
    
    logger.success(`Servidor rodando em http://localhost:${port}`, 'server');
    logger.info('Para testar a API, acesse a rota raiz no navegador ou use uma ferramenta como Thunder Client', 'server');
    logger.info('Pressione CTRL+C para encerrar o servidor', 'server');
  } else {
    logger.error(`Falha ao iniciar o servidor.`, 'server');
  }
});
