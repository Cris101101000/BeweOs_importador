import { Button } from "@beweco/aurora-ui";
import type React from "react";
import { useState } from "react";
import type { SelectedService, SelectedTime } from "./BookingWidget";

// Safe Icon wrapper to prevent iconify errors with React 19
const SafeIcon: React.FC<{ icon: string; className?: string }> = ({
	icon,
	className,
}) => {
	// Use simple SVG icons as fallback
	const iconMap: Record<string, JSX.Element> = {
		"solar:alt-arrow-left-linear": (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M15 18l-6-6 6-6" />
			</svg>
		),
		"solar:alt-arrow-right-linear": (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M9 18l6-6-6-6" />
			</svg>
		),
	};

	return <span className={className}>{iconMap[icon] || <span>←</span>}</span>;
};

interface TimeSelectionProps {
	selectedTime: SelectedTime | null;
	onTimeChange: (time: SelectedTime) => void;
	selectedServices: SelectedService[];
	onNext: () => void;
	canProceed: boolean;
}

// Generar fechas para mostrar (8 días a partir de una fecha específica)
const generateAvailableDates = (startDate: Date = new Date()) => {
	const dates = [];

	for (let i = 0; i < 8; i++) {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);
		dates.push(date);
	}

	return dates;
};

// Horarios disponibles por día
const AVAILABLE_TIMES = [
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30",
];

