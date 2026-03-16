import type {
	DayOfWeek,
	ISchedule as DomainSchedule,
} from "src/settings/bussinesConfig/domain/interfaces/schedule.interface";
import type { ISchedule as DtoSchedule } from "../dto/get-business-information.dto";

const dayMapping: { [key: number]: DayOfWeek } = {
	0: "sunday",
	1: "monday",
	2: "tuesday",
	3: "wednesday",
	4: "thursday",
	5: "friday",
	6: "saturday",
};

export const mapDtoToSchedule = (dto: DtoSchedule): DomainSchedule => {
	const day = dayMapping[dto.day];
	return {
		[day]: {
			isOpen: dto.isEnabled,
			timeSlots: dto.times.map((time) => ({
				from: time.start,
				to: time.end,
			})),
		},
	};
};

export const mapDtoListToSchedules = (
	dtoSchedules: DtoSchedule[]
): DomainSchedule => {
	const orderedDays: DayOfWeek[] = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];

	const orderedSchedule: DomainSchedule = {};

	for (const day of orderedDays) {
		orderedSchedule[day] = {
			isOpen: false,
			timeSlots: [],
		};
	}

	for (const dto of dtoSchedules) {
		const day = dayMapping[dto.day];
		if (day) {
			orderedSchedule[day] = {
				isOpen: dto.isEnabled,
				timeSlots: dto.times.map((time) => ({
					from: time.start,
					to: time.end,
				})),
			};
		}
	}

	return orderedSchedule;
};
