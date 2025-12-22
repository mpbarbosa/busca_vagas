#!/bin/bash
# Script para executar testes
#
# Purpose: Quick test runner for unit and integration tests
# Exit codes: 0 (all passed), non-zero (failures)
# Prerequisites: Dependencies installed (npm install)

set -e  # Exit on first error

echo "╔════════════════════════════════════════╗"
echo "║     Quick Test Runner - Busca Vagas    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Error: Dependencies not installed"
    echo "   Run: npm install or ./scripts/setup.sh"
    exit 1
fi

FAILED=0

# Testes unitários
echo "🧪 Executando testes unitários..."
if npm run test:unit; then
    echo "✅ Unit tests passed"
else
    echo "❌ Unit tests failed"
    FAILED=1
fi

echo ""

# Testes de integração
echo "🔗 Executando testes de integração..."
if npm run test:integration; then
    echo "✅ Integration tests passed"
else
    echo "❌ Integration tests failed"
    FAILED=1
fi

# Testes E2E (comentado por padrão, requer ambiente configurado)
# echo ""
# echo "🌐 Executando testes E2E..."
# if npm run test:e2e; then
#     echo "✅ E2E tests passed"
# else
#     echo "❌ E2E tests failed"
#     FAILED=1
# fi

echo ""
echo "════════════════════════════════════════"

if [ $FAILED -eq 0 ]; then
    echo "✅ Todos os testes passaram!"
    echo ""
    echo "Para testes completos (incluindo E2E):"
    echo "  npm test"
    exit 0
else
    echo "❌ Alguns testes falharam"
    echo ""
    echo "Para mais detalhes:"
    echo "  npm test -- --verbose"
    exit 1
fi
