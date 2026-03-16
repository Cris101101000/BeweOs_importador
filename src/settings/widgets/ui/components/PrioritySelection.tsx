import { Button } from "@beweco/aurora-ui";
import type React from "react";

export type BookingPriority = "professional_first" | "time_first";

interface PrioritySelectionProps {
	selectedPriority: BookingPriority | null;
	onPriorityChange: (priority: BookingPriority) => void;
	onNext: () => void;
	canProceed: boolean;
}

const PrioritySelection: React.FC<PrioritySelectionProps> = ({
	selectedPriority,
	onPriorityChange,
	onNext,
	canProceed,
}) => {
	const handlePrioritySelect = (priority: BookingPriority) => {
		// Pass the priority directly to the parent component
		onPriorityChange(priority);
	};

	return (
		<div className="h-full flex flex-col space-y-6">
			{/* Priority Options */}
			<div className="flex-1 overflow-y-auto space-y-4">
				{/* Professional Priority Option */}
				<div
					className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
						selectedPriority === "professional_first"
							? "border-primary bg-primary-50"
							: "border-default-200 hover:border-default-300 hover:bg-default-50"
					}`}
					onClick={() => handlePrioritySelect("professional_first")}
				>
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mt-1">
							<span className="text-2xl">👩‍💼</span>
						</div>
						<div className="flex-1">
							<h4 className="font-semibold text-foreground mb-2">
								Priorizar profesional específico
							</h4>
							<div className="text-xs text-default-500">
								<strong>Ideal si:</strong> Tienes preferencia por un profesional
								específico o quieres continuidad en el servicio.
							</div>
						</div>
						{selectedPriority === "professional_first" && (
							<div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
								<span className="text-white text-sm">✓</span>
							</div>
						)}
					</div>
				</div>

				{/* Time Priority Option */}
				<div
					className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
						selectedPriority === "time_first"
							? "border-primary bg-primary-50"
							: "border-default-200 hover:border-default-300 hover:bg-default-50"
					}`}
					onClick={() => handlePrioritySelect("time_first")}
				>
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mt-1">
							<span className="text-2xl">⏰</span>
						</div>
						<div className="flex-1">
							<h4 className="font-semibold text-foreground mb-2">
								Priorizar horario más temprano
							</h4>
							<div className="text-xs text-default-500">
								<strong>Ideal si:</strong> Necesitas la cita lo antes posible y
								no tienes preferencia por un profesional específico.
							</div>
						</div>
						{selectedPriority === "time_first" && (
							<div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
								<span className="text-white text-sm">✓</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Status - only show if selection is made */}
			{selectedPriority && (
				<div className="text-center p-3 bg-primary-50 rounded-lg">
					<p className="text-sm text-primary font-medium">
						✓ Preferencia seleccionada:{" "}
						{selectedPriority === "professional_first"
							? "Profesional específico"
							: "Horario más temprano"}
					</p>
				</div>
			)}
		</div>
	);
};

export default PrioritySelection;
