import * as SegmentoModel from '../model/segmento.model';
import * as EscolaSegmentoModel from '../model/escola-segmento.model';
import { Segmento } from '../types';
import { gerarUUID, logger } from '../utils';

/**
 * Buscar todos os segmentos
 */
export const buscarTodosSegmentos = async () => {
  try {
    logger.info('Buscando todos os segmentos', 'segmento');
    const segmentos = await SegmentoModel.listarTodos();
    logger.success(`Encontrados ${segmentos.length} segmentos`, 'segmento');
    return segmentos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar segmentos: ${error.message}`, 'segmento');
      throw new Error(`Erro ao buscar segmentos: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar segmentos', 'segmento');
      throw new Error('Erro desconhecido ao buscar segmentos');
    }
  }
};

/**
 * Buscar segmento por ID
 */
export const buscarSegmentoPorId = async (id: string) => {
  try {
    logger.info(`Buscando segmento com ID: ${id}`, 'segmento');
    const segmento = await SegmentoModel.buscarPorId(id);
    
    if (!segmento) {
      logger.warning(`Segmento com ID ${id} não encontrado`, 'segmento');
      throw new Error('Segmento não encontrado');
    }
    
    logger.success(`Segmento ${segmento.nome_segmento} encontrado com sucesso`, 'segmento');
    return segmento;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar segmento: ${error.message}`, 'segmento');
      throw new Error(`Erro ao buscar segmento: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar segmento', 'segmento');
      throw new Error('Erro desconhecido ao buscar segmento');
    }
  }
};

/**
 * Buscar segmento por nome
 */
export const buscarSegmentoPorNome = async (nome: string) => {
  try {
    logger.info(`Buscando segmento com nome: ${nome}`, 'segmento');
    const segmento = await SegmentoModel.buscarPorNome(nome);
    
    if (!segmento) {
      logger.warning(`Segmento com nome ${nome} não encontrado`, 'segmento');
      throw new Error('Segmento não encontrado');
    }
    
    logger.success(`Segmento ${segmento.nome_segmento} encontrado com sucesso`, 'segmento');
    return segmento;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar segmento por nome: ${error.message}`, 'segmento');
      throw new Error(`Erro ao buscar segmento por nome: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar segmento por nome', 'segmento');
      throw new Error('Erro desconhecido ao buscar segmento por nome');
    }
  }
};

/**
 * Criar novo segmento
 */
