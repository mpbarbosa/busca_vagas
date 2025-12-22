module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageProvider: 'v8', // Use V8 for better ES modules support
  collectCoverageFrom: [
    'src/**/*.js',
    'client/src/**/*.{js,jsx}',
    '!src/server.js',
    '!src/controllers/selenium-script.cjs',
    '!src/controllers/puppeteer-script.js',
    '!**/node_modules/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest|@jest)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
