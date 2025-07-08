import * as PeriodoLancamentoModel from '../model/periodo-lancamento.model';
import * as EstoqueService from './estoque.service';
import { PeriodoLancamento, CriarPeriodoLancamento, AtualizarPeriodoLancamento } from '../types';
import { logger } from '../utils';
import { ConstraintViolationError, NotFoundError } from '../utils/logger';
import connection from '../connection';

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
    
    logger.success(`Período ${periodo.mes}/${periodo.ano} encontrado com sucesso`, 'periodo');
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
 * Buscar período por mês e ano
 */
export const buscarPeriodoPorMesAno = async (mes: number, ano: number) => {
  try {
    logger.info(`Buscando período ${mes}/${ano}`, 'periodo');
    const periodo = await PeriodoLancamentoModel.buscarPorMesAno(mes, ano);
    
    if (!periodo) {
      logger.warning(`Período ${mes}/${ano} não encontrado`, 'periodo');
      throw new Error('Período não encontrado');
    }
    
    logger.success(`Período ${periodo.mes}/${periodo.ano} encontrado com sucesso`, 'periodo');
    return periodo;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar período por mês/ano: ${error.message}`, 'periodo');
      throw new Error(`Erro ao buscar período por mês/ano: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar período por mês/ano', 'periodo');
      throw new Error('Erro desconhecido ao buscar período por mês/ano');
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
    
    logger.success(`Período atual: ${periodo.mes}/${periodo.ano}`, 'periodo');
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
export const criarPeriodo = async (dados: CriarPeriodoLancamento) => {
  try {
    logger.info('Iniciando criação de novo período de lançamento', 'periodo');
    logger.debug(`Dados do período: ${dados.mes}/${dados.ano}, ${dados.data_inicio} - ${dados.data_fim}`, 'periodo');
    
    // Verificar se já existe período com o mesmo mês/ano
    logger.debug(`Verificando se já existe período ${dados.mes}/${dados.ano}`, 'periodo');
    const periodoExistente = await PeriodoLancamentoModel.buscarPorMesAno(dados.mes, dados.ano);
    
    if (periodoExistente) {
      logger.warning(`Já existe um período para ${dados.mes}/${dados.ano}`, 'periodo');
      throw new Error('Já existe um período para este mês/ano');
    }
    
    // Validar datas
    if (new Date(dados.data_inicio) >= new Date(dados.data_fim)) {
      logger.warning('Data de início deve ser anterior à data de fim', 'periodo');
      throw new Error('Data de início deve ser anterior à data de fim');
    }
    
    // Validar mês (1-12)
    if (dados.mes < 1 || dados.mes > 12) {
      logger.warning('Mês deve estar entre 1 e 12', 'periodo');
      throw new Error('Mês inválido');
    }
    
    // Validar ano
    const anoAtual = new Date().getFullYear();
    if (dados.ano < 2020 || dados.ano > anoAtual + 5) {
      logger.warning('Ano deve estar em um intervalo válido', 'periodo');
      throw new Error('Ano inválido');
    }

    // Se o período for ativo, desativar outros períodos
    if (dados.ativo) {
      logger.debug('Desativando outros períodos ativos', 'periodo');
      const periodosAtivos = await PeriodoLancamentoModel.listarAtivos();
      for (const periodo of periodosAtivos) {
        await PeriodoLancamentoModel.desativar(periodo.id_periodo);
      }
    }
    
    logger.debug('Criando período no banco de dados', 'periodo');
    const idPeriodo = await PeriodoLancamentoModel.criar(dados);
    
    logger.success(`Período ${dados.mes}/${dados.ano} criado com sucesso (ID: ${idPeriodo})`, 'periodo');
    return {
      id_periodo: idPeriodo,
      mensagem: 'Período criado com sucesso'
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
export const atualizarPeriodo = async (id: string, dados: AtualizarPeriodoLancamento) => {
  try {
    logger.info(`Iniciando atualização do período: ${id}`, 'periodo');
    
    // Verificar se o período existe
    const periodoExistente = await PeriodoLancamentoModel.buscarPorId(id);
    if (!periodoExistente) {
      logger.warning(`Período ${id} não encontrado`, 'periodo');
      throw new Error('Período não encontrado');
    }

    // Verificar conflito de mês/ano se alterando
    if (dados.mes && dados.ano && (dados.mes !== periodoExistente.mes || dados.ano !== periodoExistente.ano)) {
      const periodoComMesmoMesAno = await PeriodoLancamentoModel.buscarPorMesAno(dados.mes, dados.ano);
      if (periodoComMesmoMesAno && periodoComMesmoMesAno.id_periodo !== id) {
        throw new Error('Já existe um período para este mês/ano');
      }
    }

    // Validar datas se fornecidas
    const dataInicio = dados.data_inicio ? new Date(dados.data_inicio) : new Date(periodoExistente.data_inicio);
    const dataFim = dados.data_fim ? new Date(dados.data_fim) : new Date(periodoExistente.data_fim);
    
    if (dataInicio >= dataFim) {
      throw new Error('Data de início deve ser anterior à data de fim');
    }

    await PeriodoLancamentoModel.atualizar(id, dados);
    
    logger.success(`Período ${periodoExistente.mes}/${periodoExistente.ano} atualizado com sucesso`, 'periodo');
    return { mensagem: 'Período atualizado com sucesso' };
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
 * Ativar período (desativa outros automaticamente)
 */
export const ativarPeriodo = async (id: string) => {
  try {
    logger.info(`Iniciando ativação do período: ${id}`, 'periodo');
    
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    if (!periodo) {
      throw new Error('Período não encontrado');
    }

    // Verificar se o período já expirou
    if (new Date() > new Date(periodo.data_fim)) {
      throw new Error('Não é possível ativar um período que já expirou');
    }

    // Buscar período atualmente ativo (se houver) antes de ativar o novo
    const periodoAtivoAtual = await PeriodoLancamentoModel.listarAtivos();
    let periodoAtivoAnterior = periodoAtivoAtual.find(p => p.id_periodo !== id);

    // Se não há período ativo, buscar o período mais recente (que pode estar desativado)
    if (!periodoAtivoAnterior) {
      logger.info('Nenhum período ativo encontrado. Buscando período mais recente para duplicação.', 'periodo');
      const todosOsPeriodos = await PeriodoLancamentoModel.listarTodos();
      periodoAtivoAnterior = todosOsPeriodos.find(p => p.id_periodo !== id);
      
      if (periodoAtivoAnterior) {
        logger.info(`Período mais recente encontrado: ${periodoAtivoAnterior.mes}/${periodoAtivoAnterior.ano}`, 'periodo');
      }
    }

    // Ativar o novo período (isso automaticamente desativa os outros)
    await PeriodoLancamentoModel.ativar(id);
    
    let resultadoDuplicacao = null;
    
    // Verificar se precisa duplicar estoques
    if (periodoAtivoAnterior) {
      try {
        logger.info(`Iniciando duplicação de estoques do período ${periodoAtivoAnterior.id_periodo} para ${id}`, 'periodo');
        resultadoDuplicacao = await EstoqueService.duplicarEstoquesParaNovoPeriodo(id, periodoAtivoAnterior.id_periodo);
        logger.success(`Duplicação concluída: ${resultadoDuplicacao.totalDuplicados} itens`, 'periodo');
      } catch (duplicacaoError) {
        // Log do erro de duplicação, mas não falha a ativação do período
        logger.error(`Erro na duplicação de estoques: ${duplicacaoError instanceof Error ? duplicacaoError.message : 'Erro desconhecido'}`, 'periodo');
        // Continua com a ativação mesmo se a duplicação falhar
      }
    } else {
      logger.info('Nenhum período ativo anterior encontrado. Ativação sem duplicação de estoques.', 'periodo');
    }
    
    logger.success(`Período ${periodo.mes}/${periodo.ano} ativado com sucesso`, 'periodo');
    
    // Retornar resposta completa incluindo informações da duplicação
    const resposta: any = { 
      mensagem: `Período ${periodo.mes}/${periodo.ano} ativado com sucesso`,
      periodo: {
        id: periodo.id_periodo,
        mes: periodo.mes,
        ano: periodo.ano,
        ativo: true
      }
    };

    if (resultadoDuplicacao) {
      resposta.duplicacao_estoques = {
        realizada: resultadoDuplicacao.totalDuplicados > 0,
        total_itens: resultadoDuplicacao.totalDuplicados,
        periodo_origem: resultadoDuplicacao.periodo_origem,
        mensagem: resultadoDuplicacao.mensagem
      };
    } else {
      resposta.duplicacao_estoques = {
        realizada: false,
        motivo: 'Nenhum período ativo anterior ou erro na duplicação'
      };
    }

    return resposta;
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
 * Desativar período
 */
export const desativarPeriodo = async (id: string) => {
  try {
    logger.info(`Iniciando desativação do período: ${id}`, 'periodo');
    
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    if (!periodo) {
      throw new Error('Período não encontrado');
    }

    if (!periodo.ativo) {
      return { mensagem: 'Período já está inativo' };
    }

    await PeriodoLancamentoModel.desativar(id);
    
    logger.success(`Período ${periodo.mes}/${periodo.ano} desativado com sucesso`, 'periodo');
    return { mensagem: `Período ${periodo.mes}/${periodo.ano} desativado com sucesso` };
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
    logger.info(`Iniciando validação de integridade para exclusão do período com ID: ${id}`, 'periodo');
    
    // Verificar se o período existe
    const periodo = await PeriodoLancamentoModel.buscarPorId(id);
    if (!periodo) {
      logger.warning(`Período com ID ${id} não encontrado para exclusão`, 'periodo');
      throw new NotFoundError('Período não encontrado');
    }

    // Verificar dependências: período ativo
    if (periodo.ativo) {
      logger.warning(`Tentativa de excluir período ativo: ${periodo.mes}/${periodo.ano}`, 'periodo');
      throw new ConstraintViolationError('Não é possível excluir um período ativo. Desative o período antes de excluí-lo.', {
        entidade: 'periodo',
        id,
        dependencias: {
          ativo: 1
        }
      });
    }

    // Verificar dependências: registros de estoque
    logger.debug(`Verificando registros de estoque para período ${periodo.mes}/${periodo.ano}`, 'periodo');
    const estoqueCount = await connection('estoque')
      .where({ id_periodo: id })
      .count('* as count')
      .first();
    
    const totalEstoque = Number(estoqueCount?.count || 0);

    // Se há registros de estoque, impedir exclusão
    if (totalEstoque > 0) {
      const mensagem = `Não é possível excluir período. Existem ${totalEstoque} registros de estoque vinculados a este período.`;
      
      logger.warning(mensagem, 'periodo');
      throw new ConstraintViolationError(mensagem, {
        entidade: 'periodo',
        id,
        dependencias: {
          estoque: totalEstoque
        }
      });
    }

    // Se chegou até aqui, pode excluir
    logger.debug(`Excluindo período ${periodo.mes}/${periodo.ano}`, 'periodo');
    await PeriodoLancamentoModel.excluir(id);
    
    logger.success(`Período ${periodo.mes}/${periodo.ano} excluído com sucesso`, 'periodo');
    return { 
      mensagem: 'Período excluído com sucesso',
      id_periodo: id,
      excluido_em: new Date().toISOString()
    };
  } catch (error) {
    // Re-lançar erros customizados
    if (error instanceof ConstraintViolationError || error instanceof NotFoundError) {
      throw error;
    }
    
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
 * Buscar períodos por intervalo de datas
 */
export const buscarPeriodosPorIntervalo = async (dataInicio: Date, dataFim: Date) => {
  try {
    logger.info(`Buscando períodos no intervalo ${dataInicio} - ${dataFim}`, 'periodo');
    
    if (dataInicio >= dataFim) {
      throw new Error('Data de início deve ser anterior à data de fim');
    }

    const periodos = await PeriodoLancamentoModel.buscarPorData(dataInicio);
    
    // Filtrar períodos que se sobrepõem ao intervalo solicitado
    const periodosNoIntervalo = periodos.filter(periodo => {
      const inicioP = new Date(periodo.data_inicio);
      const fimP = new Date(periodo.data_fim);
      return inicioP <= dataFim && fimP >= dataInicio;
    });
    
    logger.success(`Encontrados ${periodosNoIntervalo.length} períodos no intervalo`, 'periodo');
    return periodosNoIntervalo;
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