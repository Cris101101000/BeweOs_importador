export class TemplateError extends Error {
	constructor(message: string, public readonly code?: string) {
		super(message);
		this.name = "TemplateError";
	}
}

export class GetTemplateError extends TemplateError {
	constructor(message = "Error getting template(s)") {
		super(message, "GET_TEMPLATE_ERROR");
	}
}

export class CreateTemplateError extends TemplateError {
	constructor(message = "Error creating template") {
		super(message, "CREATE_TEMPLATE_ERROR");
	}
}

export class DeleteTemplateError extends TemplateError {
	constructor(message = "Error deleting template") {
		super(message, "DELETE_TEMPLATE_ERROR");
	}
}
