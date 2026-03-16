export enum HolidayType {
	SingleDay = "singleDay",
	DateRange = "dateRange",
}

export interface IHoliday {
	id: string;
	type: HolidayType;
	startDate: Date;
	endDate?: Date;
	title?: string;
}
