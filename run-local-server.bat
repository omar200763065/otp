@echo off
title OTP Enterprise Local Server
echo =========================================================
echo   Starting Local OTP SaaS Backend & WhatsApp Engine...
echo =========================================================
cd /d "%~dp0"
set PORT=3000
set ENABLE_BAILEYS=true
npm --prefix backend run start:dev
pause