const TimeSelection: React.FC<TimeSelectionProps> = ({
	selectedTime,
	onTimeChange,
	selectedServices,
	onNext,
	canProceed,
}) => {
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
	const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());
	const [showCalendarView, setShowCalendarView] = useState<boolean>(false);
	const [calendarDate, setCalendarDate] = useState<Date>(new Date());
	const [cameFromCalendar, setCameFromCalendar] = useState<boolean>(false);
	const availableDates = generateAvailableDates(currentViewDate);

	const formatDate = (date: Date) => {
		return date.toISOString().split("T")[0];
	};

	const formatDisplayDate = (date: Date) => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return "Hoy";
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return "Mañana";
		} else {
			return date.toLocaleDateString("es-ES", {
				weekday: "short",
				day: "numeric",
				month: "short",
			});
		}
	};

	// Navigation functions
	const goToPreviousWeek = () => {
		const newDate = new Date(currentViewDate);
		newDate.setDate(currentViewDate.getDate() - 7);
		// Don't allow going to past dates
		const today = new Date();
		if (newDate >= today || newDate.toDateString() === today.toDateString()) {
			setCurrentViewDate(newDate);
		}
	};

	const goToNextWeek = () => {
		const newDate = new Date(currentViewDate);
		newDate.setDate(currentViewDate.getDate() + 7);
		setCurrentViewDate(newDate);
	};

	const goToPreviousMonth = () => {
		const newDate = new Date(currentViewDate);
		newDate.setMonth(currentViewDate.getMonth() - 1);
		// Don't allow going to past dates
		const today = new Date();
		if (newDate >= today || newDate.toDateString() === today.toDateString()) {
			setCurrentViewDate(newDate);
		} else {
			// If previous month would be in the past, set to today
			setCurrentViewDate(today);
		}
	};

	const goToNextMonth = () => {
		const newDate = new Date(currentViewDate);
		newDate.setMonth(currentViewDate.getMonth() + 1);
		setCurrentViewDate(newDate);
	};

	const resetToToday = () => {
		setCurrentViewDate(new Date());
	};

	const getViewDateRange = () => {
		const startDate = availableDates[0];
		const endDate = availableDates[availableDates.length - 1];
		return {
			start: startDate.toLocaleDateString("es-ES", {
				day: "numeric",
				month: "short",
			}),
			end: endDate.toLocaleDateString("es-ES", {
				day: "numeric",
				month: "short",
			}),
			month: startDate.toLocaleDateString("es-ES", {
				month: "long",
				year: "numeric",
			}),
		};
	};

	// Calendar functions
	const generateCalendarDays = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();

		// First day of the month
		const firstDay = new Date(year, month, 1);
		// Last day of the month
		const lastDay = new Date(year, month + 1, 0);

		// Start with first Sunday before or on the first day of month
		const startDate = new Date(firstDay);
		startDate.setDate(firstDay.getDate() - firstDay.getDay());

		// Generate 42 days (6 weeks) to fill the calendar
		const days = [];
		const currentDate = new Date(startDate);

		for (let i = 0; i < 42; i++) {
			days.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return days;
	};

	const goToCalendarPreviousMonth = () => {
		const newDate = new Date(calendarDate);
		newDate.setMonth(calendarDate.getMonth() - 1);
		// Don't allow going to past months
		const today = new Date();
		const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const targetMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

		if (targetMonth >= currentMonth) {
			setCalendarDate(newDate);
		}
	};

	const goToCalendarNextMonth = () => {
		const newDate = new Date(calendarDate);
		newDate.setMonth(calendarDate.getMonth() + 1);
		setCalendarDate(newDate);
	};

	const handleCalendarDateSelect = (date: Date) => {
		const dateStr = formatDate(date);
		setSelectedDate(dateStr);
		const availableTimes = getAvailableTimesForDate(dateStr);
		if (availableTimes.length > 0) {
			setShowTimeSlots(true);
			setShowCalendarView(false);
			setCameFromCalendar(true); // Remember user came from calendar
		}
		// Reset selected time when date changes
		if (selectedTime && selectedTime.date !== dateStr) {
			onTimeChange({ date: dateStr, time: "" });
		}
	};

	const toggleCalendarView = () => {
		setShowCalendarView(!showCalendarView);
		if (!showCalendarView) {
			// Going to calendar view, sync the calendar date with current view
			setCalendarDate(new Date(currentViewDate));
		}
	};

	const handleDateSelect = (date: string) => {
		setSelectedDate(date);
		const availableTimes = getAvailableTimesForDate(date);
		if (availableTimes.length > 0) {
			setShowTimeSlots(true);
			setCameFromCalendar(false); // User came from date selection, not calendar
		}
		// Reset selected time when date changes
		if (selectedTime && selectedTime.date !== date) {
			onTimeChange({ date, time: "" });
		}
	};

	const goBackFromTimeSlots = () => {
		setShowTimeSlots(false);
		if (cameFromCalendar) {
			setShowCalendarView(true);
		}
		// Otherwise it goes back to the date selection view (default)
	};

	const handleTimeSelect = (time: string) => {
		if (selectedDate) {
			onTimeChange({ date: selectedDate, time });
			// Automatically proceed to next step
			setTimeout(() => {
				onNext();
			}, 300);
		}
	};

	// Navigation functions for day-to-day navigation in time slots view
	const goToPreviousDay = () => {
		const currentDate = new Date(selectedDate);
		const previousDay = new Date(currentDate);
		previousDay.setDate(currentDate.getDate() - 1);

		// Don't allow going to past dates
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		previousDay.setHours(0, 0, 0, 0);

		if (previousDay >= today) {
			const newDateStr = formatDate(previousDay);
			setSelectedDate(newDateStr);
		}
	};

	const goToNextDay = () => {
		const currentDate = new Date(selectedDate);
		const nextDay = new Date(currentDate);
		nextDay.setDate(currentDate.getDate() + 1);
		const newDateStr = formatDate(nextDay);
		setSelectedDate(newDateStr);
	};

	// Simulate some unavailable times
	const getUnavailableTimes = (date: string) => {
		// Simulate some booked times based on date
		const dayOfWeek = new Date(date).getDay();
		const unavailable = [];

		if (dayOfWeek === 1) {
			// Monday
			unavailable.push("09:00", "10:00", "15:00");
		} else if (dayOfWeek === 2) {
			// Tuesday
			unavailable.push("11:30", "14:00", "16:30");
		} else if (dayOfWeek === 0) {
			// Sunday - no availability
			return [...AVAILABLE_TIMES]; // All times unavailable
		}

		return unavailable;
	};

	const getAvailableTimesForDate = (date: string) => {
		const unavailable = getUnavailableTimes(date);
		return AVAILABLE_TIMES.filter((time) => !unavailable.includes(time));
	};

	const isTimeAvailable = (time: string) => {
		if (!selectedDate) return false;
		const unavailable = getUnavailableTimes(selectedDate);
		return !unavailable.includes(time);
	};

	const isDayAvailable = (date: string) => {
		const availableTimes = getAvailableTimesForDate(date);
		return availableTimes.length > 0;
	};

	if (showTimeSlots) {
		// Time Selection View
		const availableTimes = getAvailableTimesForDate(selectedDate);

		return (
			<div className="h-full flex flex-col space-y-4">
				{/* Header with Navigation */}
				<div className="space-y-3">
					{/* Back Button */}
					<div className="text-left">
						<Button
							variant="ghost"
							size="sm"
							onPress={goBackFromTimeSlots}
							className="text-default-600"
						>
							← {cameFromCalendar ? "Volver al calendario" : "Volver a fechas"}
						</Button>
					</div>

					<div className="text-center">
						<div className="flex items-center justify-center gap-4">
							<Button
								isIconOnly
								variant="bordered"
								size="sm"
								onPress={goToPreviousDay}
								className="border-blue-200 hover:bg-blue-50"
							>
								<SafeIcon
									icon="solar:alt-arrow-left-linear"
									className="w-5 h-5 text-blue-600"
								/>
							</Button>

							<h3 className="text-xl font-semibold">
								{formatDisplayDate(new Date(selectedDate))}
							</h3>

							<Button
								isIconOnly
								variant="bordered"
								size="sm"
								onPress={goToNextDay}
								className="border-blue-200 hover:bg-blue-50"
							>
								<SafeIcon
									icon="solar:alt-arrow-right-linear"
									className="w-5 h-5 text-blue-600"
								/>
							</Button>
						</div>
					</div>
				</div>

				{/* Time Selection */}
				<div className="flex-1 overflow-y-auto space-y-3">
					<div className="grid grid-cols-3 gap-2">
						{availableTimes.map((time) => {
							const isSelected =
								selectedTime?.time === time &&
								selectedTime.date === selectedDate;

							return (
								<Button
									key={time}
									variant={isSelected ? "solid" : "bordered"}
									color={isSelected ? "primary" : "default"}
									onPress={() => handleTimeSelect(time)}
									size="sm"
									className="h-12"
								>
									{time}
								</Button>
							);
						})}
					</div>

					{availableTimes.length === 0 && (
						<div className="text-center py-8">
							<div className="mb-3">
								<span className="text-4xl">📅</span>
							</div>
							<p className="text-default-500 mb-2 font-medium">
								No hay horarios disponibles
							</p>
							<p className="text-sm text-default-400">
								Este día está completamente reservado. <br />
								Usa el botón de volver para seleccionar otra fecha.
							</p>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Calendar View
	if (showCalendarView) {
		const calendarDays = generateCalendarDays(calendarDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return (
			<div className="h-full flex flex-col space-y-4">
				{/* Calendar Header */}
				<div className="space-y-2">
					<h4 className="text-sm font-medium text-default-600 text-center">
						Selecciona cualquier fecha
					</h4>
					<div className="flex items-center justify-between bg-default-50 p-3 rounded-lg">
						<Button
							variant="ghost"
							size="sm"
							onPress={goToCalendarPreviousMonth}
							className="min-w-0 p-2"
						>
							←
						</Button>

						<div className="flex flex-col items-center">
							<span className="font-medium text-sm">
								{calendarDate.toLocaleDateString("es-ES", {
									month: "long",
									year: "numeric",
								})}
							</span>
						</div>

						<Button
							variant="ghost"
							size="sm"
							onPress={goToCalendarNextMonth}
							className="min-w-0 p-2"
						>
							→
						</Button>
					</div>
				</div>

				{/* Toggle Button */}
				<div className="text-center">
					<Button
						variant="bordered"
						size="sm"
						onPress={toggleCalendarView}
						className="text-primary border-primary"
					>
						Ver fechas próximas
					</Button>
				</div>

				{/* Calendar Grid */}
				<div className="flex-1 overflow-y-auto">
					{/* Days of Week Header */}
					<div className="grid grid-cols-7 gap-1 mb-2">
						{["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
							<div
								key={day}
								className="text-center text-xs font-medium text-default-500 p-2"
							>
								{day}
							</div>
						))}
					</div>

					{/* Calendar Days */}
					<div className="grid grid-cols-7 gap-1">
						{calendarDays.map((day, index) => {
							const dayStr = formatDate(day);
							const isCurrentMonth = day.getMonth() === calendarDate.getMonth();
							const isPastDate = day < today;
							const isAvailable =
								isCurrentMonth && !isPastDate && isDayAvailable(dayStr);
							const isSelected = selectedDate === dayStr;
							const dayOfMonth = day.getDate();

							return (
								<Button
									key={index}
									variant={isSelected ? "solid" : "ghost"}
									color={isSelected ? "primary" : "default"}
									onPress={() =>
										isAvailable ? handleCalendarDateSelect(day) : undefined
									}
									disabled={!isAvailable}
									className={`
										h-10 w-full min-w-0 p-1 text-xs
										${!isCurrentMonth ? "opacity-30" : ""}
										${isPastDate ? "opacity-30" : ""}
										${!isAvailable && isCurrentMonth && !isPastDate ? "opacity-50" : ""}
										${isAvailable ? "hover:bg-primary-100" : ""}
									`}
								>
									{dayOfMonth}
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	// Date Selection View (Default)
	return (
		<div className="h-full flex flex-col space-y-4">
			{/* Navigation Controls */}
			<div className="flex items-center justify-between bg-default-50 p-3 rounded-lg">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onPress={goToPreviousWeek}
						className="min-w-0 p-2"
					>
						←
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onPress={goToPreviousMonth}
						className="min-w-0 p-2"
					>
						⟨⟨
					</Button>
				</div>

				<div className="flex flex-col items-center">
					<span className="font-medium text-sm">
						{getViewDateRange().month}
					</span>
					<span className="text-xs text-default-500">
						{getViewDateRange().start} - {getViewDateRange().end}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onPress={goToNextMonth}
						className="min-w-0 p-2"
					>
						⟩⟩
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onPress={goToNextWeek}
						className="min-w-0 p-2"
					>
						→
					</Button>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col gap-2">
				{/* Reset to Today Button */}
				{currentViewDate.toDateString() !== new Date().toDateString() && (
					<div className="text-center">
						<Button
							variant="bordered"
							size="sm"
							onPress={resetToToday}
							className="text-primary border-primary"
						>
							Volver a hoy
						</Button>
					</div>
				)}

				{/* Toggle Calendar View Button */}
				<div className="text-center">
					<Button
						variant="bordered"
						size="sm"
						onPress={toggleCalendarView}
						className="text-secondary border-secondary"
					>
						📅 Ver calendario completo
					</Button>
				</div>
			</div>

			{/* Date Selection */}
			<div className="flex-1 overflow-y-auto space-y-4">
				<div>
					<h4 className="text-sm font-medium text-default-600 mb-3 text-center">
						Fechas próximas disponibles
					</h4>
					<div className="grid grid-cols-2 gap-3">
						{availableDates.map((date) => {
							const dateStr = formatDate(date);
							const isAvailable = isDayAvailable(dateStr);
							const isSelected = selectedDate === dateStr;

							return (
								<Button
									key={dateStr}
									variant={isSelected ? "solid" : "bordered"}
									color={isSelected ? "primary" : "default"}
									onPress={() => handleDateSelect(dateStr)}
									disabled={!isAvailable}
									className={`flex flex-col p-4 h-auto ${!isAvailable ? "opacity-40" : ""}`}
								>
									<span className="font-semibold">
										{formatDisplayDate(date)}
									</span>
									<span className="text-xs opacity-75">
										{date.toLocaleDateString("es-ES", {
											day: "numeric",
											month: "short",
										})}
									</span>
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimeSelection;
