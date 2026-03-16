export type DayOfWeek =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday";

export interface ITimeSlot {
	from: string;
	to: string;
}

export interface IScheduleDetails {
	isOpen: boolean;
	timeSlots: ITimeSlot[];
}

export type ISchedule = {
	// biome-ignore lint/style/useNamingConvention: <explanation>
	[key in DayOfWeek]?: IScheduleDetails;
};
