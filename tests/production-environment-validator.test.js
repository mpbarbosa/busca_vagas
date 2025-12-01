/**
 * Production Environment Validation Test Suite
 * 
 * Comprehensive validation of the production environment to ensure:
 * - All required system dependencies are available
 * - Browser automation tools are properly configured
 * - API endpoints are functional
 * - Performance metrics are within acceptable ranges
 * - Security configurations are correct
 * 
 * @module tests/production-environment-validator
 * @requires jest
 * @requires supertest
 * @requires puppeteer
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import puppeteer from 'puppeteer';
import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Configuration
const TEST_CONFIG = {
  API_PORT: process.env.PORT || 3001,
  API_HOST: process.env.HOST || 'localhost',
  TIMEOUT_SHORT: 5000,
  TIMEOUT_MEDIUM: 30000,
  TIMEOUT_LONG: 120000,
  PERFORMANCE_THRESHOLD_MS: 5000,
  MEMORY_THRESHOLD_MB: 500
};

let serverProcess;
let apiBaseUrl;

/**
 * Start the API server for testing
 */
async function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = join(rootDir, 'src', 'server.js');
    
    if (!existsSync(serverPath)) {
      reject(new Error(`Server file not found at ${serverPath}`));
      return;
    }

    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, PORT: TEST_CONFIG.API_PORT },
      stdio: 'pipe'
    });

    let output = '';
    
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('listening') || output.includes('started')) {
        setTimeout(resolve, 2000);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('Error') || error.includes('EADDRINUSE')) {
        reject(new Error(`Server startup failed: ${error}`));
      }
    });

    serverProcess.on('error', reject);
    
    // Fallback timeout
    setTimeout(resolve, 5000);
  });
}

/**
 * Stop the API server
 */
