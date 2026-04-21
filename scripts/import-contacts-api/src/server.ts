import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { extractFromFile, extractFromText } from "./gemini.service.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;
const MAX_RECORDS = Number(process.env.MAX_IMPORT_RECORDS || 5000);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Mapeo de extensiones a MIME types para Gemini
const MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
};

const ACCEPTED_EXTENSIONS = Object.keys(MIME_MAP);

app.post("/extract", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No se recibió ningún archivo" });
      return;
    }

    const extension = file.originalname.match(/\.[^.]+$/)?.[0]?.toLowerCase() ?? "";
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      res.status(400).json({ error: `Formato no soportado: ${extension}` });
      return;
    }

    const mimeType = MIME_MAP[extension] || file.mimetype;

    console.log(`Procesando: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB) → Gemini`);

    const result = await extractFromFile(file.buffer, mimeType);

    if (result.data.length > MAX_RECORDS) {
      res.status(400).json({
        error: `El archivo excede el límite de ${MAX_RECORDS} registros (${result.data.length} detectados). Divide tu archivo en partes más pequeñas.`,
      });
      return;
    }

    console.log(`Extraídos: ${result.data.length} contactos, ${result.headers.length} columnas`);

    res.json({
      headers: result.headers,
      data: result.data,
      totalRecords: result.data.length,
    });
  } catch (error) {
    console.error("Error en /extract:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: `Error al procesar archivo: ${message}` });
  }
});

app.post("/extract-text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ error: "No se recibió texto" });
      return;
    }

    console.log(`Procesando texto (${text.length} caracteres) → Gemini`);

    const result = await extractFromText(text);

    if (result.data.length > MAX_RECORDS) {
      res.status(400).json({
        error: `El texto excede el límite de ${MAX_RECORDS} registros (${result.data.length} detectados).`,
      });
      return;
    }

    console.log(`Extraídos: ${result.data.length} contactos, ${result.headers.length} columnas`);

    res.json({
      headers: result.headers,
      data: result.data,
      totalRecords: result.data.length,
    });
  } catch (error) {
    console.error("Error en /extract-text:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: `Error al procesar texto: ${message}` });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: "gemini-2.5-flash" });
});

app.listen(PORT, () => {
  console.log(`Import Contacts API corriendo en http://localhost:${PORT}`);
  console.log(`  POST /extract      → Envía archivo (multipart/form-data)`);
  console.log(`  POST /extract-text → Envía texto plano (JSON body)`);
  console.log(`  GET  /health       → Estado del servicio`);
});
