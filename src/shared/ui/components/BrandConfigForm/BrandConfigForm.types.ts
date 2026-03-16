/**
 * Types for BrandConfigForm Component
 * Form for brand configuration (colors, communication guide, logo)
 */

export interface BrandConfig {
  /** Brand logo URL or path */
  logo: string;
  /** Whether to use the logo in generated content */
  useLogo: boolean;
  /** Primary brand color in hex format (#RRGGBB) */
  primaryColor: string;
  /** Secondary brand color in hex format (#RRGGBB) */
  secondaryColor: string;
  /** General communication prompt/guidelines for AI */
  generalPrompt: string;
}

export interface BrandConfigFormTranslations {
  /** Label for brand colors section */
  colorsLabel: string;
  /** Label for primary color */
  primaryColorLabel: string;
  /** Label for secondary color */
  secondaryColorLabel: string;
  /** Label for communication guide section */
  communicationGuideLabel: string;
  /** Placeholder for communication guide textarea */
  communicationGuidePlaceholder: string;
  /** Label for use logo toggle */
  useLogoLabel: string;
  /** Label for logo section */
  logoLabel?: string;
  /** Text for recommended logo size */
  logoRecommendedSize?: string;
  /** Text shown when uploading logo */
  logoUploadingText?: string;
  /** Uploader translations */
  uploaderClickOrDragText?: string;
  uploaderDropText?: string;
  uploaderMultipleFilesError?: string;
  uploaderMaxFilesError?: string;
  uploaderInvalidFileTypeError?: string;
  uploaderRemoveFileAriaLabel?: string;
  uploaderUploadAreaAriaLabel?: string;
  uploaderCropModalTitle?: string;
  uploaderCropSaveButton?: string;
  uploaderCropCancelButton?: string;
  uploaderCropZoomLabel?: string;
  uploaderCropInstructions?: string;
  uploaderCropBackgroundLabel?: string;
  uploaderCropBackgroundWhite?: string;
  uploaderCropBackgroundBlack?: string;
  uploaderCropBackgroundTransparent?: string;
}

export interface BrandConfigFormProps {
  /** Current brand configuration values */
  value: BrandConfig;
  /** Callback when any configuration value changes */
  onChange: (config: Partial<BrandConfig>) => void;
  /** Translation strings */
  translations?: Partial<BrandConfigFormTranslations>;
  /** Whether to show the colors section */
  showColors?: boolean;
  /** Whether to show the communication guide section */
  showCommunicationGuide?: boolean;
  /** Whether to show the use logo toggle */
  showUseLogo?: boolean;
  /** Additional className for the container */
  className?: string;
  /** Callback when logo files are uploaded (receives File[]) */
  onLogoUpload?: (files: File[]) => void;
  /** Callback when logo is removed */
  onLogoRemove?: () => void;
  /** Whether logo is currently being uploaded */
  isUploadingLogo?: boolean;
  /** Error callback for logo upload errors */
  onLogoError?: (error: string) => void;
  /** Whether the form is in read-only mode (all inputs disabled) */
  isReadOnly?: boolean;
}
