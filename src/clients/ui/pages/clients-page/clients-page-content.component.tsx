/**
 * ClientsPageContent Component
 *
 * Memoized content component that renders the main UI structure for the clients page.
 * This component is separated from the main ClientsPage to optimize performance
 * and prevent unnecessary re-renders of the UI when context data changes.
 *
 * @component
 */

import { Button, IconComponent, Tab, Tabs } from "@beweco/aurora-ui";
import { ClientViewMode } from "@clients/domain/enums/client-view.enum";
import { useTranslate } from "@tolgee/react";
import React, { type FC } from "react";
import { Outlet } from "react-router-dom";
import { FiltersContainer } from "@clients/ui/_shared/components";
import type { ClientsPageContentProps } from "./clients-page.types";
import { PageHeader } from "@shared/ui/components";

/**
 * Memoized content component to prevent unnecessary re-renders
 *
 * This component handles the UI rendering and is memoized to optimize performance.
 * It receives all necessary data and callbacks as props to maintain proper separation
 * of concerns between data management and UI rendering.
 */
export const ClientsPageContent: FC<ClientsPageContentProps> = React.memo(
	({
		viewMode,
		totalClients,
		isLoadingClients,
		isLoadingFields,
		outletContext,
		onViewModeChange,
		onCreateCampaign: _onCreateCampaign,
		onOpenQuickContact,
		onOpenWizard,
	}) => {
		const { t } = useTranslate();

		return (
			<div className="w-full flex flex-col gap-4">
				{/* Page Header Section */}
				<PageHeader
					title={t("clients_subtitle", "Listado de Contactos")}
					metadata={[
						{
							key: "total",
							label: isLoadingClients ? "..." : String(totalClients),
							color: "default",
							variant: "flat",
						},
					]}
					actions={
						<>
							{/* // TODO: Add translation for create campaign */}
							{/* <Button
								variant="flat"
								color="secondary"
								onPress={onCreateCampaign}
								size="sm"
								className="w-full sm:w-auto"
								aria-label={t(
									"button_create_campaign_aria",
									"Crear nueva campaña"
								)}
								endContent={
									<IconComponent
										icon="solar:chart-bold"
										size="sm"
										className="text-secondary"
									/>
								}
							>
								<span className="sm:hidden">
									{t("button_create_campaign_short", "Campaña")}
								</span>
								<span className="hidden sm:inline">
									{t("button_create_campaign", "Crear campaña")}
								</span>
							</Button> */}
							<Button
								variant="bordered"
								color="primary"
								onPress={onOpenQuickContact}
								size="sm"
								className="w-full sm:w-auto"
								aria-label={t(
									"button_new_contact_fast_aria",
									"Crear contacto rápido"
								)}
								endContent={
									<IconComponent
										icon="solar:rocket-bold"
										size="sm"
										className="text-primary"
									/>
								}
							>
								<span className="sm:hidden">
									{t("button_new_contact_fast_short", "Contacto rápido")}
								</span>
								<span className="hidden sm:inline">
									{t("button_new_contact_fast", "Crear contacto rápido")}
								</span>
							</Button>
							<Button
								variant="solid"
								color="primary"
								onPress={onOpenWizard}
								size="sm"
								className="w-full sm:w-auto"
								aria-label={t(
									"button_new_contact_aria",
									"Crear nuevo contacto"
								)}
								endContent={
									<IconComponent icon="solar:users-group-two-rounded-bold" />
								}
							>
								<span className="sm:hidden">
									{t("button_new_contact_short", "Nuevo contacto")}
								</span>
								<span className="hidden sm:inline">
									{t("button_new_contact", "Nuevo contacto")}
								</span>
							</Button>
						</>
					}
				/>

				{/* View Mode Switcher */}
				<nav
					aria-label={t(
						"clients_navigation_aria",
						"Navegación de vistas de clientes"
					)}
				>
					<Tabs
						aria-label={t("clients_view_switch_aria", "Cambiar vista")}
						selectedKey={viewMode}
						onSelectionChange={onViewModeChange}
					>
						<Tab
							key={ClientViewMode.Table}
							className="w-28"
							title={t("clients_view_table", "Tabla")}
						/>
						<Tab
							key={ClientViewMode.Kanban}
							className="w-28"
							title={t("clients_view_kanban", "Kanban")}
						/>
					</Tabs>
				</nav>

				{/* Main Content Area */}
				<main
					aria-label={t(
						"clients_main_content_aria",
						"Contenido principal de clientes"
					)}
					aria-busy={isLoadingFields}
				>
					<Outlet context={outletContext} />
				</main>

				{/* Filter Drawer accesible desde Table o Kanban */}
				<FiltersContainer />
			</div>
		);
	}
);

ClientsPageContent.displayName = "ClientsPageContent";
