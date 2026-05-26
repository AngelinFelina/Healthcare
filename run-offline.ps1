Start-Process -NoNewWindow -FilePath node -ArgumentList "backend/server.js"
Start-Process -NoNewWindow -FilePath node -ArgumentList "static-server.js"
Write-Output "Backend running on default port (backend/server.js). Frontend served at http://localhost:3000"
Write-Output "Use Ctrl+C in the Node process windows to stop servers." 
