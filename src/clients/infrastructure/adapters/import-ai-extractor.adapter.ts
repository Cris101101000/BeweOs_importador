const AI_EXTRACT_URL = import.meta.env.VITE_AI_EXTRACT_URL || "http://localhost:3001";

interface AIExtractionResult {
  headers: string[];
  data: string[][];
  totalRecords: number;
}

export class ImportAIExtractorAdapter {
  async extractFromFile(file: File): Promise<AIExtractionResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${AI_EXTRACT_URL}/extract`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Error de conexión con el servicio de extracción",
      }));
      throw new Error(error.error || `Error ${response.status}`);
    }

    return response.json();
  }

  async extractFromText(text: string): Promise<AIExtractionResult> {
    const response = await fetch(`${AI_EXTRACT_URL}/extract-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Error de conexión con el servicio de extracción",
      }));
      throw new Error(error.error || `Error ${response.status}`);
    }

    return response.json();
  }
}
