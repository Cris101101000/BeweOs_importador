import { TemplateAdapter } from "@campaigns/infrastructure/templates/adapters/TemplateAdapter";
import { GetAllTemplatesUseCase } from "@campaigns/application/templates/GetAllTemplatesUseCase";

// Adaptadores
const templateAdapter = new TemplateAdapter();

// Casos de Uso
export const GetAllTemplates = () => new GetAllTemplatesUseCase(templateAdapter);
