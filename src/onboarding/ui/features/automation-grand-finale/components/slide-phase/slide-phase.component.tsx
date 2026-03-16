import { motion } from "framer-motion";
import type { ISummarySlide } from "src/onboarding/domain/automation-grand-finale";

interface SlidePhaseProps {
	activeSlide: ISummarySlide;
	assistantSpeech: string;
}

export const SlidePhase = ({ activeSlide, assistantSpeech }: SlidePhaseProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 18 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -18 }}
			transition={{ duration: 0.45 }}
			className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col pt-12"
		>
			<div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
				<div className="w-full max-w-2xl mx-auto text-center space-y-8">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${activeSlide.gradient} flex items-center justify-center shadow-lg`}
					>
						<span className="text-5xl">{activeSlide.icon}</span>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="space-y-3"
					>
						<h1 className="text-4xl md:text-5xl font-serif italic font-normal text-gray-900 dark:text-white leading-tight">
							{activeSlide.title}
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-sans font-medium">
							{activeSlide.subtitle}
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="space-y-4 max-w-xl mx-auto"
					>
						{activeSlide.features.map((feature) => (
							<div key={feature} className="flex items-start gap-3 text-left">
								<div className={`w-6 h-6 rounded-full bg-gradient-to-br ${activeSlide.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
									<svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-sans font-normal leading-relaxed">
									{feature}
								</p>
							</div>
						))}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9, duration: 0.5 }}
						className="pt-6"
					>
						<div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
							<span className="text-2xl">💬</span>
							<p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-serif italic font-normal">
								"{assistantSpeech}"
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};
