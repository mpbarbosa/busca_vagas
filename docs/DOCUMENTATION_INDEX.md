# Busca Vagas API - Documentation Index

Welcome to the complete documentation for the Busca Vagas API project!

## 📚 Quick Navigation

### 🏗️ Architecture Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Complete software architecture | Developers, Architects |
| **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)** | Visual diagrams and flow charts | All |
| **[ARCHITECTURE_QUICK_REFERENCE.md](./ARCHITECTURE_QUICK_REFERENCE.md)** | Quick reference guide | Developers |

### 🚀 Puppeteer Implementation

| Document | Description | Audience |
|----------|-------------|----------|
| **[PUPPETEER_README.md](./PUPPETEER_README.md)** | Quick start guide | Developers |
| **[PUPPETEER_SUMMARY.md](./PUPPETEER_SUMMARY.md)** | Implementation details | Developers, DevOps |
| **[PUPPETEER_MIGRATION.md](./PUPPETEER_MIGRATION.md)** | Migration from Selenium | DevOps, Developers |
| **[PUPPETEER_VS_SELENIUM.md](./PUPPETEER_VS_SELENIUM.md)** | Detailed comparison | Decision Makers |
| **[PUPPETEER_TESTS.md](./PUPPETEER_TESTS.md)** | Test suite documentation | QA, Developers |

### 🧪 Testing & Validation

| Document | Description | Audience |
|----------|-------------|----------|
| **[PRODUCTION_ENVIRONMENT_VALIDATION.md](./PRODUCTION_ENVIRONMENT_VALIDATION.md)** | Complete validation guide | DevOps, QA |
| **[VALIDATION_QUICK_REFERENCE.md](./VALIDATION_QUICK_REFERENCE.md)** | Quick validation reference | All |
| **[TEST_SUITE_IMPLEMENTATION_SUMMARY.md](./TEST_SUITE_IMPLEMENTATION_SUMMARY.md)** | Implementation overview | Developers |

### 📖 API & Usage

| Document | Description | Audience |
|----------|-------------|----------|
| **[API_CLIENT_DOCUMENTATION.md](./API_CLIENT_DOCUMENTATION.md)** | **Comprehensive API client guide** | **API Consumers, Developers** |
| **[DATA_FLOW_DOCUMENTATION.md](./DATA_FLOW_DOCUMENTATION.md)** | **Complete data flow explanation** | **Developers, Architects** |
| **[API.md](./API.md)** | API reference documentation | API Consumers |
| **[USAGE.md](../USAGE.md)** | Usage examples | All |
| **[README.md](../README.md)** | Project overview | All |

### 🔧 Project Information

| Document | Description | Audience |
|----------|-------------|----------|
| **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** | Detailed project layout | Developers |
| **[PUPPETEER_IMPLEMENTATION.md](../PUPPETEER_IMPLEMENTATION.md)** | Implementation summary | All |

### 🛠️ Technical Fixes & Troubleshooting

| Document | Description | Audience |
|----------|-------------|----------|
| **[NODE_V25_JSON_IMPORT_FIX.md](./NODE_V25_JSON_IMPORT_FIX.md)** | Node.js v25+ JSON import fix | Developers, DevOps |
| **[FIX_ES_MODULE.md](./FIX_ES_MODULE.md)** | ES Module compatibility fix | Developers |

### 🚀 Deployment & Operations

| Document | Description | Audience |
|----------|-------------|----------|
| **[SYSTEMD_SERVICE.md](./SYSTEMD_SERVICE.md)** | Systemd service setup and management | DevOps, SysAdmins |
| **[DEPLOYMENT_SCRIPT.md](./DEPLOYMENT_SCRIPT.md)** | Deployment script usage and reference | DevOps, SysAdmins |

## 🎯 Getting Started Guides

### For New Developers

1. Start with [README.md](../README.md) - Project overview
2. Review [ARCHITECTURE_QUICK_REFERENCE.md](./ARCHITECTURE_QUICK_REFERENCE.md) - Quick architecture overview
3. Understand [DATA_FLOW_DOCUMENTATION.md](./DATA_FLOW_DOCUMENTATION.md) - How data flows through the system
4. Read [PUPPETEER_README.md](./PUPPETEER_README.md) - How to use the optimized implementation
5. Check [API.md](./API.md) - Available endpoints
6. Validate environment: [VALIDATION_QUICK_REFERENCE.md](./VALIDATION_QUICK_REFERENCE.md) - Quick setup validation

### For Architects

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture
2. Study [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md) - Visual representations
3. Review [PUPPETEER_VS_SELENIUM.md](./PUPPETEER_VS_SELENIUM.md) - Technology decisions

### For DevOps/Operations

1. Check [PUPPETEER_MIGRATION.md](./PUPPETEER_MIGRATION.md) - Deployment guide
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - Section: "Deployment Architecture"
3. Study [PUPPETEER_SUMMARY.md](./PUPPETEER_SUMMARY.md) - Performance metrics
4. Validate production: [PRODUCTION_ENVIRONMENT_VALIDATION.md](./PRODUCTION_ENVIRONMENT_VALIDATION.md) - Complete validation suite

### For API Consumers

1. **Start with [API_CLIENT_DOCUMENTATION.md](./API_CLIENT_DOCUMENTATION.md) - Complete client guide**
2. Check [API.md](./API.md) - API reference
3. Review [USAGE.md](../USAGE.md) - Usage examples
4. Study [PUPPETEER_README.md](./PUPPETEER_README.md) - Technical details

## 📊 Key Information

