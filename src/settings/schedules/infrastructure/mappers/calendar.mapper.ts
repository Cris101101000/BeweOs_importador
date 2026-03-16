import type {
	DayOfWeek,
	ISchedule as DomainSchedule,
} from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import type { IHoliday as DomainHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import { HolidayType } from "@settings/schedules/domain/interfaces/holiday.interface";
import type { GetHolidaysResponseDto } from "../dto/get-holidays-response.dto";
import type { GetSchedulesResponseDto } from "../dto/get-schedules-response.dto";
import type {
	BulkScheduleItemDto,
	BulkSchedulesRequestDto,
	UpdateHolidayDto,
	UpdateScheduleDto,
} from "../dto/update-calendar.dto";

const dayMapping: { [key: string]: number } = {
	sunday: 0,
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6,
};

const reverseDayMapping: { [key: number]: DayOfWeek } = {
	0: "sunday",
	1: "monday",
	2: "tuesday",
	3: "wednesday",
	4: "thursday",
	5: "friday",
	6: "saturday",
};

/**
 * Mapea los nombres de días del dominio al formato UPPER_CASE del API
 */
const dayToUpperCase: { [key in DayOfWeek]: string } = {
	sunday: "SUNDAY",
	monday: "MONDAY",
	tuesday: "TUESDAY",
	wednesday: "WEDNESDAY",
	thursday: "THURSDAY",
	friday: "FRIDAY",
	saturday: "SATURDAY",
};

export const mapScheduleToDto = (
	schedule: DomainSchedule
): UpdateScheduleDto[] => {
	return Object.entries(schedule).map(([day, details]) => ({
		day: dayMapping[day],
		isEnabled: details?.isOpen ?? false,
		timezone: "UTC", // Opcional: obtener de alguna configuración
		times:
			details?.timeSlots.map((slot) => ({
				start: slot.from,
				end: slot.to,
				isEnabled: true,
			})) ?? [],
	}));
};

export const mapHolidaysToDto = (
	holidays: DomainHoliday[]
): UpdateHolidayDto[] => {
	return holidays.map((holiday) => ({
		startDate: holiday.startDate,
		...(holiday.endDate && { endDate: holiday.endDate }),
	}));
};

/**
 * Convierte la respuesta del API (DTO) al formato del dominio (ISchedule)
 * @param responseDto - Respuesta del endpoint GET /companies/schedules
 * @returns ISchedule en formato del dominio (incluye TODOS los días de la semana)
 *
 * IMPORTANTE: Inicializa TODOS los días de la semana.
 * - Los días que NO vengan en el API se marcan como cerrados (isOpen: false)
 * - Los días que vengan en el API se actualizan con sus horarios
 */
export const mapScheduleFromDto = (
	responseDto: GetSchedulesResponseDto
): DomainSchedule => {
	// Inicializar schedule con TODOS los días cerrados por defecto
	const schedule: DomainSchedule = {
		sunday: { isOpen: false, timeSlots: [] },
		monday: { isOpen: false, timeSlots: [] },
		tuesday: { isOpen: false, timeSlots: [] },
		wednesday: { isOpen: false, timeSlots: [] },
		thursday: { isOpen: false, timeSlots: [] },
		friday: { isOpen: false, timeSlots: [] },
		saturday: { isOpen: false, timeSlots: [] },
	};

	// Mapear los datos de la respuesta - Actualizar solo los días que vengan del API
	for (const item of responseDto.data) {
		const dayName = reverseDayMapping[item.day];
		if (dayName) {
			// Filtrar solo los times que están habilitados
			const enabledTimes = item.times.filter((time) => time.isEnabled);

			// Si el día tiene horarios habilitados, marcar como abierto
			if (enabledTimes.length > 0) {
				schedule[dayName] = {
					isOpen: true,
					timeSlots: enabledTimes.map((time) => ({
						from: time.start,
						to: time.end,
					})),
				};
			}
			// Si el día existe en el API pero no tiene horarios habilitados,
			// queda con el default (isOpen: false, timeSlots: [])
		}
	}

	return schedule;
};

/**
 * Extrae el timezone de la respuesta del API
 * @param responseDto - Respuesta del endpoint GET /companies/schedules
 * @returns Timezone (ej: "America/Bogota") o "UTC" por defecto
 */
export const extractTimezoneFromDto = (
	responseDto: GetSchedulesResponseDto
): string => {
	// Tomar el timezone del primer item con datos
	const firstItem = responseDto.data.find((item) => item.timezone);
	return firstItem?.timezone ?? "UTC";
};

/**
 * Convierte el schedule del dominio al formato del endpoint POST /companies/schedules/bulk
 * @param schedule - Schedule en formato del dominio
 * @param timezone - Timezone a usar (ej: "America/Bogota")
 * @returns Objeto DTO para el endpoint bulk
 *
 * IMPORTANTE: Solo envía los días que están HABILITADOS con horarios válidos.
 * Los días cerrados o sin horarios NO se incluyen en el array.
 */
export const mapScheduleToBulkDto = (
	schedule: DomainSchedule,
	timezone: string
): BulkSchedulesRequestDto => {
	const schedules: BulkScheduleItemDto[] = [];

	// Iterar sobre todos los días de la semana
	const daysOfWeek: DayOfWeek[] = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];

	for (const day of daysOfWeek) {
		const daySchedule = schedule[day];

		if (daySchedule && daySchedule.isOpen && daySchedule.timeSlots.length > 0) {
			// Filtrar solo los timeSlots que tengan valores válidos (no vacíos)
			const validTimeSlots = daySchedule.timeSlots.filter(
				(slot) =>
					slot.from &&
					slot.to &&
					slot.from.trim() !== "" &&
					slot.to.trim() !== ""
			);

			// Solo agregar el día si tiene horarios válidos
			if (validTimeSlots.length > 0) {
				schedules.push({
					dayOfWeek: dayToUpperCase[day],
					timezone,
					times: validTimeSlots.map((slot) => ({
						start: slot.from,
						end: slot.to,
						isEnabled: true,
					})),
					isEnabled: true,
				});
			}
			// Si no hay horarios válidos, no se agrega (día cerrado)
		}
		// Los días cerrados NO se agregan al array
	}

	return { schedules };
};

