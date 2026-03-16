import { Card, CardBody } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SelectableCardProps {
	isSelected: boolean;
	onSelect: () => void;
	children: ReactNode;
	className?: string;
	height?: string;
}

export const SelectableCard = ({
	isSelected,
	onSelect,
	children,
	className = "",
	height = "h-[120px]",
}: SelectableCardProps) => {
	return (
		<motion.button
			onClick={onSelect}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.3 }}
			className={`w-full ${height}`}
			type="button"
		>
			<Card
				shadow="md"
				className={`w-full h-full transition-all duration-300 border-2 rounded-2xl relative overflow-hidden ${
					isSelected
						? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
						: "border-gray-200 dark:border-gray-700 bg-white dark:bg-content1 hover:border-primary-300"
				} ${className}`}
			>
				<CardBody className="flex flex-col h-full items-center justify-center relative overflow-hidden p-4">
					{/* Checkmark indicator */}
					<div
						className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
							isSelected
								? "border-primary-500 bg-primary-500"
								: "border-gray-300 dark:border-gray-600 bg-transparent"
						}`}
					>
						{isSelected ? (
							<motion.svg
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 20,
									duration: 0.3,
								}}
								className="w-3 h-3 text-white"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="3"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path d="M5 13l4 4L19 7" />
							</motion.svg>
						) : null}
					</div>

					{/* Content */}
					{children}
				</CardBody>
			</Card>
		</motion.button>
	);
};
