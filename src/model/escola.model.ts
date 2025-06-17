import connection from '../connection';
import { Escola } from '../types';

const table = 'escola';

// Função auxiliar para converter JSONB para array ao buscar do banco
const converterSegmentosDoBanco = (escola: any): Escola => {
  if (escola) {
    // Quando o campo está armazenado como JSON string, precisamos fazer o parse
    if (typeof escola.segmento_escola === 'string') {
      try {
        // Tenta converter string JSON para array
        escola.segmento_escola = JSON.parse(escola.segmento_escola);
      } catch (error) {
        // Se falhar no parse, coloca a string em um array
        escola.segmento_escola = [escola.segmento_escola];
      }
    }
    
    // Garante que segmento_escola seja sempre um array
    if (!escola.segmento_escola) {
      escola.segmento_escola = [];
    } else if (!Array.isArray(escola.segmento_escola)) {
      escola.segmento_escola = [escola.segmento_escola];
    }
  }
  
  return escola as Escola;
};

// Buscar escola por ID
export const buscarPorId = async (id_escola: string): Promise<Escola | undefined> => {
  const escola = await connection(table)
    .where({ id_escola })
    .first();
  
  return converterSegmentosDoBanco(escola);
};

// Buscar escola por email
export const buscarPorEmail = async (email_escola: string): Promise<Escola | undefined> => {
  const escola = await connection(table)
    .where({ email_escola })
    .first();
  
  return converterSegmentosDoBanco(escola);
};

// Criar nova escola
export const criar = async (escola: Omit<Escola, 'id_escola'>): Promise<string> => {
  // O campo no banco é JSONB, precisamos converter o array para JSON string
  const escolaParaInserir = {
    ...escola,
    // Convertemos explicitamente para JSON string para o PostgreSQL
    segmento_escola: JSON.stringify(
      Array.isArray(escola.segmento_escola) ? escola.segmento_escola : [escola.segmento_escola]
    )
  };

  const [id] = await connection(table)
    .insert(escolaParaInserir)
    .returning('id_escola');
  
  return id;
};

// Atualizar escola
export const atualizar = async (id_escola: string, dados: Partial<Escola>): Promise<void> => {
  // Se estiver atualizando segmento_escola, garantir que seja convertido para JSON string
  const dadosParaAtualizar: any = { ...dados };
  
  if (dadosParaAtualizar.segmento_escola) {
    // Convertemos para JSON string para o PostgreSQL
    dadosParaAtualizar.segmento_escola = JSON.stringify(
      Array.isArray(dadosParaAtualizar.segmento_escola)
        ? dadosParaAtualizar.segmento_escola
        : [dadosParaAtualizar.segmento_escola]
    );
  }

  await connection(table)
    .where({ id_escola })
    .update(dadosParaAtualizar);
};

// Excluir escola
export const excluir = async (id_escola: string): Promise<void> => {
  await connection(table)
    .where({ id_escola })
    .delete();
};

// Listar todas as escolas
export const listarTodas = async (): Promise<Escola[]> => {
  const escolas = await connection(table)
    .select('*');
  
  // Garantimos que os segmentos sejam convertidos de JSONB para arrays JavaScript
  return escolas.map(converterSegmentosDoBanco);
};

// Buscar escolas por segmento
export const buscarPorSegmento = async (segmento: string): Promise<Escola[]> => {
  // Convertendo para lowercase para permitir busca case-insensitive
  const segmentoLowerCase = segmento.toLowerCase();
  
  // Usamos a função containement do JSONB para buscar dentro do array
  const escolas = await connection(table)
    .whereRaw("segmento_escola::jsonb @> ?::jsonb", [JSON.stringify([segmentoLowerCase])])
    .select('*');
  
  return escolas.map(converterSegmentosDoBanco);
};
