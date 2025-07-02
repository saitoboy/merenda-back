import { Request, Response } from 'express';
import * as EscolaService from '../services/escola.service';
import { ConstraintViolationError, NotFoundError } from '../utils/logger';

export const listarEscolas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { segmento, nome, email, endereco, com_segmentos } = req.query;
    
    let escolas;
    
    // Se solicitado escolas com segmentos
    if (com_segmentos === 'true') {
      escolas = await EscolaService.buscarEscolasComSegmentos();
    }
    // Se tiver filtros, usar busca com filtros
    else if (segmento || nome || email || endereco) {
      const filtros = {
        ...(segmento && typeof segmento === 'string' && { id_segmento: segmento }),
        ...(nome && typeof nome === 'string' && { nome_escola: nome }),
        ...(email && typeof email === 'string' && { email_escola: email }),
        ...(endereco && typeof endereco === 'string' && { endereco_escola: endereco })
      };
      
      escolas = await EscolaService.buscarEscolasComFiltros(filtros);
    }
    // Caso contrário, lista todas
    else {
      escolas = await EscolaService.buscarTodasEscolas();
    }
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escolas listadas com sucesso',
      dados: escolas,
      total: escolas.length
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

export const buscarEscolaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const escola = await EscolaService.buscarEscolaPorId(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escola encontrada com sucesso',
      dados: escola
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    }
    
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const criarEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const dadosEscola = req.body;
    
    // Validações básicas
    if (!dadosEscola.nome_escola || !dadosEscola.endereco_escola || !dadosEscola.email_escola) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome, endereço e email são obrigatórios'
      });
      return;
    }
    
    // Remover campo obsoleto se presente
    const { segmento_escola, ...dadosLimpos } = dadosEscola;
    
    const resultado = await EscolaService.criarEscola(dadosLimpos);
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: resultado.mensagem,
      dados: { id: resultado.id }
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

export const atualizarEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dadosEscola = req.body;
    
    const resultado = await EscolaService.atualizarEscola(id, dadosEscola);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escola atualizada com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    }
    
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const excluirEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const resultado = await EscolaService.excluirEscola(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escola excluída com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        status: 'erro',
        codigo: 'NOT_FOUND',
        mensagem: error.message
      });
    } else if (error instanceof ConstraintViolationError) {
      res.status(409).json({
        status: 'erro',
        codigo: 'CONSTRAINT_VIOLATION',
        mensagem: error.message,
        detalhes: error.details
      });
    } else if (error instanceof Error) {
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

export const buscarEscolasPorSegmento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { segmento } = req.params;
    
    const escolas = await EscolaService.buscarEscolasPorSegmento(segmento);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escolas encontradas com sucesso',
      dados: escolas
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    }
    
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const importarEscolasMassa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { escolas } = req.body;
    
    // Validar se o body contém o array de escolas
    if (!Array.isArray(escolas) || escolas.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Array de escolas é obrigatório e não pode estar vazio'
      });
      return;
    }
    
    // Remover campos obsoletos de cada escola
    const escolasLimpas = escolas.map(escola => {
      const { segmento_escola, ...escolaLimpa } = escola;
      return escolaLimpa;
    });
    
    const resultado = await EscolaService.importarEscolas(escolasLimpas);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: `Importação concluída: ${resultado.sucesso} sucessos, ${resultado.falhas} falhas`,
      dados: resultado
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

export const listarEscolasComSegmentos = async (req: Request, res: Response): Promise<void> => {
  try {
    const escolas = await EscolaService.buscarEscolasComSegmentos();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escolas com segmentos listadas com sucesso',
      dados: escolas
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

// =====================================
// GESTÃO DE SEGMENTOS
// =====================================

export const adicionarSegmentoEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { id_segmento } = req.body;
    
    if (!id_segmento) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'ID do segmento é obrigatório'
      });
      return;
    }
    
    const resultado = await EscolaService.adicionarSegmentoEscola(id, id_segmento);
    
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

export const removerSegmentoEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, id_segmento } = req.params;
    
    const resultado = await EscolaService.removerSegmentoEscola(id, id_segmento);
    
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

export const listarSegmentosEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const segmentos = await EscolaService.listarSegmentosEscola(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Segmentos da escola listados com sucesso',
      dados: segmentos,
      total: segmentos.length
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
// MÉTRICAS E DASHBOARD
// =====================================

export const obterMetricasEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const metricas = await EscolaService.obterMetricasEscola(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Métricas da escola obtidas com sucesso',
      dados: metricas
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

export const obterDashboardEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const dashboard = await EscolaService.obterDashboardEscola(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Dashboard da escola obtido com sucesso',
      dados: dashboard
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
