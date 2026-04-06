import type { IImportContactsPort } from "@clients/domain/ports/import-contacts.port";
import type {
  IImportContact,
  IImportResult,
  IDuplicateContact,
} from "@clients/domain/interfaces/import-contact.interface";
import type { GetClientResponseDto } from "../dtos/get-client.dto";
import { ImportFileParserAdapter } from "./import-file-parser.adapter";
import { ImportContactsMock } from "../mocks/import-contacts.mock";
import { LocalContactsStorageService } from "../services/local-contacts-storage.service";

const isMockMode = process.env.REACT_APP_USE_MOCK_DATA === "true";

export class ImportContactsAdapter implements IImportContactsPort {
  private readonly fileParser = new ImportFileParserAdapter();
  private readonly mock = new ImportContactsMock();
  private readonly localStorage = LocalContactsStorageService.getInstance();

  async extractFromFile(
    file: File,
  ): Promise<{ headers: string[]; data: string[][] }> {
    if (this.fileParser.isStructuredFile(file)) {
      return this.fileParser.parse(file);
    }
    return this.mock.extractFromUnstructuredFile(file);
  }

  async extractFromText(
    text: string,
  ): Promise<{ headers: string[]; data: string[][] }> {
    return this.mock.extractFromText(text);
  }

  async detectDuplicates(
    contacts: IImportContact[],
  ): Promise<IDuplicateContact[]> {
    if (!isMockMode) {
      return this.mock.detectDuplicates(contacts);
    }

    // Detectar duplicados contra localStorage
    const emails = contacts.map((c) => c.email).filter(Boolean);
    const existingMap = this.localStorage.findDuplicatesByEmail(emails);

    const duplicates: IDuplicateContact[] = [];
    for (const contact of contacts) {
      const existing = existingMap.get(contact.email?.toLowerCase());
      if (existing) {
        const changes: string[] = [];
        if (!existing.phones?.length && contact.phone) changes.push("Teléfono");
        if (contact.tags?.length) changes.push("Etiquetas");

        duplicates.push({
          record: contact,
          existingContact: {
            firstName: existing.firstname || "",
            lastName: existing.lastname || "",
            email: existing.email || "",
            phone: existing.phones?.[0]?.number || "",
            country: existing.address?.country || "",
          },
          action: "update",
          changesDetail:
            changes.length > 0
              ? `Agrega: ${changes.join(", ")}`
              : "Sin cambios nuevos",
        });
      }
    }

    return duplicates;
  }

  async importContacts(
    contacts: IImportContact[],
    duplicates: IDuplicateContact[],
    onProgress: (progress: number, log: string) => void,
  ): Promise<IImportResult> {
    if (!isMockMode) {
      return this.mock.importContacts(contacts, duplicates, onProgress);
    }

    // Persistencia real en localStorage
    const total = contacts.length;

    onProgress(0, "Validando formato de datos...");
    await this.delay(500);
    onProgress(5, `${total} registros válidos`);

    onProgress(10, "Verificando duplicados...");
    await this.delay(500);

    const duplicatesUpdating = duplicates.filter((d) => d.action === "update").length;
    const duplicatesSkipped = duplicates.filter((d) => d.action === "skip").length;

    onProgress(
      15,
      `${duplicates.length} duplicados procesados (${duplicatesUpdating} actualizar, ${duplicatesSkipped} omitir)`,
    );

    onProgress(20, "Creando contactos nuevos...");

    // Convertir IImportContact[] a GetClientResponseDto[]
    const skippedEmails = new Set(
      duplicates.filter((d) => d.action === "skip").map((d) => d.record.email?.toLowerCase()),
    );

    const contactDtos: GetClientResponseDto[] = contacts
      .filter((c) => !skippedEmails.has(c.email?.toLowerCase()))
      .map((c) => this.toClientDto(c));

    // Guardar en localStorage con progreso
    const result = this.localStorage.bulkSave(contactDtos, onProgress);

    onProgress(100, "Importación completada");
    await this.delay(300);

    onProgress(
      100,
      `Importación completada: ${result.created} creados, ${result.updated} actualizados, ${result.failed} errores`,
    );

    return {
      created: result.created,
      updated: result.updated,
      failed: result.failed,
      totalProcessed: result.created + result.updated,
    };
  }

  /**
   * Convierte un IImportContact a GetClientResponseDto para almacenar
   */
  private toClientDto(contact: IImportContact): GetClientResponseDto {
    return {
      firstname: contact.firstName,
      lastname: contact.lastName,
      email: contact.email,
      formattedName: `${contact.firstName} ${contact.lastName}`.trim(),
      status: contact.status || "prospect",
      gender: contact.gender,
      phones: contact.phone
        ? [
            {
              number: contact.phone.replace(/[^\d+]/g, ""),
              code: "",
              country: contact.country || "",
            },
          ]
        : [],
      isActive: true,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
