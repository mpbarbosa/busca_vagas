# Estrutura do Projeto

## Visão Geral
Este projeto é uma API RESTful desenvolvida com Node.js e Express, seguindo as melhores práticas de arquitetura de APIs.

## Estrutura de Diretórios

```
busca_vagas/
├── src/                   # API Node.js/Express
│   ├── config/           # Configurações
│   │   ├── database.js   # Configuração do banco de dados
│   │   └── server.js     # Configuração do servidor
│   ├── controllers/      # Controllers (lógica de rotas)
│   │   └── vagasController.js
│   ├── models/           # Modelos de dados
│   │   └── Vaga.js
│   ├── routes/           # Definição de rotas
│   │   ├── index.js
│   │   └── vagasRoutes.js
│   ├── middlewares/      # Middlewares customizados
│   │   ├── auth.js
│   │   └── validation.js
│   ├── services/         # Lógica de negócio
│   │   └── vagasService.js
│   ├── utils/            # Funções utilitárias
│   │   └── helpers.js
│   └── server.js         # Entry point do servidor
│
├── tests/                # Testes
│   ├── unit/            # Testes unitários
│   │   ├── utils/       # Testes de utilitários
│   │   ├── services/    # Testes de serviços
│   │   ├── models/      # Testes de modelos
│   │   └── middlewares/ # Testes de middlewares
│   ├── integration/     # Testes de integração
│   │   └── api.test.js
│   └── e2e/             # Testes E2E com Puppeteer
│       └── busca-vagas.test.js
│
├── client/              # Cliente de exemplo (opcional)
│   ├── public/          # Arquivos estáticos (HTML, assets)
│   │   └── index.html   # Página de exemplo
│   ├── src/             # Código-fonte do cliente
│   └── package.json     # Dependências do cliente
│
├── scripts/             # Scripts de desenvolvimento
│   ├── setup.sh         # Instalação de dependências
│   ├── test.sh          # Execução rápida de testes
│   └── test-puppeteer.js # Testes Puppeteer
│
├── shell_scripts/       # Scripts de produção/operações
│   ├── deploy.sh                    # Deploy como serviço systemd
│   ├── validate-environment.sh     # Validação de ambiente
│   └── check_server_status.sh     # Monitoramento de servidores
│
├── prompts/             # Workflows e prompts de automação
│   └── [workflow scripts]
│
├── docs/                # Documentação da API
│   ├── api/            # Documentação de API
│   │   ├── API.md                  # Referência de endpoints
│   │   ├── DATA_FLOW_DOCUMENTATION.md
│   │   ├── FUNCTIONAL_REQUIREMENTS.md
│   │   └── SEARCH_BY_DAY.md
│   │
│   ├── architecture/   # Documentação de arquitetura
│   │   ├── ARCHITECTURE.md         # Visão geral da arquitetura
│   │   └── STRUCTURE.md            # Este arquivo
│   │
│   ├── testing/        # Documentação de testes
│   │   ├── PUPPETEER_SUMMARY.md
│   │   ├── PRODUCTION_ENVIRONMENT_VALIDATION.md
│   │   └── TEST_SUITE_IMPLEMENTATION_SUMMARY.md
│   │
│   ├── guides/         # Guias para desenvolvedores
│   │   ├── QUICK_REFERENCE.md      # Referência rápida
│   │   ├── VERSIONING.md           # Guia de versionamento
│   │   └── SCRIPTS_QUICK_REFERENCE.md
│   │
│   ├── workflows/      # Documentação de workflows
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   ├── CHANGELOG_SIMPLESEARCH.md
│   │   └── DOCUMENTATION_FIXES_CONSOLIDATED.md
│   │
│   ├── release-notes/  # Notas de lançamento
│   │   ├── RELEASE_NOTES_v1.5.0.md
│   │   └── RELEASE_NOTES_v1.4.0.md
│   │
│   ├── troubleshooting/ # Solução de problemas
│   │   └── FIX_ES_MODULE.md
│   │
│   ├── deployment/     # Documentação de deploy
│   │   ├── DEPLOYMENT_QUICKSTART.md
│   │   ├── DEPLOYMENT_SCRIPT.md
│   │   ├── SYSTEMD_SERVICE.md
│   │   └── LIVE_SERVER_EVALUATION.md
│   │
│   ├── refactoring/    # Documentação de refatorações
│   │   ├── REFERENTIAL_TRANSPARENCY.md
│   │   ├── HOTEIS_SERVICE_REFACTORING.md
│   │   ├── VAGAS_SERVICE_REFACTORING.md
│   │   ├── HOTEL_CACHE_IMPLEMENTATION.md
│   │   └── REFACTORING_SUMMARY.md
│   │
│   ├── reports/        # Relatórios e análises
│   │   ├── analysis/   # Análises de código e qualidade
│   │   ├── bugfixes/   # Relatórios de correções de bugs
│   │   └── implementation/ # Relatórios de implementação
│   │
│   ├── archive/        # Documentação arquivada/legada
│   │   ├── USAGE.md               # Guia de uso legado
│   │   └── README_SEARCH_BY_DAY.md # Documentação antiga
│   │
│   ├── workflow-automation/ # Documentação de automação (vazio)
│   └── DOCUMENTATION_INDEX.md # Índice geral da documentação
│
├── .ai_workflow/        # Arquivos de workflow de automação AI (não commitados)
│   ├── logs/           # Logs de execução de workflows
│   │   └── workflow_YYYYMMDD_HHMMSS/ # Logs por execução
│   ├── backlog/        # Backlog e tarefas de workflows
│   │   └── workflow_YYYYMMDD_HHMMSS/ # Tarefas por execução
│   └── summaries/      # Resumos de workflows executados
│       └── workflow_YYYYMMDD_HHMMSS/ # Resumos por execução
│
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── jest.config.cjs     # Configuração do Jest
├── package.json        # Dependências da API
├── LICENSE             # Licença do projeto (ISC)
└── README.md           # Documentação principal
```

