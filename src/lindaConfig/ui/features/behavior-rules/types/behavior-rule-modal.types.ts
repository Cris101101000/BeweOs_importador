import type {
	BehaviorRulePriorityLabel,
	IBehaviorRuleProblem,
} from "../../../../domain/behavior-rules";

export interface ICreateRuleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (rule: {
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	}) => void;
	isLoading?: boolean;
	initialValues?: {
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	};
}

export interface IProblemRuleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onEdit: () => void;
	problem: IBehaviorRuleProblem;
}

export interface IEditRuleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (rule: {
		id: string;
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	}) => void;
	onDelete?: (id: string) => void;
	rule: {
		id: string;
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive?: boolean;
	} | null;
	isLoading?: boolean;
	initialValues?: {
		id: string;
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	};
}

export interface IDeleteRuleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string) => void;
	rule: { id: string; name: string; description?: string } | null;
	isLoading?: boolean;
}
