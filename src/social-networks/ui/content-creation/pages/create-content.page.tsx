import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem, useAuraToast } from "@beweco/aurora-ui";
import { Wizard, type WizardStep } from "@shared/ui/components/wizard";
import type { BrandConfig } from "@shared/ui/components";
import {
	configureSuccessToast,
	configureErrorToastWithTranslation,
} from "@shared/utils/toast-config.utils";
import { replaceVariables } from "@shared/utils/replace-variables.util";
import type { IUser } from "@layout/domain/interfaces/user.interface";
import type { IAgency } from "@layout/domain/interfaces/agency.interface";
import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import {
	useContentGeneration,
	extractImageFromBlocks,
} from "@shared/features/linda/content-generation";
import { useBrandGuide } from "@shared/features/linda/brand-guide";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { useTranslate } from "@tolgee/react";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { useBusinessInfo } from "@shared/ui/hooks/use-business-info.hook";
import { postsAdapter } from "@social-networks/infrastructure/adapters/posts.adapter";
import { createPost, updatePostStatus } from "@social-networks/application";
import { EnumPostState } from "@social-networks/domain/enums/enum-post-state.enum";
import { EnumAIGenerationType } from "@social-networks/domain/enums/enum-ai-generation-type.enum";
import { usePostImageUpload } from "@social-networks/ui/content-creation/hooks";
import { filestackService } from "@shared/infrastructure/services/filestack.service";
import {
	FormatStep,
	OptionsStep,
	ChannelStep,
	ContentStep,
	PublicationStep,
} from "../components";

// Default brand config values
const DEFAULT_BRAND_CONFIG: BrandConfig = {
	logo: "",
	useLogo: false,
	primaryColor: "#6366F1",
	secondaryColor: "#8B5CF6",
	generalPrompt: "",
};

/**
 * Procesa variables del sistema ({{company}}, {{phone}}, etc.)
 */
function processSystemVariables(
	text: string,
	user?: IUser | null,
	agency?: IAgency | null,
	businessInfo?: IBusinessInformation | null
): string {
	if (!text) return text;
	if (!user && !agency && !businessInfo) return text;
	
	return replaceVariables(text, user || null, agency || null, businessInfo);
}

/**
 * Procesa TODAS las variables en un texto (response.variables + sistema)
 * Solo se usa cuando se genera contenido nuevo y tenemos acceso a response.variables
 **/
function processAllVariables(
	text: string,
	responseVariables: Record<string, unknown>,
	user?: IUser | null,
	agency?: IAgency | null,
	businessInfo?: IBusinessInformation | null
): string {
	if (!text) return text;

	let processedText = text;

	// Paso 1: Reemplazar con response.variables (valores específicos de Linda AI)
	if (responseVariables && typeof responseVariables === "object" && !Array.isArray(responseVariables)) {
		processedText = processedText.replace(
			/\{\{(\w+)\}\}/g,
			(match, variableName: string) => {
				const normalizedKey = variableName.toLowerCase();
				let variableValue = responseVariables[variableName];

				if (variableValue === undefined) {
					const foundKey = Object.keys(responseVariables).find(
						(key) => key.toLowerCase() === normalizedKey
					);
					if (foundKey) {
						variableValue = responseVariables[foundKey];
					}
				}

				if (variableValue !== null && variableValue !== undefined) {
					return String(variableValue);
				}

				return match;
			}
		);
	}

	// Paso 2: Reemplazar variables restantes con datos del sistema
	return processSystemVariables(processedText, user, agency, businessInfo);
}

