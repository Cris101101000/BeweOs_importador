import { Button } from "@beweco/aurora-ui";
import { motion } from "framer-motion";

interface SuccessStepProps {
	onContinue: () => void;
}

export const SuccessStep = ({ onContinue }: SuccessStepProps) => {
	return (
		<motion.div key="success" className="space-y-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.2, duration: 0.5 }}
				className="text-center space-y-2"
			>
				<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
					Campaña enviada
				</h2>
				<p className="text-lg text-gray-600 dark:text-gray-400 font-sans font-normal">
					Ya viste el resultado de tu primer contacto automatizado.
				</p>
			</motion.div>

			<div className="pt-3 fixed bottom-8 right-8 z-20">
				<Button
					size="lg"
					color="primary"
					onPress={onContinue}
					className="rounded-full px-8 shadow-lg hover:shadow-xl"
				>
					Adelante
				</Button>
			</div>
		</motion.div>
	);
};
