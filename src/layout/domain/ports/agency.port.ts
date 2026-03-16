import type { IAgency } from "../interfaces/agency.interface";

export interface IAgencyPort {
	getAgency(): Promise<IAgency | null>;
}
