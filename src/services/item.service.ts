import * as ItemModel from '../model/item.model';
import * as FornecedorModel from '../model/fornecedor.model';
import { Item } from '../types';
import { gerarUUID, logger } from '../utils';

export const buscarTodosItens = async () => {
  try {
    logger.info('Buscando todos os itens cadastrados', 'item');
    const itens = await ItemModel.listarTodos();
    logger.success(`Encontrados ${itens.length} itens`, 'item');
    return itens;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar itens: ${error.message}`, 'item');
      throw new Error(`Erro ao buscar itens: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar itens', 'item');
      throw new Error('Erro desconhecido ao buscar itens');
    }
  }
};

export const buscarItemPorId = async (idItem: string) => {
  try {
    logger.info(`Buscando item com ID: ${idItem}`, 'item');
    const item = await ItemModel.buscarPorId(idItem);
    
    if (!item) {
      logger.warning(`Item com ID ${idItem} não encontrado`, 'item');
      throw new Error('Item não encontrado');
    }
    
    logger.success(`Item ${item.nome_item} encontrado com sucesso`, 'item');
    return item;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar item: ${error.message}`, 'item');
      throw new Error(`Erro ao buscar item: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar item', 'item');
      throw new Error('Erro desconhecido ao buscar item');
    }
  }
};

export const buscarItensPorFornecedor = async (idFornecedor: string) => {
  try {
    logger.info(`Buscando itens do fornecedor ID: ${idFornecedor}`, 'item');
    
    // Verificar se o fornecedor existe
    const fornecedor = await FornecedorModel.buscarPorId(idFornecedor);
    
    if (!fornecedor) {
      logger.warning(`Fornecedor com ID ${idFornecedor} não encontrado`, 'item');
      throw new Error('Fornecedor não encontrado');
    }
    
    logger.debug(`Fornecedor ${fornecedor.nome_fornecedor} encontrado, buscando itens`, 'item');
    
    // Buscar os itens do fornecedor
    const itens = await ItemModel.buscarPorFornecedor(idFornecedor);
    logger.success(`Encontrados ${itens.length} itens para o fornecedor ${fornecedor.nome_fornecedor}`, 'item');
    
    return itens;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar itens do fornecedor: ${error.message}`, 'item');
      throw new Error(`Erro ao buscar itens do fornecedor: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar itens do fornecedor', 'item');
      throw new Error('Erro desconhecido ao buscar itens do fornecedor');
    }
  }
};

