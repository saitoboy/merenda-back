import { compararSenha, gerarToken } from '../utils';
import * as UsuarioModel from '../model/usuario.model';
import { TipoUsuario } from '../types';

export const login = async (email: string, senha: string) => {
  try {
    // Buscar o usuário pelo email
    const usuario = await UsuarioModel.buscarPorEmail(email);
    
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verificar se a senha está correta
    const senhaCorreta = await compararSenha(senha, usuario.senha_usuario);
    
    if (!senhaCorreta) {
      throw new Error('Senha incorreta');
    }
      // Gerar token JWT
    const token = gerarToken({
      id_usuario: usuario.id_usuario,
      email_usuario: usuario.email_usuario,
      tipo: usuario.tipo_usuario // Usa o tipo de usuário do banco de dados
    });
    
    // Retornar token e dados básicos do usuário
    return {
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome_usuario,
        email: usuario.email_usuario,
        tipo: usuario.tipo_usuario // Inclui o tipo de usuário na resposta
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao realizar login: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao realizar login');
    }
  }
};

export const registrar = async (dados: any) => {
  try {
    // Verificar se o email já existe
    const usuarioExistente = await UsuarioModel.buscarPorEmail(dados.email_usuario);
    
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }
      // Validar o tipo de usuário
    if (!dados.tipo_usuario || !Object.values(TipoUsuario).includes(dados.tipo_usuario)) {
      throw new Error('Tipo de usuário inválido');
    }
    
    // Validar id_escola apenas se o tipo for ESCOLA ou GESTOR_ESCOLAR
    if ((dados.tipo_usuario === TipoUsuario.ESCOLA || dados.tipo_usuario === TipoUsuario.GESTOR_ESCOLAR) && !dados.id_escola) {
      throw new Error('ID da escola é obrigatório para usuários do tipo Escola ou Gestor Escolar');
    }
    
    // Criptografar a senha
    const senhaCriptografada = await compararSenha(dados.senha_usuario, '');
    
    // Criar o usuário
    const id = await UsuarioModel.criar({
      ...dados,
      senha_usuario: senhaCriptografada
    });
    
    return {
      id,
      mensagem: 'Usuário registrado com sucesso'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    } else {
      throw new Error('Erro desconhecido ao registrar usuário');
    }
  }
};
