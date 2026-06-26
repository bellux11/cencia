@echo off
echo ==========================================
echo  TRATTORIA SORA CENCIA v3 - Server Locale
echo ==========================================
echo.
echo Avvio server su http://localhost:8000
echo.
echo Sito IT: http://localhost:8000
echo Site EN: http://localhost:8000/en/
echo.
echo Premi CTRL+C per chiudere il server
echo ==========================================
python -m http.server 8000
pause
