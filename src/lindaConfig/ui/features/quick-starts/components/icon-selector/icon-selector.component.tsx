import { IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { QUICK_START_ICON_OPTIONS } from "../../../../../domain/quick-starts/constants";
import type { IconSelectorProps } from "./icon-selector.types";

export const IconSelector = ({
	selectedIcon,
	onIconSelect,
	label,
}: IconSelectorProps) => {
	const { t } = useTranslate();
	const displayLabel = label ?? t("linda_quick_starts_icon_label");
	return (
		<div>
			<label className="block text-sm font-medium text-default-700 mb-2">
				{displayLabel}
			</label>
			<div className="grid grid-cols-6 gap-2">
				{QUICK_START_ICON_OPTIONS.map((icon) => (
					<button
						key={icon}
						type="button"
						onClick={() => onIconSelect(icon)}
						className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
							selectedIcon === icon
								? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
								: "border-default-200 hover:border-default-300 dark:border-default-700"
						}`}
					>
						<IconComponent icon={icon} size="md" />
					</button>
				))}
			</div>
		</div>
	);
};
