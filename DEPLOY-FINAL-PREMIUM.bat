@echo off
cls
echo ========================================
echo   DEPLOY FINAL - BADGE PREMIUM
echo ========================================
echo.
echo Este es el deploy DEFINITIVO con:
echo - Version timestamp en el codigo
echo - Console.log para debug
echo - Forzar cache bust
echo.
pause

git add public/index.html
git commit -m "FINAL: Badge Premium con version timestamp y debug"
git push origin main

echo.
echo ========================================
echo   CAMBIOS SUBIDOS EXITOSAMENTE
echo ========================================
echo.
echo AHORA SIGUE ESTOS PASOS EXACTOS:
echo.
echo 1. Espera 3 minutos completos
echo.
echo 2. Abre Chrome en modo incognito: Ctrl+Shift+N
echo.
echo 3. Ve a: nicaraguainformate.com
echo.
echo 4. Presiona F12 para abrir DevTools
echo.
echo 5. Ve a la pestana "Console"
echo.
echo 6. Deberas ver este mensaje:
echo    "RENDERIZANDO NOTICIAS - VERSION PREMIUM BADGE"
echo.
echo 7. Si ves ese mensaje, el codigo nuevo esta cargado
echo.
echo 8. Busca la noticia de Nigeria (la que marcaste premium)
echo.
echo 9. Deberas ver el badge dorado "💎 PREMIUM"
echo.
echo ========================================
echo.
pause
