import { Button, Input } from "@beweco/aurora-ui";
import type React from "react";
import { useState } from "react";
import type { SelectedService } from "./BookingWidget";

interface ServiceSelectionProps {
	selectedServices: SelectedService[];
	onServicesChange: (services: SelectedService[]) => void;
	onNext: () => void;
	canProceed: boolean;
}

// Servicios de ejemplo basados en el spa de la imagen
const MOCK_SERVICES: SelectedService[] = [
	{
		id: "1",
		name: "Brazilian Maintenance 4 to 6 wks",
		duration: 30,
		price: 45.0,
	},
	{
		id: "2",
		name: "Brazilian & Underarms",
		duration: 30,
		price: 55.0,
	},
	{
		id: "3",
		name: "Brazilian (first time)",
		duration: 30,
		price: 60.0,
	},
	{
		id: "4",
		name: "Full Leg Brazilian",
		duration: 60,
		price: 120.0,
	},
	{
		id: "5",
		name: "Half Leg Brazilian",
		duration: 45,
		price: 90.0,
	},
	{
		id: "6",
		name: "Underarms",
		duration: 15,
		price: 25.0,
	},
	{
		id: "7",
		name: "Upper Lip",
		duration: 10,
		price: 20.0,
	},
	{
		id: "8",
		name: "Eyebrows",
		duration: 20,
		price: 35.0,
	},
];

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
	selectedServices,
	onServicesChange,
	onNext,
	canProceed,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedCategory, setExpandedCategory] = useState<string | null>(
		"popular"
	);

	const filteredServices = MOCK_SERVICES.filter((service) =>
		service.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const popularServices = filteredServices.slice(0, 3);
	const otherServices = filteredServices.slice(3);

	const isServiceSelected = (serviceId: string) => {
		return selectedServices.some((s) => s.id === serviceId);
	};

	const toggleService = (service: SelectedService) => {
		if (isServiceSelected(service.id)) {
			// Remove service
			onServicesChange(selectedServices.filter((s) => s.id !== service.id));
		} else {
			// Add service
			onServicesChange([...selectedServices, service]);
		}
	};

	const toggleCategory = (category: string) => {
		setExpandedCategory(expandedCategory === category ? null : category);
	};

	const formatPrice = (price: number) => `$${price.toFixed(2)}`;
	const formatDuration = (duration: number) => `${duration}min`;

	const ServiceCard: React.FC<{ service: SelectedService }> = ({ service }) => {
		const isSelected = isServiceSelected(service.id);

		return (
			<div
				className={`flex items-center justify-between p-3 border rounded-lg transition-all cursor-pointer ${
					isSelected
						? "border-primary bg-primary-50"
						: "border-default-200 hover:border-default-300 hover:bg-default-50"
				}`}
				onClick={() => toggleService(service)}
			>
				<div className="flex-1">
					<h3 className="font-medium text-foreground text-sm">
						{service.name}
					</h3>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xs text-default-500">
							{formatDuration(service.duration)}
						</span>
						<span className="w-1 h-1 bg-default-300 rounded-full"></span>
						<span className="text-sm font-semibold text-foreground">
							{formatPrice(service.price)}
						</span>
					</div>
				</div>
				{isSelected && (
					<div className="ml-3 text-primary">
						<span className="text-lg">✓</span>
					</div>
				)}
			</div>
		);
	};

	const CategorySection: React.FC<{
		title: string;
		categoryKey: string;
		services: SelectedService[];
		count?: number;
	}> = ({ title, categoryKey, services, count }) => {
		const isExpanded = expandedCategory === categoryKey;

		return (
			<div className="space-y-2">
				<button
					onClick={() => toggleCategory(categoryKey)}
					className="flex items-center justify-between w-full text-left py-2 px-1 hover:bg-default-50 rounded-lg transition-colors"
				>
					<h2 className="text-base font-medium flex items-center gap-2 text-default-700">
						<span
							className={`text-xs text-default-400 transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
						>
							▶
						</span>
						{title}
						<span className="text-xs bg-default-100 text-default-500 px-2 py-0.5 rounded-full font-normal">
							{count}
						</span>
					</h2>
				</button>

				{isExpanded && (
					<div className="space-y-2 pl-4 border-l-2 border-default-100">
						{services.map((service) => (
							<ServiceCard key={service.id} service={service} />
						))}
					</div>
				)}
			</div>
		);
	};

	const totalPrice = selectedServices.reduce(
		(sum, service) => sum + service.price,
		0
	);
	const totalDuration = selectedServices.reduce(
		(sum, service) => sum + service.duration,
		0
	);

	return (
		<div className="h-full flex flex-col space-y-4">
			{/* Search */}
			<Input
				placeholder="Buscar servicio"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-full"
				startContent={<span className="text-default-400">🔍</span>}
			/>

			{/* Services Categories */}
			<div className="flex-1 overflow-y-auto space-y-4">
				<CategorySection
					title="Servicios populares"
					categoryKey="popular"
					services={popularServices}
					count={3}
				/>

				<CategorySection
					title="Otros servicios"
					categoryKey="others"
					services={otherServices}
					count={otherServices.length}
				/>
			</div>

			{/* Summary and Next Button */}
			{selectedServices.length > 0 && (
				<div className="sticky bottom-0 bg-white border-t pt-4 mt-6">
					<div className="bg-default-50 p-3 rounded-lg mb-4">
						<div className="flex justify-between text-sm">
							<span>Total servicios: {selectedServices.length}</span>
							<span>Duración: {formatDuration(totalDuration)}</span>
						</div>
						<div className="flex justify-between font-semibold mt-1">
							<span>Total: {formatPrice(totalPrice)}</span>
						</div>
					</div>

					<Button
						color="primary"
						onPress={onNext}
						disabled={!canProceed}
						className="w-full"
						size="lg"
					>
						Continuar con fecha y hora
					</Button>
				</div>
			)}
		</div>
	);
};

export default ServiceSelection;
