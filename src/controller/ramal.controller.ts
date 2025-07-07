import { Request, Response } from 'express';
import * as RamalModel from '../model/ramal.model';
import { StatusResposta } from '../types';
import { logInfo, logError } from '../utils/logger';

export const listarRamais = async (req: Request, res: Response) => {
  try {
    logInfo('Controller: Listando ramais', 'ramal.controller');
    const ramais = await RamalModel.listarTodos();
    res.json({ status: StatusResposta.SUCESSO, mensagem: 'Ramais listados com sucesso', dados: ramais });
  } catch (error) {
    logError('Erro ao listar ramais', 'ramal.controller', error);
    res.status(500).json({ status: StatusResposta.ERRO, mensagem: 'Erro ao listar ramais' });
  }
};

export const buscarRamalPorId = async (req: Request, res: Response) => {
  try {
    const { id_ramal } = req.params;
    logInfo(`Controller: Buscando ramal por id: ${id_ramal}`, 'ramal.controller');
    const ramal = await RamalModel.buscarPorId(id_ramal);
    if (!ramal) {
      res.status(404).json({ status: StatusResposta.ERRO, mensagem: 'Ramal não encontrado' });
      return;
    }
    res.json({ status: StatusResposta.SUCESSO, mensagem: 'Ramal encontrado', dados: ramal });
  } catch (error) {
    logError('Erro ao buscar ramal por id', 'ramal.controller', error);
    res.status(500).json({ status: StatusResposta.ERRO, mensagem: 'Erro ao buscar ramal por id' });
  }
};

export const criarRamal = async (req: Request, res: Response) => {
  try {
    const { nome_ramal } = req.body;
    if (!nome_ramal) {
      res.status(400).json({ status: StatusResposta.ERRO, mensagem: 'Nome do ramal é obrigatório' });
      return;
    }
    logInfo(`Controller: Criando ramal: ${nome_ramal}`, 'ramal.controller');
    const ramal = await RamalModel.criar(nome_ramal);
    res.status(201).json({ status: StatusResposta.SUCESSO, mensagem: 'Ramal criado com sucesso', dados: ramal });
  } catch (error) {
    logError('Erro ao criar ramal', 'ramal.controller', error);
    res.status(500).json({ status: StatusResposta.ERRO, mensagem: 'Erro ao criar ramal' });
  }
};

export const editarRamal = async (req: Request, res: Response) => {
  try {
    const { id_ramal } = req.params;
    const { nome_ramal } = req.body;
    if (!nome_ramal) {
      res.status(400).json({ status: StatusResposta.ERRO, mensagem: 'Nome do ramal é obrigatório' });
      return;
    }
    logInfo(`Controller: Editando ramal: ${id_ramal}`, 'ramal.controller');
    const updated = await RamalModel.atualizar(id_ramal, nome_ramal);
    if (!updated) {
      res.status(404).json({ status: StatusResposta.ERRO, mensagem: 'Ramal não encontrado' });
      return;
    }
    res.json({ status: StatusResposta.SUCESSO, mensagem: 'Ramal atualizado com sucesso' });
  } catch (error) {
    logError('Erro ao editar ramal', 'ramal.controller', error);
    res.status(500).json({ status: StatusResposta.ERRO, mensagem: 'Erro ao editar ramal' });
  }
};

export const deletarRamal = async (req: Request, res: Response) => {
  try {
    const { id_ramal } = req.params;
    logInfo(`Controller: Deletando ramal: ${id_ramal}`, 'ramal.controller');
    await RamalModel.remover(id_ramal);
    res.json({ status: StatusResposta.SUCESSO, mensagem: 'Ramal deletado com sucesso' });
  } catch (error: any) {
    logError('Erro ao deletar ramal', 'ramal.controller', error);
    if (error.message && error.message.includes('escolas associadas')) {
      res.status(400).json({ status: StatusResposta.ERRO, mensagem: error.message });
      return;
    }
    res.status(500).json({ status: StatusResposta.ERRO, mensagem: 'Erro ao deletar ramal' });
  }
};
