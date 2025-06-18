# Solução de Problemas (Troubleshooting)

Esta seção contém informações sobre erros comuns, suas causas e possíveis soluções para ajudar desenvolvedores a resolverem problemas ao utilizar a API do Merenda Smart Flow.

## Erros Comuns de Autenticação

### 1. Token Inválido ou Expirado

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Token inválido ou expirado"
}
```

**Possíveis Causas**:
- O token JWT expirou (validade padrão: 24 horas)
- O token foi modificado ou está corrompido
- O token não foi enviado no formato correto

**Solução**:
- Realize o login novamente para obter um novo token
- Certifique-se de incluir o token no formato correto: `Authorization: Bearer seu-token-aqui`
- Verifique se o token está sendo armazenado corretamente no cliente

### 2. Credenciais Inválidas

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Email ou senha inválidos"
}
```

**Possíveis Causas**:
- Email incorreto
- Senha incorreta
- Usuário tentando acessar com tipo de usuário incorreto

**Solução**:
- Verifique se o email está correto
- Verifique se a senha está correta
- Certifique-se de que o tipo de usuário está correto (admin, nutricionista, gestor_escolar, etc.)

## Erros de Permissão

### 1. Acesso Não Autorizado

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Não autorizado para acessar este recurso"
}
```

**Possíveis Causas**:
- O usuário não tem o nível de acesso necessário para a operação
- Um gestor escolar tentando acessar dados de outra escola
- Um usuário regular tentando executar operações administrativas

**Solução**:
- Verifique o tipo de usuário necessário para a operação
- Certifique-se de que o usuário tem as permissões corretas
- Se necessário, solicite que um administrador execute a operação

## Erros de Validação de Dados

### 1. Dados Incompletos ou Inválidos

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Dados inválidos. Verifique os campos obrigatórios e formatos"
}
```

**Possíveis Causas**:
- Campos obrigatórios não foram fornecidos
- Valores em formato incorreto (datas, números, etc.)
- IDs não existentes no sistema

**Solução**:
- Verifique a documentação para confirmar quais campos são obrigatórios
- Certifique-se de que os formatos estão corretos (datas em ISO 8601, números sem caracteres especiais)
- Verifique se os IDs referenciados existem no sistema

### 2. Conflito de Dados

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Email já cadastrado no sistema"
}
```

**Possíveis Causas**:
- Tentativa de criar um recurso com um identificador único já existente
- Violação de restrições de integridade

**Solução**:
- Verifique se o recurso já existe antes de tentar criá-lo
- Use endpoints de atualização em vez de criação para recursos existentes

## Erros de Banco de Dados

### 1. Recurso Não Encontrado

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Escola/Item/Usuário não encontrado"
}
```

**Possíveis Causas**:
- ID incorreto ou inexistente
- Recurso foi excluído anteriormente

**Solução**:
- Verifique se o ID está correto
- Use endpoints de listagem para verificar os IDs disponíveis

### 2. Erro de Transação

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Erro ao processar operação no banco de dados"
}
```

**Possíveis Causas**:
- Falha na transação do banco de dados
- Problemas de conexão com o banco de dados
- Violação de constraints

**Solução**:
- Tente a operação novamente após alguns segundos
- Verifique se todas as dependências (IDs relacionados) existem
- Entre em contato com o administrador do sistema se o problema persistir

## Problemas com Upload de Arquivos

### 1. Formato de Arquivo Inválido

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Formato de arquivo não suportado"
}
```

**Possíveis Causas**:
- Tentativa de upload de um tipo de arquivo não suportado
- Extensão de arquivo incorreta

**Solução**:
- Use apenas formatos suportados (geralmente CSV, JSON)
- Verifique se o arquivo tem a extensão correta e está bem formatado

### 2. Arquivo Muito Grande

**Erro**:
```json
{
  "status": "erro",
  "mensagem": "Arquivo excede o tamanho máximo permitido"
}
```

**Possíveis Causas**:
- Arquivo maior que o limite configurado no servidor

**Solução**:
- Divida o arquivo em partes menores
- Comprima o arquivo se possível
- Entre em contato com o administrador para verificar os limites do sistema

## Dicas Gerais de Troubleshooting

1. **Verifique os Logs**: Para desenvolvedores com acesso ao servidor, verifique os logs do sistema para mensagens de erro detalhadas.

2. **Use Ferramentas de Teste de API**: Ferramentas como Postman ou Insomnia ajudam a testar e depurar as requisições.

3. **Atenção aos Headers**: Verifique se todos os headers necessários estão sendo enviados corretamente.

4. **Validação de JSON**: Use ferramentas de validação de JSON para garantir que sua requisição está formatada corretamente.

5. **Monitore o Console do Navegador**: Para aplicações web, monitore o console do navegador para erros de requisições.

6. **Tente Endpoints Simples**: Se um endpoint complexo não funciona, tente endpoints mais simples para isolar o problema.

7. **Verifique a Conectividade**: Certifique-se de que há conexão com o servidor da API.

8. **Certifique-se de Que o Servidor Está Rodando**: Verifique se o servidor da API está em execução e acessível.

## Contato para Suporte

Se você tentou todas as soluções acima e ainda está enfrentando problemas, entre em contato com a equipe de suporte:

- **Email**: suporte@merendasmart.com.br
- **Horário de Atendimento**: Segunda a Sexta, 8h às 18h
