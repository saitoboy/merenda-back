import * as PeriodoLancamentoModel from '../model/periodo-lancamento.model';
import { PeriodoLancamento } from '../types';
import { gerarUUID, logger } from '../utils';

/**
 * Buscar todos os períodos de lançamento
 */
export const buscarTodosPeriodos = async () => {
  try {
    logger.info('Buscando todos os períodos de lançamento', 'periodo');
    const periodos = await PeriodoLancamentoModel.listarTodos();
    logger.success(`Encontrados ${periodos.length} períodos de lançamento`, 'periodo');
    return periodos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar períodos: ${error.message}`, 'periodo');
      throw new Error(`Erro ao buscar períodos: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar períodos', 'periodo');
      throw new Error('Erro desconhecido ao buscar períodos');
    }
  }
};

/**
 * Buscar períodos ativos
 */
export const buscarPeriodosAtivos = async () => {
  try {
    logger.info('Buscando períodos de lançamento ativos', 'periodo');
    const periodos = await PeriodoLancamentoModel.listarAtivos();
    logger.success(`Encontrados ${periodos.length} períodos ativos`, 'periodo');
    return periodos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar períodos ativos: ${error.message}`, 'periodo');
      throw new Error(`Erro ao buscar períodos ativos: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar períodos ativos', 'periodo');
      throw new Error('Erro desconhecido ao buscar períodos ativos');
    }
  }
};

/**
 * Buscar período por ID
 */
