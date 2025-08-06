import { Request, Response } from 'express';
import {
  buscarEstoquePorEscola,
  buscarItensAbaixoIdeal,
  buscarItensProximosValidade,
  criarItemEstoque,
  atualizarQuantidade as atualizarQuantidadeService,
  atualizarNumeroIdeal as atualizarNumeroIdealService,
  removerItemEstoque,
  obterMetricasEstoque,
  definirIdeaisEmLote,
  atualizarDataValidade as atualizarDataValidadeService,
  consolidarEstoquePorSegmento,
  consolidarEstoquePorEscola,
  atualizarEstoque as atualizarEstoqueService
} from '../services/estoque.service';
import { buscarSegmentosPorEscola } from '../model/escola-segmento.model';
import { logInfo, logError, logWarning } from '../utils/logger';
import { TipoUsuario } from '../types';

export const listarEstoquePorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    const { id_segmento, id_periodo, id_item, quantidade_minima } = req.query;

    const filtros = {
      ...(id_segmento && { idSegmento: id_segmento as string }),
      ...(id_periodo && { idPeriodo: id_periodo as string }),
      ...(id_item && { idItem: id_item as string }),
      ...(quantidade_minima && { quantidadeMinima: parseInt(quantidade_minima as string) })
    };

    const estoque = await buscarEstoquePorEscola(id_escola, filtros);

    res.status(200).json({
      status: 'sucesso',
      mensagem: id_segmento
        ? `Estoque filtrado por segmento listado com sucesso`
        : 'Estoque listado com sucesso',
      dados: estoque
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const listarItensAbaixoIdeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;

    const itensAbaixoIdeal = await buscarItensAbaixoIdeal(id_escola);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Itens abaixo do ideal listados com sucesso',
      dados: itensAbaixoIdeal
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const atualizarQuantidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;
    const { quantidade } = req.body;

    if (!quantidade && quantidade !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Quantidade é obrigatória'
      });
      return;
    }

    const resultado = await atualizarQuantidadeService(id_estoque, quantidade);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Quantidade atualizada com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const atualizarNumeroIdeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;
    const { numero_ideal } = req.body;

    if (!numero_ideal && numero_ideal !== 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Número ideal é obrigatório'
      });
      return;
    }

    const resultado = await atualizarNumeroIdealService(id_estoque, numero_ideal);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Número ideal atualizado com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const adicionarItemAoEstoque = async (req: Request, res: Response): Promise<void> => {
  try {
    const dados = req.body;

    // Determinar se é um item único ou múltiplos itens
    const isMultiplos = Array.isArray(dados);
    
    if (isMultiplos) {
      // Processar múltiplos itens
      logInfo(`Processando ${dados.length} itens para adição ao estoque`, 'controller');

      if (dados.length === 0) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Lista de itens não pode estar vazia'
        });
        return;
      }

      // Validar cada item
      for (let i = 0; i < dados.length; i++) {
        const item = dados[i];
        
        // Validações básicas
        if (!item.id_escola || !item.id_item || !item.id_segmento || !item.id_periodo) {
          res.status(400).json({
            status: 'erro',
            mensagem: `Item ${i + 1}: id_escola, id_item, id_segmento e id_periodo são obrigatórios`
          });
          return;
        }

        if (typeof item.quantidade_item !== 'number' || item.quantidade_item < 0) {
          res.status(400).json({
            status: 'erro',
            mensagem: `Item ${i + 1}: Quantidade deve ser um número maior ou igual a zero`
          });
          return;
        }

        if (item.numero_ideal !== undefined && (typeof item.numero_ideal !== 'number' || item.numero_ideal < 0)) {
          res.status(400).json({
            status: 'erro',
            mensagem: `Item ${i + 1}: Número ideal deve ser um número maior ou igual a zero`
          });
          return;
        }
      }

      const resultado = await criarItemEstoque(dados);

      // Verificar se é o resultado de múltiplos itens (objeto com mensagem)
      if (typeof resultado === 'object' && resultado !== null && 'mensagem' in resultado) {
        res.status(201).json({
          status: 'sucesso',
          mensagem: resultado.mensagem,
          dados: resultado
        });
      } else {
        // Resultado inesperado para múltiplos itens
        res.status(500).json({
          status: 'erro',
          mensagem: 'Erro inesperado ao processar múltiplos itens'
        });
      }

    } else {
      // Processar item único (lógica original)
      const dadosEstoque = dados;

      // Validações básicas
      if (!dadosEstoque.id_escola) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'ID da escola é obrigatório'
        });
        return;
      }

      if (!dadosEstoque.id_item) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'ID do item é obrigatório'
        });
        return;
      }

      if (!dadosEstoque.id_segmento) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'ID do segmento é obrigatório'
        });
        return;
      }

      if (!dadosEstoque.id_periodo) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'ID do período é obrigatório'
        });
        return;
      }

      // Validar quantidade (permite zero)
      if (dadosEstoque.quantidade_item === undefined || dadosEstoque.quantidade_item === null) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Quantidade é obrigatória'
        });
        return;
      }

      if (typeof dadosEstoque.quantidade_item !== 'number' || dadosEstoque.quantidade_item < 0) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Quantidade deve ser um número maior ou igual a zero'
        });
        return;
      }

      // Validar número ideal (permite zero, mas não obrigatório)
      if (dadosEstoque.numero_ideal !== undefined) {
        if (typeof dadosEstoque.numero_ideal !== 'number' || dadosEstoque.numero_ideal < 0) {
          res.status(400).json({
            status: 'erro',
            mensagem: 'Número ideal deve ser um número maior ou igual a zero'
          });
          return;
        }
      }

      const resultado = await criarItemEstoque(dadosEstoque);

      // Para item único, resultado deve ser string (id_estoque)
      if (typeof resultado === 'string') {
        res.status(201).json({
          status: 'sucesso',
          mensagem: 'Item adicionado ao estoque com sucesso',
          dados: {
            id_estoque: resultado,
            quantidade_adicionada: dadosEstoque.quantidade_item,
            numero_ideal: dadosEstoque.numero_ideal || 0
          }
        });
      } else {
        // Se retornou objeto, algo deu errado na lógica
        res.status(500).json({
          status: 'erro',
          mensagem: 'Erro inesperado ao processar item único'
        });
      }
    }

  } catch (error) {
    logError('Erro ao adicionar item(s) ao estoque', 'controller', error);

    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const removerItemDoEstoque = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;

    const resultado = await removerItemEstoque(id_estoque);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Item removido do estoque com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const obterMetricas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;

    const metricas = await obterMetricasEstoque(id_escola);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Métricas obtidas com sucesso',
      dados: metricas
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

// Definir valores ideais em lote
export const definirValoresIdeaisEmLote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola, id_periodo, ideais } = req.body;

    // Validação básica
    if (!id_escola || !id_periodo || !ideais || !Array.isArray(ideais) || ideais.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'id_escola, id_periodo e array de ideais são obrigatórios'
      });
      return;
    }

    // Verificação de cada item do array
    for (const item of ideais) {
      if (!item.idItem || !item.idSegmento || (item.numeroIdeal === undefined)) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Cada item deve conter idItem, idSegmento e numeroIdeal'
        });
        return;
      }
    }

    const resultado = await definirIdeaisEmLote(id_escola, id_periodo, ideais);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Valores ideais definidos em lote com sucesso',
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

