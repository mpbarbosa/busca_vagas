# Node.js API Project Folder Structure Pattern Guide

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Folder Breakdown](#folder-breakdown)
4. [Architecture Pattern](#architecture-pattern)
5. [Best Practices](#best-practices)
6. [File Naming Conventions](#file-naming-conventions)
7. [Example Implementation](#example-implementation)

---

## Overview

This guide describes the folder structure pattern used in this Node.js RESTful API project. The structure follows industry-standard practices for building scalable, maintainable, and testable APIs using modern JavaScript (ES Modules).

**Key Principles:**
- Separation of Concerns
- Single Responsibility Principle
- Modular Design
- Testability
- Scalability

---

## Project Structure

```
busca_vagas/
├── src/                    # Application source code
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Custom middleware
│   ├── models/            # Data models
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic layer
│   ├── utils/             # Utility functions
│   └── server.js          # Application entry point
│
├── tests/                 # Test suite
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
│
├── docs/                  # Documentation
├── client/               # Example client implementation
├── scripts/              # Automation and build scripts
├── config/               # Environment-specific configs
│
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment variables template
├── .eslintrc.json        # ESLint configuration
├── .gitignore            # Git ignore rules
├── jest.config.cjs       # Jest testing configuration
├── package.json          # Project dependencies & scripts
└── README.md             # Project documentation
```

---

## Folder Breakdown

### `/src` - Source Code

The main application code directory. All production code lives here.

#### `/src/config` - Configuration

**Purpose:** Central location for application configuration settings.

**Contains:**
- Database connection settings
- Server configuration
- Third-party service configurations
- Feature flags

**Example:**
```javascript
// config/server.js
export const serverConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

// config/database.js
export const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME
};
```

**Best Practices:**
- ✅ Use environment variables for all sensitive data
- ✅ Provide sensible defaults
- ✅ Export configuration objects, not direct env access
- ❌ Never commit sensitive credentials

---

#### `/src/controllers` - Request Handlers

**Purpose:** Handle HTTP requests, validate input, and coordinate responses.

**Responsibilities:**
- Parse request data (params, query, body)
- Call appropriate services
- Handle errors and send responses
- Keep logic minimal (delegate to services)

**Example:**
```javascript
// controllers/vagasController.js
import * as vagasService from '../services/vagasService.js';

export const getVagas = async (req, res) => {
  try {
    const { filter } = req.query;
    const vagas = await vagasService.getAll(filter);
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createVaga = async (req, res) => {
  try {
    const vaga = await vagasService.create(req.body);
    res.status(201).json(vaga);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**Best Practices:**
- ✅ One controller per resource/entity
- ✅ Keep functions thin (5-15 lines ideal)
- ✅ Use try-catch for error handling
- ✅ Return appropriate HTTP status codes
- ❌ Don't put business logic here
- ❌ Don't access database directly

---

#### `/src/middlewares` - Custom Middleware

**Purpose:** Reusable functions that process requests before reaching controllers.

**Common Use Cases:**
- Authentication/Authorization
- Input validation
- Logging
- Rate limiting
- Request parsing

**Example:**
```javascript
// middlewares/auth.js
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Verify token logic
  next();
};

// middlewares/validation.js
export const validateVaga = (req, res, next) => {
  const { title, hotel } = req.body;
  if (!title || !hotel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  next();
};
```

**Best Practices:**
- ✅ One responsibility per middleware
- ✅ Call `next()` to continue the chain
- ✅ Handle errors appropriately
- ✅ Make middleware reusable
- ❌ Don't put business logic here

---

#### `/src/models` - Data Models

**Purpose:** Define data structures and schemas.

**Responsibilities:**
- Define entity structure
- Data validation rules
- Default values
- Type definitions

**Example:**
```javascript
// models/Vaga.js
export class Vaga {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title;
    this.hotel = data.hotel;
    this.checkin = data.checkin;
    this.checkout = data.checkout;
    this.price = data.price;
    this.available = data.available ?? true;
    this.createdAt = data.createdAt || new Date();
  }

  validate() {
    if (!this.title) throw new Error('Title is required');
    if (!this.hotel) throw new Error('Hotel is required');
    if (this.price < 0) throw new Error('Price must be positive');
  }
}
```

**Best Practices:**
- ✅ Use classes or object schemas
- ✅ Include validation methods
- ✅ Define default values
- ✅ Keep models independent of database
- ❌ Don't include database operations

---

#### `/src/routes` - API Route Definitions

**Purpose:** Define API endpoints and link them to controllers.

**Responsibilities:**
- Map URLs to controller functions
- Apply middleware to routes
- Group related routes
- Define HTTP methods

**Example:**
```javascript
// routes/vagasRoutes.js
import express from 'express';
import * as vagasController from '../controllers/vagasController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateVaga } from '../middlewares/validation.js';

const router = express.Router();

router.get('/vagas', vagasController.getVagas);
router.get('/vagas/:id', vagasController.getVagaById);
router.post('/vagas', authenticate, validateVaga, vagasController.createVaga);
router.put('/vagas/:id', authenticate, validateVaga, vagasController.updateVaga);
router.delete('/vagas/:id', authenticate, vagasController.deleteVaga);

export default router;
```

```javascript
// routes/index.js
import express from 'express';
import vagasRoutes from './vagasRoutes.js';
import hoteisRoutes from './hoteisRoutes.js';

const router = express.Router();

router.use('/api', vagasRoutes);
router.use('/api', hoteisRoutes);

export default router;
```

**Best Practices:**
- ✅ Group routes by resource
- ✅ Use RESTful conventions
- ✅ Apply middleware in route definitions
- ✅ Keep routes flat and readable
- ❌ Don't put logic in route files

---

#### `/src/services` - Business Logic

**Purpose:** Core business logic and data operations.

**Responsibilities:**
- Implement business rules
- Data manipulation
- Database operations
- External API calls
- Complex calculations

**Example:**
```javascript
// services/vagasService.js
import { Vaga } from '../models/Vaga.js';
import { db } from '../config/database.js';

export const getAll = async (filter) => {
  let query = 'SELECT * FROM vagas';
  
  if (filter) {
    query += ` WHERE hotel = '${filter}'`;
  }
  
  const results = await db.query(query);
  return results.map(row => new Vaga(row));
};

export const create = async (data) => {
  const vaga = new Vaga(data);
  vaga.validate();
  
  // Check business rules
  if (vaga.checkin >= vaga.checkout) {
    throw new Error('Checkout must be after checkin');
  }
  
  // Save to database
  const result = await db.insert('vagas', vaga);
  return result;
};

export const update = async (id, data) => {
  const existing = await getById(id);
  if (!existing) {
    throw new Error('Vaga not found');
  }
  
  const updated = new Vaga({ ...existing, ...data });
  updated.validate();
  
  return await db.update('vagas', id, updated);
};

export const deleteVaga = async (id) => {
  const existing = await getById(id);
  if (!existing) {
    throw new Error('Vaga not found');
  }
  
  return await db.delete('vagas', id);
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM vagas WHERE id = ?', [id]);
  return result[0] ? new Vaga(result[0]) : null;
};
```

**Best Practices:**
- ✅ One service per domain entity
- ✅ Contain all business logic
- ✅ Make functions pure when possible
- ✅ Handle errors properly
- ✅ Use async/await for async operations
- ❌ Don't handle HTTP requests directly
- ❌ Don't mix concerns

---

#### `/src/utils` - Utility Functions

**Purpose:** Reusable helper functions used across the application.

**Contains:**
- Date/time helpers
- String formatters
- Data transformers
- Common calculations
- Shared constants

**Example:**
```javascript
// utils/helpers.js
export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const calculateDuration = (checkin, checkout) => {
  const start = new Date(checkin);
  const end = new Date(checkout);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const parseQueryParams = (query) => {
  const params = {};
  for (const [key, value] of Object.entries(query)) {
    params[key] = decodeURIComponent(value);
  }
  return params;
};
```

**Best Practices:**
- ✅ Pure functions (no side effects)
- ✅ Well-documented
- ✅ Unit tested
- ✅ Generic and reusable
- ❌ Don't put business logic here
- ❌ Don't access database

---

#### `/src/server.js` - Application Entry Point

**Purpose:** Initialize and start the application.

**Responsibilities:**
- Load environment variables
- Configure Express app
- Register middleware
- Mount routes
- Start server
- Handle graceful shutdown

**Example:**
```javascript
// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { serverConfig } from './config/server.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use(routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = serverConfig.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
```

---

### `/tests` - Test Suite

Organized by test type for clarity and parallel execution.

#### `/tests/unit` - Unit Tests

**Purpose:** Test individual functions/modules in isolation.

**Example:**
```javascript
// tests/unit/vagasService.test.js
import { getAll, create } from '../../src/services/vagasService.js';

describe('VagasService', () => {
  describe('getAll', () => {
    it('should return all vagas', async () => {
      const vagas = await getAll();
      expect(Array.isArray(vagas)).toBe(true);
    });

    it('should filter by hotel', async () => {
      const vagas = await getAll('Hotel A');
      expect(vagas.every(v => v.hotel === 'Hotel A')).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a new vaga', async () => {
      const data = { title: 'Test', hotel: 'Hotel B' };
      const vaga = await create(data);
      expect(vaga.title).toBe('Test');
    });

    it('should throw error for invalid data', async () => {
      await expect(create({})).rejects.toThrow();
    });
  });
});
```

#### `/tests/integration` - Integration Tests

**Purpose:** Test API endpoints and component interactions.

**Example:**
```javascript
// tests/integration/vagas.test.js
import request from 'supertest';
import app from '../../src/server.js';

describe('Vagas API', () => {
  it('GET /api/vagas should return 200', async () => {
    const response = await request(app).get('/api/vagas');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/vagas should create vaga', async () => {
    const data = { title: 'Test Vaga', hotel: 'Hotel C' };
    const response = await request(app)
      .post('/api/vagas')
      .send(data);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Vaga');
  });
});
```

#### `/tests/e2e` - End-to-End Tests

**Purpose:** Test complete user workflows.

**Example:**
```javascript
// tests/e2e/booking-flow.test.js
import request from 'supertest';
import app from '../../src/server.js';

describe('Booking Flow E2E', () => {
  it('should complete full booking workflow', async () => {
    // 1. Get available vagas
    const vagasRes = await request(app).get('/api/vagas?available=true');
    expect(vagasRes.status).toBe(200);

    // 2. Create booking
    const vaga = vagasRes.body[0];
    const bookingRes = await request(app)
      .post('/api/bookings')
      .send({ vagaId: vaga.id });
    expect(bookingRes.status).toBe(201);

    // 3. Verify vaga is no longer available
    const checkRes = await request(app).get(`/api/vagas/${vaga.id}`);
    expect(checkRes.body.available).toBe(false);
  });
});
```

---

### `/docs` - Documentation

**Purpose:** Project documentation and guides.

**Contains:**
- API documentation
- Architecture diagrams
- Development guides
- Deployment instructions
- Change logs

---

### `/scripts` - Automation Scripts

**Purpose:** Build, deployment, and automation scripts.

**Examples:**
- Database migrations
- Test runners
- Deployment scripts
- Data seeding
- Code generation

---

## Architecture Pattern

This project follows the **Layered Architecture** pattern:

```
┌─────────────────────────────────────┐
│         Client/Browser              │
└──────────────┬──────────────────────┘
               │ HTTP Requests
┌──────────────▼──────────────────────┐
│         Routes Layer                │  ← URL mapping
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Middleware Layer               │  ← Auth, Validation
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controllers Layer              │  ← Request handling
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services Layer                │  ← Business logic
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Models Layer                 │  ← Data structures
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Database/External APIs        │
└─────────────────────────────────────┘
```

**Data Flow:**
1. **Client** sends HTTP request
2. **Routes** match URL to controller
3. **Middleware** validates/authenticates request
4. **Controller** parses request, calls service
5. **Service** executes business logic
6. **Model** validates/structures data
7. **Database** persists/retrieves data
8. Response flows back up the chain

---

## Best Practices

### General

1. **Use ES Modules** - Modern `import`/`export` syntax
2. **Async/Await** - Cleaner than promises/callbacks
3. **Error Handling** - Always use try-catch in async functions
4. **Environment Variables** - Never hardcode config
5. **Logging** - Use consistent logging throughout

### Code Organization

1. **Single Responsibility** - Each file/function does one thing
2. **DRY Principle** - Don't repeat yourself
3. **Separation of Concerns** - Keep layers independent
4. **Explicit Dependencies** - Import what you need
5. **Consistent Naming** - Use clear, descriptive names

### Testing

1. **Test Coverage** - Aim for >80% coverage
2. **Test Isolation** - Tests shouldn't depend on each other
3. **Mock External Dependencies** - Database, APIs, etc.
4. **Descriptive Names** - Test names explain what they test
5. **AAA Pattern** - Arrange, Act, Assert

### Security

1. **Input Validation** - Never trust user input
2. **Environment Variables** - For all sensitive data
3. **CORS Configuration** - Restrict origins in production
4. **Rate Limiting** - Prevent abuse
5. **Error Messages** - Don't leak sensitive info

---

## File Naming Conventions

### General Rules
- Use **camelCase** for file names
- Use **descriptive** names
- Add appropriate suffixes

### Patterns

| File Type | Pattern | Example |
|-----------|---------|---------|
| Controllers | `*Controller.js` | `vagasController.js` |
| Services | `*Service.js` | `vagasService.js` |
| Models | PascalCase | `Vaga.js`, `User.js` |
| Routes | `*Routes.js` | `vagasRoutes.js` |
| Middleware | descriptive | `auth.js`, `validation.js` |
| Utils | descriptive | `helpers.js`, `formatters.js` |
| Config | descriptive | `database.js`, `server.js` |
| Tests | `*.test.js` | `vagasService.test.js` |

---

## Example Implementation

### Creating a New Resource (Posts)

**1. Create Model**
```javascript
// src/models/Post.js
export class Post {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title;
    this.content = data.content;
    this.authorId = data.authorId;
    this.createdAt = data.createdAt || new Date();
  }

  validate() {
    if (!this.title) throw new Error('Title required');
    if (!this.content) throw new Error('Content required');
  }
}
```

**2. Create Service**
```javascript
// src/services/postsService.js
import { Post } from '../models/Post.js';

export const getAll = async () => {
  // Database query logic
  return posts.map(p => new Post(p));
};

export const create = async (data) => {
  const post = new Post(data);
  post.validate();
  // Save logic
  return post;
};
```

**3. Create Controller**
```javascript
// src/controllers/postsController.js
import * as postsService from '../services/postsService.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await postsService.getAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const post = await postsService.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

**4. Create Routes**
```javascript
// src/routes/postsRoutes.js
import express from 'express';
import * as postsController from '../controllers/postsController.js';

const router = express.Router();

router.get('/posts', postsController.getPosts);
router.post('/posts', postsController.createPost);

export default router;
```

**5. Register Routes**
```javascript
// src/routes/index.js
import postsRoutes from './postsRoutes.js';

router.use('/api', postsRoutes);
```

**6. Create Tests**
```javascript
// tests/unit/postsService.test.js
import { create } from '../../src/services/postsService.js';

describe('PostsService', () => {
  it('should create a post', async () => {
    const data = { title: 'Test', content: 'Content' };
    const post = await create(data);
    expect(post.title).toBe('Test');
  });
});
```

---

## Summary

This folder structure provides:

✅ **Scalability** - Easy to add new features
✅ **Maintainability** - Clear organization
✅ **Testability** - Isolated components
✅ **Readability** - Consistent patterns
✅ **Team Collaboration** - Clear responsibilities

**Key Takeaways:**
- Keep concerns separated
- Follow the layered architecture
- Write tests for everything
- Document complex logic
- Use consistent naming

---

## Additional Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [RESTful API Design](https://restfulapi.net/)
- [Project Documentation Index](./DOCUMENTATION_INDEX.md)

---

**Version:** 1.0.0  
**Last Updated:** 2025-12-09  
**Maintainer:** Development Team
