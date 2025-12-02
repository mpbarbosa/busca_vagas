#!/bin/bash

################################################################################
# Busca Vagas API - Deployment Script
# 
# Description: Automates deployment and management of the Busca Vagas API 
#              as a systemd service
#
# Author: Busca Vagas Team
# Version: 1.1.0
# Date: 2025-12-02
#
# Usage: ./deploy.sh [command] [options]
#
# Commands:
#   install     - Install the systemd service
#   start       - Start the service
#   stop        - Stop the service
#   restart     - Restart the service
#   reload      - Reload systemd daemon and restart service (for new code deployment)
#   status      - Check service status
#   logs        - View service logs
#   enable      - Enable service to start on boot
#   disable     - Disable service auto-start
#   uninstall   - Remove the service completely
#   validate    - Validate configuration before deployment
#   test        - Test the application manually (without systemd)
#   help        - Show this help message
#
################################################################################

set -euo pipefail

# Script configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly SERVICE_NAME="busca_vagas_node_app.service"
readonly SERVICE_FILE="${PROJECT_ROOT}/config/${SERVICE_NAME}"
readonly SYSTEMD_DIR="/etc/systemd/system"
readonly REQUIRED_NODE_VERSION="18"

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

################################################################################
# Utility Functions
################################################################################

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}" >&2
}

print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        print_info "Run without sudo - the script will ask for sudo when needed"
        exit 1
    fi
}

# Check if running with sudo for specific commands
require_sudo() {
	echo "sudo -v"
}

################################################################################
# Validation Functions
################################################################################

# Validate Node.js installation
validate_node() {
    print_info "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        print_info "Install Node.js ${REQUIRED_NODE_VERSION}+ from https://nodejs.org/"
        return 1
    fi
    
    local node_version
    node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    
    if [[ $node_version -lt $REQUIRED_NODE_VERSION ]]; then
        print_error "Node.js version ${node_version} is too old (requires ${REQUIRED_NODE_VERSION}+)"
        return 1
    fi
    
    print_success "Node.js $(node --version) is installed"
    return 0
}

# Validate npm installation
validate_npm() {
    print_info "Checking npm installation..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        return 1
    fi
    
    print_success "npm $(npm --version) is installed"
    return 0
}

# Validate project dependencies
validate_dependencies() {
    print_info "Checking project dependencies..."
    
    if [[ ! -d "${PROJECT_ROOT}/node_modules" ]]; then
        print_warning "node_modules not found"
        print_info "Installing dependencies..."
        cd "${PROJECT_ROOT}" && npm install
    else
        print_success "Dependencies are installed"
    fi
    
    return 0
}

# Validate service file exists
validate_service_file() {
    print_info "Checking service file..."
    
    if [[ ! -f "${SERVICE_FILE}" ]]; then
        print_error "Service file not found: ${SERVICE_FILE}"
        return 1
    fi
    
    print_success "Service file exists: ${SERVICE_FILE}"
    return 0
}

# Validate service file configuration
validate_service_config() {
    print_info "Validating service configuration..."
    
    local working_dir
    working_dir=$(grep "^WorkingDirectory=" "${SERVICE_FILE}" | cut -d'=' -f2)
    
    local exec_start
    exec_start=$(grep "^ExecStart=" "${SERVICE_FILE}" | cut -d'=' -f2-)
    
    local user
    user=$(grep "^User=" "${SERVICE_FILE}" | cut -d'=' -f2)
    
    # Check if paths need updating
    if [[ "${working_dir}" != "${PROJECT_ROOT}" ]]; then
        print_warning "WorkingDirectory in service file (${working_dir}) doesn't match current path (${PROJECT_ROOT})"
        print_info "You may need to update the service file"
    fi
    
    # Check if server.js exists
    if [[ ! -f "${PROJECT_ROOT}/src/server.js" ]]; then
        print_error "Server file not found: ${PROJECT_ROOT}/src/server.js"
        return 1
    fi
    
    print_success "Service configuration validated"
    return 0
}

# Run all validations
validate_all() {
    print_section "Validating Deployment Environment"
    
    local errors=0
    
    validate_node || ((errors++))
    validate_npm || ((errors++))
    validate_dependencies || ((errors++))
    validate_service_file || ((errors++))
    validate_service_config || ((errors++))
    
    if [[ $errors -eq 0 ]]; then
        print_success "All validations passed!"
        return 0
    else
        print_error "Validation failed with ${errors} error(s)"
        return 1
    fi
}

################################################################################
# Service Management Functions
################################################################################

