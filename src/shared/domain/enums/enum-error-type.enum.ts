import type { AlertProps } from "@beweco/aurora-ui";

/**
 * EnumErrorType represents the different types of errors that can occur in the application.
 *
 * Each error type is mapped to a specific toast color and severity level:
 * - CRITICAL: Serious errors that prevent normal operation (danger toast)
 * - VALIDATION: Form validation errors or invalid input (danger toast)
 * - NETWORK: Connection or API errors (danger toast)
 * - WARNING: Non-critical issues that need attention (warning toast)
 * - PERMISSION: Access denied or insufficient permissions (danger toast)
 * - TIMEOUT: Request timeout errors (warning toast)
 * - BUSINESS_RULE: Business logic violations (warning toast)
 */
export enum EnumErrorType {
	Critical = "critical",
	Validation = "validation_error",
	Network = "Failed to fetch",
	Warning = "warning",
	Permission = "permission",
	Timeout = "timeout",
	BusinessRule = "business_rule",
	Unexpected = "error_unexpected",
}

/**
 * Maps error types to their corresponding toast colors
 */
export const ERROR_TYPE_TO_COLOR_MAP: Record<
	EnumErrorType,
	AlertProps["color"]
> = {
	[EnumErrorType.Critical]: "danger",
	[EnumErrorType.Validation]: "danger",
	[EnumErrorType.Network]: "warning",
	[EnumErrorType.Warning]: "warning",
	[EnumErrorType.Permission]: "danger",
	[EnumErrorType.Timeout]: "warning",
	[EnumErrorType.BusinessRule]: "warning",
	[EnumErrorType.Unexpected]: "danger",
};

export const ERROR_TYPE_TO_TITLE_MAP: Record<EnumErrorType, string> = {
	[EnumErrorType.Critical]: "critical_error",
	[EnumErrorType.Validation]: "validation_error",
	[EnumErrorType.Network]: "connection_error",
	[EnumErrorType.Warning]: "warning",
	[EnumErrorType.Permission]: "permission",
	[EnumErrorType.Timeout]: "network_timeout",
	[EnumErrorType.BusinessRule]: "business_rule",
	[EnumErrorType.Unexpected]: "error_unexpected",
};
