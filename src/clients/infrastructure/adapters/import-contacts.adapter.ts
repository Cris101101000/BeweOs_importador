import type { IImportContactsPort } from "@clients/domain/ports/import-contacts.port";
import type {
  IImportContact,
  IImportResult,
  IDuplicateContact,
} from "@clients/domain/interfaces/import-contact.interface";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from "@clients/domain/constants/import-fields.constants";
import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { GetClientResponseDto } from "../dtos/get-client.dto";
import { ImportFileParserAdapter } from "./import-file-parser.adapter";
import { ImportAIExtractorAdapter } from "./import-ai-extractor.adapter";
import { ImportContactsMock } from "../mocks/import-contacts.mock";
import { LocalContactsStorageService } from "../services/local-contacts-storage.service";

const ACCEPTED_EXTENSIONS = ACCEPTED_FILE_TYPES.split(",");

const isMockMode = process.env.REACT_APP_USE_MOCK_DATA === "true";

/**
 * Mapea texto libre de estado al valor del enum.
 * Soporta español, inglés y portugués.
 */
const STATUS_TEXT_MAP: Record<string, string> = {
  lead: EnumClientStatus.LEAD,
  prospecto: EnumClientStatus.PROSPECT,
  prospect: EnumClientStatus.PROSPECT,
  cliente: EnumClientStatus.CLIENT,
  client: EnumClientStatus.CLIENT,
  "ex-cliente": EnumClientStatus.EX_CLIENT,
  "ex cliente": EnumClientStatus.EX_CLIENT,
  ex_client: EnumClientStatus.EX_CLIENT,
  "ex client": EnumClientStatus.EX_CLIENT,
  importado: EnumClientStatus.IMPORTED,
  imported: EnumClientStatus.IMPORTED,
};

function normalizeStatus(rawStatus: string | undefined): string {
  if (!rawStatus) return EnumClientStatus.IMPORTED;
  const normalized = rawStatus.trim().toLowerCase();
  return STATUS_TEXT_MAP[normalized] || EnumClientStatus.IMPORTED;
}

export class ImportContactsAdapter implements IImportContactsPort {
  private readonly fileParser = new ImportFileParserAdapter();
  private readonly aiExtractor = new ImportAIExtractorAdapter();
  private readonly mock = new ImportContactsMock();
  private readonly localStorage = LocalContactsStorageService.getInstance();

  async extractFromFile(
    file: File,
  ): Promise<{ headers: string[]; data: string[][] }> {
    this.validateFile(file);

    if (this.fileParser.isStructuredFile(file)) {
      return this.fileParser.parse(file);
    }
    return this.aiExtractor.extractFromFile(file);
  }

  private validateFile(file: File): void {
    const extension = file.name.match(/\.[^.]+$/)?.[0]?.toLowerCase() ?? "";

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      throw new Error(`Formato no soportado: ${extension}`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `El archivo excede el límite de ${MAX_FILE_SIZE_MB}MB`,
      );
    }
  }

  async extractFromText(
    text: string,
  ): Promise<{ headers: string[]; data: string[][] }> {
    return this.aiExtractor.extractFromText(text);
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
    const dto: GetClientResponseDto = {
      firstname: contact.firstName,
      lastname: contact.lastName,
      email: contact.email,
      formattedName: `${contact.firstName} ${contact.lastName || ""}`.trim(),
      status: normalizeStatus(contact.status),
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
      birthdate: contact.birthdate || undefined,
    };

    // Solo agregar etiquetas si vienen con datos
    if (contact.tags && contact.tags.length > 0) {
      dto.tags = contact.tags.map((tag) => ({
        title: tag.trim(),
        createdAt: new Date().toISOString(),
        createdBy: "import",
      }));
    }

    // Solo agregar notas si hay contenido real
    if (contact.notes && contact.notes.trim().length > 0) {
      dto.notes = [
        {
          content: contact.notes,
          createdAt: new Date().toISOString(),
          createdBy: "import",
        },
      ];
    }

    return dto;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