export const criarSegmento = async (dados: Omit<Segmento, 'id_segmento'>) => {
  try {
    logger.info('Iniciando criação de novo segmento', 'segmento');
    logger.debug(`Dados do segmento: ${dados.nome_segmento}`, 'segmento');
    
    // Verificar se já existe segmento com o mesmo nome
    logger.debug(`Verificando se já existe segmento com o nome: ${dados.nome_segmento}`, 'segmento');
    const segmentoExistente = await SegmentoModel.buscarPorNome(dados.nome_segmento);
    
    if (segmentoExistente) {
      logger.warning(`Já existe um segmento com o nome ${dados.nome_segmento}`, 'segmento');
      throw new Error('Já existe um segmento com este nome');
    }
    
    const id = await SegmentoModel.criar(dados);
    
    logger.success(`Segmento criado com sucesso: ${id}`, 'segmento');
    return {
      id,
      mensagem: 'Segmento criado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar segmento: ${error.message}`, 'segmento');
      throw new Error(`Erro ao criar segmento: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao criar segmento', 'segmento');
      throw new Error('Erro desconhecido ao criar segmento');
    }
  }
};

/**
 * Atualizar segmento
 */
export const atualizarSegmento = async (id: string, dados: Partial<Segmento>) => {
  try {
    logger.info(`Iniciando atualização do segmento com ID: ${id}`, 'segmento');
    
    // Verificar se o segmento existe
    logger.debug(`Verificando se o segmento ${id} existe`, 'segmento');
    const segmentoExistente = await SegmentoModel.buscarPorId(id);
    
    if (!segmentoExistente) {
      logger.warning(`Segmento com ID ${id} não encontrado para atualização`, 'segmento');
      throw new Error('Segmento não encontrado');
    }
    
    // Se estiver tentando atualizar o nome, verificar se já existe outro segmento com o mesmo nome
    if (dados.nome_segmento && dados.nome_segmento !== segmentoExistente.nome_segmento) {
      logger.debug(`Verificando se já existe segmento com o novo nome: ${dados.nome_segmento}`, 'segmento');
      const segmentoComMesmoNome = await SegmentoModel.buscarPorNome(dados.nome_segmento);
      
      if (segmentoComMesmoNome && segmentoComMesmoNome.id_segmento !== id) {
        logger.warning(`Já existe um segmento com o nome ${dados.nome_segmento}`, 'segmento');
        throw new Error('Já existe um segmento com este nome');
      }
    }
    
    logger.debug(`Atualizando dados do segmento ${segmentoExistente.nome_segmento}`, 'segmento');
    await SegmentoModel.atualizar(id, dados);
    
    logger.success(`Segmento ${segmentoExistente.nome_segmento} atualizado com sucesso`, 'segmento');
    return {
      mensagem: 'Segmento atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar segmento: ${error.message}`, 'segmento');
      throw new Error(`Erro ao atualizar segmento: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao atualizar segmento', 'segmento');
      throw new Error('Erro desconhecido ao atualizar segmento');
    }
  }
};

/**
 * Excluir segmento
 */
export const excluirSegmento = async (id: string) => {
  try {
    logger.info(`Iniciando exclusão do segmento com ID: ${id}`, 'segmento');
    
    // Verificar se o segmento existe
    const segmento = await SegmentoModel.buscarPorId(id);
    
    if (!segmento) {
      logger.warning(`Segmento com ID ${id} não encontrado para exclusão`, 'segmento');
      throw new Error('Segmento não encontrado');
    }
    
    // Verificar se existem escolas associadas a este segmento
    logger.debug(`Verificando se existem escolas associadas ao segmento ${segmento.nome_segmento}`, 'segmento');
    const escolasAssociadas = await EscolaSegmentoModel.buscarEscolasPorSegmento(id);
    
    if (escolasAssociadas.length > 0) {
      logger.warning(`Não é possível excluir o segmento ${segmento.nome_segmento} pois existem ${escolasAssociadas.length} escolas associadas`, 'segmento');
      throw new Error(`Não é possível excluir o segmento pois existem ${escolasAssociadas.length} escolas associadas. Remova as associações primeiro.`);
    }
    
    logger.debug(`Excluindo segmento ${segmento.nome_segmento}`, 'segmento');
    await SegmentoModel.excluir(id);
    
    logger.success(`Segmento ${segmento.nome_segmento} excluído com sucesso`, 'segmento');
    return {
      mensagem: 'Segmento excluído com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao excluir segmento: ${error.message}`, 'segmento');
      throw new Error(`Erro ao excluir segmento: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao excluir segmento', 'segmento');
      throw new Error('Erro desconhecido ao excluir segmento');
    }
  }
};

/**
 * Listar escolas por segmento
 */
export const listarEscolasPorSegmento = async (id: string) => {
  try {
    logger.info(`Listando escolas do segmento ${id}`, 'segmento');
    
    // Verificar se o segmento existe
    const segmento = await SegmentoModel.buscarPorId(id);
    if (!segmento) {
      logger.warning(`Segmento com ID ${id} não encontrado`, 'segmento');
      throw new Error('Segmento não encontrado');
    }
    
    const escolas = await EscolaSegmentoModel.buscarEscolasPorSegmento(id);
    
    logger.success(`Encontradas ${escolas.length} escolas para o segmento ${segmento.nome_segmento}`, 'segmento');
    return {
      segmento: segmento,
      escolas: escolas,
      total: escolas.length
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao listar escolas por segmento: ${error.message}`, 'segmento');
      throw new Error(`Erro ao listar escolas por segmento: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao listar escolas por segmento', 'segmento');
      throw new Error('Erro desconhecido ao listar escolas por segmento');
    }
  }
};

/**
 * Obter estatísticas do segmento
 */
export const obterEstatisticasSegmento = async (id: string) => {
  try {
    logger.info(`Obtendo estatísticas do segmento ${id}`, 'segmento');
    
    // Verificar se o segmento existe
    const segmento = await SegmentoModel.buscarPorId(id);
    if (!segmento) {
      logger.warning(`Segmento com ID ${id} não encontrado`, 'segmento');
      throw new Error('Segmento não encontrado');
    }
    
    // Buscar escolas associadas
    const escolas = await EscolaSegmentoModel.buscarEscolasPorSegmento(id);
    
    const estatisticas = {
      id_segmento: segmento.id_segmento,
      nome_segmento: segmento.nome_segmento,
      total_escolas: escolas.length,
      escolas_associadas: escolas.map(e => ({
        id_escola: e.id_escola,
        nome_escola: e.nome_escola
      })),
      data_consulta: new Date()
    };
    
    logger.success(`Estatísticas do segmento ${segmento.nome_segmento} obtidas com sucesso`, 'segmento');
    return estatisticas;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao obter estatísticas do segmento: ${error.message}`, 'segmento');
      throw new Error(`Erro ao obter estatísticas do segmento: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao obter estatísticas do segmento', 'segmento');
      throw new Error('Erro desconhecido ao obter estatísticas do segmento');
    }
  }
};

/**
 * Importar segmentos em massa
 */
export const importarSegmentos = async (segmentos: Omit<Segmento, 'id_segmento'>[]) => {
  try {
    logger.info(`Iniciando importação em massa de ${segmentos.length} segmentos`, 'segmento');
    
    // Validação básica dos dados
    if (!Array.isArray(segmentos) || segmentos.length === 0) {
      logger.warning('Nenhum segmento para importar', 'segmento');
      throw new Error('Nenhum segmento para importar');
    }
    
    const resultados: Array<{
      indice: number;
      id: string;
      nome: string;
    }> = [];
    const erros: Array<{
      indice: number;
      erro: string;
    }> = [];
    
    logger.debug(`Processando ${segmentos.length} segmentos para importação`, 'segmento');
    
    // Processar cada segmento
    for (const [index, segmentoData] of segmentos.entries()) {
      try {
        // Verificar dados obrigatórios
        if (!segmentoData.nome_segmento) {
          const erro = `Segmento #${index + 1}: Nome do segmento é obrigatório`;
          logger.warning(erro, 'segmento');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Verificar se já existe segmento com o mesmo nome
        const segmentoExistente = await SegmentoModel.buscarPorNome(segmentoData.nome_segmento);
        
        if (segmentoExistente) {
          const erro = `Segmento #${index + 1}: Já existe um segmento com o nome ${segmentoData.nome_segmento}`;
          logger.warning(erro, 'segmento');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Criar o segmento
        const id = await SegmentoModel.criar(segmentoData);
        logger.success(`Segmento #${index + 1} (${segmentoData.nome_segmento}) importado com sucesso, ID: ${id}`, 'segmento');
        
        resultados.push({
          indice: index,
          id,
          nome: segmentoData.nome_segmento
        });
      } catch (e) {
        const erro = e instanceof Error ? e.message : 'Erro desconhecido';
        logger.error(`Erro ao importar segmento #${index + 1}: ${erro}`, 'segmento');
        erros.push({ indice: index, erro });
      }
    }
    
    logger.info(`Importação concluída: ${resultados.length} segmentos importados com sucesso, ${erros.length} falhas`, 'segmento');
    
    return {
      total: segmentos.length,
      sucesso: resultados.length,
      falhas: erros.length,
      resultados,
      erros
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro durante a importação em massa: ${error.message}`, 'segmento');
      throw new Error(`Erro durante a importação em massa: ${error.message}`);
    } else {
      logger.error('Erro desconhecido durante a importação em massa', 'segmento');
      throw new Error('Erro desconhecido durante a importação em massa');
    }
  }
};
