import { Button, TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { motion } from "framer-motion";
import { GradientHighlightText } from "src/onboarding/ui/_shared/components/gradient-highlight-text";

interface WelcomeScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const WelcomeScreen = ({
	onBack,
	onContinue,
}: WelcomeScreenProps) => {
	const { t } = useTranslate();

	return (
		<TwoColumnLayoutAgent
			assistantState="excited"
			assistantSpeech={t("register_welcome_linda_speech")}
			assistantSize="xl"
			assistantHint={t("register_welcome_linda_hint")}
			enableSequence={true}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col gap-4 w-full max-w-3xl mx-auto pb-20 h-full overflow-y-auto px-5 justify-center"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className="text-center mb-2"
				>
					<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
						{t("register_welcome_title")}{" "}
						<GradientHighlightText>
							{t("register_welcome_brand")}
						</GradientHighlightText>
					</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.3 }}
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
						{t("register_welcome_next_button")}
					</Button>
				</motion.div>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
