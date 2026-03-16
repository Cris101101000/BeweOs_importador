import type React from "react";

interface FlowChoiceProps {
	onFlowChoice: (choice: "time_first" | "professional_first") => void;
}

const FlowChoice: React.FC<FlowChoiceProps> = ({ onFlowChoice }) => {
	const handleTimeFirstChoice = () => {
		onFlowChoice("time_first");
	};

	const handleProfessionalFirstChoice = () => {
		onFlowChoice("professional_first");
	};

	return (
		<div className="space-y-6 max-h-[500px] overflow-y-auto">
			{/* Header */}
			<div className="text-center space-y-2">
				<h3 className="text-lg font-semibold">
					¿Qué es más importante para ti?
				</h3>
				<p className="text-sm text-default-500">
					Elige cómo prefieres agendar tu cita
				</p>
			</div>

			{/* Choice Cards */}
			<div className="space-y-4">
				{/* Time First Option */}
				<div
					className="p-6 border-2 border-default-200 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary-50"
					onClick={handleTimeFirstChoice}
				>
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">🕒</span>
						</div>
						<div className="flex-1">
							<h4 className="font-semibold text-foreground mb-2">
								Elegir horario primero
							</h4>
							<p className="text-sm text-default-600 leading-relaxed">
								Perfecto si tienes un horario específico en mente. Te
								mostraremos qué profesionales están disponibles en ese momento.
							</p>
							<div className="mt-3 text-xs text-primary font-medium">
								Ideal para horarios fijos →
							</div>
						</div>
					</div>
				</div>

				{/* Professional First Option */}
				<div
					className="p-6 border-2 border-default-200 rounded-xl cursor-pointer transition-all hover:border-primary hover:bg-primary-50"
					onClick={handleProfessionalFirstChoice}
				>
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">👤</span>
						</div>
						<div className="flex-1">
							<h4 className="font-semibold text-foreground mb-2">
								Elegir profesional primero
							</h4>
							<p className="text-sm text-default-600 leading-relaxed">
								Perfecto si tienes un profesional de confianza. Te mostraremos
								todos los horarios disponibles con esa persona.
							</p>
							<div className="mt-3 text-xs text-primary font-medium">
								Ideal para profesionales favoritos →
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Help Text */}
			<div className="text-center">
				<p className="text-xs text-default-400">
					Esta elección nos ayuda a personalizar tu experiencia de agendamiento
				</p>
			</div>
		</div>
	);
};

export default FlowChoice;
