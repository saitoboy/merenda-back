import connection from '../connection';
import { EscolaSegmento, Escola, Segmento } from '../types';

const table = 'escola_segmento';

// Buscar relacionamento específico
export const buscar = async (id_escola: string, id_segmento: string): Promise<EscolaSegmento | undefined> => {
  const relacao = await connection(table)
    .where({ id_escola, id_segmento })
    .first();
  
  return relacao;
};

// Buscar todos os segmentos de uma escola
export const buscarSegmentosPorEscola = async (id_escola: string): Promise<Segmento[]> => {
  const segmentos = await connection(table)
    .join('segmento', 'escola_segmento.id_segmento', '=', 'segmento.id_segmento')
    .where('escola_segmento.id_escola', id_escola)
    .select('segmento.*')
    .orderBy('segmento.nome_segmento');
  
  return segmentos;
};

// Buscar todas as escolas de um segmento
export const buscarEscolasPorSegmento = async (id_segmento: string): Promise<Escola[]> => {
  const escolas = await connection(table)
    .join('escola', 'escola_segmento.id_escola', '=', 'escola.id_escola')
    .where('escola_segmento.id_segmento', id_segmento)
    .select('escola.*')
    .orderBy('escola.nome_escola');
  
  return escolas;
};

// Listar todos os relacionamentos
export const listarTodos = async (): Promise<EscolaSegmento[]> => {
  const relacoes = await connection(table)
    .select('*');
  
  return relacoes;
};

// Criar novo relacionamento escola-segmento
export const criar = async (relacao: EscolaSegmento): Promise<void> => {
  await connection(table)
    .insert(relacao);
};

// Criar múltiplos relacionamentos para uma escola
export const criarMultiplos = async (id_escola: string, ids_segmentos: string[]): Promise<void> => {
  const relacoes = ids_segmentos.map(id_segmento => ({
    id_escola,
    id_segmento
  }));
  
  await connection(table)
    .insert(relacoes);
};

// Remover relacionamento específico
export const remover = async (id_escola: string, id_segmento: string): Promise<void> => {
  await connection(table)
    .where({ id_escola, id_segmento })
    .delete();
};

// Remover todos os segmentos de uma escola
export const removerTodosDaEscola = async (id_escola: string): Promise<void> => {
  await connection(table)
    .where({ id_escola })
    .delete();
};

// Remover todas as escolas de um segmento
export const removerTodasDoSegmento = async (id_segmento: string): Promise<void> => {
  await connection(table)
    .where({ id_segmento })
    .delete();
};

// Atualizar segmentos de uma escola (remove todos e adiciona os novos)
export const atualizarSegmentosEscola = async (id_escola: string, ids_segmentos: string[]): Promise<void> => {
  return await connection.transaction(async (trx) => {
    // Remove todos os segmentos existentes da escola
    await trx(table)
      .where({ id_escola })
      .delete();
    
    // Adiciona os novos segmentos
    if (ids_segmentos.length > 0) {
      const relacoes = ids_segmentos.map(id_segmento => ({
        id_escola,
        id_segmento
      }));
      
      await trx(table)
        .insert(relacoes);
    }
  });
};

// Verificar se relacionamento existe
export const existe = async (id_escola: string, id_segmento: string): Promise<boolean> => {
  const relacao = await connection(table)
    .where({ id_escola, id_segmento })
    .count('* as total')
    .first();
  
  return Number(relacao?.total || 0) > 0;
};

// Contar quantas escolas tem um segmento
export const contarEscolasPorSegmento = async (id_segmento: string): Promise<number> => {
  const resultado = await connection(table)
    .where({ id_segmento })
    .count('* as total')
    .first();
  
  return Number(resultado?.total || 0);
};

// Contar quantos segmentos uma escola tem
export const contarSegmentosPorEscola = async (id_escola: string): Promise<number> => {
  const resultado = await connection(table)
    .where({ id_escola })
    .count('* as total')
    .first();
  
  return Number(resultado?.total || 0);
};
