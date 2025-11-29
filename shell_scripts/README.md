# Shell Scripts Directory

This directory contains utility shell scripts for the Busca Vagas API project.

## Available Scripts

### 📋 validate-environment.sh

**Purpose**: Validates that the development environment has all required dependencies and tools properly installed.

**Usage**:
```bash
./shell_scripts/validate-environment.sh
```

**What it checks**:

1. **System Requirements**
   - Operating System
   - Bash Shell version

2. **Node.js Environment**
   - Node.js (>= 14.x required)
   - npm Package Manager
   - Node.js version compatibility

3. **Project Dependencies**
   - package.json exists
   - node_modules installed
   - Express.js
   - dotenv
   - cors
   - selenium-webdriver
   - Jest (optional)
   - ESLint (optional)

4. **Browser Requirements**
   - Google Chrome / Chromium
   - ChromeDriver (system or Selenium-managed)

5. **API Configuration**
   - Project directory structure
   - Required source files
   - Environment configuration (.env)

6. **Selenium WebDriver**
   - Selenium version check
   - Selenium Manager support
   - Functional WebDriver test (headless)

7. **Optional Development Tools**
   - Git
   - curl
   - GitHub CLI (gh)

**Exit Codes**:
- `0` - All required checks passed (environment ready)
- `1` - One or more required checks failed

**Output Example**:
```
╔═══════════════════════════════════════════════════════════════╗
║     BUSCA VAGAS API - ENVIRONMENT VALIDATION SCRIPT          ║
╚═══════════════════════════════════════════════════════════════╝

━━━ 1. SYSTEM REQUIREMENTS ━━━
  Operating System                                   ✓ PASS
  Bash Shell                                         ✓ PASS

━━━ 2. NODE.JS ENVIRONMENT ━━━
  Node.js (>= 14.x required)                         ✓ PASS
  npm Package Manager                                ✓ PASS

...

✅ ENVIRONMENT READY!
```

## Usage Guidelines

### Making Scripts Executable

All scripts in this directory should be executable:

```bash
chmod +x shell_scripts/*.sh
```

### Running Scripts

From the project root:

```bash
# Run validation script
./shell_scripts/validate-environment.sh

# Or with bash explicitly
bash shell_scripts/validate-environment.sh
```

### Adding New Scripts

When adding new scripts to this directory:

1. Use `.sh` extension
2. Add shebang line: `#!/bin/bash`
3. Make executable: `chmod +x script-name.sh`
4. Add documentation in this README
5. Include help text in the script (`--help` flag)

## Best Practices

- **Error Handling**: Use proper exit codes (0 = success, non-zero = failure)
- **Documentation**: Include comments explaining what the script does
- **User Feedback**: Provide clear output messages (use colors for clarity)
- **Cross-platform**: Consider compatibility with different Unix-like systems
- **Testing**: Test scripts before committing

## Color Codes Used

Scripts in this directory use ANSI color codes:

- 🟢 **Green** (`\033[0;32m`) - Success/Pass
- 🔴 **Red** (`\033[0;31m`) - Error/Fail
- 🟡 **Yellow** (`\033[1;33m`) - Warning
- 🔵 **Blue** (`\033[0;34m`) - Info
- **Bold** (`\033[1m`) - Emphasis

## Integration with CI/CD

These scripts can be integrated into CI/CD pipelines:

### GitHub Actions Example

```yaml
- name: Validate Environment
  run: ./shell_scripts/validate-environment.sh
```

### Pre-commit Hook

```bash
#!/bin/bash
./shell_scripts/validate-environment.sh || exit 1
```

## Troubleshooting

### Script Permission Denied

```bash
chmod +x shell_scripts/validate-environment.sh
```

### Command Not Found

Ensure you're running from the project root:
```bash
cd /path/to/busca_vagas
./shell_scripts/validate-environment.sh
```

## Future Scripts (Planned)

- [ ] `deploy-aws.sh` - AWS deployment automation
- [ ] `run-tests.sh` - Comprehensive test runner
- [ ] `check-updates.sh` - Dependency update checker
- [ ] `backup-db.sh` - Database backup utility (when DB is added)

## Contributing

When contributing new scripts:

1. Follow the existing naming convention (`kebab-case.sh`)
2. Add comprehensive documentation
3. Test on multiple environments if possible
4. Update this README with script details
5. Ensure scripts are idempotent when possible

## License

Same license as the parent project (see root LICENSE file).
