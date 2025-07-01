import { Request, Response } from 'express';
import * as SegmentoService from '../services/segmento.service';

// =====================================
// CRUD BÁSICO DE SEGMENTOS
// =====================================

export const listarSegmentos = async (req: Request, res: Response): Promise<void> => {
  try {
    const segmentos = await SegmentoService.buscarTodosSegmentos();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Segmentos listados com sucesso',
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

export const buscarSegmentoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const segmento = await SegmentoService.buscarSegmentoPorId(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Segmento encontrado com sucesso',
      dados: segmento
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

export const buscarSegmentoPorNome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome } = req.query;
    
    if (!nome || typeof nome !== 'string') {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome do segmento é obrigatório'
      });
      return;
    }
    
    const segmento = await SegmentoService.buscarSegmentoPorNome(nome);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Segmento encontrado com sucesso',
      dados: segmento
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

export const criarSegmento = async (req: Request, res: Response): Promise<void> => {
  try {
    const dadosSegmento = req.body;
    
    // Validações básicas
    if (!dadosSegmento.nome_segmento) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome do segmento é obrigatório'
      });
      return;
    }
    
    const resultado = await SegmentoService.criarSegmento(dadosSegmento);
    
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

export const atualizarSegmento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dadosSegmento = req.body;
    
    const resultado = await SegmentoService.atualizarSegmento(id, dadosSegmento);
    
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

export const excluirSegmento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const resultado = await SegmentoService.excluirSegmento(id);
    
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
// RELACIONAMENTOS E ESTATÍSTICAS
// =====================================

export const listarEscolasPorSegmento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const resultado = await SegmentoService.listarEscolasPorSegmento(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escolas do segmento listadas com sucesso',
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

export const obterEstatisticasSegmento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const estatisticas = await SegmentoService.obterEstatisticasSegmento(id);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Estatísticas do segmento obtidas com sucesso',
      dados: estatisticas
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
// IMPORTAÇÃO EM MASSA
// =====================================

export const importarSegmentos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { segmentos } = req.body;
    
    if (!Array.isArray(segmentos) || segmentos.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Array de segmentos é obrigatório e não pode estar vazio'
      });
      return;
    }
    
    const resultado = await SegmentoService.importarSegmentos(segmentos);
    
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
