import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@beweco/aurora-ui";
import type React from "react";
import { useState } from "react";
import ClientInfoForm from "./ClientInfoForm";
import FlowChoice from "./FlowChoice";
import PrioritySelection, { type BookingPriority } from "./PrioritySelection";
import ProfessionalSelection from "./ProfessionalSelection";
import ServiceSelection from "./ServiceSelection";
import TimeSelection from "./TimeSelection";

// Safe Icon wrapper to prevent iconify errors with React 19
const SafeIcon: React.FC<{ icon: string; className?: string }> = ({
	icon,
	className,
}) => {
	// Use simple SVG icons as fallback
	const iconMap: Record<string, JSX.Element> = {
		"solar:alt-arrow-left-linear": (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M15 18l-6-6 6-6" />
			</svg>
		),
	};

	return <span className={className}>{iconMap[icon] || <span>←</span>}</span>;
};

export interface WidgetConfig {
	clientInfoMode: "phone_only" | "email_only" | "phone_and_email";
	professionalSelection: "required" | "optional" | "disabled";
	flowOrder: "time_first" | "professional_first" | "client_choice";
}

export interface SelectedService {
	id: string;
	name: string;
	duration: number;
	price: number;
}

export interface SelectedTime {
	date: string;
	time: string;
}

export interface SelectedProfessional {
	id: string;
	name: string;
}

export interface ClientInfo {
	firstName: string;
	lastName: string;
	phone?: string;
	email?: string;
}

interface BookingWidgetProps {
	isOpen: boolean;
	onClose: () => void;
	config: WidgetConfig;
}

export type BookingStep =
	| "services"
	| "flow_choice"
	| "booking_priority"
	| "time"
	| "professional"
	| "client_info"
	| "confirmation";

