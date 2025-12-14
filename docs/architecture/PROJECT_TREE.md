# Estrutura Completa do Projeto Busca Vagas

## Árvore de Diretórios Completa

```
busca_vagas/
│
├── .git/                          # Controle de versão Git
├── .gitignore                     # Arquivos ignorados pelo Git
├── .env.example                   # Exemplo de variáveis de ambiente
├── .eslintrc.json                 # Configuração do ESLint
├── package.json                   # Dependências do backend
├── jest.config.js                 # Configuração do Jest
├── LICENSE                        # Licença do projeto
├── README.md                      # Documentação principal
│
├── client/                        # ========== FRONTEND ==========
│   ├── package.json              # Dependências do React
│   │
│   ├── public/                   # Arquivos públicos estáticos
│   │   └── index.html           # HTML principal
│   │
│   └── src/                      # Código fonte React
│       ├── index.js             # Entry point do React
│       ├── App.js               # Componente raiz
│       │
│       ├── components/          # Componentes reutilizáveis
│       │   └── Header.js        # Exemplo: componente de cabeçalho
│       │
│       ├── pages/               # Componentes de página
│       │   └── HomePage.js      # Página inicial
│       │
│       ├── services/            # Comunicação com API
│       │   └── apiService.js    # Serviço de requisições HTTP
│       │
│       ├── styles/              # Arquivos de estilo
│       │   ├── index.css        # Estilos globais
│       │   └── App.css          # Estilos do App
│       │
│       └── utils/               # Funções utilitárias
│           └── formatters.js    # Formatadores de data, moeda, etc.
│
├── src/                          # ========== BACKEND ==========
│   ├── server.js                # Entry point do servidor
│   │
│   ├── config/                  # Configurações
│   │   ├── server.js           # Configuração do servidor
│   │   └── database.js         # Configuração do banco de dados
│   │
│   ├── controllers/             # Controladores (lógica de rotas)
│   │   └── vagasController.js  # Controller de vagas
│   │
│   ├── models/                  # Modelos de dados
│   │   └── Vaga.js             # Modelo de Vaga
│   │
│   ├── routes/                  # Definição de rotas da API
│   │   ├── index.js            # Roteador principal
│   │   └── vagasRoutes.js      # Rotas de vagas
│   │
│   ├── middlewares/             # Middlewares customizados
│   │   ├── auth.js             # Middleware de autenticação
│   │   └── validation.js       # Middleware de validação
│   │
│   ├── services/                # Lógica de negócio
│   │   └── vagasService.js     # Serviço de vagas
│   │
│   └── utils/                   # Funções utilitárias
│       └── helpers.js          # Helpers gerais
│
├── tests/                        # ========== TESTES ==========
│   ├── unit/                    # Testes unitários
│   │   ├── helpers.test.js     # Testes das funções helpers
│   │   └── vaga.test.js        # Testes do modelo Vaga
│   │
│   ├── integration/             # Testes de integração
│   │   └── vagas.test.js       # Testes das rotas de vagas
│   │
│   └── e2e/                     # Testes End-to-End
│       └── busca-vagas.test.js # Testes E2E com Selenium
│
├── scripts/                      # ========== SCRIPTS ==========
│   ├── setup.sh                 # Script de instalação
│   └── test.sh                  # Script de testes
│
├── prompts/                      # ========== WORKFLOWS ==========
│   └── tests_documentation_update_enhanced.txt  # Workflow de testes e documentação
│
└── docs/                         # ========== DOCUMENTAÇÃO ==========
    ├── STRUCTURE.md             # Documentação da estrutura
    ├── API.md                   # Documentação da API
    └── PROJECT_TREE.md          # Este arquivo
```

## Descrição dos Diretórios Principais

### 📁 Backend (src/)
Contém toda a lógica do servidor Node.js com Express.

| Diretório | Descrição |
|-----------|-----------|
| `config/` | Arquivos de configuração (servidor, banco de dados, etc.) |
| `controllers/` | Implementação da lógica de cada rota da API |
| `models/` | Definição das estruturas de dados/esquemas |
| `routes/` | Definição dos endpoints da API REST |
| `middlewares/` | Funções intermediárias (auth, validação, logs, etc.) |
| `services/` | Lógica de negócio complexa e regras |
| `utils/` | Funções auxiliares reutilizáveis |

### 📁 Frontend (client/)
Aplicação React para interface do usuário.

| Diretório | Descrição |
|-----------|-----------|
| `public/` | Arquivos estáticos (HTML, ícones, imagens) |
| `src/components/` | Componentes React reutilizáveis |
| `src/pages/` | Componentes de página/view completas |
| `src/services/` | Funções para comunicação com API backend |
| `src/styles/` | Arquivos CSS/SCSS |
| `src/utils/` | Funções auxiliares do frontend |

### 📁 Testes (tests/)
Estrutura completa de testes.

| Diretório | Descrição |
|-----------|-----------|
| `unit/` | Testes de unidades isoladas (funções, classes) |
| `integration/` | Testes de integração entre componentes |
| `e2e/` | Testes end-to-end com Selenium WebDriver |

### 📁 Outros Diretórios

| Diretório | Descrição |
|-----------|-----------|
| `scripts/` | Scripts shell para automação (setup, deploy, etc.) |
| `prompts/` | Workflows e prompts para automação de tarefas |
| `docs/` | Documentação técnica e guias |

## Arquivos de Configuração

| Arquivo | Descrição |
|---------|-----------|
| `package.json` | Dependências e scripts do backend |
| `client/package.json` | Dependências e scripts do frontend |
| `.env.example` | Template de variáveis de ambiente |
| `.eslintrc.json` | Configuração do linter de código |
| `jest.config.js` | Configuração do framework de testes |
| `.gitignore` | Arquivos ignorados pelo controle de versão |

## Fluxo de Dados

```
Cliente (Browser)
    ↓
React App (client/)
    ↓
API Service (client/src/services/)
    ↓
HTTP Request
    ↓
Express Server (src/server.js)
    ↓
Routes (src/routes/)
    ↓
Middlewares (src/middlewares/)
    ↓
Controllers (src/controllers/)
    ↓
Services (src/services/)
    ↓
Models (src/models/)
    ↓
Database (futuro)
```

## Tecnologias por Camada

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Config**: dotenv
- **HTTP**: cors

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3

### Testing
- **Unit/Integration**: Jest
- **E2E**: Selenium WebDriver
- **API Testing**: Supertest

### Development
- **Linting**: ESLint
- **Live Reload**: Nodemon
- **Concurrent Tasks**: Concurrently

## Como a Estrutura Suporta Escalabilidade

1. **Separação de Responsabilidades**: Backend e frontend completamente separados
2. **Modularização**: Cada funcionalidade em seu próprio módulo
3. **Testabilidade**: Estrutura de testes robusta em múltiplos níveis
4. **Manutenibilidade**: Código organizado e documentado
5. **Extensibilidade**: Fácil adicionar novos recursos seguindo os padrões
