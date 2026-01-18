@echo off
echo ========================================
echo Demarrage de l'application Ega Banque
echo ========================================
echo.

echo Demarrage du backend Spring Boot sur le port 8080...
start "Backend Spring Boot" cmd /k "cd /d %~dp0 && mvn spring-boot:run"

timeout /t 5 /nobreak >nul

echo Demarrage du frontend Angular sur le port 4200...
start "Frontend Angular" cmd /k "cd /d %~dp0\ega_banque && npm start"

echo.
echo ========================================
echo Les deux serveurs sont en cours de demarrage...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:4200
echo ========================================
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul

