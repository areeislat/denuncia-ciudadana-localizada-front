# 🔐 Variables de Entorno - DESIGEO

Guía completa para manejar variables de entorno de forma segura en desarrollo y producción.

---

## 📋 Tabla de Contenidos

1. [Conceptos Básicos](#conceptos-básicos)
2. [Configuración Local](#configuración-local)
3. [Configuración en Vercel](#configuración-en-vercel)
4. [Mejores Prácticas](#mejores-prácticas)
5. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🎯 Conceptos Básicos

### ¿Qué son las Variables de Entorno?

Son valores que se definen fuera del código y se inyectan en tiempo de ejecución. Permiten:
- ✅ Mantener secretos fuera del código
- ✅ Cambiar configuración sin recompilar
- ✅ Diferentes valores por entorno (dev, staging, prod)
- ✅ Proteger credenciales sensibles

### ¿Por qué son importantes?

```javascript
// ❌ MAL - Credenciales en el código
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "admin123";

// ✅ BIEN - Variables de entorno
const API_KEY = import.meta.env.VITE_API_KEY;
const DB_PASSWORD = import.meta.env.VITE_DB_PASSWORD;
```

---

## 🛠️ Configuración Local

### Paso 1: Crear archivo `.env.local`

En la carpeta `desigeo-app/`, crea un archivo `.env.local`:

```bash
# Backend API
VITE_API_URL=http://localhost:3000
VITE_API_KEY=tu-api-key-local

# Autenticación
VITE_AUTH_TOKEN=token-local-para-testing

# Mapas (si usas API key)
VITE_MAPBOX_TOKEN=pk_test_xxxxx

# Base de datos (solo si necesitas en frontend)
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
```

### Paso 2: Agregar `.env.local` al `.gitignore`

Ya está agregado, pero verifica:

```bash
# En desigeo-app/.gitignore
.env
.env.local
.env.production
```

### Paso 3: Usar las variables en el código

```javascript
// En cualquier componente o página
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Ejemplo de fetch
async function fetchReports() {
  const response = await fetch(`${API_URL}/reports`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  return response.json();
}
```

### Paso 4: Crear archivo `.env.example`

Para que otros desarrolladores sepan qué variables necesitan:

```bash
# Backend API
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-api-key-here

# Autenticación
VITE_AUTH_TOKEN=your-auth-token-here

# Mapas
VITE_MAPBOX_TOKEN=your-mapbox-token-here

# Base de datos
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
```

---

## 🚀 Configuración en Vercel

### Método 1: Dashboard de Vercel (Recomendado)

#### Paso 1: Ir a Settings del Proyecto

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto `denuncia-ciudadana-localizada-front`
3. Click en **Settings**
4. En el menú lateral, click en **Environment Variables**

#### Paso 2: Agregar Variables

Click en **Add New** y completa:

```
Name: VITE_API_URL
Value: https://api.tudominio.com
Environments: Production, Preview, Development
```

Repite para cada variable:

```
VITE_API_KEY = tu-api-key-produccion
VITE_AUTH_TOKEN = tu-token-produccion
VITE_MAPBOX_TOKEN = tu-token-mapbox
```

#### Paso 3: Redeploy

Después de agregar variables, Vercel automáticamente redeploy. Si no:
1. Ve a **Deployments**
2. Click en el deployment más reciente
3. Click en **Redeploy**

### Método 2: CLI de Vercel

```bash
# Login en Vercel
vercel login

# Agregar variable
vercel env add VITE_API_URL
# Te pedirá el valor y en qué entornos

# Ver variables
vercel env ls

# Remover variable
vercel env rm VITE_API_URL
```

### Método 3: Archivo `vercel.json`

Crea o actualiza `desigeo-app/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api_url",
    "VITE_API_KEY": "@api_key",
    "VITE_AUTH_TOKEN": "@auth_token"
  }
}
```

Luego define los secretos en Vercel:
```bash
vercel secret add api_url https://api.tudominio.com
vercel secret add api_key tu-api-key
vercel secret add auth_token tu-token
```

---

## 🔒 Mejores Prácticas

### 1. Nunca Commitear Secretos

```bash
# ❌ NUNCA
git add .env
git commit -m "Add API keys"

# ✅ SIEMPRE
git add .env.example
git commit -m "Add env template"
```

### 2. Usar Prefijo `VITE_` para Variables Públicas

En Vite, solo las variables que comienzan con `VITE_` se exponen al cliente:

```javascript
// ✅ Disponible en el navegador
VITE_API_URL = import.meta.env.VITE_API_URL

// ❌ NO disponible (solo en servidor)
API_SECRET = import.meta.env.API_SECRET
```

### 3. Diferentes Valores por Entorno

Crea archivos separados:

```
desigeo-app/
├── .env                    # Base (nunca commitear)
├── .env.local              # Local (gitignored)
├── .env.development        # Desarrollo
├── .env.staging            # Staging
├── .env.production         # Producción
└── .env.example            # Template
```

### 4. Validar Variables al Iniciar

```javascript
// src/config/env.js
export const validateEnv = () => {
  const required = [
    'VITE_API_URL',
    'VITE_API_KEY',
  ];

  const missing = required.filter(
    (key) => !import.meta.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Variables de entorno faltantes: ${missing.join(', ')}`
    );
  }
};

// En main.jsx
import { validateEnv } from './config/env';
validateEnv();
```

### 5. Usar Tipos TypeScript (Opcional)

```typescript
// src/types/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Configuración de API

```javascript
// src/config/api.js
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

### Ejemplo 2: Usar en un Componente

```javascript
// src/pages/CiudadanoHome.jsx
import { useEffect, useState } from 'react';
import { apiClient } from '../config/api';

export default function CiudadanoHome() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiClient.get('/reports');
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {/* Mostrar reportes */}
    </div>
  );
}
```

### Ejemplo 3: Autenticación

```javascript
// src/config/auth.js
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token') || AUTH_TOKEN;
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};
```

---

## 🔄 Flujo Completo de Desarrollo

### 1. Desarrollo Local

```bash
# Crear .env.local
echo "VITE_API_URL=http://localhost:3000" > .env.local
echo "VITE_API_KEY=dev-key-123" >> .env.local

