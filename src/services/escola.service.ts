import * as EscolaModel from '../model/escola.model';
import { Escola } from '../types';
import { gerarUUID, logger } from '../utils';

export const buscarTodasEscolas = async () => {
  try {
    logger.info('Buscando todas as escolas', 'escola');
    const escolas = await EscolaModel.listarTodas();
    logger.success(`Encontradas ${escolas.length} escolas`, 'escola');
    return escolas;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar escolas: ${error.message}`, 'escola');
      throw new Error(`Erro ao buscar escolas: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar escolas', 'escola');
      throw new Error('Erro desconhecido ao buscar escolas');
    }
  }
};

export const buscarEscolaPorId = async (id: string) => {
  try {
    logger.info(`Buscando escola com ID: ${id}`, 'escola');
    const escola = await EscolaModel.buscarPorId(id);
    
    if (!escola) {
      logger.warning(`Escola com ID ${id} não encontrada`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    logger.success(`Escola ${escola.nome_escola} encontrada com sucesso`, 'escola');
    return escola;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao buscar escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar escola', 'escola');
      throw new Error('Erro desconhecido ao buscar escola');
    }
  }
};

export const criarEscola = async (dados: Omit<Escola, 'id_escola'>) => {
  try {
    logger.info('Iniciando criação de nova escola', 'escola');
    logger.debug(`Dados da escola: ${dados.nome_escola}, ${dados.email_escola}`, 'escola');
    
    // Verificar se já existe escola com o mesmo email
    logger.debug(`Verificando se já existe escola com o email: ${dados.email_escola}`, 'escola');
    const escolaExistente = await EscolaModel.buscarPorEmail(dados.email_escola);
    
    if (escolaExistente) {
      logger.warning(`Já existe uma escola com o email ${dados.email_escola}`, 'escola');
      throw new Error('Já existe uma escola com este email');
    }
    
    const id = await EscolaModel.criar(dados);
    
    logger.success(`Escola criada com sucesso: ${id}`, 'escola');
    return {
      id,
      mensagem: 'Escola criada com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao criar escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao criar escola', 'escola');
      throw new Error('Erro desconhecido ao criar escola');
    }
  }
};

export const atualizarEscola = async (id: string, dados: Partial<Escola>) => {
  try {
    logger.info(`Iniciando atualização da escola com ID: ${id}`, 'escola');
    
    // Verificar se a escola existe
    logger.debug(`Verificando se a escola ${id} existe`, 'escola');
    const escolaExistente = await EscolaModel.buscarPorId(id);
    
    if (!escolaExistente) {
      logger.warning(`Escola com ID ${id} não encontrada para atualização`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    // Se estiver tentando atualizar o email, verificar se já existe outra escola com o mesmo email
    if (dados.email_escola && dados.email_escola !== escolaExistente.email_escola) {
      logger.debug(`Verificando se já existe escola com o novo email: ${dados.email_escola}`, 'escola');
      const escolaComMesmoEmail = await EscolaModel.buscarPorEmail(dados.email_escola);
      
      if (escolaComMesmoEmail && escolaComMesmoEmail.id_escola !== id) {
        logger.warning(`Já existe uma escola com o email ${dados.email_escola}`, 'escola');
        throw new Error('Já existe uma escola com este email');
      }
    }
    
    logger.debug(`Atualizando dados da escola ${escolaExistente.nome_escola}`, 'escola');
    await EscolaModel.atualizar(id, dados);
    
    logger.success(`Escola ${escolaExistente.nome_escola} atualizada com sucesso`, 'escola');
    return {
      mensagem: 'Escola atualizada com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao atualizar escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao atualizar escola', 'escola');
      throw new Error('Erro desconhecido ao atualizar escola');
    }
  }
};

export const excluirEscola = async (id: string) => {
  try {
    logger.info(`Iniciando exclusão da escola com ID: ${id}`, 'escola');
    
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(id);
    
    if (!escola) {
      logger.warning(`Escola com ID ${id} não encontrada para exclusão`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    logger.debug(`Excluindo escola ${escola.nome_escola}`, 'escola');
    await EscolaModel.excluir(id);
    
    logger.success(`Escola ${escola.nome_escola} excluída com sucesso`, 'escola');
    return {
      mensagem: 'Escola excluída com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao excluir escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao excluir escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao excluir escola', 'escola');
      throw new Error('Erro desconhecido ao excluir escola');
    }
  }
};

export const buscarEscolasPorSegmento = async (segmento: string) => {
  try {
    logger.info(`Buscando escolas do segmento: ${segmento}`, 'escola');
    const escolas = await EscolaModel.buscarPorSegmento(segmento);
    logger.success(`Encontradas ${escolas.length} escolas para o segmento ${segmento}`, 'escola');
    return escolas;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar escolas por segmento: ${error.message}`, 'escola');
      throw new Error(`Erro ao buscar escolas por segmento: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar escolas por segmento', 'escola');
      throw new Error('Erro desconhecido ao buscar escolas por segmento');
    }
  }
};

export const importarEscolas = async (escolas: Omit<Escola, 'id_escola'>[]) => {
  try {
    logger.info(`Iniciando importação em massa de ${escolas.length} escolas`, 'escola');
    
    // Validação básica dos dados
    if (!Array.isArray(escolas) || escolas.length === 0) {
      logger.warning('Nenhuma escola para importar', 'escola');
      throw new Error('Nenhuma escola para importar');
    }
    
    const resultados = [];
    const erros = [];
    
    logger.debug(`Processando ${escolas.length} escolas para importação`, 'escola');
    
    // Processar cada escola
    for (const [index, escolaData] of escolas.entries()) {
      try {
        // Verificar dados obrigatórios
        if (!escolaData.nome_escola || !escolaData.email_escola) {
          const erro = `Escola #${index + 1}: Dados obrigatórios ausentes`;
          logger.warning(erro, 'escola');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Verificar se já existe escola com o mesmo email
        const escolaExistente = await EscolaModel.buscarPorEmail(escolaData.email_escola);
        
        if (escolaExistente) {
          const erro = `Escola #${index + 1}: Já existe uma escola com o email ${escolaData.email_escola}`;
          logger.warning(erro, 'escola');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Criar a escola
        const id = await EscolaModel.criar(escolaData);
        logger.success(`Escola #${index + 1} (${escolaData.nome_escola}) importada com sucesso, ID: ${id}`, 'escola');
        
        resultados.push({
          indice: index,
          id,
          nome: escolaData.nome_escola,
          email: escolaData.email_escola
        });
      } catch (e) {
        const erro = e instanceof Error ? e.message : 'Erro desconhecido';
        logger.error(`Erro ao importar escola #${index + 1}: ${erro}`, 'escola');
        erros.push({ indice: index, erro });
      }
    }
    
    logger.info(`Importação concluída: ${resultados.length} escolas importadas com sucesso, ${erros.length} falhas`, 'escola');
    
    return {
      total: escolas.length,
      sucesso: resultados.length,
      falhas: erros.length,
      resultados,
      erros
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro durante a importação em massa: ${error.message}`, 'escola');
      throw new Error(`Erro durante a importação em massa: ${error.message}`);
    } else {
      logger.error('Erro desconhecido durante a importação em massa', 'escola');
      throw new Error('Erro desconhecido durante a importação em massa');
    }
  }
};
