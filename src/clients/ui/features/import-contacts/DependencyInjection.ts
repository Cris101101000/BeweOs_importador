import { DetectDuplicatesUseCase } from "@clients/application/detect-duplicates.usecase";
import { ImportContactsUseCase } from "@clients/application/import-contacts.usecase";
import { ValidateImportFileUseCase } from "@clients/application/validate-import-file.usecase";
import type {
	IDuplicateContact,
	IImportContact,
	IImportResult,
} from "@clients/domain/interfaces/import-contact.interface";
import { ImportContactsAdapter } from "@clients/infrastructure/adapters/import-contacts.adapter";

const importAdapter = new ImportContactsAdapter();

export const ValidateImportFile = {
	withFile: (file: File) =>
		new ValidateImportFileUseCase(importAdapter).executeWithFile(file),
	withText: (text: string) =>
		new ValidateImportFileUseCase(importAdapter).executeWithText(text),
};

export const DetectDuplicates = (
	contacts: IImportContact[]
): Promise<IDuplicateContact[]> =>
	new DetectDuplicatesUseCase(importAdapter).execute(contacts);

export const ImportContactsBulk = (
	contacts: IImportContact[],
	duplicates: IDuplicateContact[],
	onProgress: (progress: number, log: string) => void
): Promise<IImportResult> =>
	new ImportContactsUseCase(importAdapter).execute(
		contacts,
		duplicates,
		onProgress
	);
