export interface IImportField {
	key: string;
	label: string;
	required: boolean;
	synonyms: string[];
}

/**
 * Campos obligatorios para crear un contacto:
 * Nombre, Apellido, Email y Teléfono
 */
export const REQUIRED_IMPORT_FIELDS: IImportField[] = [
	{
		key: "firstName",
		label: "Nombre",
		required: true,
		synonyms: [
			"nombre", "name", "first_name", "firstname", "first name",
			"nome", "primeiro_nome", "primer nombre", "nombres",
			"nombre completo", "nombre cliente", "nombre del cliente",
			"given name", "given_name",
		],
	},
	{
		key: "lastName",
		label: "Apellido",
		required: true,
		synonyms: [
			"apellido", "apellidos", "last_name", "lastname", "last name", "surname",
			"sobrenome", "apelido", "primer apellido", "apellido paterno",
			"apellido 1", "apellido1", "apellido materno", "segundo apellido",
			"family name", "family_name",
		],
	},
	{
		key: "email",
		label: "Email",
		required: true,
		synonyms: [
			"correo", "e-mail", "mail", "correo electrónico", "correo electronico",
			"email address", "e_mail", "email personal", "correo personal",
			"dirección de correo", "direccion de correo", "email cliente",
		],
	},
	{
		key: "phone",
		label: "Teléfono",
		required: true,
		synonyms: [
			"teléfono", "telefono", "phone", "tel", "telephone", "celular",
			"móvil", "movil", "mobile", "whatsapp", "telefone",
			"teléfono móvil", "telefono movil", "teléfono celular",
			"telefono celular", "cell", "cell phone", "nro celular",
			"número de teléfono", "numero de telefono",
			"tel móvil", "tel movil", "tel celular", "nro teléfono",
		],
	},
];

export const OPTIONAL_IMPORT_FIELDS: IImportField[] = [
	{
		key: "country",
		label: "País",
		required: false,
		synonyms: [
			"país", "pais", "country", "nación", "nacion", "país de residencia",
		],
	},
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
	{
		key: "notes",
		label: "Notas",
		required: false,
		synonyms: [
			"notas", "notes", "observaciones", "comentarios", "comments",
			"observación", "observacion", "nota", "detalle", "detalles",
			"remarks", "description", "descripción", "descripcion",
		],
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
