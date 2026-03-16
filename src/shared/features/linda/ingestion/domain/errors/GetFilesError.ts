export class GetFilesError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GET_FILES_ERROR";
	}
}
