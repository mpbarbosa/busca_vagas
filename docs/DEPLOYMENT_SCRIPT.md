# Deployment Script Documentation

## Overview

`deploy.sh` is a comprehensive shell script that automates the deployment and management of the Busca Vagas API as a systemd service on Linux systems.

## Location

```
shell_scripts/deploy.sh
```

## Features

### ✅ Automated Validation
- Node.js version check (requires v18+)
- npm installation verification
- Project dependencies validation
- Service file existence and configuration checks
- Path validation

### 🚀 Service Management
- Install/uninstall systemd service
- Start/stop/restart service
- View real-time or historical logs
- Enable/disable auto-start on boot
- Check service status

### 🎨 User-Friendly Interface
- Color-coded output (info, success, warning, error)
- Clear section headers
- Detailed error messages
- Helpful command examples

### 🛡️ Safety Features
- Prevents running as root (uses sudo when needed)
- Validates before deployment
- Confirms service state after operations
- Comprehensive error handling

## Usage

### Basic Commands

```bash
# Show help and available commands
./deploy.sh help

# Validate environment before deployment
./deploy.sh validate

# Install the systemd service
./deploy.sh install

# Start the service
./deploy.sh start

# Check service status
./deploy.sh status

# View logs (last 50 lines)
./deploy.sh logs

# Follow logs in real-time
./deploy.sh logs -f

# View last 100 log lines
./deploy.sh logs -n 100

# Stop the service
./deploy.sh stop

# Restart the service
./deploy.sh restart

# Reload daemon and restart (for code updates)
./deploy.sh reload

# Enable auto-start on boot
./deploy.sh enable

# Disable auto-start
./deploy.sh disable

# Test application manually (without systemd)
./deploy.sh test

# Uninstall the service
./deploy.sh uninstall
```

## Full Deployment Workflow

### First-Time Deployment

```bash
# Step 1: Validate environment
cd /path/to/busca_vagas
./shell_scripts/deploy.sh validate

# Step 2: Install the service
./shell_scripts/deploy.sh install

# Step 3: Start the service
./shell_scripts/deploy.sh start

# Step 4: Check if running correctly
./shell_scripts/deploy.sh status

# Step 5: Enable auto-start on boot
./shell_scripts/deploy.sh enable

# Step 6: Verify logs
./shell_scripts/deploy.sh logs
```

### Updating the Application

```bash
# Step 1: Pull latest changes
git pull origin main

# Step 2: Install dependencies (if updated)
npm install

# Step 3: Reload daemon and restart with new code
./shell_scripts/deploy.sh reload

# Step 4: Verify it's running
./shell_scripts/deploy.sh status

# Step 5: Check logs for errors
./shell_scripts/deploy.sh logs -n 50
```

**Note**: The `reload` command performs `systemctl daemon-reload` before restarting, ensuring systemd recognizes any configuration changes.

### Troubleshooting

```bash
# Check detailed status
./shell_scripts/deploy.sh status

# View recent logs
./shell_scripts/deploy.sh logs -n 100

# Follow logs in real-time
./shell_scripts/deploy.sh logs -f

# Test manually without systemd
./shell_scripts/deploy.sh test
```

## Command Reference

### install

Installs the systemd service.

**What it does:**
1. Runs all validations
2. Copies service file to `/etc/systemd/system/`
3. Reloads systemd daemon
4. Provides next steps

**Requirements:**
- sudo privileges
- Valid service file in `config/`
- Node.js 18+ installed
- npm installed
- Dependencies installed

**Example:**
```bash
./deploy.sh install
```

### start

Starts the systemd service.

**What it does:**
1. Starts the service
2. Waits 2 seconds
3. Verifies service is running
4. Shows status

**Requirements:**
- sudo privileges
- Service must be installed

**Example:**
```bash
./deploy.sh start
```

### stop

Stops the systemd service.

**What it does:**
1. Stops the service
2. Waits 1 second
3. Verifies service stopped

**Requirements:**
- sudo privileges
- Service must be installed

**Example:**
```bash
./deploy.sh stop
```

### restart

Restarts the systemd service.

**What it does:**
1. Restarts the service
2. Waits 2 seconds
3. Verifies service is running
4. Shows status

**Requirements:**
- sudo privileges
- Service must be installed

**Use when:**
- Service just needs a restart (no code changes)

**Example:**
```bash
./deploy.sh restart
```

### reload

Reloads systemd daemon and restarts the service (for code updates).

**What it does:**
1. Runs `systemctl daemon-reload`
2. Restarts the service
3. Waits 2 seconds
4. Verifies service is running
5. Shows status

**Requirements:**
- sudo privileges
- Service must be installed

**Use when:**
- Deploying new code
- Configuration files changed
- Dependencies updated

**Example:**
```bash
./deploy.sh reload
```

**Note**: This is the recommended command for deploying code updates.

### status

Shows current service status.

**What it does:**
1. Displays systemd service status
2. Shows if running/stopped
3. Shows if enabled/disabled

**Requirements:**
- Service must be installed

**Example:**
```bash
./deploy.sh status
```

### logs

Views service logs from systemd journal.

**Options:**
- `-f, --follow` - Follow logs in real-time
- `-n, --lines <number>` - Number of lines to show (default: 50)

**Examples:**
```bash
./deploy.sh logs              # Last 50 lines
./deploy.sh logs -n 100       # Last 100 lines
./deploy.sh logs -f           # Follow in real-time
./deploy.sh logs -n 200 -f    # Last 200 lines + follow
```

