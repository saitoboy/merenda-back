import * as EstoqueModel from '../model/estoque.model';
import * as EscolaModel from '../model/escola.model';
import * as ItemModel from '../model/item.model';
import { Estoque } from '../types';

export const buscarEstoquePorEscola = async (idEscola: string) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    // Buscar os itens de estoque detalhados (com join na tabela de itens)
    const estoque = await EstoqueModel.buscarDetalhesEstoquePorEscola(idEscola);
    
    return estoque;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar estoque');
    }
  }
};

export const buscarItensAbaixoIdeal = async (idEscola: string) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    // Buscar os itens abaixo do ideal
    const itensAbaixoIdeal = await EstoqueModel.buscarItensAbaixoIdeal(idEscola);
    
    return itensAbaixoIdeal;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar itens abaixo do ideal: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar itens abaixo do ideal');
    }
  }
};

export const atualizarQuantidade = async (idEscola: string, idItem: string, quantidade: number) => {
  try {
    // Verificar se o item existe no estoque da escola
    const estoqueItem = await EstoqueModel.buscar(idEscola, idItem);
    
    if (!estoqueItem) {
      throw new Error('Item não encontrado no estoque desta escola');
    }
    
    // Atualizar a quantidade
    await EstoqueModel.atualizarQuantidade(idEscola, idItem, quantidade);
    
    return {
      mensagem: 'Quantidade atualizada com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar quantidade: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar quantidade');
    }
  }
};

export const atualizarNumeroIdeal = async (idEscola: string, idItem: string, numeroIdeal: number) => {
  try {
    // Verificar se o item existe no estoque da escola
    const estoqueItem = await EstoqueModel.buscar(idEscola, idItem);
    
    if (!estoqueItem) {
      throw new Error('Item não encontrado no estoque desta escola');
    }
    
    // Atualizar o número ideal
    await EstoqueModel.atualizarNumeroIdeal(idEscola, idItem, numeroIdeal);
    
    return {
      mensagem: 'Número ideal atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar número ideal: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar número ideal');
    }
  }
};

export const adicionarItemAoEstoque = async (dados: Estoque) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(dados.id_escola);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    // Verificar se o item existe
    const item = await ItemModel.buscarPorId(dados.id_item);
    
    if (!item) {
      throw new Error('Item não encontrado');
    }
    
    // Verificar se o item já existe no estoque da escola
    const estoqueExistente = await EstoqueModel.buscar(dados.id_escola, dados.id_item);
    
    if (estoqueExistente) {
      throw new Error('Este item já existe no estoque desta escola');
    }
    
    // Adicionar o item ao estoque
    await EstoqueModel.criar(dados);
    
    return {
      mensagem: 'Item adicionado ao estoque com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao adicionar item ao estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao adicionar item ao estoque');
    }
  }
};

export const removerItemDoEstoque = async (idEscola: string, idItem: string) => {
  try {
    // Verificar se o item existe no estoque da escola
    const estoqueItem = await EstoqueModel.buscar(idEscola, idItem);
    
    if (!estoqueItem) {
      throw new Error('Item não encontrado no estoque desta escola');
    }
    
    // Remover o item do estoque
    await EstoqueModel.remover(idEscola, idItem);
    
    return {
      mensagem: 'Item removido do estoque com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao remover item do estoque: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao remover item do estoque');
    }
  }
};

export const obterMetricas = async (idEscola: string) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    // Obter métricas
    const metricas = await EstoqueModel.obterMetricasEstoque(idEscola);
    
    return metricas;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao obter métricas: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao obter métricas');
    }
  }
};
