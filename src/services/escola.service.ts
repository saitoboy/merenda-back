import * as EscolaModel from '../model/escola.model';
import { Escola } from '../types';
import { gerarUUID } from '../utils';

export const buscarTodasEscolas = async () => {
  try {
    return await EscolaModel.listarTodas();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar escolas: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar escolas');
    }
  }
};

export const buscarEscolaPorId = async (id: string) => {
  try {
    const escola = await EscolaModel.buscarPorId(id);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    return escola;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar escola: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar escola');
    }
  }
};

export const criarEscola = async (dados: Omit<Escola, 'id_escola'>) => {
  try {
    // Verificar se já existe escola com o mesmo email
    const escolaExistente = await EscolaModel.buscarPorEmail(dados.email_escola);
    
    if (escolaExistente) {
      throw new Error('Já existe uma escola com este email');
    }
    
    const id = await EscolaModel.criar(dados);
    
    return {
      id,
      mensagem: 'Escola criada com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao criar escola: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao criar escola');
    }
  }
};

export const atualizarEscola = async (id: string, dados: Partial<Escola>) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(id);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    // Verificar se está tentando mudar o email para um que já existe
    if (dados.email_escola && dados.email_escola !== escola.email_escola) {
      const escolaExistente = await EscolaModel.buscarPorEmail(dados.email_escola);
      
      if (escolaExistente) {
        throw new Error('Já existe uma escola com este email');
      }
    }
    
    await EscolaModel.atualizar(id, dados);
    
    return {
      mensagem: 'Escola atualizada com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar escola: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar escola');
    }
  }
};

export const excluirEscola = async (id: string) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(id);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    await EscolaModel.excluir(id);
    
    return {
      mensagem: 'Escola excluída com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao excluir escola: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao excluir escola');
    }
  }
};

export const buscarEscolasPorSegmento = async (segmento: string) => {
  try {
    return await EscolaModel.buscarPorSegmento(segmento);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar escolas por segmento: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar escolas por segmento');
    }
  }
};
