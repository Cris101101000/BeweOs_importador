import type { IResponse } from "../interfaces/response.interface";

/**
 * HTTP methods supported by apiFetch
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Configuration options for API requests
 */
export interface IApiRequestOptions {
	/** HTTP method for the request */
	method?: HttpMethod;
	/** Request body data (will be automatically JSON.stringify'd) */
	data?: unknown;
	/** Additional headers to merge with defaults */
	headers?: Record<string, string>;
	/** Request timeout in milliseconds (default: 30000) */
	timeout?: number;
	/** Query parameters to append to URL */
	params?: Record<string, string | number | boolean | string[]>;
	/** Whether to include credentials in the request */
	credentials?: RequestCredentials;
	/** Custom base URL (overrides default) */
	baseUrl?: string;
}

/**
 * Enhanced response type that includes original fetch response
 */
export interface IApiResponse<T = unknown> extends IResponse<T> {
	/** Original fetch response object */
	originalResponse?: Response;
	/** HTTP status code */
	status?: number;
}

/**
 * API Error details
 */
export interface IApiError {
	message: string;
	status?: number;
	code?: string;
	originalError?: Error;
}
