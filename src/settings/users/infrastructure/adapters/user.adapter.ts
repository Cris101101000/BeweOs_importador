import { httpService } from "@shared/infrastructure/services/api-http.service";
import type { IUser } from "../../domain/interfaces/user.interface";
import type { IUserPort } from "../../domain/ports/user.port";
import type {
	GetUsersResponseDto,
	InviteUserRequestDto,
	UpdateUserRequestDto,
} from "../dto/users.dto";
import { mapUsersDtoToDomain } from "../mappers/user.mapper";

/**
 * Adapter for user data operations.
 */
export class UserAdapter implements IUserPort {
	async getUsers(): Promise<IUser[]> {
		const response = await httpService.get<GetUsersResponseDto>("/users");

		if (response.success && response.data) {
			return mapUsersDtoToDomain(response.data);
		}

		throw new Error(response.message || "Failed to fetch users");
	}

	async inviteUser(email: string, roles: string[]): Promise<void> {
		const requestDto: InviteUserRequestDto = { email, roles };
		const response = await httpService.post<void>(
			"/users/inactive",
			requestDto
		);

		if (!response.success) {
			throw new Error(response.message || "Failed to invite user");
		}
	}

	/**
	 * Updates a user with the given data.
	 * @param userId - The ID of the user to update.
	 * @param data - Partial user data to update.
	 */
	async updateUser(userId: string, data: Partial<IUser>): Promise<void> {
		const requestDto: UpdateUserRequestDto = {
			firstname: data.firstname,
			lastname: data.lastname,
			email: data.email,
			roles: data.roles ? data.roles.map((role) => role.value) : [],
			imageProfile: data.avatar,
		};
		const response = await httpService.put<void>(
			`/users/${userId}`,
			requestDto
		);

		if (!response.success) {
			throw new Error(response.message || "Failed to update user");
		}
	}

	async deleteUser(userId: string): Promise<void> {
		const response = await httpService.delete<void>(`/users/${userId}`);

		if (!response.success) {
			throw new Error(response.message || "Failed to delete user");
		}
	}
}
