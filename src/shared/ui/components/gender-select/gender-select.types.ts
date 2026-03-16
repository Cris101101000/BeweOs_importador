import type { EnumGender } from "@shared/domain/enums";

export interface GenderSelectProps {
	value?: EnumGender | null;
	onSelectionChange: (gender: EnumGender | null) => void;
	isRequired?: boolean;
	isInvalid?: boolean;
	errorMessage?: string;
	label?: string;
	placeholder?: string;
	className?: string;
	isDisabled?: boolean;
}
