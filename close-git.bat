@echo off
taskkill /F /IM vim.exe 2>nul
taskkill /F /IM git.exe 2>nul
taskkill /F /IM bash.exe 2>nul
taskkill /F /IM sh.exe 2>nul
timeout /t 2 /nobreak >nul
del /F .git\MERGE_MSG 2>nul
git add .
git commit -m "Profesionalizar sitio completo"
git push
echo.
echo Cambios desplegados exitosamente
pause
