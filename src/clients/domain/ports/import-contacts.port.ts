import type { IImportContact, IImportResult, IDuplicateContact } from "../interfaces/import-contact.interface";

export interface IImportContactsPort {
	extractFromFile(file: File): Promise<{ headers: string[]; data: string[][] }>;
	extractFromText(text: string): Promise<{ headers: string[]; data: string[][] }>;
	detectDuplicates(contacts: IImportContact[]): Promise<IDuplicateContact[]>;
	importContacts(
		contacts: IImportContact[],
		duplicates: IDuplicateContact[],
		onProgress: (progress: number, log: string) => void,
	): Promise<IImportResult>;
}
