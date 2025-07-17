import * as PedidoEscolaModel from '../model/pedido-escola.model';
import { CriarPedidoEscola } from '../types';
import { logInfo } from '../utils/logger';

export const registrarPedidoEscola = async (dados: CriarPedidoEscola) => {
  logInfo('Registrando pedido-escola', 'pedido-escola', dados);
  const idPedidoEscola = await PedidoEscolaModel.criarPedidoEscola(dados);
  return {
    mensagem: 'Registro de pedido-escola criado com sucesso',
    id_pedido_escola: idPedidoEscola
  };
};

export const listarPedidosEscola = async () => {
  return await PedidoEscolaModel.listarPedidosEscola();
};
