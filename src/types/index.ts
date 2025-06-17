// Definição dos tipos baseados na estrutura do banco de dados

// Tipos de usuário
export enum TipoUsuario {
  ADMIN = 'admin',
  ESCOLA = 'escola',
  GESTOR_ESCOLAR = 'gestor_escolar',
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
  segmento_escola: string[]; // Agora é um array de strings para múltiplos segmentos
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

// Interface do item
export interface Item {
  id_item: string; // UUID
  nome_item: string;
  unidade_medida: string;
  sazonalidade: string;
  validade: Date;
  observacao?: string;
  id_fornecedor: string; // UUID
  preco_item: number;
}

// Interface do estoque
export interface Estoque {
  id_escola: string; // UUID
  id_item: string; // UUID
  quantidade_item: number;
  numero_ideal: number;
}

// Interface do pedido
export interface Pedido {
  id_pedido: string; // UUID
  quantidade_pedido: number;
  id_item: string; // UUID
  id_escola: string; // UUID
  data_pedido: Date;
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
  };
}

// Interface para resumo do dashboard da escola
export interface ResumoDashboardEscola {
  total_itens: number;
  itens_baixo_estoque: number;
  itens_proximos_validade: number;
  pedidos_pendentes: number;
}

// Interface para resumo de pedidos
export interface ResumoPedido {
  id_pedido: string;
  data_pedido: Date;
  quantidade_pedido: number;
  nome_item: string;
  nome_escola: string;
}
