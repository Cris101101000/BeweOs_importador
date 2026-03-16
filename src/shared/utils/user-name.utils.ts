/**
 * Utility functions for handling user names with firstname and lastname.
 */

/**
 * Concatenates firstname and lastname to create a full name.
 * If lastname is not provided, returns only firstname.
 *
 * @param firstname - User's first name (required)
 * @param lastname - User's last name (optional)
 * @returns Full name as a string
 *
 * @example
 * getFullName("Armando", "Barreda") // "Armando Barreda"
 * getFullName("Armando") // "Armando"
 * getFullName("Armando", "") // "Armando"
 */
export const getFullName = (firstname: string, lastname?: string): string => {
	if (!lastname || lastname.trim() === "") {
		return firstname;
	}
	return `${firstname} ${lastname}`;
};

/**
 * Generates user initials from firstname and lastname.
 * Returns up to 2 initials (first letter of firstname and lastname).
 *
 * @param firstname - User's first name (required)
 * @param lastname - User's last name (optional)
 * @returns Initials as uppercase string
 *
 * @example
 * getUserInitials("Armando", "Barreda") // "AB"
 * getUserInitials("Armando") // "A"
 * getUserInitials("María José", "García López") // "MG"
 */
export const getUserInitials = (
	firstname: string,
	lastname?: string
): string => {
	const firstInitial = firstname.trim().charAt(0).toUpperCase();

	if (!lastname || lastname.trim() === "") {
		return firstInitial;
	}

	const lastInitial = lastname.trim().charAt(0).toUpperCase();
	return `${firstInitial}${lastInitial}`;
};
