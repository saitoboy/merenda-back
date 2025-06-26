import { Router } from 'express';
import { 
  listarFornecedores,
  buscarFornecedorPorId,
  loginFornecedor,
  criarFornecedor,
  atualizarFornecedor,
  excluirFornecedor,
  importarFornecedores
} from '../controller/fornecedor.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const fornecedorRouter = Router();

// Rotas públicas
fornecedorRouter.get('/', listarFornecedores);
fornecedorRouter.get('/:id_fornecedor', buscarFornecedorPorId);
fornecedorRouter.post('/login', loginFornecedor);

// Rotas de teste para desenvolvimento (remover em produção)
fornecedorRouter.post('/teste', criarFornecedor);
fornecedorRouter.post('/importar-teste', importarFornecedores); // Importação em lote sem autenticação

// Rotas protegidas
fornecedorRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN,TipoUsuario.NUTRICIONISTA]), 
  criarFornecedor
);

fornecedorRouter.post('/importar', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  importarFornecedores
);

fornecedorRouter.put('/:id_fornecedor', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.FORNECEDOR,TipoUsuario.NUTRICIONISTA]), 
  atualizarFornecedor
);

fornecedorRouter.delete('/:id_fornecedor', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN,TipoUsuario.NUTRICIONISTA]), 
  excluirFornecedor
);

export default fornecedorRouter;
