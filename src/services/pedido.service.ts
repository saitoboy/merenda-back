import * as PedidoModel from '../model/pedido.model';
import * as EscolaModel from '../model/escola.model';
import * as ItemModel from '../model/item.model';
import { Pedido } from '../types';
import { gerarUUID, logger } from '../utils';

export const buscarTodosPedidos = async () => {
  try {
    logger.info('Buscando todos os pedidos com detalhes', 'pedido');
    // Buscar pedidos com detalhes (joins com escolas, itens e fornecedores)
    const pedidos = await PedidoModel.buscarPedidosDetalhados();
    logger.success(`Encontrados ${pedidos.length} pedidos`, 'pedido');
    return pedidos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar pedidos: ${error.message}`, 'pedido');
      throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar pedidos', 'pedido');
      throw new Error('Erro desconhecido ao buscar pedidos');
    }
  }
};

export const buscarPedidosPorEscola = async (idEscola: string) => {
  try {
    logger.info(`Buscando pedidos da escola ID: ${idEscola}`, 'pedido');
    
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    
    if (!escola) {
      logger.warning(`Escola com ID ${idEscola} não encontrada`, 'pedido');
      throw new Error('Escola não encontrada');
    }
    
    logger.debug(`Escola ${escola.nome_escola} encontrada, buscando pedidos`, 'pedido');
    
    // Buscar os pedidos da escola
    const pedidos = await PedidoModel.buscarPorEscola(idEscola);
    logger.success(`Encontrados ${pedidos.length} pedidos para a escola ${escola.nome_escola}`, 'pedido');
    
    return pedidos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar pedidos da escola: ${error.message}`, 'pedido');
      throw new Error(`Erro ao buscar pedidos da escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar pedidos da escola', 'pedido');
      throw new Error('Erro desconhecido ao buscar pedidos da escola');
    }
  }
};

export const buscarPedidoPorId = async (idPedido: string) => {
  try {
    logger.info(`Buscando pedido com ID: ${idPedido}`, 'pedido');
    const pedido = await PedidoModel.buscarPorId(idPedido);
    
    if (!pedido) {
      logger.warning(`Pedido com ID ${idPedido} não encontrado`, 'pedido');
      throw new Error('Pedido não encontrado');
    }
      logger.success(`Pedido ${idPedido} encontrado com sucesso`, 'pedido');
    return pedido;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar pedido: ${error.message}`, 'pedido');
      throw new Error(`Erro ao buscar pedido: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar pedido', 'pedido');
      throw new Error('Erro desconhecido ao buscar pedido');
    }
  }
};

export const criarPedido = async (dados: Omit<Pedido, 'id_pedido'>) => {  try {
    logger.info('Iniciando criação de novo pedido', 'pedido');
    logger.debug(`Dados do pedido: Escola ${dados.id_escola}, Item ${dados.id_item}, Quantidade ${dados.quantidade_pedido}`, 'pedido');
    
    // Verificar se a escola existe
    logger.debug(`Verificando se a escola ${dados.id_escola} existe`, 'pedido');
    const escola = await EscolaModel.buscarPorId(dados.id_escola);
    
    if (!escola) {
      logger.warning(`Escola com ID ${dados.id_escola} não encontrada`, 'pedido');
      throw new Error('Escola não encontrada');
    }
    
    // Verificar se o item existe
    logger.debug(`Verificando se o item ${dados.id_item} existe`, 'pedido');
    const item = await ItemModel.buscarPorId(dados.id_item);
    
    if (!item) {
      logger.warning(`Item com ID ${dados.id_item} não encontrado`, 'pedido');
      throw new Error('Item não encontrado');
    }
    
    logger.debug(`Escola e item validados com sucesso`, 'pedido');
    
    // Criar o pedido
    const id = await PedidoModel.criar(dados);
    logger.success(`Pedido criado com sucesso: ID ${id}`, 'pedido');
    
    return {
      id_pedido: id,
      mensagem: 'Pedido criado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar pedido: ${error.message}`, 'pedido');
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao criar pedido', 'pedido');
      throw new Error('Erro desconhecido ao criar pedido');
    }
  }
};

