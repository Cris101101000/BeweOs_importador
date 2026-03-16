import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface AnalysisTransitionScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const AnalysisTransitionScreen = ({
	onBack,
	onContinue,
}: AnalysisTransitionScreenProps) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onContinue();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onContinue]);

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Dame un segundo mientras analizo todo lo que me contaste..."
		translations={{ backButtonLabel: "Atrás" }}
			assistantState="thinking"
			assistantSize="xl"
			showBackButton
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col items-center justify-center gap-12 w-full min-h-[400px]"
			>
				<motion.h2
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
					className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white text-center"
				>
					Analizando tu negocio...
				</motion.h2>

				<div className="relative w-32 h-32">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 2.5,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						}}
						className="absolute inset-0"
					>
						<svg className="w-full h-full" viewBox="0 0 100 100">
							<title>Cargando analisis</title>
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeDasharray="70 200"
								className="text-primary/80"
							/>
						</svg>
					</motion.div>

					<motion.div
						animate={{
							scale: [1, 1.05, 1],
							opacity: [0.8, 1, 0.8],
						}}
						transition={{
							duration: 1.5,
							repeat: Number.POSITIVE_INFINITY,
							ease: [0.4, 0.0, 0.2, 1],
						}}
						className="absolute inset-0 flex items-center justify-center text-5xl"
					>
						🔍
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="flex items-center gap-2"
				>
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							animate={{
								y: [0, -8, 0],
								opacity: [0.4, 1, 0.4],
							}}
							transition={{
								duration: 1,
								repeat: Number.POSITIVE_INFINITY,
								delay: i * 0.15,
								ease: [0.4, 0.0, 0.2, 1],
							}}
							className="w-2.5 h-2.5 rounded-full bg-primary/80"
						/>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="space-y-2 text-center"
				>
					{[
						{ delay: 0, text: "📊 Analizando tus pain points" },
						{ delay: 0.8, text: "💼 Calculando tu volumen de contactos" },
						{ delay: 1.6, text: "🎯 Estimando oportunidades de mejora" },
					].map((item) => (
						<motion.p
							key={item.text}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: [0, 1, 0.5] }}
							transition={{
								delay: item.delay,
								duration: 0.6,
								times: [0, 0.4, 1],
								ease: [0.4, 0.0, 0.2, 1],
							}}
							className="text-sm text-gray-600 dark:text-gray-400 font-sans font-normal"
						>
							{item.text}
						</motion.p>
					))}
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: [0.4, 0.8, 0.4] }}
					transition={{
						duration: 1.5,
						repeat: Number.POSITIVE_INFINITY,
						ease: [0.4, 0.0, 0.2, 1],
					}}
					className="text-xs text-gray-500 dark:text-gray-500 font-sans font-normal"
				>
					Esto solo tomara unos segundos...
				</motion.p>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
