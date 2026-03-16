import type { IImportContactsPort } from "@clients/domain/ports/import-contacts.port";
import type {
  IImportContact,
  IImportResult,
  IDuplicateContact,
} from "@clients/domain/interfaces/import-contact.interface";
import { ImportFileParserAdapter } from "./import-file-parser.adapter";
import { ImportContactsMock } from "../mocks/import-contacts.mock";

export class ImportContactsAdapter implements IImportContactsPort {
  private readonly fileParser = new ImportFileParserAdapter();
  private readonly mock = new ImportContactsMock();

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
    return this.mock.detectDuplicates(contacts);
  }

  async importContacts(
    contacts: IImportContact[],
    duplicates: IDuplicateContact[],
    onProgress: (progress: number, log: string) => void,
  ): Promise<IImportResult> {
    return this.mock.importContacts(contacts, duplicates, onProgress);
  }
}
