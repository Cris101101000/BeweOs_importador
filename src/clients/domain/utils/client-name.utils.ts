import type { IClient } from "@clients/domain/interfaces/client.interface";

/**
 * Returns the full name of a client by concatenating firstName and lastName
 * @param client - The client object or an object with firstName and lastName
 * @returns The full name trimmed
 */
export const getClientFullName = (
	client: Pick<IClient, "firstName" | "lastName">
): string => {
	return `${client.firstName} ${client.lastName}`.trim();
};
