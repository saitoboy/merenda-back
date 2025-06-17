import { Request, Response } from 'express';
import * as EscolaService from '../services/escola.service';

export const listarEscolas = async (req: Request, res: Response): Promise<void> => {
  try {
    const escolas = await EscolaService.buscarTodasEscolas();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Escolas listadas com sucesso',
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
    if (!dadosEscola.nome_escola || !dadosEscola.endereco_escola || !dadosEscola.email_escola || !dadosEscola.segmento_escola) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nome, endereço, email e segmentos são obrigatórios'
      });
      return;
    }
    
    // Validar se segmento_escola é um array
    if (!Array.isArray(dadosEscola.segmento_escola)) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'O campo segmento_escola deve ser um array de strings'
      });
      return;
    }
    
    const resultado = await EscolaService.criarEscola(dadosEscola);
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Escola criada com sucesso',
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
    const escolas = req.body;
    
    // Validar se o body é um array
    if (!Array.isArray(escolas)) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'O corpo da requisição deve ser um array de escolas'
      });
      return;
    }
    
    // Validar cada escola no array
    for (const escola of escolas) {
      if (!escola.nome_escola || !escola.endereco_escola || !escola.email_escola || !escola.segmento_escola) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Todas as escolas devem ter nome, endereço, email e segmentos'
        });
        return;
      }
      
      // Validar se segmento_escola é um array
      if (!Array.isArray(escola.segmento_escola)) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'O campo segmento_escola deve ser um array de strings em todas as escolas'
        });
        return;
      }
    }    // Importar escolas uma a uma
    const resultados = [];
    
    for (const escola of escolas) {
      try {
        // Usamos o serviço para criar a escola
        const resultado = await EscolaService.criarEscola(escola);
        resultados.push({
          email: escola.email_escola,
          status: 'sucesso',
          id: resultado.id // Se for um objeto, extraímos apenas o ID
        });
      } catch (error) {
        resultados.push({
          email: escola.email_escola,
          status: 'erro',
          mensagem: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Processo de importação concluído',
      dados: {
        total: escolas.length,
        resultados
      }
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
    }  }
};
