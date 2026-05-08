# 🚀 Guía de Despliegue DESIGEO

## Paso 1: Preparar el Proyecto

```bash
cd desigeo-app

# Asegúrate de que todo funciona localmente
npm install
npm run build

# Verifica que la build funciona
npm run preview
```

## Paso 2: Subir a GitHub

```bash
# Si aún no has inicializado Git
git init

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "feat: Initial commit - DESIGEO React application"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/areeislat/denuncia-ciudadana-localizada-front.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

## Paso 3: Desplegar en Vercel

### Opción A: Desde el Dashboard de Vercel (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en "Add New Project"
3. Importa el repositorio `denuncia-ciudadana-localizada-front`
4. Vercel detectará automáticamente que es un proyecto Vite
5. Configuración automática:
   - **Framework Preset**: Vite
   - **Root Directory**: `desigeo-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Haz clic en "Deploy"
7. ¡Listo! Tu app estará en línea en ~2 minutos

### Opción B: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Desde la carpeta desigeo-app
cd desigeo-app

# Login en Vercel
vercel login

# Desplegar (primera vez)
vercel

# Responde las preguntas:
# - Set up and deploy? Yes
# - Which scope? Tu cuenta
# - Link to existing project? No
# - Project name? desigeo-front (o el que prefieras)
# - Directory? ./ (actual)
# - Override settings? No

# Para desplegar a producción
vercel --prod
```

## Paso 4: Configurar Dominio Personalizado (Opcional)

1. En el dashboard de Vercel, ve a tu proyecto
2. Ve a "Settings" > "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar los DNS

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
# Hacer cambios en el código
# ...

# Commit y push
git add .
git commit -m "feat: descripción de los cambios"
git push

# Vercel desplegará automáticamente los cambios
```

## 🌐 URLs Esperadas

Después del despliegue tendrás:

- **Producción**: `https://tu-proyecto.vercel.app`
- **Preview**: URLs únicas para cada branch/PR
- **Dominio personalizado**: `https://tudominio.com` (si lo configuras)

## ✅ Verificación Post-Despliegue

Verifica que estas rutas funcionen:

- ✅ `/` - Página de inicio
- ✅ `/login` - Login
- ✅ `/registro` - Registro
- ✅ `/ciudadano` - Dashboard ciudadano
- ✅ `/panel` - Panel municipal

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error en el build
```bash
# Verifica que el build funciona localmente
npm run build
npm run preview
```

### Rutas no funcionan en producción
- Verifica que existe el archivo `vercel.json` con la configuración de rewrites
- Este archivo ya está incluido en el proyecto

### Mapas no se muestran
- Verifica que Leaflet CSS se está cargando correctamente
- Revisa la consola del navegador para errores

## 📊 Monitoreo

Vercel proporciona:
- Analytics de tráfico
- Logs de build
- Logs de funciones
- Métricas de performance

Accede desde el dashboard de tu proyecto en Vercel.

## 🔐 Variables de Entorno (Para futuro)

Cuando conectes con un backend:

1. En Vercel Dashboard > Settings > Environment Variables
2. Agrega:
   ```
   VITE_API_URL=https://tu-api.com
   VITE_MAP_API_KEY=tu-key-si-usas-mapbox
   ```
3. Redeploy para aplicar cambios

## 📞 Soporte

- Documentación Vercel: https://vercel.com/docs
- Documentación Vite: https://vitejs.dev
- Documentación React Router: https://reactrouter.com

---

¡Tu aplicación DESIGEO está lista para producción! 🎉
