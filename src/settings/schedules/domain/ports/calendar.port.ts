import type { ISchedule } from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import type { IHoliday } from "../interfaces/holiday.interface";

export interface IUpdateCalendarDomainRequest {
	schedules?: ISchedule;
	holidays?: IHoliday[];
}

export interface IGetSchedulesResponse {
	schedules: ISchedule;
	timezone: string;
}

export interface ICalendarPort {
	updateCalendar(
		agencyId: string,
		data: IUpdateCalendarDomainRequest
	): Promise<void>;
	getSchedules(): Promise<IGetSchedulesResponse>;
	updateSchedules(schedule: ISchedule, timezone: string): Promise<void>;
	getHolidays(): Promise<IHoliday[]>;
	createHoliday(holiday: Omit<IHoliday, "id">): Promise<IHoliday>;
	deleteHoliday(holidayId: string): Promise<void>;
}
