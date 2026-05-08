# ⚡ Quick Start - DESIGEO

## 🎯 Resumen Rápido

Tu aplicación React está lista. Aquí están los comandos esenciales:

## 💻 Desarrollo Local

```bash
cd desigeo-app
npm run dev
```

Abre http://localhost:5173

## 📤 Subir a GitHub

```bash
cd desigeo-app
git init
git add .
git commit -m "Initial commit: DESIGEO app"
git remote add origin https://github.com/areeislat/denuncia-ciudadana-localizada-front.git
git branch -M main
git push -u origin main
```

## 🚀 Desplegar en Vercel

### Método 1: Dashboard (Más Fácil)
1. Ve a https://vercel.com
2. Click "New Project"
3. Importa tu repo de GitHub
4. Click "Deploy"
5. ¡Listo!

### Método 2: CLI
```bash
npm i -g vercel
cd desigeo-app
vercel --prod
```

## 🗺️ Rutas Principales

- `/` - Home pública
- `/login` - Login
- `/ciudadano` - Dashboard ciudadano
- `/ciudadano/crear` - Crear reporte
- `/panel` - Panel municipal

## 📁 Estructura

```
desigeo-app/
├── src/
│   ├── components/    # Header, Footer, MapComponent
│   ├── pages/         # Todas las páginas
│   ├── App.jsx        # Rutas
│   └── main.jsx       # Entry point
└── public/            # Assets estáticos
```

## 🛠️ Stack Tecnológico

- React 18 + Vite
- React Router DOM
- Leaflet (mapas)
- Tailwind CSS
- Material Symbols

## ✅ Verificación

```bash
# Build de producción
npm run build

# Preview local
npm run preview
```

## 🔄 Workflow de Desarrollo

1. Haz cambios en el código
2. Prueba localmente con `npm run dev`
3. Commit y push a GitHub
4. Vercel despliega automáticamente

## 📝 Notas Importantes

- Los datos son mock/demo (no hay backend aún)
- Tailwind está vía CDN (para prototipado rápido)
- Los mapas usan OpenStreetMap (gratis, sin API key)
- Coordenadas centradas en Santiago, Chile

## 🆘 Problemas Comunes

**Error al instalar:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build falla:**
```bash
npm run build
# Revisa los errores en consola
```

**Rutas 404 en producción:**
- Ya está solucionado con `vercel.json`

## 📚 Documentación Completa

- Ver `README.md` para más detalles
- Ver `DEPLOY.md` para guía de despliegue completa

---

¿Listo para empezar? 🚀

```bash
cd desigeo-app && npm run dev
```
