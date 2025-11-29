# Busca Vagas API

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/mpbarbosa/busca_vagas/releases/tag/v1.1.0)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)

API RESTful para gerenciamento de vagas em hotéis de sindicatos.

**Current Version:** v1.1.0 ([Release Notes](https://github.com/mpbarbosa/busca_vagas/releases/tag/v1.1.0))

## 📋 Descrição

API desenvolvida para facilitar a busca e o gerenciamento de vagas de emprego em hotéis vinculados a sindicatos. Esta API fornece endpoints para criação, listagem, atualização e remoção de vagas.

## 🚀 Tecnologias

### API

- Node.js
- Express.js
- CORS (Cross-Origin Resource Sharing)
- dotenv (gerenciam/ento de variáveis de ambiente)

### Testes

- Jest (testes unitários e de integração)
- Supertest (testes de API)
- Selenium WebDriver (testes E2E)

### Qualidade de Código

- ESLint

## 📁 Estrutura do Projeto

```plaintext
busca_vagas/
├── src/                # API Node.js/Express
│   ├── config/        # Configurações
│   ├── controllers/   # Controllers (lógica de requisições)
│   ├── models/        # Modelos de dados
│   ├── routes/        # Definição de rotas da API
│   ├── middlewares/   # Middlewares (auth, validação, etc)
│   ├── services/      # Lógica de negócio
│   ├── utils/         # Utilitários
│   └── server.js      # Entry point da API
├── tests/             # Testes automatizados
│   ├── unit/         # Testes unitários
│   ├── integration/  # Testes de integração
│   └── e2e/          # Testes E2E
├── client/           # Cliente de exemplo (opcional)
├── scripts/          # Scripts auxiliares shell
├── prompts/          # Workflows e prompts de automação
└── docs/             # Documentação da API
```

Para mais detalhes sobre a estrutura, consulte [docs/STRUCTURE.md](docs/STRUCTURE.md).

## 🔧 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Google Chrome (para testes E2E e busca automatizada)
- ChromeDriver (instalado automaticamente via selenium-webdriver)

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/mpbarbosa/busca_vagas.git
cd busca_vagas

# Execute o script de configuração
./scripts/setup.sh

# Ou instale manualmente:
npm install
```

### Configuração

1. Copie o arquivo `.env.example` para `.env`:

    ```bash
    cp .env.example .env
    ```

2. Configure as variáveis de ambiente conforme necessário

## 🏃 Execução

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

A API estará disponível em `http://localhost:3005`

### Endpoints Principais

- `GET /` - Informações da API
- `GET /api/health` - Health check
- `GET /api/vagas` - Listar vagas
- `POST /api/vagas` - Criar vaga
- `PUT /api/vagas/:id` - Atualizar vaga
- `DELETE /api/vagas/:id` - Remover vaga
- `GET /api/vagas/search/bydates?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&headless=true|false` - Busca automatizada de vagas por intervalo de datas

Para documentação completa dos endpoints, veja [docs/API.md](docs/API.md)

## 🧪 Testes

```bash
# Todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E (requer servidor rodando em outra sessão)
npm run test:e2e

# Ou use o script
./scripts/test.sh
```

**Importante para testes E2E:** 
- Inicie o servidor antes: `npm run dev` (em um terminal separado)
- Os testes E2E usam Selenium WebDriver e podem levar mais tempo para executar
- O servidor deve estar rodando na porta 3005

## 📚 Documentação

- [Documentação da API](docs/API.md) - Endpoints, requisições e respostas
- [Estrutura do Projeto](docs/STRUCTURE.md) - Organização de diretórios e arquivos
- [Busca por Dia](docs/SEARCH_BY_DAY.md) - Funcionalidade de busca automatizada com Selenium
- [Guia Rápido](docs/QUICK_REFERENCE.md) - Referência rápida de comandos
- [Correção ES Modules](docs/FIX_ES_MODULE.md) - Solução para problemas com ES Modules
- [Versionamento](docs/VERSIONING.md) - Guia de versionamento semântico

## 🔖 Versionamento

Este projeto segue [Semantic Versioning 2.0.0](https://semver.org/).

**Formato:** `MAJOR.MINOR.PATCH`

- **MAJOR:** Mudanças incompatíveis na API
- **MINOR:** Nova funcionalidade backward-compatible
- **PATCH:** Correções de bugs backward-compatible

**Versão Atual:** v1.1.0

Para detalhes completos sobre versionamento e histórico de releases, consulte:
- [VERSIONING.md](docs/VERSIONING.md) - Guia completo de versionamento
- [Releases no GitHub](https://github.com/mpbarbosa/busca_vagas/releases)
- [Changelog](docs/CHANGELOG_SIMPLESEARCH.md) - Histórico de mudanças

## 🔌 Integração

Esta API pode ser consumida por qualquer cliente HTTP. Um cliente de exemplo está disponível na pasta `client/` para demonstração.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](LICENSE).
