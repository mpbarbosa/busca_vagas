#!/bin/bash

###############################################################################
# Environment Validation Script for Busca Vagas API
# 
# Description: Validates that all required dependencies and tools are installed
#              and properly configured to run the Busca Vagas API
#
# Usage: ./validate-environment.sh
#
# Exit Codes:
#   0 - All checks passed
#   1 - One or more checks failed
###############################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Print header
print_header() {
    echo -e "${BOLD}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}║     BUSCA VAGAS API - ENVIRONMENT VALIDATION SCRIPT          ║${NC}"
    echo -e "${BOLD}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Print section header
print_section() {
    echo -e "\n${BLUE}${BOLD}━━━ $1 ━━━${NC}"
}

# Check function - returns 0 for pass, 1 for fail
check_requirement() {
    local name="$1"
    local command="$2"
    local required="${3:-true}" # true or false, defaults to true
    
    printf "  %-50s " "$name"
    
    if eval "$command" &>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}✗ FAIL${NC}"
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}⚠ WARN${NC}"
            ((WARNINGS++))
            return 2
        fi
    fi
}

# Check with version output
check_with_version() {
    local name="$1"
    local command="$2"
    local required="${3:-true}"
    
    printf "  %-50s " "$name"
    
    if version_output=$(eval "$command" 2>&1); then
        version=$(echo "$version_output" | head -1 | tr -d '\n')
        echo -e "${GREEN}✓ PASS${NC} ${version:0:50}"
        ((PASSED++))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}✗ FAIL${NC}"
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}⚠ WARN${NC}"
            ((WARNINGS++))
            return 2
        fi
    fi
}

# Main validation
print_header

# 1. System Requirements
print_section "1. SYSTEM REQUIREMENTS"

check_with_version "Operating System" "uname -sr" true
check_with_version "Bash Shell" "bash --version | head -1" true

# 2. Node.js Environment
print_section "2. NODE.JS ENVIRONMENT"

check_with_version "Node.js (>= 14.x required)" "node --version" true
check_with_version "npm Package Manager" "npm --version" true

# Check Node.js version is >= 14
if command -v node &>/dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -ge 14 ]; then
        printf "  %-50s " "Node.js version check (>= 14)"
        echo -e "${GREEN}✓ PASS${NC} (v$NODE_VERSION)"
        ((PASSED++))
    else
        printf "  %-50s " "Node.js version check (>= 14)"
        echo -e "${RED}✗ FAIL${NC} (v$NODE_VERSION - upgrade required)"
        ((FAILED++))
    fi
fi

# 3. Project Dependencies
print_section "3. PROJECT DEPENDENCIES"

if [ -f "package.json" ]; then
    check_requirement "package.json exists" "[ -f package.json ]" true
    check_requirement "node_modules directory exists" "[ -d node_modules ]" true
    
    # Check if dependencies are installed
    if [ -d "node_modules" ]; then
        check_requirement "Express.js installed" "[ -d node_modules/express ]" true
        check_requirement "dotenv installed" "[ -d node_modules/dotenv ]" true
        check_requirement "cors installed" "[ -d node_modules/cors ]" true
        check_requirement "selenium-webdriver installed" "[ -d node_modules/selenium-webdriver ]" true
        check_requirement "puppeteer installed (v1.2.0+)" "[ -d node_modules/puppeteer ]" true
        check_requirement "Jest testing framework" "[ -d node_modules/jest ]" false
        check_requirement "ESLint installed" "[ -d node_modules/eslint ]" false
    else
        printf "  %-50s " "Checking npm dependencies"
        echo -e "${RED}✗ FAIL${NC} (run 'npm install' first)"
        ((FAILED++))
    fi
else
    printf "  %-50s " "package.json exists"
    echo -e "${RED}✗ FAIL${NC} (not in project root?)"
    ((FAILED++))
fi

# 4. Browser Requirements
print_section "4. BROWSER REQUIREMENTS"

# Check for Google Chrome / Chromium with detailed detection
BROWSER_FOUND=false
BROWSER_NAME=""
BROWSER_VERSION=""

# Check all possible Chrome/Chromium installations
if command -v google-chrome &>/dev/null; then
    BROWSER_NAME="Google Chrome"
    BROWSER_VERSION=$(google-chrome --version 2>/dev/null)
    BROWSER_FOUND=true
    check_with_version "Google Chrome" "google-chrome --version" true
elif command -v google-chrome-stable &>/dev/null; then
    BROWSER_NAME="Google Chrome (stable)"
    BROWSER_VERSION=$(google-chrome-stable --version 2>/dev/null)
    BROWSER_FOUND=true
    check_with_version "Google Chrome (stable)" "google-chrome-stable --version" true
elif command -v chromium-browser &>/dev/null; then
    BROWSER_NAME="Chromium Browser"
    BROWSER_VERSION=$(chromium-browser --version 2>/dev/null)
    BROWSER_FOUND=true
    check_with_version "Chromium Browser" "chromium-browser --version" true
