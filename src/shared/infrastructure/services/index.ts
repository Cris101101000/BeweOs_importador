/**
 * API Services Exports
 * Centralized exports for all API-related utilities and services
 */

// Main apiFetch function and convenience methods
export {
	apiFetch,
	apiGet,
	apiPost,
	apiPut,
	apiPatch,
	apiDelete,
} from "./api-fetch.service";

// HTTP Service with authentication and better typing
export {
	httpService,
	http,
	HttpService,
	type IHttpClient,
	type IHttpRequestConfig,
} from "./api-http.service";

// API configuration constants
export { API_CONFIG, HTTP_STATUS } from "../config/api.config";

// API types
export type {
	HttpMethod,
	IApiRequestOptions,
	IApiResponse,
	IApiError,
} from "../types/api.types";
