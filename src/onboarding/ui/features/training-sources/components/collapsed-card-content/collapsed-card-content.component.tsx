import { Button } from "@beweco/aurora-ui";
import type { TrainingSourceType } from "../../hooks";

interface CollapsedCardContentProps {
	type: TrainingSourceType;
	icon: string;
	label: string;
	cardDescription: string;
	isAdded: boolean;
	uploadedFiles: File[];
	onToggleExpand: (type: TrainingSourceType) => void;
	onRemoveFile: (index: number) => void;
}

export const CollapsedCardContent = ({
	type,
	icon,
	label,
	cardDescription,
	isAdded,
	uploadedFiles,
	onToggleExpand,
	onRemoveFile,
}: CollapsedCardContentProps) => {
	const buttonLabel =
		isAdded && type === "website"
			? "Modificar"
			: isAdded && type === "files"
				? "Agregar más"
				: "Añadir";

	return (
		<>
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 flex-1">
					<span className="text-2xl">{icon}</span>
					<div className="flex-1 min-w-0">
						<p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
							{label}
							{isAdded ? <span className="text-green-600">✓</span> : null}
						</p>
						<p className="text-xs text-gray-600 dark:text-gray-400 truncate">
							{cardDescription}
						</p>
					</div>
				</div>
				<Button
					size="sm"
					color="primary"
					variant="bordered"
					onPress={() => onToggleExpand(type)}
					className="rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 px-4 py-1 font-medium"
				>
					{buttonLabel}
				</Button>
			</div>
			{type === "files" && uploadedFiles.length > 0 ? (
				<div
					style={{ maxHeight: '7rem' }} 
					className="overflow-y-auto space-y-1 mt-1 pr-1"
				>
					{uploadedFiles.map((file, index) => (
						<div
							key={`${file.name}-${index.toString()}`}
							className="flex items-center justify-between p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center gap-2 flex-1 min-w-0">
								<p className="text-xs font-medium text-gray-900 dark:text-white truncate">
									{file.name}
								</p>
							</div>
							<Button
								size="sm"
								color="danger"
								variant="light"
								onPress={() => onRemoveFile(index)}
								className="min-w-0 px-2"
							>
								X
							</Button>
						</div>
					))}
				</div>
			) : null}
		</>
	);
};
