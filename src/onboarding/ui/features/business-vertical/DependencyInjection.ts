import {
	GetVerticalsUseCase,
	SaveVerticalUseCase,
} from "src/onboarding/application/business-vertical";
import { BusinessVerticalAdapter } from "src/onboarding/infrastructure/business-vertical";

const repository = new BusinessVerticalAdapter();

export const GetVerticals = () =>
	new GetVerticalsUseCase(repository).execute();

export const SaveVertical = (vertical: string) =>
	new SaveVerticalUseCase(repository).execute(vertical);
