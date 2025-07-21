import connection from '../connection';
import { Ramal, Escola } from '../types';
import { logInfo, logError } from '../utils/logger';

const tableRamal = 'ramal';
const tableEscola = 'escola';

export const listarRamais = async (): Promise<Ramal[]> => {
  try {
    logInfo('Listando todos os ramais', 'ramal.service');
    const ramais: Ramal[] = await connection(tableRamal).select('*').orderBy('nome_ramal');
    for (const ramal of ramais) {
      ramal.escolas = await connection(tableEscola).where('ramal_id', ramal.id_ramal).select('*');
    }
    return ramais;
  } catch (error) {
    logError('Erro ao listar ramais', 'ramal.service', error);
    throw new Error('Erro ao listar ramais');
  }
};

export const buscarRamalPorId = async (id_ramal: string): Promise<Ramal | undefined> => {
  try {
    logInfo(`Buscando ramal por id: ${id_ramal}`, 'ramal.service');
    const ramal: Ramal | undefined = await connection(tableRamal).where('id_ramal', id_ramal).first();
    if (ramal) {
      ramal.escolas = await connection(tableEscola).where('ramal_id', id_ramal).select('*');
    }
    return ramal;
  } catch (error) {
    logError('Erro ao buscar ramal por id', 'ramal.service', error);
    throw new Error('Erro ao buscar ramal por id');
  }
};

export const criarRamal = async (nome_ramal: string): Promise<Ramal> => {
  try {
    logInfo(`Criando ramal: ${nome_ramal}`, 'ramal.service');
    const [ramal] = await connection(tableRamal)
      .insert({ nome_ramal })
      .returning('*');
    return ramal;
  } catch (error) {
    logError('Erro ao criar ramal', 'ramal.service', error);
    throw new Error('Erro ao criar ramal');
  }
};

export const editarRamal = async (id_ramal: string, nome_ramal: string): Promise<number> => {
  try {
    logInfo(`Editando ramal: ${id_ramal}`, 'ramal.service');
    return await connection(tableRamal).where('id_ramal', id_ramal).update({ nome_ramal });
  } catch (error) {
    logError('Erro ao editar ramal', 'ramal.service', error);
    throw new Error('Erro ao editar ramal');
  }
};

export const deletarRamal = async (id_ramal: string): Promise<void> => {
  try {
    logInfo(`Tentando deletar ramal: ${id_ramal}`, 'ramal.service');
    const escolas = await connection(tableEscola).where('ramal_id', id_ramal);
    if (escolas.length > 0) {
      throw new Error('Não é possível deletar ramal com escolas associadas');
    }
    await connection(tableRamal).where('id_ramal', id_ramal).del();
    logInfo(`Ramal deletado: ${id_ramal}`, 'ramal.service');
  } catch (error) {
    logError('Erro ao deletar ramal', 'ramal.service', error);
    throw error;
  }
};

export const buscarEscolasPorRamal = async (id_ramal: string): Promise<Escola[]> => {
  try {
    return await connection(tableEscola).where('ramal_id', id_ramal).select('*');
  } catch (error) {
    logError('Erro ao buscar escolas por ramal', 'ramal.service', error);
    throw new Error('Erro ao buscar escolas por ramal');
  }
};
