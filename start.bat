@echo off
title Code Snippers - Launcher
echo =======================================================
echo Starting Code Snippers Full Stack App
echo =======================================================
echo.

echo [1/2] Starting Backend (Spring Boot on port 8081)...
start "Code Snippers - Backend" cmd /k "cd server && ..\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

echo [2/2] Starting Frontend (Next.js on port 3000/3001)...
start "Code Snippers - Frontend" cmd /k "cd client && npm run dev"

echo.
echo Both applications are starting up in separate windows!
echo It might take a minute for the first start.
echo.
echo IMPORTANT: 
echo - Backend will run on http://localhost:8081
echo - Frontend will run on http://localhost:3000 (or 3001 if 3000 is occupied)
echo.
echo Database: Supabase PostgreSQL (configure credentials in server/src/main/resources/application.properties)
pause
