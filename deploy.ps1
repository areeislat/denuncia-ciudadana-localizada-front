# Script de Despliegue DESIGEO para Windows PowerShell
# Ejecutar: .\deploy.ps1

Write-Host "🚀 DESIGEO - Script de Despliegue" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encuentra package.json" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde la carpeta desigeo-app" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Paso 1: Instalando dependencias..." -ForegroundColor Green
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔨 Paso 2: Construyendo aplicación..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir la aplicación" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build completada exitosamente!" -ForegroundColor Green
Write-Host ""

# Preguntar si quiere inicializar Git
$initGit = Read-Host "¿Deseas inicializar Git y subir a GitHub? (s/n)"

if ($initGit -eq "s" -or $initGit -eq "S") {
    Write-Host ""
    Write-Host "📝 Paso 3: Configurando Git..." -ForegroundColor Green
    
    # Verificar si ya existe .git
    if (Test-Path ".git") {
        Write-Host "   Git ya está inicializado" -ForegroundColor Yellow
    } else {
        git init
        Write-Host "   Git inicializado" -ForegroundColor Green
    }
    
    # Agregar archivos
    git add .
    
    # Commit
    $commitMsg = Read-Host "Mensaje del commit (Enter para usar mensaje por defecto)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "feat: DESIGEO React application ready for production"
    }
    git commit -m $commitMsg
    
    # Verificar si ya existe el remote
    $remoteExists = git remote | Select-String -Pattern "origin"
    if (-not $remoteExists) {
        Write-Host ""
        Write-Host "🔗 Configurando repositorio remoto..." -ForegroundColor Green
        $repoUrl = "https://github.com/areeislat/denuncia-ciudadana-localizada-front.git"
        Write-Host "   URL: $repoUrl" -ForegroundColor Cyan
        git remote add origin $repoUrl
    }
    
    # Push
    Write-Host ""
    Write-Host "⬆️  Subiendo a GitHub..." -ForegroundColor Green
    git branch -M main
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Código subido a GitHub exitosamente!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Hubo un problema al subir a GitHub" -ForegroundColor Yellow
        Write-Host "   Verifica tus credenciales y permisos" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 Paso 4: Desplegar en Vercel" -ForegroundColor Green
Write-Host ""
Write-Host "Opciones de despliegue:" -ForegroundColor Cyan
Write-Host "1. Dashboard de Vercel (Recomendado)" -ForegroundColor White
Write-Host "   - Ve a https://vercel.com" -ForegroundColor Gray
Write-Host "   - Click en 'New Project'" -ForegroundColor Gray
Write-Host "   - Importa tu repositorio de GitHub" -ForegroundColor Gray
Write-Host "   - Click en 'Deploy'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. CLI de Vercel" -ForegroundColor White
Write-Host "   - Instala: npm i -g vercel" -ForegroundColor Gray
Write-Host "   - Ejecuta: vercel --prod" -ForegroundColor Gray
Write-Host ""

$deployVercel = Read-Host "¿Deseas instalar Vercel CLI ahora? (s/n)"

if ($deployVercel -eq "s" -or $deployVercel -eq "S") {
    Write-Host ""
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Green
    npm install -g vercel
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Vercel CLI instalado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para desplegar, ejecuta:" -ForegroundColor Cyan
        Write-Host "   vercel --prod" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✨ ¡Proceso completado!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentación disponible:" -ForegroundColor Cyan
Write-Host "   - README.md - Documentación completa" -ForegroundColor White
Write-Host "   - DEPLOY.md - Guía de despliegue detallada" -ForegroundColor White
Write-Host "   - QUICKSTART.md - Inicio rápido" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para iniciar desarrollo local:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs importantes:" -ForegroundColor Cyan
Write-Host "   - Local: http://localhost:5173" -ForegroundColor White
Write-Host "   - GitHub: https://github.com/areeislat/denuncia-ciudadana-localizada-front" -ForegroundColor White
Write-Host "   - Vercel: (después del deploy)" -ForegroundColor White
Write-Host ""
Write-Host "¡Éxito! 🎉" -ForegroundColor Green
