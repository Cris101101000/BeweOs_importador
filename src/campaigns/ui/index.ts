/**
 * Exportaciones públicas de la capa UI del módulo campaigns organizada por features
 */

// Features Dependency Injection
export * as CampaignManagementDI from "./features/campaign-management/DependencyInjection";
export * as ProposedCampaignsDI from "./features/proposed-campaigns/DependencyInjection";
export * as TemplatesDI from "./features/templates/DependencyInjection";
export * as AudienceDI from "./features/audience/DependencyInjection";

// Shared types (UI-specific)
export * from "./_shared/types";

// Shared components
export * from "./_shared/components";

// Pages (entry points)
export { CampanasPage } from "./pages/campanas.page.tsx";
export { CreateCampaignPage } from "./pages/create-campaign-wizard.page.tsx";