export const atualizarPedido = async (idPedido: string, dados: Partial<Pedido>) => {
  try {
    logger.info(`Iniciando atualização do pedido com ID: ${idPedido}`, 'pedido');
    
    // Verificar se o pedido existe
    logger.debug(`Verificando se o pedido ${idPedido} existe`, 'pedido');
    const pedido = await PedidoModel.buscarPorId(idPedido);
    
    if (!pedido) {
      logger.warning(`Pedido com ID ${idPedido} não encontrado para atualização`, 'pedido');
      throw new Error('Pedido não encontrado');
    }
    
    // Se estiver tentando mudar a escola, verificar se a nova escola existe
    if (dados.id_escola && dados.id_escola !== pedido.id_escola) {
      logger.debug(`Verificando se a nova escola ${dados.id_escola} existe`, 'pedido');
      const escola = await EscolaModel.buscarPorId(dados.id_escola);
      
      if (!escola) {
        logger.warning(`Escola com ID ${dados.id_escola} não encontrada`, 'pedido');
        throw new Error('Escola não encontrada');
      }
      logger.debug(`Nova escola ${escola.nome_escola} válida`, 'pedido');
    }
    
    // Se estiver tentando mudar o item, verificar se o novo item existe
    if (dados.id_item && dados.id_item !== pedido.id_item) {
      logger.debug(`Verificando se o novo item ${dados.id_item} existe`, 'pedido');
      const item = await ItemModel.buscarPorId(dados.id_item);
      
      if (!item) {
        logger.warning(`Item com ID ${dados.id_item} não encontrado`, 'pedido');
        throw new Error('Item não encontrado');
      }
      logger.debug(`Novo item válido`, 'pedido');
    }
    
    // Atualizar o pedido
    logger.debug(`Atualizando pedido ${idPedido}`, 'pedido');
    await PedidoModel.atualizar(idPedido, dados);
    logger.success(`Pedido ${idPedido} atualizado com sucesso`, 'pedido');
    
    return {
      mensagem: 'Pedido atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar pedido: ${error.message}`, 'pedido');
      throw new Error(`Erro ao atualizar pedido: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao atualizar pedido', 'pedido');
      throw new Error('Erro desconhecido ao atualizar pedido');
    }
  }
};

export const excluirPedido = async (idPedido: string) => {
  try {
    logger.info(`Iniciando exclusão do pedido com ID: ${idPedido}`, 'pedido');
    
    // Verificar se o pedido existe
    logger.debug(`Verificando se o pedido ${idPedido} existe`, 'pedido');
    const pedido = await PedidoModel.buscarPorId(idPedido);
    
    if (!pedido) {
      logger.warning(`Pedido com ID ${idPedido} não encontrado para exclusão`, 'pedido');
      throw new Error('Pedido não encontrado');
    }
    
    // Excluir o pedido
    logger.debug(`Excluindo pedido ${idPedido}`, 'pedido');
    await PedidoModel.excluir(idPedido);
    logger.success(`Pedido ${idPedido} excluído com sucesso`, 'pedido');
    
    return {
      mensagem: 'Pedido excluído com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao excluir pedido: ${error.message}`, 'pedido');
      throw new Error(`Erro ao excluir pedido: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao excluir pedido', 'pedido');
      throw new Error('Erro desconhecido ao excluir pedido');
    }
  }
};

export const buscarPedidosPorPeriodo = async (dataInicial: Date, dataFinal: Date) => {
  try {
    logger.info(`Buscando pedidos entre ${dataInicial.toISOString().split('T')[0]} e ${dataFinal.toISOString().split('T')[0]}`, 'pedido');
    
    // Validar as datas
    if (dataFinal < dataInicial) {
      logger.warning('Data final anterior à data inicial', 'pedido');
      throw new Error('Data final não pode ser anterior à data inicial');
    }
    
    const pedidos = await PedidoModel.buscarPorPeriodo(dataInicial, dataFinal);
    logger.success(`Encontrados ${pedidos.length} pedidos no período especificado`, 'pedido');
    
    return pedidos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar pedidos por período: ${error.message}`, 'pedido');
      throw new Error(`Erro ao buscar pedidos por período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar pedidos por período', 'pedido');
      throw new Error('Erro desconhecido ao buscar pedidos por período');
    }
  }
};
