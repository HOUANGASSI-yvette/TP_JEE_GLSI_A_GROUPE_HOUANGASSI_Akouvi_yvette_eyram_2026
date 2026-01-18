@echo off
echo Demarrage du backend Spring Boot...
cd /d "%~dp0"
call mvn spring-boot:run
pause

