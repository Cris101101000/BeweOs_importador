import { SocialMediaPreview } from "@beweco/aurora-ui";
import { AnimatePresence, motion } from "framer-motion";
import type { IContentProposal } from "src/onboarding/domain/social-showcase";
import { ContinueButton } from "src/onboarding/ui/_shared/components";

interface ProposalsPhaseProps {
	currentProposal: IContentProposal;
	isLastProposal: boolean;
	onNext: () => void;
	onContinue: () => void;
}

export const ProposalsPhase = ({
	currentProposal,
	isLastProposal,
	onNext,
	onContinue,
}: ProposalsPhaseProps) => {
	return (
		<div className="flex flex-col gap-4 w-full max-w-lg mx-auto px-6 py-2">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentProposal.id}
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.4 }}
					className="mx-auto w-full max-w-[280px]"
				>
					<SocialMediaPreview
						platform="instagram"
						variant={currentProposal.type === "story" ? "story" : "full"}
						imageUrl={currentProposal.imageUrl}
						caption={currentProposal.description}
						username="TuNegocio"
						className="shadow-xl rounded-2xl overflow-hidden border-2 border-white dark:border-gray-800"
					/>
				</motion.div>
			</AnimatePresence>

			<ContinueButton
				onPress={isLastProposal ? onContinue : onNext}
				label={isLastProposal ? "Continuar" : "Siguiente"}
			/>
		</div>
	);
};
