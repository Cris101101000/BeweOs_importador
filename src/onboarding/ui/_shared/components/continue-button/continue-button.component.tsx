import { Button } from "@beweco/aurora-ui";
import { motion } from "framer-motion";

interface ContinueButtonProps {
	label?: string;
	onPress: () => void;
	isDisabled?: boolean;
	isLoading?: boolean;
	delay?: number;
	showOpacityAnimation?: boolean;
	opacity?: number;
}

export const ContinueButton = ({
	label = "Continuar",
	onPress,
	isDisabled = false,
	isLoading = false,
	delay = 0,
	showOpacityAnimation = false,
	opacity = 1,
}: ContinueButtonProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: showOpacityAnimation ? opacity : 1 }}
			transition={{ delay, duration: 0.3 }}
			className="fixed bottom-8 right-8 z-20"
		>
			<Button
				size="lg"
				color="primary"
				onPress={onPress}
				isDisabled={isDisabled}
				isLoading={isLoading}
				className="rounded-full px-8 shadow-lg hover:shadow-xl disabled:opacity-30"
				endContent={
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				}
			>
				{label}
			</Button>
		</motion.div>
	);
};