### enable

Enables the service to start automatically on boot.

**What it does:**
1. Enables systemd service
2. Service will start on system boot

**Requirements:**
- sudo privileges
- Service must be installed

**Example:**
```bash
./deploy.sh enable
```

### disable

Disables automatic service start on boot.

**What it does:**
1. Disables systemd service
2. Service won't start on system boot
3. Service can still be started manually

**Requirements:**
- sudo privileges
- Service must be installed

**Example:**
```bash
./deploy.sh disable
```

### uninstall

Completely removes the systemd service.

**What it does:**
1. Stops the service (if running)
2. Disables the service (if enabled)
3. Removes service file from `/etc/systemd/system/`
4. Reloads systemd daemon

**Requirements:**
- sudo privileges

**Example:**
```bash
./deploy.sh uninstall
```

### validate

Validates the deployment environment.

**What it validates:**
1. Node.js installation and version (18+)
2. npm installation
3. Project dependencies
4. Service file existence
5. Service file configuration
6. Server file existence (`src/server.js`)

**Example:**
```bash
./deploy.sh validate
```

### test

Tests the application manually without systemd.

**What it does:**
1. Validates environment
2. Starts the server directly with Node.js
3. Uses production environment
4. Runs on port 3005 (or custom PORT)

**Use case:**
- Testing before systemd deployment
- Troubleshooting service issues
- Development testing

**Example:**
```bash
./deploy.sh test

# With custom port
PORT=8080 ./deploy.sh test
```

## Script Architecture

### File Structure

```bash
deploy.sh
├── Configuration Variables
│   ├── Paths (PROJECT_ROOT, SERVICE_FILE, etc.)
│   ├── Service name
│   └── Color codes
├── Utility Functions
│   ├── print_info()
│   ├── print_success()
│   ├── print_warning()
│   ├── print_error()
│   ├── print_section()
│   ├── check_root()
│   └── require_sudo()
├── Validation Functions
│   ├── validate_node()
│   ├── validate_npm()
│   ├── validate_dependencies()
│   ├── validate_service_file()
│   ├── validate_service_config()
│   └── validate_all()
├── Service Management Functions
│   ├── install_service()
│   ├── start_service()
│   ├── stop_service()
│   ├── restart_service()
│   ├── show_status()
│   ├── view_logs()
│   ├── enable_service()
│   ├── disable_service()
│   ├── uninstall_service()
│   └── test_application()
├── Help Function
│   └── show_help()
└── Main Logic
    └── main()
```

### Error Handling

The script uses `set -euo pipefail` for strict error handling:
- `-e` - Exit on error
- `-u` - Exit on undefined variable
- `-o pipefail` - Catch errors in pipes

### Color Coding

- 🔵 **Blue (INFO)** - Informational messages
- 🟢 **Green (SUCCESS)** - Successful operations
- 🟡 **Yellow (WARNING)** - Warnings
- 🔴 **Red (ERROR)** - Errors

## Exit Codes

- `0` - Success
- `1` - General error (validation failed, command failed, etc.)

## Requirements

### System Requirements
- Linux with systemd
- Bash 4.0+
- sudo privileges

### Application Requirements
- Node.js 18+
- npm
- Git (for updates)

## Troubleshooting

### Common Issues

#### "This script should not be run as root"
**Cause:** Script was executed with sudo

**Solution:** Run without sudo:
```bash
./deploy.sh install  # Correct
sudo ./deploy.sh install  # Wrong
```

#### "Validation failed"
**Cause:** Environment doesn't meet requirements

**Solution:** Run validation to see specific issues:
```bash
./deploy.sh validate
```

#### "Service failed to start"
**Cause:** Various (port conflict, configuration error, etc.)

**Solution:** Check logs:
```bash
./deploy.sh logs -n 50
```

#### "WorkingDirectory doesn't match current path"
**Cause:** Service file has hard-coded path from different installation

**Solution:** Update service file in `config/busca_vagas_node_app.service`:
```ini
WorkingDirectory=/your/current/path
ExecStart=/usr/bin/node /your/current/path/src/server.js
```

## Best Practices

### Before Deployment
1. Always run `validate` before `install`
2. Test with `test` command first
3. Review service file configuration

### During Deployment
1. Follow the full deployment workflow
2. Check status after each operation
3. Monitor logs for errors

### After Deployment
1. Enable auto-start for production
2. Set up monitoring/alerting
3. Configure log rotation

### Updates
1. Always backup before updating
2. Test in development first
3. Use `restart` instead of `stop`/`start`

## Integration with CI/CD

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to production
        run: |
          ssh user@server << 'EOF'
            cd /path/to/busca_vagas
            git pull origin main
            npm install
            ./shell_scripts/deploy.sh validate
            ./shell_scripts/deploy.sh restart
            ./shell_scripts/deploy.sh status
          EOF
```

## See Also

- [SYSTEMD_SERVICE.md](./SYSTEMD_SERVICE.md) - Systemd service documentation
- [Main README](../README.md) - Project overview
- [config/README.md](../config/README.md) - Service file configuration

## Contributing

When modifying the script:
1. Test all commands
2. Validate bash syntax: `bash -n deploy.sh`
3. Update this documentation
4. Follow existing code style
5. Add comments for complex logic

## Version History

- **1.0.0** (2025-12-02) - Initial release
  - Full service management
  - Comprehensive validation
  - User-friendly interface
  - Detailed documentation
