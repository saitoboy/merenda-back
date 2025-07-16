import * as AuditoriaPedidoModel from '../model/auditoria-pedido.model';
import { CriarAuditoriaPedido } from '../types';
import { logInfo } from '../utils/logger';

export const registrarAuditoriaPedido = async (dados: CriarAuditoriaPedido) => {
  logInfo('Registrando auditoria de pedido', 'auditoria-pedido', dados);
  const idAuditoria = await AuditoriaPedidoModel.criarAuditoriaPedido(dados);
  return {
    mensagem: 'Auditoria registrada com sucesso',
    id_auditoria: idAuditoria
  };
};

export const listarAuditoriasPedido = async () => {
  return await AuditoriaPedidoModel.listarAuditoriasPedido();
};
