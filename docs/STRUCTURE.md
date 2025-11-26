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
│   │   ├── helpers.test.js
│   │   └── vaga.test.js
│   ├── integration/     # Testes de integração
│   │   └── vagas.test.js
│   └── e2e/             # Testes E2E com Selenium
│       └── busca-vagas.test.js
│
├── client/              # Cliente de exemplo (opcional)
├── scripts/             # Scripts shell de build/deploy/test
├── prompts/             # Workflows e prompts de automação
├── docs/                # Documentação da API
│   ├── API.md          # Documentação dos endpoints
│   ├── STRUCTURE.md    # Este arquivo
│   └── PROJECT_TREE.md # Árvore completa do projeto
│
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── jest.config.js      # Configuração do Jest
├── package.json        # Dependências da API
├── LICENSE             # Licença do projeto
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
