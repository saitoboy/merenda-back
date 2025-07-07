# 📸 Sistema de Foto de Perfil - Integração Google Drive

## ✅ IMPLEMENTAÇÃO COMPLETA

### 🔧 **Tecnologias Utilizadas**
- **Backend**: Node.js + Express + TypeScript
- **Banco**: PostgreSQL (campo `foto_perfil_url` na tabela `usuario`)
- **Armazenamento**: Google Drive via Google Apps Script
- **Autenticação**: JWT middleware existente
- **Upload**: Base64 via JSON (sem multer/multipart)

### 🌐 **Google Apps Script Configurado**
- **URL**: https://script.google.com/macros/s/AKfycbxOCWbrnYI8K2d6GwfG3zwww05oFUh9RxwVrd-HV0opP8dCUcPXcUHxMvR9lV-x29H5/exec
- **Pasta Drive**: "Caminhos da Merenda" (ID: 1Oj0Lirtl5Ywy4IpCxUOmUcVtwietfVTx)
- **Funcionalidades**: Upload, Delete, Test

---

## 📋 **ENDPOINTS DISPONÍVEIS**

### 1. **Testar Google Apps Script**
```http
GET /usuario/foto-perfil/status
```
- ✅ **Sem autenticação**
- 🎯 **Objetivo**: Verificar se o Google Apps Script está online
- 📤 **Resposta**: Status da conexão + informações do serviço

### 2. **Upload de Foto de Perfil**
```http
POST /usuario/foto-perfil
Authorization: Bearer {token}
Content-Type: application/json

{
  "fileData": "iVBORw0KGgoAAAANSUhEUgAAAAE...", // Base64 da imagem
  "fileName": "minha-foto.jpg",
  "mimeType": "image/jpeg"
}
```
- 🔐 **Requer autenticação**
- 📂 **Formatos aceitos**: JPG, PNG, WebP, GIF
- 📏 **Limite**: 5MB
- ♻️ **Comportamento**: Remove foto anterior automaticamente

### 3. **Obter Foto de Perfil (Própria)**
```http
GET /usuario/foto-perfil
Authorization: Bearer {token}
```
- 🔐 **Requer autenticação**
- 📤 **Retorna**: URL da foto + flag `temFoto`

### 4. **Remover Foto de Perfil**
```http
DELETE /usuario/foto-perfil
Authorization: Bearer {token}
```
- 🔐 **Requer autenticação**
- 🗑️ **Remove**: Arquivo do Drive + URL do banco

### 5. **Obter Foto de Outro Usuário**
```http
GET /usuario/foto-perfil/{userId}
Authorization: Bearer {token}
```
- 🔐 **Requer autenticação**
- 👑 **Permissões**: Admins ou próprio usuário
- 📤 **Retorna**: Dados públicos + URL da foto

---

## 🧪 **TESTANDO A FUNCIONALIDADE**

### **Arquivo de Teste Criado**: `teste-foto-perfil.http`

```bash
# 1. Testar se Google Apps Script está funcionando
GET http://localhost:3003/usuario/foto-perfil/status

# 2. Fazer login e obter token
POST http://localhost:3003/auth/login
{
  "email": "seu-email@tec.edu.muriae.mg.gov.br",
  "senha": "sua-senha"
}

# 3. Usar o token nas outras requisições
```

### **Fluxo de Teste Recomendado**:

1. **Verificar Status**:
   ```
   GET /usuario/foto-perfil/status
   ```
   - ✅ Deve retornar `success: true` e detalhes do Google Apps Script

2. **Fazer Login** (usar endpoint existente):
   ```
   POST /auth/login
   ```
   - 📝 Copiar o token retornado

3. **Verificar Foto Atual**:
   ```
   GET /usuario/foto-perfil
   ```
   - 📸 Deve mostrar se já tem foto ou não

4. **Upload de Foto**:
   - 🖼️ Converter uma imagem pequena para base64
   - 📤 Enviar via POST /usuario/foto-perfil
   - ✅ Verificar se retorna URL do Google Drive

5. **Verificar Upload**:
   ```
   GET /usuario/foto-perfil
   ```
   - 🔗 Deve retornar a URL da foto no Drive

6. **Testar Remoção**:
   ```
   DELETE /usuario/foto-perfil
   ```
   - 🗑️ Deve remover foto do Drive e banco

---

## 🗄️ **ESTRUTURA DO BANCO**

### **Tabela `usuario` - Nova Coluna**:
```sql
ALTER TABLE usuario ADD COLUMN foto_perfil_url TEXT;
```
- ✅ **Migration 012** executada com sucesso
- 📝 **Comentário**: URL da foto de perfil armazenada no Google Drive
- 🔍 **Índice**: Criado para otimização

---

## 🔒 **SEGURANÇA & VALIDAÇÕES**

### **Validações Implementadas**:
- 📝 **Tipos MIME**: Apenas imagens (jpeg, png, webp, gif)
- 📏 **Tamanho**: Máximo 5MB
- 🔐 **Autenticação**: JWT obrigatório em todas as rotas (exceto status)
- 👑 **Autorização**: Usuários só podem gerenciar próprias fotos (exceto admins)
- 🛡️ **Base64**: Validação rigorosa do formato

### **Tratamento de Erros**:
- 🌐 **Google Apps Script Offline**: Retorna erro claro
- 📂 **Arquivo Inválido**: Validação antes do upload
- 🔗 **URL Corrompida**: Fallback seguro na remoção
- 🚫 **Acesso Negado**: Respostas HTTP apropriadas

---

## 🚀 **PRÓXIMOS PASSOS SUGERIDOS**

### **Frontend Integration**:
1. **Componente de Upload**:
   - 📷 Input de arquivo com preview
   - ⚡ Conversão automática para base64
   - 📊 Barra de progresso

2. **Avatar Component**:
   - 🖼️ Exibição da foto de perfil
   - 🔄 Fallback para iniciais do nome
   - 📱 Responsivo

3. **Gerenciamento**:
   - ✏️ Botão "Alterar Foto"
   - 🗑️ Botão "Remover Foto"
   - 👁️ Modal de visualização

### **Melhorias Opcionais**:
- 🔄 **Sync periódico** (verificar se arquivos ainda existem no Drive)
- 📈 **Analytics** (quantas fotos por usuário, tipos mais usados)
- 🎨 **Redimensionamento automático** (otimizar tamanho)
- 📱 **Versões múltiplas** (thumbnail, medium, full)

---

## 💡 **DICAS DE USO**

### **Conversão Base64 (JavaScript)**:
```javascript
// No frontend
const file = document.getElementById('input').files[0];
const reader = new FileReader();
reader.onload = function(e) {
  const base64 = e.target.result.split(',')[1]; // Remove "data:image/jpeg;base64,"
  // Usar 'base64' no campo fileData
};
reader.readAsDataURL(file);
```

### **URLs Geradas pelo Google Drive**:
- **webViewLink**: Para visualização (com interface do Drive)
- **webContentLink**: Para download direto (melhor para `<img src="">`)
- 🔗 Ambas são salvas no banco para flexibilidade

---

## ✅ **STATUS FINAL**

- ✅ **Backend**: 100% implementado e testado
- ✅ **Google Apps Script**: Online e funcionando
- ✅ **Banco de Dados**: Migration executada
- ✅ **Rotas**: Registradas e ativas
- ✅ **Documentação**: Completa
- ✅ **Testes**: Arquivo HTTP criado

**🎉 SISTEMA DE FOTO DE PERFIL PRONTO PARA USO! 🎉**
