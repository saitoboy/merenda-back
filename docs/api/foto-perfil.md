# 📸 Sistema de Foto de Perfil - Integração WordPress

## ✅ IMPLEMENTAÇÃO COMPLETA

### 🔧 **Tecnologias Utilizadas**
- **Backend**: Node.js + Express + TypeScript
- **Banco**: PostgreSQL (campo `foto_perfil_url` na tabela `usuario`)
- **Armazenamento**: WordPress via REST API
- **Autenticação**: JWT middleware existente
- **Upload**: Base64 via JSON (sem multer/multipart)

### 🌐 **WordPress Configurado**
- **URL**: Definida em `WP_URL` no .env
- **Usuário**: Definido em `WP_USER` no .env
- **Application Password**: Definido em `WP_APP_PASSWORD` no .env
- **Funcionalidades**: Upload, Delete, Test

---

## 📋 **ENDPOINTS DISPONÍVEIS**

### 1. **Testar WordPress**
```http
GET /usuario/foto-perfil/status
```
- ✅ **Sem autenticação**
- 🎯 **Objetivo**: Verificar se o WordPress está online e autenticado
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
- 🗑️ **Remove**: Arquivo do WordPress + URL do banco

### 5. **Obter Foto de Outro Usuário**
```http
GET /usuario/foto-perfil/{userId}
Authorization: Bearer {token}
```
- 🔐 **Requer autenticação**
- 👑 **Permissões**: Admins ou próprio usuário
- 📤 **Retorna**: Dados públicos + URL da foto

### 6. **Listar todas as mídias do WordPress (admin)**
```http
GET /usuario/foto-perfil/midias?page=1&perPage=20
Authorization: Bearer {token_admin}
```
- 👑 **Apenas administradores**
- 🔎 **Retorna**: Lista paginada de mídias do WordPress

### 7. **Buscar mídia do WordPress por ID (admin)**
```http
GET /usuario/foto-perfil/midia/{id}
Authorization: Bearer {token_admin}
```
- 👑 **Apenas administradores**
- 🔎 **Retorna**: Metadados e URL da mídia

### 8. **Deletar mídia do WordPress por ID (admin)**
```http
DELETE /usuario/foto-perfil/midia/{id}
Authorization: Bearer {token_admin}
```
- 👑 **Apenas administradores**
- 🗑️ **Remove**: Arquivo do WordPress

---

## 🧪 **TESTANDO A FUNCIONALIDADE**

### **Arquivo de Teste Criado**: `teste-foto-perfil.http`

```bash
# 1. Testar se WordPress está funcionando
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
   - ✅ Deve retornar `success: true` e detalhes do WordPress

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
   - ✅ Verificar se retorna URL do WordPress

5. **Verificar Upload**:
   ```
   GET /usuario/foto-perfil
   ```
   - 🔗 Deve retornar a URL da foto no WordPress

6. **Testar Remoção**:
   ```
   DELETE /usuario/foto-perfil
   ```
   - 🗑️ Deve remover foto do WordPress e banco

7. **Listar Mídias (Admin)**:
   ```
   GET /usuario/foto-perfil/midias?page=1&perPage=20
   ```
   - 🔑 Deve retornar lista de mídias (paginada)

8. **Buscar Mídia por ID (Admin)**:
   ```
   GET /usuario/foto-perfil/midia/{id}
   ```
   - 🔑 Deve retornar detalhes da mídia

9. **Deletar Mídia por ID (Admin)**:
   ```
   DELETE /usuario/foto-perfil/midia/{id}
   ```
   - 🔑 Deve remover a mídia do WordPress

---

## 🗄️ **ESTRUTURA DO BANCO**

### **Tabela `usuario` - Nova Coluna**:
```sql
ALTER TABLE usuario ADD COLUMN foto_perfil_url TEXT;
```
- ✅ **Migration 012** executada com sucesso
- 📝 **Comentário**: URL da foto de perfil armazenada no WordPress
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
- 🌐 **WordPress Offline**: Retorna erro claro
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
- 🔄 **Sync periódico** (verificar se arquivos ainda existem no WordPress)
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

### **URLs Geradas pelo WordPress**:
- **source_url**: URL direta da imagem para uso em <img src="">
- 🔗 Salva no banco para flexibilidade

---

## ✅ **STATUS FINAL**

- ✅ **Backend**: 100% implementado e testado
- ✅ **WordPress**: Online e funcionando
- ✅ **Banco de Dados**: Migration executada
- ✅ **Rotas**: Registradas e ativas
- ✅ **Documentação**: Completa
- ✅ **Testes**: Arquivo HTTP criado

**🎉 SISTEMA DE FOTO DE PERFIL PRONTO PARA USO COM WORDPRESS! 🎉**
