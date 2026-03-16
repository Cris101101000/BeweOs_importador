export interface IFile {
	id: string;
	name: string;
	type: string;
	size: number;
	formattedSize: string;
	file?: File;
	createdAt: Date;
	accessUrl?: string;
	contexts?: string[];
	isScraped?: boolean;
}
