import {
	Button,
	Checkbox,
	Chip,
	H2,
	H4,
	IconComponent,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
	Select,
	SelectItem,
	Textarea,
} from "@beweco/aurora-ui";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import { BACKGROUND_COLOR_MAP } from "@shared/utils/status-colors.utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useState } from "react";

interface WhatsAppCampaignModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateCampaign: (campaignData: CampaignData) => void;
	onSaveCampaign: (campaignData: CampaignData) => void;
}

interface CampaignData {
	intention: string;
	imageUrl?: string;
	text: string;
	segment: SegmentData;
	includeImage: boolean;
	cta?: {
		type: string;
		value: string;
	};
}

interface SegmentData {
	type: "intelligent" | "all" | "custom";
	name?: string;
	description?: string;
	aiTags?: string[];
	clientStatuses?: EnumClientStatus[];
	estimatedReach: number;
	expectedVisibility: number;
}

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

// WhatsApp CTA types
const whatsappCtaTypes = [
	{ key: "CALL_NOW", label: "Llamar ahora", requiresPhone: true },
	{ key: "VISIT_WEBSITE", label: "Visitar sitio web", requiresPhone: false },
	{ key: "LEARN_MORE", label: "Más información", requiresPhone: false },
	{ key: "SHOP_NOW", label: "Comprar ahora", requiresPhone: false },
	{ key: "BOOK_NOW", label: "Reservar ahora", requiresPhone: false },
	{ key: "GET_QUOTE", label: "Solicitar presupuesto", requiresPhone: false },
	{ key: "SIGN_UP", label: "Registrarse", requiresPhone: false },
	{ key: "CONTACT_US", label: "Contáctanos", requiresPhone: false },
];

