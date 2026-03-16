import { Card, CardBody } from "@beweco/aurora-ui";
import { motion } from "framer-motion";

type ColorKey = "blue" | "red" | "green";

interface DiagnosticCardProps {
	emoji: string;
	title: string;
	min: number;
	max: number;
	unit: string;
	fuente: string;
	color: ColorKey;
	delay?: number;
}

export const DiagnosticCard = ({
	emoji,
	title,
	min,
	max,
	unit,
	fuente,
	color,
	delay = 0,
}: DiagnosticCardProps) => {
	const colorConfig: Record<
		ColorKey,
		{ border: string; bg: string; text: string; glow: string }
	> = {
		blue: {
			border: "border-blue-200 dark:border-blue-800/50",
			bg: "bg-blue-50/30 dark:bg-blue-950/20",
			text: "text-blue-600 dark:text-blue-400",
			glow: "hover:shadow-blue-200/50 dark:hover:shadow-blue-800/30",
		},
		red: {
			border: "border-red-200 dark:border-red-800/50",
			bg: "bg-red-50/30 dark:bg-red-950/20",
			text: "text-red-600 dark:text-red-400",
			glow: "hover:shadow-red-200/50 dark:hover:shadow-red-800/30",
		},
		green: {
			border: "border-green-200 dark:border-green-800/50",
			bg: "bg-green-50/30 dark:bg-green-950/20",
			text: "text-green-600 dark:text-green-400",
			glow: "hover:shadow-green-200/50 dark:hover:shadow-green-800/30",
		},
	};

	const styles = colorConfig[color];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.97 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ delay, duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
		>
			<Card
				shadow="md"
				className={`w-full h-[260px] md:h-[270px] transition-all duration-300 border-2 rounded-2xl relative ${styles.border} ${styles.bg} bg-white dark:bg-content1 hover:scale-[1.03] hover:shadow-lg ${styles.glow} cursor-pointer`}
			>
				<CardBody className="px-3 pt-6 pb-4 flex flex-col h-full overflow-visible">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: delay + 0.2, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
						className="text-4xl mb-2 text-center"
					>
						{emoji}
					</motion.div>

					<div className="mb-4 text-center px-0 min-h-[4.5rem] flex items-center justify-center">
						<h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
							{title}
						</h3>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: delay + 0.4, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
						className="mt-auto text-center"
					>
						<div className={`text-3xl lg:text-5xl font-black tracking-tight ${styles.text} flex items-baseline justify-center`}>
							<span>{Math.round((min + max) / 2).toLocaleString()}</span>
						</div>
						<p className="text-sm lg:text-base text-gray-500 dark:text-gray-500 mt-1">{unit}</p>
					</motion.div>

					{/* <motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: delay + 0.6, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
						className="flex items-center gap-2 flex-wrap justify-center pt-3"
					>
						<span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md bg-white/30 dark:bg-gray-800/30 border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm">
							{fuente}
						</span>
					</motion.div> */}
				</CardBody>
			</Card>
		</motion.div>
	);
};
