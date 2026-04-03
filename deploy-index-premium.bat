@echo off
echo ========================================
echo   DEPLOY DE INDEX CON BADGE PREMIUM
echo ========================================
echo.

REM Agregar un comentario al final del index para forzar cambio
echo. >> public/index.html

git add public/index.html
git commit -m "UPDATE: Index con badge premium - %date% %time%"
git push origin main

echo.
echo ========================================
echo   CAMBIOS SUBIDOS
echo ========================================
echo.
echo PASOS SIGUIENTES:
echo.
echo 1. Espera 2-3 minutos a que Vercel despliegue
echo 2. Ve a: https://vercel.com/tu-proyecto
echo 3. Verifica que el deploy este completo
echo 4. Abre el index en modo incognito: Ctrl+Shift+N
echo 5. Ve a: nicaraguainformate.com
echo.
echo Deberas ver el badge "💎 PREMIUM" en las noticias premium
echo.
pause
