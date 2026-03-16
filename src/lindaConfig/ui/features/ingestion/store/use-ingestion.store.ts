import type { IFile } from "src/shared/features/linda/ingestion/domain/interfaces/files";
import { create } from "zustand";
import type {
	IIngestionState,
	IIngestionStore,
	ISubUrl,
	IUrlGroup,
} from "./ingestion.types";
import { INGESTION_CONSTANTS } from "./ingestion.types";

const initialExplorationState: IIngestionState["exploration"] = {
	isOpen: false,
	status: "idle",
	progress: 0,
	mainUrl: "",
	discoveredSubUrls: [],
};

const initialState: IIngestionState = {
	loadedUrls: [],
	loadedDocuments: [],
	exploration: initialExplorationState,
};

export const useIngestionStore = create<IIngestionStore>((set, get) => ({
	...initialState,

	setLoadedUrls: (urls: IUrlGroup[]) => {
		set({ loadedUrls: urls });
	},

	addLoadedUrl: (url: IUrlGroup) => {
		set(() => ({
			loadedUrls: [url], // Solo permite una URL, reemplaza TODO (BD + local)
		}));
	},

	removeLoadedUrl: (id: string) => {
		set((state) => ({
			loadedUrls: state.loadedUrls.filter((url) => url.id !== id),
		}));
	},

	setLoadedDocuments: (docs: IFile[]) => {
		set({ loadedDocuments: docs });
	},

	addLoadedDocuments: (docs: IFile[]) => {
		set((state) => ({
			loadedDocuments: [...state.loadedDocuments, ...docs],
		}));
	},

	removeLoadedDocument: (id: string) => {
		set((state) => ({
			loadedDocuments: state.loadedDocuments.filter((doc) => doc.id !== id),
		}));
	},

	startExploration: (url: string) => {
		set({
			exploration: {
				isOpen: true,
				status: "exploring",
				progress: 0,
				mainUrl: url,
				discoveredSubUrls: [],
			},
		});
	},

	updateExplorationProgress: (progress: number, urls?: ISubUrl[]) => {
		set((state) => ({
			exploration: {
				...state.exploration,
				progress,
				...(urls && { discoveredSubUrls: urls }),
			},
		}));
	},

	completeExploration: (urls: ISubUrl[]) => {
		set((state) => ({
			exploration: {
				...state.exploration,
				status: "done",
				progress: 100,
				discoveredSubUrls: urls,
			},
		}));
	},

	failExploration: () => {
		set((state) => ({
			exploration: {
				...state.exploration,
				status: "error",
			},
		}));
	},

	toggleSubUrlSelection: (urlId: string) => {
		const { exploration } = get();
		const selectedCount = exploration.discoveredSubUrls.filter(
			(url) => url.selected
		).length;
		const targetUrl = exploration.discoveredSubUrls.find((u) => u.id === urlId);

		if (!targetUrl) return;

		// If already selected, allow deselection
		if (targetUrl.selected) {
			set((state) => ({
				exploration: {
					...state.exploration,
					discoveredSubUrls: state.exploration.discoveredSubUrls.map((u) =>
						u.id === urlId ? { ...u, selected: false } : u
					),
				},
			}));
			return;
		}

		// If not selected and under limit, allow selection
		if (selectedCount < INGESTION_CONSTANTS.MAX_SELECTED_URLS) {
			set((state) => ({
				exploration: {
					...state.exploration,
					discoveredSubUrls: state.exploration.discoveredSubUrls.map((u) =>
						u.id === urlId ? { ...u, selected: true } : u
					),
				},
			}));
		}
	},

	closeExploration: () => {
		set({
			exploration: initialExplorationState,
		});
	},
}));

/**
 * Get total count of loaded sub-URLs across all URL groups
 */
export const selectTotalSubUrls = (state: IIngestionState): number =>
	state.loadedUrls.reduce(
		(total, urlItem) => total + urlItem.subUrls.length,
		0
	);
