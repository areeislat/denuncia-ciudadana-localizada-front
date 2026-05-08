# 🛠️ Comandos Útiles - DESIGEO

## 📝 Comandos Básicos

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar en un puerto específico
npm run dev -- --port 3000

# Abrir automáticamente en el navegador
npm run dev -- --open
```

### Build
```bash
# Construir para producción
npm run build

# Preview de la build
npm run preview

# Build y preview
npm run build && npm run preview
```

### Linting
```bash
# Ejecutar linter
npm run lint

# Fix automático
npm run lint -- --fix
```

## 🔧 Mantenimiento

### Dependencias
```bash
# Instalar dependencias
npm install

# Actualizar dependencias
npm update

# Ver dependencias desactualizadas
npm outdated

# Limpiar cache
npm cache clean --force

# Reinstalar todo
rm -rf node_modules package-lock.json
npm install
```

### Git
```bash
# Estado actual
git status

# Ver cambios
git diff

# Agregar archivos
git add .
git add src/pages/Home.jsx

# Commit
git commit -m "feat: descripción del cambio"

# Push
git push

# Pull
git pull

# Ver historial
git log --oneline

# Crear branch
git checkout -b feature/nueva-funcionalidad

# Cambiar de branch
git checkout main

# Merge
git merge feature/nueva-funcionalidad

# Ver branches
git branch -a
```

## 🚀 Despliegue

### Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar (preview)
vercel

# Desplegar (producción)
vercel --prod

# Ver deployments
vercel ls

# Ver logs
vercel logs

# Remover deployment
vercel rm [deployment-url]
```

### Build Local
```bash
# Build de producción
npm run build

# Servir build localmente
npm run preview

# Build con análisis
npm run build -- --mode production
```

## 🐛 Debugging

### Logs
```bash
# Ver logs de npm
npm run dev --verbose

# Ver logs de Vite
npm run dev -- --debug

# Limpiar cache de Vite
rm -rf node_modules/.vite
```

### Problemas Comunes
```bash
# Error de puertos
# Matar proceso en puerto 5173
npx kill-port 5173

# Error de módulos
rm -rf node_modules package-lock.json
npm install

# Error de build
npm run build -- --debug

# Limpiar todo
rm -rf node_modules dist .vite package-lock.json
npm install
npm run build
```

## 📦 Gestión de Paquetes

### Agregar Dependencias
```bash
# Dependencia de producción
npm install nombre-paquete

# Dependencia de desarrollo
npm install -D nombre-paquete

# Versión específica
npm install nombre-paquete@1.2.3

# Múltiples paquetes
npm install paquete1 paquete2 paquete3
```

### Remover Dependencias
```bash
# Remover paquete
npm uninstall nombre-paquete

# Remover y actualizar package.json
npm uninstall --save nombre-paquete
```

## 🔍 Inspección

### Análisis de Bundle
```bash
# Instalar analizador
npm install -D rollup-plugin-visualizer

# Agregar a vite.config.js:
# import { visualizer } from 'rollup-plugin-visualizer'
# plugins: [react(), visualizer()]

# Build y ver análisis
npm run build
# Abre stats.html
```

### Información del Proyecto
```bash
# Ver versión de Node
node --version

# Ver versión de npm
npm --version

# Ver dependencias instaladas
npm list

# Ver dependencias de nivel superior
npm list --depth=0

# Ver información del paquete
npm info nombre-paquete
```

## 🧪 Testing (Para futuro)

```bash
# Instalar Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 🎨 Formato de Código

```bash
# Instalar Prettier
npm install -D prettier

# Formatear todo
npx prettier --write .

# Formatear archivo específico
npx prettier --write src/pages/Home.jsx

# Verificar formato
npx prettier --check .
```

## 📊 Performance

```bash
# Analizar tamaño de build
npm run build
ls -lh dist/assets/

# Lighthouse (requiere Chrome)
npx lighthouse http://localhost:5173 --view

# Bundle analyzer
npm run build -- --mode analyze
```

## 🔐 Seguridad

```bash
# Auditoría de seguridad
npm audit

# Fix automático
npm audit fix

# Fix forzado
npm audit fix --force

# Ver vulnerabilidades
npm audit --json
```

## 🌐 Variables de Entorno

```bash
# Crear archivo .env
echo "VITE_API_URL=https://api.ejemplo.com" > .env

# Usar en código:
# import.meta.env.VITE_API_URL

# Diferentes entornos
.env                # Todas las situaciones
.env.local          # Local (ignorado por git)
.env.development    # npm run dev
.env.production     # npm run build
```

## 📱 PWA (Para futuro)

```bash
# Instalar plugin PWA
npm install -D vite-plugin-pwa

# Configurar en vite.config.js
# import { VitePWA } from 'vite-plugin-pwa'
```

## 🔄 Scripts Personalizados

Agregar a `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "clean": "rm -rf node_modules dist .vite",
    "fresh": "npm run clean && npm install",
    "deploy": "npm run build && vercel --prod"
  }
}
```

## 💻 Atajos de Teclado (en dev server)

Cuando `npm run dev` está corriendo:

- `r` - Reiniciar servidor
- `u` - Mostrar URL
- `o` - Abrir en navegador
- `c` - Limpiar consola
- `q` - Salir

## 🎯 Workflow Recomendado

### Desarrollo de Feature
```bash
# 1. Crear branch
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar
npm run dev
# ... hacer cambios ...

# 3. Verificar
npm run build
npm run preview

# 4. Commit
git add .
git commit -m "feat: nueva funcionalidad"

# 5. Push
git push origin feature/nueva-funcionalidad

# 6. Crear PR en GitHub
# 7. Merge a main
# 8. Vercel despliega automáticamente
```

### Hotfix
```bash
# 1. Branch desde main
git checkout main
git pull
git checkout -b hotfix/descripcion

# 2. Fix
# ... hacer cambios ...

# 3. Test
npm run build

# 4. Commit y push
git add .
git commit -m "fix: descripción del fix"
git push origin hotfix/descripcion

# 5. Merge rápido a main
```

## 📚 Recursos Adicionales

- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev
- npm Docs: https://docs.npmjs.com
- Vercel Docs: https://vercel.com/docs

---

**Tip:** Guarda este archivo como referencia rápida 📌
