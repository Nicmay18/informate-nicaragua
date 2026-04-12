@echo off
chcp 65001 >nul
title Nicaragua Informate - Servidor Local
cls

echo ========================================
echo   NICARAGUA INFORMATE - SERVIDOR LOCAL
echo ========================================
echo.
echo Abriendo servidor en puerto 8080...
echo.
echo Una vez abierto, navega a:
echo http://localhost:8080/index-premium.html
echo.
echo ========================================
echo.

:: Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo [OK] Node.js detectado
    echo.
    echo Iniciando servidor...
    call npx serve . -p 8080 -s
) else (
    echo [INFO] Node.js no encontrado
    echo.
    echo Instalando servidor temporal...
    echo.
    
    :: Crear servidor simple con VBScript como fallback
    echo Set objShell = CreateObject("WScript.Shell") > %temp%\servidor.vbs
    echo objShell.Run "cmd /c echo Servidor iniciado en puerto 8080 ^&^& python -m http.server 8080 2^>nul || php -S localhost:8080 2^>nul || echo Instala Node.js o Python para mejor experiencia", 0, False >> %temp%\servidor.vbs
    cscript //nologo %temp%\servidor.vbs
    del %temp%\servidor.vbs
    
    echo.
    echo Intentando abrir con Python...
    python -m http.server 8080 2>nul
    
    if %ERRORLEVEL% NEQ 0 (
        echo Python no encontrado.
        echo.
        echo Intentando con PHP...
        php -S localhost:8080 2>nul
        
        if %ERRORLEVEL% NEQ 0 (
            echo.
            echo ========================================
            echo ERROR: No se encontro Node.js, Python ni PHP
            echo ========================================
            echo.
            echo Para usar este proyecto necesitas instalar:
            echo 1. Node.js (recomendado): https://nodejs.org
            echo    Luego ejecuta: npm install -g serve
            echo.
            echo 2. O Python: https://python.org
            echo.
            echo 3. O abre el archivo HTML directamente en el navegador
            echo    haciendo doble click en index-premium.html
            echo.
            pause
        )
    )
)
