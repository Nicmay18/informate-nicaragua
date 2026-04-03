@echo off
cls
echo ========================================
echo   OPTIMIZACION MOVIL
echo ========================================
echo.
echo Mejoras implementadas:
echo - Clima mas grande y legible
echo - Barra economica con scroll horizontal
echo - Menu de navegacion optimizado
echo - Carrusel mas compacto (380px)
echo - Radio flotante mas pequeno
echo - Noticias en columna unica
echo - Textos mas grandes y legibles
echo.
pause

git add public/index.html
git commit -m "MOBILE: Optimizacion completa para moviles - UI mejorada"
git push origin main

echo.
echo ========================================
echo   CAMBIOS SUBIDOS
echo ========================================
echo.
echo Espera 2-3 minutos y prueba en tu movil
echo Recuerda usar modo incognito: Menu > Nueva pestana de incognito
echo.
pause
