# GitHub Copilot Instructions - Busca Vagas API

## Project Overview

This is a RESTful API for managing job vacancies in union hotels. The API is built with Node.js and Express.js, following modern JavaScript practices with ES modules.

## Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Testing**: Jest, Supertest, Puppeteer
- **Code Quality**: ESLint
- **Dependencies**: CORS, dotenv

## Project Structure

```
busca_vagas/
├── src/                # API source code
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── models/        # Data models
│   ├── routes/        # API route definitions
│   ├── middlewares/   # Custom middleware
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── server.js      # Application entry point
├── tests/             # Test files
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   └── e2e/          # End-to-end tests
├── client/           # Example client
├── scripts/          # Shell scripts
├── prompts/          # Automation workflows
└── docs/             # Documentation
```

## Coding Standards

### General Guidelines

1. **ES Modules**: Always use ES module syntax (`import`/`export`, not `require`)
2. **Async/Await**: Prefer async/await over callbacks or raw promises
3. **Error Handling**: Implement proper error handling with try-catch blocks
4. **Consistent Naming**: Use camelCase for variables/functions, PascalCase for classes
5. **Comments**: Add comments for complex logic, but keep code self-documenting when possible

### API Development

- Follow RESTful conventions for endpoint design
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Implement proper status codes in responses
- Use middleware for cross-cutting concerns (auth, validation, logging)
- Keep controllers thin, put business logic in services

### Testing

- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Use descriptive test names that explain what is being tested
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies appropriately

### Code Organization

- One responsibility per file
- Export functions/classes explicitly
- Group related functionality together
- Keep files focused and reasonably sized

## Available Scripts

- `npm start` - Run in production mode
- `npm run dev` - Run with nodemon for development
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:e2e` - Run E2E tests only
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix linting issues automatically

## Environment Variables

Always use environment variables for:
- Port configuration
- API keys
- Database connections
- Feature flags
- Any environment-specific settings

Load via dotenv in the application entry point.

## API Endpoints

Main endpoints (see docs/API.md for details):
- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/vagas` - List job vacancies
- `POST /api/vagas` - Create new vacancy
- `PUT /api/vagas/:id` - Update vacancy
- `DELETE /api/vagas/:id` - Delete vacancy

## Best Practices for This Project

1. **Maintain backward compatibility** when modifying existing endpoints
2. **Validate input** before processing in controllers/services
3. **Use middleware** for request validation, authentication, and logging
4. **Keep routes clean** - delegate logic to controllers and services
5. **Write tests** for any new features or bug fixes
6. **Document changes** in relevant docs/ files
7. **Follow existing patterns** when adding new features
8. **Use consistent error handling** across all endpoints
9. **Keep dependencies minimal** - only add what's necessary
10. **Run linter** before committing changes

## When Adding New Features

1. Check existing patterns in the codebase
2. Add new routes in `src/routes/`
3. Implement controllers in `src/controllers/`
4. Put business logic in `src/services/`
5. Add appropriate tests in `tests/`
6. Update API documentation in `docs/API.md`
7. Run tests and linter before committing

## Common Patterns

### Controller Pattern
```javascript
export const getVagas = async (req, res) => {
  try {
    const vagas = await vagasService.getAll();
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Service Pattern
```javascript
export const getAll = async () => {
  // Business logic here
  return data;
};
```

### Route Pattern
```javascript
import express from 'express';
import * as controller from '../controllers/vagasController.js';

const router = express.Router();
router.get('/vagas', controller.getVagas);

export default router;
```

## Notes

- This project uses ESLint for code quality
- Jest configuration is in `jest.config.cjs` (CommonJS format for compatibility)
- The API supports CORS for cross-origin requests
- Refer to docs/ folder for detailed documentation
