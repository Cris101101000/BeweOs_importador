export const EnumImportStep = {
	UPLOAD: "upload",
	ANALYSIS: "analysis",
	MAPPING: "mapping",
	CONFIRMATION: "confirmation",
} as const;

export type EnumImportStep = (typeof EnumImportStep)[keyof typeof EnumImportStep];

export const EnumProcessStatus = {
	IDLE: "idle",
	PROCESSING: "processing",
	DONE: "done",
	ERROR: "error",
} as const;

export type EnumProcessStatus = (typeof EnumProcessStatus)[keyof typeof EnumProcessStatus];
