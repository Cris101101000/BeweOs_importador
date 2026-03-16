import { API_CONFIG } from "../config/api.config";
import type { IResponse } from "../interfaces/response.interface";
import type { IApiRequestOptions, IApiResponse } from "../types/api.types";

/**
 * Builds the complete URL with query parameters
 * Supports arrays by adding multiple parameters with the same key
 */
function buildUrl(
	baseUrl: string,
	endpoint: string,
	params?: Record<string, string | number | boolean | string[]>
): string {
	const url = new URL(endpoint, baseUrl);

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (Array.isArray(value)) {
				// Handle arrays by adding multiple parameters with the same key
				for (const item of value) {
					url.searchParams.append(key, String(item));
				}
			} else {
				url.searchParams.append(key, String(value));
			}
		}
	}

	return url.toString();
}

/**
 * Processes the fetch response and converts it to IApiResponse format
 */
async function processResponse<T>(
	response: Response
): Promise<IApiResponse<T>> {
	let data: T | undefined;
	let responseText = "";

	try {
		responseText = await response.text();

		if (responseText) {
			data = JSON.parse(responseText);
		}
	} catch (parseError) {
		// If JSON parsing fails, return the raw text
		data = responseText as unknown as T;
	}

	return {
		...(data as IResponse<T>),
		originalResponse: response,
	};
}

/**
 * apiFetch - Simple wrapper around the native fetch API
 *
 * @param endpoint - The API endpoint (relative to baseUrl or absolute URL)
 * @param options - Configuration options for the request
 * @returns Promise<IApiResponse<T>> - Response format
 */
export async function apiFetch<T = unknown>(
	endpoint: string,
	options: IApiRequestOptions = {}
): Promise<IApiResponse<T>> {
	const {
		method = "GET",
		data,
		headers = {},
		params,
		credentials = "same-origin",
		baseUrl = API_CONFIG.baseUrl,
	} = options;

	// Build the complete URL with query parameters
	const url = buildUrl(baseUrl, endpoint, params);

	// Merge headers with defaults
	const mergedHeaders = {
		...API_CONFIG.defaultHeaders,
		...headers,
	};

	// Prepare the fetch options
	const fetchOptions: RequestInit = {
		method,
		headers: mergedHeaders,
		credentials,
	};

	// Add body for methods that support it
	if (data && !["GET", "HEAD"].includes(method)) {
		fetchOptions.body = JSON.stringify(data);
	}

	// Make the request
	const response = await fetch(url, fetchOptions);

	// Process and return the response
	return await processResponse<T>(response);
}

/**
 * Convenience methods for common HTTP operations
 */
export const apiGet = <T = unknown>(
	endpoint: string,
	options?: Omit<IApiRequestOptions, "method">
) => apiFetch<T>(endpoint, { ...options, method: "GET" });

export const apiPost = <T = unknown>(
	endpoint: string,
	data?: unknown,
	options?: Omit<IApiRequestOptions, "method" | "data">
) => apiFetch<T>(endpoint, { ...options, method: "POST", data });

export const apiPut = <T = unknown>(
	endpoint: string,
	data?: unknown,
	options?: Omit<IApiRequestOptions, "method" | "data">
) => apiFetch<T>(endpoint, { ...options, method: "PUT", data });

export const apiPatch = <T = unknown>(
	endpoint: string,
	data?: unknown,
	options?: Omit<IApiRequestOptions, "method" | "data">
) => apiFetch<T>(endpoint, { ...options, method: "PATCH", data });

export const apiDelete = <T = unknown>(
	endpoint: string,
	options?: Omit<IApiRequestOptions, "method">
) => apiFetch<T>(endpoint, { ...options, method: "DELETE" });
