import { Button } from "@beweco/aurora-ui";
import { motion } from "framer-motion";

interface ErrorStepProps {
	onRetry: () => void;
	onSkip: () => void;
}

export const ErrorStep = ({ onRetry, onSkip }: ErrorStepProps) => {
	return (
		<motion.div
			key="error"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
		>
			<div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
				<span className="text-3xl text-red-500">!</span>
			</div>
			<h3 className="text-2xl font-serif italic font-normal text-gray-900 dark:text-white">
				No pudimos enviar el mensaje
			</h3>
			<div className="flex gap-4">
				<Button
					size="lg"
					color="primary"
					onPress={onRetry}
					className="rounded-full px-8"
				>
					Intentar de nuevo
				</Button>
				<Button
					size="lg"
					variant="light"
					onPress={onSkip}
					className="rounded-full px-8"
				>
					Continuar sin enviar
				</Button>
			</div>
		</motion.div>
	);
};
