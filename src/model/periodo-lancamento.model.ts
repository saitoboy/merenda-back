import connection from '../connection';
import { PeriodoLancamento, CriarPeriodoLancamento, AtualizarPeriodoLancamento } from '../types';

const table = 'periodo_lancamento';

// Buscar período por ID
export const buscarPorId = async (id_periodo: string): Promise<PeriodoLancamento | undefined> => {
  const periodo = await connection(table)
    .where({ id_periodo })
    .first();
  
  return periodo;
};

// Buscar período por mês e ano
export const buscarPorMesAno = async (mes: number, ano: number): Promise<PeriodoLancamento | undefined> => {
  const periodo = await connection(table)
    .where({ mes, ano })
    .first();
  
  return periodo;
};

// Buscar período ativo atual
export const buscarAtivo = async (): Promise<PeriodoLancamento | undefined> => {
   const periodo = await connection(table)
    .where({ ativo: true })
    .first();
  
  return periodo;
};

// Listar todos os períodos
export const listarTodos = async (): Promise<PeriodoLancamento[]> => {
  const periodos = await connection(table)
    .select('*')
    .orderBy('data_inicio', 'desc');
  
  return periodos;
};

// Listar períodos ativos
export const listarAtivos = async (): Promise<PeriodoLancamento[]> => {
  const periodos = await connection(table)
    .where({ ativo: true })
    .select('*')
    .orderBy('data_inicio', 'desc');
  
  return periodos;
};

// Criar novo período
export const criar = async (periodo: CriarPeriodoLancamento): Promise<string> => {
  const [result] = await connection(table)
    .insert({
      ...periodo,
      updated_at: new Date()
    })
    .returning('id_periodo');
  
  return result.id_periodo;
};

// Atualizar período
export const atualizar = async (id_periodo: string, dados: AtualizarPeriodoLancamento): Promise<void> => {
  await connection(table)
    .where({ id_periodo })
    .update({
      ...dados,
      updated_at: new Date()
    });
};

// Excluir período
export const excluir = async (id_periodo: string): Promise<void> => {
  await connection(table)
    .where({ id_periodo })
    .delete();
};

// Ativar período (desativa outros períodos)
export const ativar = async (id_periodo: string): Promise<void> => {
  return await connection.transaction(async (trx) => {
    // Desativar todos os outros períodos
    await trx(table)
      .update({ ativo: false });
    
    // Ativar o período específico
    await trx(table)
      .where({ id_periodo })
      .update({ ativo: true });
  });
};

// Desativar período
export const desativar = async (id_periodo: string): Promise<void> => {
  await connection(table)
    .where({ id_periodo })
    .update({ ativo: false });
};

// Verificar se período existe
export const existe = async (id_periodo: string): Promise<boolean> => {
  const periodo = await connection(table)
    .where({ id_periodo })
    .count('* as total')
    .first();
  
  return Number(periodo?.total || 0) > 0;
};

// Buscar períodos por data
export const buscarPorData = async (data: Date): Promise<PeriodoLancamento[]> => {
  const periodos = await connection(table)
    .where('data_inicio', '<=', data)
    .andWhere('data_fim', '>=', data)
    .select('*')
    .orderBy('data_inicio', 'desc');
  
  return periodos;
};
