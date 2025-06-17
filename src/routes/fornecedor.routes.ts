import { Router } from 'express';
import * as FornecedorController from '../controller/fornecedor.controller';
import { autenticar, autorizarPor } from '../middleware/auth.middleware';
import { TipoUsuario } from '../types';

const fornecedorRouter = Router();

// Rotas públicas
fornecedorRouter.get('/', FornecedorController.listarFornecedores);
fornecedorRouter.get('/:id_fornecedor', FornecedorController.buscarFornecedorPorId);
fornecedorRouter.post('/login', FornecedorController.loginFornecedor);

// Rotas protegidas
fornecedorRouter.post('/', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  FornecedorController.criarFornecedor
);

fornecedorRouter.put('/:id_fornecedor', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN, TipoUsuario.FORNECEDOR]), 
  FornecedorController.atualizarFornecedor
);

fornecedorRouter.delete('/:id_fornecedor', 
  autenticar, 
  autorizarPor([TipoUsuario.ADMIN]), 
  FornecedorController.excluirFornecedor
);

export default fornecedorRouter;
