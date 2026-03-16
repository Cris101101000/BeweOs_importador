import { ProposedCampaignsAdapter } from "@campaigns/infrastructure/proposed-campaigns/adapters/ProposedCampaignsAdapter";
import { GetProposedCampaignsUseCase } from "@campaigns/application/proposed-campaigns/GetProposedCampaignsUseCase";
import { DeleteProposedCampaignUseCase } from "@campaigns/application/proposed-campaigns/DeleteProposedCampaignUseCase";

// Adaptadores
const proposedCampaignsAdapter = new ProposedCampaignsAdapter();

// Casos de Uso
export const GetProposedCampaigns = () => new GetProposedCampaignsUseCase(proposedCampaignsAdapter);
export const DeleteProposedCampaign = () => new DeleteProposedCampaignUseCase(proposedCampaignsAdapter);
