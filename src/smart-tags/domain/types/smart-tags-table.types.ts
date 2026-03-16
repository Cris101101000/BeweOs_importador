import type { DrawerFiltersProps } from "@beweco/aurora-ui";
import { getApplicableEntityValues } from "../../infrastructure/utils/applicable-entity.util";
import type { ApplicableEntity } from "../enums/applicable-entity.enum";
import type {
	ISmartTag,
	ISmartTagsPagination,
} from "../interfaces/smart-tags-interface";

/** Tab key type: 'all' or any ApplicableEntity value */
export type SmartTagTabKey = "all" | ApplicableEntity;

/** Type guard to validate if a string is a valid SmartTagTabKey */
export const isValidSmartTagTabKey = (key: string): key is SmartTagTabKey =>
	key === "all" || (getApplicableEntityValues() as string[]).includes(key);

export interface SmartTagsTableProps {
	tags: ISmartTag[];
	isLoading?: boolean;
	onView: (tag: ISmartTag) => void;
	onEdit: (tag: ISmartTag) => void;
	onDelete: (tag: ISmartTag) => void;
	onDeleteTags?: (tagIds: string[]) => Promise<void>;
	onCreateNew: () => void;
	selectedTab?: SmartTagTabKey;
	onTabChange?: (tab: SmartTagTabKey) => void;
	filtersConfig?: DrawerFiltersProps["config"];
	currentFilters?: Record<string, any>;
	onApplyFilters?: (filters: any) => void;
	onClearFilters?: () => void;
	searchValue?: string;
	onSearchChange?: (search: string) => void;
	// Server-side pagination props
	pagination?: ISmartTagsPagination;
	onPageChange?: (page: number) => void;
}

export interface SmartTagField {
	key: string;
	label: string;
	isVisible: boolean;
	canHide: boolean;
	sortable: boolean;
	width?: number;
}

export const DEFAULT_TAG_FIELDS: SmartTagField[] = [
	{
		key: "name",
		label: "Nombre",
		isVisible: true,
		canHide: false,
		sortable: true,
	},
	{
		key: "type",
		label: "Tipo",
		isVisible: true,
		canHide: true,
		sortable: true,
		width: 220,
	},
	{
		key: "assignedTo",
		label: "Asignada a",
		isVisible: true,
		canHide: true,
		sortable: true,
		width: 140,
	},
	{
		key: "status",
		label: "Estado",
		isVisible: true,
		canHide: true,
		sortable: true,
		width: 120,
	},
	{
		key: "origin",
		label: "Origen",
		isVisible: true,
		canHide: true,
		sortable: true,
		width: 140,
	},
	{
		key: "description",
		label: "Descripción",
		isVisible: true,
		canHide: true,
		sortable: false,
	},
	{
		key: "usageCount",
		label: "Usos",
		isVisible: true,
		canHide: true,
		sortable: true,
		width: 80,
	},
	{
		key: "createdAt",
		label: "Creada",
		isVisible: true,
		canHide: true,
		sortable: true,
		width: 120,
	},
	{
		key: "actions",
		label: "Acciones",
		isVisible: true,
		canHide: false,
		sortable: false,
		width: 100,
	},
];
