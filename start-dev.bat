@echo off
chcp 65001 >nul
title 🚀 Nicaragua Informate 3.0 - Servidor Local

echo ===========================================
echo   NICARAGUA INFORMATE 3.0
echo   Servidor de Desarrollo Local
echo ===========================================
echo.

:: Buscar Python primero
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python detectado
    echo 🌐 Iniciando servidor en http://localhost:3000
    echo.
    start http://localhost:3000
    python -m http.server 3000
    goto :end
)

:: Si no hay Python, usar Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js detectado
    echo 📦 Verificando 'serve'...
    
    :: Verificar si serve está instalado
    npx serve --version >nul 2>&1
    if %errorlevel% == 0 (
        echo 🌐 Iniciando servidor en http://localhost:3000
        echo.
        start http://localhost:3000
        npx serve -l 3000
    ) else (
        echo 📥 Instalando 'serve'...
        npm install -g serve
        echo 🌐 Iniciando servidor en http://localhost:3000
        echo.
        start http://localhost:3000
        npx serve -l 3000
    )
    goto :end
)

echo ❌ ERROR: No se encontró Python ni Node.js
echo.
echo Instale uno de ellos:
echo  - Python: https://python.org
echo  - Node.js: https://nodejs.org
echo.
pause

:end
