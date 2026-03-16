import type { IAgency } from "src/layout/domain/interfaces/agency.interface";
import type { IUser } from "src/layout/domain/interfaces/user.interface";

export interface ISessionContext {
	user: IUser | null;
	agency: IAgency | null;
	modulesId: string[] | null;
	setUser: (user: IUser | null) => void;
	setAgency: (agency: IAgency | null) => void;
	setModulesId: (modulesId: string[] | null) => void;
}
