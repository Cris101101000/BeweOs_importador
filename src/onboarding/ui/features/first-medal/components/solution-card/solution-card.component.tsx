import { Card, CardBody } from "@beweco/aurora-ui";
import { motion } from "framer-motion";

interface SolutionCardProps {
	emoji: string;
	problem: string;
	solution: string;
	delay?: number;
	isHighlighted?: boolean;
}

export const SolutionCard = ({
	emoji,
	problem,
	solution,
	delay = 0,
	isHighlighted = false,
}: SolutionCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
			className="relative"
		>
			{isHighlighted ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
					animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
					transition={{ delay: delay + 0.3, duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
					className="absolute -top-2 -right-2 z-10"
				>
					<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
						<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						<span>Tu negocio aplica muy bien</span>
					</div>
				</motion.div>
			) : null}

			<Card
				shadow="md"
				className={`w-full min-h-[100px] transition-transform duration-300 border rounded-2xl relative border-gray-200 dark:border-gray-700 bg-white dark:bg-content1 hover:scale-[1.02] cursor-pointer ${
					isHighlighted ? "ring-2 ring-blue-500/30" : ""
				}`}
			>
				<CardBody className="p-4 flex items-center overflow-hidden">
					<div className="flex items-start gap-4 w-full">
						<span className="text-2xl flex-shrink-0 mt-1">{emoji}</span>
						<div className="flex-grow min-w-0">
							<h4 className="text-medium font-bold text-gray-900 dark:text-white mb-1 leading-tight">
								{problem}
							</h4>
							<p className="text-sm text-gray-600 dark:text-gray-400 font-normal leading-snug">
								{solution}
							</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</motion.div>
	);
};
