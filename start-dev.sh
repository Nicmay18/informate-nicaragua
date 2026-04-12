#!/bin/bash

# 🚀 Nicaragua Informate 3.0 - Servidor Local
# Script de inicio para Linux/Mac

echo "==========================================="
echo "   NICARAGUA INFORMATE 3.0"
echo "   Servidor de Desarrollo Local"
echo "==========================================="
echo ""

PORT=3000

# Función para abrir navegador
open_browser() {
    sleep 2
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:$PORT"
    elif command -v open &> /dev/null; then
        open "http://localhost:$PORT"
    fi
}

# Buscar Python primero
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 detectado"
    echo "🌐 Iniciando servidor en http://localhost:$PORT"
    echo ""
    open_browser &
    python3 -m http.server $PORT
    exit 0
elif command -v python &> /dev/null; then
    echo "✅ Python detectado"
    echo "🌐 Iniciando servidor en http://localhost:$PORT"
    echo ""
    open_browser &
    python -m http.server $PORT
    exit 0
fi

# Si no hay Python, usar Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js detectado"
    
    # Verificar si serve está instalado globalmente
    if command -v serve &> /dev/null; then
        echo "🌐 Iniciando servidor en http://localhost:$PORT"
        echo ""
        open_browser &
        serve -l $PORT
        exit 0
    else
        echo "📦 Usando npx serve..."
        echo "🌐 Iniciando servidor en http://localhost:$PORT"
        echo ""
        open_browser &
        npx serve -l $PORT
        exit 0
    fi
fi

echo "❌ ERROR: No se encontró Python ni Node.js"
echo ""
echo "Instale uno de ellos:"
echo "  - Python: https://python.org"
echo "  - Node.js: https://nodejs.org"
echo ""
read -p "Presione Enter para salir..."
