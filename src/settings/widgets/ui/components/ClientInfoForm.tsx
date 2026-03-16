import { Button, Input, Phone } from "@beweco/aurora-ui";
import type React from "react";
import { useEffect, useState } from "react";
import type {
	ClientInfo,
	SelectedService,
	WidgetConfig,
} from "./BookingWidget";

interface ClientInfoFormProps {
	clientInfo: ClientInfo;
	onClientInfoChange: (info: ClientInfo) => void;
	config: WidgetConfig;
	selectedServices: SelectedService[];
	onNext: () => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
	clientInfo,
	onClientInfoChange,
	config,
	selectedServices,
	onNext,
}) => {
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Helper function to parse existing phone number
	const parsePhoneValue = (phone: string) => {
		if (!phone) return { countryCode: "+1", number: "" };

		// If phone starts with +, try to extract country code
		if (phone.startsWith("+")) {
			// Simple parsing - assume first 1-4 digits after + are country code
			const match = phone.match(/^(\+\d{1,4})(.*)$/);
			if (match) {
				return {
					countryCode: match[1],
					number: match[2].replace(/\D/g, ""), // Remove non-digits from number
				};
			}
		}

		// Default to +1 if no country code detected
		return {
			countryCode: "+1",
			number: phone.replace(/\D/g, ""), // Remove non-digits from number
		};
	};

	const handleInputChange = (field: keyof ClientInfo, value: string) => {
		onClientInfoChange({
			...clientInfo,
			[field]: value,
		});

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		// Validate required fields
		if (!clientInfo.firstName.trim()) {
			newErrors.firstName = "El nombre es obligatorio";
		}

		if (!clientInfo.lastName.trim()) {
			newErrors.lastName = "El apellido es obligatorio";
		}

		// Validate contact info based on config
		switch (config.clientInfoMode) {
			case "phone_only":
				if (!clientInfo.phone?.trim()) {
					newErrors.phone = "El teléfono es obligatorio";
				}
				break;

			case "email_only":
				if (!clientInfo.email?.trim()) {
					newErrors.email = "El email es obligatorio";
				} else if (
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email.trim())
				) {
					newErrors.email = "Formato de email inválido";
				}
				break;

			case "phone_and_email":
				if (!clientInfo.phone?.trim()) {
					newErrors.phone = "El teléfono es obligatorio";
				}

				if (!clientInfo.email?.trim()) {
					newErrors.email = "El email es obligatorio";
				} else if (
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email.trim())
				) {
					newErrors.email = "Formato de email inválido";
				}
				break;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			onNext();
		}
	};

	const getContactFieldLabel = () => {
		switch (config.clientInfoMode) {
			case "phone_only":
				return "Solo necesitamos tu teléfono para confirmar la cita";
			case "email_only":
				return "Solo necesitamos tu email para confirmar la cita";
			case "phone_and_email":
				return "Necesitamos tu teléfono y email para confirmar la cita";
			default:
				return "";
		}
	};

	const isFormValid = () => {
		return (
			clientInfo.firstName.trim() &&
			clientInfo.lastName.trim() &&
			(config.clientInfoMode === "phone_only"
				? clientInfo.phone?.trim()
				: true) &&
			(config.clientInfoMode === "email_only"
				? clientInfo.email?.trim()
				: true) &&
			(config.clientInfoMode === "phone_and_email"
				? clientInfo.phone?.trim() && clientInfo.email?.trim()
				: true)
		);
	};

	// Calculate totals for selected services
	const totalPrice = selectedServices.reduce(
		(sum, service) => sum + service.price,
		0
	);
	const totalDuration = selectedServices.reduce(
		(sum, service) => sum + service.duration,
		0
	);
	const formatPrice = (price: number) => `$${price.toFixed(2)}`;
	const formatDuration = (duration: number) => `${duration}min`;

	return (
		<div className="h-full flex flex-col space-y-4">
			{/* Header */}
			<div className="text-center space-y-2">
				<h3 className="text-lg font-semibold">Información de contacto</h3>
				<p className="text-sm text-default-500">{getContactFieldLabel()}</p>
			</div>

			{/* Form */}
			<div className="flex-1 overflow-y-auto space-y-4">
				{/* First Name */}
				<div>
					<Input
						label="Nombre *"
						placeholder="Ingresa tu nombre"
						value={clientInfo.firstName}
						onChange={(e) => handleInputChange("firstName", e.target.value)}
						isInvalid={!!errors.firstName}
						errorMessage={errors.firstName}
						variant="bordered"
						size="lg"
					/>
				</div>

				{/* Last Name */}
				<div>
					<Input
						label="Apellido *"
						placeholder="Ingresa tu apellido"
						value={clientInfo.lastName}
						onChange={(e) => handleInputChange("lastName", e.target.value)}
						isInvalid={!!errors.lastName}
						errorMessage={errors.lastName}
						variant="bordered"
						size="lg"
					/>
				</div>

				{/* Phone (if required by config) */}
				{(config.clientInfoMode === "phone_only" ||
					config.clientInfoMode === "phone_and_email") && (
					<div>
						<Phone
							label="Teléfono *"
							value={parsePhoneValue(clientInfo.phone || "")}
							onChange={(phoneValue) => {
								// Extracting full formatted phone with country code
								const fullPhone = phoneValue.countryCode + phoneValue.number;
								handleInputChange("phone", fullPhone);
							}}
							required
							error={!!errors.phone}
							errorText={errors.phone}
							translations={{
								placeholder: "Ingresa tu teléfono",
								searchPlaceholder: "Buscar país",
								noCountriesFound: "No se encontraron países",
							}}
						/>
					</div>
				)}

				{/* Email (if required by config) */}
				{(config.clientInfoMode === "email_only" ||
					config.clientInfoMode === "phone_and_email") && (
					<div>
						<Input
							label="Email *"
							placeholder="nombre@ejemplo.com"
							type="email"
							value={clientInfo.email || ""}
							onChange={(e) => handleInputChange("email", e.target.value)}
							isInvalid={!!errors.email}
							errorMessage={errors.email}
							variant="bordered"
							size="lg"
							startContent={<span className="text-default-400">📧</span>}
						/>
					</div>
				)}
			</div>

			{/* Selected Services Summary */}
			<div className="bg-primary-50 p-4 rounded-lg">
				<h3 className="font-medium text-primary mb-3">Resumen de tu cita:</h3>
				<div className="space-y-2">
					{selectedServices.map((service) => (
						<div
							key={service.id}
							className="flex justify-between items-center text-sm"
						>
							<div>
								<span className="font-medium">{service.name}</span>
								<span className="text-default-500 ml-2">
									({formatDuration(service.duration)})
								</span>
							</div>
							<span className="font-semibold">
								{formatPrice(service.price)}
							</span>
						</div>
					))}
				</div>
				<div className="border-t border-primary-200 mt-3 pt-3 flex justify-between items-center font-semibold">
					<span>Total ({formatDuration(totalDuration)})</span>
					<span className="text-lg text-primary">
						{formatPrice(totalPrice)}
					</span>
				</div>
			</div>

			{/* Terms Notice */}
			<div className="text-xs text-default-500 text-center">
				Al continuar, aceptas nuestros términos y condiciones de servicio
			</div>

			{/* Submit Button */}
			<div className="space-y-4 pt-4">
				<Button
					color="primary"
					onPress={handleSubmit}
					disabled={!isFormValid()}
					className="w-full"
					size="lg"
				>
					Confirmar cita
				</Button>
			</div>
		</div>
	);
};

export default ClientInfoForm;