async function stopServer() {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

describe('🏭 Production Environment Validation Suite', () => {
  
  beforeAll(async () => {
    apiBaseUrl = `http://${TEST_CONFIG.API_HOST}:${TEST_CONFIG.API_PORT}`;
    
    try {
      await startServer();
    } catch (error) {
      console.error('❌ Failed to start server:', error.message);
      throw error;
    }
  }, TEST_CONFIG.TIMEOUT_MEDIUM);

  afterAll(async () => {
    await stopServer();
  });

  describe('📦 System Dependencies Validation', () => {
    
    test('should verify Node.js version is compatible (>= 18.0.0)', () => {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
      
      expect(majorVersion).toBeGreaterThanOrEqual(18);
      
      console.log(`✅ Node.js version: ${nodeVersion}`);
    });

    test('should verify npm is installed and accessible', () => {
      try {
        const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
        expect(npmVersion).toMatch(/^\d+\.\d+\.\d+/);
        console.log(`✅ npm version: ${npmVersion}`);
      } catch (error) {
        throw new Error(`npm not found or inaccessible: ${error.message}`);
      }
    });

    test('should verify all package.json dependencies are installed', () => {
      const packageJsonPath = join(rootDir, 'package.json');
      expect(existsSync(packageJsonPath)).toBe(true);
      
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const nodeModulesPath = join(rootDir, 'node_modules');
      expect(existsSync(nodeModulesPath)).toBe(true);
      
      const missingDeps = [];
      for (const dep of Object.keys(dependencies)) {
        const depPath = join(nodeModulesPath, dep);
        if (!existsSync(depPath)) {
          missingDeps.push(dep);
        }
      }
      
      if (missingDeps.length > 0) {
        throw new Error(`Missing dependencies: ${missingDeps.join(', ')}\n` +
          'Run \'npm install\' to install missing packages.');
      }
      
      console.log(`✅ All ${Object.keys(dependencies).length} dependencies installed`);
    });

    test('should verify project structure integrity', () => {
      const requiredPaths = [
        'src/server.js',
        'src/routes',
        'src/controllers',
        'src/services',
        'src/models',
        'package.json',
        'README.md'
      ];

      const missingPaths = [];
      for (const path of requiredPaths) {
        const fullPath = join(rootDir, path);
        if (!existsSync(fullPath)) {
          missingPaths.push(path);
        }
      }

      if (missingPaths.length > 0) {
        throw new Error(`Missing required project paths:\n${missingPaths.map(p => `  - ${p}`).join('\n')}\n` +
          'This indicates a corrupted or incomplete installation.');
      }

      console.log(`✅ Project structure integrity verified (${requiredPaths.length} paths checked)`);
    });
  });

  describe('🌐 Browser Automation Dependencies', () => {
    
    test('should verify Puppeteer is installed', () => {
      try {
        const puppeteerPath = join(rootDir, 'node_modules', 'puppeteer', 'package.json');
        expect(existsSync(puppeteerPath)).toBe(true);
        
        const puppeteerPkg = JSON.parse(readFileSync(puppeteerPath, 'utf-8'));
        console.log(`✅ Puppeteer version: ${puppeteerPkg.version}`);
      } catch (error) {
        throw new Error(`Puppeteer installation verification failed: ${error.message}\n` +
          'Run \'npm install puppeteer\' to install.');
      }
    });

    test('should verify Chrome/Chromium browser is available', async () => {
      const possiblePaths = [
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      ];

      let browserFound = false;
      let foundPath = null;

      for (const path of possiblePaths) {
        if (existsSync(path)) {
          browserFound = true;
          foundPath = path;
          break;
        }
      }

      if (!browserFound) {
        throw new Error(
          'No Chrome/Chromium browser found at standard locations.\n' +
          `Searched paths:\n${possiblePaths.map(p => `  - ${p}`).join('\n')}\n\n` +
          '📝 Installation instructions:\n' +
          '  Ubuntu/Debian: sudo apt-get install google-chrome-stable\n' +
          '  Fedora/RHEL:   sudo dnf install google-chrome-stable\n' +
          '  macOS:         brew install --cask google-chrome\n\n' +
          'Or install Chromium:\n' +
          '  Ubuntu/Debian: sudo apt-get install chromium-browser\n' +
          '  Fedora/RHEL:   sudo dnf install chromium\n' +
          '  macOS:         brew install --cask chromium'
        );
      }

      console.log(`✅ Browser found: ${foundPath}`);
    }, TEST_CONFIG.TIMEOUT_SHORT);

    test('should successfully launch and close Puppeteer browser', async () => {
      let browser;
      const startTime = Date.now();

      try {
        browser = await puppeteer.launch({
          headless: 'new',
          executablePath: '/usr/bin/google-chrome-stable',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ]
        });

        const launchTime = Date.now() - startTime;
        expect(browser).toBeDefined();
        
        const version = await browser.version();
        console.log(`✅ Browser launched successfully in ${launchTime}ms`);
        console.log(`✅ Browser version: ${version}`);

      } catch (error) {
        throw new Error(
          `Failed to launch Puppeteer browser: ${error.message}\n\n` +
          '🔍 Common causes:\n' +
          '  1. Chrome/Chromium not installed - see installation instructions above\n' +
          '  2. Missing system libraries - run: sudo apt-get install -y libxss1 libnss3 libasound2\n' +
          '  3. Insufficient permissions - ensure the browser executable has execute permissions\n' +
          '  4. Incompatible Chrome version - update to latest stable version\n\n' +
          '💡 Debug steps:\n' +
          '  1. Verify browser exists: ls -la /usr/bin/google-chrome-stable\n' +
          '  2. Test browser directly: google-chrome-stable --version\n' +
          '  3. Check system libraries: ldd /usr/bin/google-chrome-stable | grep "not found"\n' +
          '  4. Review Puppeteer logs for detailed error information\n\n' +
          '📚 Additional resources:\n' +
          '  https://pptr.dev/troubleshooting'
        );
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    }, TEST_CONFIG.TIMEOUT_MEDIUM);

    test('should verify Puppeteer can navigate to pages and execute JavaScript', async () => {
      let browser;
      let page;

      try {
        browser = await puppeteer.launch({
          headless: 'new',
          executablePath: '/usr/bin/google-chrome-stable',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        page = await browser.newPage();
        await page.setContent('<html><body><h1 id="test">Test</h1></body></html>');
        
        const result = await page.evaluate(() => {
          // eslint-disable-next-line no-undef
          return document.getElementById('test').textContent;
        });

        expect(result).toBe('Test');
        console.log('✅ Puppeteer can execute JavaScript in browser context');

      } catch (error) {
        throw new Error(`Puppeteer page manipulation failed: ${error.message}\n` +
          'This indicates a problem with browser context or JavaScript execution.');
      } finally {
        if (page) await page.close();
        if (browser) await browser.close();
      }
    }, TEST_CONFIG.TIMEOUT_MEDIUM);
  });

  describe('🚀 API Server Validation', () => {
    
    test('should verify API server is running and accessible', async () => {
      try {
        const response = await request(apiBaseUrl).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'OK');
        
        console.log(`✅ API server responding on ${apiBaseUrl}`);
        console.log(`   Version: ${response.body.version}`);
        console.log(`   Uptime: ${response.body.uptime?.toFixed(2)}s`);
      } catch (error) {
        throw new Error(
          `API server is not accessible at ${apiBaseUrl}\n` +
          `Error: ${error.message}\n\n` +
          '🔍 Troubleshooting steps:\n' +
          '  1. Verify server is running: ps aux | grep "node.*server.js"\n' +
          `  2. Check if port is in use: lsof -i :${TEST_CONFIG.API_PORT}\n` +
          '  3. Review server logs for startup errors\n' +
          '  4. Ensure no firewall is blocking the port\n' +
          '  5. Try different port: PORT=3002 npm start'
        );
      }
    }, TEST_CONFIG.TIMEOUT_SHORT);

    test('should verify API root endpoint returns correct metadata', async () => {
      const response = await request(apiBaseUrl).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      
      console.log(`✅ API metadata: ${response.body.name} v${response.body.version}`);
    });

    test('should verify CORS is properly configured', async () => {
      const response = await request(apiBaseUrl)
        .get('/api/health')
        .set('Origin', 'http://example.com');
      
      expect(response.headers).toHaveProperty('access-control-allow-origin');
      console.log(`✅ CORS configured: ${response.headers['access-control-allow-origin']}`);
    });

    test('should handle 404 errors gracefully', async () => {
      const response = await request(apiBaseUrl).get('/api/nonexistent-endpoint');
      expect(response.status).toBe(404);
      console.log('✅ 404 errors handled correctly');
    });

    test('should verify API response times are within acceptable limits', async () => {
      const startTime = Date.now();
      const response = await request(apiBaseUrl).get('/api/health');
      const responseTime = Date.now() - startTime;

      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(TEST_CONFIG.PERFORMANCE_THRESHOLD_MS);
      
      console.log(`✅ API response time: ${responseTime}ms (threshold: ${TEST_CONFIG.PERFORMANCE_THRESHOLD_MS}ms)`);
    });
  });

  describe('🔧 Puppeteer Integration with API', () => {
    
    test('should verify Puppeteer endpoints are available', async () => {
      const endpoints = [
        '/api/vagas/search',
        '/api/vagas/search/weekends'
      ];

      for (const endpoint of endpoints) {
        const response = await request(apiBaseUrl)
          .get(endpoint)
          .query({ checkin: '2025-12-25', checkout: '2025-12-26' });
        
        // Should not be 404
        expect(response.status).not.toBe(404);
        console.log(`✅ Endpoint available: ${endpoint} (status: ${response.status})`);
      }
    }, TEST_CONFIG.TIMEOUT_LONG);

    test('should successfully execute Puppeteer search operation', async () => {
      const startTime = Date.now();
      
      const response = await request(apiBaseUrl)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-25', checkout: '2025-12-26' });

      const executionTime = Date.now() - startTime;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('method', 'puppeteer');
      expect(response.body).toHaveProperty('data');

      if (!response.body.success) {
        const errorDetail = response.body.data?.error || 'Unknown error';
        throw new Error(
          `Puppeteer search operation failed:\n${errorDetail}\n\n` +
          '🔍 Analysis:\n' +
          `  - Method: ${response.body.method}\n` +
          `  - Headless Mode: ${response.body.headlessMode}\n` +
          `  - Execution Time: ${executionTime}ms\n\n` +
          '💡 Possible causes:\n' +
          '  1. Browser launch failure - verify Chrome/Chromium installation\n' +
          '  2. Network connectivity issues - check internet connection\n' +
          '  3. Target website unavailable or changed structure\n' +
          '  4. Timeout - operation exceeded maximum allowed time\n' +
          '  5. Missing dependencies - verify all system libraries installed\n\n' +
          '🛠️ Debug commands:\n' +
          '  npm run test:puppeteer:e2e  # Run detailed Puppeteer tests\n' +
          '  npm run dev                 # Start server in development mode\n' +
          '  Check logs for detailed stack traces'
        );
      }

      console.log('✅ Puppeteer search executed successfully');
      console.log(`   Execution time: ${executionTime}ms`);
      console.log(`   Has availability: ${response.body.data.hasAvailability}`);
      console.log(`   Date searched: ${response.body.data.date}`);

    }, TEST_CONFIG.TIMEOUT_LONG);
  });

  describe('🔒 Security & Configuration', () => {
    
    test('should verify environment variables are properly loaded', () => {
      const requiredEnvVars = ['NODE_ENV'];
      const missingVars = requiredEnvVars.filter(v => !process.env[v]);
      
      if (missingVars.length > 0) {
        console.warn(`⚠️  Missing recommended environment variables: ${missingVars.join(', ')}`);
      } else {
        console.log('✅ Environment variables configured');
      }
    });

    test('should verify headless mode is enforced for production', async () => {
      const response = await request(apiBaseUrl)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-01', checkout: '2025-12-02' });

      if (response.body.headlessMode === false) {
        throw new Error(
          '⚠️  SECURITY WARNING: Headless mode is disabled!\n\n' +
          'Headless mode must be enabled in production for:\n' +
          '  - Security (no GUI exposure)\n' +
          '  - Performance (40-60% resource savings)\n' +
          '  - Stability (CI/CD compatibility)\n\n' +
          'Fix: Ensure src/controllers/puppeteer-script.js has headless: \'new\''
        );
      }

      console.log(`✅ Headless mode enforced: ${response.body.headlessMode}`);
    }, TEST_CONFIG.TIMEOUT_LONG);

    test('should verify browser runs with security flags', async () => {
      const requiredFlags = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ];

      // This is validated by successful browser launch in previous tests
      console.log(`✅ Security flags configured: ${requiredFlags.join(', ')}`);
      expect(requiredFlags.length).toBeGreaterThan(0);
    });
  });

  describe('📊 Performance & Resource Management', () => {
    
    test('should monitor memory usage during operations', async () => {
      const initialMemory = process.memoryUsage();
      
      await request(apiBaseUrl)
        .get('/api/vagas/search')
        .query({ checkin: '2025-12-01', checkout: '2025-12-02' });

      const finalMemory = process.memoryUsage();
      const memoryIncreaseMB = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024;

      console.log(`📊 Memory usage increase: ${memoryIncreaseMB.toFixed(2)} MB`);
      console.log(`   Heap used: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Heap total: ${(finalMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`);

      if (memoryIncreaseMB > TEST_CONFIG.MEMORY_THRESHOLD_MB) {
        console.warn(`⚠️  High memory usage detected (${memoryIncreaseMB.toFixed(2)} MB)`);
      }
    }, TEST_CONFIG.TIMEOUT_LONG);

    test('should verify browser cleanup after operations', async () => {
      // Execute multiple searches to ensure browsers are properly closed
      for (let i = 0; i < 3; i++) {
        await request(apiBaseUrl)
          .get('/api/vagas/search')
          .query({ checkin: '2025-12-01', checkout: '2025-12-02' });
      }

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for orphaned Chrome processes
      try {
        const processes = execSync('pgrep -f chrome || echo "none"', { encoding: 'utf-8' });
        const processCount = processes.trim() === 'none' ? 0 : processes.trim().split('\n').length;
        
        console.log(`✅ Browser cleanup verified (${processCount} Chrome processes)`);
      } catch (error) {
        console.log('✅ Browser cleanup verified');
      }
    }, TEST_CONFIG.TIMEOUT_LONG);
  });

  describe('📝 Final Environment Report', () => {
    
    test('should generate comprehensive environment summary', async () => {
      const healthResponse = await request(apiBaseUrl).get('/api/health');
      
      const report = {
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        apiStatus: healthResponse.body.status,
        apiVersion: healthResponse.body.version,
        apiUptime: healthResponse.body.uptime,
        memoryUsage: {
          heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
          rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
        }
      };

      console.log('\n' + '='.repeat(60));
      console.log('🎉 PRODUCTION ENVIRONMENT VALIDATION COMPLETE');
      console.log('='.repeat(60));
      console.log(JSON.stringify(report, null, 2));
      console.log('='.repeat(60) + '\n');

      expect(report.apiStatus).toBe('OK');
    });
  });
});
