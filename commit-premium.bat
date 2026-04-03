@echo off
echo ========================================
echo   SUBIENDO NOTICIA.HTML CON PREMIUM
echo ========================================
echo.

git add public/noticia.html
git commit -m "ADD: Noticia.html completo con bloqueo de contenido premium"
git push origin main

echo.
echo ========================================
echo   CAMBIOS SUBIDOS EXITOSAMENTE
echo ========================================
echo.
echo Vercel desplegara automaticamente en 1-2 minutos
echo.
pause
