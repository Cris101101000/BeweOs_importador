import { type IHttpClient, httpService } from "@http";
import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type {
	IUpdateProfileRequest,
	IUpdateProfileResponse,
} from "../../domain/interfaces/update-profile.interface";
import type { IUpdateProfilePort } from "../../domain/ports/update-profile.port";

export class UpdateProfileAdapter implements IUpdateProfilePort {
	private readonly httpClient: IHttpClient = httpService;

	async updateProfile(
		userId: string,
		request: IUpdateProfileRequest
	): Promise<IResponse<IUpdateProfileResponse>> {
		const response = await this.httpClient.put(`/users/${userId}/me`, request);

		if (!response.success) {
			throw new Error(response.message);
		}

		return {
			success: true,
			message: "Profile updated successfully",
			timestamp: new Date().toISOString(),
			data: response.data,
		};
	}
}
