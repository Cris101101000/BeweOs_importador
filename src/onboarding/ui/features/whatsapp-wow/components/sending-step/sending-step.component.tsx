import { motion } from "framer-motion";

export const SendingStep = () => {
	return (
		<motion.div
			key="sending"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
		>
			<motion.div
				animate={{ rotate: 360 }}
				transition={{
					duration: 2,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
				className="w-24 h-24 rounded-full border-8 border-primary/20 border-t-primary"
			/>
			<h3 className="text-2xl font-serif italic font-normal text-gray-900 dark:text-white">
				Linda esta enviando tu mensaje...
			</h3>
			<p className="text-gray-600 dark:text-gray-400 font-sans font-normal">
				Revisa tu WhatsApp en unos segundos.
			</p>
		</motion.div>
	);
};
