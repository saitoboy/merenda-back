import knex from 'knex';
import 'dotenv/config'

const connection = knex({
    client: "postgresql",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    }, pool:{
      min:2,
      max:10
    }
})

import { logger } from './utils';

// Teste inicial de conexão
connection.raw('SELECT 1+1 AS result')
  .then(() => {
    logger.success('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!', 'database');
  })
  .catch((error) => {
    logger.error(`Erro ao conectar com o banco de dados PostgreSQL: ${error.message}`, 'database');
  });

export default connection;
