import type { ContactRangeId } from "../enums/contact-range.enum";

export interface IContactRange {
	id: ContactRangeId;
	emoji: string;
	label: string;
	range: string;
}
