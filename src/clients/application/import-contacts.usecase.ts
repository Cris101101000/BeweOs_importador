import type { IImportContactsPort } from "@clients/domain/ports/import-contacts.port";
import type {
  IImportContact,
  IImportResult,
  IDuplicateContact,
} from "@clients/domain/interfaces/import-contact.interface";

export class ImportContactsUseCase {
  constructor(private readonly importPort: IImportContactsPort) {}

  async execute(
    contacts: IImportContact[],
    duplicates: IDuplicateContact[],
    onProgress: (progress: number, log: string) => void,
  ): Promise<IImportResult> {
    return this.importPort.importContacts(contacts, duplicates, onProgress);
  }
}