export const buscarPeriodoPorId = async (id: string) => {
  try {
    logger.info(`Buscando período com ID: ${id}`, 'periodo');
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    
    if (!periodo) {
      logger.warning(`Período com ID ${id} não encontrado`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    logger.success(`Período ${periodo.nome_periodo} encontrado com sucesso`, 'periodo');
    return periodo;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar período: ${error.message}`, 'periodo');
      throw new Error(`Erro ao buscar período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar período', 'periodo');
      throw new Error('Erro desconhecido ao buscar período');
    }
  }
};

/**
 * Buscar período por nome
 */
export const buscarPeriodoPorNome = async (nome: string) => {
  try {
    logger.info(`Buscando período com nome: ${nome}`, 'periodo');
    const periodo = await PeriodoLancamentoModel.buscarPorNome(nome);
    
    if (!periodo) {
      logger.warning(`Período com nome ${nome} não encontrado`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    logger.success(`Período ${periodo.nome_periodo} encontrado com sucesso`, 'periodo');
    return periodo;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar período por nome: ${error.message}`, 'periodo');
      throw new Error(`Erro ao buscar período por nome: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar período por nome', 'periodo');
      throw new Error('Erro desconhecido ao buscar período por nome');
    }
  }
};

/**
 * Buscar período atual (ativo)
 */
export const buscarPeriodoAtual = async () => {
  try {
    logger.info('Buscando período atual ativo', 'periodo');
    const periodo = await PeriodoLancamentoModel.buscarAtivo();
    
    if (!periodo) {
      logger.warning('Nenhum período ativo encontrado', 'periodo');
      throw new Error('Nenhum período ativo encontrado');
    }
    
    logger.success(`Período atual: ${periodo.nome_periodo}`, 'periodo');
    return periodo;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar período atual: ${error.message}`, 'periodo');
      throw new Error(`Erro ao buscar período atual: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar período atual', 'periodo');
      throw new Error('Erro desconhecido ao buscar período atual');
    }
  }
};

/**
 * Criar novo período de lançamento
 */
export const criarPeriodo = async (dados: Omit<PeriodoLancamento, 'id_periodo'>) => {
  try {
    logger.info('Iniciando criação de novo período de lançamento', 'periodo');
    logger.debug(`Dados do período: ${dados.nome_periodo}, ${dados.data_inicio} - ${dados.data_fim}`, 'periodo');
    
    // Verificar se já existe período com o mesmo nome
    logger.debug(`Verificando se já existe período com o nome: ${dados.nome_periodo}`, 'periodo');
    const periodoExistente = await PeriodoLancamentoModel.buscarPorNome(dados.nome_periodo);
    
    if (periodoExistente) {
      logger.warning(`Já existe um período com o nome ${dados.nome_periodo}`, 'periodo');
      throw new Error('Já existe um período com este nome');
    }
    
    // Validar datas
    if (new Date(dados.data_inicio) >= new Date(dados.data_fim)) {
      logger.warning('Data de início deve ser anterior à data de fim', 'periodo');
      throw new Error('Data de início deve ser anterior à data de fim');
    }
    
    // Verificar se há sobreposição de datas com outros períodos ativos
    if (dados.ativo) {
      logger.debug('Verificando sobreposição com outros períodos ativos', 'periodo');
      const periodosAtivos = await PeriodoLancamentoModel.listarAtivos();
      
      const sobreposicao = periodosAtivos.some(periodo => {
        const inicioExistente = new Date(periodo.data_inicio);
        const fimExistente = new Date(periodo.data_fim);
        const inicioNovo = new Date(dados.data_inicio);
        const fimNovo = new Date(dados.data_fim);
        
        return (inicioNovo <= fimExistente && fimNovo >= inicioExistente);
      });
      
      if (sobreposicao) {
        logger.warning('Período sobrepõe com outro período ativo existente', 'periodo');
        throw new Error('Período sobrepõe com outro período ativo existente');
      }
    }
    
    const id = await PeriodoLancamentoModel.criar(dados);
    
    logger.success(`Período criado com sucesso: ${id}`, 'periodo');
    return {
      id,
      mensagem: 'Período de lançamento criado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar período: ${error.message}`, 'periodo');
      throw new Error(`Erro ao criar período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao criar período', 'periodo');
      throw new Error('Erro desconhecido ao criar período');
    }
  }
};

/**
 * Atualizar período de lançamento
 */
export const atualizarPeriodo = async (id: string, dados: Partial<PeriodoLancamento>) => {
  try {
    logger.info(`Iniciando atualização do período com ID: ${id}`, 'periodo');
    
    // Verificar se o período existe
    logger.debug(`Verificando se o período ${id} existe`, 'periodo');
    const periodoExistente = await PeriodoLancamentoModel.buscarPorId(id);
    
    if (!periodoExistente) {
      logger.warning(`Período com ID ${id} não encontrado para atualização`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    // Se estiver tentando atualizar o nome, verificar se já existe outro período com o mesmo nome
    if (dados.nome_periodo && dados.nome_periodo !== periodoExistente.nome_periodo) {
      logger.debug(`Verificando se já existe período com o novo nome: ${dados.nome_periodo}`, 'periodo');
      const periodoComMesmoNome = await PeriodoLancamentoModel.buscarPorNome(dados.nome_periodo);
      
      if (periodoComMesmoNome && periodoComMesmoNome.id_periodo !== id) {
        logger.warning(`Já existe um período com o nome ${dados.nome_periodo}`, 'periodo');
        throw new Error('Já existe um período com este nome');
      }
    }
    
    // Validar datas se estiverem sendo atualizadas
    const dataInicio = dados.data_inicio ? new Date(dados.data_inicio) : new Date(periodoExistente.data_inicio);
    const dataFim = dados.data_fim ? new Date(dados.data_fim) : new Date(periodoExistente.data_fim);
    
    if (dataInicio >= dataFim) {
      logger.warning('Data de início deve ser anterior à data de fim', 'periodo');
      throw new Error('Data de início deve ser anterior à data de fim');
    }
    
    // Verificar sobreposição se o período estiver sendo ativado ou as datas alteradas
    if (dados.ativo === true || dados.data_inicio || dados.data_fim) {
      const estaAtivo = dados.ativo !== undefined ? dados.ativo : periodoExistente.ativo;
      
      if (estaAtivo) {
        logger.debug('Verificando sobreposição com outros períodos ativos', 'periodo');
        const periodosAtivos = await PeriodoLancamentoModel.listarAtivos();
        
        const sobreposicao = periodosAtivos.some(periodo => {
          // Não verificar contra o próprio período
          if (periodo.id_periodo === id) return false;
          
          const inicioExistente = new Date(periodo.data_inicio);
          const fimExistente = new Date(periodo.data_fim);
          
          return (dataInicio <= fimExistente && dataFim >= inicioExistente);
        });
        
        if (sobreposicao) {
          logger.warning('Período sobrepõe com outro período ativo existente', 'periodo');
          throw new Error('Período sobrepõe com outro período ativo existente');
        }
      }
    }
    
    logger.debug(`Atualizando dados do período ${periodoExistente.nome_periodo}`, 'periodo');
    await PeriodoLancamentoModel.atualizar(id, dados);
    
    logger.success(`Período ${periodoExistente.nome_periodo} atualizado com sucesso`, 'periodo');
    return {
      mensagem: 'Período de lançamento atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao atualizar período: ${error.message}`, 'periodo');
      throw new Error(`Erro ao atualizar período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao atualizar período', 'periodo');
      throw new Error('Erro desconhecido ao atualizar período');
    }
  }
};

/**
 * Ativar período de lançamento (desativa os outros ativos)
 */
export const ativarPeriodo = async (id: string) => {
  try {
    logger.info(`Ativando período com ID: ${id}`, 'periodo');
    
    // Verificar se o período existe
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    if (!periodo) {
      logger.warning(`Período com ID ${id} não encontrado`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    // Verificar se o período não está no passado
    const agora = new Date();
    const fimPeriodo = new Date(periodo.data_fim);
    
    if (fimPeriodo < agora) {
      logger.warning(`Não é possível ativar o período ${periodo.nome_periodo} pois já expirou`, 'periodo');
      throw new Error('Não é possível ativar um período que já expirou');
    }
    
    // Desativar todos os outros períodos e ativar o selecionado
    logger.debug(`Ativando período ${periodo.nome_periodo} (desativando outros)`, 'periodo');
    await PeriodoLancamentoModel.ativar(id);
    
    logger.success(`Período ${periodo.nome_periodo} ativado com sucesso`, 'periodo');
    return {
      mensagem: `Período ${periodo.nome_periodo} ativado com sucesso`
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao ativar período: ${error.message}`, 'periodo');
      throw new Error(`Erro ao ativar período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao ativar período', 'periodo');
      throw new Error('Erro desconhecido ao ativar período');
    }
  }
};

/**
 * Desativar período de lançamento
 */
export const desativarPeriodo = async (id: string) => {
  try {
    logger.info(`Desativando período com ID: ${id}`, 'periodo');
    
    // Verificar se o período existe
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    if (!periodo) {
      logger.warning(`Período com ID ${id} não encontrado`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    if (!periodo.ativo) {
      logger.info(`Período ${periodo.nome_periodo} já está inativo`, 'periodo');
      return {
        mensagem: 'Período já está inativo'
      };
    }
    
    // Desativar o período
    logger.debug(`Desativando período ${periodo.nome_periodo}`, 'periodo');
    await PeriodoLancamentoModel.desativar(id);
    
    logger.success(`Período ${periodo.nome_periodo} desativado com sucesso`, 'periodo');
    return {
      mensagem: `Período ${periodo.nome_periodo} desativado com sucesso`
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao desativar período: ${error.message}`, 'periodo');
      throw new Error(`Erro ao desativar período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao desativar período', 'periodo');
      throw new Error('Erro desconhecido ao desativar período');
    }
  }
};

/**
 * Excluir período de lançamento
 */
export const excluirPeriodo = async (id: string) => {
  try {
    logger.info(`Iniciando exclusão do período com ID: ${id}`, 'periodo');
    
    // Verificar se o período existe
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    
    if (!periodo) {
      logger.warning(`Período com ID ${id} não encontrado para exclusão`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    // Verificar se o período está sendo usado em registros de estoque
    // (Esta verificação seria implementada quando houver integração com estoque)
    logger.debug(`Verificando dependências do período ${periodo.nome_periodo}`, 'periodo');
    
    // Por enquanto, permitir exclusão apenas se o período não estiver ativo
    if (periodo.ativo) {
      logger.warning(`Não é possível excluir o período ${periodo.nome_periodo} pois está ativo`, 'periodo');
      throw new Error('Não é possível excluir um período ativo. Desative-o primeiro.');
    }
    
    logger.debug(`Excluindo período ${periodo.nome_periodo}`, 'periodo');
    await PeriodoLancamentoModel.excluir(id);
    
    logger.success(`Período ${periodo.nome_periodo} excluído com sucesso`, 'periodo');
    return {
      mensagem: 'Período de lançamento excluído com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao excluir período: ${error.message}`, 'periodo');
      throw new Error(`Erro ao excluir período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao excluir período', 'periodo');
      throw new Error('Erro desconhecido ao excluir período');
    }
  }
};

/**
 * Obter estatísticas do período
 */
export const obterEstatisticasPeriodo = async (id: string) => {
  try {
    logger.info(`Obtendo estatísticas do período ${id}`, 'periodo');
    
    // Verificar se o período existe
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    if (!periodo) {
      logger.warning(`Período com ID ${id} não encontrado`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    const agora = new Date();
    const inicioPeriodo = new Date(periodo.data_inicio);
    const fimPeriodo = new Date(periodo.data_fim);
    
    // Calcular duração e progresso
    const duracaoTotal = fimPeriodo.getTime() - inicioPeriodo.getTime();
    const tempoDecorrido = Math.max(0, agora.getTime() - inicioPeriodo.getTime());
    const progresso = Math.min(100, (tempoDecorrido / duracaoTotal) * 100);
    
    // Status do período
    let status = 'futuro';
    if (agora >= inicioPeriodo && agora <= fimPeriodo) {
      status = periodo.ativo ? 'ativo' : 'em_andamento_inativo';
    } else if (agora > fimPeriodo) {
      status = 'expirado';
    }
    
    const estatisticas = {
      periodo: {
        id_periodo: periodo.id_periodo,
        nome_periodo: periodo.nome_periodo,
        data_inicio: periodo.data_inicio,
        data_fim: periodo.data_fim,
        ativo: periodo.ativo
      },
      status: status,
      duracao_dias: Math.ceil(duracaoTotal / (1000 * 60 * 60 * 24)),
      progresso_percentual: Math.round(progresso),
      dias_restantes: Math.max(0, Math.ceil((fimPeriodo.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24))),
      // Placeholders para estatísticas que serão implementadas futuramente
      registros_estoque: 0,
      escolas_ativas: 0,
      itens_cadastrados: 0,
      data_consulta: new Date()
    };
    
    logger.success(`Estatísticas do período ${periodo.nome_periodo} obtidas com sucesso`, 'periodo');
    return estatisticas;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao obter estatísticas do período: ${error.message}`, 'periodo');
      throw new Error(`Erro ao obter estatísticas do período: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao obter estatísticas do período', 'periodo');
      throw new Error('Erro desconhecido ao obter estatísticas do período');
    }
  }
};

/**
 * Buscar períodos por intervalo de datas
 */
export const buscarPeriodosPorIntervalo = async (dataInicio: Date, dataFim: Date) => {
  try {
    logger.info(`Buscando períodos no intervalo de ${dataInicio} a ${dataFim}`, 'periodo');
    
    // Validar datas
    if (dataInicio >= dataFim) {
      logger.warning('Data de início deve ser anterior à data de fim', 'periodo');
      throw new Error('Data de início deve ser anterior à data de fim');
    }
    
    // Implementação básica usando listarTodos e filtrando
    const todosPeriodos = await PeriodoLancamentoModel.listarTodos();
    
    const periodos = todosPeriodos.filter(periodo => {
      const inicioPeriodo = new Date(periodo.data_inicio);
      const fimPeriodo = new Date(periodo.data_fim);
      
      // Verificar se há sobreposição entre o intervalo solicitado e o período
      return (inicioPeriodo <= dataFim && fimPeriodo >= dataInicio);
    });
    
    logger.success(`Encontrados ${periodos.length} períodos no intervalo especificado`, 'periodo');
    return periodos;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar períodos por intervalo: ${error.message}`, 'periodo');
      throw new Error(`Erro ao buscar períodos por intervalo: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar períodos por intervalo', 'periodo');
      throw new Error('Erro desconhecido ao buscar períodos por intervalo');
    }
  }
};
