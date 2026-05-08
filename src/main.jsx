import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css';
import App from './App.jsx';
import { validateEnvironment, logEnvironment } from './config/env';

// Validar variables de entorno
validateEnvironment();

// Log de configuración en desarrollo
logEnvironment();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
