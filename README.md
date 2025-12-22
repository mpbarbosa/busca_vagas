# Busca Vagas API

[![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)](https://github.com/mpbarbosa/busca_vagas/releases/tag/v1.5.0)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](tests/)

API RESTful para gerenciamento de vagas em hotéis de sindicatos.

**Current Version:** v1.5.0 ([Release Notes](docs/release-notes/RELEASE_NOTES_v1.5.0.md))

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
- Puppeteer (automação de browser - recomendado)
- Selenium WebDriver (testes E2E - legado)

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
│   └── public/       # Arquivos estáticos (HTML)
├── scripts/          # 🔧 Scripts de desenvolvimento (setup, test)
├── shell_scripts/    # 🚀 Scripts de produção (deploy, validate, monitoring)
├── prompts/          # Workflows e prompts de automação
├── docs/             # 📚 Documentação completa
│   ├── api/         # Documentação de endpoints
│   ├── architecture/ # Arquitetura e estrutura
│   ├── testing/     # Guias de testes
│   ├── guides/      # Guias para desenvolvedores
│   ├── workflows/   # Documentação de workflows
│   ├── release-notes/ # Notas de lançamento
│   ├── deployment/  # Guias de deploy
│   ├── refactoring/ # Documentação de refatorações
│   ├── reports/     # Relatórios e análises
│   └── archive/     # Documentação legada
└── .ai_workflow/    # 🤖 Logs de workflows AI (não commitado)
    ├── logs/        # Logs de execução
    ├── backlog/     # Backlog de tarefas
    └── summaries/   # Resumos de workflows
```

**Diferença entre scripts/ e shell_scripts/**:
- **scripts/**: Scripts de desenvolvimento e build (setup, test, etc.)
- **shell_scripts/**: Scripts de produção/ops (deploy, validação, monitoramento)

**Sobre .ai_workflow/**:
- Gerado automaticamente por ferramentas de AI
- Adicionado ao .gitignore (não fazer commit)
- Contém logs e metadados de automações

Para mais detalhes sobre a estrutura, consulte [docs/architecture/STRUCTURE.md](docs/architecture/STRUCTURE.md).

## 🔧 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Google Chrome ou Chromium (para automação de browser)
  - Ubuntu/Debian: `sudo apt-get install google-chrome-stable`
  - Fedora/RHEL: `sudo dnf install google-chrome-stable`
  - macOS: `brew install --cask google-chrome`

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/mpbarbosa/busca_vagas.git
cd busca_vagas

# Execute o script de configuração (recomendado)
./scripts/setup.sh

# Ou instale manualmente:
npm install
```

**Script setup.sh**:
- Instala dependências do backend (Node.js)
- Instala dependências do frontend (client/)
- Valida instalação
- **Exit codes**: 0 (sucesso), 1 (erro)
- **Requisitos**: Node.js >= 18, npm, bash
- **Tempo**: ~2-3 minutos

Para mais detalhes sobre scripts auxiliares, veja [scripts/README.md](scripts/README.md).

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
- `GET /api/vagas/hoteis` - Listar hotéis (dados estáticos)
- `GET /api/vagas/hoteis/scrape` - Buscar lista de hotéis do site AFPESP (web scraping)
- `GET /api/vagas/hoteis/:id` - Buscar hotel por ID
- `POST /api/vagas` - Criar vaga
- `PUT /api/vagas/:id` - Atualizar vaga
- `DELETE /api/vagas/:id` - Remover vaga
- `GET /api/vagas/search?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&hotel=STRING` - Busca automatizada de vagas (Puppeteer)
- `GET /api/vagas/search/weekends` - Busca vagas para finais de semana (Puppeteer)

Para documentação completa dos endpoints, veja [docs/api/API.md](docs/api/API.md)

## 🧪 Testes

### Execução Rápida com Scripts

```bash
# Script de teste rápido (unit + integration)
./scripts/test.sh

# Ou use comandos npm diretamente:
```

### Comandos npm

```bash
# Todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Testes Puppeteer (recomendado)
npm run test:puppeteer          # Teste rápido
npm run test:puppeteer:all      # Suite completa
npm run test:puppeteer:e2e      # E2E detalhado
npm run test:puppeteer:business # Lógica de negócio

# Validação de Ambiente de Produção
npm run test:prod               # Validação completa
npm run validate:env            # Alias para validação
```

**Script test.sh**:
- Executa testes unitários
- Executa testes de integração
- Exibe resultados consolidados
- **Exit codes**: 0 (sucesso), não-zero (falhas)
- **Tempo**: ~30-60 segundos

Para mais opções de teste, veja [scripts/README.md](scripts/README.md).

### 🏭 Validação de Ambiente de Produção

Novo! Suite de testes abrangente para validar ambiente de produção:

```bash
npm run test:prod
```

Este comando executa 20 testes de validação que verificam:
- ✅ Dependências do sistema (Node.js, npm, packages)
- ✅ Automação de browser (Puppeteer, Chrome/Chromium)
- ✅ Servidor API (endpoints, CORS, performance)
- ✅ Integração Puppeteer (busca, operações E2E)
- ✅ Segurança (headless mode, flags)
- ✅ Performance (memória, cleanup)

Veja a [documentação completa](docs/testing/PRODUCTION_ENVIRONMENT_VALIDATION.md) para detalhes.

**Importante:** 
- Testes Puppeteer usam headless mode por padrão (40-60% mais eficiente)
- Para E2E, o servidor é iniciado automaticamente
- Validação de produção leva ~70-90 segundos

## 📚 Documentação

### Documentação Principal
- [Documentação da API](docs/api/API.md) - Endpoints, requisições e respostas
- **[Fluxo de Dados](docs/api/DATA_FLOW_DOCUMENTATION.md)** - Como os dados fluem pela API
- **[Requisitos Funcionais](docs/api/FUNCTIONAL_REQUIREMENTS.md)** - Especificação completa e regras de negócio
- [Estrutura do Projeto](docs/architecture/STRUCTURE.md) - Organização de diretórios e arquivos
- [Guia Rápido](docs/guides/QUICK_REFERENCE.md) - Referência rápida de comandos

### Automação e Testes
- [Implementação Puppeteer](docs/testing/PUPPETEER_SUMMARY.md) - Detalhes da implementação
- [Testes Puppeteer](docs/testing/PUPPETEER_TEST_SUITE_SUMMARY.md) - Suite de testes
- [Busca por Dia](README_SEARCH_BY_DAY.md) - Funcionalidade de busca automatizada

### Validação de Ambiente
- **[Validação de Produção](docs/testing/PRODUCTION_ENVIRONMENT_VALIDATION.md)** - Suite completa de validação
- [Referência Rápida de Validação](docs/testing/VALIDATION_QUICK_REFERENCE.md) - Comandos e fixes
- [Resumo de Implementação](docs/testing/TEST_SUITE_IMPLEMENTATION_SUMMARY.md) - Visão geral técnica
- [Correção ES Modules](docs/troubleshooting/FIX_ES_MODULE.md) - Solução para problemas com ES Modules
- [Versionamento](docs/guides/VERSIONING.md) - Guia de versionamento semântico

### ⚠️ Regras Importantes
- **Pacotes de Férias**: Durante os períodos de Natal (22/12-27/12) e Ano Novo (27/12-02/01), as reservas devem seguir datas pré-definidas por padrão. 
  - Use o parâmetro `applyBookingRules=false` para pesquisar datas personalizadas durante esses períodos.
  - Veja [Regras de Reserva](docs/api/FUNCTIONAL_REQUIREMENTS.md#631-booking-rules) para detalhes completos.

## 🔖 Versionamento

Este projeto segue [Semantic Versioning 2.0.0](https://semver.org/).

**Formato:** `MAJOR.MINOR.PATCH`

- **MAJOR:** Mudanças incompatíveis na API
- **MINOR:** Nova funcionalidade backward-compatible
- **PATCH:** Correções de bugs backward-compatible

**Versão Atual:** v1.5.0

Para detalhes completos sobre versionamento e histórico de releases, consulte:
- [VERSIONING.md](docs/guides/VERSIONING.md) - Guia completo de versionamento
- [Releases no GitHub](https://github.com/mpbarbosa/busca_vagas/releases)
- [Changelog](docs/workflows/CHANGELOG_SIMPLESEARCH.md) - Histórico de mudanças

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

## 📚 Documentation

### Architecture Documentation
- **[Architecture Overview](./docs/architecture/ARCHITECTURE.md)** - Complete software architecture documentation
- **[Architecture Diagrams](./docs/architecture/ARCHITECTURE_DIAGRAMS.md)** - Visual architecture diagrams and flow charts
- **[Architecture Quick Reference](./docs/architecture/ARCHITECTURE_QUICK_REFERENCE.md)** - Quick reference guide

### Puppeteer Implementation (NEW - 40-60% Resource Savings)
- **[Puppeteer Quick Start](./docs/testing/PUPPETEER_README.md)** - Get started with the optimized implementation
- **[Puppeteer Summary](./docs/testing/PUPPETEER_SUMMARY.md)** - Complete implementation details
- **[Puppeteer Migration Guide](./docs/testing/PUPPETEER_MIGRATION.md)** - Migration from Selenium
- **[Puppeteer vs Selenium](./docs/testing/PUPPETEER_VS_SELENIUM.md)** - Detailed comparison

### API Documentation
- **[API Client Documentation](./docs/api/API_CLIENT_DOCUMENTATION.md)** - Comprehensive client guide
- **[Data Flow Documentation](./docs/api/DATA_FLOW_DOCUMENTATION.md)** - Complete request-to-response flow explanation
- **[API Reference](./docs/api/API.md)** - API endpoints and usage
- **[Usage Guide](./USAGE.md)** - How to use the API

### Project Information
- **[Project Structure](./docs/architecture/PROJECT_STRUCTURE.md)** - Detailed project layout
- **[Release Notes](https://github.com/mpbarbosa/busca_vagas/releases)** - Version history and changes
- **[Bug Fix Summary](./docs/bug-fixes/BUG_FIX_SUMMARY.md)** - Recent bug fixes and improvements

### Technical Fixes & Troubleshooting
- **[Vacancy Search Bug Fix](./docs/bug-fixes/BUG_FIX_SUMMARY.md)** - Progressive loading fix (Dec 2025)
- **[Node.js v25+ JSON Fix](./docs/troubleshooting/NODE_V25_JSON_IMPORT_FIX.md)** - JSON import compatibility
- **[ES Module Fix](./docs/troubleshooting/FIX_ES_MODULE.md)** - Module system compatibility

## 🏗️ Architecture Highlights

### Layered Architecture
```
┌─────────────────────┐
│  Presentation       │ ← Routes + Controllers
├─────────────────────┤
│  Business Logic     │ ← Services + Models  
├─────────────────────┤
│  Data Access        │ ← Browser Automation
├─────────────────────┤
│  External Systems   │ ← Hotel Websites
└─────────────────────┘
```

### Performance Improvements (Puppeteer)
- **57% less memory** usage (420 MB → 180 MB)
- **53% faster** search times (6.8s → 3.2s)
- **50% cost** savings on AWS EC2

See [ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) for complete details.

