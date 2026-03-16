import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { AnimatePresence, motion } from "framer-motion";
import { ChatbotIframe, TrainingWait } from "../components";
import { useChatbotTrainingStatus } from "../hooks";

interface ChatbotShowcaseScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const ChatbotShowcaseScreen = ({
	onBack,
	onContinue,
}: ChatbotShowcaseScreenProps) => {
	const { phase } = useChatbotTrainingStatus();

	const isTraining = phase === "training";
	const isReady = !isTraining;

	return (
		<TwoColumnLayoutAgent
			assistantSpeech={
				isReady
					? "Chatea conmigo y mira cómo atenderé a tus clientes."
					: "Estoy terminando de aprender sobre tu negocio. Solo un momento más..."
			}
			assistantState={isReady ? "inspired" : "thinking"}
			translations={{ backButtonLabel: "Atrás" }}
			assistantSize="xl"
			enableSequence={true}
			showBackButton
			onBack={onBack}
		>
			<AnimatePresence mode="wait">
				{isReady ? (
					<motion.div
						key="chatbot"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
						className="h-full"
					>
						<ChatbotIframe onContinue={onContinue} />
					</motion.div>
				) : (
					<motion.div
						key="training"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
						className="h-full"
					>
						<TrainingWait />
					</motion.div>
				)}
			</AnimatePresence>
		</TwoColumnLayoutAgent>
	);
};
