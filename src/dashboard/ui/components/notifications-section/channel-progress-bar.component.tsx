import type { FC } from "react";

export interface ChannelProgressBarProps {
	label: string;
	value: number;
	trackColor: string;
	fillColor: string;
}

export const ChannelProgressBar: FC<ChannelProgressBarProps> = ({
	label,
	value,
	trackColor,
	fillColor,
}) => {
	const percentage = Math.min(100, value);

	return (
		<div className="flex items-center gap-3">
			<span className="text-sm font-medium text-gray-700 w-24">{label}</span>
			<div
				className={`flex-1 h-3 rounded-full overflow-hidden ${trackColor}`}
			>
				<div
					className={`h-full rounded-full transition-all ${fillColor}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<span className="text-xs text-gray-500 w-10 text-right">
				{value}%
			</span>
		</div>
	);
};
