import type {
  IImportContact,
  IImportResult,
  IDuplicateContact,
} from "@clients/domain/interfaces/import-contact.interface";

const MOCK_EXISTING_CONTACTS: IImportContact[] = [
  {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@ejemplo.com",
    phone: "+573001234567",
    country: "Colombia",
    tags: ["VIP"],
  },
  {
    firstName: "María",
    lastName: "López",
    email: "maria@ejemplo.com",
    phone: "+5491155667788",
    country: "Argentina",
    tags: ["Premium"],
  },
  {
    firstName: "Carlos",
    lastName: "Silva",
    email: "carlos@exemplo.com",
    phone: "+5511987654321",
    country: "Brasil",
  },
];

const MOCK_AI_EXTRACTED_HEADERS = [
  "Nombre",
  "Apellido",
  "Correo",
];

const MOCK_AI_EXTRACTED_DATA: string[][] = [
  ["Ana", "García", "ana@test.com"],
  ["Pedro", "Martínez", "pedro@test.com"],
  ["Juan", "Pérez", "juan@ejemplo.com"],
  ["Laura", "Torres", "laura@test.com"],
  ["Miguel", "Santos", "miguel@test.com"],
];

export class ImportContactsMock {
  async extractFromUnstructuredFile(
    _file: File,
  ): Promise<{ headers: string[]; data: string[][] }> {
    await this.simulateDelay(2000);
    return {
      headers: MOCK_AI_EXTRACTED_HEADERS,
      data: MOCK_AI_EXTRACTED_DATA,
    };
  }

  async extractFromText(
    _text: string,
  ): Promise<{ headers: string[]; data: string[][] }> {
    await this.simulateDelay(1500);
    return {
      headers: MOCK_AI_EXTRACTED_HEADERS,
      data: MOCK_AI_EXTRACTED_DATA.slice(0, 3),
    };
  }

  async detectDuplicates(
    contacts: IImportContact[],
  ): Promise<IDuplicateContact[]> {
    await this.simulateDelay(500);

    const duplicates: IDuplicateContact[] = [];

    for (const contact of contacts) {
      const existing = MOCK_EXISTING_CONTACTS.find(
        (ec) => ec.email.toLowerCase() === contact.email.toLowerCase(),
      );

      if (existing) {
        const changes: string[] = [];
        if (!existing.country && contact.country) changes.push("País");
        if (!existing.tags?.length && contact.tags?.length) changes.push("Etiquetas");
        if (!existing.phone && contact.phone) changes.push("Teléfono");

        duplicates.push({
          record: contact,
          existingContact: existing,
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
    const total = contacts.length;
    const batchSize = 500;
    const batches = Math.ceil(total / batchSize);
    let processed = 0;

    onProgress(0, "Validando formato de datos...");
    await this.simulateDelay(1000);
    onProgress(5, `${total} registros válidos`);

    onProgress(10, "Verificando duplicados...");
    await this.simulateDelay(1000);

    const duplicatesUpdating = duplicates.filter((d) => d.action === "update").length;
    const duplicatesSkipped = duplicates.filter((d) => d.action === "skip").length;

    onProgress(
      15,
      `${duplicates.length} duplicados procesados (${duplicatesUpdating} actualizar, ${duplicatesSkipped} omitir)`,
    );

    onProgress(20, "Creando contactos nuevos...");

    for (let i = 0; i < batches; i++) {
      const batchProgress = 20 + ((i + 1) / batches) * 75;
      processed = Math.min((i + 1) * batchSize, total);

      await this.simulateDelay(Math.max(1000, (batchSize / total) * 5000));

      onProgress(
        Math.round(batchProgress),
        `Lote ${i + 1}/${batches} completado (${processed} contactos)`,
      );
    }

    onProgress(100, "Importación completada");

    const created = total - duplicates.length;
    const updated = duplicatesUpdating;
    const failed = 0;

    return {
      created,
      updated,
      failed,
      totalProcessed: created + updated,
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