# Install the systemd service
install_service() {
    print_section "Installing Systemd Service"
    
    # Run validations first
    if ! validate_all; then
        print_error "Validation failed. Please fix errors before installing."
        exit 1
    fi
    
    require_sudo
    
    print_info "Copying service file to ${SYSTEMD_DIR}..."
    sudo cp "${SERVICE_FILE}" "${SYSTEMD_DIR}/${SERVICE_NAME}"
    print_success "Service file copied"
    
    print_info "Reloading systemd daemon..."
    sudo systemctl daemon-reload
    print_success "Systemd daemon reloaded"
    
    print_success "Service installed successfully!"
    print_info "Next steps:"
    echo "  1. Review configuration: sudo systemctl cat ${SERVICE_NAME}"
    echo "  2. Start the service: ./deploy.sh start"
    echo "  3. Enable auto-start: ./deploy.sh enable"
}

# Start the service
start_service() {
    print_section "Starting Service"
    
    require_sudo
    
    print_info "Starting ${SERVICE_NAME}..."
    sudo systemctl start "${SERVICE_NAME}"
    
    sleep 2
    
    if sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
        print_success "Service started successfully!"
        show_status
    else
        print_error "Service failed to start"
        print_info "Check logs with: ./deploy.sh logs"
        exit 1
    fi
}

# Stop the service
stop_service() {
    print_section "Stopping Service"
    
    require_sudo
    
    print_info "Stopping ${SERVICE_NAME}..."
    sudo systemctl stop "${SERVICE_NAME}"
    
    sleep 1
    
    if ! sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
        print_success "Service stopped successfully!"
    else
        print_warning "Service may still be running"
    fi
}

# Restart the service
restart_service() {
    print_section "Restarting Service"
    
    require_sudo
    
    print_info "Restarting ${SERVICE_NAME}..."
    sudo systemctl restart "${SERVICE_NAME}"
    
    sleep 2
    
    if sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
        print_success "Service restarted successfully!"
        show_status
    else
        print_error "Service failed to restart"
        print_info "Check logs with: ./deploy.sh logs"
        exit 1
    fi
}

# Reload systemd daemon and restart service (for new code deployment)
reload_and_restart() {
    print_section "Reloading Daemon and Restarting Service"
    
    require_sudo
    
    if [[ ! -f "${SYSTEMD_DIR}/${SERVICE_NAME}" ]]; then
        print_error "Service is not installed. Install first with: ./deploy.sh install"
        exit 1
    fi
    
    print_info "Step 1/2: Reloading systemd daemon..."
    sudo systemctl daemon-reload
    print_success "Daemon reloaded"
    
    sleep 1
    
    print_info "Step 2/2: Restarting ${SERVICE_NAME}..."
    sudo systemctl restart "${SERVICE_NAME}"
    
    sleep 2
    
    if sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
        print_success "Service restarted successfully with new code!"
        echo ""
        print_info "Deployment complete. Showing current status:"
        show_status
    else
        print_error "Service failed to restart"
        print_info "Check logs with: ./deploy.sh logs"
        exit 1
    fi
}

# Show service status
show_status() {
    print_section "Service Status"
    
    if [[ ! -f "${SYSTEMD_DIR}/${SERVICE_NAME}" ]]; then
        print_warning "Service is not installed"
        print_info "Install with: ./deploy.sh install"
        return 1
    fi
    
    sudo systemctl status "${SERVICE_NAME}" --no-pager || true
    
    echo ""
    if sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
        print_success "Service is running"
    else
        print_warning "Service is not running"
    fi
    
    if sudo systemctl is-enabled --quiet "${SERVICE_NAME}"; then
        print_info "Service is enabled (starts on boot)"
    else
        print_info "Service is disabled (won't start on boot)"
    fi
}

# View service logs
view_logs() {
    print_section "Service Logs"
    
    local lines="${1:-50}"
    local follow="${2:-false}"
    
    if [[ ! -f "${SYSTEMD_DIR}/${SERVICE_NAME}" ]]; then
        print_error "Service is not installed"
        exit 1
    fi
    
    if [[ "${follow}" == "true" ]]; then
        print_info "Following logs (Ctrl+C to exit)..."
        sudo journalctl -u "${SERVICE_NAME}" -f
    else
        print_info "Showing last ${lines} lines..."
        sudo journalctl -u "${SERVICE_NAME}" -n "${lines}" --no-pager
    fi
}

# Enable service auto-start
enable_service() {
    print_section "Enabling Service"
    
    require_sudo
    
    if [[ ! -f "${SYSTEMD_DIR}/${SERVICE_NAME}" ]]; then
        print_error "Service is not installed. Install first with: ./deploy.sh install"
        exit 1
    fi
    
    print_info "Enabling ${SERVICE_NAME}..."
    sudo systemctl enable "${SERVICE_NAME}"
    
    print_success "Service enabled - will start on boot"
}

