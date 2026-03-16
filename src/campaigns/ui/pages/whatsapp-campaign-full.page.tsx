import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	Card,
	Checkbox,
	Chip,
	DateSelector,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	H2,
	H4,
	IconComponent,
	Image,
	P,
	SearchInput,
	Tab,
	Tabs,
	Textarea,
} from "@beweco/aurora-ui";
import { PROSPECTIVE_CLIENT } from "@clients/domain/constants/prospective-client.constants";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { EnumPotentialClient } from "@clients/domain/enums/potential.enum";
import type { IView } from "@clients/domain/interfaces/view.interface";
import {
	DateFilterSection,
	type DateFilterSectionValue,
} from "@shared/ui/components";
import { useViewsContext } from "@clients/ui/_shared/contexts/views.context";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { BACKGROUND_COLOR_MAP } from "@shared/utils/status-colors.utils";
import { useTranslate } from "@tolgee/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CampaignData {
	intention: string;
	imageUrl?: string;
	text: string;
	segment: SegmentData;
	includeImage: boolean;
}

interface SegmentData {
	type: "intelligent" | "all" | "custom" | "saved-views";
	name?: string;
	description?: string;
	aiTags?: string[];
	clientStatuses?: EnumClientStatus[];
	estimatedReach: number;
	expectedVisibility: number;
	savedViewId?: string;
}

// Template interface
interface Template {
	id: string;
	name: string;
	description: string;
	content: string;
	imageUrl?: string;
}

// Mock templates data
const mockTemplates: Template[] = [
	{
		id: "temp-1",
		name: "Bienvenida a Nuevos Clientes",
		description:
			"Mensaje de bienvenida personalizado para nuevos clientes con información de contacto y próximos pasos",
		content:
			"¡Hola {{nombre}}! 👋\n\nTe damos la bienvenida a nuestra familia. Estamos emocionados de tenerte con nosotros.\n\n¿En qué podemos ayudarte hoy?",
		imageUrl:
			"https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&h=400&fit=crop",
	},
	{
		id: "temp-2",
		name: "Recordatorio de Cita",
		description:
			"Recordatorio automático de cita 24 horas antes con opción de confirmación o reagendamiento",
		content:
			"Hola {{nombre}}, 📅\n\nTe recordamos tu cita para mañana a las {{hora}}.\n\n¿Confirmas tu asistencia? Responde SÍ para confirmar o NO para reagendar.",
		imageUrl:
			"https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=400&fit=crop",
	},
	{
		id: "temp-3",
		name: "Seguimiento Post-Compra",
		description:
			"Mensaje de seguimiento después de la compra para solicitar feedback y ofrecer soporte",
		content:
			"¡Hola {{nombre}}! 😊\n\nEsperamos que estés disfrutando de tu compra. ¿Cómo ha sido tu experiencia?\n\nCuéntanos, tu opinión es muy importante para nosotros.",
		imageUrl:
			"https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop",
	},
	{
		id: "temp-4",
		name: "Promoción Especial",
		description: "Plantilla para anunciar promociones y ofertas limitadas",
		content:
			"🎉 ¡OFERTA ESPECIAL! 🎉\n\nHola {{nombre}}, tenemos una promoción exclusiva para ti.\n\n{{descripcion_promocion}}\n\n¡No te lo pierdas!",
		imageUrl:
			"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop",
	},
	{
		id: "temp-5",
		name: "Newsletter Informativa",
		description:
			"Plantilla para enviar noticias y actualizaciones a tus clientes",
		content:
			"📰 Novedades de {{nombre_empresa}}\n\nHola {{nombre}},\n\n{{contenido_newsletter}}\n\n¡Gracias por ser parte de nuestra comunidad!",
		imageUrl:
			"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
	},
];

// Mock data para segmentación
const mockAiTags = [
	"Cliente Premium",
	"Interesado en Fitness",
	"Comprador Frecuente",
	"Cliente Nuevo",
	"Fan de Tecnología",
	"Seguidor de Moda",
	"Cliente VIP",
	"Interesado en Cocina",
	"Deportista",
];

const mockClientStatuses = ["Activo", "Inactivo", "Potencial", "VIP", "Nuevo"];

const mockCategories = [
	"Minorista",
	"Mayorista",
	"Servicios",
	"Tecnología",
	"Alimentos y Bebidas",
	"Salud y Bienestar",
	"Educación",
	"Inmobiliaria",
	"Automotriz",
];

const mockCreationChannels = [
	"Formulario Web",
	"WhatsApp",
	"Importación",
	"Manual",
	"Redes Sociales",
	"Email",
	"Referido",
];

const mockIntelligentSegments = [
	{
		name: "Clientes Activos Premium",
		description: "Clientes con alta actividad y compras recientes",
		estimatedReach: 1250,
		expectedVisibility: 85,
	},
	{
		name: "Nuevos Clientes Potenciales",
		description: "Clientes registrados en los últimos 30 días",
		estimatedReach: 890,
		expectedVisibility: 92,
	},
	{
		name: "Clientes Inactivos",
		description: "Clientes sin actividad en los últimos 60 días",
		estimatedReach: 2100,
		expectedVisibility: 65,
	},
];

// Mock data para vistas guardadas
const mockSavedViews: IView[] = [
	{
		id: "view-1",
		name: "Clientes VIP",
		description: "Clientes con alto valor y compras frecuentes",
		filters: {},
		companyId: "",
		userId: "",
		createdAt: new Date(),
		updatedAt: new Date(),
		isDefault: true,
		isActive: true,
		entityType: "clients",
	},
	{
		id: "view-2",
		name: "Nuevos del Mes",
		description: "Clientes registrados en el último mes",
		filters: {},
		companyId: "",
		userId: "",
		createdAt: new Date(),
		updatedAt: new Date(),
		isActive: true,
		entityType: "clients",
	},
	{
		id: "view-3",
		name: "Clientes con Cumpleaños",
		description: "Clientes que cumplen años este mes",
		filters: {},
		companyId: "",
		userId: "",
		createdAt: new Date(),
		updatedAt: new Date(),
		isActive: true,
		entityType: "clients",
	},
	{
		id: "view-4",
		name: "Leads Potenciales",
		description: "Prospectos con alto potencial de conversión",
		filters: {},
		companyId: "",
		userId: "",
		createdAt: new Date(),
		updatedAt: new Date(),
		isActive: true,
		entityType: "clients",
	},
	{
		id: "view-5",
		name: "Clientes Inactivos 60 días",
		description: "Clientes sin actividad en los últimos 60 días",
		filters: {},
		companyId: "",
		userId: "",
		createdAt: new Date(),
		updatedAt: new Date(),
		isActive: true,
		entityType: "clients",
	},
];

