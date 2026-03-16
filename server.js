import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar compresión gzip
app.use(compression());

 
// Servir archivos estáticos desde la carpeta dist
app.use(express.static(join(__dirname, 'dist')));

// Función para inyectar variables de entorno
// const injectEnvVariables = (html) => {
//   const envVars = {
//     VITE_BASE_URL_BACKEND: process.env.VITE_BASE_URL_BACKEND,
//     VITE_NODE_ENV: process.env.VITE_NODE_ENV,
//     VITE_CSRF_ENABLED: process.env.VITE_CSRF_ENABLED,
//     VITE_ALLOWED_ORIGINS: process.env.VITE_ALLOWED_ORIGINS,
//     VITE_ENCRYPTION_KEY: process.env.VITE_ENCRYPTION_KEY
//   };

//   const envScript = `<script>window.__ENV__ = ${JSON.stringify(envVars)}</script>`;
//   return html.replace('</head>', `${envScript}</head>`);
// };

// Manejar todas las rutas y servir index.html con variables inyectadas
app.get('/:any*', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, html) => {
    if (err) {
      console.error('Error al leer index.html:', err);
      return res.status(500).send('Error interno del servidor');
    }
    // const injectedHtml = injectEnvVariables(html);
    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  // console.log('Variables de entorno cargadas:', {
  //   BASE_URL: process.env.VITE_BASE_URL_BACKEND,
  //   NODE_ENV: process.env.VITE_NODE_ENV
  // });
}); 