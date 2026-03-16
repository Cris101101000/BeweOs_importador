/**
 * API Fetch Usage Examples
 *
 * This file demonstrates how to use the apiFetch function within
 * the hexagonal architecture pattern used in this project.
 */

import type { IResponse } from "../interfaces/response.interface";
import { apiDelete, apiFetch, apiGet, apiPost, apiPut } from "../services";

// Example domain interfaces
interface User {
	id: string;
	name: string;
	email: string;
}

interface CreateUserRequest {
	name: string;
	email: string;
}

/**
 * Example: Using apiFetch in an Adapter class (Infrastructure layer)
 * This follows the existing pattern in the project
 */
export class ExampleUserAdapter {
	/**
	 * Get all users
	 */
	async getUsers(): Promise<IResponse<User[]>> {
		try {
			const response = await apiGet<User[]>("/users");
			return response;
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to fetch users",
				timestamp: new Date().toISOString(),
				error: {
					code: "GET_USERS_ERROR",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}

	/**
	 * Get user by ID with query parameters
	 */
	async getUserById(userId: string): Promise<IResponse<User>> {
		try {
			const response = await apiGet<User>(`/users/${userId}`, {
				params: { include: "profile" },
			});
			return response;
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to fetch user",
				timestamp: new Date().toISOString(),
				error: {
					code: "GET_USER_ERROR",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}

	/**
	 * Create a new user
	 */
	async createUser(userData: CreateUserRequest): Promise<IResponse<User>> {
		try {
			const response = await apiPost<User>("/users", userData);
			return response;
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to create user",
				timestamp: new Date().toISOString(),
				error: {
					code: "CREATE_USER_ERROR",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}

	/**
	 * Update an existing user
	 */
	async updateUser(
		userId: string,
		userData: Partial<User>
	): Promise<IResponse<User>> {
		try {
			const response = await apiPut<User>(`/users/${userId}`, userData);
			return response;
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to update user",
				timestamp: new Date().toISOString(),
				error: {
					code: "UPDATE_USER_ERROR",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}

	/**
	 * Delete a user
	 */
	async deleteUser(userId: string): Promise<IResponse<void>> {
		try {
			const response = await apiDelete<void>(`/users/${userId}`);
			return response;
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to delete user",
				timestamp: new Date().toISOString(),
				error: {
					code: "DELETE_USER_ERROR",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}

	/**
	 * Example with custom headers (e.g., authentication)
	 */
	async getUsersWithAuth(token: string): Promise<IResponse<User[]>> {
		try {
			const response = await apiFetch<User[]>("/users", {
				method: "GET",
				headers: {
					authorization: `Bearer ${token}`,
				},
				timeout: 5000, // Custom timeout
			});
			return response;
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Failed to fetch authenticated users",
				timestamp: new Date().toISOString(),
				error: {
					code: "GET_AUTH_USERS_ERROR",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}
}
