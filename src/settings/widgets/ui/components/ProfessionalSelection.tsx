import { Avatar, Button } from "@beweco/aurora-ui";
import type React from "react";
import type { SelectedProfessional, WidgetConfig } from "./BookingWidget";

interface ProfessionalSelectionProps {
	selectedProfessional: SelectedProfessional | null;
	onProfessionalChange: (professional: SelectedProfessional | null) => void;
	config: WidgetConfig;
	onNext: () => void;
	canProceed: boolean;
}

// Profesionales de ejemplo
const MOCK_PROFESSIONALS: SelectedProfessional[] = [
	{
		id: "1",
		name: "Maria González",
	},
	{
		id: "2",
		name: "Carmen López",
	},
	{
		id: "3",
		name: "Sofia Martín",
	},
	{
		id: "4",
		name: "Ana Rodriguez",
	},
];

const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({
	selectedProfessional,
	onProfessionalChange,
	config,
	onNext,
	canProceed,
}) => {
	const isRequired = config.professionalSelection === "required";

	const handleProfessionalSelect = (professional: SelectedProfessional) => {
		if (selectedProfessional?.id === professional.id) {
			// If clicking the same professional and it's optional, do nothing
			return;
		} else {
			onProfessionalChange(professional);
			// Automatically proceed to next step
			setTimeout(() => {
				onNext();
			}, 300);
		}
	};

	const handleAnyProfessionalSelect = () => {
		onProfessionalChange({ id: "any", name: "Cualquier profesional" });
		// Automatically proceed to next step
		setTimeout(() => {
			onNext();
		}, 300);
	};

	// Generate random avatar background colors
	const getAvatarColor = (id: string) => {
		const colors = ["bg-primary", "bg-secondary", "bg-success", "bg-warning"];
		return colors[Number.parseInt(id) % colors.length];
	};

	// Get initials from name
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	return (
		<div className="h-full flex flex-col space-y-4">
			{/* Professional List */}
			<div className="flex-1 overflow-y-auto space-y-3">
				{/* Any Professional Option - Moved to top */}
				{!isRequired && (
					<div
						className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
							selectedProfessional?.id === "any"
								? "border-primary bg-primary-50"
								: "border-default-200 hover:border-default-300 hover:bg-default-50"
						}`}
						onClick={handleAnyProfessionalSelect}
					>
						<Avatar name="?" className="bg-default-300 mr-4" size="lg" />
						<div className="flex-1">
							<h4 className="font-medium text-foreground">
								Cualquier profesional
							</h4>
							<p className="text-sm text-default-500">
								Sin preferencia específica
							</p>
						</div>
						<div className="flex items-center">
							{selectedProfessional?.id === "any" && (
								<div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
									<span className="text-white text-sm">✓</span>
								</div>
							)}
						</div>
					</div>
				)}

				{MOCK_PROFESSIONALS.map((professional) => {
					const isSelected = selectedProfessional?.id === professional.id;

					return (
						<div
							key={professional.id}
							className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
								isSelected
									? "border-primary bg-primary-50"
									: "border-default-200 hover:border-default-300 hover:bg-default-50"
							}`}
							onClick={() => handleProfessionalSelect(professional)}
						>
							<Avatar
								name={getInitials(professional.name)}
								className={`${getAvatarColor(professional.id)} mr-4`}
								size="lg"
							/>
							<div className="flex-1">
								<h4 className="font-medium text-foreground">
									{professional.name}
								</h4>
								<p className="text-sm text-default-500">
									Especialista certificada
								</p>
							</div>
							<div className="flex items-center">
								{isSelected && (
									<div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
										<span className="text-white text-sm">✓</span>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Status */}
			{selectedProfessional && (
				<div className="text-center mt-6 p-3 bg-primary-50 rounded-lg">
					<p className="text-sm text-primary font-medium">
						✓{" "}
						{selectedProfessional.id === "any"
							? "Cualquier profesional disponible"
							: selectedProfessional.name}{" "}
						seleccionado
					</p>
				</div>
			)}
		</div>
	);
};

export default ProfessionalSelection;
