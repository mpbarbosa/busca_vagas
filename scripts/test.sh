#!/bin/bash
# Script para executar testes

echo "Executando testes..."

# Testes unitários
echo "Executando testes unitários..."
npm run test:unit

# Testes de integração
echo "Executando testes de integração..."
npm run test:integration

# Testes E2E (comentado por padrão, requer ambiente configurado)
# echo "Executando testes E2E..."
# npm run test:e2e

echo "Testes concluídos!"
