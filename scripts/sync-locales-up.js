// Cargar variables de entorno desde .env
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar las funciones de la librería
import { uploadOnlyNewKeysToTolgee } from '@beweco/utils-js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener la ruta de locales con fallback
const getLocalesPath = () => {
  return process.env.REACT_APP_TOLGEE_LOCALES_PATH || path.join(__dirname, '..', 'src', 'locales');
};

async function syncLocalesUp() {
  try {
    console.log('🔄 Iniciando subida de locales en español a Tolgee...');

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

    // Directorio de locales
    const localesDir = getLocalesPath();
    
    if (!fs.existsSync(localesDir)) {
      throw new Error(`❌ Directorio de locales no encontrado: ${localesDir}`);
    }

    console.log(`📁 Escaneando directorio: ${localesDir}`);

    let totalUploaded = 0;
    let totalSkipped = 0;

    // Procesar solo el idioma español
    const language = 'es';
    const languageDir = path.join(localesDir, language);

    if (!fs.existsSync(languageDir)) {
      throw new Error(`❌ Directorio de español no encontrado: ${languageDir}`);
    }

    const namespaces = fs.readdirSync(languageDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json'))
      .map(dirent => dirent.name.replace('.json', ''));

    console.log(`\n📂 Procesando traducciones en español`);
    console.log(`   Namespaces encontrados: ${namespaces.join(', ')}`);

    // Procesar cada namespace
    for (const namespace of namespaces) {
      const filePath = path.join(languageDir, `${namespace}.json`);
      
      try {
        // Leer archivo JSON
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(fileContent);

        console.log(`   📤 Subiendo namespace: ${namespace} (${Object.keys(translations).length} traducciones)`);

        // Subir traducciones usando es como código de idioma para Tolgee
        const result = await uploadOnlyNewKeysToTolgee({
          apiKey,
          projectId,
          language: 'es',
          namespace,
          data: translations,
          baseUrl,
          forceUpdate: true // Forzar actualización de las traducciones
        });

        if (result.uploaded > 0) {
          console.log(`   ✅ Subidas: ${result.uploaded} traducciones nuevas`);
          totalUploaded += result.uploaded;
        } else {
          console.log(`   ⏭️  Omitidas: No hay traducciones nuevas`);
          totalSkipped += Object.keys(translations).length;
        }

      } catch (error) {
        console.error(`   ❌ Error procesando ${namespace}:`, error.message);
        console.error(`   Detalles completos del error:`, error);
      }
    }

    console.log(`\n🎉 Sincronización completada!`);
    console.log(`   📤 Total subidas: ${totalUploaded}`);
    console.log(`   ⏭️  Total omitidas: ${totalSkipped}`);
    console.log(`   📁 Directorio procesado: ${languageDir}`);

  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
    console.error('Detalles completos del error:', error);
    process.exit(1);
  }
}

// Ejecutar el script
syncLocalesUp();