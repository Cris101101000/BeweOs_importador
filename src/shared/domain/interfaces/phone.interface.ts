export interface IPhone {
	code: string; // código del país (ej. +57)
	country: string; // país ISO 3166-1 alpha-2 (ej. "CO")
	number: string; // numero de teléfono
	type?: string; // tipo de contacto: "main", "sales", "support", "technical", "other"
	isVisible?: boolean; // si el teléfono es visible públicamente
	channels?: ("phone" | "whatsapp")[]; // canales disponibles para este teléfono
}
