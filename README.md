# DESIGEO - Denuncia Ciudadana Geolocalizada

Plataforma municipal de denuncia ciudadana geolocalizada construida con React + Vite.

## 🚀 Desarrollo Local

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:5173
```

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción localmente
- `npm run lint` - Ejecuta el linter

## 📦 Estructura del Proyecto

```
desigeo-app/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── MapComponent.jsx
│   ├── pages/          # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Recuperar.jsx
│   │   ├── CiudadanoHome.jsx
│   │   ├── CiudadanoCrear.jsx
│   │   ├── CiudadanoReportes.jsx
│   │   └── Panel.jsx
│   ├── App.jsx         # Configuración de rutas
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── public/             # Archivos estáticos
└── index.html          # HTML principal
```

## 🌐 Despliegue

### GitHub

```bash
# Inicializar repositorio Git
git init
git add .
git commit -m "Initial commit: DESIGEO React app"

# Conectar con repositorio remoto
git remote add origin https://github.com/areeislat/denuncia-ciudadana-localizada-front.git
git branch -M main
git push -u origin main
```

### Vercel

1. **Opción 1: Desde la CLI de Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Para producción
vercel --prod
```

2. **Opción 2: Desde el Dashboard de Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite
   - Haz clic en "Deploy"

### Configuración de Build en Vercel

Si necesitas configurar manualmente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🗺️ Rutas de la Aplicación

- `/` - Página de inicio pública
- `/login` - Inicio de sesión
- `/registro` - Registro de nuevos usuarios
- `/recuperar` - Recuperación de contraseña
- `/ciudadano` - Dashboard del ciudadano
- `/ciudadano/crear` - Crear nuevo reporte
- `/ciudadano/reportes` - Ver mis reportes
- `/panel` - Panel de gestión municipal

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración de Leaflet con React
- **Tailwind CSS** - Framework de CSS (vía CDN)
- **Google Fonts** - Tipografías (Plus Jakarta Sans, Public Sans)
- **Material Symbols** - Iconografía

## 📝 Notas de Desarrollo

- La aplicación usa Tailwind CSS vía CDN para prototipado rápido
- Los mapas usan OpenStreetMap como proveedor de tiles
- Las coordenadas por defecto están centradas en Santiago, Chile (-33.426, -70.61)
- Los datos son mock/demo - no hay conexión a backend aún

## 🔜 Próximos Pasos

- [ ] Integrar con backend API
- [ ] Implementar autenticación real
- [ ] Agregar gestión de estado (Context API o Zustand)
- [ ] Implementar subida de imágenes
- [ ] Agregar tests unitarios
- [ ] Optimizar Tailwind (usar PostCSS en lugar de CDN)
- [ ] Implementar PWA features
- [ ] Agregar internacionalización (i18n)

## 📄 Licencia

Este proyecto es parte de una plataforma municipal de gestión ciudadana.

---

Desarrollado con ❤️ para mejorar la gestión municipal
