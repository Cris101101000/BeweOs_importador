import {
	Avatar,
	Button,
	Card,
	H2,
	IconComponent,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	P,
	Phone,
	type PhoneValue,
	Select,
	SelectItem,
	type ThemeMode,
	ThemePicker,
	useAuraToast,
	useThemeContext,
} from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { getUserId } from "@beweco/utils-js";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import { assetUploadService } from "@shared/infrastructure/services/asset-upload.service";
import {
	SuccessModal,
	type SuccessModalProps,
	UploadFileComponent,
	ViewSkeleton,
} from "@shared/ui/components";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { getModuleIconByModuleId } from "@shared/ui/functions/modules";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { getFullName } from "@shared/utils/user-name.utils";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useEffect, useState } from "react";
import type { EnumLanguage } from "../../../shared/domain/enums/enum-language.enum";
import { useRecoveryPassword } from "./use-hooks/useRecoveryPassword";
import { useUpdateProfile } from "./use-hooks/useUpdateProfile";

interface SelectOption {
	label: string;
	value: string;
	id: number;
}

export default function Profile() {
	const { mode, setMode } = useThemeContext();
	const { showToast } = useAuraToast();

	const { user, modulesId, agency, setUser } = useSession();
	const { t } = useTranslate();
	const { isLoading, error, recoveryPassword } = useRecoveryPassword();
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
	const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	const {
		error: updateError,
		updateProfile,
		// reset: resetUpdate,
	} = useUpdateProfile();

	// Estado del formulario
	const [formData, setFormData] = useState({
		firstname: user?.firstname || "",
		lastname: user?.lastname || "",
		phone: user?.phones?.[0],
		language: user?.language || "es",
		theme: (user?.theme as ThemeMode) || mode,
	});

	// Estado inicial para detectar cambios (dirty state)
	const [initialProfileData, setInitialProfileData] = useState({
		firstname: user?.firstname || "",
		lastname: user?.lastname || "",
		phone: user?.phones?.[0] as IPhone | undefined,
	});

	const [initialLanguage, setInitialLanguage] = useState(
		(user?.language as string) || "es"
	);

	const [successModalProps, setSuccessModalProps] = useState<SuccessModalProps>(
		{
			isOpen: false,
			// biome-ignore lint/suspicious/noEmptyBlockStatements: Initial empty function, will be replaced when modal is shown
			onClose: () => {},
		}
	);

	useEffect(() => {
		if (user) {
			const userTheme = (user.theme as ThemeMode) || "light";
			setFormData({
				firstname: user.firstname || "",
				lastname: user.lastname || "",
				phone: user.phones?.[0],
				language: user.language || "es",
				theme: userTheme,
			});
			setInitialProfileData({
				firstname: user.firstname || "",
				lastname: user.lastname || "",
				phone: user.phones?.[0] as IPhone | undefined,
			});
			setInitialLanguage((user.language as string) || "es");
			// Sincronizar el contexto de tema con el tema del usuario
			if (mode !== userTheme) {
				setMode(userTheme);
			}
		}
		// Solo ejecutar cuando cambie el usuario, no cuando cambie el mode
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Función para manejar cambios en el formulario
	const handleFormChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Función helper para manejar onChange que puede ser evento o valor directo
	const handleInputChange =
		(field: string) =>
		(valueOrEvent: string | React.ChangeEvent<HTMLInputElement>) => {
			const value =
				typeof valueOrEvent === "string"
					? valueOrEvent
					: valueOrEvent.target.value;
			handleFormChange(field, value);
		};

	// Helpers de comparación
	const arePhonesEqual = (a?: IPhone, b?: IPhone) =>
		JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

	const isProfileDirty =
		formData.firstname !== initialProfileData.firstname ||
		formData.lastname !== initialProfileData.lastname ||
		!arePhonesEqual(
			formData.phone as IPhone | undefined,
			initialProfileData.phone
		) ||
		pendingImageFile !== null;

	const isLanguageDirty = formData.language !== initialLanguage;

	// Función para guardar el perfil
	const handleSaveProfile = async () => {
		try {
			setIsUpdatingProfile(true);
			let uploadedImageUrl: string | undefined;

			if (pendingImageFile && agency?.id) {
				try {
					const urls = await assetUploadService.uploadFilesOnly(
						[pendingImageFile],
						{
							agencyId: agency.id,
							path: "users/avatars/",
						}
					);
					if (urls.length > 0) {
						uploadedImageUrl = urls[0];
					}
				} catch (uploadError) {
					console.error("Error uploading image:", uploadError);
					showToast(
						configureErrorToastWithTranslation(
							EnumErrorType.Unexpected,
							t,
							"error_title",
							"settings_profile_upload_error"
						)
					);
				}
			}

			const updateData = {
				firstname: formData.firstname,
				lastname: formData.lastname,
				phones: formData.phone ? [formData.phone] : [],
				language: formData.language as EnumLanguage,
				theme: formData.theme as ThemeMode,
				...(uploadedImageUrl ? { imageProfile: uploadedImageUrl } : {}),
			};

			const response = await updateProfile(updateData);

			if (response.success) {
				// Actualiza el estado inicial para reflejar lo guardado
				setInitialProfileData({
					firstname: formData.firstname,
					lastname: formData.lastname,
					phone: formData.phone as IPhone | undefined,
				});
				setPendingImageFile(null);
				setPreviewImage(null);

				// Update session user with new data
				if (user) {
					setUser({
						...user,
						firstname: formData.firstname,
						lastname: formData.lastname,
						language: formData.language as EnumLanguage,
						theme: formData.theme as ThemeMode,
						phones: formData.phone ? [formData.phone as IPhone] : user.phones,
						...(uploadedImageUrl ? { imageProfile: uploadedImageUrl } : {}),
					});
				}

				showToast(
					configureSuccessToast(
						t("settings_profile_save_success_title"),
						t("settings_profile_save_success_message")
					)
				);
			} else {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Unexpected,
						t,
						"error_title",
						response.message || "settings_profile_save_error"
					)
				);
			}
		} catch (err) {
			console.error("Error updating profile:", err);
			const description =
				err instanceof Error ? err.message : t("settings_profile_save_error");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"error_title",
					description
				)
			);
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handleSaveProfileLanguage = async () => {
		try {
			setIsUpdatingLanguage(true);
			const updateData = {
				language: formData.language as EnumLanguage,
			};

			const response = await updateProfile(updateData);

			if (response.success) {
				// Actualiza el estado inicial del idioma
				setInitialLanguage(formData.language);

				// Update session user with new data
				if (user) {
					setUser({
						...user,
						language: formData.language as EnumLanguage,
					});
				}

				showToast(
					configureSuccessToast(
						t("settings_profile_language_save_success_title"),
						t("settings_profile_language_save_success_message")
					)
				);

				// Recargar para aplicar cambios de idioma globales si es necesario
				// Opcional: Si el cambio de idioma es reactivo globalmente, quitar el reload
				window.location.reload();
			} else {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Unexpected,
						t,
						"error_title",
						response.message || "settings_profile_save_error"
					)
				);
			}
		} catch (err) {
			console.error("Error updating profile:", err);
			const description =
				err instanceof Error ? err.message : t("settings_profile_save_error");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"error_title",
					description
				)
			);
		} finally {
			setIsUpdatingLanguage(false);
		}
	};

	const handleSaveProfileTheme = async (newMode: ThemeMode) => {
		try {
			const updateData = {
				theme: newMode,
			};

			const response = await updateProfile(updateData);

			if (response.success) {
				console.log("Theme updated successfully");
				// Actualizar el usuario en el contexto con el nuevo tema
				if (user) {
					setUser({
						...user,
						theme: newMode,
					});
				}
				showToast(
					configureSuccessToast(
						t("success_title", "Éxito"),
						t(
							"settings_profile_theme_updated",
							"Tema actualizado correctamente"
						)
					)
				);
			}
		} catch (err) {
			console.error("Error updating theme:", err);
			const description =
				err instanceof Error
					? err.message
					: t("settings_profile_theme_error");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"error_title",
					description
				)
			);
		}
	};

	const languages: SelectOption[] = [
		{ label: t("language_spanish"), value: "es", id: 1 },
		{ label: t("language_english"), value: "en", id: 2 },
	];
	console.log("--------->user", user);
	// console.log("--------->modulos", modulos);

	const handlePhoneChange = (value: PhoneValue) => {
		setFormData((prev) => ({
			...prev,
			phone: value as IPhone,
		}));
	};

	const handleImageUpload = (files: File[]) => {
		if (files.length > 0) {
			const file = files[0];
			setPendingImageFile(file);
			const objectUrl = URL.createObjectURL(file);
			setPreviewImage(objectUrl);
			setIsUploadModalOpen(false);
		}
	};

	console.log("languages >>", languages);

	if (!user) {
		return <ViewSkeleton variant="split" />;
	}

	return (
		<>
			{successModalProps && <SuccessModal {...successModalProps} />}
			<div className="flex flex-col gap-4 w-full">
			<PageHeader title={t("settings_profile_title", "Perfil")} />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
				{/* Columna izquierda */}
				<div className="flex flex-col gap-4">
					<Card className="p-5 w-full gap-4">
						<div>
							<H2>{t("settings_profile_information_title")}</H2>
							<P>{t("settings_profile_information_description")}</P>
						</div>
						<div className="flex items-center gap-4 bg-content2 rounded-2xl p-3">
							<div
								className="cursor-pointer relative group"
								onClick={() => setIsUploadModalOpen(true)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setIsUploadModalOpen(true);
									}
								}}
								role="button"
								tabIndex={0}
							>
								<Avatar
									name={getFullName(user?.firstname || "", user?.lastname)}
									src={previewImage || user?.imageProfile}
									size="lg"
								/>
								<div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
									<IconComponent
										icon="solar:camera-add-bold"
										className="text-white text-xl"
									/>
								</div>
							</div>
							<div>
								<div className="font-medium text-sm">
									{getFullName(user?.firstname || "", user?.lastname)}
								</div>
								<div className="text-xs font-medium text-default-400">
									{user?.isAdmin ? t("role_admin") : t("role_user")}
								</div>
								<div className="text-xs font-medium text-default-400">
									{user?.email}
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-4">
							<Input
								label={t("field_firstname")}
								required
								placeholder={t("placeholder_enter_firstname")}
								value={formData.firstname}
								onChange={handleInputChange("firstname")}
							/>
							<Input
								label={t("field_lastname")}
								placeholder={t("placeholder_enter_lastname")}
								value={formData.lastname}
								onChange={handleInputChange("lastname")}
							/>
							<Phone
								translations={{
									placeholder: t("placeholder_enter_phone"),
									label: t("field_phone"),
									searchPlaceholder: t("placeholder_search_phone"),
									noCountriesFound: t("no_countries_found"),
								}}
								required
								value={formData.phone}
								onChange={handlePhoneChange}
								error={false}
								errorText={""}
							/>
						</div>
						{updateError && (
							<div className="mb-4 p-3 text-sm text-warning bg-warning-50 border border-warning-200 rounded-md">
								{updateError}
							</div>
						)}
						<Button
							className="w-36"
							onClick={handleSaveProfile}
							isLoading={isUpdatingProfile}
							isDisabled={!isProfileDirty}
						>
							{t("button_save")}
						</Button>
					</Card>
					{/* Card de Apariencia */}
					<Card className="p-5 w-full gap-4">
						<div>
							<H2>{t("settings_profile_appearance_title")}</H2>
							<P>{t("settings_profile_appearance_description")}</P>
						</div>
						<ThemePicker
							value={formData.theme}
							onChange={(newMode) => {
								// Actualizar el formData inmediatamente para feedback visual
								handleFormChange("theme", newMode);
								// Actualizar el contexto de tema para aplicar el cambio inmediatamente
								setMode(newMode);
								// Guardar en el backend
								handleSaveProfileTheme(newMode);
							}}
						/>
					</Card>
				</div>

				{/* Columna derecha */}
				<div className="flex flex-col gap-4">
					<Card className="p-4 w-full gap-4">
						<div className="pb-3">
							<H2 className="text-foreground">
								{t("settings_profile_modules_title")}
							</H2>
							<P>{t("settings_profile_modules_description")}</P>
						</div>
						<div className="flex flex-wrap gap-2">
							{modulesId?.map((moduleId) => {
								const iconName = getModuleIconByModuleId(moduleId);
								const name = moduleId.toLowerCase().replace(/-/g, "_");
								return (
									<Button
										key={moduleId}
										size="sm"
										color="primary"
										variant="flat"
										startContent={<IconComponent icon={iconName} />}
										className="h-8"
									>
										{t(`module_${name}`)}
									</Button>
								);
							})}
						</div>
					</Card>
					<Card className="p-5 w-full gap-4">
						<div>
							<H2>{t("settings_profile_language_title")}</H2>
							<P>{t("settings_profile_language_description")}</P>
						</div>
						<Select
							label={t("settings_profile_language_interface_label")}
							required
							placeholder={t("placeholder_select_language")}
							items={languages}
							defaultSelectedKeys={[formData.language]}
							disallowEmptySelection
							onSelectionChange={(keys) => {
								const selectedValue = Array.from(keys)[0] as string;
								if (selectedValue) {
									handleFormChange("language", selectedValue);
								}
							}}
						>
							{(item) => {
								const languageItem = item as SelectOption;
								return (
									<SelectItem key={languageItem.value}>
										{languageItem.label}
									</SelectItem>
								);
							}}
						</Select>
						<Button
							className="w-36"
							onClick={handleSaveProfileLanguage}
							isLoading={isUpdatingLanguage}
							isDisabled={!isLanguageDirty}
						>
							{t("button_save")}
						</Button>
					</Card>
					<Card className="p-5 w-full gap-4">
						<div>
							<H2>{t("settings_profile_password_title")}</H2>
							<P>{t("settings_profile_password_description")}</P>
						</div>
						{error && (
							<div className="mb-4 p-3 text-sm text-warning bg-warning-50 border border-warning-200 rounded-md">
								{error}
							</div>
						)}
						<Button
							className="w-fit"
							isLoading={isLoading}
							onPress={async () => {
								const response = await recoveryPassword(getUserId() as string);
								if (response.success) {
									const successModalProps: SuccessModalProps = {
										isOpen: true,
										onClose: () =>
											setSuccessModalProps({
												isOpen: false,
												// biome-ignore lint/suspicious/noEmptyBlockStatements: Reset function, not needed when modal is closed
												onClose: () => {},
											}),
										title: t("password_reset_email_sent_title"),
										message: t("password_reset_email_sent_message"),
										instructions: t("password_reset_email_sent_instructions"),
										buttonText: t("button_understood"),
									};
									setSuccessModalProps(successModalProps);
								}
							}}
						>
							{t("settings_profile_password_reset_button")}
						</Button>
					</Card>
				</div>
			</div>
			</div>

			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				size="md"
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						{t(
							"settings_profile_change_avatar_title",
							"Cambiar foto de perfil"
						)}
					</ModalHeader>
					<ModalBody className="items-center justify-center pb-4">
						<UploadFileComponent
							width="100%"
							height={320}
							acceptedFiles="image/*"
							maxFiles={1}
							cropConfig={{
								targetWidth: 500,
								targetHeight: 500,
							}}
							onUpload={handleImageUpload}
							translations={{
								uploadText: t(
									"settings_profile_upload_text",
									"Sube tu nueva foto de perfil"
								),
								subText: t(
									"settings_profile_upload_subtext",
									"PNG, JPG hasta 5MB. Dimensiones recomendadas 500x500"
								),
							}}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
