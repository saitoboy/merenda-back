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

export const importarFornecedores = async (fornecedores: Omit<Fornecedor, 'id_fornecedor'>[]) => {
  try {
    logger.info(`🏭 Iniciando importação em massa de ${fornecedores.length} fornecedores`, 'fornecedor');
    
    // Validação básica dos dados
    if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
      logger.warning('Nenhum fornecedor para importar', 'fornecedor');
      throw new Error('Nenhum fornecedor para importar');
    }
    
    const resultados = [];
    const erros = [];
    
    logger.debug(`Processando ${fornecedores.length} fornecedores para importação`, 'fornecedor');
    
    // Processar cada fornecedor
    for (const [index, fornecedorData] of fornecedores.entries()) {
      try {
        // Verificar campos obrigatórios
        if (!fornecedorData.nome_fornecedor || !fornecedorData.email_fornecedor || !fornecedorData.senha_fornecedor || !fornecedorData.whatsapp_fornecedor) {
          const erro = `Fornecedor #${index + 1}: Dados obrigatórios ausentes (nome, email, senha ou whatsapp)`;
          logger.warning(erro, 'fornecedor');
          erros.push({ indice: index, erro });
          continue;
        }

        // Validar CNPJ (permitir "Não identificado" para casos especiais)
        if (!fornecedorData.cnpj_fornecedor) {
          const erro = `Fornecedor #${index + 1}: CNPJ ausente`;
          logger.warning(erro, 'fornecedor');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Verificar se já existe fornecedor com o mesmo email
        const fornecedorExistentePorEmail = await FornecedorModel.buscarPorEmail(fornecedorData.email_fornecedor);
        
        if (fornecedorExistentePorEmail) {
          const erro = `Fornecedor #${index + 1}: Já existe um fornecedor com o email ${fornecedorData.email_fornecedor}`;
          logger.warning(erro, 'fornecedor');
          erros.push({ indice: index, erro });
          continue;
        }
        
        // Se o CNPJ for um valor válido (não um texto como "Não identificado"), verificar se já existe
        if (fornecedorData.cnpj_fornecedor !== 'Não identificado' && 
            fornecedorData.cnpj_fornecedor !== 'Não identificado como empresa independente') {
          // Verificar se já existe fornecedor com o mesmo CNPJ
          const fornecedorExistentePorCnpj = await FornecedorModel.buscarPorCnpj(fornecedorData.cnpj_fornecedor);
          
          if (fornecedorExistentePorCnpj) {
            const erro = `Fornecedor #${index + 1}: Já existe um fornecedor com o CNPJ ${fornecedorData.cnpj_fornecedor}`;
            logger.warning(erro, 'fornecedor');
            erros.push({ indice: index, erro });
            continue;
          }
        }
        
        // Criptografar a senha
        logger.debug(`Criptografando senha para o fornecedor #${index + 1}`, 'fornecedor');
        const senhaCriptografada = await criptografarSenha(fornecedorData.senha_fornecedor);
        
        // Criar o fornecedor com a senha criptografada
        const dadosComSenhaCriptografada = {
          ...fornecedorData,
          senha_fornecedor: senhaCriptografada
        };
        
        const id = await FornecedorModel.criar(dadosComSenhaCriptografada);
        logger.success(`Fornecedor #${index + 1} (${fornecedorData.nome_fornecedor}) importado com sucesso, ID: ${id}`, 'fornecedor');
        
        resultados.push({
          indice: index,
          id,
          nome: fornecedorData.nome_fornecedor,
          cnpj: fornecedorData.cnpj_fornecedor,
          email: fornecedorData.email_fornecedor
        });
      } catch (e) {
        const erro = e instanceof Error ? e.message : 'Erro desconhecido';
        logger.error(`Erro ao importar fornecedor #${index + 1}: ${erro}`, 'fornecedor');
        erros.push({ indice: index, erro });
      }
    }
    
    logger.info(`Importação concluída: ${resultados.length} fornecedores importados com sucesso, ${erros.length} falhas`, 'fornecedor');
    
    return {
      total: fornecedores.length,
      sucesso: resultados.length,
      falhas: erros.length,
      resultados,
      erros
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro durante a importação em massa de fornecedores: ${error.message}`, 'fornecedor');
      throw new Error(`Erro durante a importação em massa: ${error.message}`);
    } else {
      logger.error('Erro desconhecido durante a importação em massa de fornecedores', 'fornecedor');
      throw new Error('Erro desconhecido durante a importação em massa');
    }
  }
};
