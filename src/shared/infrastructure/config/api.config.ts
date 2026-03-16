/**
 * API Configuration
 * Centralizes API-related configuration constants
 */

export const API_CONFIG = {
	baseUrl: process.env.REACT_APP_BASE_API_URL || "http://localhost:3001",
	defaultTimeout: 300000, // 5 minutes
	defaultHeaders: {
		"Content-Type": "application/json",
	},
} as const;

export const HTTP_STATUS = {
	ok: 200,
	created: 201,
	noContent: 204,
	badRequest: 400,
	unauthorized: 401,
	forbidden: 403,
	notFound: 404,
	internalServerError: 500,
} as const;
