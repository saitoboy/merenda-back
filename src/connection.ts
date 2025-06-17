import knex from 'knex';
import 'dotenv/config'

const connection = knex({
    client: "postgresql",
    connection: {
        host: process.env.DB_HOST,
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    }, pool:{
      min:2,
      max:10
    }
})

// Teste inicial de conexão
connection.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('✅ Conexão com o banco de dados PostgreSQL estabelecida com sucesso!')
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar com o banco de dados PostgreSQL:', error)
  });

export default connection;
