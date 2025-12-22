#!/bin/bash
# Script para inicializar o projeto
# 
# Purpose: Install all project dependencies (backend + frontend)
# Exit codes: 0 (success), 1 (error)
# Prerequisites: Node.js >= 18, npm, bash

set -e  # Exit on error

echo "Iniciando Busca Vagas..."
echo ""

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "   Please install Node.js >= 18.0.0"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

# Verify Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version < 18 detected"
    echo "   Recommended: Node.js >= 18.0.0"
    echo "   Current: $(node --version)"
fi

# Instala dependências do backend
echo "📦 Instalando dependências do backend..."
if npm install; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""

# Instala dependências do frontend
echo "📦 Instalando dependências do frontend..."
if cd client && npm install && cd ..; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  Backend: npm run dev"
echo "  Frontend: npm run client"
echo "  Ambos: npm run dev:all"
echo ""
echo "Para executar testes:"
echo "  Quick tests: ./scripts/test.sh"
echo "  Full suite: npm test"
echo ""
echo "Para mais informações: cat scripts/README.md"
echo ""

exit 0
