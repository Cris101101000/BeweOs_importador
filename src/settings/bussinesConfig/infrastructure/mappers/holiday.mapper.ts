import type { IHoliday as DomainHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import { HolidayType } from "@settings/schedules/domain/interfaces/holiday.interface";
import type { IHoliday as DtoHoliday } from "../dto/get-business-information.dto";

export const mapDtoToHoliday = (dto: DtoHoliday): DomainHoliday => {
	const type = dto.endDate ? HolidayType.DateRange : HolidayType.SingleDay;

	return {
		id: `${dto.startDate.getTime()}-${dto.endDate?.getTime() ?? ""}`, // Crear un ID único
		type,
		startDate: dto.startDate,
		endDate: dto.endDate,
		...(dto.title && { title: dto.title }),
	};
};

export const mapDtoListToHolidays = (
	dtoHolidays: DtoHoliday[]
): DomainHoliday[] => {
	return dtoHolidays.map(mapDtoToHoliday);
};
