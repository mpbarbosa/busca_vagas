// Global test setup for ES modules
// Note: console mocks removed to avoid jest undefined errors in ES module context

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 3001;
process.env.HOTEL_CACHE_TTL = '3600000';

