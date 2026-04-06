import type { IImportContactsPort } from "@clients/domain/ports/import-contacts.port";

interface ValidateImportFileResult {
  headers: string[];
  data: string[][];
  totalRecords: number;
  extractionSource: "parser" | "ai";
}

export class ValidateImportFileUseCase {
  constructor(private readonly importPort: IImportContactsPort) {}

  async executeWithFile(file: File): Promise<ValidateImportFileResult> {
    const result = await this.importPort.extractFromFile(file);

    const isStructured = [".csv", ".xlsx", ".xls"].some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    return {
      headers: result.headers,
      data: result.data,
      totalRecords: result.data.length,
      extractionSource: isStructured ? "parser" : "ai",
    };
  }

  async executeWithText(text: string): Promise<ValidateImportFileResult> {
    const result = await this.importPort.extractFromText(text);

    return {
      headers: result.headers,
      data: result.data,
      totalRecords: result.data.length,
      extractionSource: "ai",
    };
  }
}
