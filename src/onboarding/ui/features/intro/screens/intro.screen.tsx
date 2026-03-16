import { Button, TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { motion } from "framer-motion";
import { GradientHighlightText } from "src/onboarding/ui/_shared/components/gradient-highlight-text";

interface IntroScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const IntroScreen = ({
	onBack,
	onContinue,
}: IntroScreenProps) => {
	const { t } = useTranslate();

	return (
		<TwoColumnLayoutAgent
			assistantState="excited"
			assistantSpeech={t("register_intro_linda_speech")}
			assistantSize="xl"
			assistantHint={t("register_welcome_linda_hint")}
			translations={{ backButtonLabel: "Atrás" }}
			enableSequence={true}
			showBackButton={true}
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className="flex flex-col w-full max-w-2xl mx-auto pb-20 h-full justify-center px-8 md:px-12"
			>
				<div className="space-y-12">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.7 }}
					>
						<h3 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white leading-tight tracking-tight">
							{t("register_intro_benefit_1")} <br />
							<GradientHighlightText>
								{t("register_intro_benefit_1_highlight")}
							</GradientHighlightText>
						</h3>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4, duration: 0.7 }}
					>
						<h3 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white leading-tight tracking-tight">
							{t("register_intro_benefit_2")} <br />
							<GradientHighlightText>
								{t("register_intro_benefit_2_highlight")}
							</GradientHighlightText>
						</h3>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.6, duration: 0.7 }}
					>
						<h3 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white leading-tight tracking-tight">
							{t("register_intro_benefit_3")} <br />
							<GradientHighlightText>
								{t("register_intro_benefit_3_highlight")}
							</GradientHighlightText>
						</h3>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="fixed bottom-8 right-8 z-20"
				>
					<Button
						size="lg"
						color="primary"
						onPress={onContinue}
						className="rounded-full px-10 shadow-[0_4px_20px_rgb(59,130,246,0.2)] hover:shadow-[0_6px_25px_rgb(59,130,246,0.3)] transition-all duration-300 font-medium"
						endContent={
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2.5}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						}
					>
						{t("register_intro_start_button")}
					</Button>
				</motion.div>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
