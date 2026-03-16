import type { IAgency } from "./agency.interface";
import type { IModulo } from "./modulo.interface";
import type { INews } from "./news.interface";
import type { IUser } from "./user.interface";

export interface IInitialData {
	user: IUser;
	agency: IAgency;
	news: INews[];
	modulos: IModulo[];
}
