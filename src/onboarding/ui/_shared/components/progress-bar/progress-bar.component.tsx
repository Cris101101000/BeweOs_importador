import { motion } from "framer-motion";

interface ProgressBarProps {
	progressPercentage: number;
	currentStep: number;
	totalSteps: number;
	milestones?: number[];
}

export const ProgressBar = ({
	progressPercentage,
	currentStep,
	totalSteps,
	milestones = [],
}: ProgressBarProps) => {
	return (
		<div className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
			<div className="relative h-1">
				<div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
				<motion.div
					className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-300 to-primary-600"
					initial={{ width: 0 }}
					animate={{ width: `${progressPercentage}%` }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				/>
				{milestones.map((milestone) => {
					const milestonePosition = (milestone / totalSteps) * 100;
					const isPassed = currentStep >= milestone;
					return (
						<div
							key={milestone}
							className={`absolute top-0 bottom-0 w-1 ${
								isPassed
									? "bg-primary-600 dark:bg-primary-400"
									: "bg-gray-300 dark:bg-gray-600"
							}`}
							style={{ left: `${milestonePosition}%` }}
						/>
					);
				})}
			</div>
		</div>
	);
};
