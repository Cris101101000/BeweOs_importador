import { H2, IconComponent } from "@beweco/aurora-ui";
import type { FC } from "react";

export interface CollapsibleHeaderProps {
	title: string;
	isExpanded: boolean;
	onToggle: () => void;
}

export const CollapsibleHeader: FC<CollapsibleHeaderProps> = ({
	title,
	isExpanded,
	onToggle,
}) => (
	<div
		className="flex items-center justify-between p-4 cursor-pointer"
		onClick={onToggle}
	>
		<H2 className="text-base font-semibold text-gray-900">{title}</H2>
		{isExpanded ? (
			<IconComponent icon="solar:alt-arrow-up-outline" />
		) : (
			<IconComponent icon="solar:alt-arrow-down-outline" />
		)}
	</div>
);

