import connection from '../connection';
import { Segmento } from '../types';

const table = 'segmento';

// Buscar segmento por ID
export const buscarPorId = async (id_segmento: string): Promise<Segmento | undefined> => {
  const segmento = await connection(table)
    .where({ id_segmento })
    .first();
  
  return segmento;
};

// Buscar segmento por nome
export const buscarPorNome = async (nome_segmento: string): Promise<Segmento | undefined> => {
  const segmento = await connection(table)
    .where({ nome_segmento })
    .first();
  
  return segmento;
};

// Listar todos os segmentos
export const listarTodos = async (): Promise<Segmento[]> => {
  const segmentos = await connection(table)
    .select('*')
    .orderBy('nome_segmento');
  
  return segmentos;
};

// Criar novo segmento
export const criar = async (segmento: Omit<Segmento, 'id_segmento'>): Promise<string> => {
  const [result] = await connection(table)
    .insert(segmento)
    .returning('id_segmento');
  
  return result.id_segmento;
};

// Atualizar segmento
export const atualizar = async (id_segmento: string, dados: Partial<Omit<Segmento, 'id_segmento'>>): Promise<void> => {
  await connection(table)
    .where({ id_segmento })
    .update(dados);
};

// Excluir segmento
export const excluir = async (id_segmento: string): Promise<void> => {
  await connection(table)
    .where({ id_segmento })
    .delete();
};

// Buscar segmentos por escola
export const buscarPorEscola = async (id_escola: string): Promise<Segmento[]> => {
  const segmentos = await connection(table)
    .join('escola_segmento', 'segmento.id_segmento', '=', 'escola_segmento.id_segmento')
    .where('escola_segmento.id_escola', id_escola)
    .select('segmento.*')
    .orderBy('segmento.nome_segmento');
  
  return segmentos;
};

// Verificar se segmento existe
export const existe = async (id_segmento: string): Promise<boolean> => {
  const segmento = await connection(table)
    .where({ id_segmento })
    .count('* as total')
    .first();
  
  return Number(segmento?.total || 0) > 0;
};
