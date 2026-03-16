import type { UserDto } from "../dto/users.dto";

/**
 * Mock data for the GET users response DTO.
 * Updated to match the backend response structure.
 */
export const MOCK_USERS: UserDto[] = [
	{
		id: "eb420b46-96bd-46a1-846b-eaa4de0f323e",
		agencyId: "242e5da7-f65d-47b8-968a-d5d066c237aa",
		companyId: "370a5c02-c06b-4646-9a4b-1f2033e1a5cc",
		isAdmin: true,
		basicInfo: {
			name: "Tony Reichert",
			email: "tony.reichert@example.com",
			phones: [
				{
					code: "+1",
					country: "US",
					number: "5551234567",
				},
			],
			imageProfile: "https://i.pravatar.cc/150?u=tony",
			hash: null,
		},
		authentication: {
			isEnabled: true,
			mustChangePassword: false,
			passwordChangedAt: "2024-06-21T10:00:00.000Z",
			lastLoginAt: "2024-06-21T10:00:00.000Z",
			failedLoginAttempts: 0,
			lockedUntil: null,
		},
		platformAccess: {
			platformType: "smbs",
			isApiUser: false,
			apiKeyName: null,
		},
		sessions: [],
		authorization: {
			roles: [
				{
					name: "admin",
					description: "Administrator",
					permissions: [],
				},
			],
			permissions: [],
		},
		preferences: {
			language: "en",
			timezone: "America/New_York",
			theme: "light",
		},
		status: "active",
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-06-21T10:00:00.000Z",
		createdBy: "system",
	},
	{
		id: "f2d8c9a3-5e7b-4c1a-9d2f-8b3a4e6c7d9e",
		agencyId: "242e5da7-f65d-47b8-968a-d5d066c237aa",
		companyId: "370a5c02-c06b-4646-9a4b-1f2033e1a5cc",
		isAdmin: true,
		basicInfo: {
			name: "Zoey Lang",
			email: "zoey.lang@example.com",
			phones: [
				{
					code: "+1",
					country: "US",
					number: "5559876543",
				},
			],
			imageProfile: "https://i.pravatar.cc/150?u=zoey",
			hash: null,
		},
		authentication: {
			isEnabled: true,
			mustChangePassword: false,
			passwordChangedAt: "2023-12-11T10:00:00.000Z",
			lastLoginAt: "2023-12-11T10:00:00.000Z",
			failedLoginAttempts: 0,
			lockedUntil: null,
		},
		platformAccess: {
			platformType: "smbs",
			isApiUser: false,
			apiKeyName: null,
		},
		sessions: [],
		authorization: {
			roles: [
				{
					name: "admin",
					description: "Administrator",
					permissions: [],
				},
			],
			permissions: [],
		},
		preferences: {
			language: "en",
			timezone: "America/New_York",
			theme: "dark",
		},
		status: "active",
		createdAt: "2023-01-01T00:00:00.000Z",
		updatedAt: "2023-12-11T10:00:00.000Z",
		createdBy: "system",
	},
];
