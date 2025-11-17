# Busca Vagas

Aplicação web para busca de vagas em hotéis de sindicatos.

## 📋 Descrição

Sistema web desenvolvido para facilitar a busca e o gerenciamento de vagas de emprego em hotéis vinculados a sindicatos.

## 🚀 Tecnologias

### Backend
- Node.js
- Express.js
- dotenv (gerenciamento de variáveis de ambiente)

### Frontend
- React
- React Router
- Axios
- HTML5
- CSS3
- JavaScript (ES6+)

### Testes
- Jest (testes unitários e de integração)
- Selenium WebDriver (testes E2E)
- Supertest (testes de API)

## 📁 Estrutura do Projeto

```
busca_vagas/
├── client/              # Frontend React
│   ├── public/         # Arquivos estáticos
│   └── src/            # Código fonte
│       ├── components/ # Componentes React
│       ├── pages/      # Páginas
│       ├── services/   # Serviços API
│       ├── styles/     # Estilos CSS
│       └── utils/      # Utilitários
├── src/                # Backend Node.js/Express
│   ├── config/        # Configurações
│   ├── controllers/   # Controllers
│   ├── models/        # Modelos
│   ├── routes/        # Rotas
│   ├── middlewares/   # Middlewares
│   ├── services/      # Serviços
│   └── utils/         # Utilitários
├── tests/             # Testes
│   ├── unit/         # Testes unitários
│   ├── integration/  # Testes de integração
│   └── e2e/          # Testes E2E
├── scripts/          # Scripts auxiliares
└── docs/             # Documentação
```

Para mais detalhes sobre a estrutura, consulte [docs/STRUCTURE.md](docs/STRUCTURE.md).

## 🔧 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/mpbarbosa/busca_vagas.git
cd busca_vagas

# Execute o script de configuração
./scripts/setup.sh

# Ou instale manualmente:
npm install
cd client && npm install && cd ..
```

### Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente conforme necessário

## 🏃 Execução

### Backend
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### Frontend
```bash
# Em um terminal separado
npm run client
```

### Ambos simultaneamente
```bash
npm run dev:all
```

O backend estará disponível em `http://localhost:3000`
O frontend estará disponível em `http://localhost:3001`

## 🧪 Testes

```bash
# Todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Ou use o script
./scripts/test.sh
```

## 📚 Documentação

- [Estrutura do Projeto](docs/STRUCTURE.md)
- [Documentação da API](docs/API.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](LICENSE).
