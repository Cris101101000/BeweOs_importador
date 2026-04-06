# Configuración de Secretos y Tokens

Este documento explica qué tokens y credenciales necesitas para correr el proyecto localmente.

---

## 1. Token de NPM (`.npmrc`)

**Qué es:** Token de acceso a los paquetes privados de `@beweco` en npm (aurora-ui, utils-js).

**Dónde ponerlo:** Archivo `.npmrc` en la raíz del proyecto.

**Pasos:**
1. Copia el archivo de ejemplo:
   ```bash
   cp .npmrc.example .npmrc
   ```
2. Reemplaza `TU_TOKEN_NPM_AQUI` con el token real de npm.

**Formato del archivo `.npmrc`:**
```
@beweco:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=npm_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**¿Dónde obtener el token?** Pídelo al equipo de desarrollo de Bewe o genera uno en https://www.npmjs.com/settings/tokens

---

## 2. Variables de Entorno (`.env`)

**Qué es:** Variables de configuración para APIs, servicios externos y micro frontends.

**Dónde ponerlo:** Archivo `.env` en la raíz del proyecto.

**Pasos:**
1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. Reemplaza los valores marcados con `TU_*` con los valores reales.

### Variables que requieren tokens reales:

| Variable | Descripción | Dónde obtenerlo |
|----------|-------------|-----------------|
| `REACT_APP_TOLGEE_API_KEY` | API key de Tolgee (i18n/traducciones) | Panel de Tolgee del proyecto |
| `REACT_APP_USER_GUIDING_CONTAINER_KEY` | Key de UserGuiding (onboarding) | Panel de UserGuiding |
| `REACT_APP_PRODUCT_FRUITS_CODE` | Código de Product Fruits (opcional) | Panel de Product Fruits |

### Variables con valores por defecto (no necesitan cambio para desarrollo local):

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `REACT_APP_BASE_URL_BACKEND` | `https://api-gateway-qa.beweos.io` | API Gateway de QA |
| `REACT_APP_TOLGEE_API_URL` | `https://locales-qa.beweos.io` | Servidor de traducciones |
| `REACT_APP_LOGIN_URL` | `http://localhost:3004` | URL del micro frontend de login |
| `MICRO_FRONT_LINDABUSSINESS` | `http://localhost:3005/remoteEntry.js` | Micro frontend Linda Business |
| `REACT_APP_USE_MOCK_DATA` | `true` | Usar datos mock en desarrollo |
| `REACT_APP_FILESTACK_CONTAINER` | `media-bewe-os-dev` | Bucket de Filestack para dev |
| `REACT_APP_WS_BASE_URL` | `https://api-gateway-qa.beweos.io` | WebSocket URL |

---

## 3. Resumen rápido

```bash
# 1. Configurar npm
cp .npmrc.example .npmrc
# Editar .npmrc con el token real

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con los tokens reales

# 3. Instalar dependencias
bun install

# 4. Sincronizar traducciones
npm run sync:locales

# 5. Iniciar desarrollo
bun run dev
```

---

> **Importante:** NUNCA subas los archivos `.npmrc` ni `.env` al repositorio. Ambos están en `.gitignore`.