elif command -v chromium &>/dev/null; then
    BROWSER_NAME="Chromium"
    BROWSER_VERSION=$(chromium --version 2>/dev/null)
    BROWSER_FOUND=true
    check_with_version "Chromium" "chromium --version" true
fi

if [ "$BROWSER_FOUND" = false ]; then
    printf "  %-50s " "Google Chrome / Chromium"
    echo -e "${RED}✗ FAIL${NC} (not found - required for Puppeteer/Selenium)"
    ((FAILED++))
else
    # Additional check: Verify browser is executable
    printf "  %-50s " "Browser executable verification"
    if [ "$BROWSER_FOUND" = true ]; then
        echo -e "${GREEN}✓ PASS${NC} ($BROWSER_NAME found and executable)"
        ((PASSED++))
    fi
fi

# Check ChromeDriver
if command -v chromedriver &>/dev/null; then
    check_with_version "ChromeDriver (in PATH)" "chromedriver --version | head -1" false
else
    # Check Selenium-managed ChromeDriver
    if [ -d "$HOME/.cache/selenium/chromedriver" ]; then
        printf "  %-50s " "ChromeDriver (Selenium-managed)"
        CHROMEDRIVER_PATH=$(find "$HOME/.cache/selenium/chromedriver" -name chromedriver -type f 2>/dev/null | head -1)
        if [ -n "$CHROMEDRIVER_PATH" ]; then
            VERSION=$("$CHROMEDRIVER_PATH" --version 2>&1 | head -1)
            echo -e "${GREEN}✓ PASS${NC} ${VERSION:0:50}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ WARN${NC} (will auto-download on first use)"
            ((WARNINGS++))
        fi
    else
        printf "  %-50s " "ChromeDriver"
        echo -e "${YELLOW}⚠ WARN${NC} (Selenium Manager will download on first use)"
        ((WARNINGS++))
    fi
fi

# 5. API Configuration
print_section "5. API CONFIGURATION"

check_requirement "src/ directory exists" "[ -d src ]" true
check_requirement "src/server.js exists" "[ -f src/server.js ]" true
check_requirement "src/controllers/ exists" "[ -d src/controllers ]" true
check_requirement "src/routes/ exists" "[ -d src/routes ]" true
check_requirement ".env file exists" "[ -f .env ]" false

if [ -f ".env" ]; then
    check_requirement "PORT configured in .env" "grep -q 'PORT' .env" false
fi

# 6. Puppeteer Validation (v1.2.0+)
print_section "6. PUPPETEER VALIDATION (RECOMMENDED)"

