import { Request, Response } from 'express';
import * as PedidoService from '../services/pedido.service';

export const listarPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidos = await PedidoService.buscarTodosPedidos();
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Pedidos listados com sucesso',
      dados: pedidos
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

export const buscarPedidoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_pedido } = req.params;
    
    const pedido = await PedidoService.buscarPedidoPorId(id_pedido);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Pedido encontrado com sucesso',
      dados: pedido
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

export const buscarPedidosPorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    
    const pedidos = await PedidoService.buscarPedidosPorEscola(id_escola);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Pedidos encontrados com sucesso',
      dados: pedidos
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

export const criarPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const dadosPedido = req.body;
    
    // Validações básicas
    if (!dadosPedido.id_escola || !dadosPedido.id_item || !dadosPedido.quantidade_pedido || !dadosPedido.data_pedido) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Escola, item, quantidade e data são obrigatórios'
      });
    }
    
    const resultado = await PedidoService.criarPedido(dadosPedido);
    
    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Pedido criado com sucesso',
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

export const atualizarPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_pedido } = req.params;
    const dadosPedido = req.body;
    
    const resultado = await PedidoService.atualizarPedido(id_pedido, dadosPedido);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Pedido atualizado com sucesso',
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

export const excluirPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_pedido } = req.params;
    
    const resultado = await PedidoService.excluirPedido(id_pedido);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Pedido excluído com sucesso',
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

export const buscarPedidosPorPeriodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data_inicial, data_final } = req.query;
    
    if (!data_inicial || !data_final) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Data inicial e data final são obrigatórias'
      });
    }
    
    const dataInicial = new Date(data_inicial as string);
    const dataFinal = new Date(data_final as string);
    
    const pedidos = await PedidoService.buscarPedidosPorPeriodo(dataInicial, dataFinal);
    
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Pedidos encontrados com sucesso',
      dados: pedidos
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
