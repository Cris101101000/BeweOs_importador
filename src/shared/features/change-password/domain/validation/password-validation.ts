export interface PasswordCriterion {
	label: string;
	test: (password: string) => boolean;
}

export const passwordCriteria: PasswordCriterion[] = [
	{ label: "Al menos 8 caracteres", test: (p) => p.length >= 8 },
	{ label: "Al menos una letra mayúscula", test: (p) => /[A-Z]/.test(p) },
	{ label: "Al menos una letra minúscula", test: (p) => /[a-z]/.test(p) },
	{ label: "Al menos un número", test: (p) => /[0-9]/.test(p) },
];
