export interface INote {
	id: string;
	clientId: string;
	companyId: string;
	type: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt?: string;
	createdBy?: string;
}

export interface ICreateNoteRequest {
	clientId: string;
	companyId: string;
	title: string;
	description: string;
	type?: string;
}

export interface IUpdateNoteRequest {
	title?: string;
	description?: string;
	type?: string;
}
