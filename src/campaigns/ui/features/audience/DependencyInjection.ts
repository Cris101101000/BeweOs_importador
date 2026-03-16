import { AudienceAdapter } from "@campaigns/infrastructure/audience/adapters/AudienceAdapter";
import { CalculateAudienceSizeUseCase } from "@campaigns/application/audience/CalculateAudienceSizeUseCase";
import { GetAudienceDataUseCase } from "@campaigns/application/audience/GetAudienceDataUseCase";

// Adaptadores
const audienceAdapter = new AudienceAdapter();

// Casos de Uso
export const CalculateAudienceSize = () => new CalculateAudienceSizeUseCase(audienceAdapter);
export const GetAudienceData = () => new GetAudienceDataUseCase(audienceAdapter);
