# Busca Vagas API - Architecture Quick Reference

## 📋 At a Glance

| Aspect | Details |
|--------|---------|
| **Type** | RESTful API |
| **Framework** | Express.js 4.18.2 |
| **Runtime** | Node.js 18+ |
| **Language** | JavaScript (ES Modules) |
| **Architecture** | Layered (MVC-inspired) |
| **Version** | 1.1.0 |

## 🏗️ Architecture Pattern

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

## 📁 Project Structure (Simplified)

```
busca_vagas/
├── src/
│   ├── server.js              # Entry point
│   ├── routes/                # API endpoints
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── models/                # Data models
│   ├── middlewares/           # Request processors
│   └── utils/                 # Helpers
├── tests/                     # Test suites
├── docs/                      # Documentation
└── package.json               # Dependencies
```

## 🔄 Request Flow (5 Steps)

```
1. Client → HTTP Request
2. Express → Middleware Pipeline
3. Router → Controller
4. Controller → Browser Automation
5. Controller → JSON Response
```

## 🎯 Core Components

### Routes (`src/routes/`)
- Define API endpoints
- Map URLs to controllers

### Controllers (`src/controllers/`)
- Handle HTTP requests
- Validate input
- Call services
- Format responses

### Services (`src/services/`)
- Implement business logic
- Data processing
- Validation

### Browser Automation
- **Puppeteer** (Recommended): 180 MB, 3.2s
- **Selenium** (Legacy): 420 MB, 6.8s

## 🚀 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | API info |
| `/api/health` | GET | Health check |
| `/api/vagas/search` | GET | Search (Puppeteer) |
| `/api/vagas/search/weekends` | GET | Weekend search |
| `/api/vagas/search/selenium` | GET | Search (Selenium) |

## 💻 Technology Stack

### Core
- Node.js (Runtime)
- Express.js (Framework)
- ES Modules (Module system)

### Automation
- Puppeteer 24.31.0 (Recommended)
- Selenium 4.15.0 (Legacy)

### Utilities
- CORS (Cross-origin)
- dotenv (Environment)
- Jest (Testing)
- ESLint (Linting)

## 🔑 Key Design Patterns

1. **MVC** - Separation of concerns
2. **Service Layer** - Business logic isolation
3. **Repository** - Data access abstraction
4. **Singleton** - Browser pool
5. **Middleware** - Request pipeline

## 📊 Performance Metrics

| Metric | Selenium | Puppeteer | Savings |
|--------|----------|-----------|---------|
| Memory | 420 MB | 180 MB | 57% |
| CPU | 45% | 22% | 51% |
| Speed | 6.8s | 3.2s | 53% |

## 🏢 Deployment Options

### Development
```bash
npm run dev  # Nodemon
```

### Production
```bash
npm start    # Node.js
# OR
pm2 start    # PM2 process manager
```

### Cloud (Recommended)
- **AWS EC2** t3.small ($15.18/month)
- **Load Balancer** + Multiple instances
- **CloudWatch** for monitoring

## 🔐 Security Features

### Current
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling

### Planned
- ⏳ JWT authentication
- ⏳ API keys
- ⏳ Rate limiting
- ⏳ HTTPS/SSL

## 📈 Scalability Path

```
Phase 1: Single server (Current)
Phase 2: Load-balanced cluster
Phase 3: Microservices
Phase 4: Event-driven architecture
```

## 🎓 Learn More

- **Full Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Visual Diagrams:** [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)
- **API Documentation:** [API.md](./API.md)
- **Puppeteer Guide:** [PUPPETEER_README.md](./PUPPETEER_README.md)

---

**Quick Tip:** Start with [ARCHITECTURE.md](./ARCHITECTURE.md) for comprehensive details!
