import { Button } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { GradientHighlightText } from "src/onboarding/ui/_shared/components";

interface FinalCelebrationProps {
	businessName?: string;
	onContinue: () => void;
	isLoading?: boolean;
}

export const FinalCelebration = ({
	businessName,
	onContinue,
	isLoading,
}: FinalCelebrationProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.55 }}
			className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gray-900"
		>
			<div className="flex flex-col items-center justify-center min-h-screen p-8 pt-16">
				<div className="text-center max-w-3xl space-y-8">
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.1, duration: 0.45, type: "spring", bounce: 0.3 }}
						className="flex justify-center text-6xl"
					>
						✨
					</motion.div>

					<motion.h1
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.25, duration: 0.45 }}
						className="text-5xl md:text-6xl font-serif italic font-normal text-gray-900 dark:text-white leading-tight tracking-tight"
					>
						Linda está lista para <GradientHighlightText>empezar</GradientHighlightText>
					</motion.h1>

					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.45 }}
						className="text-xl text-gray-600 dark:text-gray-400 font-sans font-normal max-w-2xl mx-auto leading-relaxed"
					>
						{businessName
							? `Tu asistente inteligente ya conoce ${businessName} y está preparada para transformar la relación con tus clientes.`
							: "Tu asistente inteligente ya conoce tu negocio y está preparada para transformar la relación con tus clientes."}
					</motion.p>

					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.55, duration: 0.45 }}
						className="pt-2"
					>
						<Button
							size="lg"
							color="primary"
							onPress={onContinue}
							isLoading={isLoading}
							className="px-12 py-6 text-lg font-sans font-semibold rounded-full shadow-xl hover:shadow-2xl transition-shadow"
						>
							Entrar a BeweOS
						</Button>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};
