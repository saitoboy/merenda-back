# 📖 Documentação d### 🔐 Autenticação e Segurança

1. **[Autenticação](./autenticaca### 🛠️ Ferramentas e Utilitários

10. **[Importação de Dados](./importacao.md)**
    - Importação em massa de dados
    - Validações e tratamento de erros
    - Formatos aceitos

11. **[Sistema de Diagnóstico](../sistema-diagnostico-completo.md)** ⭐ *NOVO*
    - Diagnóstico completo do sistema
    - Simulador de emails integrado
    - Testes de OTP sem dependências
    - Evidências visuais de funcionamento

12. **[Rotas de Teste](./rotas_teste.md)**
    - Endpoints para desenvolvimento
    - Health checks
    - Simulação de erros

13. **[Solução de Problemas](./troubleshooting.md)** Login e Registro
   - Tokens JWT
   - Verificação de Permissões

2. **[Redefinição de Senha OTP](./redefinicao-senha-otp.md)** ⭐ *NOVO*
   - Sistema completo de reset de senha
   - Códigos OTP de 6 dígitos
   - Fallback para desenvolvimento
   - Rate limiting e segurançaMerenda Smart Flow

## 🎉 Sistema Completamente Refatorado e Atualizado

> **✅ REFATORAÇÃO CONCLUÍDA**: O sistema foi completamente modernizado com modelo de dados normalizado
> 
> - **Banco normalizado**: Segmentos e períodos como entidades próprias
> - **Services refatorados**: Integração completa com o novo modelo
> - **Controllers atualizados**: APIs modernas para gestão completa
> - **Novas funcionalidades**: Gestão de segmentos, períodos, métricas e dashboard
> 
> **Sistema 100% funcional** e pronto para uso em produção!

## 🚀 Visão Geral

Esta documentação contém todas as rotas disponíveis na API do sistema Merenda Smart Flow, incluindo exemplos de requisição e resposta em JSON. O sistema utiliza um modelo de dados normalizado com relacionamentos adequados para máxima eficiência e escalabilidade.

## 📚 Índice da Documentação

### � Autenticação e Segurança

1. **[Autenticação](./autenticacao.md)**
   - Login e Registro
   - Tokens JWT
   - Verificação de Permissões

### 🏫 Gestão Educacional

2. **[Escolas](./escolas.md)**
   - CRUD completo de escolas
   - Gestão de segmentos por escola
   - Métricas e dashboard
   - Importação em massa

3. **[Segmentos](./segmentos.md)** ⭐ *NOVO*
   - Gestão de segmentos educacionais
   - Relacionamentos com escolas
   - Estatísticas por segmento
   - Importação de segmentos

4. **[Períodos de Lançamento](./periodos.md)** ⭐ *NOVO*
   - Controle de períodos letivos
   - Ativação/desativação de períodos
   - Estatísticas temporais
   - Busca por intervalos

### 📦 Gestão de Estoque

5. **[Estoque](./estoque.md)**
   - Modelo normalizado (escola + segmento + período)
   - Consultas avançadas por segmento/período
   - Gestão de valores ideais
   - Alertas de estoque baixo e validade

6. **[Fornecedores](./fornecedores.md)**
   - CRUD completo de fornecedores
   - Autenticação de fornecedores
   - Importação em massa

7. **[Itens](./itens.md)**
   - Gestão de produtos/alimentos
   - Relacionamento com fornecedores
   - Estatísticas de preços
   - Controle de validade

8. **[Pedidos](./pedidos.md)**
   - Gestão de pedidos por escola
   - Controle de status
   - Relatórios por período
   - Métricas de pedidos

9. **[Usuários](./usuarios.md)**
   - Gestão de usuários do sistema
   - Controle de permissões por tipo
   - Perfis e autorizações

### �️ Ferramentas e Utilitários

10. **[Importação de Dados](./importacao.md)**
    - Importação em massa de dados
    - Validações e tratamento de erros
    - Formatos aceitos

11. **[Rotas de Teste](./rotas_teste.md)**
    - Endpoints para desenvolvimento
    - Health checks
    - Simulação de erros

12. **[Solução de Problemas](./troubleshooting.md)**
    - Erros comuns e soluções
    - Códigos de status HTTP
    - Dicas de debugging

## 🔧 Convenções da API

### Formato de Resposta Padrão

Todas as respostas da API seguem o seguinte formato:

**Resposta de Sucesso:**

```json
{
  "status": "sucesso",
  "mensagem": "Mensagem descritiva do sucesso",
  "dados": { ... }
}
```

**Resposta de Erro:**

```json
{
  "status": "erro",
  "mensagem": "Mensagem descritiva do erro"
}
```

### Autenticação JWT

A maioria das rotas requer autenticação por token JWT. O token deve ser enviado no cabeçalho da requisição:

```bash
Authorization: Bearer seu-token-jwt
```

### Níveis de Permissão

O sistema possui diferentes níveis de acesso:

- **🔑 Admin**: Acesso total ao sistema
- **🍎 Nutricionista**: Gerencia cardápio, define valores ideais, visualiza escolas
- **🏫 Gestor Escolar**: Gerencia estoque e pedidos de sua escola
- **🚚 Fornecedor**: Visualiza pedidos relacionados aos seus produtos

- **🔑 Admin**: Acesso total ao sistema
- **🍎 Nutricionista**: Gerencia cardápio, define valores ideais, visualiza escolas
- **🏫 Gestor Escolar**: Gerencia estoque e pedidos de sua escola
- **🚚 Fornecedor**: Visualiza pedidos relacionados aos seus produtos

### Códigos de Status HTTP

- **200**: Sucesso (GET, PUT)
- **201**: Criado com sucesso (POST)
- **207**: Multi-status (importação com erros parciais)
- **400**: Erro no cliente (dados inválidos)
- **401**: Não autenticado (token ausente ou inválido)
- **403**: Não autorizado (sem permissão)
- **404**: Recurso não encontrado
- **409**: Conflito (dados duplicados)
- **500**: Erro interno do servidor

## 🔗 Links Úteis

### Configuração e Setup
- [README Principal](../README.md) - Como executar o projeto
- [Guia de Migração](./guia-migracao.md) - Migração de banco de dados

### Recursos Avançados
- [Importação de Dados](./importacao.md) - Importação em massa
- [Gestão de Valores Ideais](../gestao_valores_ideais.md) - Configuração de estoques
- [Rotas de Teste](./rotas_teste.md) - Desenvolvimento e debugging

### Suporte
- [Solução de Problemas](./troubleshooting.md) - Erros comuns e soluções
- [Database Migration](../database-migration.md) - Detalhes técnicos das migrations

## 🎯 Características Principais

✅ **Modelo Normalizado**: Relacionamentos adequados entre entidades  
✅ **Segmentação Avançada**: Gestão por segmentos educacionais  
✅ **Controle Temporal**: Períodos de lançamento configuráveis  
✅ **Importação em Massa**: Suporte para grandes volumes de dados  
✅ **Métricas e Dashboard**: Visão consolidada do sistema  
✅ **Controle de Permissões**: Acesso granular por tipo de usuário  
✅ **Auditoria Completa**: Logs detalhados de todas as operações  

---

**📧 Dúvidas ou sugestões?** Consulte a [documentação de troubleshooting](./troubleshooting.md) ou entre em contato com a equipe de desenvolvimento.
