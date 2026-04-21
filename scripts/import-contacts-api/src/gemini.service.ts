import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const EXTRACTION_PROMPT = `Eres un experto en extracción de datos de contacto. Analiza el contenido de este archivo y extrae TODOS los contactos que encuentres.

REGLAS:
1. Identifica cualquier formato: tablas, listas, texto libre, capturas de pantalla, conversaciones, etc.
2. Extrae estos campos cuando estén disponibles: Nombre, Apellido, Email, Teléfono, País, Etiquetas, Estado, Categoría, Género, Fecha de cumpleaños, Notas
3. Si un campo no existe para un contacto, deja el valor como cadena vacía ""
4. Si "Nombre" contiene nombre completo (ej: "Juan Pérez"), separa en Nombre y Apellido
5. Normaliza teléfonos: incluye código de país si es visible (ej: +57, +54, +55)
6. NO inventes datos. Solo extrae lo que realmente está en el archivo.
7. Si no encuentras contactos, devuelve arrays vacíos.

RESPONDE ÚNICAMENTE con JSON válido, sin markdown, sin explicaciones, con esta estructura exacta:
{
  "headers": ["Nombre", "Apellido", "Email", "Teléfono", "País", "Etiquetas", "Estado", "Categoría", "Género", "Fecha de cumpleaños", "Notas"],
  "data": [
    ["valor1", "valor2", ...],
    ["valor1", "valor2", ...]
  ]
}`;

const TEXT_EXTRACTION_PROMPT = `Eres un experto en extracción de datos de contacto. Analiza el siguiente texto y extrae TODOS los contactos que encuentres.

REGLAS:
1. Identifica cualquier formato: tablas, listas, texto libre, conversaciones de WhatsApp, notas, etc.
2. Extrae estos campos cuando estén disponibles: Nombre, Apellido, Email, Teléfono, País, Etiquetas, Estado, Categoría, Género, Fecha de cumpleaños, Notas
3. Si un campo no existe para un contacto, deja el valor como cadena vacía ""
4. Si "Nombre" contiene nombre completo (ej: "Juan Pérez"), separa en Nombre y Apellido
5. Normaliza teléfonos: incluye código de país si es visible (ej: +57, +54, +55)
6. NO inventes datos. Solo extrae lo que realmente está en el texto.
7. Si no encuentras contactos, devuelve arrays vacíos.

RESPONDE ÚNICAMENTE con JSON válido, sin markdown, sin explicaciones, con esta estructura exacta:
{
  "headers": ["Nombre", "Apellido", "Email", "Teléfono", "País", "Etiquetas", "Estado", "Categoría", "Género", "Fecha de cumpleaños", "Notas"],
  "data": [
    ["valor1", "valor2", ...],
    ["valor1", "valor2", ...]
  ]
}

TEXTO A ANALIZAR:
`;

export interface ExtractionResult {
  headers: string[];
  data: string[][];
}

export async function extractFromFile(
  fileBuffer: Buffer,
  mimeType: string,
): Promise<ExtractionResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      // @ts-ignore — thinkingConfig es válido en Gemini 2.5
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const result = await model.generateContent([
    { text: EXTRACTION_PROMPT },
    {
      inlineData: {
        mimeType,
        data: fileBuffer.toString("base64"),
      },
    },
  ]);

  const text = result.response.text();
  return parseGeminiResponse(text);
}

export async function extractFromText(
  text: string,
): Promise<ExtractionResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      // @ts-ignore — thinkingConfig es válido en Gemini 2.5
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const result = await model.generateContent(TEXT_EXTRACTION_PROMPT + text);

  const responseText = result.response.text();
  return parseGeminiResponse(responseText);
}

function parseGeminiResponse(text: string): ExtractionResult {
  // Limpiar respuesta: a veces Gemini envuelve en ```json ... ```
  const cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed.headers) || !Array.isArray(parsed.data)) {
    throw new Error("Respuesta de Gemini no tiene el formato esperado");
  }

  // Asegurar que cada fila tenga el mismo largo que headers
  const headerCount = parsed.headers.length;
  const normalizedData = parsed.data.map((row: string[]) => {
    const normalized = row.map((cell) => String(cell ?? ""));
    while (normalized.length < headerCount) normalized.push("");
    return normalized.slice(0, headerCount);
  });

  return {
    headers: parsed.headers.map(String),
    data: normalizedData,
  };
}
