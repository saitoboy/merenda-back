import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import connection from "./connection";

// Importação das rotas
import authRouter from './routes/auth.routes';
import escolaRouter from './routes/escola.routes';
import estoqueRouter from './routes/estoque.routes';
import fornecedorRouter from './routes/fornecedor.routes';
import pedidoRouter from './routes/pedido.routes';

const app = express();

app.use(express.json());
app.use(cors());

// Rota raiz
app.get("/", async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'API Merenda Smart Flow v1.0',
      documentacao: '/docs'
    });
  } catch (e: any) {
    res.status(500).json({
      status: 'erro',
      mensagem: e.message || 'Erro interno do servidor'
    });
  }
});

// Endpoint para testar a conexão com o banco de dados
app.get("/test-connection", async (req: Request, res: Response) => {
  try {
    // Testa a conexão fazendo uma consulta simples
    const result = await connection.raw('SELECT 1+1 AS result');
    res.status(200).json({
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso!",
      dbResult: result.rows[0]
    });
  } catch (error: any) {
    console.error("Erro ao conectar com o banco de dados:", error);
    res.status(500).json({
      success: false,
      message: "Falha ao conectar com o banco de dados.",
      error: error.message
    });
  }
});

// Registrar as rotas
app.use('/auth', authRouter);
app.use('/escolas', escolaRouter);
app.use('/estoque', estoqueRouter);
app.use('/fornecedores', fornecedorRouter);
app.use('/pedidos', pedidoRouter);

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao iniciar o servidor.`);
  }
});
