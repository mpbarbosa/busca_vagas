#!/usr/bin/env node

/**
 * Puppeteer Test Runner
 * 
 * This script runs all Puppeteer-related tests with proper configuration
 * and provides detailed output.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printBanner() {
  log('\n' + '='.repeat(80), 'cyan');
  log('PUPPETEER TEST SUITE RUNNER', 'bright');
  log('='.repeat(80), 'cyan');
  log('Busca Vagas API - Comprehensive Testing', 'blue');
  log('='.repeat(80) + '\n', 'cyan');
}

function runTests(testPath, description) {
  return new Promise((resolve, reject) => {
    log(`\n▶ Running: ${description}`, 'blue');
    log('-'.repeat(80), 'cyan');
    
    const jest = spawn('npx', [
      'jest',
      testPath,
      '--verbose',
      '--testTimeout=180000'
    ], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--experimental-vm-modules'
      }
    });

    jest.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${description} - PASSED\n`, 'green');
        resolve();
      } else {
        log(`❌ ${description} - FAILED\n`, 'red');
        reject(new Error(`Tests failed with code ${code}`));
      }
    });

    jest.on('error', (error) => {
      log(`❌ Error running tests: ${error.message}\n`, 'red');
      reject(error);
    });
  });
}

async function main() {
  printBanner();
  
  const testSuites = [
    {
      path: 'tests/unit/puppeteer-controller.test.js',
      description: 'Unit Tests - Puppeteer Controller'
    },
    {
      path: 'tests/e2e/puppeteer.test.js',
      description: 'E2E Tests - Core Functionality'
    },
    {
      path: 'tests/e2e/puppeteer-business-logic.test.js',
      description: 'E2E Tests - Business Logic'
    }
  ];

  const startTime = Date.now();
  let passed = 0;
  let failed = 0;

  for (const suite of testSuites) {
    try {
      await runTests(suite.path, suite.description);
      passed++;
    } catch (error) {
      failed++;
      // Continue with other tests even if one fails
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Print summary
  log('\n' + '='.repeat(80), 'cyan');
  log('TEST SUMMARY', 'bright');
  log('='.repeat(80), 'cyan');
  log(`Total Suites: ${testSuites.length}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Duration: ${duration}s`, 'yellow');
  log('='.repeat(80) + '\n', 'cyan');

  if (failed > 0) {
    log('⚠️  Some tests failed. Please review the output above.', 'red');
    process.exit(1);
  } else {
    log('🎉 All test suites passed successfully!', 'green');
    process.exit(0);
  }
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