export function WhatsAppCampaignModal({
	isOpen,
	onClose,
	onCreateCampaign,
	onSaveCampaign,
}: WhatsAppCampaignModalProps) {
	const { t } = useTranslate();
	const [intention, setIntention] = useState("");
	const [generatedImage, setGeneratedImage] = useState<string>("");
	const [generatedText, setGeneratedText] = useState<string>("");
	const [includeImage, setIncludeImage] = useState(true);
	const [editImagePrompt, setEditImagePrompt] = useState("");
	const [editTextPrompt, setEditTextPrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showEditImageSection, setShowEditImageSection] = useState(false);
	const [showEditTextSection, setShowEditTextSection] = useState(false);

	// CTA states
	const [ctaType, setCtaType] = useState<string>("");
	const [ctaValue, setCtaValue] = useState<string>("");

	// Step state
	const [currentStep, setCurrentStep] = useState(0);

	// Segmentation states
	const [segmentType, setSegmentType] = useState<
		"intelligent" | "all" | "custom"
	>("intelligent");
	const [selectedIntelligentSegment, setSelectedIntelligentSegment] =
		useState(0);
	const [selectedAiTags, setSelectedAiTags] = useState<string[]>([]);
	const [selectedClientStatuses, setSelectedClientStatuses] = useState<
		EnumClientStatus[]
	>([]);

	// Step validation states
	const [step1Valid, setStep1Valid] = useState(false);
	const [step2Valid, setStep2Valid] = useState(false);
	const [step3Valid] = useState(true); // Segmentation always valid

	// Validate step 1 when intention changes
	useEffect(() => {
		setStep1Valid(intention.trim().length > 0);
	}, [intention]);

	// Validate step 2 when text changes
	useEffect(() => {
		setStep2Valid(generatedText.trim().length > 0);
	}, [generatedText]);

	const handleGenerateContent = useCallback(async () => {
		if (!intention.trim()) return;

		setIsGenerating(true);

		// Simulate AI generation delay
		await new Promise((resolve) => setTimeout(resolve, 3500));

		// Mock content generation
		if (includeImage) {
			const mockImageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
			setGeneratedImage(mockImageUrl);
		}

		const mockText = `🎯 ${intention}

¡Hola! Tenemos algo especial para ti.

${intention.toLowerCase().includes("descuento") ? "🎉 ¡Aprovecha esta oferta limitada!" : "✨ No te pierdas esta oportunidad única"}

${intention.toLowerCase().includes("producto") ? "📱 Descubre nuestros productos" : "🚀 Únete a nuestra comunidad"}

¿Te interesa saber más? ¡Responde a este mensaje!`;

		setGeneratedText(mockText);
		setIsGenerating(false);
		setStep2Valid(true);
	}, [intention, includeImage]);

	const handleEditImage = async () => {
		if (!editImagePrompt.trim()) return;

		setIsGenerating(true);
		await new Promise((resolve) => setTimeout(resolve, 2500));

		const mockEditedImageUrl = `https://picsum.photos/400/400?random=${Date.now()}&edit=true`;
		setGeneratedImage(mockEditedImageUrl);
		setIsGenerating(false);
		setEditImagePrompt("");
	};

	const handleEditText = async () => {
		if (!editTextPrompt.trim()) return;

		setIsGenerating(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Mock text editing
		const editedText = `${generatedText}\n\n✏️ Editado: ${editTextPrompt}`;
		setGeneratedText(editedText);
		setIsGenerating(false);
		setEditTextPrompt("");
	};

	const handleDiscardImage = () => {
		setGeneratedImage("");
		setEditImagePrompt("");
	};

	const getCurrentSegmentData = (): SegmentData => {
		switch (segmentType) {
			case "intelligent":
				const segment = mockIntelligentSegments[selectedIntelligentSegment];
				return {
					type: "intelligent",
					name: segment.name,
					description: segment.description,
					estimatedReach: segment.estimatedReach,
					expectedVisibility: segment.expectedVisibility,
				};
			case "all":
				return {
					type: "all",
					name: "Todos los clientes",
					description: "Todos los clientes activos en la base de datos",
					estimatedReach: 5240,
					expectedVisibility: 78,
				};
			case "custom":
				const customReach = Math.floor(Math.random() * 3000) + 500;
				const customVisibility = Math.floor(Math.random() * 30) + 60;
				return {
					type: "custom",
					name: "Segmento Personalizado",
					description: "Basado en criterios personalizados",
					aiTags: selectedAiTags,
					clientStatuses: selectedClientStatuses,
					estimatedReach: customReach,
					expectedVisibility: customVisibility,
				};
			default:
				return {
					type: "all",
					name: "Sin especificar",
					description: "",
					estimatedReach: 0,
					expectedVisibility: 0,
				};
		}
	};

	const handleClose = useCallback(() => {
		setIntention("");
		setGeneratedImage("");
		setGeneratedText("");
		setIncludeImage(true);
		setEditImagePrompt("");
		setEditTextPrompt("");
		setIsGenerating(false);
		setCurrentStep(0);
		setSegmentType("intelligent");
		setSelectedIntelligentSegment(0);
		setSelectedAiTags([]);
		setSelectedClientStatuses([]);
		setStep1Valid(false);
		setStep2Valid(false);
		setCtaType("");
		setCtaValue("");
		// Reset collapse states - always start collapsed
		setShowEditImageSection(false);
		setShowEditTextSection(false);
		onClose();
	}, [onClose]);

	const handleSubmit = useCallback(async () => {
		const campaignData: CampaignData = {
			intention,
			imageUrl: includeImage ? generatedImage : undefined,
			text: generatedText,
			segment: getCurrentSegmentData(),
			includeImage,
			cta: ctaType ? { type: ctaType, value: ctaValue } : undefined,
		};
		onCreateCampaign(campaignData);
		handleClose();
	}, [
		intention,
		includeImage,
		generatedImage,
		generatedText,
		ctaType,
		ctaValue,
		onCreateCampaign,
		handleClose,
	]);

	const steps = [
		{
			title: t("campaign_step_intention", "Intención"),
			description: t(
				"campaign_step_intention_desc",
				"Define el objetivo de tu campaña"
			),
			content: (
				<div className="flex flex-col gap-6">
					<div className="text-center">
						<H4>
							{t(
								"campaign_intention_title",
								"¿Cuál es la intención de tu campaña?"
							)}
						</H4>
						<P className="text-default-500">
							{t(
								"campaign_intention_description",
								"Describe el objetivo principal de tu campaña"
							)}
						</P>
					</div>

					<div className="bg-default-50 rounded-xl p-4">
						<Textarea
							value={intention}
							onValueChange={setIntention}
							placeholder={t(
								"campaign_intention_placeholder",
								"Ej: Promocionar descuentos de Black Friday, lanzar nuevo producto, reactivar clientes inactivos..."
							)}
							minRows={4}
							maxRows={6}
							classNames={{
								input: "bg-white",
							}}
						/>
					</div>
				</div>
			),
			isStepValid: step1Valid && step2Valid,
		},
		{
			title: t("campaign_step_content", "Contenido"),
			description: t(
				"campaign_step_content_desc",
				"Revisa y edita el contenido"
			),
			content: (
				<div className="flex flex-col gap-6">
					<div className="text-center">
						<H4>{t("campaign_review_title", "Revisa y edita tu contenido")}</H4>
						<P className="text-default-500">
							{t(
								"campaign_review_description",
								"Puedes editar el contenido antes de enviarlo"
							)}
						</P>
					</div>

					<div className="bg-white rounded-xl border-2 border-default-200 p-6 shadow-sm space-y-6">
						{/* Image Section */}
						{includeImage && (
							<div>
								<div className="flex justify-between items-center mb-3">
									<H4 className="text-default-700">
										{t("campaign_image", "Imagen")}
									</H4>
									{generatedImage && (
										<Button
											size="sm"
											color="danger"
											variant="light"
											onPress={handleDiscardImage}
											startContent={
												<IconComponent
													icon="solar:trash-bin-trash-bold"
													className="w-4 h-4"
												/>
											}
										>
											{t("discard_image", "Descartar imagen")}
										</Button>
									)}
								</div>

								{generatedImage ? (
									<div className="space-y-3">
										<div className="flex justify-center">
											<Image
												src={generatedImage}
												alt="Imagen de campaña"
												className="w-80 h-80 object-cover rounded-lg"
											/>
										</div>

										{/* Edit Image - Collapsible */}
										<div className="bg-default-50 rounded-lg p-4">
											<div className="flex justify-between items-center mb-2">
												<P className="text-sm text-default-600">
													{t(
														"edit_image_prompt",
														"¿Quieres modificar la imagen?"
													)}
												</P>
												<Button
													size="sm"
													variant="light"
													onPress={() =>
														setShowEditImageSection(!showEditImageSection)
													}
													startContent={
														<IconComponent
															icon={
																showEditImageSection
																	? "solar:alt-arrow-up-bold"
																	: "solar:alt-arrow-down-bold"
															}
															className="w-4 h-4"
														/>
													}
												>
													{showEditImageSection
														? t("hide", "Ocultar")
														: t("show", "Mostrar")}
												</Button>
											</div>

											{showEditImageSection && (
												<div className="flex gap-2 items-center mt-3">
													<Textarea
														value={editImagePrompt}
														onValueChange={setEditImagePrompt}
														placeholder={t(
															"edit_image_placeholder",
															"Ej: Hazla más colorida, agrega un fondo azul..."
														)}
														minRows={2}
														maxRows={3}
														classNames={{
															input: "bg-white",
														}}
													/>
													<Button
														color="primary"
														onPress={handleEditImage}
														isDisabled={!editImagePrompt.trim() || isGenerating}
														isLoading={isGenerating}
													>
														{t("edit", "Editar")}
													</Button>
												</div>
											)}
										</div>
									</div>
								) : (
									<div className="bg-default-100 border-2 border-dashed border-default-300 rounded-lg p-8 text-center">
										<IconComponent
											icon="solar:gallery-add-bold"
											className="w-12 h-12 text-default-400 mx-auto mb-2"
										/>
										<P className="text-default-500">
											{t("no_image", "Sin imagen")}
										</P>
									</div>
								)}
							</div>
						)}

						{/* Text Section */}
						<div>
							<div className="flex justify-between items-center mb-3">
								<H4 className="text-default-700">
									{t("campaign_text", "Texto del mensaje")}
								</H4>
								<Button
									size="sm"
									color="primary"
									variant="light"
									onPress={handleGenerateContent}
									isLoading={isGenerating}
									startContent={
										<IconComponent
											icon="solar:refresh-bold"
											className="w-4 h-4"
										/>
									}
								>
									{t("regenerate", "Regenerar")}
								</Button>
							</div>

							<Textarea
								value={generatedText}
								onValueChange={setGeneratedText}
								minRows={8}
								maxRows={15}
								placeholder={t(
									"campaign_text_placeholder",
									"El texto de tu campaña aparecerá aquí..."
								)}
								classNames={{
									input: "bg-white",
								}}
							/>

							{/* Edit Text with AI - Collapsible */}
							<div className="bg-default-50 rounded-lg p-4 mt-3">
								<div className="flex justify-between items-center mb-2">
									<P className="text-sm text-default-600">
										{t(
											"edit_text_prompt",
											"¿Quieres que la IA mejore el texto?"
										)}
									</P>
									<Button
										size="sm"
										variant="light"
										onPress={() => setShowEditTextSection(!showEditTextSection)}
										startContent={
											<IconComponent
												icon={
													showEditTextSection
														? "solar:alt-arrow-up-bold"
														: "solar:alt-arrow-down-bold"
												}
												className="w-4 h-4"
											/>
										}
									>
										{showEditTextSection
											? t("hide", "Ocultar")
											: t("show", "Mostrar")}
									</Button>
								</div>

								{showEditTextSection && (
									<div className="flex gap-2 items-center mt-3">
										<Textarea
											value={editTextPrompt}
											onValueChange={setEditTextPrompt}
											placeholder={t(
												"edit_text_placeholder",
												"Ej: Hazlo más corto, agrega emojis, hazlo más formal..."
											)}
											minRows={2}
											maxRows={3}
											classNames={{
												input: "bg-white",
											}}
										/>
										<Button
											color="primary"
											onPress={handleEditText}
											isDisabled={!editTextPrompt.trim() || isGenerating}
											isLoading={isGenerating}
										>
											{t("edit", "Editar")}
										</Button>
									</div>
								)}
							</div>
						</div>

						{/* CTA Section */}
						<div className="mt-6">
							<div className="flex justify-between items-center mb-3">
								<H4 className="text-default-700">
									{t("campaign_cta", "Acción (CTA)")}
								</H4>
							</div>

							<div className="bg-default-50 rounded-lg p-4 space-y-4">
								<P className="text-sm text-default-600">
									{t(
										"campaign_cta_description",
										"Añade un botón de acción para que los usuarios puedan interactuar directamente"
									)}
								</P>

								{/* CTA Type Select */}
								<div>
									<Select
										label={t("cta_type_label", "Tipo de acción")}
										placeholder={t(
											"cta_type_placeholder",
											"Selecciona una acción"
										)}
										selectedKeys={ctaType ? [ctaType] : []}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0] as string;
											setCtaType(selected || "");
											setCtaValue("");
										}}
										classNames={{
											base: "bg-white",
										}}
									>
										{whatsappCtaTypes.map((cta) => (
											<SelectItem key={cta.key}>{cta.label}</SelectItem>
										))}
									</Select>
								</div>

								{/* CTA Value Input */}
								{ctaType && (
									<div>
										<Input
											label={
												whatsappCtaTypes.find((c) => c.key === ctaType)
													?.requiresPhone
													? t("cta_phone_label", "Número de teléfono")
													: t("cta_url_label", "URL de destino")
											}
											placeholder={
												whatsappCtaTypes.find((c) => c.key === ctaType)
													?.requiresPhone
													? t("cta_phone_placeholder", "Ej: +57 300 123 4567")
													: t(
															"cta_url_placeholder",
															"Ej: https://tusitio.com/oferta"
														)
											}
											value={ctaValue}
											onValueChange={setCtaValue}
											classNames={{
												input: "bg-white",
											}}
											startContent={
												whatsappCtaTypes.find((c) => c.key === ctaType)
													?.requiresPhone ? (
													<IconComponent
														icon="solar:phone-outline"
														className="text-default-400"
													/>
												) : (
													<IconComponent
														icon="solar:link-outline"
														className="text-default-400"
													/>
												)
											}
										/>
									</div>
								)}

								{/* CTA Preview */}
								{ctaType && ctaValue && (
									<div className="mt-3 p-3 bg-white rounded-lg border border-default-200">
										<P className="text-xs text-default-500 mb-2">
											{t("cta_preview", "Vista previa del botón:")}
										</P>
										<Button
											color="success"
											variant="solid"
											size="md"
											className="w-full"
											startContent={
												whatsappCtaTypes.find((c) => c.key === ctaType)
													?.requiresPhone ? (
													<IconComponent icon="solar:phone-bold" />
												) : (
													<IconComponent icon="solar:link-bold" />
												)
											}
										>
											{whatsappCtaTypes.find((c) => c.key === ctaType)?.label}
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			),
			isStepValid: step2Valid,
		},
		{
			title: t("campaign_step_audience", "Audiencia"),
			description: t(
				"campaign_step_audience_desc",
				"Selecciona quién recibirá la campaña"
			),
			content: (
				<div className="flex flex-col gap-6">
					<div className="text-center">
						<H4>{t("campaign_audience_title", "Selecciona tu audiencia")}</H4>
						<P className="text-default-500">
							{t(
								"campaign_audience_description",
								"Define quiénes recibirán tu campaña"
							)}
						</P>
					</div>

					{/* Segmentation Options */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Intelligent Segment */}
						<div
							className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
								segmentType === "intelligent"
									? "border-success-500 bg-success-50"
									: "border-default-200 hover:border-default-300"
							}`}
							onClick={() => setSegmentType("intelligent")}
						>
							<div className="flex items-center gap-2 mb-2">
								<Checkbox
									isSelected={segmentType === "intelligent"}
									onValueChange={() => setSegmentType("intelligent")}
									color="success"
								/>
								<H4 className="text-sm">
									{t("intelligent_segment", "Segmento Inteligente")}
								</H4>
							</div>
							<P className="text-xs text-default-500">
								{t(
									"intelligent_segment_description",
									"IA selecciona la mejor audiencia"
								)}
							</P>
						</div>

						{/* Send to All */}
						<div
							className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
								segmentType === "all"
									? "border-success-500 bg-success-50"
									: "border-default-200 hover:border-default-300"
							}`}
							onClick={() => setSegmentType("all")}
						>
							<div className="flex items-center gap-2 mb-2">
								<Checkbox
									isSelected={segmentType === "all"}
									onValueChange={() => setSegmentType("all")}
									color="success"
								/>
								<H4 className="text-sm">
									{t("send_to_all", "Enviar a Todos")}
								</H4>
							</div>
							<P className="text-xs text-default-500">
								{t("send_to_all_description", "Todos los clientes activos")}
							</P>
						</div>

						{/* Custom Segment */}
						<div
							className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
								segmentType === "custom"
									? "border-success-500 bg-success-50"
									: "border-default-200 hover:border-default-300"
							}`}
							onClick={() => setSegmentType("custom")}
						>
							<div className="flex items-center gap-2 mb-2">
								<Checkbox
									isSelected={segmentType === "custom"}
									onValueChange={() => setSegmentType("custom")}
									color="success"
								/>
								<H4 className="text-sm">
									{t("custom_segment", "Segmento Personalizado")}
								</H4>
							</div>
							<P className="text-xs text-default-500">
								{t("custom_segment_description", "Crea tu propia audiencia")}
							</P>
						</div>
					</div>

					{/* Intelligent Segment Options */}
					{segmentType === "intelligent" && (
						<div className="bg-default-50 rounded-xl p-4">
							<H4 className="mb-3">
								{t(
									"select_intelligent_segment",
									"Selecciona un segmento inteligente"
								)}
							</H4>
							<div className="flex flex-col gap-3">
								{mockIntelligentSegments.map((segment, index) => (
									<div
										key={index}
										className={`p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedIntelligentSegment === index
												? "border-success-500 bg-success-50"
												: "border-default-200 hover:border-default-300"
										}`}
										onClick={() => setSelectedIntelligentSegment(index)}
									>
										<div className="flex items-center justify-between">
											<div>
												<H4 className="text-sm">{segment.name}</H4>
												<P className="text-xs text-default-500">
													{segment.description}
												</P>
											</div>
											<div className="text-right text-sm">
												<div className="font-medium">
													{segment.estimatedReach.toLocaleString()} clientes
												</div>
												<div className="text-success-600">
													{segment.expectedVisibility}% visibilidad
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Custom Segment Options */}
					{segmentType === "custom" && (
						<div className="bg-default-50 rounded-xl p-4 space-y-4">
							<div>
								<H4 className="text-sm mb-3">
									{t("client_status", "Estado del Cliente")}
								</H4>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
									{Object.entries(STATUS_CLIENT).map(([key, config]) => {
										const status = key as EnumClientStatus;
										const isSelected = selectedClientStatuses.includes(status);

										return (
											<div
												key={status}
												className={`${
													BACKGROUND_COLOR_MAP[config.color] || "bg-default-50"
												} py-3 px-4 rounded-2xl flex items-center gap-2 cursor-pointer`}
												onClick={() => {
													if (isSelected) {
														setSelectedClientStatuses(
															selectedClientStatuses.filter((s) => s !== status)
														);
													} else {
														setSelectedClientStatuses([
															...selectedClientStatuses,
															status,
														]);
													}
												}}
											>
												<Checkbox
													isSelected={isSelected}
													size="sm"
													color="primary"
													classNames={{
														wrapper: "flex-shrink-0 bg-default-50",
														label:
															"text-tiny text-default-600 font-normal leading-tight w-full",
													}}
												>
													{t(config.translationKey, status)}
												</Checkbox>
											</div>
										);
									})}
								</div>
							</div>

							<div>
								<H4 className="text-sm mb-3">{t("ai_tags", "Etiquetas AI")}</H4>
								<div className="flex flex-wrap gap-2">
									{mockAiTags.map((tag) => (
										<Chip
											key={tag}
											variant={
												selectedAiTags.includes(tag) ? "solid" : "bordered"
											}
											color={
												selectedAiTags.includes(tag) ? "primary" : "default"
											}
											onClose={
												selectedAiTags.includes(tag)
													? () => {
															setSelectedAiTags(
																selectedAiTags.filter((t) => t !== tag)
															);
														}
													: undefined
											}
											onClick={() => {
												if (!selectedAiTags.includes(tag)) {
													setSelectedAiTags([...selectedAiTags, tag]);
												}
											}}
											className="cursor-pointer"
										>
											{tag}
										</Chip>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Campaign Metrics */}
					<div className="bg-primary-50 rounded-xl p-4">
						<H4 className="text-primary-900 mb-3">
							{t("campaign_metrics", "Métricas de la Campaña")}
						</H4>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<P className="text-sm text-primary-700">
									{t("will_receive", "Clientes que recibirán")}
								</P>
								<div className="text-2xl font-bold text-primary-900">
									{getCurrentSegmentData().estimatedReach.toLocaleString()}
								</div>
							</div>
							<div>
								<P className="text-sm text-primary-700">
									{t("expected_visibility", "Visibilidad esperada")}
								</P>
								<div className="text-2xl font-bold text-primary-900">
									{getCurrentSegmentData().expectedVisibility}%
								</div>
							</div>
						</div>
					</div>
				</div>
			),
			isStepValid: step3Valid,
		},
		{
			title: t("campaign_step_summary", "Resumen"),
			description: t("campaign_step_summary_desc", "Confirma la información"),
			content: (
				<div className="flex flex-col gap-6">
					<div className="text-center">
						<H2>{t("campaign_summary_title", "Resumen de la Campaña")}</H2>
						<P className="text-default-500">
							{t(
								"campaign_summary_description",
								"Revisa la información antes de crear la campaña"
							)}
						</P>
					</div>

					{/* Intention Section */}
					<div className="bg-default-50 rounded-xl p-4">
						<H4 className="mb-3">
							{t("campaign_intention", "Intención de la campaña")}
						</H4>
						<P className="text-sm">{intention}</P>
					</div>

					{/* Content Section */}
					<div className="bg-default-50 rounded-xl p-4">
						<H4 className="mb-3">{t("campaign_content", "Contenido")}</H4>

						<div className="flex flex-col lg:flex-row gap-3">
							{/* Image */}
							{includeImage && generatedImage && (
								<div className="lg:w-1/2">
									<P className="text-xs text-default-500 mb-2">
										{t("image", "Imagen")}
									</P>
									<Image
										src={generatedImage}
										alt="Preview"
										className="w-full h-48 object-cover rounded-lg"
									/>
								</div>
							)}

							{/* Text */}
							<div
								className={
									includeImage && generatedImage ? "lg:w-1/2" : "w-full"
								}
							>
								<P className="text-xs text-default-500 mb-2">
									{t("text", "Texto")}
								</P>
								<div className="bg-white border border-default-200 rounded-lg p-4">
									<P className="text-sm whitespace-pre-wrap leading-relaxed">
										{generatedText}
									</P>
								</div>
							</div>
						</div>

						{/* CTA Summary */}
						{ctaType && ctaValue && (
							<div className="mt-3">
								<P className="text-xs text-default-500 mb-2">
									{t("cta", "Acción")}
								</P>
								<div className="bg-white border border-default-200 rounded-lg p-3">
									<div className="flex items-center gap-2">
										<Chip size="sm" color="success" variant="flat">
											{whatsappCtaTypes.find((c) => c.key === ctaType)?.label}
										</Chip>
										<P className="text-xs text-default-600">{ctaValue}</P>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Segmentation Section */}
					<div className="bg-default-50 rounded-xl p-4">
						<H4 className="mb-3">
							{t("campaign_segmentation", "Segmentación")}
						</H4>

						<div className="flex flex-col gap-2">
							{/* Segment Type */}
							<div className="flex justify-between items-center">
								<P className="text-tiny">
									{t("segment_type", "Tipo de segmento")}
								</P>
								<H4 className="text-tiny">{getCurrentSegmentData().name}</H4>
							</div>

							{/* Description */}
							<div className="flex justify-between items-center">
								<P className="text-tiny">{t("description", "Descripción")}</P>
								<H4 className="text-tiny">
									{getCurrentSegmentData().description}
								</H4>
							</div>

							{/* Custom Segment Details */}
							{segmentType === "custom" && (
								<>
									{selectedAiTags.length > 0 && (
										<div className="flex justify-between items-center gap-2">
											<P className="text-tiny">
												{t("ai_tags", "Etiquetas IA")}
											</P>
											<div className="flex flex-wrap gap-2 justify-end">
												{selectedAiTags.map((tag) => (
													<Chip
														key={tag}
														size="sm"
														color="primary"
														variant="flat"
													>
														{tag}
													</Chip>
												))}
											</div>
										</div>
									)}
									{selectedClientStatuses.length > 0 && (
										<div className="flex justify-between items-center gap-2">
											<P className="text-tiny">
												{t("client_status", "Estado del cliente")}
											</P>
											<div className="flex flex-wrap gap-2 justify-end">
												{selectedClientStatuses.map((status) => (
													<Chip
														key={status}
														size="sm"
														color="primary"
														variant="flat"
													>
														{t(STATUS_CLIENT[status].translationKey, status)}
													</Chip>
												))}
											</div>
										</div>
									)}
								</>
							)}
						</div>
					</div>

					{/* Metrics Section */}
					<div className="bg-default-50 rounded-xl p-4">
						<H4 className="mb-3">
							{t("campaign_reach", "Alcance de la campaña")}
						</H4>

						<div className="flex flex-col gap-2">
							<div className="flex justify-between items-center">
								<P className="text-tiny">
									{t("estimated_reach", "Alcance estimado")}
								</P>
								<Chip size="md" color="success" variant="flat">
									{getCurrentSegmentData().estimatedReach.toLocaleString()}{" "}
									clientes
								</Chip>
							</div>

							<div className="flex justify-between items-center">
								<P className="text-tiny">
									{t("expected_visibility", "Visibilidad esperada")}
								</P>
								<Chip size="md" color="primary" variant="flat">
									{getCurrentSegmentData().expectedVisibility}%
								</Chip>
							</div>
						</div>
					</div>
				</div>
			),
			isStepValid: true,
		},
	];

	// Auto-generate content when moving from step 1 to step 2
	useEffect(() => {
		if (currentStep === 1 && !step2Valid && intention.trim()) {
			handleGenerateContent();
		}
	}, [currentStep, step2Valid, intention, handleGenerateContent]);

	// Navigation handlers
	const handleNext = useCallback(() => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			handleSubmit();
		}
	}, [currentStep, steps.length, handleSubmit]);

	const handlePrevious = useCallback(() => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	}, [currentStep]);

	const stepTitles = [
		t("campaign_step_intention", "Intención"),
		t("campaign_step_content", "Contenido"),
		t("campaign_step_audience", "Audiencia"),
		t("campaign_step_summary", "Resumen"),
	];

	const isStepValid = () => {
		if (currentStep === 0) return step1Valid;
		if (currentStep === 1) return step2Valid;
		if (currentStep === 2) return step3Valid;
		return true;
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={handleClose}
			size="5xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-4 pb-2">
							<H2>{t("campaigns", "Campañas")}</H2>

							{/* Horizontal Stepper */}
							<div className="flex items-center justify-center gap-2 px-4">
								{stepTitles.map((title, index) => (
									<div key={index} className="flex items-center">
										<div className="flex items-center gap-2">
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
													index < currentStep
														? "bg-success-500 text-white"
														: index === currentStep
															? "bg-primary-500 text-white"
															: "bg-default-200 text-default-600"
												}`}
											>
												{index < currentStep ? (
													<IconComponent
														icon="solar:check-circle-bold"
														className="w-4 h-4"
													/>
												) : (
													index + 1
												)}
											</div>
											<span
												className={`text-sm font-medium hidden sm:inline ${
													index === currentStep
														? "text-primary-500"
														: index < currentStep
															? "text-success-500"
															: "text-default-400"
												}`}
											>
												{title}
											</span>
										</div>
										{index < stepTitles.length - 1 && (
											<div
												className={`w-12 h-1 mx-2 transition-colors ${
													index < currentStep
														? "bg-success-500"
														: "bg-default-200"
												}`}
											/>
										)}
									</div>
								))}
							</div>
						</ModalHeader>

						<ModalBody className="py-6">{steps[currentStep].content}</ModalBody>

						<ModalFooter>
							<Button
								variant="light"
								onPress={currentStep === 0 ? onClose : handlePrevious}
							>
								{currentStep === 0
									? t("button_cancel", "Cancelar")
									: t("button_previous", "Anterior")}
							</Button>
							<Button
								color="primary"
								onPress={handleNext}
								isDisabled={!isStepValid()}
							>
								{currentStep === steps.length - 1
									? t("button_create_campaign", "Crear y Enviar Campaña")
									: t("button_next", "Siguiente")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