// Definir valores ideais para uma escola específica
export const definirIdeaisPorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    const { id_periodo, itens_ideais } = req.body;

    // Validação básica
    if (!id_periodo || !itens_ideais || !Array.isArray(itens_ideais) || itens_ideais.length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'id_periodo e array de itens_ideais são obrigatórios'
      });
      return;
    }

    // Verificação de cada item do array
    for (const item of itens_ideais) {
      if (!item.idItem || !item.idSegmento || (item.numeroIdeal === undefined)) {
        res.status(400).json({
          status: 'erro',
          mensagem: 'Cada item deve conter idItem, idSegmento e numeroIdeal'
        });
        return;
      }
    }

    const resultado = await definirIdeaisEmLote(id_escola, id_periodo, itens_ideais);

    res.status(200).json({
      status: 'sucesso',
      mensagem: `Valores ideais definidos com sucesso para a escola ${id_escola}`,
      dados: resultado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const listarItensProximosValidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola, dias } = req.params;
    const diasNumero = parseInt(dias) || 7; // Default 7 dias se não especificado

    const itensProximos = await buscarItensProximosValidade(id_escola, diasNumero);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Itens próximos da validade listados com sucesso',
      dados: itensProximos
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const listarSegmentosPorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;

    const segmentos = await buscarSegmentosPorEscola(id_escola);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Segmentos de estoque listados com sucesso',
      dados: segmentos
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

// =====================================
// ATUALIZAR DATA DE VALIDADE (ESCOLA)
// =====================================

export const atualizarDataValidade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;
    const { data_validade } = req.body;

    logInfo(`Iniciando atualização de validade - Estoque ID: ${id_estoque}`, 'controller', {
      data_recebida: data_validade,
      tipo: typeof data_validade
    });

    // Validar se a data foi fornecida
    if (!data_validade) {
      logWarning('Data de validade não fornecida', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Data de validade é obrigatória'
      });
      return;
    }

    // Validar formato de string para YYYY-MM-DD
    if (typeof data_validade === 'string') {
      const formatoDataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!formatoDataRegex.test(data_validade)) {
        logWarning(`Formato de data inválido: ${data_validade}`, 'controller');
        res.status(400).json({
          status: 'erro',
          mensagem: 'Formato de data inválido. Use YYYY-MM-DD (ex: 2025-07-03)'
        });
        return;
      }
    }

    let dataParaProcessar: Date | string;

    // Se for string, fazer parse seguro sem UTC
    if (typeof data_validade === 'string') {
      const partes = data_validade.split('-');
      if (partes.length === 3) {
        const ano = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; // Mês é 0-indexado
        const dia = parseInt(partes[2]);

        // Criar Date com timezone local para evitar problemas de UTC
        dataParaProcessar = new Date(ano, mes, dia);
        logInfo(`Data parseada localmente: ${dataParaProcessar.toLocaleDateString('pt-BR')}`, 'controller');
      } else {
        logError('Não foi possível parsear a data - Formato inválido', 'controller');
        res.status(400).json({
          status: 'erro',
          mensagem: 'Formato de data inválido. Use YYYY-MM-DD'
        });
        return;
      }
    } else if (data_validade instanceof Date) {
      dataParaProcessar = data_validade;
      logInfo(`Data já é objeto Date: ${dataParaProcessar.toLocaleDateString('pt-BR')}`, 'controller');
    } else {
      logError(`Tipo de data não suportado: ${typeof data_validade}`, 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Tipo de data inválido. Envie string YYYY-MM-DD ou objeto Date'
      });
      return;
    }

    // Verificar se a data é válida
    if (dataParaProcessar instanceof Date && isNaN(dataParaProcessar.getTime())) {
      logError('Data inválida após parsing', 'controller');
      res.status(400).json({
        status: 'erro',
        mensagem: 'Data inválida'
      });
      return;
    }

    // Chamar o service que já trata todos os aspectos de timezone e validação
    const resultado = await atualizarDataValidadeService(id_estoque, dataParaProcessar);

    logInfo('Validade atualizada com sucesso', 'controller', {
      id_estoque: resultado.id_estoque,
      nova_validade: resultado.nova_validade,
      validade_anterior: resultado.validade_anterior
    });

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Data de validade atualizada com sucesso',
      dados: resultado
    });
  } catch (error) {
    logError(`Erro ao atualizar validade - Estoque ID: ${req.params.id_estoque}`, 'controller', error);

    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }

    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const consolidadoEstoquePorSegmento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_escola } = req.params;
    const consolidado = await consolidarEstoquePorSegmento(id_escola);
    res.status(200).json({
      status: 'sucesso',
      mensagem: consolidado.totalGeral === 0
        ? 'Nenhum dado de estoque encontrado para o período ativo'
        : 'Consolidado de estoque por segmento do período ativo obtido com sucesso',
      dados: consolidado
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Nenhum período ativo encontrado') {
      res.status(404).json({
        status: 'erro',
        mensagem: 'Nenhum período ativo encontrado para consolidar o estoque'
      });
      return;
    }
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const consolidadoGeralPorEscola = async (req: Request, res: Response): Promise<void> => {
  try {
    const consolidado = await consolidarEstoquePorEscola();
    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Consolidado geral de estoque por escola obtido com sucesso',
      dados: consolidado
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'erro',
        mensagem: error.message
      });
      return;
    }
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno do servidor'
    });
  }
};

