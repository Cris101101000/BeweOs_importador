import { ContactRangeId } from "../enums/contact-range.enum";
import type { IContactRange } from "../interfaces/contact-range.interface";

export const CONTACT_RANGES: IContactRange[] = [
	{ id: ContactRangeId.MENOS_50, emoji: "👤", label: "Menos de 50", range: "contactos/mes" },
	{ id: ContactRangeId.RANGE_50_100, emoji: "👥", label: "50-100", range: "contactos/mes" },
	{ id: ContactRangeId.RANGE_100_300, emoji: "👨‍👩‍👧‍👦", label: "100-300", range: "contactos/mes" },
	{ id: ContactRangeId.RANGE_300_500, emoji: "🏢", label: "300-500", range: "contactos/mes" },
	{ id: ContactRangeId.RANGE_500_1000, emoji: "🏭", label: "500-1,000", range: "contactos/mes" },
	{ id: ContactRangeId.MAS_1000, emoji: "🚀", label: "Más de 1000", range: "contactos/mes" },
];