/**
 * Convierte la respuesta del API de holidays (DTO) al formato del dominio (IHoliday[])
 * @param responseDto - Respuesta del endpoint GET /companies/holidays
 * @returns Array de IHoliday en formato del dominio
 */
export const mapHolidaysFromDto = (
	responseDto: GetHolidaysResponseDto
): DomainHoliday[] => {
	return responseDto.data.map((item) => {
		const startDate = new Date(item.dateRange.startDate);
		const endDate = item.dateRange.endDate
			? new Date(item.dateRange.endDate)
			: undefined;

		// Determinar el tipo de holiday basado en si hay endDate
		const type: HolidayType = endDate
			? HolidayType.DateRange
			: HolidayType.SingleDay;

		return {
			id: item.id,
			type,
			startDate,
			endDate,
			title: item.description,
		};
	});
};

/**
 * Convierte un holiday del dominio al formato DTO para crear (POST)
 * @param holiday - Holiday en formato del dominio
 * @returns DTO para el endpoint POST /companies/holidays
 *
 * Formatos de fecha esperados:
 * - startDate: "YYYY-MM-DD" (ej: "2025-12-25")
 * - endDate: "YYYY-MM-DD" (opcional, solo para rangos)
 */
export const mapHolidayToCreateDto = (
	holiday: Omit<DomainHoliday, "id">
): import("../dto/create-holiday.dto").CreateHolidayRequestDto => {
	// Formatear fecha a "YYYY-MM-DD"
	const formatDate = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const dateRange: import(
		"../dto/create-holiday.dto"
	).CreateHolidayDateRangeDto = {
		startDate: formatDate(holiday.startDate),
	};

	// Solo agregar endDate si existe (para rangos)
	if (holiday.endDate) {
		dateRange.endDate = formatDate(holiday.endDate);
	}

	return {
		dateRange,
		description: holiday.title || "",
	};
};
