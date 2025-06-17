import * as FornecedorModel from '../model/fornecedor.model';
import { Fornecedor } from '../types';
import { compararSenha, criptografarSenha, gerarUUID, logger } from '../utils';

export const buscarTodosFornecedores = async () => {
  try {
    logger.info('Buscando todos os fornecedores', 'fornecedor');
    const fornecedores = await FornecedorModel.listarTodos();
    logger.success(`Encontrados ${fornecedores.length} fornecedores`, 'fornecedor');
    return fornecedores;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar fornecedores: ${error.message}`, 'fornecedor');
      throw new Error(`Erro ao buscar fornecedores: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar fornecedores', 'fornecedor');
      throw new Error('Erro desconhecido ao buscar fornecedores');
    }
  }
};

export const buscarFornecedorPorId = async (id: string) => {
  try {
    logger.info(`Buscando fornecedor com ID: ${id}`, 'fornecedor');
    const fornecedor = await FornecedorModel.buscarPorId(id);
    
    if (!fornecedor) {
      logger.warning(`Fornecedor com ID ${id} não encontrado`, 'fornecedor');
      throw new Error('Fornecedor não encontrado');
    }
    
    logger.success(`Fornecedor ${fornecedor.nome_fornecedor} encontrado com sucesso`, 'fornecedor');
    return fornecedor;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao buscar fornecedor: ${error.message}`, 'fornecedor');
      throw new Error(`Erro ao buscar fornecedor: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao buscar fornecedor', 'fornecedor');
      throw new Error('Erro desconhecido ao buscar fornecedor');
    }
  }
};

export const criarFornecedor = async (dados: Omit<Fornecedor, 'id_fornecedor'>) => {
  try {
    logger.info('Iniciando criação de novo fornecedor', 'fornecedor');
    logger.debug(`Dados do fornecedor: ${dados.nome_fornecedor}, CNPJ: ${dados.cnpj_fornecedor}`, 'fornecedor');
    
    // Verificar se já existe fornecedor com o mesmo email
    logger.debug(`Verificando se já existe fornecedor com o email: ${dados.email_fornecedor}`, 'fornecedor');
    const fornecedorExistentePorEmail = await FornecedorModel.buscarPorEmail(dados.email_fornecedor);
    
    if (fornecedorExistentePorEmail) {
      logger.warning(`Já existe um fornecedor com o email ${dados.email_fornecedor}`, 'fornecedor');
      throw new Error('Já existe um fornecedor com este email');
    }
    
    // Verificar se já existe fornecedor com o mesmo CNPJ
    logger.debug(`Verificando se já existe fornecedor com o CNPJ: ${dados.cnpj_fornecedor}`, 'fornecedor');
    const fornecedorExistentePorCnpj = await FornecedorModel.buscarPorCnpj(dados.cnpj_fornecedor);
    
    if (fornecedorExistentePorCnpj) {
      logger.warning(`Já existe um fornecedor com o CNPJ ${dados.cnpj_fornecedor}`, 'fornecedor');
      throw new Error('Já existe um fornecedor com este CNPJ');
    }
    
    // Criptografar a senha
    logger.debug('Criptografando senha do fornecedor', 'fornecedor');
    const senhaCriptografada = await criptografarSenha(dados.senha_fornecedor);
    
    // Criar o fornecedor com a senha criptografada
    const dadosComSenhaCriptografada = {
      ...dados,
      senha_fornecedor: senhaCriptografada
    };
    
    logger.debug('Inserindo novo fornecedor no banco de dados', 'fornecedor');
    const id = await FornecedorModel.criar(dadosComSenhaCriptografada);
    
    logger.success(`Fornecedor ${dados.nome_fornecedor} criado com sucesso, ID: ${id}`, 'fornecedor');
    return {
      id,
      mensagem: 'Fornecedor criado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao criar fornecedor: ${error.message}`, 'fornecedor');
      throw new Error(`Erro ao criar fornecedor: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao criar fornecedor', 'fornecedor');
      throw new Error('Erro desconhecido ao criar fornecedor');
    }
  }
};

export const atualizarFornecedor = async (id: string, dados: Partial<Fornecedor>) => {
  try {
    // Verificar se o fornecedor existe
    const fornecedor = await FornecedorModel.buscarPorId(id);
    
    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }
    
    // Verificar se está tentando mudar o email para um que já existe
    if (dados.email_fornecedor && dados.email_fornecedor !== fornecedor.email_fornecedor) {
      const fornecedorExistente = await FornecedorModel.buscarPorEmail(dados.email_fornecedor);
      
      if (fornecedorExistente) {
        throw new Error('Já existe um fornecedor com este email');
      }
    }
    
    // Verificar se está tentando mudar o CNPJ para um que já existe
    if (dados.cnpj_fornecedor && dados.cnpj_fornecedor !== fornecedor.cnpj_fornecedor) {
      const fornecedorExistente = await FornecedorModel.buscarPorCnpj(dados.cnpj_fornecedor);
      
      if (fornecedorExistente) {
        throw new Error('Já existe um fornecedor com este CNPJ');
      }
    }
    
    // Se estiver atualizando a senha, criptografá-la
    if (dados.senha_fornecedor) {
      dados.senha_fornecedor = await criptografarSenha(dados.senha_fornecedor);
    }
    
    // Atualizar o fornecedor
    await FornecedorModel.atualizar(id, dados);
    
    return {
      mensagem: 'Fornecedor atualizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao atualizar fornecedor: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao atualizar fornecedor');
    }
  }
};

export const excluirFornecedor = async (id: string) => {
  try {
    // Verificar se o fornecedor existe
    const fornecedor = await FornecedorModel.buscarPorId(id);
    
    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }
    
    // Excluir o fornecedor
    await FornecedorModel.excluir(id);
    
    return {
      mensagem: 'Fornecedor excluído com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao excluir fornecedor: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao excluir fornecedor');
    }
  }
};

export const loginFornecedor = async (email: string, senha: string) => {
  try {
    // Buscar o fornecedor pelo email
    const fornecedor = await FornecedorModel.buscarPorEmail(email);
    
    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado');
    }
    
    // Verificar se a senha está correta
    const senhaCorreta = await compararSenha(senha, fornecedor.senha_fornecedor);
    
    if (!senhaCorreta) {
      throw new Error('Senha incorreta');
    }
    
    return {
      id: fornecedor.id_fornecedor,
      nome: fornecedor.nome_fornecedor,
      email: fornecedor.email_fornecedor,
      mensagem: 'Login realizado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao realizar login de fornecedor: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao realizar login de fornecedor');
    }
  }
};
