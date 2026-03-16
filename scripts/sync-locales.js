// Cargar variables de entorno desde .env
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar las funciones de la librería
import { downloadTranslations } from '@beweco/utils-js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener la ruta de locales con fallback
const getLocalesPath = () => {
  return process.env.REACT_APP_TOLGEE_LOCALES_PATH || path.join(__dirname, '..', 'src', 'locales');
};

async function syncLocales() {
  try {
    console.log('🔄 Iniciando sincronización de locales...');

    // Obtener variables de entorno
    const apiKey = process.env.REACT_APP_TOLGEE_API_KEY;
    const projectId = process.env.REACT_APP_TOLGEE_PROJECT_ID || '2';
    const baseUrl = process.env.REACT_APP_TOLGEE_API_URL;

    console.log('🔍 Variables de entorno encontradas:');
    console.log(`   API Key: ${apiKey ? '✅ Presente' : '❌ Faltante'}`);
    console.log(`   Project ID: ${projectId}`);
    console.log(`   Base URL: ${baseUrl ? '✅ Presente' : '❌ Faltante'}`);
    console.log(`   Locales Path: ${getLocalesPath()}`);

    if (!apiKey || !baseUrl) {
      throw new Error('❌ Faltan variables de entorno: REACT_APP_TOLGEE_API_KEY o REACT_APP_TOLGEE_API_URL');
    }

    console.log(`📡 Descargando traducciones desde Tolgee...`);
    console.log(`   Project ID: ${projectId}`);
    console.log(`   Base URL: ${baseUrl}`);

    // Descargar traducciones
    const result = await downloadTranslations({
      apiKey,
      projectId,
      baseUrl,
      // namespace: 'proyect', // opcional: filtrar por namespace
    });

    console.log(`✅ Traducciones descargadas exitosamente`);
    console.log(`   Idiomas disponibles: ${result.languages.map(lang => lang.tag).join(', ')}`);

    // Crear directorio locales si no existe
    const localesDir = getLocalesPath();
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
      console.log(`📁 Directorio creado: ${localesDir}`);
    }

    // Guardar cada idioma en su propio archivo
    let totalFiles = 0;
    for (const [language, namespaces] of Object.entries(result.translations)) {
      const languageDir = path.join(localesDir, language);
      
      // Crear directorio del idioma si no existe
      if (!fs.existsSync(languageDir)) {
        fs.mkdirSync(languageDir, { recursive: true });
      }

      // Guardar cada namespace en un archivo separado
      for (const [namespace, translationsData] of Object.entries(namespaces)) {
        const filePath = path.join(languageDir, `${namespace}.json`);
        const jsonContent = JSON.stringify(translationsData, null, 2);
        
        fs.writeFileSync(filePath, jsonContent, 'utf8');
        console.log(`💾 Archivo guardado: ${filePath}`);
        totalFiles++;
      }
    }

    console.log(`\n🎉 Sincronización completada exitosamente!`);
    console.log(`   Total de archivos creados: ${totalFiles}`);
    console.log(`   Ubicación: ${localesDir}`);

  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
syncLocales(); 