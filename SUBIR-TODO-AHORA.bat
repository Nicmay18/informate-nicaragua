@echo off
cls
echo ========================================
echo   SUBIENDO TODOS LOS CAMBIOS
echo ========================================
echo.
echo Archivos modificados:
echo - public/admin/index.html (selector de collage)
echo - public/index.html (modo oscuro + badge premium)
echo.
pause

git add .
git commit -m "COMPLETE: Modo oscuro + Selector collage (Normal/Luto) + Badge premium + Optimizaciones movil"
git push origin main

echo.
echo ========================================
echo   TODOS LOS CAMBIOS SUBIDOS
echo ========================================
echo.
echo IMPORTANTE: Espera 2-3 minutos
echo.
echo Luego recarga con Ctrl+Shift+R y veras:
echo.
echo 1. ADMIN:
echo    - Selector: Noticia Normal / Noticia de Luto
echo.
echo 2. INDEX:
echo    - Badge "💎 PREMIUM" en noticias premium
echo    - Boton de modo oscuro (esquina inferior derecha)
echo.
echo 3. NOTICIA INDIVIDUAL:
echo    - Paywall funcionando (ya verificado)
echo.
pause
