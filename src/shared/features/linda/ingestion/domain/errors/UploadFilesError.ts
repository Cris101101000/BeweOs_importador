export class UploadFilesError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UPLOAD_FILES_ERROR";
	}
}
