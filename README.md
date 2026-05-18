# 🌍 Denuncia Ciudadana Localizada - Frontend

Sistema de denuncias ciudadanas con geolocalización, desarrollado en **React + Vite** con mapas interactivos, autenticación y roles de usuario.

---

## 📋 Requisitos Previos

- **Node.js** v18+ ([descargar](https://nodejs.org/))
- **npm** v9+ (incluido con Node.js)
- **Backend API** ejecutándose en `http://localhost:8080` (por defecto)

---

## 🚀 Instalación Local

### 1. Clonar el repositorio (si aún no está clonado)

```bash
git clone <URL_DEL_REPOSITORIO>
cd denuncia-ciudadana-localizada-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.local` (ya incluido) y ajusta los valores según tu entorno:

```bash
# .env.local
VITE_API_URL=http://localhost:8080
VITE_API_KEY=  # Si es necesario
```

**Variables disponibles:**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend API | `http://localhost:8080` |
| `VITE_API_KEY` | API Key para autenticación (si aplica) | `sk_xxxxx` |
| `VITE_AUTH_TOKEN` | Token de autenticación inicial | - |
| `VITE_MAPBOX_TOKEN` | Token de Mapbox para mapas (opcional) | `pk_xxxxx` |
| `VITE_APP_ENV` | Ambiente (`development`, `production`) | `development` |

---

## 💻 Comandos Disponibles

### Desarrollo local

```bash
npm run dev
```

- Inicia el servidor de desarrollo en `http://localhost:5173`
- Con hot-reload automático
- Accede a la aplicación desde tu navegador

### Build para producción

```bash
npm run build
```

- Compila el proyecto para producción
- Los archivos compilados se guardan en la carpeta `dist/`

### Preview de la build

```bash
npm run preview
```

- Previsualiza la versión compilada localmente

### Linting

```bash
npm run lint
```

- Verifica el código con ESLint

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Footer.jsx
│   ├── Header.jsx
│   └── MapComponent.jsx
├── config/              # Configuración centralizada
│   ├── api.js          # Cliente de API (Axios)
│   └── env.js          # Variables de entorno
├── hooks/              # Custom React hooks
│   └── useApi.js
├── pages/              # Páginas principales
│   ├── Ayuda.jsx
│   ├── TerminosYPrivacidad.jsx
│   ├── Transparencia.jsx
│   ├── ciudadano/      # Módulo de ciudadanos
│   ├── municipal/      # Módulo de municipalidades
│   └── public/         # Páginas públicas (Login, Registro)
├── services/           # Servicios de negocio
│   └── authService.js
├── store/              # Estado global (Zustand)
│   └── authStore.js
├── App.jsx            # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

---

## 🔑 Autenticación y Roles

La aplicación soporta múltiples roles de usuario:

### 👤 Ciudadano
- Crear nuevas denuncias
- Ver el mapa de denuncias
- Consultar el estado de sus reportes
- Perfil personal

### 👮 Oficial Municipal
- Gestionar usuarios municipales
- Ver denuncias del municipio
- Cambiar estado de reportes

### 🏛️ Admin Municipal
- Gestión completa de usuarios
- Estadísticas y reportes
- Configuración del municipio

### 🔐 Super Admin
- Auditoría de logs
- Gestión de municipalidades
- Gestión global de usuarios

---

## 🗺️ Mapas Interactivos

La aplicación utiliza **Leaflet** y **React-Leaflet** para mostrar mapas interactivos.

### Configuración:

1. Si necesitas usar **Mapbox**, agrega tu token en `.env.local`:
   ```bash
   VITE_MAPBOX_TOKEN=pk_your_token_here
   ```

2. El componente `MapComponent.jsx` maneja toda la lógica de geolocalización

---

## 🔄 Servicio de API

El cliente de API está configurado en [src/config/api.js](src/config/api.js) con:

- ✅ Interceptores de request (agregan el token automáticamente)
- ✅ Interceptores de response (manejan errores 401)
- ✅ Redireccionamiento a login si expira la sesión

### Ejemplo de uso:

```javascript
import apiClient from '@/config/api';

// GET request
const reports = await apiClient.get('/reports');

// POST request
const newReport = await apiClient.post('/reports', {
  title: 'Nueva denuncia',
  location: { lat: -34.9, lng: -56.1 }
});
```

---

## 🐛 Solución de Problemas

### Error: "VITE_API_URL no definida"

**Solución:** Asegúrate que el archivo `.env.local` exista en la raíz del proyecto:

```bash
# Desde la carpeta del proyecto
cat .env.local
```

### Error: "Conexión rechazada a localhost:8080"

**Posibles causas:**
- El backend no está ejecutándose
- El puerto 8080 está ocupado
- La URL en `.env.local` es incorrecta

**Solución:**
1. Verifica que el backend esté corriendo
2. Cambia el puerto en `.env.local` si es necesario
3. Usa `netstat -ano | findstr :8080` (Windows) o `lsof -i :8080` (Mac/Linux) para verificar

### Error: "npm run dev falla con Exit Code 1"

**Solución:**
1. Elimina `node_modules` y `package-lock.json`
2. Reinstala dependencias:
   ```bash
   npm install
   npm run dev
   ```

---

## 📦 Dependencias Principales

| Librería | Versión | Propósito |
|----------|---------|-----------|
| React | ^19.2.5 | Framework UI |
| Vite | ^8.0.10 | Build tool |
| React Router | ^7.15.0 | Enrutamiento |
| Axios | ^1.16.0 | Cliente HTTP |
| Leaflet + React-Leaflet | ^1.9.4 / ^5.0.0 | Mapas interactivos |
| Zustand | ^5.0.13 | Gestión de estado |
| ReCharts | ^3.8.1 | Gráficos |

---

## 🔐 Variables de Entorno Detalladas

Ver el archivo completo de documentación en [VARIABLES_ENTORNO.md](VARIABLES_ENTORNO.md)

---

## 📝 Deploy en Producción

La aplicación está configurada para deplegar en **Vercel**. Ver [vercel.json](vercel.json) y [deploy.ps1](deploy.ps1)

### Deploy automático:
```bash
npm run build
```

### Deploy manual a Vercel:
```bash
# Requiere Vercel CLI
vercel deploy --prod
```

---

## 📚 Recursos Útiles

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)
- [Documentación de React Router](https://reactrouter.com/)
- [Documentación de Leaflet](https://leafletjs.com/)
- [Documentación de Zustand](https://github.com/pmndrs/zustand)

---

## 👥 Contribuyentes

Si encuentras bugs o tienes sugerencias, por favor abre un issue o crea un pull request.

---

## 📄 Licencia

Este proyecto está bajo licencia [MIT](LICENSE).
