import { Button, Chip, H4, IconComponent, Input } from "@beweco/aurora-ui";
import type React from "react";
import { useCallback, useState } from "react";
import type { IUrlGroup } from "../../store";
import { INGESTION_CONSTANTS } from "../../store";
import { LoadedUrlsList } from "../loaded-urls-list";

interface UrlLoadingSectionProps {
	loadedUrls: IUrlGroup[];
	totalSubUrls: number;
	onExploreUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
	onRemoveUrl: (id: string) => void;
}

export const UrlLoadingSection: React.FC<UrlLoadingSectionProps> = ({
	loadedUrls,
	totalSubUrls,
	onExploreUrl,
	onRemoveUrl,
}) => {
	const [urlInput, setUrlInput] = useState("");

	// Contar todas las sub-URLs
	const totalUrlsCount = totalSubUrls;

	const handleExplore = useCallback(async () => {
		const result = await onExploreUrl(urlInput);
		if (result.success) {
			setUrlInput("");
		} else if (result.error) {
			// Error is handled by the modal (failExploration state)
			// No need to show alert here as the modal will display the error
		}
	}, [urlInput, onExploreUrl]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleExplore();
			}
		},
		[handleExplore]
	);

	return (
		<div>
			<div className="flex items-center gap-3 mb-3">
				<H4>Cargar desde URL</H4>
				<Chip size="sm" variant="flat" color="primary">
					{totalUrlsCount}/{INGESTION_CONSTANTS.MAX_SELECTED_URLS} URLs
				</Chip>
			</div>
			<div className="flex space-x-3">
				<Input
					placeholder="www.mi-negocio.com"
					className="flex-1"
					value={urlInput}
					onChange={(e) => setUrlInput(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<Button
					onPress={handleExplore}
					color="primary"
					startContent={
						<IconComponent icon="solar:global-search-bold" size="sm" />
					}
				>
					Explorar URLs
				</Button>
			</div>

			{/* Lista unificada de URLs (BD + locales) */}
			<LoadedUrlsList loadedUrls={loadedUrls} onRemoveUrl={onRemoveUrl} />
		</div>
	);
};
