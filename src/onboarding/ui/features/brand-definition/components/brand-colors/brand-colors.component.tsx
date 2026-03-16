import { ColorPicker } from "@beweco/aurora-ui";

interface BrandColorsProps {
	primaryColorId: string;
	secondaryColorId: string;
	primaryColor: string;
	secondaryColor: string;
	isFetching: boolean;
	onPrimaryColorChange: (color: string) => void;
	onSecondaryColorChange: (color: string) => void;
}

export const BrandColors = ({
	primaryColorId,
	secondaryColorId,
	primaryColor,
	secondaryColor,
	isFetching,
	onPrimaryColorChange,
	onSecondaryColorChange,
}: BrandColorsProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="space-y-2">
				<label
					htmlFor={primaryColorId}
					className="block text-sm font-medium text-gray-900 dark:text-white"
				>
					Color Primario
				</label>
				{isFetching ? (
					<div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
				) : (
					<ColorPicker
						id={primaryColorId}
						value={primaryColor}
						onChange={onPrimaryColorChange}
						variant="bordered"
						label=""
						aria-label="Selector de color primario"
						showPredefinedColors={false}
						enableRecentColors={false}
					/>
				)}
			</div>
			<div className="space-y-2">
				<label
					htmlFor={secondaryColorId}
					className="block text-sm font-medium text-gray-900 dark:text-white"
				>
					Color Secundario
				</label>
				{isFetching ? (
					<div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
				) : (
					<ColorPicker
						id={secondaryColorId}
						value={secondaryColor}
						onChange={onSecondaryColorChange}
						variant="bordered"
						label=""
						aria-label="Selector de color secundario"
						showPredefinedColors={false}
						enableRecentColors={false}
					/>
				)}
			</div>
		</div>
	);
};
