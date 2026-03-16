import type { IImportContactsPort } from "@clients/domain/ports/import-contacts.port";
import type {
  IImportContact,
  IDuplicateContact,
} from "@clients/domain/interfaces/import-contact.interface";

export class DetectDuplicatesUseCase {
  constructor(private readonly importPort: IImportContactsPort) {}

  async execute(contacts: IImportContact[]): Promise<IDuplicateContact[]> {
    return this.importPort.detectDuplicates(contacts);
  }
}
