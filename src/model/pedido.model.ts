import connection from '../connection';
import { Pedido } from '../types';

const table = 'pedido';

// Buscar pedido por ID
export const buscarPorId = async (id_pedido: string): Promise<Pedido | undefined> => {
  const pedido = await connection(table)
    .where({ id_pedido })
    .first();
  
  return pedido;
};

// Buscar pedidos por escola
export const buscarPorEscola = async (id_escola: string): Promise<Pedido[]> => {
  const pedidos = await connection(table)
    .where({ id_escola })
    .select('*')
    .orderBy('data_pedido', 'desc');
  
  return pedidos;
};

// Buscar pedidos por item
export const buscarPorItem = async (id_item: string): Promise<Pedido[]> => {
  const pedidos = await connection(table)
    .where({ id_item })
    .select('*')
    .orderBy('data_pedido', 'desc');
  
  return pedidos;
};

// Criar novo pedido
export const criar = async (pedido: Omit<Pedido, 'id_pedido'>): Promise<string> => {
  const [id] = await connection(table)
    .insert(pedido)
    .returning('id_pedido');
  
  return id;
};

// Atualizar pedido
export const atualizar = async (id_pedido: string, dados: Partial<Pedido>): Promise<void> => {
  await connection(table)
    .where({ id_pedido })
    .update(dados);
};

// Excluir pedido
export const excluir = async (id_pedido: string): Promise<void> => {
  await connection(table)
    .where({ id_pedido })
    .delete();
};

// Listar todos os pedidos
export const listarTodos = async (): Promise<Pedido[]> => {
  const pedidos = await connection(table)
    .select('*')
    .orderBy('data_pedido', 'desc');
  
  return pedidos;
};

// Buscar pedidos com detalhes (join com escolas e itens)
export const buscarPedidosDetalhados = async () => {
  const pedidosDetalhados = await connection(table)
    .join('escola', 'pedido.id_escola', '=', 'escola.id_escola')
    .join('item', 'pedido.id_item', '=', 'item.id_item')
    .join('fornecedor', 'item.id_fornecedor', '=', 'fornecedor.id_fornecedor')
    .select(
      'pedido.*',
      'escola.nome_escola',
      'item.nome_item',
      'item.unidade_medida',
      'item.preco_item',
      'fornecedor.nome_fornecedor'
    )
    .orderBy('pedido.data_pedido', 'desc');
  
  return pedidosDetalhados;
};

// Buscar pedidos por período de data
export const buscarPorPeriodo = async (dataInicial: Date, dataFinal: Date): Promise<Pedido[]> => {
  const pedidos = await connection(table)
    .whereBetween('data_pedido', [dataInicial, dataFinal])
    .select('*')
    .orderBy('data_pedido', 'desc');
  
  return pedidos;
};

// Contar pedidos pendentes por escola
export const contarPedidosPorEscola = async (id_escola: string): Promise<number> => {
  const resultado = await connection(table)
    .where({ id_escola })
    .count('* as total')
    .first();
  
  return Number(resultado?.total || 0);
};
