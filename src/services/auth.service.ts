import { compararSenha, criptografarSenha, gerarToken, logger } from '../utils';
import * as UsuarioModel from '../model/usuario.model';
import { TipoUsuario } from '../types';

export const login = async (email: string, senha: string) => {
  try {
    logger.debug(`Buscando usuário pelo email: ${email}`, 'auth');
    
    // Buscar o usuário pelo email
    const usuario = await UsuarioModel.buscarPorEmail(email);
    
    if (!usuario) {
      logger.warning(`Tentativa de login com email não cadastrado: ${email}`, 'auth');
      throw new Error('Usuário não encontrado');
    }
    
    logger.debug(`Usuário encontrado, verificando senha`, 'auth');
    
    // Verificar se a senha está correta
    const senhaCorreta = await compararSenha(senha, usuario.senha_usuario);
    
    if (!senhaCorreta) {
      logger.warning(`Senha incorreta para o usuário: ${email}`, 'auth');
      throw new Error('Senha incorreta');
    }
    
    logger.debug(`Senha correta, gerando token JWT`, 'auth');
    
    // Preparar payload do token com todos os dados necessários
    const tokenPayload = {
      id_usuario: usuario.id_usuario,
      nome_usuario: usuario.nome_usuario,
      sobrenome_usuario: usuario.sobrenome_usuario, // Sobrenome é opcional
      email_usuario: usuario.email_usuario,
      tipo: usuario.tipo_usuario,
      ...(usuario.id_escola && { id_escola: usuario.id_escola })
    };
    
    // Gerar token JWT
    const token = gerarToken(tokenPayload);
    
    logger.success(`Login bem-sucedido: ${email} (${usuario.tipo_usuario})`, 'auth');
    
    // Preparar dados do usuário para resposta
    const dadosUsuario = {
      id: usuario.id_usuario,
      nome: usuario.nome_usuario,
      sobrenome: usuario.sobrenome_usuario,
      email: usuario.email_usuario,
      tipo: usuario.tipo_usuario,
      ...(usuario.id_escola && { id_escola: usuario.id_escola }),
    };
    
    // Retornar token e dados básicos do usuário
    return {
      token,
      usuario: dadosUsuario
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao realizar login: ${error.message}`, 'auth');
      throw new Error(`Erro ao realizar login: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao realizar login', 'auth');
      throw new Error('Erro desconhecido ao realizar login');
    }
  }
};

export const registrar = async (dados: any) => {
  try {
    logger.info(`Iniciando processo de registro para: ${dados.email_usuario}`, 'auth');
    
    // Verificar se o email já existe
    logger.debug(`Verificando se o email já está cadastrado: ${dados.email_usuario}`, 'auth');
    const usuarioExistente = await UsuarioModel.buscarPorEmail(dados.email_usuario);
    
    if (usuarioExistente) {
      logger.warning(`Tentativa de registro com email já existente: ${dados.email_usuario}`, 'auth');
      throw new Error('Email já cadastrado');
    }
      logger.debug(`Email disponível, validando outros dados`, 'auth');
      // Validar tipo de usuário
    const tiposValidos: TipoUsuario[] = [
      TipoUsuario.ESCOLA, 
      TipoUsuario.NUTRICIONISTA, 
      TipoUsuario.FORNECEDOR, 
      TipoUsuario.ADMIN
    ];
    if (!tiposValidos.includes(dados.tipo_usuario)) {
      logger.warning(`Tipo de usuário inválido: ${dados.tipo_usuario}`, 'auth');
      throw new Error('Tipo de usuário inválido');
    }
      // Se for usuário tipo escola, validar id_escola
    if (dados.tipo_usuario === TipoUsuario.ESCOLA && !dados.id_escola) {
      logger.warning(`Usuário do tipo '${dados.tipo_usuario}' sem id_escola especificado`, 'auth');
      throw new Error('ID da escola é obrigatório para usuários do tipo escola');
    }
    
    // Para outros tipos, id_escola deve ser null
    if (dados.tipo_usuario !== TipoUsuario.ESCOLA) {
      logger.debug(`Usuário não é do tipo escola, definindo id_escola como null`, 'auth');
      dados.id_escola = null;
    }
    
    // Criptografar a senha antes de salvar
    logger.debug(`Criptografando senha do usuário`, 'auth');
    dados.senha_usuario = await criptografarSenha(dados.senha_usuario);
    
    logger.debug(`Dados validados, criando novo usuário`, 'auth');
    
    // Criar o usuário
    const id = await UsuarioModel.criar(dados);
    
    logger.success(`Usuário registrado com sucesso: ${dados.email_usuario} (${dados.tipo_usuario})`, 'auth');
    
    // Preparar dados de resposta
    const dadosResposta = {
      id,
      nome: dados.nome_usuario,
      email: dados.email_usuario,
      tipo: dados.tipo_usuario,
      ...(dados.id_escola && { id_escola: dados.id_escola })
    };
    
    return dadosResposta;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro ao registrar usuário: ${error.message}`, 'auth');
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    } else {
      logger.error('Erro desconhecido ao registrar usuário', 'auth');
      throw new Error('Erro desconhecido ao registrar usuário');
    }
  }
};