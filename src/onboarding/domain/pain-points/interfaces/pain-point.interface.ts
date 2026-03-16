import type { PainPointId } from "../enums/pain-point.enum";

export interface IPainPoint {
	id: PainPointId;
	emoji: string;
	title: string;
	description: string;
}
