@echo off
cls
echo ========================================
echo   MODO OSCURO + OPTIMIZACIONES
echo ========================================
echo.
echo Nuevas funcionalidades agregadas:
echo.
echo 1. MODO OSCURO COMPLETO:
echo    - Boton flotante en esquina inferior derecha
echo    - Icono de luna (modo claro) / sol (modo oscuro)
echo    - Guarda preferencia en localStorage
echo    - Detecta preferencia del sistema
echo    - Transiciones suaves
echo.
echo 2. OPTIMIZACIONES MOVIL:
echo    - Meta tags para iOS
echo    - Soporte para agregar a pantalla de inicio
echo    - Barra de estado translucida en iOS
echo.
echo 3. TEMAS:
echo    - Modo claro: Fondo blanco, texto oscuro
echo    - Modo oscuro: Fondo #121212, texto claro
echo    - Todos los componentes adaptados
echo.
pause

git add public/index.html
git commit -m "FEATURE: Modo oscuro completo + Optimizaciones iOS + Boton flotante"
git push origin main

echo.
echo ========================================
echo   CAMBIOS SUBIDOS
echo ========================================
echo.
echo Espera 2-3 minutos y recarga el sitio
echo.
echo Veras un boton flotante en la esquina inferior derecha:
echo - Icono de LUNA = Modo claro activo (click para oscuro)
echo - Icono de SOL = Modo oscuro activo (click para claro)
echo.
echo El modo se guarda automaticamente
echo.
pause
