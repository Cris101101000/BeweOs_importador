export { RetriveUrl, UploadFiles, StartTraining } from "@shared/features/linda/ingestion/ui/DependencyInjection";

import { BrandGuideAdapter } from "@shared/features/linda/brand-guide/infrastructure/adapters/brand-guide.adapter";
import { ExtractSimpleBrandGuideUseCase, type ExtractSimpleBrandGuideData } from "@shared/features/linda/brand-guide/application/extract-simple-brand-guide.usecase";

const brandGuideRepository = new BrandGuideAdapter();

export const ExtractSimpleBrandGuide = (data: ExtractSimpleBrandGuideData) =>
	new ExtractSimpleBrandGuideUseCase(brandGuideRepository).execute(data);