# Iniciar servidor
npm run dev

# Las variables se cargan automáticamente
```

### 2. Commit y Push

```bash
# .env.local NO se commitea (está en .gitignore)
git add .
git commit -m "feat: Add API integration"
git push origin main
```

### 3. Vercel Detecta Cambios

```
1. GitHub webhook notifica a Vercel
2. Vercel inicia build
3. Vercel inyecta variables de entorno
4. Build se completa
5. Deploy a producción
```

### 4. Verificar en Producción

```bash
# En la consola del navegador (en producción)
console.log(import.meta.env.VITE_API_URL)
// Output: https://api.tudominio.com
```

---

## 🛡️ Seguridad: Lo que NO Debes Hacer

### ❌ Nunca Expongas Secretos

```javascript
// ❌ MAL - Expone el token
const token = "sk-1234567890abcdef";
console.log(token);

// ✅ BIEN - Solo usa en headers
fetch(url, {
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
  }
});
```

### ❌ Nunca Commitees `.env`

```bash
# ❌ MAL
git add .env
git commit -m "Add env"

# ✅ BIEN
git add .env.example
git commit -m "Add env template"
```

### ❌ Nunca Hardcodees URLs de Producción

```javascript
// ❌ MAL
const API_URL = "https://api.produccion.com";

// ✅ BIEN
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 📊 Comparativa: Local vs Vercel

| Aspecto | Local | Vercel |
|---------|-------|--------|
| Archivo | `.env.local` | Dashboard/CLI |
| Visibilidad | Solo local | Encriptado en Vercel |
| Cambios | Editar archivo | Redeploy automático |
| Secretos | Seguros (gitignored) | Muy seguros (encriptados) |
| Acceso | Solo tú | Solo tú + equipo |

---

## 🚨 Checklist de Seguridad

Antes de desplegar a producción:

- [ ] `.env.local` está en `.gitignore`
- [ ] `.env.example` está en el repo (sin valores reales)
- [ ] Variables sensibles están en Vercel
- [ ] No hay secretos en el código
- [ ] URLs de API usan variables de entorno
- [ ] Tokens se inyectan en headers, no en URLs
- [ ] Build local funciona con `.env.local`
- [ ] Build en Vercel funciona con variables de Vercel

---

## 🔗 Recursos Útiles

- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [12 Factor App - Config](https://12factor.net/config)
- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 📞 Soporte

Si tienes problemas:

1. **Variables no se cargan**: Verifica que comienzan con `VITE_`
2. **Valores undefined**: Revisa `.env.local` existe y tiene valores
3. **Cambios no se aplican**: Reinicia `npm run dev`
4. **Vercel no ve variables**: Redeploy desde dashboard

---

## ✅ Próximos Pasos

1. Crear `.env.local` con tus valores
2. Crear `.env.example` como template
3. Agregar variables en Vercel
4. Implementar `apiClient` en tu código
5. Probar en local y producción

---

**Última actualización:** Mayo 2026
**Versión:** 1.0.0

¡Tu aplicación está lista para conectarse de forma segura con el backend! 🔐
