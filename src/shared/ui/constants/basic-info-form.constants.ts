// Validation constants
export const VALIDATION_CONSTANTS = {
	name: {
		maxLength: 50,
		pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
	},
	email: {
		maxLength: 100,
	},
	phone: {
		minLength: 7,
		maxLength: 15,
		pattern: /^[0-9+\s-()]+$/,
	},
} as const;

// Translation keys
export const TRANSLATION_KEYS = {
	// Form fields
	firstName: "field_first_name",
	lastName: "field_last_name",
	email: "field_email",
	phone: "field_phone",

	// Placeholders
	placeholderFirstName: "placeholder_enter_first_name",
	placeholderLastName: "placeholder_enter_last_name",
	placeholderEmail: "placeholder_enter_email",
	placeholderPhone: "placeholder_enter_phone",
	placeholderSearchPhone: "placeholder_search_phone",

	// Phone translations
	noCountriesFound: "no_countries_found",

	// Validation errors
	requiredField: "form_error_required_field",
	nameMaxLength: "form_error_name_max_length",
	nameInvalid: "form_error_name_invalid",
	invalidEmail: "form_error_invalid_email",
	emailMaxLength: "form_error_email_max_length",
	countryRequired: "form_error_country_required",
	phoneMinLength: "form_error_phone_min_length",
	phoneMaxLength: "form_error_phone_max_length",
	phoneInvalid: "form_error_phone_invalid",

	// Step content
	stepTitle: "client_wizard_basic_info_title",
	stepDescription: "client_wizard_basic_info_description",
} as const;

// Default messages
export const DEFAULT_MESSAGES = {
	firstName: "Nombre",
	lastName: "Apellido",
	email: "Correo electrónico",
	phone: "Teléfono",
	placeholderFirstName: "Ingresa el nombre",
	placeholderLastName: "Ingresa el apellido",
	placeholderEmail: "Ingresa el correo electrónico",
	placeholderPhone: "Ingresa tu teléfono",
	placeholderSearchPhone: "Buscar país",
	noCountriesFound: "No se encontraron países",
	requiredField: "Este campo es requerido",
	nameMaxLength: "El nombre no puede exceder 50 caracteres",
	nameInvalid: "El nombre solo puede contener letras y espacios",
	invalidEmail: "Por favor, introduce un correo electrónico válido",
	emailMaxLength: "El correo no puede exceder 100 caracteres",
	countryRequired: "Selecciona un país",
	phoneMinLength: "El teléfono debe tener al menos 7 dígitos",
	phoneMaxLength: "El teléfono no puede exceder 15 dígitos",
	phoneInvalid:
		"El teléfono solo puede contener números y caracteres especiales",
	stepTitle: "Información básica",
	stepDescription: "Ingresa los datos básicos del cliente",
} as const;
