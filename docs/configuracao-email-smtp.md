# Configuração de Email SMTP - Merenda Smart Flow

## 📧 Visão Geral

Este documento explica como configurar o envio de emails para o fluxo OTP (redefinição de senha) no Merenda Smart Flow, incluindo configuração do Gmail ou servidor SMTP institucional.

## 🔧 Variáveis de Ambiente

Configure as seguintes variáveis no seu arquivo `.env`:

```bash
# Configuração de Email SMTP
SMTP_HOST=smtp.gmail.com                              # Servidor SMTP
SMTP_PORT=587                                         # Porta (587 para TLS, 465 para SSL)
SMTP_SECURE=false                                     # true para SSL (porta 465), false para TLS (porta 587)
SMTP_USER=naoresponda@tec.edu.mg.gov.br             # Email de autenticação
SMTP_PASSWORD=sua_senha_ou_app_password_aqui         # Senha ou App Password
SMTP_FROM="Merenda Smart Flow" <naoresponda@tec.edu.mg.gov.br>  # Email remetente

# Configuração OTP
OTP_EXPIRATION_MINUTES=10                            # Tempo de expiração do código (minutos)
OTP_MAX_ATTEMPTS=3                                   # Máximo de tentativas por código
```

## 📋 Configurações por Provedor

### Gmail Institucional

Para usar Gmail institucional (Google Workspace):

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=naoresponda@tec.edu.mg.gov.br
SMTP_PASSWORD=sua_app_password_aqui
SMTP_FROM="Merenda Smart Flow" <naoresponda@tec.edu.mg.gov.br>
```

**Requisitos:**
1. Ativar autenticação de 2 fatores na conta
2. Gerar um "App Password" específico para a aplicação
3. Não usar a senha normal da conta

### Servidor SMTP Institucional

Para servidores SMTP próprios da instituição:

```bash
SMTP_HOST=mail.tec.edu.mg.gov.br
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=naoresponda@tec.edu.mg.gov.br
SMTP_PASSWORD=senha_do_servidor_smtp
SMTP_FROM="Merenda Smart Flow" <naoresponda@tec.edu.mg.gov.br>
```

**Nota:** Consulte o setor de TI para obter as configurações específicas.

### Outros Provedores

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

## 🧪 Testando a Configuração

### 1. Verificar Inicialização

Ao iniciar o servidor, verifique os logs:

```bash
npm run dev
```

Logs esperados:
```
✅ [email] Serviço de email inicializado com sucesso
✅ [email] Configuração SMTP carregada
```

### 2. Endpoint de Teste

Use o endpoint administrativo para testar o envio:

**POST** `/auth/otp/testar-email`

```json
{
  "email": "seu_email_de_teste@exemplo.com"
}
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_ADMIN
Content-Type: application/json
```

**Resposta de Sucesso:**
```json
{
  "status": "sucesso",
  "mensagem": "Email de teste enviado com sucesso",
  "dados": {
    "messageId": "<id-da-mensagem>",
    "modo": "producao"
  }
}
```

### 3. Teste do Fluxo OTP Completo

1. **Solicitar OTP:**
```bash
curl -X POST http://localhost:3000/auth/enviar-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@tec.edu.mg.gov.br"}'
```

2. **Verificar email recebido** com código de 6 dígitos

3. **Redefinir senha:**
```bash
curl -X POST http://localhost:3000/auth/verificar-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@tec.edu.mg.gov.br",
    "codigo": "123456",
    "novaSenha": "NovaSenha123!"
  }'
```

## 🔍 Diagnóstico de Problemas

### Erro: "Configuração SMTP incompleta"

**Causa:** Variáveis de ambiente não configuradas.

**Solução:** Verificar se todas as variáveis estão no `.env`:
- SMTP_HOST
- SMTP_USER  
- SMTP_PASSWORD

### Erro: "Falha ao verificar conexão com servidor"

**Possíveis causas:**
1. Credenciais incorretas
2. Servidor/porta bloqueados
3. Necessidade de App Password (Gmail)

**Soluções:**
1. Verificar credenciais
2. Testar configuração de rede/firewall
3. Gerar App Password para Gmail

### Erro: "Authentication failed"

**Gmail:** Usar App Password em vez da senha normal
**Outlook:** Ativar "Less secure apps" ou usar OAuth2
**Servidor próprio:** Verificar credenciais com TI

### Email não chega

1. Verificar pasta de spam/lixo eletrônico
2. Verificar se o domínio remetente está na whitelist
3. Aguardar alguns minutos (pode haver delay)

## 📊 Monitoramento

### Logs do Sistema

O sistema registra todos os eventos de email:

```bash
# Logs de sucesso
✅ [email] Email enviado com sucesso: <message-id>

# Logs de erro
❌ [email] Erro ao enviar email: Error message

# Logs de debug
🐛 [email] Configuração SMTP carregada: {...}
```

### Estatísticas OTP

Endpoint administrativo para monitorar o sistema:

**GET** `/auth/otp/stats`

```json
{
  "status": "sucesso",
  "dados": {
    "otps_ativos": 5,
    "otps_expirados": 23,
    "total_enviados_hoje": 15,
    "tentativas_falhadas_hoje": 3
  }
}
```

## 🔒 Segurança

### Boas Práticas

1. **Usar App Passwords** em vez de senhas normais
2. **Limitar tentativas** de envio por IP/usuário
3. **Monitorar logs** para detectar abusos
4. **Configurar SPF/DKIM** no domínio remetente
5. **Usar conexões TLS** (SMTP_SECURE=false com porta 587)

### Variáveis Sensíveis

**Nunca commitar no Git:**
- SMTP_PASSWORD
- Credenciais de email

**Sempre usar:**
- Arquivo `.env` local
- Variáveis de ambiente no servidor
- Vaults para secrets em produção

## 🚀 Modo Desenvolvimento vs Produção

### Desenvolvimento (NODE_ENV=development)

- Usa Ethereal Email (emails fictícios)
- Gera URLs de preview para visualizar emails
- Não requer configuração SMTP real

### Produção (NODE_ENV=production)

- Usa configuração SMTP real
- Envia emails reais para usuários
- Requer todas as variáveis SMTP configuradas

## 📞 Suporte

Para problemas específicos:

1. **Verificar logs** do servidor
2. **Testar endpoint** `/auth/otp/testar-email`
3. **Consultar TI** para configurações de servidor SMTP institucional
4. **Verificar firewall** para portas 587/465

---

**Última atualização:** $(date)
**Versão do sistema:** Merenda Smart Flow v1.0
