import { CampaignAdapter } from "@campaigns/infrastructure/campaign-management/adapters/CampaignAdapter";
import { CreateCampaignUseCase } from "@campaigns/application/campaign-management/CreateCampaignUseCase";
import { GetAllCampaignsUseCase } from "@campaigns/application/campaign-management/GetAllCampaignsUseCase";

// Adaptadores
const campaignAdapter = new CampaignAdapter();

// Casos de Uso
export const CreateCampaign = () => new CreateCampaignUseCase(campaignAdapter);
export const GetAllCampaigns = () => new GetAllCampaignsUseCase(campaignAdapter);
