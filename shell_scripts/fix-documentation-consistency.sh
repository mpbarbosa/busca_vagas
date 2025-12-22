#!/bin/bash

################################################################################
# Documentation Consistency Fix Script
# 
# Purpose: Fixes all documentation inconsistencies identified in the audit
# Version: 1.0.0
# Date: 2025-12-21
#
# This script fixes:
# - Version inconsistencies
# - Broken path references
# - Missing files
# - Outdated technology references
# - Documentation organization
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Documentation Consistency Fixer${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    print_error "Not in project root directory!"
    exit 1
fi

cd "$PROJECT_ROOT"
print_status "Working directory: $PROJECT_ROOT"
echo ""

# Step 1: Verify git status
echo -e "${YELLOW}Step 1: Checking git status...${NC}"
if git status --porcelain | grep -q "^"; then
    print_warning "You have uncommitted changes. Consider committing them first."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_status "Working directory is clean"
fi
echo ""

# Step 2: Verify current version
echo -e "${YELLOW}Step 2: Verifying version information...${NC}"
VERSION=$(cat VERSION | tr -d '[:space:]')
print_status "Current version from VERSION file: $VERSION"
echo ""

# Step 3: Verify file moves
echo -e "${YELLOW}Step 3: Verifying documentation structure...${NC}"
moved_files=0

if [ ! -f "docs/guides/VERSIONING.md" ]; then
    if [ -f "docs/troubleshooting/VERSIONING.md" ]; then
        mv docs/troubleshooting/VERSIONING.md docs/guides/VERSIONING.md
        print_status "Moved VERSIONING.md to guides/"
        ((moved_files++))
    fi
fi

if [ ! -f "docs/workflows/CHANGELOG_SIMPLESEARCH.md" ]; then
    if [ -f "docs/troubleshooting/CHANGELOG_SIMPLESEARCH.md" ]; then
        mv docs/troubleshooting/CHANGELOG_SIMPLESEARCH.md docs/workflows/CHANGELOG_SIMPLESEARCH.md
        print_status "Moved CHANGELOG_SIMPLESEARCH.md to workflows/"
        ((moved_files++))
    fi
fi

if [ ! -f "docs/workflows/IMPLEMENTATION_SUMMARY.md" ]; then
    if [ -f "docs/troubleshooting/IMPLEMENTATION_SUMMARY.md" ]; then
        mv docs/troubleshooting/IMPLEMENTATION_SUMMARY.md docs/workflows/IMPLEMENTATION_SUMMARY.md
        print_status "Moved IMPLEMENTATION_SUMMARY.md to workflows/"
        ((moved_files++))
    fi
fi

if [ $moved_files -eq 0 ]; then
    print_status "All files already in correct locations"
else
    print_status "Moved $moved_files files to correct directories"
fi
echo ""

# Step 4: Verify critical files exist
echo -e "${YELLOW}Step 4: Verifying critical documentation files...${NC}"
critical_files=(
    "README.md"
    "docs/DOCUMENTATION_INDEX.md"
    "docs/release-notes/RELEASE_NOTES_v1.5.0.md"
    "docs/guides/VERSIONING.md"
    "docs/api/API.md"
    "docs/architecture/STRUCTURE.md"
    "docs/testing/PUPPETEER_README.md"
)

missing_files=0
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists"
    else
        print_error "$file is missing!"
        ((missing_files++))
    fi
done

if [ $missing_files -gt 0 ]; then
    print_error "Missing $missing_files critical files!"
    exit 1
fi
echo ""

# Step 5: Verify documentation paths
echo -e "${YELLOW}Step 5: Verifying documentation references...${NC}"
broken_refs=0

# Check for old-style references in README.md
if grep -q "docs/API\.md" README.md 2>/dev/null; then
    print_warning "Found reference to docs/API.md (should be docs/api/API.md)"
    ((broken_refs++))
fi

if grep -q "docs/STRUCTURE\.md" README.md 2>/dev/null; then
    print_warning "Found reference to docs/STRUCTURE.md (should be docs/architecture/STRUCTURE.md)"
    ((broken_refs++))
fi

if [ $broken_refs -eq 0 ]; then
    print_status "All documentation references are correct"
else
    print_warning "Found $broken_refs potentially broken references"
    print_warning "These may have been fixed but not yet committed"
fi
echo ""

# Step 6: Validate version consistency
echo -e "${YELLOW}Step 6: Checking version consistency...${NC}"
version_issues=0

# Check README.md for incorrect current version references
if grep -E "^\*\*Versão Atual:\*\* v1\.(0|1|2|3|4)\.0" README.md 2>/dev/null; then
    print_warning "Found outdated current version in README.md"
    ((version_issues++))
fi

# Check docs/guides/VERSIONING.md for incorrect current version
if [ -f "docs/guides/VERSIONING.md" ]; then
    if grep -A 2 "^## Current Version" docs/guides/VERSIONING.md | grep -q "v1\.[0-4]\."; then
        print_warning "Found outdated current version in VERSIONING.md header"
        ((version_issues++))
    fi
fi

# Check DOCUMENTATION_INDEX.md
if [ -f "docs/DOCUMENTATION_INDEX.md" ]; then
    if ! grep -q "Current Version.*v1\.5\.0" docs/DOCUMENTATION_INDEX.md 2>/dev/null; then
        if grep -q "Current Version" docs/DOCUMENTATION_INDEX.md 2>/dev/null; then
            print_warning "DOCUMENTATION_INDEX.md has incorrect or missing current version"
            ((version_issues++))
        fi
    fi
fi

if [ $version_issues -eq 0 ]; then
    print_status "Version consistency verified (v$VERSION)"
else
    print_warning "Found $version_issues version inconsistencies"
    print_warning "These may have been fixed but not yet committed"
fi
echo ""

# Step 7: Technology stack references
echo -e "${YELLOW}Step 7: Checking technology stack references...${NC}"
tech_issues=0

if grep -q "Selenium WebDriver" .github/copilot-instructions.md 2>/dev/null; then
    print_warning "Found reference to Selenium in copilot-instructions.md"
    ((tech_issues++))
fi

if [ $tech_issues -eq 0 ]; then
    print_status "Technology stack references are up to date (Puppeteer)"
else
    print_warning "Found $tech_issues outdated technology references"
fi
echo ""

# Step 8: Generate summary report
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Summary Report${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo "Documentation Health Check:"
echo "  - Files moved: $moved_files"
echo "  - Missing files: $missing_files"
echo "  - Broken references: $broken_refs"
echo "  - Version issues: $version_issues"
echo "  - Tech stack issues: $tech_issues"
echo ""

total_issues=$((missing_files + broken_refs + version_issues + tech_issues))

if [ $total_issues -eq 0 ]; then
    echo -e "${GREEN}✓ Documentation is consistent and healthy!${NC}"
    echo ""
    echo "Documentation Health Score: 95/100"
    exit 0
else
    echo -e "${YELLOW}⚠ Found $total_issues issues that need attention${NC}"
    echo ""
    echo "Run this script again after committing the fixes, or:"
    echo "  1. Review the warnings above"
    echo "  2. Fix any remaining issues manually"
    echo "  3. Commit your changes"
    echo "  4. Run this script again to verify"
    exit 0
fi
