import { CreateContentPage } from "@social-networks/ui/content-creation/pages/create-content.page";
import { Navigate, Route, Routes } from "react-router-dom";
import { CampanasPage } from "./campaigns/ui";
import { CreateCampaignPage } from "./campaigns/ui/pages/create-campaign-wizard.page";
import { ProductsPage, ServicesPage } from "./catalog/ui";
import ProductDetailPage from "./catalog/ui/pages/product-detail.page";
import ServiceDetailPage from "./catalog/ui/pages/service-detail.page";
import { ClientsPage } from "./clients/ui/pages/clients-page/clients.page";
import ClientDetailsPage from "./clients/ui/pages/details/client-details.page";
import { ContactListScreen } from "./clients/ui/features/contact-list/screens";
import { KanbanScreen } from "./clients/ui/features/kanban-view/screens";
import Dashboard from "./dashboard/ui/pages/Dashboard";
import {
	InstagramCallbackPage,
	IntegrationsPage,
} from "./integrations/ui/pages";
import { ChatbotConfigPage } from "./lindaConfig/ui";
import { PricingPage } from "./pricing/ui";
import { OnboardingPage } from "./onboarding/ui";
import Profile from "./settings/profile/ui/Profile";
import Settings from "./settings/ui/Settings";
import { SmartTagDetailPage, SmartTagsPage } from "./smart-tags/ui";
import { NotificationsPage } from "./automatic-notifications/ui";
import { SocialNetworksPage } from "./social-networks/ui";

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/clients" replace />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/clients" element={<ClientsPage />}>
				<Route index element={<Navigate to="table" replace />} />
				<Route path="table" element={<ContactListScreen />} />
				<Route path="kanban" element={<KanbanScreen />} />
			</Route>
			<Route path="/clients/details/:id" element={<ClientDetailsPage />} />
			<Route path="/catalog/products" element={<ProductsPage />} />
			<Route
				path="/catalog/products/:productId"
				element={<ProductDetailPage />}
			/>
			<Route path="/catalog/services" element={<ServicesPage />} />
			<Route
				path="/catalog/services/:serviceId"
				element={<ServiceDetailPage />}
			/>
			<Route path="/settings" element={<Settings />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/integrations" element={<IntegrationsPage />} />
			<Route path="/instagram/login" element={<InstagramCallbackPage />} />
			<Route path="/pricing" element={<PricingPage />} />
			<Route path="/onboarding" element={<OnboardingPage />} />
			<Route path="/social-networks" element={<SocialNetworksPage />} />
			<Route
				path="/social-networks/create-content"
				element={<CreateContentPage />}
			/>
			<Route path="/chatbot" element={<ChatbotConfigPage businessId="1" />} />

			{/* Etiquetas Inteligentes Route */}
			<Route path="/intelligent-tags" element={<SmartTagsPage />} />
			<Route path="/intelligent-tags/:id" element={<SmartTagDetailPage />} />

		    <Route path="/automatic-notifications" element={<NotificationsPage />} />

			
			{/* Campaigns Route */}
			<Route path="/campaigns" element={<CampanasPage />} />
			<Route
				path="/campaigns/create-campaign"
				element={<CreateCampaignPage />}
			/>
		</Routes>
	);
};