export const criarItem = async (dados: Omit<Item, 'id_item'>) => {
  try {
    logger.info('Iniciando criação de novo item', 'item');
    logger.debug(`Dados do item: ${dados.nome_item}, Fornecedor: ${dados.id_fornecedor}, Preço: ${dados.preco_item}`, 'item');
    
    // Verificar se o fornecedor existe
    logger.debug(`Verificando se o fornecedor ${dados.id_fornecedor} existe`, 'item');
    const fornecedor = await FornecedorModel.buscarPorId(dados.id_fornecedor);
    
    if (!fornecedor) {
      logger.warning(`Fornecedor com ID ${dados.id_fornecedor} não encontrado`, 'item');
      throw new Error('Fornecedor não encontrado');
    }
    
    logger.debug(`Fornecedor ${fornecedor.nome_fornecedor} validado com sucesso`, 'item');
    
    // Verificar se já existe item com mesmo nome e fornecedor
    const itensExistentes = await ItemModel.buscarPorFornecedor(dados.id_fornecedor);
    const itemDuplicado = itensExistentes.find(item => 
      item.nome_item.toLowerCase() === dados.nome_item.toLowerCase()
    );
    
    if (itemDuplicado) {
      logger.warning(`Já existe um item com o nome "${dados.nome_item}" para este fornecedor`, 'item');
      throw new Error(`Já existe um item com o nome "${dados.nome_item}" para este fornecedor`);
    }
    
    // Criar o item
    const id = await ItemModel.criar(dados);
    logger.success(`Item ${dados.nome_item} criado com sucesso: ID ${id}`, 'item');
    
    return {
      id_item: id,
      mensagem: 'Item criado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar item: ${error.message}`, 'item');
      throw new Error(`Erro ao criar item: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao criar item', 'item');
      throw new Error('Erro desconhecido ao criar item');
    }
  }
};

export const atualizarItem = async (idItem: string, dados: Partial<Item>) => {
  try {
    logger.info(`Iniciando atualização do item com ID: ${idItem}`, 'item');
    
    // Verificar se o item existe
    logger.debug(`Verificando se o item ${idItem} existe`, 'item');
    const item = await ItemModel.buscarPorId(idItem);
    
    if (!item) {
      logger.warning(`Item com ID ${idItem} não encontrado para atualização`, 'item');
      throw new Error('Item não encontrado');
    }
    
    // Se estiver tentando mudar o fornecedor, verificar se o novo fornecedor existe
    if (dados.id_fornecedor && dados.id_fornecedor !== item.id_fornecedor) {
      logger.debug(`Verificando se o novo fornecedor ${dados.id_fornecedor} existe`, 'item');
      const fornecedor = await FornecedorModel.buscarPorId(dados.id_fornecedor);
      
      if (!fornecedor) {
        logger.warning(`Fornecedor com ID ${dados.id_fornecedor} não encontrado`, 'item');
        throw new Error('Fornecedor não encontrado');
      }
      logger.debug(`Novo fornecedor ${fornecedor.nome_fornecedor} válido`, 'item');
    }
    
    // Atualizar o item
    logger.debug(`Atualizando item ${idItem}`, 'item');
    await ItemModel.atualizar(idItem, dados);
    logger.success(`Item ${item.nome_item} atualizado com sucesso`, 'item');
    
    return {
      mensagem: 'Item atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar item: ${error.message}`, 'item');
      throw new Error(`Erro ao atualizar item: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao atualizar item', 'item');
      throw new Error('Erro desconhecido ao atualizar item');
    }
  }
};

export const excluirItem = async (idItem: string) => {
  try {
    logger.info(`Iniciando exclusão do item com ID: ${idItem}`, 'item');
    
    // Verificar se o item existe
    logger.debug(`Verificando se o item ${idItem} existe`, 'item');
    const item = await ItemModel.buscarPorId(idItem);
    
    if (!item) {
      logger.warning(`Item com ID ${idItem} não encontrado para exclusão`, 'item');
      throw new Error('Item não encontrado');
    }
    
    // Excluir o item
    logger.debug(`Excluindo item ${idItem}`, 'item');
    await ItemModel.excluir(idItem);
    logger.success(`Item ${item.nome_item} excluído com sucesso`, 'item');
    
    return {
      mensagem: 'Item excluído com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao excluir item: ${error.message}`, 'item');
      throw new Error(`Erro ao excluir item: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao excluir item', 'item');
      throw new Error('Erro desconhecido ao excluir item');
    }
  }
};

export const importarItens = async (itens: Omit<Item, 'id_item'>[]) => {
  try {
    logger.info(`Iniciando importação em massa de ${itens.length} itens`, 'item');
    
    // Validação básica dos dados
    if (!Array.isArray(itens) || itens.length === 0) {
      logger.warning('Nenhum item para importar', 'item');
      throw new Error('Nenhum item para importar');
    }
    
    const resultados = [];
    const erros = [];
    
    logger.debug(`Processando ${itens.length} itens para importação`, 'item');
    
    // Processar cada item
    for (const [index, itemData] of itens.entries()) {
      try {
        // Verificar campos obrigatórios
        if (!itemData.nome_item || !itemData.unidade_medida || !itemData.sazonalidade || !itemData.id_fornecedor || !itemData.preco_item) {
          const erro = `Item #${index + 1}: Dados obrigatórios ausentes`;
          logger.warning(erro, 'item');
          erros.push({ indice: index, erro });
          continue;
        }

        // Verificar se o fornecedor existe
        const fornecedor = await FornecedorModel.buscarPorId(itemData.id_fornecedor);
        if (!fornecedor) {
          const erro = `Item #${index + 1}: Fornecedor com ID ${itemData.id_fornecedor} não encontrado`;
          logger.warning(erro, 'item');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Verificar se já existe item com mesmo nome e fornecedor
        const itensExistentes = await ItemModel.buscarPorFornecedor(itemData.id_fornecedor);
        const itemDuplicado = itensExistentes.find(item => 
          item.nome_item.toLowerCase() === itemData.nome_item.toLowerCase()
        );
        
        if (itemDuplicado) {
          const erro = `Item #${index + 1}: Já existe um item com o nome "${itemData.nome_item}" para o fornecedor ${fornecedor.nome_fornecedor}`;
          logger.warning(erro, 'item');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Criar o item
        const id = await ItemModel.criar(itemData);
        logger.success(`Item #${index + 1} (${itemData.nome_item}) importado com sucesso, ID: ${id}`, 'item');
        
        resultados.push({
          indice: index,
          id,
          nome: itemData.nome_item,
          fornecedor: fornecedor.nome_fornecedor
        });
      } catch (e) {
        const erro = e instanceof Error ? e.message : 'Erro desconhecido';
        logger.error(`Erro ao importar item #${index + 1}: ${erro}`, 'item');
        erros.push({ indice: index, erro });
      }
    }
    
    logger.info(`Importação concluída: ${resultados.length} itens importados com sucesso, ${erros.length} falhas`, 'item');
    
    return {
      total: itens.length,
      sucesso: resultados.length,
      falhas: erros.length,
      resultados,
      erros
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro durante a importação em massa de itens: ${error.message}`, 'item');
      throw new Error(`Erro durante a importação em massa: ${error.message}`);
    } else {
      logger.error('Erro desconhecido durante a importação em massa de itens', 'item');
      throw new Error('Erro desconhecido durante a importação em massa');
    }
  }
};
