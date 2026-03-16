import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type {
	IUpdateProfileRequest,
	IUpdateProfileResponse,
} from "../interfaces/update-profile.interface";

export interface IUpdateProfilePort {
	updateProfile(
		userId: string,
		request: IUpdateProfileRequest
	): Promise<IResponse<IUpdateProfileResponse>>;
}
