/**
 * Options Step (Step 2)
 * Allows user to choose between AI generation or manual content upload
 */

import { H3, H4, P, Button, IconComponent } from "@beweco/aurora-ui";
import { StepContainer } from "@shared/ui/components/StepContainer";

interface OptionsStepProps {
	useAI: boolean | null;
	onUseAIChange: (useAI: boolean) => void;
	onBack: () => void;
	onNext: () => void;
}

export function OptionsStep({
	useAI,
	onUseAIChange,
	onBack,
	onNext,
}: OptionsStepProps) {
	const handleSelect = (value: boolean) => {
		onUseAIChange(value);
		onNext();
	};

	return (
		<StepContainer
			header={
				<div className="text-center">
					<H3>¿Cómo quieres crear tu contenido?</H3>
					<P className="text-center mt-2">
						Elige si quieres generar el contenido con IA o si ya tienes tu
						propio contenido
					</P>
				</div>
			}
			footer={
				<Button onPress={onBack} variant="light">
					Atrás
				</Button>
			}
		>
			<div className="grid grid-cols-2 gap-4">
				{/* AI Generation Option */}
				<Button
					onPress={() => handleSelect(true)}
					variant={useAI === true ? "flat" : "bordered"}
					color={useAI === true ? "primary" : "default"}
					className="p-6 h-auto"
				>
					<div className="flex flex-col items-center gap-3">
						<div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-primary-600">
							<IconComponent
								icon="solar:magic-stick-bold"
								className="text-white text-[32px]"
							/>
						</div>
						<div className="text-center">
							<H4 className="mb-1">Generar con IA</H4>
							<P className="text-xs text-gray-600">
								La IA creará el contenido por ti
							</P>
						</div>
					</div>
				</Button>

				{/* Manual Creation Option */}
				<Button
					onPress={() => handleSelect(false)}
					variant={useAI === false ? "flat" : "bordered"}
					color={useAI === false ? "primary" : "default"}
					className="p-6 h-auto"
				>
					<div className="flex flex-col items-center gap-3">
						<div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-600">
							<IconComponent
								icon="solar:document-bold"
								className="text-white text-[32px]"
							/>
						</div>
						<div className="text-center">
							<H4 className="mb-1">Tengo mi contenido</H4>
							<P className="text-xs text-gray-600">Subiré mi propio contenido</P>
						</div>
					</div>
				</Button>
			</div>
		</StepContainer>
	);
}
