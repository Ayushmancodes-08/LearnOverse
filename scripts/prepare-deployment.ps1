# Deployment Preparation Script for Windows
# Run this before deploying to Render

Write-Host "🚀 Preparing for Render Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Run: git init" -ForegroundColor Red
    exit 1
}

# Check if .gitignore exists
if (-not (Test-Path ".gitignore")) {
    Write-Host "❌ .gitignore not found" -ForegroundColor Red
    exit 1
}

# Check if sensitive files are in .gitignore
$gitignoreContent = Get-Content ".gitignore" -Raw
$requiredPatterns = @(".env.local", ".env", "node_modules")
$missing = @()

foreach ($pattern in $requiredPatterns) {
    if ($gitignoreContent -notmatch [regex]::Escape($pattern)) {
        $missing += $pattern
    }
}

if ($missing.Count -gt 0) {
    Write-Host "⚠️  Warning: These patterns are missing from .gitignore:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
    Write-Host ""
}

# Check if .env files exist (they shouldn't be committed)
$envFiles = @("frontend/.env.local", "backend/.env")
$foundEnvFiles = @()

foreach ($file in $envFiles) {
    if (Test-Path $file) {
        # Check if file is tracked by git
        $gitStatus = git ls-files $file 2>$null
        if ($gitStatus) {
            $foundEnvFiles += $file
        }
    }
}

if ($foundEnvFiles.Count -gt 0) {
    Write-Host "❌ ERROR: These .env files are tracked by git:" -ForegroundColor Red
    $foundEnvFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Run these commands to remove them:" -ForegroundColor Yellow
    $foundEnvFiles | ForEach-Object { Write-Host "   git rm --cached $_" -ForegroundColor Yellow }
    Write-Host ""
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found in root" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "frontend/package.json")) {
    Write-Host "❌ frontend/package.json not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "backend/package.json")) {
    Write-Host "❌ backend/package.json not found" -ForegroundColor Red
    exit 1
}

# Check if there are uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host ""
    git status --short
    Write-Host ""
    $response = Read-Host "Do you want to commit them now? (y/n)"
    if ($response -eq "y") {
        $commitMessage = Read-Host "Enter commit message"
        git add .
        git commit -m $commitMessage
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
}

# Check if remote is set
$remote = git remote -v 2>$null
if (-not $remote) {
    Write-Host "⚠️  No git remote configured" -ForegroundColor Yellow
    Write-Host "Add your GitHub remote:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "✅ Pre-deployment checks complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub: git push origin main" -ForegroundColor White
Write-Host "2. Open DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "3. Follow the checklist to deploy on Render" -ForegroundColor White
Write-Host ""
Write-Host "📚 Need help? Read RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
