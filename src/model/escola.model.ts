import connection from '../connection';
import { Escola, EscolaComSegmentos } from '../types';
import * as EscolaSegmentoModel from './escola-segmento.model';

const table = 'escola';

// Buscar escola por ID
export const buscarPorId = async (id_escola: string): Promise<Escola | undefined> => {
  const escola = await connection(table)
    .where({ id_escola })
    .first();
  
  return escola;
};

// Buscar escola por email
export const buscarPorEmail = async (email_escola: string): Promise<Escola | undefined> => {
  const escola = await connection(table)
    .where({ email_escola })
    .first();
  
  return escola;
};

// Buscar escola com seus segmentos
export const buscarComSegmentos = async (id_escola: string): Promise<EscolaComSegmentos | undefined> => {
  const escola = await buscarPorId(id_escola);
  
  if (!escola) {
    return undefined;
  }
  
  const segmentos = await EscolaSegmentoModel.buscarSegmentosPorEscola(id_escola);
  
  return {
    ...escola,
    segmentos
  };
};

// Criar nova escola
export const criar = async (escola: Omit<Escola, 'id_escola'>): Promise<string> => {
  const [result] = await connection(table)
    .insert(escola)
    .returning('id_escola');
  
  return result.id_escola;
};

// Atualizar escola
export const atualizar = async (id_escola: string, dados: Partial<Omit<Escola, 'id_escola'>>): Promise<void> => {
  await connection(table)
    .where({ id_escola })
    .update(dados);
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
    .select('*')
    .orderBy('nome_escola');
  
    
  return escolas;
};

// Listar todas as escolas com seus segmentos
export const listarTodasComSegmentos = async (): Promise<EscolaComSegmentos[]> => {
  const escolas = await listarTodas();
  
  const escolasComSegmentos = await Promise.all(
    escolas.map(async (escola) => {
      const segmentos = await EscolaSegmentoModel.buscarSegmentosPorEscola(escola.id_escola);
      
      return {
        ...escola,
        segmentos
      };
    })
  );
  
  return escolasComSegmentos;
};

// Buscar escolas por segmento
export const buscarPorSegmento = async (id_segmento: string): Promise<Escola[]> => {
  return await EscolaSegmentoModel.buscarEscolasPorSegmento(id_segmento);
};

// Verificar se escola existe
export const existe = async (id_escola: string): Promise<boolean> => {
  const escola = await connection(table)
    .where({ id_escola })
    .count('* as total')
    .first();
  
  return Number(escola?.total || 0) > 0;
};

// =====================================
// FUNÇÕES DE GERENCIAMENTO DE SEGMENTOS
// =====================================

// Adicionar segmento a uma escola
export const adicionarSegmento = async (id_escola: string, id_segmento: string): Promise<void> => {
  await EscolaSegmentoModel.criar({ id_escola, id_segmento });
};

// Remover segmento de uma escola
export const removerSegmento = async (id_escola: string, id_segmento: string): Promise<void> => {
  await EscolaSegmentoModel.remover(id_escola, id_segmento);
};

// Adicionar múltiplos segmentos a uma escola
export const adicionarSegmentos = async (id_escola: string, ids_segmentos: string[]): Promise<void> => {
  await EscolaSegmentoModel.criarMultiplos(id_escola, ids_segmentos);
};

// Atualizar todos os segmentos de uma escola (substitui os existentes)
export const atualizarSegmentos = async (id_escola: string, ids_segmentos: string[]): Promise<void> => {
  await EscolaSegmentoModel.atualizarSegmentosEscola(id_escola, ids_segmentos);
};

// Remover todos os segmentos de uma escola
export const removerTodosSegmentos = async (id_escola: string): Promise<void> => {
  await EscolaSegmentoModel.removerTodosDaEscola(id_escola);
};

// Verificar se escola tem um segmento específico
export const temSegmento = async (id_escola: string, id_segmento: string): Promise<boolean> => {
  return await EscolaSegmentoModel.existe(id_escola, id_segmento);
};

// Contar quantos segmentos uma escola tem
export const contarSegmentos = async (id_escola: string): Promise<number> => {
  return await EscolaSegmentoModel.contarSegmentosPorEscola(id_escola);
};

// Criar escola com segmentos (transação completa)
export const criarComSegmentos = async (
  escola: Omit<Escola, 'id_escola'>, 
  ids_segmentos: string[]
): Promise<string> => {
  return await connection.transaction(async (trx) => {
    // Criar a escola
    const [result] = await trx(table)
      .insert(escola)
      .returning('id_escola');
    
    const id_escola = result.id_escola;
    
    // Adicionar os segmentos se fornecidos
    if (ids_segmentos.length > 0) {
      const relacoes = ids_segmentos.map(id_segmento => ({
        id_escola,
        id_segmento
      }));
      
      await trx('escola_segmento').insert(relacoes);
    }
    
    return id_escola;
  });
};
