import * as EscolaModel from '../model/escola.model';
import * as EscolaSegmentoModel from '../model/escola-segmento.model';
import { Escola, EscolaSegmento, FiltrosEscola, EscolaComSegmentos } from '../types';
import { gerarUUID, logger } from '../utils';
import { NotFoundError, ConstraintViolationError } from '../utils/logger';
import connection from '../connection';

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

// =====================================
// EXCLUIR ESCOLA (COM VALIDAÇÃO DE INTEGRIDADE)
// =====================================

export const excluirEscola = async (id_escola: string): Promise<void> => {
  try {
    logger.info(`Verificando se escola ${id_escola} pode ser excluída`, 'escola');
    
    // 1. Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(id_escola);
    if (!escola) {
      throw new NotFoundError('Escola não encontrada');
    }
    
    // 2. Verificar se existem registros de estoque para esta escola
    const estoqueVinculado = await connection('estoque')
      .where('id_escola', id_escola)
      .count('* as total')
      .first();
    
    const totalEstoque = Number(estoqueVinculado?.total || 0);
    
    if (totalEstoque > 0) {
      logger.warning(`Escola ${id_escola} possui ${totalEstoque} registros de estoque`, 'escola');
      throw new ConstraintViolationError(
        `Não é possível excluir escola. Existem ${totalEstoque} registros de estoque para esta escola.`,
        {
          entidade: 'escola',
          id: id_escola,
          dependencias: {
            estoque: totalEstoque
          }
        }
      );
    }
    
    // 3. Verificar se existem relacionamentos escola-segmento
    const segmentosVinculados = await connection('escola_segmento')
      .where('id_escola', id_escola)
      .count('* as total')
      .first();
    
    const totalSegmentos = Number(segmentosVinculados?.total || 0);
    
    if (totalSegmentos > 0) {
      logger.warning(`Escola ${id_escola} possui ${totalSegmentos} segmentos vinculados`, 'escola');
      throw new ConstraintViolationError(
        `Não é possível excluir escola. Existem ${totalSegmentos} segmentos vinculados a esta escola.`,
        {
          entidade: 'escola',
          id: id_escola,
          dependencias: {
            segmentos: totalSegmentos
          }
        }
      );
    }
    
    // 4. Se não há dependências, pode excluir
    await EscolaModel.excluir(id_escola);
    
    logger.success(`Escola ${escola.nome_escola} (${id_escola}) excluída com sucesso`, 'escola');
    
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConstraintViolationError) {
      // Re-throw errors customizados para serem tratados no controller
      throw error;
    }
    
    if (error instanceof Error) {
      logger.error(`Erro ao excluir escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao excluir escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao excluir escola', 'escola');
      throw new Error('Erro desconhecido ao excluir escola');
    }
  }
};

export const buscarEscolasPorSegmento = async (idSegmento: string) => {
  try {
    logger.info(`Buscando escolas do segmento: ${idSegmento}`, 'escola');
    const escolas = await EscolaModel.buscarPorSegmento(idSegmento);
    logger.success(`Encontradas ${escolas.length} escolas para o segmento ${idSegmento}`, 'escola');
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

export const buscarEscolasComSegmentos = async () => {
  try {
    logger.info('Buscando escolas com seus segmentos', 'escola');
    const escolas = await EscolaModel.listarTodasComSegmentos();
    
    logger.success(`Encontradas ${escolas.length} escolas com segmentos`, 'escola');
    return escolas;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar escolas com segmentos: ${error.message}`, 'escola');
      throw new Error(`Erro ao buscar escolas com segmentos: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar escolas com segmentos', 'escola');
      throw new Error('Erro desconhecido ao buscar escolas com segmentos');
    }
  }
};

/**
 * Gerenciar segmentos de uma escola
 */
export const adicionarSegmentoEscola = async (idEscola: string, idSegmento: string) => {
  try {
    logger.info(`Adicionando segmento ${idSegmento} à escola ${idEscola}`, 'escola');
    
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      logger.warning(`Escola com ID ${idEscola} não encontrada`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    // Verificar se o relacionamento já existe
    const relacionamentoExistente = await EscolaSegmentoModel.buscar(idEscola, idSegmento);
    if (relacionamentoExistente) {
      logger.warning(`Escola ${idEscola} já possui o segmento ${idSegmento}`, 'escola');
      throw new Error('Escola já possui este segmento');
    }
    
    // Criar o relacionamento
    await EscolaSegmentoModel.criar({ id_escola: idEscola, id_segmento: idSegmento });
    
    logger.success(`Segmento ${idSegmento} adicionado à escola ${idEscola} com sucesso`, 'escola');
    return {
      mensagem: 'Segmento adicionado à escola com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao adicionar segmento à escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao adicionar segmento à escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao adicionar segmento à escola', 'escola');
      throw new Error('Erro desconhecido ao adicionar segmento à escola');
    }
  }
};

export const removerSegmentoEscola = async (idEscola: string, idSegmento: string) => {
  try {
    logger.info(`Removendo segmento ${idSegmento} da escola ${idEscola}`, 'escola');
    
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      logger.warning(`Escola com ID ${idEscola} não encontrada`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    // Verificar se o relacionamento existe
    const relacionamento = await EscolaSegmentoModel.buscar(idEscola, idSegmento);
    if (!relacionamento) {
      logger.warning(`Escola ${idEscola} não possui o segmento ${idSegmento}`, 'escola');
      throw new Error('Escola não possui este segmento');
    }
    
    // Remover o relacionamento
    await EscolaSegmentoModel.remover(idEscola, idSegmento);
    
    logger.success(`Segmento ${idSegmento} removido da escola ${idEscola} com sucesso`, 'escola');
    return {
      mensagem: 'Segmento removido da escola com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao remover segmento da escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao remover segmento da escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao remover segmento da escola', 'escola');
      throw new Error('Erro desconhecido ao remover segmento da escola');
    }
  }
};

export const listarSegmentosEscola = async (idEscola: string) => {
  try {
    logger.info(`Listando segmentos da escola ${idEscola}`, 'escola');
    
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      logger.warning(`Escola com ID ${idEscola} não encontrada`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    const segmentos = await EscolaSegmentoModel.buscarSegmentosPorEscola(idEscola);
    
    logger.success(`Encontrados ${segmentos.length} segmentos para a escola ${idEscola}`, 'escola');
    return segmentos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao listar segmentos da escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao listar segmentos da escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao listar segmentos da escola', 'escola');
      throw new Error('Erro desconhecido ao listar segmentos da escola');
    }
  }
};

/**
 * Buscar escolas com filtros avançados
 */
export const buscarEscolasComFiltros = async (filtros: FiltrosEscola) => {
  try {
    logger.info('Buscando escolas com filtros avançados', 'escola');
    logger.debug(`Filtros aplicados: ${JSON.stringify(filtros)}`, 'escola');
    
    // Por enquanto, implementação básica - pode ser expandida no model futuramente
    let escolas = await EscolaModel.listarTodas();
    
    // Aplicar filtros
    if (filtros.nome_escola) {
      escolas = escolas.filter(escola => 
        escola.nome_escola.toLowerCase().includes(filtros.nome_escola!.toLowerCase())
      );
    }
    
    if (filtros.email_escola) {
      escolas = escolas.filter(escola => 
        escola.email_escola.toLowerCase().includes(filtros.email_escola!.toLowerCase())
      );
    }
    
    if (filtros.endereco_escola) {
      escolas = escolas.filter(escola => 
        escola.endereco_escola.toLowerCase().includes(filtros.endereco_escola!.toLowerCase())
      );
    }
    
    // Filtro por segmento requer consulta adicional
    if (filtros.id_segmento) {
      const escolasDoSegmento = await EscolaModel.buscarPorSegmento(filtros.id_segmento);
      const idsEscolasDoSegmento = escolasDoSegmento.map(e => e.id_escola);
      escolas = escolas.filter(escola => idsEscolasDoSegmento.includes(escola.id_escola));
    }
    
    logger.success(`Encontradas ${escolas.length} escolas com os filtros aplicados`, 'escola');
    return escolas;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar escolas com filtros: ${error.message}`, 'escola');
      throw new Error(`Erro ao buscar escolas com filtros: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar escolas com filtros', 'escola');
      throw new Error('Erro desconhecido ao buscar escolas com filtros');
    }
  }
};

/**
 * Obter métricas de escola
 */
export const obterMetricasEscola = async (idEscola: string) => {
  try {
    logger.info(`Obtendo métricas da escola ${idEscola}`, 'escola');
    
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      logger.warning(`Escola com ID ${idEscola} não encontrada`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    // Buscar segmentos da escola
    const segmentos = await EscolaSegmentoModel.buscarSegmentosPorEscola(idEscola);
    
    // Métricas básicas
    const metricas = {
      id_escola: idEscola,
      nome_escola: escola.nome_escola,
      total_segmentos: segmentos.length,
      segmentos: segmentos.map(s => s.nome_segmento),
      data_ultima_atualizacao: new Date()
    };
    
    logger.success(`Métricas da escola ${idEscola} obtidas com sucesso`, 'escola');
    return metricas;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao obter métricas da escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao obter métricas da escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao obter métricas da escola', 'escola');
      throw new Error('Erro desconhecido ao obter métricas da escola');
    }
  }
};

/**
 * Obter dashboard da escola
 */
export const obterDashboardEscola = async (idEscola: string) => {
  try {
    logger.info(`Obtendo dashboard da escola ${idEscola}`, 'escola');
    
    // Verificar se a escola existe
    const escola = await EscolaModel.buscarPorId(idEscola);
    if (!escola) {
      logger.warning(`Escola com ID ${idEscola} não encontrada`, 'escola');
      throw new Error('Escola não encontrada');
    }
    
    // Buscar dados para o dashboard
    const segmentos = await EscolaSegmentoModel.buscarSegmentosPorEscola(idEscola);
    
    // Dashboard básico
    const dashboard = {
      escola: {
        id_escola: escola.id_escola,
        nome_escola: escola.nome_escola,
        email_escola: escola.email_escola,
        endereco_escola: escola.endereco_escola
      },
      resumo: {
        total_segmentos: segmentos.length,
        segmentos_ativos: segmentos.length,
        data_ultima_atualizacao: new Date()
      },
      segmentos: segmentos,
      // Placeholders para dados que serão implementados futuramente
      estatisticas: {
        total_itens_estoque: 0,
        itens_baixo_estoque: 0,
        itens_proximos_validade: 0,
        pedidos_pendentes: 0
      }
    };
    
    logger.success(`Dashboard da escola ${idEscola} obtido com sucesso`, 'escola');
    return dashboard;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao obter dashboard da escola: ${error.message}`, 'escola');
      throw new Error(`Erro ao obter dashboard da escola: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao obter dashboard da escola', 'escola');
      throw new Error('Erro desconhecido ao obter dashboard da escola');
    }
  }
};
