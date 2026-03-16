import { motion } from "framer-motion";

export const TrainingSourcesHeader = () => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: 0.4, duration: 0.5 }}
			className="text-center space-y-2"
		>
			<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
				Fuentes de Entrenamiento
			</h2>
			<p className="text-lg text-gray-600 dark:text-gray-400 font-sans font-normal">
				Enséñame sobre tu negocio para empezar a ayudarte
			</p>
		</motion.div>
	);
};
