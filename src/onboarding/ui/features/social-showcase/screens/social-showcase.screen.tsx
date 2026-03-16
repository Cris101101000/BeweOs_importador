import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { PROPOSALS } from "src/onboarding/domain/social-showcase";
import { useOnboardingContent } from "src/onboarding/ui/_shared/hooks";
import { ProposalsPhase } from "../components";
import { useSocialShowcase } from "../hooks";

interface SocialShowcaseScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const SocialShowcaseScreen = ({
	onBack,
	onContinue,
}: SocialShowcaseScreenProps) => {
	const { instagramProposals } = useOnboardingContent();
	const proposals = instagramProposals.length > 0 ? instagramProposals : PROPOSALS;

	const {
		currentIndex,
		handleSkip,
	} = useSocialShowcase({
		proposalsLength: proposals.length,
		onIntegrationClose: () => {},
		onAllProposalsComplete: onContinue,
	});

	const currentProposal = proposals[currentIndex];
	const isLastProposal = currentIndex === proposals.length - 1;

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Mira todo lo que podemos crear para tu Instagram."
			assistantState="happy"
			assistantSize="xl"
			enableSequence={true}
			showBackButton
			onBack={onBack}
			translations={{ backButtonLabel: "Atrás" }}
		>
			<ProposalsPhase
				currentProposal={currentProposal}
				isLastProposal={isLastProposal}
				onNext={handleSkip}
				onContinue={onContinue}
			/>
		</TwoColumnLayoutAgent>
	);
};
