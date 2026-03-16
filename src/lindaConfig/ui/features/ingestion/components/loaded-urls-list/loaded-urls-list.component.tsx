import {
	Accordion,
	AccordionItem,
	Button,
	Chip,
	IconComponent,
	P,
} from "@beweco/aurora-ui";
import type React from "react";
import type { IUrlGroup } from "../../store";

interface LoadedUrlsListProps {
	loadedUrls: IUrlGroup[];
	onRemoveUrl: (id: string) => void;
}

export const LoadedUrlsList: React.FC<LoadedUrlsListProps> = ({
	loadedUrls,
	onRemoveUrl,
}) => {
	if (loadedUrls.length === 0) {
		return null;
	}

	const formatDate = (date: Date): string => {
		return date.toLocaleString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getSourceConfig = (source: IUrlGroup["source"]) => {
		if (source === "database") {
			return {
				iconBgColor: "bg-green-500",
				badgeColor: "success" as const,
				badgeText: "Procesada",
				statusText: "Cargado",
			};
		}
		return {
			iconBgColor: "bg-blue-500",
			badgeColor: "primary" as const,
			badgeText: "Pendiente",
			statusText: "Pendiente de procesar",
		};
	};

	return (
		<div className="mt-4 space-y-2">
			<P className="text-sm text-gray-600 dark:text-gray-400 font-medium">
				URLs cargadas:
			</P>
			<div className="space-y-2">
				{loadedUrls.map((urlItem) => {
					const sourceConfig = getSourceConfig(urlItem.source);
					return (
						<Accordion key={urlItem.id} variant="splitted">
							<AccordionItem
								key={urlItem.id}
								title={
									<div className="flex items-center gap-3 w-full">
										<div
											className={`flex-shrink-0 w-8 h-8 ${sourceConfig.iconBgColor} rounded-full flex items-center justify-center`}
										>
											<IconComponent
												icon="solar:global-bold"
												size="sm"
												className="text-white"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<P className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
													{urlItem.url}
												</P>
												<Chip
													size="sm"
													variant="flat"
													color={sourceConfig.badgeColor}
												>
													{sourceConfig.badgeText}
												</Chip>
											</div>
											<P className="text-xs text-gray-500 dark:text-gray-400">
												{urlItem.subUrls.length} sub-URL
												{urlItem.subUrls.length !== 1 ? "s" : ""} •{" "}
												{sourceConfig.statusText}
												{urlItem.source === "database" &&
													`: ${formatDate(urlItem.loadedAt)}`}
											</P>
										</div>
									</div>
								}
								indicator={
									<IconComponent
										icon="solar:alt-arrow-down-outline"
										size="sm"
										className="text-default-400"
									/>
								}
							>
								<div className="pb-3">
									<P className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">
										Sub-URLs seleccionadas:
									</P>
									<ul className="space-y-1">
										{urlItem.subUrls.map((subUrl, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300"
											>
												<IconComponent
													icon="solar:check-circle-bold"
													size="sm"
													className="text-green-500 mt-0.5 flex-shrink-0"
												/>
												<span className="break-all">{subUrl}</span>
											</li>
										))}
									</ul>
									<div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
										<Button
											variant="light"
											size="sm"
											color="danger"
											onPress={() => onRemoveUrl(urlItem.id)}
											startContent={
												<IconComponent
													icon="solar:trash-bin-minimalistic-outline"
													size="sm"
												/>
											}
										>
											Eliminar grupo
										</Button>
									</div>
								</div>
							</AccordionItem>
						</Accordion>
					);
				})}
			</div>
		</div>
	);
};