export function CreateContentPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const { publishContent, generateContent, editImage, fetchContentGenerationById } =
		useContentGeneration();
	const { user, agency } = useSession();
	const { businessInfo } = useBusinessInfo();
	const { uploadImageFromUrl, uploadImageFromFile } = usePostImageUpload();

	const editState = location.state as {
		editMode?: boolean;
		currentStep?: number;
		selectedContentType?: string;
		generatedImage?: string;
		generatedCaption?: string;
		contentTitle?: string;
		itemId?: string;
		fromProposedContent?: boolean;
		readyToPublish?: boolean;
	} | null;

	// Debug: Log edit state
	console.log("EditState:", editState);

	const [currentStep, setCurrentStep] = useState(editState?.currentStep || 1);
	const [selectedContentType, setSelectedContentType] = useState<string>(
		editState?.selectedContentType || ""
	);
	const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
		"instagram",
	]);
	const [useAI, setUseAI] = useState<boolean | null>(
		editState?.editMode ? true : null
	);
	const [prompt, setPrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isEditingImage, setIsEditingImage] = useState(false);
	const [generatedImage, setGeneratedImage] = useState<string>(
		editState?.generatedImage || ""
	);
	// Estado para el caption
	// Cuando viene de editState, ya tiene variables de response.variables procesadas (del mapper)
	// Pero puede tener variables del sistema ({{company}}, {{phone}}, etc.) sin procesar
	const [generatedCaption, setGeneratedCaption] = useState<string>(
		editState?.generatedCaption || ""
	);

	// Estado temporal para el archivo antes de subirlo a Filestack
	const [temporaryImageFile, setTemporaryImageFile] = useState<File | null>(
		null
	);
	const [isUploadingToFilestack, setIsUploadingToFilestack] = useState(false);

	// Estado para el caption con TODAS las variables reemplazadas
	// Cuando viene de editState, el mapper ya procesó response.variables
	// Solo necesitamos procesar variables del sistema
	const [displayCaption, setDisplayCaption] = useState<string>("");

	// Estados para el título del contenido - Pre-llenado si viene del state
	const [contentTitle, setContentTitle] = useState(
		editState?.contentTitle || ""
	);

	// Estado para el ID del contenido generado por Linda AI
	const [contentId, setContentId] = useState<string | null>(
		editState?.itemId || null
	);

	// Brand Config State
	const [brandConfig, setBrandConfig] = useState<BrandConfig>(DEFAULT_BRAND_CONFIG);
	const [isBrandConfigOpen, setIsBrandConfigOpen] = useState(false);
	const [isUploadingLogo, setIsUploadingLogo] = useState(false);

	// Brand Guide hook to sync with backend
	const { brandGuide, fetchBrandGuide } = useBrandGuide();

	// Sync brand config with brand guide from backend
	useEffect(() => {
		fetchBrandGuide();
	}, [fetchBrandGuide]);

	// Update local brand config when brand guide is loaded
	useEffect(() => {
		if (brandGuide) {
			setBrandConfig((prev) => ({
				...prev,
				logo: brandGuide.logoUrl || "",
				useLogo: !!brandGuide.logoUrl,
				primaryColor: brandGuide.primaryColor || prev.primaryColor,
				secondaryColor: brandGuide.secondaryColor || prev.secondaryColor,
				generalPrompt: brandGuide.smbAddedDescription || prev.generalPrompt,
			}));
		}
	}, [brandGuide]);

	// Procesar variables del sistema para displayCaption
	// - Cuando viene de editState: el mapper ya procesó response.variables, solo procesamos sistema
	// - Cuando se genera nuevo: handleGenerate procesa todo, este efecto sincroniza displayCaption
	// - Cuando el usuario edita: procesa variables del sistema que el usuario agregó
	useEffect(() => {
		if (generatedCaption) {
			const processedText = processSystemVariables(
				generatedCaption,
				user,
				agency,
				businessInfo
			);
			setDisplayCaption(processedText);
		} else {
			setDisplayCaption("");
		}
	}, [generatedCaption, user, agency, businessInfo]);

	// Determinar qué pasos mostrar según useAI y tipo de contenido
	const isStory = selectedContentType === "instagram-story";

	// Todos los flujos tienen 5 pasos, solo cambia el título del paso 4
	const step4Title =
		useAI === true
			? t("social_networks_create_content_step_description")
			: t("social_networks_create_content_step_content");

	// Debug effect - Log when step 5 loads
	useEffect(() => {
		if (currentStep === 5) {
			console.log("=== Step 5 Loaded ===");
			console.log("currentStep:", currentStep);
			console.log("selectedContentType:", selectedContentType);
			console.log("generatedImage:", generatedImage);
			console.log("generatedCaption:", generatedCaption);
			console.log("isStory:", isStory);
			console.log("editMode:", editState?.editMode);
			console.log("====================");
		}
	}, [
		currentStep,
		selectedContentType,
		generatedImage,
		generatedCaption,
		isStory,
		editState,
	]);

	const steps: WizardStep[] = [
		{ number: 1, title: t("social_networks_create_content_step_format") },
		{ number: 2, title: t("social_networks_create_content_step_options") },
		{ number: 3, title: t("social_networks_create_content_step_channel") },
		{ number: 4, title: step4Title },
		{ number: 5, title: t("social_networks_create_content_step_publication") },
	];

	const handleGenerate = async () => {
		if (!prompt.trim()) return;

		setIsGenerating(true);

		try {
			// Generate UUID for thread_id
			const threadId = crypto.randomUUID();

			// Map content type to format
			const formatMap: Record<string, string> = {
				"instagram-post": t("social_networks_create_content_format_post"),
				"instagram-story": t("social_networks_create_content_format_story"),
			};

			const format = formatMap[selectedContentType] || t("social_networks_create_content_format_post");

			// Get platform name
			const platformMap: Record<string, string> = {
				instagram: t("social_networks_create_content_platform_instagram"),
				facebook: t("social_networks_create_content_platform_facebook"),
				tiktok: t("social_networks_create_content_platform_tiktok"),
			};

		const platform = platformMap[selectedPlatforms[0]] || t("social_networks_create_content_platform_instagram");

		// Concatenate user input with format and channel
		const userInputWithContext = `${prompt} (Formato:${format}, Canal:${platform})`;

		// Verificar si el usuario modificó los datos de marca
		const hasLogoChanged = brandConfig.logo !== (brandGuide?.logoUrl || "");
		const hasPrimaryColorChanged = brandConfig.primaryColor !== (brandGuide?.primaryColor || "#6366F1");
		const hasSecondaryColorChanged = brandConfig.secondaryColor !== (brandGuide?.secondaryColor || "#8B5CF6");
		const hasVisualStyleChanged = brandConfig.generalPrompt !== (brandGuide?.smbAddedDescription || "");

		// Solo enviar datos temporales si el usuario los modificó
		const hasAnyBrandChanges = hasLogoChanged || hasPrimaryColorChanged || hasSecondaryColorChanged || hasVisualStyleChanged;

		// Construir request base
		const generateRequest: Parameters<typeof generateContent>[0] = {
			userInput: userInputWithContext,
			threadId: threadId,
		};

		// Solo agregar campos temporales si hay cambios
		if (hasAnyBrandChanges) {
			// force_use_logo: true si el usuario cambió el logo, false para usar el default
			generateRequest.forceUseLogo = hasLogoChanged;

			if (hasLogoChanged && brandConfig.logo) {
				generateRequest.temporalLogoUrl = brandConfig.logo;
			}
			if (hasVisualStyleChanged && brandConfig.generalPrompt) {
				generateRequest.temporalVisualStyle = brandConfig.generalPrompt;
			}
			if (hasPrimaryColorChanged && brandConfig.primaryColor) {
				generateRequest.temporalPrimaryColor = brandConfig.primaryColor;
			}
			if (hasSecondaryColorChanged && brandConfig.secondaryColor) {
				generateRequest.temporalSecondaryColor = brandConfig.secondaryColor;
			}
		}

		// Call Linda API to generate content
		const response = await generateContent(generateRequest);

			console.log("Linda API Response:", response);

			// Validate response
			if (!response) {
				throw new Error(t("social_networks_create_content_error_no_server_response"));
			}

			// Parse blocks from response
			let imageUrl = "";
			let captionText = "";

			if (response.blocks) {
				try {
					const blocks =
						typeof response.blocks === "string"
							? JSON.parse(response.blocks)
							: response.blocks;

					// Validate blocks is an array
					if (!Array.isArray(blocks)) {
						console.warn("Blocks is not an array:", blocks);
					} else {
						// Extract image from blocks
						const imageBlock = blocks.find(
							(block: { type: string }) => block.type === "image"
						);
						if (imageBlock && imageBlock.url) {
							imageUrl = imageBlock.url;
						}

						// Extract text from blocks
						const textBlock = blocks.find(
							(block: { type: string }) => block.type === "text"
						);
						if (textBlock && textBlock.body) {
							captionText = textBlock.body;
							// Procesar TODAS las variables (response.variables + sistema)
							if (response.variables && typeof response.variables === "object") {
								captionText = processAllVariables(
									captionText,
									response.variables as Record<string, unknown>,
									user,
									agency,
									businessInfo
								);
							} else {
								// Si no hay response.variables, solo procesar variables del sistema
								captionText = processSystemVariables(captionText, user, agency, businessInfo);
							}
						}
					}
				} catch (parseError) {
					console.error("Error parsing blocks:", parseError);
					// Continue execution even if blocks parsing fails
				}
			}

			// Validate that we got at least some content
			if (!imageUrl && !captionText && !response.name) {
				throw new Error(t("social_networks_create_content_error_empty_response"));
			}

			// ======================================================================
			// CRÍTICO: Subir imagen a Filestack si existe
			// ======================================================================
			let filestackImageUrl = "";

			if (imageUrl) {
				console.log("🔍 Procesando imagen generada por Linda AI:", imageUrl);

				// Verificar si la imagen ya es de Filestack
				const isFilestackUrl =
					imageUrl.includes("filestack") ||
					imageUrl.includes("filestackcontent");

				if (isFilestackUrl) {
					console.log("✅ La imagen ya está en Filestack");
					filestackImageUrl = imageUrl;
				// } else {
				// 	//TODO: Remove this
				// 	// En desarrollo local: usar la URL directamente sin subir a Filestack
				// 	const isDevelopment = process.env.NODE_ENV === "development";
					
				// 	if (isDevelopment) {
				// 		console.log("🔧 [DESARROLLO] Usando URL de imagen directamente sin subir a Filestack");
				// 		filestackImageUrl = imageUrl; // ✅ Asignar la URL directamente en desarrollo
					} else {
						console.log("🔄 Copiando imagen de Linda AI a Filestack...");

						try {
							// Copiar imagen a Filestack
							const filename = (response.name || "linda_content")
								.replace(/\s+/g, "_")
								.toLowerCase();
							filestackImageUrl = await uploadImageFromUrl(imageUrl, filename);

							console.log("✅ Imagen copiada a Filestack:", filestackImageUrl);
						} catch (uploadError) {
							console.error("❌ Error subiendo imagen a Filestack:", uploadError);

							// Mostrar error específico de subida de imagen
							showToast(
								configureErrorToastWithTranslation(
									EnumErrorType.Critical,
									t,
									"Error procesando imagen",
									"No se pudo copiar la imagen a Filestack. Por favor, intenta generar el contenido nuevamente."
								)
							);

							throw uploadError; // Re-lanzar para que se maneje en el catch principal
						// }
				}
			}
		}

			// Set the generated content with Filestack URL
			setGeneratedImage(filestackImageUrl); // ✅ Siempre URL de Filestack, nunca Base64
			
			// Establecer caption ya con todas las variables reemplazadas
			// (response.variables + datos del sistema ya fueron procesados arriba)
			setGeneratedCaption(captionText);
			setDisplayCaption(captionText); // Mismo valor, ya procesado
			setContentTitle(response.name || "");
			// Guardar el ID del contenido generado para poder editarlo después
			setContentId(response.id);

			// Show success toast
			showToast(
				configureSuccessToast(
					t("social_networks_create_content_success_generated_title"),
					t("social_networks_create_content_success_generated_description")
				)
			);

			// Move to publication step
			setCurrentStep(5);
		} catch (error) {
			console.error("Error generating content:", error);

			// Check if error is a cancellation
			if (
				error instanceof Error &&
				(error.name === "AbortError" || error.message.includes("cancel"))
			) {
				console.log("Request was cancelled by user or timeout");
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Warning,
						t,
						"social_networks_create_content_error_generation_cancelled_title",
						"social_networks_create_content_error_generation_cancelled_description"
					)
				);
				return;
			}

			// Check for network errors
			if (
				error instanceof Error &&
				(error.message.includes("Network") ||
					error.message.includes("Failed to fetch"))
			) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Network,
						t,
						"social_networks_create_content_error_connection_title",
						"social_networks_create_content_error_connection_description"
					)
				);
				return;
			}

			// Check for timeout errors
			if (error instanceof Error && error.message.includes("timeout")) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Timeout,
						t,
						"social_networks_create_content_error_timeout_title",
						"social_networks_create_content_error_timeout_description"
					)
				);
				return;
			}

			// Generic error handling
			const errorMessage =
				error instanceof Error
					? error.message
					: t("social_networks_create_content_error_generate_fallback");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"social_networks_create_content_error_generate_title",
					errorMessage
				)
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleImageUpload = (files: File[]) => {
		// Si el array está vacío, significa que se eliminó el archivo
		if (files.length === 0) {
			setGeneratedImage("");
			setTemporaryImageFile(null);
			return;
		}

		// Si hay un archivo, guardarlo temporalmente y crear preview
		const file = files[0];
		if (file) {
			console.log(
				"📁 Archivo seleccionado (se subirá al hacer clic en Siguiente):",
				{
					name: file.name,
					size: file.size,
					type: file.type,
				}
			);

			// Guardar el archivo para subirlo después
			setTemporaryImageFile(file);

			// Crear preview en Base64 SOLO para visualización
			const reader = new FileReader();
			reader.onload = (e) => {
				setGeneratedImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageRemove = () => {
		setGeneratedImage("");
		setTemporaryImageFile(null);
	};

	/**
	 * Handler para avanzar desde el paso de contenido manual (paso 4)
	 * Sube la imagen a Filestack antes de continuar al siguiente paso
	 */
	const handleNextStepFromManualContent = async () => {
		// Validar que hay imagen
		if (!generatedImage) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"social_networks_create_content_error_image_required_title",
					"social_networks_create_content_error_image_required_description"
				)
			);
			return;
		}

		// Si ya es URL de Filestack, avanzar directamente
		const isFilestackUrl =
			generatedImage.includes("filestack") ||
			generatedImage.includes("filestackcontent");

		if (isFilestackUrl) {
			console.log("✅ La imagen ya está en Filestack, avanzando...");
			setCurrentStep(5);
			return;
		}

		// Si hay un archivo temporal, subirlo a Filestack
		if (temporaryImageFile) {
			try {
				setIsUploadingToFilestack(true);

				console.log("🔄 Subiendo imagen a Filestack...", {
					name: temporaryImageFile.name,
					size: temporaryImageFile.size,
					type: temporaryImageFile.type,
				});

				// Subir archivo a Filestack
				const filestackUrl = await uploadImageFromFile(temporaryImageFile);

				console.log("✅ Imagen subida a Filestack:", filestackUrl);

				// Actualizar con la URL de Filestack
				setGeneratedImage(filestackUrl);
				setTemporaryImageFile(null); // Limpiar archivo temporal

				// Mostrar éxito
				showToast(
					configureSuccessToast(
						t("social_networks_create_content_success_image_processed_title"),
						t("social_networks_create_content_success_image_processed_description")
					)
				);

				// Avanzar al siguiente paso
				setCurrentStep(5);
			} catch (error) {
				console.error("❌ Error subiendo imagen a Filestack:", error);

				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"social_networks_create_content_error_upload_image_title",
						error instanceof Error
							? error.message
							: t("social_networks_create_content_error_upload_image_description")
					)
				);
			} finally {
				setIsUploadingToFilestack(false);
			}
		} else {
			// Si no hay archivo temporal pero hay imagen (Base64), mostrar error
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"social_networks_create_content_error_image_invalid_title",
					"social_networks_create_content_error_image_invalid_description"
				)
			);
		}
	};

	const handleConfirmPublish = async () => {
		// Validate required data before starting the process
		if (!contentTitle.trim()) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"social_networks_create_content_error_title_required_title",
					"social_networks_create_content_error_title_required_description"
				)
			);
			return;
		}

		if (!generatedImage) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"social_networks_create_content_error_image_required_publish_title",
					"social_networks_create_content_error_image_required_publish_description"
				)
			);
			return;
		}

		setIsPublishing(true);

		try {
			// ======================================================================
			// PASO 1: SUBIR IMAGEN A FILESTACK SI ES NECESARIO
			// ======================================================================
			console.log("🔍 Verificando tipo de imagen...", {
				imageUrl: generatedImage.substring(0, 100) + "...",
				fromProposedContent: editState?.fromProposedContent,
				useAI: useAI,
				hasTemporaryFile: !!temporaryImageFile,
			});

			let finalImageUrl = generatedImage;
			const isFilestackUrl =
				generatedImage.includes("filestack") ||
				generatedImage.includes("filestackcontent");
			const isBase64 = generatedImage.startsWith("data:image/");

			// CASO 1: Imagen es Base64 o no es de Filestack (URL externa)
			if (!isFilestackUrl) {
				console.log("⚠️ La imagen NO está en Filestack, procesando...");

				// Sub-caso 1A: Hay archivo temporal (contenido manual)
				if (temporaryImageFile) {
					console.log("🔄 Subiendo archivo temporal a Filestack...");
					finalImageUrl = await uploadImageFromFile(temporaryImageFile);
					console.log("✅ Archivo subido a Filestack:", finalImageUrl);
					setTemporaryImageFile(null);
				}
				// Sub-caso 1B: Es URL externa (contenido propuesto o generado por IA)
				else if (!isBase64) {
					console.log("🔄 Copiando imagen desde URL externa a Filestack...");
					const filename =
						contentTitle.replace(/\s+/g, "_").toLowerCase() || "content";
					finalImageUrl = await uploadImageFromUrl(generatedImage, filename);
					console.log("✅ Imagen copiada a Filestack:", finalImageUrl);
				}
				// Sub-caso 1C: Es Base64 pero no hay archivo temporal (error de flujo)
				else {
					throw new Error(
						t("social_networks_create_content_error_base64_image")
					);
				}

				// Actualizar el estado con la URL de Filestack
				setGeneratedImage(finalImageUrl);
			} else {
				console.log("✅ Imagen ya está en Filestack:", finalImageUrl);
			}

			// ======================================================================
			// PASO 2: Si viene de contenido propuesto, actualizar el estado en el backend de Linda
			// ======================================================================
			if (editState?.fromProposedContent && editState?.itemId) {
				console.log("📝 Publishing proposed content:", editState.itemId);
				await publishContent(editState.itemId);
			}

			// ======================================================================
			// PASO 3: Crear el post con la imagen de Filestack
			// ======================================================================
			console.log("📝 Creating post with Filestack image...");

			// Map content type to channel and postType
			const channelMap: Record<string, string> = {
				instagram: "instagram",
				facebook: "facebook",
				tiktok: "tiktok",
			};

			const postTypeMap: Record<string, string> = {
				"instagram-post": "post",
				"instagram-story": "story",
			};

			const channel = channelMap[selectedPlatforms[0]] || "instagram";
			const postType = postTypeMap[selectedContentType] || "post";

			// Determine AI generation type
			const aiGenerationType =
				useAI === true ? EnumAIGenerationType.CREATE : EnumAIGenerationType.NO;

			// Determine if brandConfig should be sent
			// Only send brandConfig params if user went through AI flow (useAI === true)
			const shouldIncludeBrandConfig = useAI === true;

			// Create post request with Filestack image URL
			const createPostRequest = {
				name: contentTitle,
				description: generatedCaption,
				channel: channel,
				postType: postType,
				date: new Date().toISOString(),
				imageUrl: finalImageUrl, // ✅ URL de Filestack garantizada
				aiGenerationType: aiGenerationType,
				contentId: editState?.itemId, // Link to Linda content if exists
				// Brand config params - only send if flow included BrandConfigSection
				logo: shouldIncludeBrandConfig ? (brandConfig.logo || null) : null,
				primaryColor: shouldIncludeBrandConfig ? (brandConfig.primaryColor || null) : null,
				secondaryColor: shouldIncludeBrandConfig ? (brandConfig.secondaryColor || null) : null,
				brandDescription: shouldIncludeBrandConfig ? (brandConfig.generalPrompt || null) : null,
				agencyId: agency?.id || "",
				companyId: agency?.id || "", // Company ID is the same as agency ID
			};

			const createdPost = await createPost(postsAdapter, createPostRequest);
			console.log("✅ Post created:", createdPost);

			// ======================================================================
			// PASO 4: Actualizar estado del post a PENDING (esto dispara la publicación)
			// ======================================================================
			console.log("📤 Publishing post...");
			const publishedPost = await updatePostStatus(
				postsAdapter,
				createdPost.id,
				EnumPostState.PENDING
			);
			console.log("✅ Post published:", publishedPost);

			// Show success toast notification
			showToast(
				configureSuccessToast(
					t("social_networks_create_content_success_published_title"),
					t("social_networks_create_content_success_published_description", {
						channel,
					})
				)
			);

			// Navigate back to social networks page
			navigate("/social-networks");
		} catch (error) {
			console.error("❌ Error publishing content:", error);

			// Show error toast
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"social_networks_create_content_error_publish_title",
					error instanceof Error
						? error.message
						: t("social_networks_create_content_error_publish_description")
				)
			);
		} finally {
			setIsPublishing(false);
		}
	};

	const handleEditImage = async (prompt: string, imageUrls: string[]) => {
		if (!contentId) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"Error",
					"No se encontró el ID del contenido para editar"
				)
			);
			return;
		}

		setIsEditingImage(true);
		try {
			const result = await editImage(contentId, prompt, imageUrls);

			// Actualizar el preview con la nueva URL: primero data.new_url (API), luego blocks/generated_assets
			let newImageUrl = result.newImageUrl;
			if (!newImageUrl && result.content) {
				const blocks = Array.isArray(result.content.blocks)
					? result.content.blocks
					: [];
				newImageUrl = extractImageFromBlocks(blocks);
				if (!newImageUrl && result.content.generatedAssets?.length > 0) {
					newImageUrl = result.content.generatedAssets[0].url;
				}
			}
			if (!newImageUrl) {
				const refetched = await fetchContentGenerationById(contentId);
				if (refetched) {
					const refetchedBlocks = Array.isArray(refetched.blocks)
						? refetched.blocks
						: [];
					newImageUrl =
						extractImageFromBlocks(refetchedBlocks) ||
						refetched.generatedAssets?.[0]?.url;
				}
			}
			if (newImageUrl) {
				setGeneratedImage(newImageUrl);
			}

			// Mostrar mensaje de éxito
			showToast(
				configureSuccessToast(
					"Imagen editada exitosamente",
					"La imagen ha sido actualizada con tus cambios"
				)
			);
		} catch (error) {
			console.error("Error editing image:", error);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"Error al editar imagen",
					error instanceof Error
						? error.message
						: "No se pudo editar la imagen"
				)
			);
			// Re-lanzar el error para que el modal no se cierre
			throw error;
		} finally {
			setIsEditingImage(false);
		}
	};

	const handlePlatformToggle = (platform: string) => {
		if (selectedPlatforms.includes(platform)) {
			setSelectedPlatforms([]);
		} else {
			setSelectedPlatforms([platform]);
		}
	};

	// Brand Config Handlers
	const handleBrandConfigChange = useCallback((config: Partial<BrandConfig>) => {
		setBrandConfig((prev) => ({ ...prev, ...config }));
	}, []);

	const handleBrandConfigToggle = useCallback(() => {
		setIsBrandConfigOpen((prev) => !prev);
	}, []);

	// Logo Upload Handlers
	const handleLogoUpload = useCallback(async (files: File[]) => {
		if (files.length === 0 || !agency?.id) return;

		setIsUploadingLogo(true);
		try {
			const file = files[0];

			console.log('🔄 Subiendo logo temporal a Filestack...', {
				name: file.name,
				size: file.size,
				type: file.type
			});

			const uploadedResults = await filestackService.uploadFilesWithMetadata(
				[file],
				{
					path: "brand-guide/logos/",
					agencyId: agency.id,
				}
			);

			if (!uploadedResults[0]?.url) {
				throw new Error('No se recibió URL de Filestack');
			}

			const logoUrl = uploadedResults[0].url;
			console.log('✅ Logo temporal subido a Filestack:', logoUrl);

			// Actualizar estado local con el logo
			setBrandConfig(prev => ({ ...prev, logo: logoUrl, useLogo: true }));

			showToast(
				configureSuccessToast(
					t("social_networks_brand_guide_logo_upload_success", "Logo cargado"),
					t("social_networks_brand_guide_logo_upload_success_description", "El logo se cargó correctamente")
				)
			);
		} catch (err) {
			console.error('❌ Error subiendo logo:', err);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"social_networks_brand_guide_logo_upload_error",
					err instanceof Error ? err.message : "social_networks_brand_guide_logo_upload_error_description"
				)
			);
		} finally {
			setIsUploadingLogo(false);
		}
	}, [agency?.id, showToast, t]);

	const handleLogoRemove = useCallback(() => {
		setBrandConfig(prev => ({ ...prev, logo: "", useLogo: false }));
	}, []);

	const handleLogoError = useCallback((errorMessage: string) => {
		console.error("Error uploading logo:", errorMessage);
		showToast(
			configureErrorToastWithTranslation(
				EnumErrorType.Validation,
				t,
				"social_networks_brand_guide_logo_upload_error",
				errorMessage
			)
		);
	}, [showToast, t]);

	// Render step content based on current step
	const renderStep = (step: WizardStep) => {
		switch (step.number) {
			case 1:
				return (
					<FormatStep
						selectedContentType={selectedContentType}
						onContentTypeSelect={setSelectedContentType}
						onNext={() => setCurrentStep(2)}
					/>
				);

			case 2:
				return (
					<OptionsStep
						useAI={useAI}
						onUseAIChange={setUseAI}
						onBack={() => setCurrentStep(1)}
						onNext={() => setCurrentStep(3)}
					/>
				);

			case 3:
				return (
					<ChannelStep
						selectedPlatforms={selectedPlatforms}
						onPlatformToggle={handlePlatformToggle}
						onBack={() => setCurrentStep(2)}
						onNext={() => setCurrentStep(4)}
					/>
				);

			case 4:
				return (
					<ContentStep
						useAI={useAI === true}
						isStory={isStory}
						prompt={prompt}
						onPromptChange={setPrompt}
						isGenerating={isGenerating}
						onGenerate={handleGenerate}
						brandConfig={brandConfig}
						onBrandConfigChange={handleBrandConfigChange}
						isBrandConfigOpen={isBrandConfigOpen}
						onBrandConfigToggle={handleBrandConfigToggle}
						onLogoUpload={handleLogoUpload}
						onLogoRemove={handleLogoRemove}
						isUploadingLogo={isUploadingLogo}
						onLogoError={handleLogoError}
						generatedImage={generatedImage}
						generatedCaption={generatedCaption}
						onImageUpload={handleImageUpload}
						onImageRemove={handleImageRemove}
						onCaptionChange={setGeneratedCaption}
						isUploadingToFilestack={isUploadingToFilestack}
						onBack={() => setCurrentStep(3)}
						onNext={handleNextStepFromManualContent}
					/>
				);

			case 5:
				return (
					<PublicationStep
						isStory={isStory}
						generatedImage={generatedImage}
						displayCaption={displayCaption}
						generatedCaption={generatedCaption}
						contentTitle={contentTitle}
						onContentTitleChange={setContentTitle}
						onCaptionChange={setGeneratedCaption}
						isPublishing={isPublishing}
						canGoBack={!editState?.fromProposedContent}
						onBack={() => setCurrentStep(4)}
						onPublish={handleConfirmPublish}
						useAI={useAI && editState === null} 
						contentId={contentId}
						onEditImage={handleEditImage}
						isEditingImage={isEditingImage}
					/>
				);

			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<Breadcrumbs>
					<BreadcrumbItem href="/social-networks">
						{t("social_networks_create_content_breadcrumb_social_networks")}
					</BreadcrumbItem>
					<BreadcrumbItem>
						{t("social_networks_create_content_breadcrumb_create")}
					</BreadcrumbItem>
				</Breadcrumbs>
			</div>

			{/* Wizard Component */}
			<Wizard
				steps={steps}
				currentStep={currentStep}
				onStepChange={setCurrentStep}
				renderStep={renderStep}
				navigationConfig={{
					showNavigationButtons: false, // We handle navigation in each step
					allowBack: !editState?.fromProposedContent, // Disable back navigation when coming from proposed content
					allowSkipToCompleted: true,
				}}
				showSidebar={true}
				sidebarPosition="left"
				minHeight="600px"
				isLoading={isGenerating || isPublishing}
				loadingText={
					isPublishing
						? t("social_networks_create_content_loading_publishing")
						: t("social_networks_create_content_loading_generating")
				}
			/>
		</div>
	);
}