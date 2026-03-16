import { Button, Card, Select, SelectItem } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import BookingWidget from "./components/BookingWidget";

interface WidgetConfig {
	clientInfoMode: "phone_only" | "email_only" | "phone_and_email";
	professionalSelection: "required" | "optional" | "disabled";
	flowOrder: "time_first" | "professional_first" | "client_choice";
}

const Widgets: React.FC = () => {
	const { t } = useTranslate();

	// ✅ Usar react-hook-form para manejo del estado del formulario
	const { control, watch } = useForm<WidgetConfig>({
		defaultValues: {
			clientInfoMode: "phone_and_email",
			professionalSelection: "optional",
			flowOrder: "time_first",
		},
	});

	// ✅ Observar cambios en el formulario
	const config = watch();
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	return (
		<div className="w-full flex flex-col gap-5">
			<h2 className="text-xl font-semibold">Widget de Agendamiento</h2>

			{/* Configuración */}
			<Card className="p-5 w-full gap-4">
				<div>
					<h2 className="font-medium text-lg">Configuración del Widget</h2>
					<p className="text-default-500 text-sm">
						Personaliza el flujo y comportamiento del widget de agendamiento
						para servicios individuales. Estos ajustes determinan qué
						información se solicita y cómo se presenta a tus clientes.
					</p>
				</div>
				<form className="flex flex-col gap-4" noValidate>
					{/* ✅ Información del Cliente - CORREGIDO */}
					<Controller
						name="clientInfoMode"
						control={control}
						render={({ field }) => (
							<Select
								label={t("settings_widgets_config_client_info")}
								placeholder={t("placeholder_select_option")}
								selectedKeys={field.value ? [field.value] : []}
								onSelectionChange={(keys) => {
									field.onChange(Array.from(keys)[0] || "");
								}}
								className="w-full"
								size="sm"
							>
								<SelectItem key="phone_only">
									{t("settings_widgets_config_phone_only")}
								</SelectItem>
								<SelectItem key="email_only">
									{t("settings_widgets_config_email_only")}
								</SelectItem>
								<SelectItem key="phone_and_email">
									{t("settings_widgets_config_phone_and_email")}
								</SelectItem>
							</Select>
						)}
					/>

					{/* ✅ Selección de Profesional - CORREGIDO */}
					<Controller
						name="professionalSelection"
						control={control}
						render={({ field }) => (
							<Select
								label={t("settings_widgets_config_professional_selection")}
								placeholder={t("placeholder_select_option")}
								selectedKeys={field.value ? [field.value] : []}
								onSelectionChange={(keys) => {
									field.onChange(Array.from(keys)[0] || "");
								}}
								className="w-full"
								size="sm"
							>
								<SelectItem key="required">
									{t("settings_widgets_config_professional_required")}
								</SelectItem>
								<SelectItem key="optional">
									{t("settings_widgets_config_professional_optional")}
								</SelectItem>
								<SelectItem key="disabled">
									{t("settings_widgets_config_professional_disabled")}
								</SelectItem>
							</Select>
						)}
					/>

					{/* ✅ Orden del Flujo - CORREGIDO */}
					<Controller
						name="flowOrder"
						control={control}
						render={({ field }) => (
							<>
								<Select
									label={t("settings_widgets_config_flow_order")}
									placeholder={t("placeholder_select_option")}
									selectedKeys={field.value ? [field.value] : []}
									onSelectionChange={(keys) => {
										field.onChange(Array.from(keys)[0] || "");
									}}
									className="w-full"
									size="sm"
								>
									<SelectItem key="time_first">
										{t("settings_widgets_config_flow_time_first")}
									</SelectItem>
									<SelectItem key="professional_first">
										{t("settings_widgets_config_flow_professional_first")}
									</SelectItem>
									<SelectItem key="client_choice">
										{t("settings_widgets_config_flow_client_choice")}
									</SelectItem>
								</Select>
								{/* ✅ Descripciones dinámicas */}
								<p className="text-xs text-default-500 mt-2">
									{field.value === "time_first" &&
										t("settings_widgets_config_flow_time_first_desc")}
									{field.value === "professional_first" &&
										t("settings_widgets_config_flow_professional_first_desc")}
									{field.value === "client_choice" &&
										t("settings_widgets_config_flow_client_choice_desc")}
								</p>
							</>
						)}
					/>
					<div className="flex gap-3 justify-end">
						<Button
							color="primary"
							onPress={() => setIsPreviewOpen(true)}
							className="w-36"
						>
							Vista Previa
						</Button>
						<Button variant="bordered" className="w-48">
							Añadir en tu página web
						</Button>
					</div>
				</form>
			</Card>

			{/* Widget de Booking */}
			{isPreviewOpen && (
				<BookingWidget
					isOpen={isPreviewOpen}
					onClose={() => setIsPreviewOpen(false)}
					config={config}
				/>
			)}
		</div>
	);
};

export default Widgets;
