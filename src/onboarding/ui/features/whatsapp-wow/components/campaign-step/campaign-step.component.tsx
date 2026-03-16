import { WhatsAppPreview } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { ContinueButton } from "src/onboarding/ui/_shared/components";

interface CampaignStepProps {
	caption: string;
	imageUrl?: string;
	onContinue: () => void;
}

export const CampaignStep = ({ caption, imageUrl, onContinue }: CampaignStepProps) => {
	return (
		<motion.div
			key="campaign"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-6"
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className="mx-auto w-full max-w-[400px]"
			>
				<WhatsAppPreview
					imageUrl={imageUrl}
					caption={caption}
					variant="full"
					showHeader
				/>
			</motion.div>

			<ContinueButton delay={0.7} onPress={onContinue} label="Enviar mensaje" />
		</motion.div>
	);
};
