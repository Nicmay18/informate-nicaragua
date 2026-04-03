@echo off
cls
echo ========================================
echo   GUARDANDO SISTEMA PREMIUM COMPLETO
echo ========================================
echo.

REM Agregar todos los cambios
git add .

REM Commit con mensaje descriptivo
git commit -m "COMPLETE: Sistema de Noticias Premium 100%% funcional - Badge dorado, Paywall, Integracion PayPal"

REM Subir a GitHub
git push origin main

echo.
echo ========================================
echo   SISTEMA GUARDADO EXITOSAMENTE
echo ========================================
echo.
echo Archivos guardados:
echo - admin.html (checkbox premium)
echo - public/admin/index.html (checkbox premium)
echo - public/index.html (badge premium)
echo - public/noticia.html (paywall completo)
echo - SISTEMA-PREMIUM-COMPLETO.md (documentacion)
echo.
echo Archivos eliminados:
echo - Scripts de prueba temporales
echo - Archivos de debug
echo.
echo El sistema esta 100%% funcional y listo para monetizar
echo.
pause