# Disable service auto-start
disable_service() {
    print_section "Disabling Service"
    
    require_sudo
    
    print_info "Disabling ${SERVICE_NAME}..."
    sudo systemctl disable "${SERVICE_NAME}"
    
    print_success "Service disabled - won't start on boot"
}

# Uninstall the service
uninstall_service() {
    print_section "Uninstalling Service"
    
    require_sudo
    
    # Stop service if running
    if sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
        print_info "Stopping service..."
        sudo systemctl stop "${SERVICE_NAME}"
    fi
    
    # Disable service if enabled
    if sudo systemctl is-enabled --quiet "${SERVICE_NAME}" 2>/dev/null; then
        print_info "Disabling service..."
        sudo systemctl disable "${SERVICE_NAME}"
    fi
    
    # Remove service file
    if [[ -f "${SYSTEMD_DIR}/${SERVICE_NAME}" ]]; then
        print_info "Removing service file..."
        sudo rm "${SYSTEMD_DIR}/${SERVICE_NAME}"
    fi
    
    # Reload daemon
    print_info "Reloading systemd daemon..."
    sudo systemctl daemon-reload
    
    print_success "Service uninstalled successfully!"
}

# Test the application manually (without systemd)
test_application() {
    print_section "Testing Application"
    
    if ! validate_all; then
        exit 1
    fi
    
    print_info "Starting server manually (Ctrl+C to stop)..."
    print_info "Server will run on port ${PORT:-3005}"
    
    cd "${PROJECT_ROOT}"
    NODE_ENV=production PORT=${PORT:-3005} node src/server.js
}

################################################################################
# Help Function
################################################################################

show_help() {
    cat << EOF
Busca Vagas API - Deployment Script

Usage: ./deploy.sh [command] [options]

Commands:
  install     Install the systemd service
  start       Start the service
  stop        Stop the service  
  restart     Restart the service
  reload      Reload systemd daemon and restart service (for new code deployment)
  status      Check service status
  logs        View service logs (optional: -f to follow, -n <lines>)
  enable      Enable service to start on boot
  disable     Disable service auto-start
  uninstall   Remove the service completely
  validate    Validate configuration before deployment
  test        Test the application manually (without systemd)
  help        Show this help message

Examples:
  ./deploy.sh install          # Install the service
  ./deploy.sh start            # Start the service
  ./deploy.sh restart          # Restart running service
  ./deploy.sh reload           # Deploy new code (daemon-reload + restart)
  ./deploy.sh status           # Check if service is running
  ./deploy.sh logs             # View last 50 log lines
  ./deploy.sh logs -f          # Follow logs in real-time
  ./deploy.sh logs -n 100      # View last 100 log lines
  ./deploy.sh enable           # Enable auto-start on boot
  ./deploy.sh validate         # Validate before deploying
  ./deploy.sh test             # Test app manually

Full Deployment Workflow:
  1. ./deploy.sh validate      # Validate environment
  2. ./deploy.sh install       # Install service
  3. ./deploy.sh start         # Start service
  4. ./deploy.sh status        # Check status
  5. ./deploy.sh enable        # Enable auto-start

Code Update Workflow:
  1. git pull origin main      # Pull latest code
  2. npm install               # Update dependencies (if needed)
  3. ./deploy.sh reload        # Reload daemon and restart with new code
  4. ./deploy.sh logs -n 50    # Check logs for any errors

For more information, see: docs/SYSTEMD_SERVICE.md

EOF
}

################################################################################
# Main Script Logic
################################################################################

main() {
    # Check if not running as root
    check_root
    
    # Parse command
    local command="${1:-help}"
    shift || true
    
    case "${command}" in
        install)
            install_service
            ;;
        start)
            start_service
            ;;
        stop)
            stop_service
            ;;
        restart)
            restart_service
            ;;
        reload)
            reload_and_restart
            ;;
        status)
            show_status
            ;;
        logs)
            local follow=false
            local lines=50
            
            while [[ $# -gt 0 ]]; do
                case "$1" in
                    -f|--follow)
                        follow=true
                        shift
                        ;;
                    -n|--lines)
                        lines="$2"
                        shift 2
                        ;;
                    *)
                        shift
                        ;;
                esac
            done
            
            view_logs "${lines}" "${follow}"
            ;;
        enable)
            enable_service
            ;;
        disable)
            disable_service
            ;;
        uninstall)
            uninstall_service
            ;;
        validate)
            validate_all
            ;;
        test)
            test_application
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: ${command}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
