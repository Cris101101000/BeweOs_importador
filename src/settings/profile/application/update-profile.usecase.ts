import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type {
	IUpdateProfileRequest,
	IUpdateProfileResponse,
} from "../domain/interfaces/update-profile.interface";
import type { IUpdateProfilePort } from "../domain/ports/update-profile.port";

export class UpdateProfileUseCase {
	constructor(private readonly updateProfilePort: IUpdateProfilePort) {}

	async execute(
		userId: string,
		request: IUpdateProfileRequest
	): Promise<IResponse<IUpdateProfileResponse>> {
		return await this.updateProfilePort.updateProfile(userId, request);
	}
}
