# Redefinição de Senha via OTP

Sistema completo de redefinição de senha usando códigos OTP (One Time Password) de 6 dígitos.

## 🔐 Visão Geral

O sistema permite que usuários redefinam suas senhas através de um código de verificação temporário enviado por email. Em ambiente de desenvolvimento, o código é retornado na resposta da API para facilitar testes.

## 📋 Fluxo Completo

1. **Solicitar código OTP** → `/auth/enviar-otp`
2. **Verificar código e redefinir senha** → `/auth/verificar-otp`
3. **Fazer login com nova senha** → `/auth/login`

---

## 1. Enviar Código OTP

Envia um código de verificação de 6 dígitos para o email do usuário.

**URL**: `/auth/enviar-otp`  
**Método**: `POST`  
**Autenticação**: Não requerida  

### Corpo da Requisição

```json
{
  "email": "usuario@edu.muriae.mg.gov.br"
}
```

### Resposta de Sucesso (Produção)

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Código de verificação enviado para usuario@edu.muriae.mg.gov.br. Verifique sua caixa de entrada."
}
```

### Resposta de Sucesso (Desenvolvimento)

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Código OTP gerado (modo desenvolvimento - email indisponível)",
  "dados": {
    "codigo_otp": "123456",
    "tempo_expiracao": "15 minutos",
    "modo": "desenvolvimento_sem_email"
  }
}
```

### Respostas de Erro

**Código**: `400 Bad Request`

```json
{
  "status": "erro",
  "mensagem": "Email é obrigatório"
}
```

```json
{
  "status": "erro",
  "mensagem": "Email não encontrado no sistema. Apenas usuários cadastrados podem redefinir a senha."
}
```

```json
{
  "status": "erro",
  "mensagem": "Muitas tentativas. Aguarde 1 hora(s) antes de tentar novamente."
}
```

---

## 2. Verificar OTP e Redefinir Senha

Verifica o código OTP e redefine a senha do usuário.

**URL**: `/auth/verificar-otp`  
**Método**: `POST`  
**Autenticação**: Não requerida  

### Corpo da Requisição

```json
{
  "email": "usuario@edu.muriae.mg.gov.br",
  "codigo_otp": "123456",
  "nova_senha": "minhaNovaSenha123!"
}
```

### Resposta de Sucesso

**Código**: `200 OK`

```json
{
  "status": "sucesso",
  "mensagem": "Senha redefinida com sucesso! Você já pode fazer login com sua nova senha."
}
```

### Respostas de Erro

**Código**: `400 Bad Request`

```json
{
  "status": "erro",
  "mensagem": "Email, código OTP e nova senha são obrigatórios"
}
```

```json
{
  "status": "erro",
  "mensagem": "Código OTP deve ter exatamente 6 dígitos"
}
```

```json
{
  "status": "erro",
  "mensagem": "Código inválido ou expirado"
}
```

```json
{
  "status": "erro",
  "mensagem": "Código bloqueado por excesso de tentativas. Solicite um novo código."
}
```

---

## 🔒 Recursos de Segurança

### Rate Limiting
- **Máximo 3 códigos OTP** por hora por usuário
- Previne ataques de força bruta

### Validação de Email
- Aceita apenas emails institucionais: `@edu.muriae.mg.gov.br`
- Verifica se usuário existe no sistema

### Expiração e Tentativas
- **Código expira em 15 minutos**
- **Máximo 3 tentativas** por código
- Códigos são invalidados após uso

### Logs de Auditoria
- Todas as tentativas são registradas
- Logs incluem IP, timestamp e resultado

---

## 🛣️ Rotas Alternativas (Aliases)

Para compatibilidade, existem rotas alternativas:

```http
POST /auth/esqueci-senha     # Alias para /auth/enviar-otp
POST /auth/redefinir-senha   # Alias para /auth/verificar-otp
```

---

## 📊 Rotas Administrativas

### Estatísticas do Sistema OTP

**URL**: `/auth/otp/stats`  
**Método**: `GET`  
**Autenticação**: Requerida (Admin)  

```json
{
  "status": "sucesso",
  "mensagem": "Estatísticas obtidas com sucesso",
  "dados": {
    "configuracao": {
      "CODIGO_LENGTH": 6,
      "EXPIRACAO_MINUTOS": 15,
      "MAX_TENTATIVAS": 3,
      "RATE_LIMIT_HORAS": 1,
      "MAX_OTPS_POR_HORA": 3
    },
    "servico_email_ativo": false
  }
}
```

### Limpeza de OTPs Expirados

**URL**: `/auth/otp/limpar-expirados`  
**Método**: `POST`  
**Autenticação**: Requerida (Admin)  

```json
{
  "status": "sucesso",
  "mensagem": "5 OTPs expirados removidos com sucesso",
  "dados": {
    "removidos": 5
  }
}
```

---

## 🧪 Testando com REST Client

Crie um arquivo `teste-otp.http`:

```http
### 1. Enviar OTP
POST http://localhost:3003/auth/enviar-otp
Content-Type: application/json

{
  "email": "seu.email@edu.muriae.mg.gov.br"
}

### 2. Verificar OTP
POST http://localhost:3003/auth/verificar-otp  
Content-Type: application/json

{
  "email": "seu.email@edu.muriae.mg.gov.br",
  "codigo_otp": "123456",
  "nova_senha": "novaSenha123!"
}

### 3. Login com nova senha
POST http://localhost:3003/auth/login
Content-Type: application/json

{
  "email": "seu.email@edu.muriae.mg.gov.br",
  "senha": "novaSenha123!"
}
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Modo de desenvolvimento (retorna código na resposta)
NODE_ENV=development

# Configuração de email (produção)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu.email@gmail.com
SMTP_PASSWORD=sua.senha.app
```

### Modo Desenvolvimento vs Produção

| Ambiente | Comportamento |
|----------|---------------|
| **Desenvolvimento** | Código retornado na resposta da API |
| **Produção** | Código enviado por email |

---

**Sistema de redefinição de senha implementado com sucesso! 🔐**