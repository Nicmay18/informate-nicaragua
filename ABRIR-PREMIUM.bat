@echo off
chcp 65001 >nul
title Abrir Nicaragua Informate Premium
cls

echo ========================================
echo   ABRIENDO NICARAGUA INFORMATE
echo ========================================
echo.

:: Intentar abrir el archivo directamente primero
if exist "index-premium.html" (
    echo Abriendo index-premium.html...
    start "" "index-premium.html"
    echo.
    echo [OK] Pagina abierta en tu navegador predeterminado
    echo.
    echo Si no se abre automaticamente, abre el archivo
    echo index-premium.html manualmente en tu navegador.
    echo.
    timeout /t 3 /nobreak >nul
    exit
) else (
    echo ERROR: No se encontro index-premium.html
    echo.
    echo Buscando archivo alternativo...
    
    if exist "index.html" (
        echo Abriendo index.html...
        start "" "index.html"
        timeout /t 3 /nobreak >nul
        exit
    ) else (
        echo.
        echo ERROR: No se encontro ningun archivo HTML
        pause
    )
)