const BookingWidget: React.FC<BookingWidgetProps> = ({
	isOpen,
	onClose,
	config,
}) => {
	const [currentStep, setCurrentStep] = useState<BookingStep>("services");
	const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
		[]
	);
	const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null);
	const [selectedProfessional, setSelectedProfessional] =
		useState<SelectedProfessional | null>(null);
	const [clientFlowChoice, setClientFlowChoice] = useState<
		"time_first" | "professional_first" | null
	>(null);
	const [bookingPriority, setBookingPriority] =
		useState<BookingPriority | null>(null);
	const [clientInfo, setClientInfo] = useState<ClientInfo>({
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
	});

	const handlePriorityNext = (priority: BookingPriority) => {
		setBookingPriority(priority);

		// Based on priority selection, determine next step
		if (priority === "time_first") {
			// Time priority: Go to time selection first
			setCurrentStep("time");
		} else {
			// professional_first
			// Professional priority: Go to professional selection first
			if (config.professionalSelection === "disabled") {
				// If professional selection is disabled, skip to time
				setCurrentStep("time");
			} else {
				// Go to professional selection first
				setCurrentStep("professional");
			}
		}
	};

	const handleNext = () => {
		switch (currentStep) {
			case "services":
				// Always go to booking priority selection after services
				setCurrentStep("booking_priority");
				break;
			case "booking_priority":
				// This case will be handled by handlePriorityNext
				break;
			case "flow_choice":
				// Go to the step the client chose
				if (clientFlowChoice === "time_first") {
					setCurrentStep("time");
				} else if (clientFlowChoice === "professional_first") {
					setCurrentStep("professional");
				}
				break;
			case "time":
				// After time selection, determine next step
				if (bookingPriority === "time_first") {
					// Time priority: Time → Professional → Client Info (if professional enabled)
					if (config.professionalSelection === "disabled") {
						setCurrentStep("client_info");
					} else {
						setCurrentStep("professional");
					}
				} else {
					// Professional priority: Professional → Time → Client Info
					setCurrentStep("client_info");
				}
				break;
			case "professional":
				// After professional selection, determine next step
				if (bookingPriority === "time_first") {
					// Time priority: Time → Professional → Client Info
					setCurrentStep("client_info");
				} else {
					// Professional priority: Professional → Time → Client Info
					setCurrentStep("time");
				}
				break;
			case "client_info":
				setCurrentStep("confirmation");
				break;
		}
	};

	const handleBack = () => {
		switch (currentStep) {
			case "flow_choice":
				setCurrentStep("services");
				break;
			case "time":
				if (bookingPriority === "time_first") {
					// Time is first step after booking_priority
					setCurrentStep("booking_priority");
				} else {
					// Time comes after professional
					setCurrentStep("professional");
				}
				break;
			case "booking_priority":
				setCurrentStep("services");
				break;
			case "professional":
				if (bookingPriority === "professional_first") {
					// Professional is first step after booking_priority
					setCurrentStep("booking_priority");
				} else {
					// Professional comes after time
					setCurrentStep("time");
				}
				break;
			case "client_info":
				if (config.professionalSelection === "disabled") {
					setCurrentStep("time");
				} else {
					// Go back to the last step (time or professional)
					if (bookingPriority === "time_first") {
						// Time → Professional → Client Info, so go back to professional
						setCurrentStep("professional");
					} else {
						// Professional → Time → Client Info, so go back to time
						setCurrentStep("time");
					}
				}
				break;
			case "confirmation":
				setCurrentStep("client_info");
				break;
		}
	};

	const resetWidget = () => {
		setCurrentStep("services");
		setSelectedServices([]);
		setSelectedTime(null);
		setSelectedProfessional(null);
		setClientFlowChoice(null);
		setBookingPriority(null);
		setClientInfo({
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
		});
		onClose();
	};

	const getStepTitle = () => {
		switch (currentStep) {
			case "services":
				return "Selecciona tu servicio";
			case "flow_choice":
				return "¿Qué prefieres?";
			case "booking_priority":
				return "¿Qué es más importante?";
			case "time":
				return "Elige fecha y hora";
			case "professional":
				return "Selecciona profesional";
			case "client_info":
				return "Datos de contacto";
			case "confirmation":
				return "Confirmación";
			default:
				return "";
		}
	};

	const renderCurrentStep = () => {
		switch (currentStep) {
			case "services":
				return (
					<ServiceSelection
						selectedServices={selectedServices}
						onServicesChange={setSelectedServices}
						onNext={handleNext}
						canProceed={selectedServices.length > 0}
					/>
				);
			case "flow_choice":
				return (
					<FlowChoice
						onFlowChoice={(choice) => {
							setClientFlowChoice(choice);
							handleNext();
						}}
					/>
				);
			case "booking_priority":
				return (
					<PrioritySelection
						selectedPriority={bookingPriority}
						onPriorityChange={handlePriorityNext}
						onNext={handleNext}
						canProceed={bookingPriority !== null}
					/>
				);
			case "time":
				return (
					<TimeSelection
						selectedTime={selectedTime}
						onTimeChange={setSelectedTime}
						selectedServices={selectedServices}
						onNext={handleNext}
						canProceed={selectedTime !== null}
					/>
				);
			case "professional":
				return (
					<ProfessionalSelection
						selectedProfessional={selectedProfessional}
						onProfessionalChange={setSelectedProfessional}
						config={config}
						onNext={handleNext}
						canProceed={
							config.professionalSelection === "optional" ||
							selectedProfessional !== null
						}
					/>
				);
			case "client_info":
				return (
					<ClientInfoForm
						clientInfo={clientInfo}
						onClientInfoChange={setClientInfo}
						config={config}
						selectedServices={selectedServices}
						onNext={handleNext}
					/>
				);
			case "confirmation":
				return (
					<div className="space-y-4">
						<div className="text-center">
							<h3 className="text-lg font-semibold text-success">
								¡Cita agendada exitosamente!
							</h3>
							<p className="text-default-500 mt-2">
								Recibirás una confirmación por email/SMS
							</p>
						</div>

						<div className="bg-default-50 p-4 rounded-lg space-y-2">
							<div>
								<strong>Cliente:</strong> {clientInfo.firstName}{" "}
								{clientInfo.lastName}
							</div>
							<div>
								<strong>Servicios:</strong>{" "}
								{selectedServices.map((s) => s.name).join(", ")}
							</div>
							<div>
								<strong>Fecha:</strong> {selectedTime?.date} a las{" "}
								{selectedTime?.time}
							</div>
							{selectedProfessional && (
								<div>
									<strong>Profesional:</strong> {selectedProfessional.name}
								</div>
							)}
							{clientInfo.phone && (
								<div>
									<strong>Teléfono:</strong> {clientInfo.phone}
								</div>
							)}
							{clientInfo.email && (
								<div>
									<strong>Email:</strong> {clientInfo.email}
								</div>
							)}
						</div>

						<button
							onClick={resetWidget}
							className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
						>
							Gracias Linda
						</button>
					</div>
				);
			default:
				return null;
		}
	};

	const CloseIcon: React.FC<{ className?: string }> = ({ className }) => {
		return (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className={className}
			>
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {}}
			size="2xl"
			className="max-h-[calc(100vh-8rem)] mt-16 mb-16 mx-4 max-w-2xl"
			hideCloseButton
			placement="top"
		>
			<ModalContent className="h-full">
				<ModalHeader className="flex justify-between items-start flex-shrink-0">
					<div className="flex flex-col gap-1">
						<h2 className="text-xl font-bold">Sugar Me Spa</h2>
						<p className="text-sm text-default-500">{getStepTitle()}</p>
					</div>
					<div className="flex items-center gap-2">
						{currentStep !== "services" && (
							<Button
								variant="bordered"
								size="sm"
								onPress={handleBack}
								className="border-default-200 hover:bg-default-50"
								startContent={
									<SafeIcon
										icon="solar:alt-arrow-left-linear"
										className="w-4 h-4 text-default-600"
									/>
								}
							>
								Atrás
							</Button>
						)}
						<Button
							isIconOnly
							variant="bordered"
							size="sm"
							onPress={onClose}
							className="border-default-200 hover:bg-default-50"
						>
							<CloseIcon className="w-4 h-4 text-default-600" />
						</Button>
					</div>
				</ModalHeader>
				<ModalBody className="pb-6 flex-1 overflow-hidden">
					<div className="h-full overflow-y-auto">{renderCurrentStep()}</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default BookingWidget;
