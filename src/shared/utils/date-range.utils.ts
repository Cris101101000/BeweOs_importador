/**
 * Utility functions for date range calculations
 */

/**
 * Returns the same calendar day at end of day in UTC (23:59:59.999).
 * Use for "to" dates in filters so a selected day includes the full day.
 *
 * @param date - Any date on the target day
 * @returns New Date set to that day at 23:59:59.999 UTC
 */
export const getEndOfDayUTC = (date: Date): Date => {
	const d = new Date(date);
	d.setUTCHours(23, 59, 59, 999);
	return d;
};

/**
 * Gets the date range for the last month (from one month ago to today)
 * Always returns fresh dates to ensure newly created clients are included
 * @returns Object with from and to dates for the last month range
 */
export const getLastMonthDateRange = (): { from: Date; to: Date } => {
	// Always generate fresh dates to capture newly created clients
	const today = new Date();
	const oneMonthAgo = new Date(today);
	oneMonthAgo.setMonth(today.getMonth() - 1);

	// Handle edge case where current day doesn't exist in previous month
	// (e.g., March 31 -> February 28/29)
	if (oneMonthAgo.getMonth() === today.getMonth()) {
		oneMonthAgo.setDate(0); // Set to last day of previous month
	}

	return {
		from: oneMonthAgo,
		to: today,
	};
};

/**
 * Creates a fresh date range for including newly created clients
 * Optimized for performance and reusability
 * @returns Object with from and to dates, where 'to' is always current time
 */
export const getFreshLastMonthDateRange = (): { from: Date; to: Date } => {
	const now = new Date();
	const oneMonthAgo = new Date(now);
	oneMonthAgo.setMonth(now.getMonth() - 1);

	// Handle edge case where current day doesn't exist in previous month
	if (oneMonthAgo.getMonth() === now.getMonth()) {
		oneMonthAgo.setDate(0);
	}

	return {
		from: oneMonthAgo,
		to: now,
	};
};

/**
 * Gets the date range for the last N days
 * @param days - Number of days to go back
 * @returns Object with from and to dates for the specified range
 */
export const getLastNDaysDateRange = (
	days: number
): { from: Date; to: Date } => {
	const today = new Date();
	const nDaysAgo = new Date(today);
	nDaysAgo.setDate(today.getDate() - days);

	return {
		from: nDaysAgo,
		to: today,
	};
};

/**
 * Gets the date range for the current week (Monday to Sunday)
 * @returns Object with from and to dates for the current week
 */
export const getCurrentWeekDateRange = (): { from: Date; to: Date } => {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const monday = new Date(today);
	const sunday = new Date(today);

	// Get Monday (start of week)
	monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

	// Get Sunday (end of week)
	sunday.setDate(monday.getDate() + 6);

	return {
		from: monday,
		to: sunday,
	};
};

/**
 * Gets the date range for the current month
 * @returns Object with from and to dates for the current month
 */
export const getCurrentMonthDateRange = (): { from: Date; to: Date } => {
	const today = new Date();
	const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
	const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	return {
		from: firstDay,
		to: lastDay,
	};
};
