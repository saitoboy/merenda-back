import * as PedidoModel from '../model/pedido.model';
import * as EscolaModel from '../model/escola.model';
import * as ItemModel from '../model/item.model';
import { Pedido } from '../types';
import { gerarUUID } from '../utils';

export const buscarTodosPedidos = async () => {
  try {
    // Buscar pedidos com detalhes (joins com escolas, itens e fornecedores)
    return await PedidoModel.buscarPedidosDetalhados();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar pedidos');
    }
  }
};

export const buscarPedidosPorEscola = async (idEscola: string) => {
  try {
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    
    if (!escola) {
      throw new Error('Escola não encontrada');
    }
    
    // Buscar os pedidos da escola
    return await PedidoModel.buscarPorEscola(idEscola);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar pedidos da escola: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar pedidos da escola');
    }
  }
};

export const buscarPedidoPorId = async (idPedido: string) => {
  try {
    const pedido = await PedidoModel.buscarPorId(idPedido);
    
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
    
    return pedido;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar pedido: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar pedido');
    }
  }
};

export const criarPedido = async (dados: Omit<Pedido, 'id_pedido'>) => {
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
    
    // Criar o pedido
    const id = await PedidoModel.criar(dados);
    
    return {
      id_pedido: id,
      mensagem: 'Pedido criado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao criar pedido');
    }
  }
};

export const atualizarPedido = async (idPedido: string, dados: Partial<Pedido>) => {
  try {
    // Verificar se o pedido existe
    const pedido = await PedidoModel.buscarPorId(idPedido);
    
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
    
    // Se estiver tentando mudar a escola, verificar se a nova escola existe
    if (dados.id_escola && dados.id_escola !== pedido.id_escola) {
      const escola = await EscolaModel.buscarPorId(dados.id_escola);
      
      if (!escola) {
        throw new Error('Escola não encontrada');
      }
    }
    
    // Se estiver tentando mudar o item, verificar se o novo item existe
    if (dados.id_item && dados.id_item !== pedido.id_item) {
      const item = await ItemModel.buscarPorId(dados.id_item);
      
      if (!item) {
        throw new Error('Item não encontrado');
      }
    }
    
    // Atualizar o pedido
    await PedidoModel.atualizar(idPedido, dados);
    
    return {
      mensagem: 'Pedido atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar pedido: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar pedido');
    }
  }
};

export const excluirPedido = async (idPedido: string) => {
  try {
    // Verificar se o pedido existe
    const pedido = await PedidoModel.buscarPorId(idPedido);
    
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
    
    // Excluir o pedido
    await PedidoModel.excluir(idPedido);
    
    return {
      mensagem: 'Pedido excluído com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao excluir pedido: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao excluir pedido');
    }
  }
};

export const buscarPedidosPorPeriodo = async (dataInicial: Date, dataFinal: Date) => {
  try {
    return await PedidoModel.buscarPorPeriodo(dataInicial, dataFinal);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao buscar pedidos por período: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao buscar pedidos por período');
    }
  }
};
