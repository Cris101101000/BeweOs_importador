import { Card, H4, P, IconComponent } from "@beweco/aurora-ui";
import type { FC } from "react";

export interface LindaRecommendationCardProps {
	icon: string;
	title: string;
	description: string;
	actionText: string;
	onActionClick?: () => void;
}

export const LindaRecommendationCard: FC<LindaRecommendationCardProps> = ({
	icon,
	title,
	description,
	actionText,
	onActionClick,
}) => {
	return (
		<Card className="linda-recommendation-card p-3">
			<div className="flex flex-col justify-between h-full relative z-10">
				<div className="flex-grow">
					<H4 className="text-sm font-semibold text-gray-900 mb-0.5 flex items-center gap-1.5">
						<IconComponent icon={icon} className="text-base shrink-0 text-blue-600" />
						{title}
					</H4>
					<P className="text-xs text-gray-600 min-h-[2.5rem]">
						{description}
					</P>
				</div>
				<button
					className="gradient-animated-text text-xs font-medium text-blue-600 text-left mt-2"
					onClick={onActionClick}
				>
					{actionText} →
				</button>
			</div>
		</Card>
	);
};

