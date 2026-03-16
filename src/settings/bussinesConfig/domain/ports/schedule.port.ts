import type { ISchedule } from "../interfaces/schedule.interface";

export interface ISchedulePort {
	getSchedules(): Promise<ISchedule>;
	updateSchedules(schedules: ISchedule): Promise<void>;
}
