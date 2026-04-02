@echo off
echo Desplegando reparacion de radio...
git add public/index.html
git commit -m "fix: radio con URLs HTTPS correctas y logs de depuracion"
git push origin main
echo.
echo Listo! Espera 1-2 minutos para que Vercel despliegue.
pause
