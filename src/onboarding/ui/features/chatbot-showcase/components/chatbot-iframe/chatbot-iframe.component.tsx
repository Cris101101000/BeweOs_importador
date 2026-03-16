import { useEffect, useState } from "react";
import { Button } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { GradientHighlightText } from "src/onboarding/ui/_shared/components";

interface ChatbotIframeProps {
	onContinue: () => void;
}

export const ChatbotIframe = ({ onContinue }: ChatbotIframeProps) => {
	const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data?.method === "ONBOARDING_COMPLETE") {
				setIsOnboardingComplete(true);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return (
		<div className="flex flex-col gap-3 w-full max-w-2xl mx-auto px-6 py-2 h-full">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="text-center space-y-2"
			>
				<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
					<GradientHighlightText>Linda</GradientHighlightText>, como atención al cliente
				</h2>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col h-[480px]"
			>
				<iframe
					src={`${process.env.REACT_APP_CHATBOT_BASE_URL}/${window.USER_SESSION?.pk || ""}?context=onboarding`}
					className="h-full w-full rounded-2xl"
					title="Chatbot Preview"
					allow="camera; microphone; fullscreen"
					sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-messages allow-imframes"
				/>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="fixed bottom-8 right-8 z-20"
			>
				<Button
					size="lg"
					color="primary"
					onPress={onContinue}
					className="rounded-full px-8 shadow-lg hover:shadow-xl"
				>
					Finalizar
				</Button>
			</motion.div>
		</div>
	);
};
