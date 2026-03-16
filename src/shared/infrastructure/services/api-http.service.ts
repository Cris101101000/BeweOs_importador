import {
	clearAuthCookies,
	createHttpClient,
	getAccessToken,
} from "@beweco/utils-js";
import type { IResponseApi } from "@beweco/utils-js";
import { TGoToLogin, goToLogin } from "@shared/ui/functions/go-to-login";

/**
 * HTTP Request Configuration
 */
export interface IHttpRequestConfig {
	headers?: Record<string, string>;
	params?: Record<string, unknown>;
	data?: unknown;
	timeout?: number;
}

/**
 * HTTP Client Interface
 * Defines the contract for HTTP operations with proper typing
 */
export interface IHttpClient {
	get<T = unknown>(
		url: string,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>>;
	post<T = unknown>(
		url: string,
		data?: unknown,
		formData?: object,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>>;
	put<T = unknown>(
		url: string,
		data?: unknown,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>>;
	patch<T = unknown>(
		url: string,
		data?: unknown,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>>;
	delete<T = unknown>(
		url: string,
		data?: unknown,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>>;
}

/**
 * HTTP Service Configuration
 */
interface IHttpServiceConfig {
	baseURL: string;
	refreshPath: string;
	onAuthError?: (error: unknown) => void;
}

// En localhost usamos proxy en "/api". En otros hosts, usa REACT_APP_BASE_URL_BACKEND
const isLocalhost = window.location.hostname === "localhost";

const baseURL = isLocalhost
	? "/api"
	: process.env.REACT_APP_BASE_URL_BACKEND || "/api";

const config: IHttpServiceConfig = {
	baseURL,
	refreshPath: "/auth/refresh-token",
	onAuthError: (error) => {
		console.log("onAuthError >>", error);
		clearAuthCookies();
		goToLogin(TGoToLogin.Expired);
	},
};

// Create the HTTP client using @beweco/utils-js
const httpClient = createHttpClient(config.baseURL, {
	refreshPath: config.refreshPath,
	onAuthError: config.onAuthError,
});

/**
 * HTTP Client Type Definition
 * Based on the actual createHttpClient interface from @beweco/utils-js
 */
interface IBetwecoHttpClient {
	get: (url: string, config?: unknown) => Promise<IResponseApi<unknown>>;
	post: (
		url: string,
		data?: unknown,
		config?: unknown
	) => Promise<IResponseApi<unknown>>;
	put: (
		url: string,
		data?: unknown,
		config?: unknown
	) => Promise<IResponseApi<unknown>>;
	patch: (
		url: string,
		data?: unknown,
		config?: unknown
	) => Promise<IResponseApi<unknown>>;
	delete: (url: string, config?: unknown) => Promise<IResponseApi<unknown>>;
}

/**
 * Typed HTTP Service Implementation
 * Provides proper TypeScript typing for the @beweco/utils-js HTTP client
 */
/** Default message when no error message is available */
const DEFAULT_ERROR_MESSAGE = "Request failed";

/**
 * Normalizes error message for failed API responses.
 * Prefers error.message (detail from backend), then root message, then default.
 * Applied to all responses so the app shows the most specific message.
 */
function normalizeErrorMessage<T>(
	response: IResponseApi<T>
): IResponseApi<T> {
	if (response.success) return response;
	const r = response as IResponseApi<T> & {
		message?: string;
		error?: { message?: string };
	};
	const message =
		r?.error?.message ?? r?.message ?? DEFAULT_ERROR_MESSAGE;
	return { ...response, message } as IResponseApi<T>;
}

export class HttpService implements IHttpClient {
	private client: IBetwecoHttpClient;

	constructor(client: IBetwecoHttpClient) {
		this.client = client;
	}

	async get<T = unknown>(
		url: string,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>> {
		const result = await this.client.get(url, config);
		return normalizeErrorMessage(result as IResponseApi<T>);
	}

	async post<T = unknown>(
		url: string,
		data?: unknown,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>> {
		// Handle FormData specially - use fetch directly to avoid JSON serialization
		if (data instanceof FormData) {
			return this.fetchFormData<T>(url, "POST", data, config);
		}

		const result = await this.client.post(url, data, config);
		return normalizeErrorMessage(result as IResponseApi<T>);
	}

	/**
	 * Handles FormData uploads using fetch directly
	 * This ensures proper multipart/form-data encoding
	 */
	private async fetchFormData<T = unknown>(
		url: string,
		method: "POST" | "PATCH",
		formData: FormData,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>> {
		const accessToken = getAccessToken();

		// Build the complete URL
		const fullUrl = url.startsWith("http")
			? url
			: `${baseURL}${url.startsWith("/") ? url : `/${url}`}`;

		// Prepare headers - DO NOT set Content-Type for FormData
		// The browser will set it automatically with the correct boundary
		const headers: HeadersInit = {
			...config?.headers,
		};

		// Add authorization header if token exists
		if (accessToken) {
			headers["Authorization"] = `Bearer ${accessToken}`;
		}

		try {
			const response = await fetch(fullUrl, {
				method,
				headers,
				body: formData,
				credentials: "include",
			});

			// Parse response - handle both JSON and text responses
			let responseData: unknown;
			const contentType = response.headers.get("content-type");

			// Read response as text first (can only read body once)
			const text = await response.text();

			if (contentType && contentType.includes("application/json")) {
				try {
					responseData = JSON.parse(text);
				} catch (parseError) {
					// If JSON parsing fails, treat as error
					return {
						success: false,
						error: {
							code: "PARSE_ERROR",
							message: "Failed to parse JSON response",
						},
						message: "Failed to parse JSON response",
					} as IResponseApi<T>;
				}
			} else {
				// For non-JSON responses, try to parse as JSON anyway
				try {
					responseData = JSON.parse(text);
				} catch {
					// If not JSON, wrap in object
					responseData = { message: text };
				}
			}

			// Convert to IResponseApi format
			if (response.ok) {
				return {
					success: true,
					data: (responseData as any)?.data || responseData,
					message: (responseData as any)?.message,
				} as IResponseApi<T>;
			} else {
				const data = responseData as {
					message?: string;
					error?: { message?: string; code?: string };
					code?: string;
				};
				const errorPayload = data?.error || {
					code: data?.code || "API_ERROR",
					message: data?.message || DEFAULT_ERROR_MESSAGE,
				};
				const normalizedMessage =
					data?.error?.message ?? data?.message ?? DEFAULT_ERROR_MESSAGE;
				return {
					success: false,
					error: errorPayload,
					message: normalizedMessage,
				} as IResponseApi<T>;
			}
		} catch (error) {
			// Handle network errors
			return {
				success: false,
				error: {
					code: "NETWORK_ERROR",
					message:
						error instanceof Error ? error.message : "Network error occurred",
				},
				message:
					error instanceof Error ? error.message : "Network error occurred",
			} as IResponseApi<T>;
		}
	}

	async put<T = unknown>(
		url: string,
		data?: unknown,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>> {
		const result = await this.client.put(url, data, config);
		return normalizeErrorMessage(result as IResponseApi<T>);
	}

	async patch<T = unknown>(
		url: string,
		data?: unknown,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>> {
		if (data instanceof FormData) {
			return this.fetchFormData<T>(url, "PATCH", data, config);
		}
		const result = await this.client.patch(url, data, config);
		return normalizeErrorMessage(result as IResponseApi<T>);
	}

	async delete<T = unknown>(
		url: string,
		config?: IHttpRequestConfig
	): Promise<IResponseApi<T>> {
		// The @beweco/utils-js client accepts data in config
		const result = await this.client.delete(url, config);
		return normalizeErrorMessage(result as IResponseApi<T>);
	}
}

// Create and export the typed HTTP service instance
export const httpService = new HttpService(httpClient as IBetwecoHttpClient);

// Export the raw client for backward compatibility (as used in AuthAdapter)
export const http = httpClient;

// Default export for easier imports
export default httpService;
