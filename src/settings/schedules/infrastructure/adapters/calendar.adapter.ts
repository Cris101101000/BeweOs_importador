import type { ISchedule } from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import type { IHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import httpService from "@shared/infrastructure/services/api-http.service";
import type {
	ICalendarPort,
	IGetSchedulesResponse,
	IUpdateCalendarDomainRequest,
} from "../../domain/ports/calendar.port";
import type {
	CreateHolidayRequestDto,
	CreateHolidayResponseDto,
} from "../dto/create-holiday.dto";
import type {
	GetHolidaysResponseDto,
	HolidayItemDto,
} from "../dto/get-holidays-response.dto";
import type {
	GetSchedulesResponseDto,
	ScheduleItemDto,
} from "../dto/get-schedules-response.dto";
import type {
	BulkSchedulesRequestDto,
	UpdateCalendarRequestDto,
} from "../dto/update-calendar.dto";
import {
	extractTimezoneFromDto,
	mapHolidayToCreateDto,
	mapHolidaysFromDto,
	mapHolidaysToDto,
	mapScheduleFromDto,
	mapScheduleToBulkDto,
	mapScheduleToDto,
} from "../mappers/calendar.mapper";

export class CalendarAdapter implements ICalendarPort {
	async updateCalendar(
		agencyId: string,
		data: IUpdateCalendarDomainRequest
	): Promise<void> {
		const requestDto: UpdateCalendarRequestDto = {};

		if (data.schedules) {
			requestDto.schedules = mapScheduleToDto(data.schedules);
		}

		if (data.holidays) {
			requestDto.holidays = mapHolidaysToDto(data.holidays);
		}

		console.log(
			`Updating calendar for agency ${agencyId} with DTO data:`,
			requestDto
		);

		// Lógica de fetch a la API con requestDto
		return Promise.resolve();
	}

	async getSchedules(): Promise<IGetSchedulesResponse> {
		try {
			// httpService.get ya retorna IResponseApi<T> donde T es el tipo de data
			// Por lo tanto, response.data es de tipo ScheduleItemDto[]
			const response = await httpService.get<ScheduleItemDto[]>(
				"/companies/schedules"
			);

			if (!response.success || !response.data) {
				throw new Error(response.message || "Error al obtener los horarios");
			}

			// Construir el objeto DTO completo para los mappers
			const responseDto: GetSchedulesResponseDto = {
				success: response.success,
				message: response.message,
				data: response.data,
				timestamp: new Date().toISOString(),
			};

			// Convertir la respuesta del API al formato del dominio
			const schedules = mapScheduleFromDto(responseDto);
			const timezone = extractTimezoneFromDto(responseDto);

			return {
				schedules,
				timezone,
			};
		} catch (error) {
			console.error("Error al obtener los horarios:", error);
			throw error;
		}
	}

	async updateSchedules(schedule: ISchedule, timezone: string): Promise<void> {
		try {
			// Convertir el schedule del dominio al formato bulk
			const requestDto: BulkSchedulesRequestDto = mapScheduleToBulkDto(
				schedule,
				timezone
			);

			console.log(
				"Actualizando horarios con formato bulk:",
				JSON.stringify(requestDto, null, 2)
			);

			// Hacer el POST al endpoint bulk
			const response = await httpService.post<void>(
				"/companies/schedules/bulk",
				requestDto
			);

			if (!response.success) {
				throw new Error(response.message || "Error al actualizar los horarios");
			}

			console.log("Horarios actualizados exitosamente");
		} catch (error) {
			console.error("Error al actualizar los horarios:", error);
			throw error;
		}
	}

	async getHolidays(): Promise<IHoliday[]> {
		try {
			// httpService.get ya retorna IResponseApi<T> donde T es el tipo de data
			const response = await httpService.get<HolidayItemDto[]>(
				"/companies/holidays"
			);

			if (!response.success || !response.data) {
				throw new Error(
					response.message || "Error al obtener los festivos y vacaciones"
				);
			}

			// Construir el objeto DTO completo para el mapper
			const responseDto: GetHolidaysResponseDto = {
				success: response.success,
				message: response.message,
				data: response.data,
				timestamp: new Date().toISOString(),
			};

			// Convertir la respuesta del API al formato del dominio
			const holidays = mapHolidaysFromDto(responseDto);

			return holidays;
		} catch (error) {
			console.error("Error al obtener los festivos y vacaciones:", error);
			throw error;
		}
	}

	async createHoliday(holiday: Omit<IHoliday, "id">): Promise<IHoliday> {
		try {
			// Convertir el holiday del dominio al formato DTO
			const requestDto: CreateHolidayRequestDto =
				mapHolidayToCreateDto(holiday);

			console.log(
				"Creando holiday con DTO:",
				JSON.stringify(requestDto, null, 2)
			);

			// Hacer el POST al endpoint
			const response = await httpService.post<CreateHolidayResponseDto["data"]>(
				"/companies/holidays",
				requestDto
			);

			if (!response.success || !response.data) {
				throw new Error(response.message || "Error al crear el festivo");
			}

			// Convertir la respuesta al formato del dominio
			const createdHoliday: IHoliday = {
				id: response.data.id,
				type: response.data.dateRange.endDate
					? ("dateRange" as any) // HolidayType.DateRange
					: ("singleDay" as any), // HolidayType.SingleDay
				startDate: new Date(response.data.dateRange.startDate),
				endDate: response.data.dateRange.endDate
					? new Date(response.data.dateRange.endDate)
					: undefined,
				title: response.data.description,
			};

			console.log("Holiday creado exitosamente:", createdHoliday);
			return createdHoliday;
		} catch (error) {
			console.error("Error al crear el festivo:", error);
			throw error;
		}
	}

	async deleteHoliday(holidayId: string): Promise<void> {
		try {
			const response = await httpService.delete<void>(
				`/companies/holidays/${holidayId}`
			);

			if (!response.success) {
				throw new Error(response.message || "Error al eliminar el festivo");
			}

			console.log(`Holiday ${holidayId} eliminado exitosamente`);
		} catch (error) {
			console.error("Error al eliminar el festivo:", error);
			throw error;
		}
	}
}
