/**
 * Claves de error para validaciones de cliente
 * Estas claves se usan para obtener los mensajes de error desde el sistema de i18n
 */
export enum ValidationErrorKeys {
	// Errores de nombre
	NameRequired = "validation_name_required",
	NameMinLength = "validation_name_min_length",
	NameMaxLength = "validation_name_max_length",
	NameInvalidFormat = "validation_name_invalid_format",

	// Errores de email
	EmailRequired = "validation_email_required",
	EmailInvalidFormat = "validation_email_invalid_format",
	EmailMaxLength = "validation_email_max_length",

	// Errores de teléfono
	PhoneRequired = "validation_phone_required",
	PhoneCodeRequired = "validation_phone_code_required",
	PhoneCodeInvalidFormat = "validation_phone_code_invalid_format",
	PhoneCountryRequired = "validation_phone_country_required",
	PhoneCountryInvalidFormat = "validation_phone_country_invalid_format",
	PhoneNumberRequired = "validation_phone_number_required",
	PhoneNumberInvalidFormat = "validation_phone_number_invalid_format",

	// Errores de teléfonos (array)
	PhonesRequired = "validation_phones_required",
	PhonesMaxCount = "validation_phones_max_count",
	PhonesDuplicated = "validation_phones_duplicated",
}
