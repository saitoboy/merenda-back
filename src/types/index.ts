// Definição dos tipos baseados na estrutura do banco de dados

// Tipos de usuário
export enum TipoUsuario {
  ADMIN = 'admin',
  ESCOLA = 'escola',
  NUTRICIONISTA = 'nutricionista',
  FORNECEDOR = 'fornecedor'
}

// Interface do usuário
export interface Usuario {
  id_usuario: string; // UUID
  nome_usuario: string;
  sobrenome_usuario: string;
  id_escola?: string; // UUID, agora pode ser nulo
  email_usuario: string;
  senha_usuario: string;
  tipo_usuario: TipoUsuario; // Tipo do usuário (admin, escola, nutricionista, etc.)
}

// Interface da escola
export interface Escola {
  id_escola: string; // UUID
  nome_escola: string;
  endereco_escola: string;
  email_escola: string;
}

// Interface do fornecedor
export interface Fornecedor {
  id_fornecedor: string; // UUID
  nome_fornecedor: string;
  cnpj_fornecedor: string;
  whatsapp_fornecedor: string;
  email_fornecedor: string;
  senha_fornecedor: string;
}

// Interface do segmento
export interface Segmento {
  id_segmento: string; // UUID
  nome_segmento: string; // Ex: 'creche', 'pre-escola', 'fundamental-1', etc.
  descricao_segmento?: string; // Descrição opcional do segmento
}

// Interface do período de lançamento
export interface PeriodoLancamento {
  id_periodo: string; // UUID
  nome_periodo: string; // Ex: '2024-Q1', 'Janeiro-2024', etc.
  data_inicio: Date; // Data de início do período
  data_fim: Date; // Data de fim do período
  ativo: boolean; // Se o período está ativo para lançamentos
}

// Interface do relacionamento escola-segmento
export interface EscolaSegmento {
  id_escola: string; // UUID - FK para escola
  id_segmento: string; // UUID - FK para segmento
}

// Interface do item
export interface Item {
  id_item: string; // UUID
  nome_item: string;
  unidade_medida: string;
  sazonalidade: string;
  id_fornecedor: string; // UUID
  preco_item: number;
}

// Interface do estoque
export interface Estoque {
  id_estoque: string; // UUID - Chave primária
  id_escola: string; // UUID - FK para escola
  id_item: string; // UUID - FK para item
  id_segmento: string; // UUID - FK para segmento
  id_periodo: string; // UUID - FK para período de lançamento
  quantidade_item: number;
  numero_ideal: number;
  validade?: Date; // Data de validade específica do lote
  observacao?: string; // Observações específicas do estoque
}

// Interface do pedido
export interface Pedido {
  id_pedido: string; // UUID
  quantidade_pedido: number;
  id_item: string; // UUID
  id_escola: string; // UUID
  data_pedido: Date;
}

// DTOs e interfaces auxiliares para o novo modelo normalizado

// Interface para criação de estoque (sem id_estoque)
export interface CriarEstoque {
  id_escola: string;
  id_item: string;
  id_segmento: string;
  id_periodo: string;
  quantidade_item: number;
  numero_ideal: number;
  validade?: Date;
  observacao?: string;
}

// Interface para atualização de estoque (campos opcionais)
export interface AtualizarEstoque {
  quantidade_item?: number;
  numero_ideal?: number;
  validade?: Date;
  observacao?: string;
}

// Interface para consulta de estoque com dados relacionados
export interface EstoqueCompleto extends Estoque {
  nome_escola?: string;
  nome_item?: string;
  unidade_medida?: string;
  nome_segmento?: string;
  nome_periodo?: string;
}

// Interface para escola com seus segmentos
export interface EscolaComSegmentos extends Escola {
  segmentos: Segmento[];
}

// Interface para filtros de estoque
export interface FiltroEstoque {
  id_escola?: string;
  id_segmento?: string;
  id_periodo?: string;
  id_item?: string;
  quantidade_minima?: number;
  validade_proxima?: Date;
}

// Interface para filtros de escola
export interface FiltrosEscola {
  nome_escola?: string;
  email_escola?: string;
  endereco_escola?: string;
  id_segmento?: string;
  nome_segmento?: string;
}

// Enum para status de resposta da API
export enum StatusResposta {
  SUCESSO = 'sucesso',
  ERRO = 'erro'
}

// Interface para respostas da API
export interface RespostaAPI<T> {
  status: StatusResposta;
  mensagem: string;
  dados?: T;
}

// Interface para credenciais de login
export interface CredenciaisLogin {
  email: string;
  senha: string;
  tipo: TipoUsuario;
}

// Interface para resposta de token
export interface RespostaToken {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: TipoUsuario;
    id_escola?: string; // ID da escola para usuários tipo escola/gestor escolar
  };
}

// Interface para resumo do dashboard da escola
export interface ResumoDashboardEscola {
  total_itens: number;
  itens_baixo_estoque: number;
  itens_proximos_validade: number;
  pedidos_pendentes: number;
  segmentos_ativos: number; // Quantidade de segmentos ativos na escola
  periodo_ativo?: string; // Nome do período ativo atual
}

// Interface para resumo de pedidos
export interface ResumoPedido {
  id_pedido: string;
  data_pedido: Date;
  quantidade_pedido: number;
  nome_item: string;
  nome_escola: string;
}