## Convenções

### API (src/)
- **config/**: Arquivos de configuração (banco de dados, servidor, etc.)
- **controllers/**: Implementação da lógica de cada rota da API
- **models/**: Definição de modelos/schemas de dados
- **routes/**: Definição de endpoints da API REST
- **middlewares/**: Funções intermediárias (autenticação, validação, CORS, etc.)
- **services/**: Lógica de negócio complexa
- **utils/**: Funções auxiliares reutilizáveis
- **server.js**: Entry point da aplicação

### Testes (tests/)
- **unit/**: Testes de funções e classes isoladas
- **integration/**: Testes de integração da API
- **e2e/**: Testes de ponta a ponta com Selenium

### Cliente (client/) - Opcional
Cliente de exemplo para demonstração do consumo da API

**Subdiretórios:**
- **public/**: Arquivos estáticos servidos diretamente (HTML, CSS, imagens)
  - Contém `index.html` - página de exemplo da aplicação
  - Assets estáticos que não precisam de processamento
- **src/**: Código-fonte do cliente (quando aplicável)
  - Componentes e lógica da interface
- **package.json**: Dependências específicas do cliente

### Scripts de Desenvolvimento (scripts/)
Scripts para facilitar o desenvolvimento e testes

- **setup.sh**: Instalação automática de dependências (backend + frontend)
- **test.sh**: Execução rápida de testes (unit + integration)
- **test-puppeteer.js**: Testes de automação com Puppeteer
- **run-puppeteer-tests.js**: Suite completa de testes Puppeteer
- **fix-documentation-consistency.sh**: Validação de consistência da documentação

### Scripts de Produção (shell_scripts/)
Scripts para operações, deploy e monitoramento

- **deploy.sh**: Automação de deploy como serviço systemd
- **validate-environment.sh**: Validação completa do ambiente
- **check_server_status.sh**: Monitoramento de servidores (nginx, Node.js)

Veja [scripts/README.md](../../scripts/README.md) e [shell_scripts/README.md](../../shell_scripts/README.md) para detalhes.

### Documentação (docs/)
Documentação completa do projeto organizada por categoria

#### api/
Documentação da API REST e funcionalidades
- **API.md**: Referência completa de endpoints
- **DATA_FLOW_DOCUMENTATION.md**: Como os dados fluem pela API
- **FUNCTIONAL_REQUIREMENTS.md**: Requisitos funcionais e regras de negócio
- **SEARCH_BY_DAY.md**: Documentação da busca automatizada por dia

#### architecture/
Documentação de arquitetura e estrutura
- **ARCHITECTURE.md**: Visão geral da arquitetura do sistema
- **STRUCTURE.md**: Este arquivo - estrutura de diretórios

#### testing/
Guias e documentação de testes
- **PUPPETEER_SUMMARY.md**: Resumo da implementação Puppeteer
- **PRODUCTION_ENVIRONMENT_VALIDATION.md**: Suite de validação de produção
- **TEST_SUITE_IMPLEMENTATION_SUMMARY.md**: Resumo da implementação de testes
- **TEST_DOCUMENTATION.md**: Documentação completa dos testes

#### guides/
Guias para desenvolvedores
- **QUICK_REFERENCE.md**: Referência rápida de comandos
- **VERSIONING.md**: Guia de versionamento semântico
- **SCRIPTS_QUICK_REFERENCE.md**: Referência rápida de scripts

#### workflows/
Documentação de workflows e processos
- **IMPLEMENTATION_SUMMARY.md**: Resumos de implementações
- **CHANGELOG_SIMPLESEARCH.md**: Changelog da funcionalidade simpleSearch
- **DOCUMENTATION_FIXES_CONSOLIDATED.md**: Consolidação de correções de documentação
- **BOOKING_RULES_WORKFLOW_CONTEXT.md**: Contexto de regras de reserva

#### release-notes/
Notas de lançamento por versão
- **RELEASE_NOTES_v1.5.0.md**: Notas da versão 1.5.0 (atual)
- **RELEASE_NOTES_v1.4.0.md**: Notas da versão 1.4.0

#### troubleshooting/
Soluções de problemas comuns
- **FIX_ES_MODULE.md**: Solução para problemas com ES Modules

#### deployment/
Documentação de deploy e produção
- **DEPLOYMENT_QUICKSTART.md**: Guia rápido de deploy
- **DEPLOYMENT_SCRIPT.md**: Documentação do script de deploy
- **SYSTEMD_SERVICE.md**: Configuração do serviço systemd
- **LIVE_SERVER_EVALUATION.md**: Avaliação de servidor em produção

#### refactoring/
Documentação de refatorações realizadas
- **REFERENTIAL_TRANSPARENCY.md**: Implementação de transparência referencial
- **HOTEIS_SERVICE_REFACTORING.md**: Refatoração do serviço de hotéis
- **VAGAS_SERVICE_REFACTORING.md**: Refatoração do serviço de vagas
- **HOTEL_CACHE_IMPLEMENTATION.md**: Implementação de cache de hotéis
- **HOTEL_CACHE_QUICK_REFERENCE.md**: Referência rápida do cache
- **REFACTORING_SUMMARY.md**: Resumo geral das refatorações

#### reports/
Relatórios técnicos e análises
- **analysis/**: Análises de código, qualidade e performance
- **bugfixes/**: Relatórios detalhados de correções de bugs
- **implementation/**: Relatórios de implementação de features

#### archive/
Documentação arquivada ou legada
- **USAGE.md**: Guia de uso de versões antigas
- **README_SEARCH_BY_DAY.md**: Documentação antiga da busca por dia
- Documentos mantidos por referência histórica

#### workflow-automation/
*Diretório vazio reservado para futura documentação de automação*

### Arquivos de Workflow AI (.ai_workflow/)
**Nota:** Este diretório é gerenciado automaticamente por ferramentas de AI e não deve ser commitado ao Git.

**Propósito:** Armazena logs, backlogs e resumos de workflows automatizados executados por assistentes AI.

#### logs/
Logs detalhados de execução de workflows
- Cada execução cria um subdiretório: `workflow_YYYYMMDD_HHMMSS/`
- Contém logs de cada etapa do workflow
- Útil para debugging e auditoria de ações automatizadas

#### backlog/
Backlog e tarefas pendentes de workflows
- Tarefas identificadas durante workflows
- Itens para processamento futuro
- Organizado por execução de workflow

#### summaries/
Resumos consolidados de workflows executados
- Sumário de ações realizadas
- Resultados e métricas
- Documentação gerada automaticamente

**Importante:**
- Adicionado ao `.gitignore` - não fazer commit
- Gerado automaticamente durante automações
- Pode ser deletado sem impacto no projeto

## Como Começar

### API
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar em modo desenvolvimento
npm run dev

# Executar em modo produção
npm start
```

### Testes
```bash
# Todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

## Tecnologias Utilizadas
- **API**: Node.js, Express, CORS
- **Testes**: Jest, Supertest, Selenium WebDriver
- **Ferramentas**: ESLint, Nodemon, dotenv

## Arquitetura

A API segue o padrão MVC (Model-View-Controller) adaptado para APIs RESTful:
- **Models**: Representam a estrutura dos dados
- **Controllers**: Gerenciam as requisições HTTP e respostas
- **Services**: Contêm a lógica de negócio
- **Routes**: Definem os endpoints da API
- **Middlewares**: Interceptam requisições para validação, autenticação, etc.
