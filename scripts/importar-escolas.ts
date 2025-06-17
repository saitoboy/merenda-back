/**
 * Script para importação em massa de escolas
 * 
 * Execução: npm run importar-escolas
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Escola } from '../src/types';
import connection from '../src/connection';

const importarEscolas = async () => {
  try {
    // Ler o arquivo JSON
    const jsonPath = path.join(__dirname, '..', 'escolas-importacao.json');
    const escolasJson = fs.readFileSync(jsonPath, 'utf-8');
    const escolas: Omit<Escola, 'id_escola'>[] = JSON.parse(escolasJson);

    console.log(`Iniciando importação de ${escolas.length} escolas...`);

    // Verificar se as escolas já existem (por email)
    for (const escola of escolas) {
      const escolaExistente = await connection('escola')
        .where({ email_escola: escola.email_escola })
        .first();

      if (escolaExistente) {
        console.log(`Escola com email ${escola.email_escola} já existe. Pulando...`);
        continue;
      }      // Inserir a escola com o tratamento adequado para o campo segmento_escola
      const [id] = await connection('escola')
        .insert({
          nome_escola: escola.nome_escola,
          endereco_escola: escola.endereco_escola,
          email_escola: escola.email_escola,
          segmento_escola: JSON.stringify(escola.segmento_escola) // Converter explicitamente para JSON string
        })
        .returning('id_escola');

      console.log(`Escola "${escola.nome_escola}" importada com sucesso! ID: ${id}`);
    }

    console.log('Importação finalizada!');
  } catch (error) {
    console.error('Erro ao importar escolas:', error);
  } finally {
    // Fechar conexão com o banco
    await connection.destroy();
  }
};

// Executar a função
importarEscolas();
