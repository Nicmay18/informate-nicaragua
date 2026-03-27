@echo off
echo Copiando admin.html a public...
copy admin.html public\admin.html /Y

echo Agregando a git...
git add public/admin.html

echo Creando commit...
git commit -m "Actualizar admin.html en public"

echo Subiendo a GitHub...
git push origin main

echo.
echo Listo! Vercel se actualizara en 1-2 minutos
echo Accede a: https://informate-nicaragua.vercel.app/admin.html
pause
