import { Request, Response } from 'express';
import * as PeriodoLancamentoService from '../services/periodo-lancamento.service';

// =====================================
// CRUD BÁSICO DE PERÍODOS
// =====================================

export const listarPeriodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ativos } = req.query;
    
    let periodos;
    if (ativos === 'true') {
      periodos = await PeriodoLancamentoService.buscarPeriodosAtivos();
    } else {
      periodos = await PeriodoLancamentoService.buscarTodosPeriodos();
    }
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Períodos listados com sucesso',
      dados: periodos,
      total: periodos.length
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const buscarPeriodoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const periodo = await PeriodoLancamentoService.buscarPeriodoPorId(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Período encontrado com sucesso',
      dados: periodo
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const buscarPeriodoPorMesAno = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mes, ano } = req.query;
    
    if (!mes || !ano) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Mês e ano são obrigatórios'
      });
      return;
    }
    
    const mesNumero = parseInt(mes as string);
    const anoNumero = parseInt(ano as string);
    
    if (isNaN(mesNumero) || isNaN(anoNumero)) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Mês e ano devem ser números válidos'
      });
      return;
    }
    
    const periodo = await PeriodoLancamentoService.buscarPeriodoPorMesAno(mesNumero, anoNumero);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Período encontrado com sucesso',
      dados: periodo
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const buscarPeriodoAtual = async (req: Request, res: Response): Promise<void> => {
  try {
    const periodo = await PeriodoLancamentoService.buscarPeriodoAtual();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Período atual encontrado com sucesso',
      dados: periodo
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const criarPeriodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const dadosPeriodo = req.body;
    
    // Validações básicas
    if (!dadosPeriodo.mes || !dadosPeriodo.ano || !dadosPeriodo.data_inicio || !dadosPeriodo.data_fim) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Mês, ano, data de início e data de fim são obrigatórios'
      });
      return;
    }
    
    // Converter strings para Date se necessário
    if (typeof dadosPeriodo.data_inicio === 'string') {
      dadosPeriodo.data_inicio = new Date(dadosPeriodo.data_inicio);
    }
    if (typeof dadosPeriodo.data_fim === 'string') {
      dadosPeriodo.data_fim = new Date(dadosPeriodo.data_fim);
    }
    
    const resultado = await PeriodoLancamentoService.criarPeriodo(dadosPeriodo);
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: resultado.mensagem,
      dados: { id_periodo: resultado.id_periodo }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const atualizarPeriodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dadosPeriodo = req.body;
    
    // Converter strings para Date se necessário
    if (dadosPeriodo.data_inicio && typeof dadosPeriodo.data_inicio === 'string') {
      dadosPeriodo.data_inicio = new Date(dadosPeriodo.data_inicio);
    }
    if (dadosPeriodo.data_fim && typeof dadosPeriodo.data_fim === 'string') {
      dadosPeriodo.data_fim = new Date(dadosPeriodo.data_fim);
    }
    
    const resultado = await PeriodoLancamentoService.atualizarPeriodo(id, dadosPeriodo);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: resultado.mensagem
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const excluirPeriodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const resultado = await PeriodoLancamentoService.excluirPeriodo(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: resultado.mensagem
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

// =====================================
// GESTÃO DE STATUS
// =====================================

export const ativarPeriodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const resultado = await PeriodoLancamentoService.ativarPeriodo(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: resultado.mensagem
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

export const desativarPeriodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const resultado = await PeriodoLancamentoService.desativarPeriodo(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: resultado.mensagem
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};

// =====================================
// CONSULTAS ESPECIAIS
// =====================================

export const buscarPeriodosPorIntervalo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    if (!data_inicio || !data_fim) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Data de início e data de fim são obrigatórias'
      });
      return;
    }
    
    const dataInicio = new Date(data_inicio as string);
    const dataFim = new Date(data_fim as string);
    
    const periodos = await PeriodoLancamentoService.buscarPeriodosPorIntervalo(dataInicio, dataFim);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Períodos encontrados com sucesso',
      dados: periodos,
      total: periodos.length
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    } else {
      res.status(500).json({
        status: 'erro',
        mensagem: 'Erro interno do servidor'
      });
    }
  }
};
