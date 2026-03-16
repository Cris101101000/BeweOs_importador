export interface IImportField {
	key: string;
	label: string;
	required: boolean;
	synonyms: string[];
}

export const REQUIRED_IMPORT_FIELDS: IImportField[] = [
	{
		key: "firstName",
		label: "Nombre",
		required: true,
		synonyms: [
			"nombre", "name", "first_name", "firstname", "first name",
			"nome", "primeiro_nome",
		],
	},
	{
		key: "lastName",
		label: "Apellido",
		required: true,
		synonyms: [
			"apellido", "last_name", "lastname", "last name", "surname",
			"sobrenome", "apelido",
		],
	},
	{
		key: "email",
		label: "Email",
		required: true,
		synonyms: [
			"correo", "e-mail", "mail", "correo electrónico", "correo electronico",
			"email address", "e_mail",
		],
	},
	{
		key: "phone",
		label: "Teléfono",
		required: true,
		synonyms: [
			"teléfono", "telefono", "phone", "tel", "telephone", "celular",
			"móvil", "movil", "mobile", "whatsapp", "telefone",
		],
	},
	{
		key: "country",
		label: "País",
		required: true,
		synonyms: [
			"país", "pais", "country", "nación", "nacion", "país de residencia",
		],
	},
];

export const OPTIONAL_IMPORT_FIELDS: IImportField[] = [
	{
		key: "tags",
		label: "Etiquetas",
		required: false,
		synonyms: ["etiquetas", "tags", "labels", "categorías", "categorias"],
	},
	{
		key: "status",
		label: "Estado",
		required: false,
		synonyms: ["estado", "status", "state"],
	},
	{
		key: "category",
		label: "Categoría",
		required: false,
		synonyms: ["categoría", "categoria", "category", "tipo", "type"],
	},
	{
		key: "potential",
		label: "Potencial",
		required: false,
		synonyms: ["potencial", "potential", "lead score"],
	},
	{
		key: "gender",
		label: "Género",
		required: false,
		synonyms: ["género", "genero", "gender", "sexo", "sex"],
	},
];

export const ALL_IMPORT_FIELDS: IImportField[] = [
	...REQUIRED_IMPORT_FIELDS,
	...OPTIONAL_IMPORT_FIELDS,
];

export const MAX_IMPORT_RECORDS = 5000;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_PASTE_CHARACTERS = 50000;
export const PREVIEW_ROWS = 5;
export const ACCEPTED_FILE_TYPES = ".csv,.xlsx,.xls,.pdf,.docx,.doc,.jpg,.jpeg,.png";
export const STRUCTURED_FILE_TYPES = [".csv", ".xlsx", ".xls"];
export const UNSTRUCTURED_FILE_TYPES = [".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png"];
