# Estrutura do Projeto

## Visão Geral
Este projeto segue uma estrutura padrão para aplicações web desenvolvidas com Node.js, Express, React e Selenium.

## Estrutura de Diretórios

```
busca_vagas/
├── client/                 # Frontend React
│   ├── public/            # Arquivos estáticos
│   │   └── index.html     # HTML principal
│   ├── src/               # Código fonte React
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas/views
│   │   ├── services/      # Serviços para chamadas API
│   │   ├── styles/        # Arquivos CSS
│   │   ├── utils/         # Funções utilitárias
│   │   ├── App.js         # Componente principal
│   │   └── index.js       # Entry point React
│   └── package.json       # Dependências do frontend
│
├── src/                   # Backend Node.js/Express
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
├── scripts/             # Scripts de build/deploy
├── docs/                # Documentação
│   └── STRUCTURE.md     # Este arquivo
│
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── jest.config.js      # Configuração do Jest
├── package.json        # Dependências do projeto
├── LICENSE             # Licença do projeto
└── README.md           # Documentação principal
```

## Convenções

### Backend (src/)
- **config/**: Arquivos de configuração (banco de dados, servidor, etc.)
- **controllers/**: Implementação da lógica de cada rota
- **models/**: Definição de modelos/schemas de dados
- **routes/**: Definição de endpoints da API
- **middlewares/**: Funções intermediárias (autenticação, validação, etc.)
- **services/**: Lógica de negócio complexa
- **utils/**: Funções auxiliares reutilizáveis

### Frontend (client/)
- **components/**: Componentes React reutilizáveis
- **pages/**: Componentes de página/view
- **services/**: Comunicação com API backend
- **styles/**: Arquivos CSS/SCSS
- **utils/**: Funções auxiliares do frontend

### Testes (tests/)
- **unit/**: Testes de funções e classes isoladas
- **integration/**: Testes de integração entre componentes
- **e2e/**: Testes de ponta a ponta com Selenium

## Como Começar

### Backend
```bash
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
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
- **Backend**: Node.js, Express
- **Frontend**: React, HTML, CSS, JavaScript
- **Testes**: Jest, Selenium WebDriver
- **Ferramentas**: ESLint, Nodemon
