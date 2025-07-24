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
  foto_perfil_url?: string; // URL da foto de perfil no Google Drive
}

// Interface da escola
export interface Escola {
  id_escola: string; // UUID
  nome_escola: string;
  endereco_escola: string;
  email_escola: string;
  ramal_id?: string | null; // UUID do ramal associado (pode ser nulo)
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
  nome_segmento: string; // Ex: 'creche', 'escola', 'brasil alfabetizado', 'proeja'
  created_at?: Date;
  updated_at?: Date;
}

// Interface do período de lançamento
export interface PeriodoLancamento {
  id_periodo: string; // UUID
  mes: number; // Mês (1-12)
  ano: number; // Ano (ex: 2025)
  data_referencia: Date; // Data de referência do período
  data_inicio: Date; // Data de início do período
  data_fim: Date; // Data de fim do período
  ativo: boolean; // Se o período está ativo para lançamentos
  criado_por: string; // UUID do usuário que criou
  created_at?: Date;
  updated_at?: Date;
}

// Interface do relacionamento escola-segmento
export interface EscolaSegmento {
  id_escola: string; // UUID - FK para escola
  id_segmento: string; // UUID - FK para segmento
  created_at?: Date;
  updated_at?: Date;
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

// Auditoria de geração de pedido
export interface AuditoriaPedido {
  id_auditoria: string; // UUID
  created_by: string; // UUID do usuário que gerou o pedido
  created_at: Date;
  id_periodo: string; // UUID do período
  tipo_pedido?: string; // Tipo do pedido (pedido 1, pedido 2, etc.)
}

export interface CriarAuditoriaPedido {
  created_by: string;
  id_periodo: string;
  tipo_pedido?: string; // Tipo do pedido informado pelo usuário
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
  mes?: number;
  ano?: number;
  data_referencia?: Date;
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

// DTOs para período de lançamento
export interface CriarPeriodoLancamento {
  mes: number;
  ano: number;
  data_referencia: Date;
  data_inicio: Date;
  data_fim: Date;
  ativo?: boolean;
  criado_por: string;
}

export interface AtualizarPeriodoLancamento {
  mes?: number;
  ano?: number;
  data_referencia?: Date;
  data_inicio?: Date;
  data_fim?: Date;
  ativo?: boolean;
}

// Interface para período com dados relacionados
export interface PeriodoLancamentoCompleto extends PeriodoLancamento {
  nome_criador?: string;
  total_escolas?: number;
  total_itens_estoque?: number;
}

// Interface para redefinição de senha com OTP
export interface PasswordResetOTP {
  id_otp: string; // UUID
  id_usuario: string; // UUID - referência ao usuário
  email_usuario: string; // Email (para logs e verificações)
  codigo_otp: string; // Código de 6 dígitos
  tentativas: number; // Contador de tentativas
  usado: boolean; // Se já foi usado
  data_criacao: Date;
  data_expiracao: Date;
}

// Interface para dados de envio de OTP
export interface EnviarOTPRequest {
  email: string;
}

// Interface para dados de verificação de OTP
export interface VerificarOTPRequest {
  email: string;
  codigo_otp: string;
  nova_senha: string;
}

// Interface para resposta de envio de OTP
export interface EnviarOTPResponse {
  mensagem: string;
  dados_depuracao?: {
    codigo_gerado?: string; // Apenas para desenvolvimento
    tempo_expiracao?: string;
    email_valido?: boolean;
  };
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
  periodo_ativo?: {
    id_periodo: string;
    mes: number;
    ano: number;
    data_inicio: Date;
    data_fim: Date;
  }; // Dados do período ativo atual
}

// Interface para resultado da duplicação de estoques
export interface ResultadoDuplicacaoEstoque {
  mensagem: string;
  totalDuplicados: number;
  periodo_origem: string;
  periodo_destino: string;
}

// Interface para resposta da ativação de período
export interface RespostaAtivacaoPeriodo {
  mensagem: string;
  periodo: {
    id: string;
    mes: number;
    ano: number;
    ativo: boolean;
  };
  duplicacao_estoques: {
    realizada: boolean;
    total_itens?: number;
    periodo_origem?: string;
    mensagem?: string;
    motivo?: string;
  };
}

// Interface para resumo de pedidos
export interface ResumoPedido {
  id_pedido: string;
  data_pedido: Date;
  quantidade_pedido: number;
  nome_item: string;
  nome_escola: string;
}

// --- Foto de Perfil (WordPress) ---
export interface UploadFotoResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  fotoUrl?: string;
  error?: string;
}

export interface RemoveFotoResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Interface de Ramal
export interface Ramal {
  id_ramal: string;
  nome_ramal: string;
  escolas?: Escola[];
}

// Auditoria de lançamento de estoque por escola
export interface PedidoEscola {
  id_pedido_escola: string; // UUID
  created_by: string; // nome da escola
  created_at: Date;
  id_periodo: string; // UUID do período ativo
  id_usuario: string; // UUID do usuário responsável
  id_escola: string; // UUID da escola
}

export interface CriarPedidoEscola {
  created_by: string;
  id_periodo: string;
  id_usuario: string;
  id_escola: string;
}
