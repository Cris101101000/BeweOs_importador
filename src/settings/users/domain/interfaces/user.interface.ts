/**
 * Interface representing a user in the system.
 */
export interface IUser {
	id: string;
	firstname: string;
	lastname?: string;
	username?: string;
	email: string;
	roles: IRole[];
	lastAccess: string;
	avatar: string;
	isAdmin?: boolean;
	status?: string;
}

export interface IRole {
	value: string;
	label: string;
}
