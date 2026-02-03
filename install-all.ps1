Write-Host "Installing dependencies for ALL microfrontends..." -ForegroundColor Green
$apps = @("shell", "shared-lib", "mfe-auth", "mfe-dashboard", "mfe-projects", "mfe-admin", "mfe-tasks")

foreach ($app in $apps) {
    Write-Host "Installing $app..." -ForegroundColor Cyan
    cd $app
    npm install
    cd ..
}

Write-Host "Building Shared Lib..." -ForegroundColor Green
cd shared-lib
npm run build
cd ..

Write-Host "DONE! You can now run .\run-all.ps1" -ForegroundColor Yellow
