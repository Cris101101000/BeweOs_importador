import {
	Button,
	Checkbox,
	Chip,
	H3,
	IconComponent,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
} from "@beweco/aurora-ui";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import type { IExplorationState, ISubUrl } from "../../store";
import { INGESTION_CONSTANTS } from "../../store";

interface UrlExplorationModalProps {
	exploration: IExplorationState;
	onClose: () => void;
	onConfirm: () => { success: boolean; error?: string };
	onToggleSubUrl: (urlId: string) => void;
	filterUrlsBySearch: (searchQuery: string) => ISubUrl[];
	selectedCount: number;
}

export const UrlExplorationModal: React.FC<UrlExplorationModalProps> = ({
	exploration,
	onClose,
	onConfirm,
	onToggleSubUrl,
	filterUrlsBySearch,
	selectedCount,
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredUrls = useMemo(
		() => filterUrlsBySearch(searchQuery),
		[filterUrlsBySearch, searchQuery]
	);

	const handleConfirm = useCallback(() => {
		const result = onConfirm();
		if (!result.success && result.error) {
			alert(result.error);
		}
	}, [onConfirm]);

	return (
		<Modal
			isOpen={exploration.isOpen}
			onClose={onClose}
			size="3xl"
			scrollBehavior="inside"
			isDismissable={false}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center justify-between w-full">
						<div>
							<H3>Explorar sub-URLs</H3>
							<P className="text-sm text-default-500 font-normal">
								{exploration.mainUrl}{" "}
								{exploration.status === "done" &&
									`• ${exploration.discoveredSubUrls.length} páginas encontradas`}
							</P>
						</div>
						<Chip size="sm" color="primary" variant="flat">
							{selectedCount}/{INGESTION_CONSTANTS.MAX_SELECTED_URLS}
						</Chip>
					</div>
				</ModalHeader>

				<ModalBody>
					{/* Exploring State */}
					{exploration.status === "exploring" && (
						<ExploringState
							mainUrl={exploration.mainUrl}
							progress={exploration.progress}
							discoveredCount={exploration.discoveredSubUrls.length}
						/>
					)}

					{/* Results State */}
					{exploration.status === "done" && (
						<ResultsState
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							filteredUrls={filteredUrls}
							onToggleSubUrl={onToggleSubUrl}
							selectedCount={selectedCount}
						/>
					)}

					{/* Error State */}
					{exploration.status === "error" && (
						<ErrorState mainUrl={exploration.mainUrl} />
					)}
				</ModalBody>

				<ModalFooter className="flex p-0 mt-4">
					<Button
						color="default"
						variant="flat"
						onPress={onClose}
						isDisabled={exploration.status === "exploring"}
						className="flex-1"
					>
						Cancelar
					</Button>
					<Button
						color="primary"
						onPress={handleConfirm}
						isDisabled={exploration.status !== "done" || selectedCount === 0}
						className="flex-1"
					>
						Cargar {selectedCount > 0 ? `${selectedCount} ` : ""}URL
						{selectedCount !== 1 ? "s" : ""}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

// ============================================================================
// Sub-components
// ============================================================================

interface ExploringStateProps {
	mainUrl: string;
	progress: number;
	discoveredCount: number;
}

const ExploringState: React.FC<ExploringStateProps> = ({
	mainUrl,
	progress,
	discoveredCount,
}) => (
	<div className="flex flex-col items-center justify-center py-12 space-y-4">
		<IconComponent
			icon="solar:global-search-bold"
			size="xl"
			className="text-primary animate-pulse"
		/>
		<div className="w-full max-w-md">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-foreground">
					Explorando {mainUrl}...
				</span>
				<span className="text-sm font-medium text-primary">{progress}%</span>
			</div>
			<div className="w-full bg-default-200 rounded-full h-2">
				<div
					className="bg-primary h-2 rounded-full transition-all duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<p className="text-xs text-default-500 mt-2 text-center">
				Encontradas {discoveredCount} sub-URLs
			</p>
		</div>
	</div>
);

interface ResultsStateProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	filteredUrls: ISubUrl[];
	onToggleSubUrl: (urlId: string) => void;
	selectedCount: number;
}

const ResultsState: React.FC<ResultsStateProps> = ({
	searchQuery,
	onSearchChange,
	filteredUrls,
	onToggleSubUrl,
	selectedCount,
}) => (
	<div>
		{/* Search */}
		<div className="mb-4">
			<Input
				placeholder="Buscar URLs..."
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				endContent={
					<IconComponent
						icon="solar:magnifer-outline"
						className="text-default-400"
						size="sm"
					/>
				}
				className="flex-1"
			/>
		</div>

		{/* URL List - scrollable */}
		<div className="space-y-2 max-h-[400px] overflow-y-auto">
			{filteredUrls.map((subUrl) => {
				const isDisabled =
					!subUrl.selected &&
					selectedCount >= INGESTION_CONSTANTS.MAX_SELECTED_URLS;

				return (
					<div
						key={subUrl.id}
						className={`flex items-center gap-3 p-3 border rounded-medium transition-colors ${
							subUrl.selected
								? "bg-primary-50 border-primary-200"
								: isDisabled
									? "bg-default-100 border-default-200 opacity-50"
									: "bg-default-50 border-default-200 hover:border-default-300"
						}`}
					>
						<Checkbox
							isSelected={subUrl.selected}
							onValueChange={() => onToggleSubUrl(subUrl.id)}
							isDisabled={isDisabled}
							size="sm"
						/>
						<span className="text-sm text-default-700 flex-1 break-all">
							{subUrl.url}
						</span>
					</div>
				);
			})}
		</div>

		{/* No results message */}
		{filteredUrls.length === 0 && (
			<div className="text-center py-8 text-default-400">
				<IconComponent
					icon="solar:inbox-outline"
					size="xl"
					className="mx-auto mb-2"
				/>
				<p className="text-sm">No se encontraron URLs con "{searchQuery}"</p>
			</div>
		)}
	</div>
);

interface ErrorStateProps {
	mainUrl: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ mainUrl }) => (
	<div className="flex flex-col items-center justify-center py-12 space-y-4">
		<IconComponent
			icon="solar:danger-triangle-bold"
			size="xl"
			className="text-danger"
		/>
		<div className="text-center">
			<p className="text-sm font-medium text-foreground mb-2">
				Error al explorar la URL
			</p>
			<p className="text-xs text-default-500">
				No se pudo acceder a {mainUrl}. Verifica la URL e intenta de nuevo.
			</p>
		</div>
	</div>
);