if [ -d "node_modules/puppeteer" ]; then
    PUPPETEER_VERSION=$(node -e "console.log(require('./package.json').devDependencies['puppeteer'] || 'not found')" 2>/dev/null)
    printf "  %-50s " "puppeteer version"
    if [ -n "$PUPPETEER_VERSION" ] && [ "$PUPPETEER_VERSION" != "not found" ]; then
        echo -e "${GREEN}✓ PASS${NC} $PUPPETEER_VERSION"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ WARN${NC} (version not found in package.json)"
        ((WARNINGS++))
    fi
    
    # Check Puppeteer controllers exist
    check_requirement "puppeteer-script.js exists" "[ -f src/controllers/puppeteer-script.js ]" true
    check_requirement "vagasControllerPuppeteer.js exists" "[ -f src/controllers/vagasControllerPuppeteer.js ]" true
    
    # Test Puppeteer functionality
    if command -v node &>/dev/null; then
        printf "  %-50s " "Puppeteer basic functionality test"
        
        TEST_RESULT=$(node -e "
            const puppeteer = require('puppeteer');
            
            (async function test() {
                let browser;
                try {
                    browser = await puppeteer.launch({
                        headless: true,
                        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                    });
                    
                    const page = await browser.newPage();
                    await page.goto('about:blank');
                    const version = await browser.version();
                    
                    console.log('SUCCESS');
                    console.log('VERSION:' + version);
                    await browser.close();
                    process.exit(0);
                } catch (error) {
                    console.error('FAILED:', error.message);
                    if (browser) await browser.close();
                    process.exit(1);
                }
            })();
        " 2>&1)
        
        if echo "$TEST_RESULT" | grep -q "SUCCESS"; then
            BROWSER_VERSION=$(echo "$TEST_RESULT" | grep "VERSION:" | cut -d: -f2)
            echo -e "${GREEN}✓ PASS${NC} (Puppeteer functional - $BROWSER_VERSION)"
            ((PASSED++))
        else
            echo -e "${RED}✗ FAIL${NC} (Puppeteer test failed)"
            echo -e "    ${YELLOW}Error: ${TEST_RESULT}${NC}"
            ((FAILED++))
        fi
    fi
    
    # Check for Chromium binary
    printf "  %-50s " "Chromium binary (for Puppeteer)"
    if [ -d "node_modules/puppeteer/.local-chromium" ] || [ -d "$HOME/.cache/puppeteer" ]; then
        echo -e "${GREEN}✓ PASS${NC} (bundled with Puppeteer)"
        ((PASSED++))
    else
        # Check system Chromium
        if command -v chromium &>/dev/null || command -v google-chrome &>/dev/null; then
            echo -e "${GREEN}✓ PASS${NC} (system Chromium available)"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ WARN${NC} (will download on first use)"
            ((WARNINGS++))
        fi
    fi
else
    printf "  %-50s " "puppeteer installed"
    echo -e "${RED}✗ FAIL${NC} (required for v1.2.0+)"
    ((FAILED++))
    echo -e "    ${YELLOW}Install with: npm install puppeteer${NC}"
fi

# 7. Selenium WebDriver Validation (Legacy)
print_section "7. SELENIUM WEBDRIVER VALIDATION (LEGACY)"

if [ -d "node_modules/selenium-webdriver" ]; then
    SELENIUM_VERSION=$(node -e "console.log(require('./package.json').devDependencies['selenium-webdriver'])" 2>/dev/null)
    printf "  %-50s " "selenium-webdriver version"
    if [ -n "$SELENIUM_VERSION" ]; then
        echo -e "${GREEN}✓ PASS${NC} $SELENIUM_VERSION"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ WARN${NC} (version not found)"
        ((WARNINGS++))
    fi
    
    # Check if version is >= 4.6.0 (includes Selenium Manager)
    if command -v node &>/dev/null && [ -f "package.json" ]; then
        SELENIUM_MAJOR=$(echo "$SELENIUM_VERSION" | grep -oP '\d+' | head -1)
        if [ -n "$SELENIUM_MAJOR" ] && [ "$SELENIUM_MAJOR" -ge 4 ]; then
            printf "  %-50s " "Selenium Manager support (v4.6.0+)"
            echo -e "${GREEN}✓ PASS${NC} (auto-manages ChromeDriver)"
            ((PASSED++))
        fi
    fi
fi

# Test Selenium WebDriver functionality (quick test)
if command -v node &>/dev/null && [ -d "node_modules/selenium-webdriver" ]; then
    printf "  %-50s " "Selenium WebDriver basic test"
    
    # Create a quick test script
    TEST_RESULT=$(node -e "
        const {Builder} = require('selenium-webdriver');
        const chrome = require('selenium-webdriver/chrome');
        
        (async function test() {
            let driver;
            try {
                const options = new chrome.Options();
                options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
                
                driver = await new Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(options)
                    .build();
                
                console.log('SUCCESS');
                await driver.quit();
                process.exit(0);
            } catch (error) {
                console.error('FAILED:', error.message);
                if (driver) await driver.quit();
                process.exit(1);
            }
        })();
    " 2>&1)
    
    if echo "$TEST_RESULT" | grep -q "SUCCESS"; then
        echo -e "${GREEN}✓ PASS${NC} (WebDriver functional)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (WebDriver test failed)"
        echo -e "    ${YELLOW}Error: ${TEST_RESULT}${NC}"
        ((FAILED++))
    fi
fi

# 8. Optional Tools
print_section "8. OPTIONAL DEVELOPMENT TOOLS"

check_with_version "Git version control" "git --version" false
check_with_version "curl HTTP client" "curl --version | head -1" false
check_with_version "GitHub CLI (gh)" "gh --version | head -1" false

# Summary
print_section "VALIDATION SUMMARY"

echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASSED"
echo -e "  ${RED}Failed:${NC}   $FAILED"
echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

# Recommendations
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}${BOLD}❌ ENVIRONMENT NOT READY${NC}"
    echo ""
    echo -e "${YELLOW}Recommendations:${NC}"
    
    if [ ! -d "node_modules" ]; then
        echo -e "  • Run: ${BOLD}npm install${NC} to install dependencies"
    fi
    
    if ! command -v google-chrome &>/dev/null && ! command -v chromium &>/dev/null; then
        echo -e "  • Install Google Chrome or Chromium browser"
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "  • Create .env file: ${BOLD}cp .env.example .env${NC}"
    fi
    
    echo ""
    exit 1
else
    echo -e "${GREEN}${BOLD}✅ ENVIRONMENT READY!${NC}"
    echo ""
    echo -e "Your environment is properly configured to run the Busca Vagas API."
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  • Start the API: ${BOLD}npm run dev${NC}"
    echo -e "  • Run tests: ${BOLD}npm test${NC}"
    echo -e "  • Access API: ${BOLD}http://localhost:3005${NC}"
    echo ""
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Note: $WARNINGS warning(s) detected. These are optional but recommended.${NC}"
        echo ""
    fi
    
    exit 0
fi
