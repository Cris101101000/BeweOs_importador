import { GetBusinessInformationUseCase } from "@settings/bussinesConfig/application/get-business-information.usecase";
import { UpdateBrandProfileUseCase } from "@settings/bussinesConfig/application/update-brand-profile.usecase";
import { CompanyOnboardingAdapter } from "../../../infrastructure/company-onboarding";
import {
	type ExtractBrandGuideData,
	ExtractBrandGuideUseCase,
} from "@shared/features/linda/brand-guide/application/extract-brand-guide.usecase";
import { GetBrandGuideUseCase } from "@shared/features/linda/brand-guide/application/get-brand-guide.usecase";
import { PatchLogoFileUseCase } from "@shared/features/linda/brand-guide/application/patch-logo-file.usecase";
import { UpdateBrandGuideUseCase } from "@shared/features/linda/brand-guide/application/update-brand-guide.usecase";
import type { IBrandGuide } from "@shared/features/linda/brand-guide/domain/interfaces/brand-guide.interface";
import { BrandGuideAdapter } from "@shared/features/linda/brand-guide/infrastructure/adapters/brand-guide.adapter";

const repository = new BrandGuideAdapter();
const businessInfoAdapter = new CompanyOnboardingAdapter();

export const GetBrandGuide = () =>
	new GetBrandGuideUseCase(repository).execute();

export const UpdateBrandGuide = (data: Partial<IBrandGuide>) =>
	new UpdateBrandGuideUseCase(repository).execute(data);

export const PatchLogoFile = (file: File) =>
	new PatchLogoFileUseCase(repository).execute(file);

export const ExtractBrandGuide = (data: ExtractBrandGuideData) =>
	new ExtractBrandGuideUseCase(repository).execute(data);

export const GetBusinessInformation = () =>
	new GetBusinessInformationUseCase(businessInfoAdapter).execute();

export const UpdateBrandProfile = (data: { businessName: string }) => 
	new UpdateBrandProfileUseCase(businessInfoAdapter).execute(data);
