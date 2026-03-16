import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { ContinueButton } from "src/onboarding/ui/_shared/components";
import { DiagnosticCard } from "../components";
import { useBusinessDiagnostic } from "../hooks";

interface BusinessDiagnosticScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const BusinessDiagnosticScreen = ({
	onBack,
	onContinue,
}: BusinessDiagnosticScreenProps) => {
	const diagnosticResult = useBusinessDiagnostic();

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Wow… esto es lo que está pasando en tu negocio ahora mismo. Pero no te preocupes, tengo la solución perfecta para ti."
		translations={{ backButtonLabel: "Atrás" }}
			assistantState="surprised"
			assistantSize="xl"
			showBackButton
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col gap-4 w-full max-w-7xl mx-auto pb-24 h-full overflow-y-auto px-5 md:px-8 pt-8"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-5xl lg:text-6xl font-serif italic font-normal text-gray-900 dark:text-white">
						Tu Diagnóstico
					</h2>
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
					className="text-lg text-gray-600 dark:text-gray-400 font-sans font-normal text-center"
				>
					Esto es lo que está pasando en tu negocio ahora mismo
				</motion.p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 py-2 w-full max-w-[820px] mx-auto">
					<DiagnosticCard
						emoji="⏰"
						title="Tiempo Perdido"
						min={diagnosticResult.horasAhorradas.min}
						max={diagnosticResult.horasAhorradas.max}
						unit="horas/mes"
						fuente={diagnosticResult.horasAhorradas.fuente}
						color="blue"
						delay={0.6}
					/>

					<DiagnosticCard
						emoji="💸"
						title="Dinero en Riesgo"
						min={diagnosticResult.dineroPerdido.min}
						max={diagnosticResult.dineroPerdido.max}
						unit="USD/mes"
						fuente={diagnosticResult.dineroPerdido.fuente}
						color="red"
						delay={0.8}
					/>

					<DiagnosticCard
						emoji="🎯"
						title="Oportunidades Perdidas"
						min={diagnosticResult.clientesAdicionales.min}
						max={diagnosticResult.clientesAdicionales.max}
						unit="clientes/mes"
						fuente={diagnosticResult.clientesAdicionales.fuente}
						color="green"
						delay={1}
					/>
				</div>

				<ContinueButton
					label="Veamos tu potencial"
					onPress={onContinue}
					delay={1.4}
				/>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
