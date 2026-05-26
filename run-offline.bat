@echo off
start "Backend" node backend\server.js
start "Frontend" node static-server.js
echo Backend and frontend started.
echo Frontend: http://localhost:3000
pause
