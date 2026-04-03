@echo off
cls
echo ========================================
echo   DEPLOY FORZADO SIN CACHE
echo ========================================
echo.
echo Este script:
echo 1. Desactiva el cache de Vercel para archivos HTML
echo 2. Fuerza un nuevo deploy
echo 3. Los cambios se veran INMEDIATAMENTE
echo.
pause

git add vercel.json public/admin/index.html public/index.html
git commit -m "FIX: Desactivar cache de Vercel para archivos HTML - Premium visible"
git push origin main

echo.
echo ========================================
echo   CAMBIOS SUBIDOS
echo ========================================
echo.
echo IMPORTANTE:
echo.
echo 1. Ve a https://vercel.com
echo 2. Abre tu proyecto "informate-nicaragua"
echo 3. Ve a Settings ^> General
echo 4. Busca "Build ^& Development Settings"
echo 5. En "Output Directory" debe decir: public
echo.
echo 6. Espera 3 minutos a que Vercel despliegue
echo.
echo 7. Abre en modo incognito: Ctrl+Shift+N
echo    - Admin: nicaraguainformate.com/admin/
echo    - Index: nicaraguainformate.com
echo.
echo 8. Ahora SI deberas ver:
echo    - Checkbox "Noticia Premium" en el admin
echo    - Badge "PREMIUM" en el index
echo.
pause
