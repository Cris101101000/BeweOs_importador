import type { IFile } from "src/shared/features/linda/ingestion/domain/interfaces/files";
import type {
	ISubUrl,
	IUrlGroup,
} from "src/shared/features/linda/ingestion/domain/interfaces/urls";

// Re-export domain types for convenience
export type {
	ISubUrl,
	IUrlGroup,
	UrlSource,
} from "src/shared/features/linda/ingestion/domain/interfaces/urls";
export { INGESTION_CONSTANTS } from "src/shared/features/linda/ingestion/domain/constants/ingestion.constants";
export type { DocumentType } from "src/shared/features/linda/ingestion/domain/enums/document-type.enum";

/**
 * Status of URL exploration process
 */
export type ExplorationStatus = "idle" | "exploring" | "done" | "error";

/**
 * Alias for backward compatibility - use IUrlGroup from domain
 * @deprecated Use IUrlGroup instead
 */
export type ILoadedUrl = IUrlGroup;

/**
 * URL Exploration state
 */
export interface IExplorationState {
	isOpen: boolean;
	status: ExplorationStatus;
	progress: number;
	mainUrl: string;
	discoveredSubUrls: ISubUrl[];
}

/**
 * Ingestion store state
 */
export interface IIngestionState {
	loadedUrls: IUrlGroup[];
	loadedDocuments: IFile[];
	exploration: IExplorationState;
}

/**
 * Ingestion store actions
 */
export interface IIngestionActions {
	// URLs
	setLoadedUrls: (urls: IUrlGroup[]) => void;
	addLoadedUrl: (url: IUrlGroup) => void;
	removeLoadedUrl: (id: string) => void;

	// Documents
	setLoadedDocuments: (docs: IFile[]) => void;
	addLoadedDocuments: (docs: IFile[]) => void;
	removeLoadedDocument: (id: string) => void;

	// Exploration
	startExploration: (url: string) => void;
	updateExplorationProgress: (progress: number, urls?: ISubUrl[]) => void;
	completeExploration: (urls: ISubUrl[]) => void;
	failExploration: () => void;
	toggleSubUrlSelection: (urlId: string) => void;
	closeExploration: () => void;
}

/**
 * Complete Ingestion store type
 */
export type IIngestionStore = IIngestionState & IIngestionActions;
