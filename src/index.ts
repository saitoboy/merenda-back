import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";

import { AddressInfo } from "net";
import connection from "./connection";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  try {
    res.send("Hello, world!");
  } catch (e: any) {
    res.send(e.sqlMessage || e.message);
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

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
