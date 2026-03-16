import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { AnimatePresence } from "framer-motion";
import { useBrandDefinitionStore } from "src/onboarding/ui/_shared/store";
import {
	CampaignStep,
	ErrorStep,
	SendingStep,
	SuccessStep,
} from "../components";
import { useWhatsAppWow } from "../hooks";

interface WhatsAppWowScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const WhatsAppWowScreen = ({
	onBack,
	onContinue,
}: WhatsAppWowScreenProps) => {
	const { user, agency } = useSession();
	const businessName = useBrandDefinitionStore(
		(state) => state.data.businessName
	);
	const userPhone = user?.phones?.[0]
		? `${user.phones[0].code}${user.phones[0].number}`
		: "";

	const {
		step,
		displayMessage,
		assistantSpeech,
		sendCampaign,
		retrySendCampaign,
	} = useWhatsAppWow({
		businessName,
		userName: user?.firstname || "",
		userPhone,
		agencyName: agency?.name || "",
	});

	const handleContinue = async () => {
		if (step === "campaign") {
			await sendCampaign();
			return;
		}

		onContinue();
	};

	return (
		<TwoColumnLayoutAgent
			assistantSpeech={assistantSpeech}
			assistantState={step === "error" ? "concerned" : "happy"}
		translations={{ backButtonLabel: "Atrás" }}
			assistantSize="xl"
			enableSequence={true}
			showBackButton
			onBack={onBack}
		>
			<div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-6 py-4">
				<AnimatePresence mode="wait">
					{step === "campaign" ? (
						<CampaignStep caption={displayMessage} onContinue={handleContinue} />
					) : null}

					{step === "sending" ? <SendingStep /> : null}

					{step === "success" ? (
						<SuccessStep onContinue={handleContinue} />
					) : null}

					{step === "error" ? (
						<ErrorStep
							onRetry={retrySendCampaign}
							onSkip={onContinue}
						/>
					) : null}
				</AnimatePresence>
			</div>
		</TwoColumnLayoutAgent>
	);
};
