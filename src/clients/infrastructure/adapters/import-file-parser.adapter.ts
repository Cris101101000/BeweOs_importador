import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  STRUCTURED_FILE_TYPES,
  MAX_IMPORT_RECORDS,
} from "@clients/domain/constants/import-fields.constants";

interface ParseResult {
  headers: string[];
  data: string[][];
  totalRecords: number;
}

export class ImportFileParserAdapter {
  async parse(file: File): Promise<ParseResult> {
    const extension = this.getExtension(file.name);

    if ([".csv"].includes(extension)) {
      return this.parseCSV(file);
    }

    if ([".xlsx", ".xls"].includes(extension)) {
      return this.parseExcel(file);
    }

    throw new Error(`Formato no soportado: ${extension}`);
  }

  isStructuredFile(file: File): boolean {
    const ext = this.getExtension(file.name);
    return STRUCTURED_FILE_TYPES.includes(ext);
  }

  private async parseCSV(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          const rawData = results.data as string[][];

          if (rawData.length === 0) {
            reject(new Error("El archivo no contiene datos"));
            return;
          }

          if (rawData.length - 1 > MAX_IMPORT_RECORDS) {
            reject(
              new Error(
                `El archivo excede el límite de ${MAX_IMPORT_RECORDS} registros. Divide tu archivo en partes más pequeñas.`,
              ),
            );
            return;
          }

          const headers = rawData[0] ?? [];
          const data = rawData.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));

          resolve({
            headers,
            data,
            totalRecords: data.length,
          });
        },
        error: (error) => {
          reject(new Error(`Error al leer CSV: ${error.message}`));
        },
        skipEmptyLines: true,
      });
    });
  }

  private async parseExcel(file: File): Promise<ParseResult> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error("El archivo Excel no contiene hojas");
    }

    const worksheet = workbook.Sheets[firstSheetName];

    if (!worksheet) {
      throw new Error("No se pudo leer la hoja del archivo Excel");
    }

    const rawData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });

    if (rawData.length === 0) {
      throw new Error("El archivo no contiene datos");
    }

    if (rawData.length - 1 > MAX_IMPORT_RECORDS) {
      throw new Error(
        `El archivo excede el límite de ${MAX_IMPORT_RECORDS} registros. Divide tu archivo en partes más pequeñas.`,
      );
    }

    const headers = (rawData[0] ?? []).map(String);
    const data = rawData.slice(1).filter((row) => row.some((cell) => String(cell).trim() !== ""));

    return {
      headers: headers,
      data: data.map((row) => row.map(String)),
      totalRecords: data.length,
    };
  }

  private getExtension(filename: string): string {
    const match = filename.match(/\.[^.]+$/);
    return match ? match[0].toLowerCase() : "";
  }
}
