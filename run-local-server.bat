@echo off
title OTP Enterprise Local Server
echo =========================================================
echo   Starting Local OTP SaaS Backend & WhatsApp Engine...
echo =========================================================
cd /d "%~dp0backend"
set PORT=3000
set ENABLE_BAILEYS=true
npm run start:dev
pause
