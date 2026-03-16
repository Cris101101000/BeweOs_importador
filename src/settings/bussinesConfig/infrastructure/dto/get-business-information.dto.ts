export interface GetBusinessInformationResponseDto {
	basicInfo: {
		name: string;
		webDomain: string;
	};
	businessInfo: {
		vertical: string;
		taxInfo?: {
			nit?: string;
		};
		currency?: string;
	};
	brandConfig: {
		brandName: string;
		logo: string;
		favicon: string;
		description: string;
		slogan: string;
		primaryColor?: string;
		secondaryColor?: string;
	};
	contactInfo: {
		phones: {
			code: string;
			country: string;
			number: string;
			type: string;
			isVisible: boolean;
			channels?: ("phone" | "whatsapp")[] | undefined;
			id?: string;
		}[];
		emails: {
			email?: string;
			type: string;
			isVisible: boolean;
			createdBy?: string;
			id?: string | undefined;
		}[];
		socialNetwork: {
			instagram?: string;
			facebook?: string;
			tiktok?: string;
			twitter?: string;
			linkedin?: string;
			youtube?: string;
		};
		address: {
			address: string;
			urlGoogleMaps?: string;
			country?: string;
			city?: string;
			zip?: string;
		};
	};
	schedules?: ScheduleDto[];
	holidays?: HolidayDto[];
}

export interface ScheduleTimeDto {
	start: string;
	end: string;
	isEnabled: boolean;
}
export interface ScheduleDto {
	day: number;
	timezone: string;
	times: ScheduleTimeDto[];
	isEnabled: boolean;
}

export interface HolidayDto {
	startDate: Date;
	endDate?: Date;
	title?: string;
}
