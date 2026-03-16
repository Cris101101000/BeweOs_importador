import type { HistorySubTabKey } from "../../../domain/constants/applicable-entity.config";
import type { IEnrichedTagAssignment } from "../../../domain/interfaces/tag-assignment.interface";

export interface TagHistoryTableProps {
	assignments: IEnrichedTagAssignment[];
	isLoading: boolean;
	error: string | null;
	page: number;
	onPageChange: (page: number) => void;
	rowsPerPage?: number;
	historySubTab: HistorySubTabKey;
}