function WhatsAppCampaignFullPage() {
	const { t } = useTranslate();
	const navigate = useNavigate();

	// Get session data for views
	const { views: realViews } = useViewsContext();

	// Combine real views with mock data (use mock data if no real views)
	const savedViews = realViews.length > 0 ? realViews : mockSavedViews;

	// Template selection state
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
		null
	);
	const [useTemplate, setUseTemplate] = useState<boolean>(false);
	const [hasSelectedOption, setHasSelectedOption] = useState<boolean>(false);

	const [intention, setIntention] = useState("");
	const [generatedImage, setGeneratedImage] = useState<string>("");
	const [generatedText, setGeneratedText] = useState<string>("");
	const [includeImage, setIncludeImage] = useState(true);
	const [editImagePrompt, setEditImagePrompt] = useState("");
	const [editTextPrompt, setEditTextPrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);

	// Step state
	const [currentStep, setCurrentStep] = useState(0);

	// Channel selection state
	const [selectedChannels, setSelectedChannels] = useState<{
		whatsapp: boolean;
		email: boolean;
	}>({
		whatsapp: false,
		email: false,
	});

	// Scheduling states
	const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("now");
	const [scheduledDate, setScheduledDate] = useState<string>("");

	// Segmentation states
	const [segmentType, setSegmentType] = useState<
		"intelligent" | "all" | "custom" | "saved-views"
	>("intelligent");
	const [selectedIntelligentSegment, setSelectedIntelligentSegment] =
		useState(0);
	const [selectedSavedView, setSelectedSavedView] = useState<IView | null>(
		null
	);
	const [tagSearchQuery, setTagSearchQuery] = useState("");
	const [dateFilters, setDateFilters] = useState<{
		registered?: DateFilterSectionValue | null;
		birthdate?: DateFilterSectionValue | null;
	}>({});

	// New simplified filter structure
	interface CustomFilter {
		id: string;
		type: "" | "status" | "tag" | "potential" | "date";
		values: any[];
		operator: "Y" | "O"; // Operator to next filter
		valueLogic: Record<string, "Y" | "O">; // Logic between values within this filter
	}

	const [customFilters, setCustomFilters] = useState<CustomFilter[]>([
		{
			id: Date.now().toString(),
			type: "",
			values: [],
			operator: "Y",
			valueLogic: {},
		},
	]);

	const filterTypesOptions = [
		{
			value: "status",
			label: "Estado de cliente",
			icon: "solar:user-check-bold",
		},
		{ value: "tag", label: "Etiquetas", icon: "solar:tag-bold" },
		{
			value: "potential",
			label: "Potencial de cliente",
			icon: "solar:chart-bold",
		},
		{ value: "date", label: "Fecha", icon: "solar:calendar-bold" },
	];

	// Filter management functions
	const addFilter = () => {
		setCustomFilters((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				type: "",
				values: [],
				operator: "Y",
				valueLogic: {},
			},
		]);
	};

	const removeFilter = (filterId: string) => {
		setCustomFilters((prev) => prev.filter((f) => f.id !== filterId));
	};

	const updateFilterType = (filterId: string, type: CustomFilter["type"]) => {
		setCustomFilters((prev) =>
			prev.map((f) =>
				f.id === filterId ? { ...f, type, values: [], valueLogic: {} } : f
			)
		);
	};

	const updateFilterValues = (filterId: string, values: any[]) => {
		setCustomFilters((prev) =>
			prev.map((f) => {
				if (f.id === filterId) {
					// Initialize valueLogic for new values
					const newValueLogic = { ...f.valueLogic };

					// Apply pending logic to the new value if it exists
					if (values.length > f.values.length) {
						// A new value was added
						const newValue = values[values.length - 1];
						const newValueKey = String(newValue);

						// Check if there's a pending logic for the previous value
						if (f.values.length > 0) {
							const prevValue = f.values[f.values.length - 1];
							const pendingKey = `pending_${prevValue}`;

							if (newValueLogic[pendingKey]) {
								// Apply the pending logic to the new value
								newValueLogic[newValueKey] = newValueLogic[pendingKey];
								// Remove the pending key
								delete newValueLogic[pendingKey];
							} else {
								// Default to 'O' if no pending logic
								newValueLogic[newValueKey] = "O";
							}
						}
					}

					// Clean up any pending keys that are no longer needed
					Object.keys(newValueLogic).forEach((key) => {
						if (
							key.startsWith("pending_") &&
							!values.includes(key.replace("pending_", ""))
						) {
							delete newValueLogic[key];
						}
					});

					return { ...f, values, valueLogic: newValueLogic };
				}
				return f;
			})
		);
	};

	const updateFilterOperator = (filterId: string, operator: "Y" | "O") => {
		setCustomFilters((prev) =>
			prev.map((f) => (f.id === filterId ? { ...f, operator } : f))
		);
	};

	const updateValueLogic = (
		filterId: string,
		valueKey: string,
		logic: "Y" | "O"
	) => {
		setCustomFilters((prev) =>
			prev.map((f) => {
				if (f.id === filterId) {
					return {
						...f,
						valueLogic: {
							...f.valueLogic,
							[valueKey]: logic,
						},
					};
				}
				return f;
			})
		);
	};

	const steps = [
		{ title: "Canal" },
		{ title: "Plantilla" },
		{ title: "Segmentar" },
		{ title: "Revisar" },
	];

	const handleSelectTemplate = (template: Template) => {
		setSelectedTemplate(template);
		setUseTemplate(true);
		setHasSelectedOption(true);
		setGeneratedText(template.content);
		if (template.imageUrl) {
			setGeneratedImage(template.imageUrl);
			setIncludeImage(true);
		}
	};

	const handleStartFromScratch = () => {
		setSelectedTemplate(null);
		setUseTemplate(false);
		setHasSelectedOption(true);
		setGeneratedText("");
		setGeneratedImage("");
	};

	const handleGenerate = async () => {
		if (!intention.trim()) return;

		setIsGenerating(true);
		setCurrentStep(2);

		// Simular llamada API
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Mock data - si no se usa plantilla, generar contenido
		if (!useTemplate) {
			if (includeImage) {
				setGeneratedImage(
					"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop"
				);
			}
			setGeneratedText(
				`¡Hola! 👋\n\n${intention}\n\nTe invitamos a conocer nuestras últimas novedades. ¿Cuándo podemos agendar una llamada?\n\n¡Esperamos tu respuesta!`
			);
		}

		setIsGenerating(false);
	};

	const handleEditImage = async () => {
		if (!editImagePrompt.trim()) return;

		setIsGenerating(true);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setGeneratedImage(
			"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop"
		);
		setEditImagePrompt("");
		setIsGenerating(false);
	};

	const handleEditText = async () => {
		if (!editTextPrompt.trim()) return;

		setIsGenerating(true);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setGeneratedText((prev) => `${prev}\n\n${editTextPrompt}`);
		setEditTextPrompt("");
		setIsGenerating(false);
	};

	const handleDiscardImage = () => {
		setGeneratedImage("");
		setIncludeImage(false);
	};

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		} else {
			navigate("/campaigns");
		}
	};

	const handleCreateCampaign = () => {
		const segment = getSegmentData();
		const campaignData: CampaignData = {
			intention,
			imageUrl: generatedImage,
			text: generatedText,
			segment,
			includeImage,
		};

		console.log("Campaña creada:", campaignData);
		navigate("/campaigns");
	};

	const handleSaveCampaign = () => {
		const segment = getSegmentData();
		const campaignData: CampaignData = {
			intention,
			imageUrl: generatedImage,
			text: generatedText,
			segment,
			includeImage,
		};

		console.log("Campaña guardada:", campaignData);
		navigate("/campaigns");
	};

	const getSegmentData = (): SegmentData => {
		switch (segmentType) {
			case "intelligent":
				return {
					type: "intelligent",
					...mockIntelligentSegments[selectedIntelligentSegment],
				};
			case "all":
				return {
					type: "all",
					name: "Todos los Clientes",
					description: "Campaña dirigida a toda tu base de clientes",
					estimatedReach: 5000,
					expectedVisibility: 75,
				};
			case "custom":
				const activeFilters = customFilters.filter(
					(f) => f.type && f.values.length > 0
				);
				const statusFilters = customFilters
					.filter((f) => f.type === "status")
					.flatMap((f) => f.values);
				const tagFilters = customFilters
					.filter((f) => f.type === "tag")
					.flatMap((f) => f.values);

				return {
					type: "custom",
					name: "Segmento Personalizado",
					description:
						activeFilters.length > 0
							? `Segmento con ${activeFilters.length} filtro(s) activo(s)`
							: "Segmento basado en criterios específicos",
					aiTags: tagFilters,
					clientStatuses: statusFilters,
					estimatedReach: Math.floor(Math.random() * 2000) + 500,
					expectedVisibility: Math.floor(Math.random() * 30) + 60,
				};
			case "saved-views":
				return {
					type: "saved-views",
					name: selectedSavedView?.name || "Vista Guardada",
					description:
						selectedSavedView?.description ||
						"Segmento basado en vista guardada",
					savedViewId: selectedSavedView?.id,
					estimatedReach: Math.floor(Math.random() * 2000) + 500,
					expectedVisibility: Math.floor(Math.random() * 30) + 60,
				};
			default:
				return {
					type: "intelligent",
					...mockIntelligentSegments[0],
				};
		}
	};

	// Filtrar etiquetas IA por búsqueda
	const filteredAiTags = useMemo(() => {
		return mockAiTags.filter((tag) =>
			tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
		);
	}, [tagSearchQuery]);

	return (
		<div className="container mx-auto px-4 py-6 max-w-7xl">
			{/* Header with Breadcrumbs */}
			<div className="mb-6">
				<Breadcrumbs>
					<BreadcrumbItem href="/campaigns">Campañas</BreadcrumbItem>
					<BreadcrumbItem>Crear campaña</BreadcrumbItem>
				</Breadcrumbs>

				<div className="flex items-center justify-between mt-4">
					<div>
						<H2>Crear campaña</H2>
					</div>

					<Button
						variant="light"
						onPress={() => navigate("/campaigns")}
						startContent={<IconComponent icon="solar:close-circle-bold" />}
					>
						Cancelar
					</Button>
				</div>
			</div>

			{/* Steps Indicator */}
			<div className="mb-8">
				<div className="flex items-center justify-center mx-auto gap-2">
					{steps.map((step, index) => (
						<div key={index} className="flex items-center gap-2">
							<div className="flex flex-col items-center">
								<button
									type="button"
									onClick={() => setCurrentStep(index)}
									className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
										index === currentStep
											? "bg-primary-500 text-white shadow-lg"
											: index < currentStep
												? "bg-green-500 text-white"
												: "bg-gray-200 text-gray-500"
									} hover:scale-110 cursor-pointer`}
									aria-label={`Ir al paso ${index + 1}: ${step.title}`}
								>
									{index < currentStep ? (
										<IconComponent
											icon="solar:check-circle-bold"
											className="w-5 h-5"
										/>
									) : (
										index + 1
									)}
								</button>
								<div className="text-center mt-2">
									<p
										className={`text-sm font-medium whitespace-nowrap ${index === currentStep ? "text-primary-600" : "text-gray-600"}`}
									>
										{step.title}
									</p>
								</div>
							</div>
							{index < steps.length - 1 && (
								<div
									className={`w-24 h-1 transition-all duration-300 ${
										index < currentStep ? "bg-green-500" : "bg-gray-200"
									}`}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Content Area */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-5xl mx-auto min-h-[600px]">
				{/* Step 0: Channel Selection */}
				{currentStep === 0 && (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">
								Selecciona el canal de tu campaña
							</h3>
							<p className="text-gray-600">
								Elige uno o ambos canales por los que deseas enviar tu campaña
							</p>
						</div>

						<div className="max-w-3xl mx-auto w-full">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* WhatsApp Card */}
								<Card
									isPressable
									onPress={() =>
										setSelectedChannels((prev) => ({
											...prev,
											whatsapp: !prev.whatsapp,
										}))
									}
									className={`p-6 border-2 transition-all cursor-pointer ${
										selectedChannels.whatsapp
											? "border-success bg-success-50"
											: "border-gray-200 hover:border-success-300"
									}`}
								>
									<div className="flex flex-col items-center text-center gap-4">
										<div className="relative">
											<div
												className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
													selectedChannels.whatsapp
														? "bg-success-200"
														: "bg-success-100"
												}`}
											>
												<IconComponent
													icon="logos:whatsapp-icon"
													className="text-5xl"
												/>
											</div>
											{selectedChannels.whatsapp && (
												<div className="absolute -top-2 -right-2 bg-success-500 rounded-full p-1">
													<IconComponent
														icon="solar:check-circle-bold"
														className="text-white w-6 h-6"
													/>
												</div>
											)}
										</div>
										<div>
											<H4 className="mb-2">WhatsApp</H4>
											<P className="text-default-500 text-sm">
												Mensajes personalizados con alta tasa de apertura y
												respuesta inmediata
											</P>
										</div>
									</div>
								</Card>

								{/* Email Card */}
								<Card
									isPressable
									onPress={() =>
										setSelectedChannels((prev) => ({
											...prev,
											email: !prev.email,
										}))
									}
									className={`p-6 border-2 transition-all cursor-pointer ${
										selectedChannels.email
											? "border-primary bg-primary-50"
											: "border-gray-200 hover:border-primary-300"
									}`}
								>
									<div className="flex flex-col items-center text-center gap-4">
										<div className="relative">
											<div
												className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
													selectedChannels.email
														? "bg-primary-200"
														: "bg-primary-100"
												}`}
											>
												<IconComponent
													icon="solar:letter-bold"
													className="text-5xl text-primary"
												/>
											</div>
											{selectedChannels.email && (
												<div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-1">
													<IconComponent
														icon="solar:check-circle-bold"
														className="text-white w-6 h-6"
													/>
												</div>
											)}
										</div>
										<div>
											<H4 className="mb-2">Email</H4>
											<P className="text-default-500 text-sm">
												Contenido detallado con diseño profesional y métricas
												avanzadas
											</P>
										</div>
									</div>
								</Card>
							</div>

							{/* Selected channels summary */}
							{(selectedChannels.whatsapp || selectedChannels.email) && (
								<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
									<div className="flex items-start gap-3">
										<IconComponent
											icon="solar:info-circle-bold"
											className="text-blue-600 w-5 h-5 mt-0.5"
										/>
										<div className="flex-1">
											<p className="text-sm font-medium text-blue-900">
												{selectedChannels.whatsapp && selectedChannels.email
													? "📱 + 📧 Campaña multi-canal seleccionada"
													: selectedChannels.whatsapp
														? "📱 Campaña de WhatsApp seleccionada"
														: "📧 Campaña de Email seleccionada"}
											</p>
											<p className="text-xs text-blue-700 mt-1">
												{selectedChannels.whatsapp && selectedChannels.email
													? "Tu mensaje llegará por WhatsApp y Email para maximizar el alcance"
													: "Podrás configurar tu mensaje y segmentación en los siguientes pasos"}
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<Button variant="light" onPress={handleBack}>
								Cancelar
							</Button>
							<Button
								color="primary"
								onPress={handleNext}
								disabled={!selectedChannels.whatsapp && !selectedChannels.email}
								endContent={<IconComponent icon="solar:arrow-right-outline" />}
							>
								Continuar
							</Button>
						</div>
					</div>
				)}

				{/* Step 1: Template Selection */}
				{currentStep === 1 && (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<H4>Selecciona una plantilla para tu campaña</H4>
						</div>

						{/* Dropdown Selector */}
						<div className="max-w-2xl mx-auto">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Seleccionar plantilla
							</label>
							<Dropdown
								classNames={{
									content: "min-w-[500px]",
								}}
							>
								<DropdownTrigger>
									<Button
										variant="bordered"
										size="lg"
										className="w-full justify-between h-auto py-3"
										endContent={
											<IconComponent
												icon="solar:alt-arrow-down-outline"
												className="w-5 h-5 text-gray-400"
											/>
										}
									>
										<div className="flex items-center gap-3 text-left flex-1">
											{selectedTemplate ? (
												<>
													<IconComponent
														icon="solar:document-text-bold"
														className="w-5 h-5 text-primary-600 flex-shrink-0"
													/>
													<div className="flex-1 min-w-0">
														<p className="font-semibold text-gray-900 truncate">
															{selectedTemplate.name}
														</p>
														<p className="text-xs text-gray-500 truncate">
															{selectedTemplate.description}
														</p>
													</div>
												</>
											) : (
												<>
													<IconComponent
														icon="solar:list-bold"
														className="w-5 h-5 text-gray-400 flex-shrink-0"
													/>
													<span className="text-gray-500">
														Selecciona una plantilla de la lista
													</span>
												</>
											)}
										</div>
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									aria-label="Plantillas disponibles"
									onAction={(key) => {
										const template = mockTemplates.find((t) => t.id === key);
										if (template) handleSelectTemplate(template);
									}}
									selectedKeys={
										selectedTemplate
											? new Set([selectedTemplate.id])
											: new Set([])
									}
									selectionMode="single"
									classNames={{
										base: "max-h-[300px] overflow-y-auto",
										list: "max-h-[300px]",
									}}
									itemClasses={{
										base: "py-3 px-4 gap-3 data-[hover=true]:bg-primary-50 data-[selected=true]:bg-primary-100",
										title: "text-sm font-semibold text-gray-900",
										description: "text-xs text-gray-600 whitespace-normal",
									}}
								>
									{mockTemplates.map((template) => (
										<DropdownItem
											key={template.id}
											description={template.description}
											startContent={
												<div className="flex-shrink-0">
													{template.imageUrl ? (
														<div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
															<Image
																src={template.imageUrl}
																alt={template.name}
																className="w-full h-full object-cover"
															/>
														</div>
													) : (
														<div className="w-10 h-10 rounded bg-primary-100 flex items-center justify-center">
															<IconComponent
																icon="solar:document-text-outline"
																className="w-5 h-5 text-primary-600"
															/>
														</div>
													)}
												</div>
											}
											endContent={
												selectedTemplate?.id === template.id ? (
													<IconComponent
														icon="solar:check-circle-bold"
														className="w-5 h-5 text-primary-600"
													/>
												) : null
											}
										>
											{template.name}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</div>

						<div className="flex justify-end space-x-3 pt-4">
							<Button variant="light" onPress={handleBack}>
								Cancelar
							</Button>
							<Button
								color="primary"
								onPress={handleNext}
								disabled={!selectedTemplate}
								endContent={<IconComponent icon="solar:arrow-right-outline" />}
							>
								Continuar
							</Button>
						</div>
					</div>
				)}

				{/* Step 2: Segmentation */}
				{currentStep === 2 && (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<H4>Selecciona tu audiencia</H4>
						</div>

						<div className="space-y-4">
							{/* Segment Type Selection */}
							<Tabs
								selectedKey={segmentType}
								onSelectionChange={(key) =>
									setSegmentType(
										key as "intelligent" | "all" | "custom" | "saved-views"
									)
								}
								className="w-full flex justify-center"
							>
								<Tab key="intelligent" title="Inteligente">
									<div className="pt-4">
										<div className="text-center mb-4">
											<p className="text-sm text-gray-600">
												IA selecciona por ti
											</p>
										</div>
									</div>
								</Tab>

								<Tab key="all" title="Todos">
									<div className="pt-4">
										<div className="text-center mb-4">
											<p className="text-sm text-gray-600">Toda tu base</p>
										</div>
									</div>
								</Tab>

								<Tab key="saved-views" title="Vistas">
									<div className="pt-4">
										<div className="text-center mb-4">
											<p className="text-sm text-gray-600">
												Usa vistas guardadas
											</p>
										</div>
									</div>
								</Tab>

								<Tab key="custom" title="Personalizado">
									<div className="pt-4">
										<div className="text-center mb-4">
											<p className="text-sm text-gray-600">Configura filtros</p>
										</div>
									</div>
								</Tab>
							</Tabs>

							{/* Intelligent Segmentation */}
							{segmentType === "intelligent" && (
								<div className="space-y-3">
									{mockIntelligentSegments.map((segment, index) => (
										<button
											key={index}
											type="button"
											onClick={() => setSelectedIntelligentSegment(index)}
											className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
												selectedIntelligentSegment === index
													? "border-primary-500 bg-primary-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
										>
											<div className="flex justify-between items-start mb-2">
												<h5 className="font-semibold text-gray-900">
													{segment.name}
												</h5>
												<Chip size="sm" color="primary" variant="flat">
													{segment.estimatedReach} clientes
												</Chip>
											</div>
											<p className="text-sm text-gray-600 mb-2">
												{segment.description}
											</p>
											<div className="flex items-center gap-2 text-xs text-gray-500">
												<IconComponent
													icon="solar:eye-bold"
													className="w-4 h-4"
												/>
												<span>
													Visibilidad esperada: {segment.expectedVisibility}%
												</span>
											</div>
										</button>
									))}
								</div>
							)}

							{/* All Clients */}
							{segmentType === "all" && (
								<div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
									<IconComponent
										icon="solar:users-group-rounded-bold"
										className="w-12 h-12 text-blue-600 mx-auto mb-3"
									/>
									<h5 className="font-semibold text-gray-900 mb-2">
										Enviar a todos los clientes
									</h5>
									<p className="text-sm text-gray-600 mb-3">
										Tu campaña llegará a toda tu base de clientes activos
									</p>
									<div className="flex items-center justify-center gap-4 text-sm">
										<div>
											<span className="font-semibold text-blue-600">5,000</span>
											<span className="text-gray-600 ml-1">clientes</span>
										</div>
										<div className="w-px h-4 bg-gray-300"></div>
										<div>
											<span className="font-semibold text-blue-600">75%</span>
											<span className="text-gray-600 ml-1">visibilidad</span>
										</div>
									</div>
								</div>
							)}

							{/* Saved Views */}
							{segmentType === "saved-views" && (
								<div className="space-y-4">
									<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
										<div className="flex items-start gap-3">
											<IconComponent
												icon="solar:eye-bold"
												className="w-5 h-5 text-green-600 mt-0.5"
											/>
											<div>
												<h5 className="font-semibold text-gray-900 mb-1">
													Vistas Guardadas
												</h5>
												<p className="text-xs text-gray-600">
													Selecciona una vista guardada para aplicar sus filtros
													a tu campaña
												</p>
											</div>
										</div>
									</div>

									{/* Dropdown selector */}
									<div className="bg-white rounded-lg border border-gray-200 p-4">
										<div className="flex items-center gap-2 mb-3">
											<IconComponent
												icon="solar:list-bold"
												className="w-5 h-5 text-green-600"
											/>
											<p className="text-sm font-semibold text-gray-900">
												Seleccionar vista:
											</p>
										</div>
										<Dropdown>
											<DropdownTrigger>
												<Button
													size="lg"
													variant="bordered"
													className="w-full justify-between h-14 px-4 border-2 hover:border-green-500 hover:bg-green-50 transition-all"
													isDisabled={savedViews.length === 0}
													startContent={
														selectedSavedView ? (
															<IconComponent
																icon="solar:eye-bold"
																className="w-5 h-5 text-green-600"
															/>
														) : (
															<IconComponent
																icon="solar:list-check-bold"
																className="w-5 h-5 text-gray-400"
															/>
														)
													}
													endContent={
														<IconComponent
															icon="solar:alt-arrow-down-outline"
															className="w-5 h-5"
														/>
													}
												>
													<div className="flex-1 text-left">
														<div className="font-semibold text-base">
															{selectedSavedView
																? selectedSavedView.name
																: savedViews.length === 0
																	? "No hay vistas disponibles"
																	: "Seleccionar una vista"}
														</div>
														{selectedSavedView &&
															selectedSavedView.description && (
																<div className="text-xs text-gray-500 mt-0.5 font-normal">
																	{selectedSavedView.description}
																</div>
															)}
													</div>
												</Button>
											</DropdownTrigger>
											{savedViews.length > 0 && (
												<DropdownMenu
													aria-label="Seleccionar vista guardada"
													selectionMode="single"
													selectedKeys={
														selectedSavedView?.id
															? new Set([selectedSavedView.id])
															: new Set()
													}
													onSelectionChange={(keys) => {
														const selectedId = Array.from(keys)[0] as string;
														const view = savedViews.find(
															(v) => v.id === selectedId
														);
														if (view) {
															setSelectedSavedView(view);
														}
													}}
													className="max-w-md"
												>
													{savedViews.map((view) => (
														<DropdownItem
															key={view.id || ""}
															description={view.description}
															startContent={
																<IconComponent
																	icon="solar:eye-bold"
																	className="w-5 h-5 text-green-600 flex-shrink-0"
																/>
															}
															endContent={
																view.isDefault ? (
																	<Chip
																		size="sm"
																		color="success"
																		variant="flat"
																	>
																		Por defecto
																	</Chip>
																) : null
															}
															className="py-3"
														>
															<span className="font-medium">{view.name}</span>
														</DropdownItem>
													))}
												</DropdownMenu>
											)}
										</Dropdown>
									</div>

									{/* Show selected view details */}
									{selectedSavedView ? (
										<div className="p-4 border-2 border-primary-500 bg-primary-50 rounded-lg">
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center gap-2">
													<IconComponent
														icon="solar:eye-bold"
														className="w-5 h-5 text-green-600"
													/>
													<h5 className="font-semibold text-gray-900">
														{selectedSavedView.name}
													</h5>
													{selectedSavedView.isDefault && (
														<Chip size="sm" color="success" variant="flat">
															Por defecto
														</Chip>
													)}
												</div>
												<button
													type="button"
													onClick={() => setSelectedSavedView(null)}
													className="text-gray-400 hover:text-red-600 transition-colors"
												>
													<IconComponent
														icon="solar:close-circle-bold"
														className="w-5 h-5"
													/>
												</button>
											</div>
											{selectedSavedView.description && (
												<p className="text-sm text-gray-600 mb-2">
													{selectedSavedView.description}
												</p>
											)}
											<div className="flex items-center gap-2 text-xs text-gray-500">
												<IconComponent
													icon="solar:filter-bold"
													className="w-4 h-4"
												/>
												<span>
													Vista configurada con filtros personalizados
												</span>
											</div>
											<div className="mt-3 pt-3 border-t border-primary-200">
												<div className="flex items-center justify-between text-sm">
													<span className="text-gray-600">
														Alcance estimado:
													</span>
													<span className="font-semibold text-primary-600">
														{Math.floor(Math.random() * 2000) + 500} clientes
													</span>
												</div>
											</div>
										</div>
									) : savedViews.length === 0 ? (
										<div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
											<IconComponent
												icon="solar:eye-bold"
												className="w-12 h-12 text-green-600 mx-auto mb-3"
											/>
											<h5 className="font-semibold text-gray-900 mb-2">
												No hay vistas guardadas
											</h5>
											<p className="text-sm text-gray-600 mb-3">
												Aún no tienes vistas guardadas. Crea vistas
												personalizadas en la sección de Contactos para usarlas
												en tus campañas.
											</p>
											<Button
												color="success"
												size="sm"
												startContent={
													<IconComponent icon="solar:add-circle-bold" />
												}
												onClick={() => navigate("/clients")}
											>
												Ir a Contactos
											</Button>
										</div>
									) : null}
								</div>
							)}

							{/* Custom Segmentation */}
							{segmentType === "custom" && (
								<div className="space-y-4">
									{/* Header & Instructions */}
									<div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
										<div className="flex items-start gap-3">
											<IconComponent
												icon="solar:settings-bold"
												className="w-5 h-5 text-purple-600 mt-0.5"
											/>
											<div>
												<h5 className="font-semibold text-gray-900 mb-1">
													Segmentación Personalizada
												</h5>
												<p className="text-xs text-gray-600">
													Selecciona uno o varios filtros y combínalos con
													operadores lógicos (Y / O).
												</p>
											</div>
										</div>
									</div>

									{/* Filter Blocks */}
									<div className="space-y-6">
										{customFilters.map((filter, filterIndex) => (
											<div key={filter.id}>
												{/* Operator connector between filters - Only show if both filters have type */}
												{filterIndex > 0 &&
													customFilters[filterIndex - 1].type && (
														<div className="flex justify-center -mb-2 -mt-2 z-10 relative">
															<div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
																<span className="text-xs text-blue-600">
																	Combinar con
																</span>
																<div className="flex gap-1">
																	<button
																		type="button"
																		onClick={() =>
																			updateFilterOperator(
																				customFilters[filterIndex - 1].id,
																				"Y"
																			)
																		}
																		className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
																			customFilters[filterIndex - 1]
																				.operator === "Y"
																				? "bg-blue-600 text-white"
																				: "bg-white text-blue-600 hover:bg-blue-50 border border-blue-300"
																		}`}
																	>
																		Y
																	</button>
																	<button
																		type="button"
																		onClick={() =>
																			updateFilterOperator(
																				customFilters[filterIndex - 1].id,
																				"O"
																			)
																		}
																		className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
																			customFilters[filterIndex - 1]
																				.operator === "O"
																				? "bg-blue-600 text-white"
																				: "bg-white text-blue-600 hover:bg-blue-50 border border-blue-300"
																		}`}
																	>
																		O
																	</button>
																</div>
															</div>
														</div>
													)}

												{/* Filter Block */}
												<div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
													<div className="flex items-start gap-3">
														{/* Filter Type Selector */}
														<div className="flex-1 space-y-3">
															{/* Dropdown para tipo de filtro */}
															<div>
																<label className="block text-xs font-medium text-gray-700 mb-2">
																	Tipo de filtro
																</label>
																<Dropdown>
																	<DropdownTrigger>
																		<Button
																			variant="bordered"
																			className="w-full justify-between"
																			endContent={
																				<IconComponent
																					icon="solar:alt-arrow-down-bold"
																					className="w-4 h-4"
																				/>
																			}
																		>
																			{filter.type
																				? filterTypesOptions.find(
																						(opt) => opt.value === filter.type
																					)?.label
																				: "Selecciona un filtro"}
																		</Button>
																	</DropdownTrigger>
																	<DropdownMenu
																		aria-label="Tipos de filtro"
																		onAction={(key) =>
																			updateFilterType(
																				filter.id,
																				key as CustomFilter["type"]
																			)
																		}
																	>
																		{filterTypesOptions.map((option) => (
																			<DropdownItem
																				key={option.value}
																				startContent={
																					<IconComponent
																						icon={option.icon}
																						className="w-4 h-4"
																					/>
																				}
																			>
																				{option.label}
																			</DropdownItem>
																		))}
																	</DropdownMenu>
																</Dropdown>
															</div>

															{/* Filter Options based on type */}
															{filter.type && (
																<div className="space-y-2">
																	<label className="block text-xs font-medium text-gray-700">
																		Selecciona opciones
																	</label>

																	{/* Status options */}
																	{filter.type === "status" && (
																		<div className="space-y-2 max-h-[250px] overflow-y-auto">
																			{Object.entries(STATUS_CLIENT).map(
																				([key, config], index) => {
																					const status =
																						key as EnumClientStatus;
																					const isSelected =
																						filter.values.includes(status);
																					const valueIndex =
																						filter.values.indexOf(status);
																					// Show logic selector if this option is selected and it's not the last selected one
																					const showLogic =
																						isSelected &&
																						filter.values.length > 0 &&
																						valueIndex ===
																							filter.values.length - 1;
																					// Use a placeholder key for the logic when there's no next value yet
																					const nextKey = `pending_${status}`;
																					const currentLogic =
																						filter.valueLogic[nextKey] || "O";

																					return (
																						<div
																							key={status}
																							className="space-y-1"
																						>
																							<div
																								className={`${
																									BACKGROUND_COLOR_MAP[
																										config.color
																									] || "bg-default-50"
																								} py-2 px-3 rounded-lg transition-all cursor-pointer hover:opacity-80 ${
																									isSelected
																										? "ring-2 ring-primary-500"
																										: ""
																								}`}
																							>
																								<Checkbox
																									isSelected={isSelected}
																									onValueChange={() => {
																										const newValues = isSelected
																											? filter.values.filter(
																													(v: any) =>
																														v !== status
																												)
																											: [
																													...filter.values,
																													status,
																												];
																										updateFilterValues(
																											filter.id,
																											newValues
																										);
																									}}
																									size="sm"
																									color="primary"
																								>
																									<span className="text-xs font-medium">
																										{t(
																											config.translationKey,
																											status
																										)}
																									</span>
																								</Checkbox>
																							</div>

																							{/* Logic selector between values */}
																							{showLogic && (
																								<div className="flex items-center justify-center py-1">
																									<div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
																										<span className="text-xs text-blue-600 font-medium">
																											Combinar con siguiente:
																										</span>
																										<button
																											type="button"
																											onClick={() =>
																												updateValueLogic(
																													filter.id,
																													nextKey,
																													"Y"
																												)
																											}
																											className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
																												currentLogic === "Y"
																													? "bg-blue-600 text-white shadow-sm"
																													: "text-blue-600 hover:bg-blue-100"
																											}`}
																										>
																											Y
																										</button>
																										<button
																											type="button"
																											onClick={() =>
																												updateValueLogic(
																													filter.id,
																													nextKey,
																													"O"
																												)
																											}
																											className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
																												currentLogic === "O"
																													? "bg-blue-600 text-white shadow-sm"
																													: "text-blue-600 hover:bg-blue-100"
																											}`}
																										>
																											O
																										</button>
																									</div>
																								</div>
																							)}
																						</div>
																					);
																				}
																			)}
																		</div>
																	)}

																	{/* Tag options */}
																	{filter.type === "tag" && (
																		<div className="space-y-2">
																			<SearchInput
																				placeholder="Buscar etiquetas..."
																				value={tagSearchQuery}
																				onValueChange={setTagSearchQuery}
																				size="sm"
																			/>
																			<div className="space-y-2 max-h-[250px] overflow-y-auto">
																				{filteredAiTags.map((tag) => {
																					const isSelected =
																						filter.values.includes(tag);
																					const valueIndex =
																						filter.values.indexOf(tag);
																					// Show logic selector if this option is selected and it's the last selected one
																					const showLogic =
																						isSelected &&
																						filter.values.length > 0 &&
																						valueIndex ===
																							filter.values.length - 1;
																					// Use a placeholder key for the logic when there's no next value yet
																					const nextKey = `pending_${tag}`;
																					const currentLogic =
																						filter.valueLogic[nextKey] || "O";

																					return (
																						<div
																							key={tag}
																							className="space-y-1"
																						>
																							<div
																								className={`bg-secondary-50 py-2 px-3 rounded-lg transition-all cursor-pointer hover:bg-secondary-100 ${
																									isSelected
																										? "ring-2 ring-secondary-500"
																										: ""
																								}`}
																							>
																								<Checkbox
																									isSelected={isSelected}
																									onValueChange={() => {
																										const newValues = isSelected
																											? filter.values.filter(
																													(v: any) => v !== tag
																												)
																											: [...filter.values, tag];
																										updateFilterValues(
																											filter.id,
																											newValues
																										);
																									}}
																									size="sm"
																									color="secondary"
																								>
																									<span className="text-xs font-medium">
																										{tag}
																									</span>
																								</Checkbox>
																							</div>

																							{/* Logic selector between values */}
																							{showLogic && (
																								<div className="flex items-center justify-center py-1">
																									<div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
																										<span className="text-xs text-blue-600 font-medium">
																											Combinar con siguiente:
																										</span>
																										<button
																											type="button"
																											onClick={() =>
																												updateValueLogic(
																													filter.id,
																													nextKey,
																													"Y"
																												)
																											}
																											className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
																												currentLogic === "Y"
																													? "bg-blue-600 text-white shadow-sm"
																													: "text-blue-600 hover:bg-blue-100"
																											}`}
																										>
																											Y
																										</button>
																										<button
																											type="button"
																											onClick={() =>
																												updateValueLogic(
																													filter.id,
																													nextKey,
																													"O"
																												)
																											}
																											className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
																												currentLogic === "O"
																													? "bg-blue-600 text-white shadow-sm"
																													: "text-blue-600 hover:bg-blue-100"
																											}`}
																										>
																											O
																										</button>
																									</div>
																								</div>
																							)}
																						</div>
																					);
																				})}
																			</div>
																		</div>
																	)}

																	{/* Potential options */}
																	{filter.type === "potential" && (
																		<div className="space-y-2 max-h-[250px] overflow-y-auto">
																			{Object.entries(PROSPECTIVE_CLIENT).map(
																				([key, config]) => {
																					const potential =
																						key as EnumPotentialClient;
																					const isSelected =
																						filter.values.includes(potential);
																					const valueIndex =
																						filter.values.indexOf(potential);
																					// Show logic selector if this option is selected and it's the last selected one
																					const showLogic =
																						isSelected &&
																						filter.values.length > 0 &&
																						valueIndex ===
																							filter.values.length - 1;
																					// Use a placeholder key for the logic when there's no next value yet
																					const nextKey = `pending_${potential}`;
																					const currentLogic =
																						filter.valueLogic[nextKey] || "O";

																					return (
																						<div
																							key={potential}
																							className="space-y-1"
																						>
																							<div
																								className={`${
																									BACKGROUND_COLOR_MAP[
																										config.color
																									] || "bg-default-50"
																								} py-2 px-3 rounded-lg transition-all cursor-pointer hover:opacity-80 ${
																									isSelected
																										? "ring-2 ring-warning-500"
																										: ""
																								}`}
																							>
																								<Checkbox
																									isSelected={isSelected}
																									onValueChange={() => {
																										const newValues = isSelected
																											? filter.values.filter(
																													(v: any) =>
																														v !== potential
																												)
																											: [
																													...filter.values,
																													potential,
																												];
																										updateFilterValues(
																											filter.id,
																											newValues
																										);
																									}}
																									size="sm"
																									color="warning"
																								>
																									<span className="text-xs font-medium">
																										{t(
																											config.translationKey,
																											potential
																										)}
																									</span>
																								</Checkbox>
																							</div>

																							{/* Logic selector between values */}
																							{showLogic && (
																								<div className="flex items-center justify-center py-1">
																									<div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
																										<span className="text-xs text-blue-600 font-medium">
																											Combinar con siguiente:
																										</span>
																										<button
																											type="button"
																											onClick={() =>
																												updateValueLogic(
																													filter.id,
																													nextKey,
																													"Y"
																												)
																											}
																											className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
																												currentLogic === "Y"
																													? "bg-blue-600 text-white shadow-sm"
																													: "text-blue-600 hover:bg-blue-100"
																											}`}
																										>
																											Y
																										</button>
																										<button
																											type="button"
																											onClick={() =>
																												updateValueLogic(
																													filter.id,
																													nextKey,
																													"O"
																												)
																											}
																											className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
																												currentLogic === "O"
																													? "bg-blue-600 text-white shadow-sm"
																													: "text-blue-600 hover:bg-blue-100"
																											}`}
																										>
																											O
																										</button>
																									</div>
																								</div>
																							)}
																						</div>
																					);
																				}
																			)}
																		</div>
																	)}

																	{/* Date options */}
																	{filter.type === "date" && (
																		<div className="space-y-3">
																			<div className="p-3 bg-gray-50 rounded-lg">
																				<DateSelector
																					initialType="singleDay"
																					className="flex flex-col !gap-2 !items-start"
																					onChange={(value) => {
																						// Store date value in filter
																						updateFilterValues(filter.id, [
																							value,
																						]);
																					}}
																				/>
																			</div>
																		</div>
																	)}
																	{/* Selected count */}
																	{filter.values.length > 0 && (
																		<div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
																			<p className="text-xs font-medium text-blue-900">
																				{filter.values.length} opción(es)
																				seleccionada(s)
																			</p>
																		</div>
																	)}
																</div>
															)}
														</div>

														{/* Remove button */}
														{customFilters.length > 1 && (
															<button
																type="button"
																onClick={() => removeFilter(filter.id)}
																className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
																title="Eliminar filtro"
															>
																<IconComponent
																	icon="solar:trash-bin-trash-bold"
																	className="w-5 h-5"
																/>
															</button>
														)}
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Add Filter Button */}
									<Button
										variant="bordered"
										color="primary"
										startContent={
											<IconComponent
												icon="solar:add-circle-bold"
												className="w-5 h-5"
											/>
										}
										onPress={addFilter}
										className="w-full"
									>
										Agregar otro filtro
									</Button>

									{/* Summary */}
									{customFilters.some((f) => f.values.length > 0) && (
										<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
											<div className="flex items-start gap-3">
												<IconComponent
													icon="solar:check-circle-bold"
													className="w-5 h-5 text-green-600 mt-0.5"
												/>
												<div className="flex-1">
													<h6 className="text-sm font-semibold text-gray-900 mb-1">
														Resumen de Segmentación
													</h6>
													<div className="text-xs text-gray-700 space-y-1">
														{customFilters.map((filter, idx) => {
															if (!filter.type || filter.values.length === 0)
																return null;
															const filterLabel = filterTypesOptions.find(
																(opt) => opt.value === filter.type
															)?.label;
															const showOperator =
																idx > 0 &&
																customFilters[idx - 1].values.length > 0;
															return (
																<div
																	key={filter.id}
																	className="flex items-center gap-2 flex-wrap"
																>
																	{showOperator && (
																		<span className="font-bold text-purple-600 px-2 py-0.5 bg-purple-100 rounded">
																			{customFilters[idx - 1].operator}
																		</span>
																	)}
																	<span>
																		<strong>{filterLabel}:</strong>{" "}
																		{filter.values.length} seleccionado(s)
																	</span>
																</div>
															);
														})}
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>

						<div className="flex justify-between space-x-3 pt-4">
							<Button variant="light" size="md" onPress={handleBack}>
								Atrás
							</Button>
							<Button
								color="primary"
								variant="solid"
								size="md"
								onPress={handleNext}
							>
								Siguiente
							</Button>
						</div>
					</div>
				)}

				{/* Step 3: Review & Confirm */}
				{currentStep === 3 && (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<H4>Revisión Final</H4>
						</div>

						<div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-6">
							{/* Channel Selection */}
							<div>
								<h5 className="font-semibold text-gray-900 mb-3">
									Canales de Envío
								</h5>
								<div className="bg-white rounded-lg p-4 border border-gray-200">
									<div className="flex gap-3">
										{selectedChannels.whatsapp && (
											<div className="flex items-center gap-2 bg-success-50 border border-success-200 rounded-lg px-4 py-2">
												<IconComponent
													icon="logos:whatsapp-icon"
													className="w-5 h-5"
												/>
												<span className="font-medium text-success-900">
													WhatsApp
												</span>
											</div>
										)}
										{selectedChannels.email && (
											<div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
												<IconComponent
													icon="solar:letter-bold"
													className="w-5 h-5 text-primary"
												/>
												<span className="font-medium text-primary-900">
													Email
												</span>
											</div>
										)}
									</div>
									{selectedChannels.whatsapp && selectedChannels.email && (
										<p className="text-xs text-gray-600 mt-2">
											💡 Tu campaña se enviará por ambos canales para maximizar
											el alcance
										</p>
									)}
								</div>
							</div>

							{/* Content Preview */}
							<div>
								<h5 className="font-semibold text-gray-900 mb-3">
									Vista Previa del Mensaje
								</h5>
								<div className="bg-white rounded-lg p-4 border border-gray-200">
									{generatedImage && includeImage && (
										<Image
											src={generatedImage}
											alt="Preview"
											className="w-full max-w-[300px] h-[200px] object-cover rounded-lg mb-3"
										/>
									)}
									<p className="text-sm text-gray-800 whitespace-pre-wrap">
										{generatedText}
									</p>
								</div>
							</div>

							{/* Segment Info */}
							<div>
								<h5 className="font-semibold text-gray-900 mb-3">Audiencia</h5>
								<div className="bg-white rounded-lg p-4 border border-gray-200">
									<div className="flex justify-between items-center">
										<div>
											<p className="font-medium text-gray-900">
												{getSegmentData().name}
											</p>
											<p className="text-sm text-gray-600">
												{getSegmentData().description}
											</p>
										</div>
										<div className="text-right">
											<p className="text-xl font-bold text-primary-600">
												{getSegmentData().estimatedReach}
											</p>
											<p className="text-xs text-gray-600">destinatarios</p>
										</div>
									</div>
								</div>
							</div>

							{/* Campaign Stats */}
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
									<IconComponent
										icon="solar:eye-bold"
										className="w-6 h-6 text-blue-600 mx-auto mb-2"
									/>
									<p className="text-2xl font-bold text-gray-900">
										{getSegmentData().expectedVisibility}%
									</p>
									<p className="text-xs text-gray-600">Visibilidad esperada</p>
								</div>
								<div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
									<IconComponent
										icon="solar:chat-round-bold"
										className="w-6 h-6 text-green-600 mx-auto mb-2"
									/>
									<p className="text-2xl font-bold text-gray-900">
										{Math.floor(
											getSegmentData().estimatedReach *
												(getSegmentData().expectedVisibility / 100)
										)}
									</p>
									<p className="text-xs text-gray-600">Alcance estimado</p>
								</div>
							</div>
						</div>

						{/* Scheduling Section */}
						<div className="bg-white rounded-lg border border-gray-200 p-4">
							<h5 className="font-semibold text-gray-900 text-sm mb-3">
								Programación de envío
							</h5>

							<div className="space-y-2">
								{/* Send Now Option */}
								<div
									onClick={() => setScheduleType("now")}
									className={`p-3 rounded-lg border cursor-pointer transition-all ${
										scheduleType === "now"
											? "border-primary-500 bg-primary-50"
											: "border-gray-200 hover:border-primary-200"
									}`}
								>
									<div className="flex items-center gap-2">
										<div
											className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
												scheduleType === "now"
													? "border-primary-500 bg-primary-500"
													: "border-gray-300"
											}`}
										>
											{scheduleType === "now" && (
												<div className="w-1.5 h-1.5 rounded-full bg-white" />
											)}
										</div>
										<p
											className={`text-sm font-medium ${scheduleType === "now" ? "text-primary-900" : "text-gray-900"}`}
										>
											Enviar ahora
										</p>
									</div>
								</div>

								{/* Schedule Option */}
								<div
									onClick={() => setScheduleType("scheduled")}
									className={`p-3 rounded-lg border cursor-pointer transition-all ${
										scheduleType === "scheduled"
											? "border-primary-500 bg-primary-50"
											: "border-gray-200 hover:border-primary-200"
									}`}
								>
									<div className="flex items-start gap-2">
										<div
											className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
												scheduleType === "scheduled"
													? "border-primary-500 bg-primary-500"
													: "border-gray-300"
											}`}
										>
											{scheduleType === "scheduled" && (
												<div className="w-1.5 h-1.5 rounded-full bg-white" />
											)}
										</div>
										<div className="flex-1">
											<p
												className={`text-sm font-medium ${scheduleType === "scheduled" ? "text-primary-900" : "text-gray-900"}`}
											>
												Programar envío
											</p>

											{scheduleType === "scheduled" && (
												<div className="mt-2">
													<input
														type="date"
														value={scheduledDate || ""}
														onChange={(e) => setScheduledDate(e.target.value)}
														className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
													/>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							{scheduleType === "scheduled" && scheduledDate && (
								<div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
									<div className="flex items-center gap-2">
										<IconComponent
											icon="solar:calendar-mark-bold"
											className="text-blue-600 w-4 h-4"
										/>
										<p className="text-xs font-medium text-blue-900">
											{new Date(scheduledDate).toLocaleDateString("es-ES", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="flex justify-between space-x-3 pt-4">
							<Button variant="light" size="md" onPress={handleBack}>
								Atrás
							</Button>
							<Button
								color="primary"
								variant="solid"
								size="md"
								onPress={handleCreateCampaign}
								disabled={scheduleType === "scheduled" && !scheduledDate}
								endContent={<IconComponent icon="solar:rocket-bold" />}
							>
								{scheduleType === "now"
									? "Lanzar Campaña"
									: "Programar Campaña"}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export { WhatsAppCampaignFullPage };
