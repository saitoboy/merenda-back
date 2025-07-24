import connection from '../connection';
import { AuditoriaPedido, CriarAuditoriaPedido } from '../types';

export const criarAuditoriaPedido = async (dados: CriarAuditoriaPedido): Promise<string> => {
  const [result] = await connection('auditoria_pedido')
    .insert({
      created_by: dados.created_by,
      id_periodo: dados.id_periodo,
      tipo_pedido: dados.tipo_pedido // novo campo
    })
    .returning('id_auditoria');
  return result.id_auditoria || result;
};

export const listarAuditoriasPedido = async (): Promise<AuditoriaPedido[]> => {
  return await connection('auditoria_pedido').select('*');
};
