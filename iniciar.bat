@echo off
title Studio Di Catarina - WebApp Server (HTTPS)
cls
echo.
echo  ==========================================
echo     STUDIO DI CATARINA - WEBAPP SERVER
echo  ==========================================
echo.
echo  Iniciando servidor HTTPS para PWA/WebApp...
echo  Pressione Ctrl+C para encerrar.
echo.

where node >nul 2>nul
if %errorlevel% NEQ 0 (
    echo  [ERRO] Node.js nao encontrado!
    echo  Baixe em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo  Iniciando servidor HTTPS na porta 3001...
echo  Aguarde o certificado ser gerado...
echo.

start "" timeout /t 3 /nobreak >nul && start "" "https://localhost:3001"
node server.js

pause
