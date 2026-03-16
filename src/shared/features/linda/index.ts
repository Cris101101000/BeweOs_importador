// Re-export all features
export * as ContentGeneration from './content-generation';
export * as IdeaBank from './idea-bank';
export * as BrandGuide from './brand-guide';
export * as Ingestion from "./ingestion";

// Direct exports for convenience - Content Generation
export { useContentGeneration } from './content-generation/ui';
export type { UseContentGenerationReturn } from './content-generation/ui';

// Direct exports for convenience - Idea Bank
export { useIdeaBank } from './idea-bank/ui';

// Direct exports for convenience - Brand Guide
export { useBrandGuide } from './brand-guide/ui';
export type { UseBrandGuideReturn } from './brand-guide/ui';
export type { IBrandGuide } from './brand-guide/domain';
export type { GenerateBrandGuideData } from './brand-guide/application';
