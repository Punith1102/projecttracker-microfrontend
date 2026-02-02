# Run All Microfrontends
# This script starts all microfrontend applications simultaneously

Write-Host "Starting Microfrontend Applications..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Start Shell (Host) - Port 4200
Write-Host "Starting Shell (Host) on port 4200..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd shell && npm start" -WindowStyle Normal

# Start Auth MFE - Port 4201
Write-Host "Starting Auth MFE on port 4201..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd mfe-auth && npm start" -WindowStyle Normal

# Start Dashboard MFE - Port 4202
Write-Host "Starting Dashboard MFE on port 4202..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd mfe-dashboard && npm start" -WindowStyle Normal

# Start Projects MFE - Port 4203
Write-Host "Starting Projects MFE on port 4203..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd mfe-projects && npm start" -WindowStyle Normal

# Start Admin MFE - Port 4204
Write-Host "Starting Admin MFE on port 4204..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd mfe-admin && npm start" -WindowStyle Normal

# Start Tasks MFE - Port 4205
Write-Host "Starting Tasks MFE on port 4205..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c cd mfe-tasks && npm start" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All microfrontends are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at: http://localhost:4200" -ForegroundColor Yellow
Write-Host ""
Write-Host "Port Allocation:" -ForegroundColor White
Write-Host "  Shell (Host):    http://localhost:4200" -ForegroundColor Gray
Write-Host "  Auth MFE:        http://localhost:4201" -ForegroundColor Gray
Write-Host "  Dashboard MFE:   http://localhost:4202" -ForegroundColor Gray
Write-Host "  Projects MFE:    http://localhost:4203" -ForegroundColor Gray
Write-Host "  Admin MFE:       http://localhost:4204" -ForegroundColor Gray
Write-Host "  Tasks MFE:       http://localhost:4205" -ForegroundColor Gray
