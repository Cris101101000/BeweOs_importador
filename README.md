# Rsbuild project

## Setup

### NPM Configuration

Para instalar Aurora UI y utils necesitas esta clave de npm en tu `.npmrc`:

sudo nano ~/.npmrc
copiar y pegar el siguiente codigo
```bash
@beweco:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=TU_TOKEN_NPM_AQUI
```

### Install Dependencies

Install the dependencies:

```bash
bun install
```

Install Aurora UI and Utils:

```bash
npm install @beweco/aurora-ui
npm install @beweco/utils-js
```

### Configuración de Locales

Instala los locales antes de correr el proyecto:

```bash
npm run sync:locales
```

### Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias. Las variables deben tener el prefijo `REACT_APP_`:

```bash
# API Configuration
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=development

# Product Fruits (User Onboarding & Tooltips)
REACT_APP_PRODUCT_FRUITS_CODE=sgyepBOjLwRUVMG3
```

#### Product Fruits

Product Fruits es una plataforma de onboarding que proporciona tours, tooltips y guías para usuarios.

**Configuración:**
1. Añade `REACT_APP_PRODUCT_FRUITS_CODE` a tu `.env`
2. Reinicia el servidor: `npm run dev`
3. Product Fruits se activará automáticamente al iniciar sesión

**Características:**
- ✅ Integración automática usando `react-product-fruits` npm
- ✅ Identificación de usuarios solo con email
- ✅ Soporte multiidioma sincronizado con Tolgee
- ✅ Component-based (no carga manual de scripts)

**Documentación:** Ver `PRODUCT_FRUITS_SETUP_FINAL.md`

## Comando para commits

```bash 
chmod +x .husky/pre-commit
```

## Get started

Start the dev server:

```bash
bun dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```




