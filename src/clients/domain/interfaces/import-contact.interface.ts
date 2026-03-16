export const EnumDuplicateAction = {
	UPDATE: "update",
	SKIP: "skip",
	CREATE_NEW: "create_new",
} as const;

export type EnumDuplicateAction = (typeof EnumDuplicateAction)[keyof typeof EnumDuplicateAction];

export const EnumLogEntryType = {
	INFO: "info",
	SUCCESS: "success",
	ERROR: "error",
	LOADING: "loading",
} as const;

export type EnumLogEntryType = (typeof EnumLogEntryType)[keyof typeof EnumLogEntryType];

export interface IFieldMapping {
	sourceColumn: string;
	sourceIndex: number;
	beweField: string | null;
	autoMatched: boolean;
}

export interface IImportContact {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	country: string;
	tags?: string[];
	status?: string;
	category?: string;
	potential?: string;
	gender?: string;
	[key: string]: unknown;
}

export interface IDuplicateContact {
	record: IImportContact;
	existingContact: IImportContact;
	action: EnumDuplicateAction;
	changesDetail: string;
}

export interface IInvalidRecord {
	rowIndex: number;
	record: Partial<IImportContact>;
	reasons: string[];
}

export interface ILogEntry {
	timestamp: Date;
	message: string;
	type: EnumLogEntryType;
}

export interface IImportResult {
	created: number;
	updated: number;
	failed: number;
	totalProcessed: number;
}
