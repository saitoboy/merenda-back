import connection from '../connection';
import { logInfo, logError } from '../utils/logger';
import { Ramal, Escola } from '../types';

const table = 'ramal';
const tableEscola = 'escola';

// Buscar ramal por ID (com escolas associadas)
export const buscarPorId = async (id_ramal: string): Promise<Ramal | undefined> => {
  try {
    const ramal = await connection(table).where({ id_ramal }).first();
    if (!ramal) return undefined;
    ramal.escolas = await connection(tableEscola).where('ramal_id', id_ramal).select('*');
    return ramal;
  } catch (error) {
    logError('Erro ao buscar ramal por id', 'ramal.model', error);
    throw error;
  }
};

// Listar todos os ramais (com escolas associadas)
export const listarTodos = async (): Promise<Ramal[]> => {
  try {
    const ramais: Ramal[] = await connection(table).select('*').orderBy('nome_ramal');
    for (const ramal of ramais) {
      ramal.escolas = await connection(tableEscola).where('ramal_id', ramal.id_ramal).select('*');
    }
    return ramais;
  } catch (error) {
    logError('Erro ao listar ramais', 'ramal.model', error);
    throw error;
  }
};

// Criar novo ramal
export const criar = async (nome_ramal: string): Promise<Ramal> => {
  try {
    const [ramal] = await connection(table)
      .insert({ nome_ramal })
      .returning('*');
    return ramal;
  } catch (error) {
    logError('Erro ao criar ramal', 'ramal.model', error);
    throw error;
  }
};

// Atualizar ramal
export const atualizar = async (id_ramal: string, nome_ramal: string): Promise<number> => {
  try {
    return await connection(table).where({ id_ramal }).update({ nome_ramal });
  } catch (error) {
    logError('Erro ao atualizar ramal', 'ramal.model', error);
    throw error;
  }
};

// Remover ramal (só se não houver escolas associadas)
export const remover = async (id_ramal: string): Promise<void> => {
  try {
    const escolas = await connection(tableEscola).where('ramal_id', id_ramal);
    if (escolas.length > 0) {
      throw new Error('Não é possível deletar ramal com escolas associadas');
    }
    await connection(table).where({ id_ramal }).delete();
  } catch (error) {
    logError('Erro ao remover ramal', 'ramal.model', error);
    throw error;
  }
};

// Buscar escolas associadas a um ramal
export const buscarEscolasPorRamal = async (id_ramal: string): Promise<Escola[]> => {
  try {
    return await connection(tableEscola).where('ramal_id', id_ramal).select('*');
  } catch (error) {
    logError('Erro ao buscar escolas por ramal', 'ramal.model', error);
    throw error;
  }
};
