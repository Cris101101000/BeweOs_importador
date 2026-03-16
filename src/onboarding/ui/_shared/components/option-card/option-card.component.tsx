import { SelectableCard } from "../selectable-card";

interface OptionCardProps {
	emoji: string;
	title: string;
	subtitle?: string;
	isSelected: boolean;
	onSelect: () => void;
}

export const OptionCard = ({
	emoji,
	title,
	subtitle,
	isSelected,
	onSelect,
}: OptionCardProps) => {
	return (
		<SelectableCard isSelected={isSelected} onSelect={onSelect}>
			<div className="flex flex-col items-center justify-center w-full gap-1">
				<span className="text-2xl">{emoji}</span>
				<div className="text-center w-full">
					<p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
						{title}
					</p>
					{subtitle ? (
						<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-normal leading-tight">
							{subtitle}
						</p>
					) : null}
				</div>
			</div>
		</SelectableCard>
	);
};
