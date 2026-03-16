import { BehaviorRulePriority } from "./enums";
import type { BehaviorRulePriorityLabel } from "./interfaces";

export const PRIORITY_LABEL_MAP: Record<
	BehaviorRulePriority,
	BehaviorRulePriorityLabel
> = {
	[BehaviorRulePriority.LOW]: "baja",
	[BehaviorRulePriority.MEDIUM]: "media",
	[BehaviorRulePriority.HIGH]: "alta",
};

export const LABEL_PRIORITY_MAP: Record<
	BehaviorRulePriorityLabel,
	BehaviorRulePriority
> = {
	baja: BehaviorRulePriority.LOW,
	media: BehaviorRulePriority.MEDIUM,
	alta: BehaviorRulePriority.HIGH,
};
