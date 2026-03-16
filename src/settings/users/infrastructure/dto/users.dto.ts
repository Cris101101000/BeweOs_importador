/**
 * DTO for the GET users response from backend.
 */
export interface GetUsersResponseDto {
	users: UserDto[];
}

/**
 * DTO for a single user from backend.
 */
export interface UserDto {
	id: string;
	agencyId: string;
	companyId: string;
	isAdmin: boolean;
	basicInfo: {
		firstname: string;
		lastname?: string;
		email: string;
		phones: {
			code: string;
			country: string;
			number: string;
		}[];
		imageProfile: string | null;
		hash: string | null;
	};
	authentication: {
		isEnabled: boolean;
		mustChangePassword: boolean;
		passwordChangedAt: string;
		lastLoginAt: string | null;
		failedLoginAttempts: number;
		lockedUntil: string | null;
	};
	platformAccess: {
		platformType: string;
		isApiUser: boolean;
		apiKeyName: string | null;
	};
	sessions: unknown[];
	authorization: {
		roles: {
			name: string;
			description: string;
			permissions: unknown[];
		}[];
		permissions: unknown[];
	};
	preferences: {
		language: string;
		timezone: string;
		theme: string;
	};
	status: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
}

/**
 * DTO for the POST (invite) user request.
 */
export interface InviteUserRequestDto {
	email: string;
	roles: string[];
}

/**
 * DTO for the PUT (update) user request.
 */
export interface UpdateUserRequestDto {
	firstname?: string;
	lastname?: string;
	email?: string;
	roles?: string[];
	imageProfile?: string;
}
