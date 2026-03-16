import type { IEmailContact } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";

/**
 * Digital contact information interface
 * Represents the digital contact channels: emails and website
 */
export interface IDigitalContact {
	emails: IEmailContact[];
	website?: string;
}
