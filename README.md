# 🍎 Caminho da Merenda – Backend

Sistema robusto para gestão inteligente da merenda escolar, com arquitetura moderna, banco de dados normalizado, APIs RESTful seguras e documentação completa.

## 🚀 Visão Geral

O Caminho da Merenda conecta escolas, nutricionistas, gestores e fornecedores em uma plataforma centralizada, eficiente e auditável. O sistema oferece controle detalhado de estoque, pedidos, usuários e integrações, promovendo transparência e automação em toda a cadeia da alimentação escolar.

## ✨ Principais Funcionalidades

- **Banco de dados normalizado** (PostgreSQL) com relacionamentos claros e integridade referencial.
- **APIs RESTful** modernas, seguras e documentadas.
- **Gestão por segmentos educacionais** (Infantil, Fundamental, Médio, etc.).
- **Controle temporal** por períodos letivos, com apenas um período ativo por vez.
- **Permissões granulares**: admins, nutricionistas, gestores, fornecedores e usuários de escola.
- **CRUD completo de usuários** com atualização parcial (PATCH) e controle de permissões.
- **Upload de foto de perfil** integrado ao WordPress (REST API), com gerenciamento automático de mídias.
- **Consolidação de estoque** por período ativo e segmento.
- **Importação em massa** de dados via CSV/JSON.
- **Dashboard e métricas** em tempo real.
- **Alertas inteligentes** para estoque baixo e validade próxima.
- **Auditoria e logs** detalhados de todas as operações.

## 🏗️ Estrutura do Projeto

```
merenda-back/
├── src/
│   ├── controller/   # Lógica das rotas (ex: usuario, estoque, foto-perfil)
│   ├── model/        # Models e validações de dados
│   ├── routes/       # Rotas da API
│   ├── services/     # Regras de negócio
│   ├── middleware/   # Autenticação e autorização
│   ├── types/        # Tipos TypeScript
│   ├── utils/        # Utilitários e helpers
│   └── connection.ts # Conexão com o banco
├── migrations/       # Scripts de criação e alteração do banco
├── scripts/          # Scripts utilitários (ex: run-migrations)
├── docs/             # Documentação detalhada da API e do sistema
├── .env.example      # Exemplo de variáveis de ambiente
├── package.json      # Dependências e scripts
└── README.md         # Este arquivo
```

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Express** (API REST)
- **Knex.js** (migrations e queries)
- **PostgreSQL**
- **JWT** (autenticação)
- **bcrypt** (hash de senhas)
- **dotenv**, **CORS**
- **Integração WordPress REST API** (upload de fotos de perfil)

## ⚡ Como rodar o projeto

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd merenda-back
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`** (baseie-se em `.env.example`)

4. **Execute as migrations**
   ```bash
   # Windows
   npm run migrate:windows
   # Linux/Mac
   npm run migrate:linux
   ```

5. **Inicie o servidor**
   ```bash
   npm run dev
   # ou para produção:
   npm run build
   npm start
   ```

## 🌐 Endpoints e Documentação

- **Base da API:** `http://localhost:3001`
- **Documentação:** consulte a pasta `docs/api/` para detalhes de cada rota, exemplos de uso, permissões e respostas.

Principais endpoints:
- `/api/usuarios` – CRUD de usuários, permissões, upload de foto de perfil
- `/api/escolas` – Gestão de escolas e segmentos
- `/api/estoque` – Controle de estoque normalizado
- `/api/pedidos` – Geração e acompanhamento de pedidos
- `/api/fornecedores` – Gestão de fornecedores
- `/api/periodos` – Controle de períodos letivos
- `/api/importacao` – Importação em massa de dados

## 🔒 Segurança e Permissões

- **JWT** para autenticação stateless.
- **Permissões**: admins têm acesso total; usuários comuns só podem editar seus próprios dados.
- **Senhas** sempre criptografadas.
- **Upload de fotos** seguro, com exclusão automática da mídia anterior.

## 📝 Contribuição

Contribuições são bem-vindas! Siga as boas práticas de commits semânticos e consulte a documentação antes de abrir PRs.

## 📞 Suporte

- Consulte a [documentação de troubleshooting](./docs/api/troubleshooting.md)
- Verifique os [logs de migração](./MIGRATIONS.md)
- Dúvidas? Entre em contato com a equipe de desenvolvimento.

---

**Caminho da Merenda** – Gestão moderna, transparente e eficiente da alimentação escolar.

---