export const atualizarEstoque = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_estoque } = req.params;
    const dadosAtualizacao = req.body;
    const usuario = req.usuario;

    if (!dadosAtualizacao || Object.keys(dadosAtualizacao).length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nenhum dado para atualizar foi enviado.'
      });
      return;
    }

    // Permissões por tipo de usuário
    let camposPermitidos: string[] = [];
    if (usuario?.tipo === TipoUsuario.ADMIN) {
      camposPermitidos = ['quantidade_item', 'numero_ideal', 'validade', 'observacao'];
    } else if (usuario?.tipo === TipoUsuario.ESCOLA) {
      camposPermitidos = ['quantidade_item', 'validade', 'observacao'];
    } else if (usuario?.tipo === TipoUsuario.NUTRICIONISTA) {
      camposPermitidos = ['numero_ideal'];
    } else {
      res.status(403).json({
        status: 'erro',
        mensagem: 'Permissão negada para atualizar estoque.'
      });
      return;
    }

    // Filtrar apenas os campos permitidos
    const dadosFiltrados: any = {};
    for (const campo of camposPermitidos) {
      if (dadosAtualizacao[campo] !== undefined) {
        dadosFiltrados[campo] = dadosAtualizacao[campo];
      }
    }

    if (Object.keys(dadosFiltrados).length === 0) {
      res.status(400).json({
        status: 'erro',
        mensagem: 'Nenhum campo permitido para atualização foi enviado.'
      });
      return;
    }

    const resultado = await atualizarEstoqueService(id_estoque, dadosFiltrados);

    res.status(200).json({
      status: 'sucesso',
      mensagem: 'Estoque atualizado com sucesso',
      dados: resultado
    });
  } catch (error) {
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro ao atualizar estoque'
    });
  }
};
