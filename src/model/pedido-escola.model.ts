import connection from '../connection';
import { PedidoEscola, CriarPedidoEscola } from '../types';

export const criarPedidoEscola = async (dados: CriarPedidoEscola): Promise<string> => {
  const [result] = await connection('pedido_escola')
    .insert({
      created_by: dados.created_by,
      id_periodo: dados.id_periodo,
      id_usuario: dados.id_usuario,
      id_escola: dados.id_escola
    })
    .returning('id_pedido_escola');
  return result.id_pedido_escola || result;
};

export const listarPedidosEscola = async (): Promise<PedidoEscola[]> => {
  return await connection('pedido_escola').select('*');
};