### Architecture at a Glance

- **Type:** RESTful API
- **Framework:** Express.js 4.18.2
- **Runtime:** Node.js 18+
- **Pattern:** Layered architecture (MVC-inspired)
- **Version:** 1.2.0

### Performance Metrics

| Metric | Selenium (Legacy) | Puppeteer (New) | Improvement |
|--------|-------------------|-----------------|-------------|
| Memory | 420 MB | 180 MB | **57% less** |
| CPU | 45% | 22% | **51% less** |
| Speed | 6.8s | 3.2s | **53% faster** |
| Cost | $30.37/mo | $15.18/mo | **50% savings** |

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/vagas/search` - Search vacancies (Puppeteer)
- `GET /api/vagas/search/weekends` - Weekend search (Puppeteer)
- `GET /api/vagas/search/selenium` - Search vacancies (Legacy)

## 🔍 Find What You Need

### I want to...

#### Understand the architecture
→ Read [ARCHITECTURE.md](./ARCHITECTURE.md)

#### Understand the data flow
→ Read [DATA_FLOW_DOCUMENTATION.md](./DATA_FLOW_DOCUMENTATION.md)

#### See visual diagrams
→ Check [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)

#### Get started quickly
→ Follow [PUPPETEER_README.md](./PUPPETEER_README.md)

#### Use the API
→ Review **[API_CLIENT_DOCUMENTATION.md](./API_CLIENT_DOCUMENTATION.md)** (comprehensive guide)  
→ Or check [API.md](./API.md) (quick reference)

#### Deploy to production
→ Study [PUPPETEER_MIGRATION.md](./PUPPETEER_MIGRATION.md)

#### Compare Selenium vs Puppeteer
→ Read [PUPPETEER_VS_SELENIUM.md](./PUPPETEER_VS_SELENIUM.md)

#### Understand project structure
→ Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

#### Validate production environment
→ Run [PRODUCTION_ENVIRONMENT_VALIDATION.md](./PRODUCTION_ENVIRONMENT_VALIDATION.md)

#### Quick validation reference
→ Check [VALIDATION_QUICK_REFERENCE.md](./VALIDATION_QUICK_REFERENCE.md)

#### Fix Node.js v25+ JSON import errors
→ Read [NODE_V25_JSON_IMPORT_FIX.md](./NODE_V25_JSON_IMPORT_FIX.md)

#### Set up systemd service
→ Follow [SYSTEMD_SERVICE.md](./SYSTEMD_SERVICE.md)

## 📖 Documentation by Topic

### Architecture
- [Complete Architecture](./ARCHITECTURE.md)
- [Visual Diagrams](./ARCHITECTURE_DIAGRAMS.md)
- [Quick Reference](./ARCHITECTURE_QUICK_REFERENCE.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

### Implementation
- [Puppeteer Quick Start](./PUPPETEER_README.md)
- [Implementation Summary](./PUPPETEER_SUMMARY.md)
- [Migration Guide](./PUPPETEER_MIGRATION.md)
- [Comparison](./PUPPETEER_VS_SELENIUM.md)

### Testing & Validation
- [Production Environment Validation](./PRODUCTION_ENVIRONMENT_VALIDATION.md)
- [Validation Quick Reference](./VALIDATION_QUICK_REFERENCE.md)
- [Test Suite Implementation](./TEST_SUITE_IMPLEMENTATION_SUMMARY.md)
- [Puppeteer Tests](./PUPPETEER_TESTS.md)

### Usage
- **[API Client Documentation](./API_CLIENT_DOCUMENTATION.md)** (comprehensive guide)
- **[Data Flow Documentation](./DATA_FLOW_DOCUMENTATION.md)** (request-to-response flow)
- [API Reference](./API.md) (quick reference)
- [Usage Examples](../USAGE.md)
- [README](../README.md)

### Performance
- [Puppeteer vs Selenium](./PUPPETEER_VS_SELENIUM.md)
- [Architecture - Performance Section](./ARCHITECTURE.md#performance-optimization)

### Deployment
- [Migration Guide](./PUPPETEER_MIGRATION.md)
- [Architecture - Deployment Section](./ARCHITECTURE.md#deployment-architecture)

## 🎓 Learning Path

### Beginner Level
1. Read [README.md](../README.md)
2. Study **[API_CLIENT_DOCUMENTATION.md](./API_CLIENT_DOCUMENTATION.md)** - Complete API guide
3. Try examples in [USAGE.md](../USAGE.md)

### Intermediate Level
1. Review [ARCHITECTURE_QUICK_REFERENCE.md](./ARCHITECTURE_QUICK_REFERENCE.md)
2. Study [PUPPETEER_README.md](./PUPPETEER_README.md)
3. Understand [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### Advanced Level
1. Deep dive into [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Analyze [ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)
3. Compare [PUPPETEER_VS_SELENIUM.md](./PUPPETEER_VS_SELENIUM.md)
4. Study [PUPPETEER_MIGRATION.md](./PUPPETEER_MIGRATION.md)

## 🔗 External Resources

- [Express.js Documentation](https://expressjs.com/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [REST API Design Best Practices](https://restfulapi.net/)

## 📝 Document Versions

All documents are version 1.2.0 unless otherwise specified.
Last updated: 2025-12-01

## 💬 Need Help?

1. Check the relevant documentation above
2. Review code examples in the repository
3. Open an issue on GitHub
4. Contact the development team

---

**Navigation:**  
[← Back to README](../README.md) | [Architecture →](./ARCHITECTURE.md) | [API Reference →](./API.md)
