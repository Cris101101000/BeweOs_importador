/**
 * Channel Step (Step 3)
 * Allows user to select the platform where the content will be published
 */

import { H3, H4, P, Button, Card, IconComponent } from "@beweco/aurora-ui";
import { StepContainer } from "@shared/ui/components/StepContainer";

interface ChannelStepProps {
	selectedPlatforms: string[];
	onPlatformToggle: (platform: string) => void;
	onBack: () => void;
	onNext: () => void;
}

export function ChannelStep({
	selectedPlatforms,
	onPlatformToggle,
	onBack,
	onNext,
}: ChannelStepProps) {
	const isInstagramSelected = selectedPlatforms.includes("instagram");

	return (
		<StepContainer
			header={
				<div className="text-center">
					<H3>¿Dónde quieres publicar?</H3>
					<P className="text-center mt-2">
						Selecciona la plataforma donde publicarás tu contenido
					</P>
				</div>
			}
			footer={
				<>
					<Button variant="light" size="md" onPress={onBack}>
						Atrás
					</Button>
					<Button
						onPress={onNext}
						isDisabled={selectedPlatforms.length === 0}
						color="primary"
						variant="solid"
						size="md"
					>
						Siguiente
					</Button>
				</>
			}
		>
			<div className="flex justify-center">
				<Card
					isPressable
					onPress={() => onPlatformToggle("instagram")}
					className={`cursor-pointer transition-all w-40 h-40 ${
						isInstagramSelected
							? "border-2 border-success bg-success-50"
							: "border-2 border-gray-200 hover:border-gray-300"
					}`}
				>
					<div className="p-4 flex flex-col items-center justify-center h-full gap-4">
						{/* Instagram Icon */}
						<div
							className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
								isInstagramSelected
									? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
									: "bg-gray-100"
							}`}
						>
							<IconComponent
								icon="solar:instagram-bold"
								className="text-white text-3xl"
							/>
						</div>

						<div className="text-center">
							<H4 className="mb-1">Instagram</H4>

							{/* Check Icon */}
							<div
								className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto ${
									isInstagramSelected
										? "bg-success text-white"
										: "bg-gray-200 text-gray-400"
								}`}
							>
								<IconComponent
									icon="solar:check-circle-bold"
									className="text-sm"
								/>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</StepContainer>
	);
}
