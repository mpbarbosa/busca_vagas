#!/bin/bash
# Script para inicializar o projeto

echo "Iniciando Busca Vagas..."

# Instala dependências do backend
echo "Instalando dependências do backend..."
npm install

# Instala dependências do frontend
echo "Instalando dependências do frontend..."
cd client && npm install && cd ..

echo "Instalação concluída!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  Backend: npm run dev"
echo "  Frontend: npm run client"
echo "  Ambos: npm run dev:all"
