/**
 * Hook to handle WhatsApp Embedded Signup flow
 * Uses Facebook SDK to open the embedded signup modal and captures the response
 */

import { httpService } from "@shared/infrastructure/services/api-http.service";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ChannelProvider,
	ChannelType,
	type CreateChannelRequestDto,
	type CreateChannelResponseDto,
	type RegistrationConfigResponseDto,
	type WhatsAppRegistrationConfigDto,
	isWhatsAppConfig,
} from "../../infrastructure/dtos/channels.dto";
import type { FBLoginResponse, FacebookSDK } from "./use-facebook-sdk.hook";

// =============================================================================
// Types
// =============================================================================

export interface EmbeddedSignupData {
	phone_number_id: string;
	waba_id: string;
	business_id: string;
}

interface WhatsAppEmbeddedSignupEvent {
	type: "WA_EMBEDDED_SIGNUP";
	event: "FINISH" | "CANCEL" | "ERROR" | "SUBMIT";
	data?: EmbeddedSignupData;
}

interface UseWhatsAppSignupState {
	isLoading: boolean;
	error: string | null;
	success: boolean;
	channelId: string | null;
}

interface UseWhatsAppSignupReturn extends UseWhatsAppSignupState {
	initiateSignup: () => Promise<void>;
	reset: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export const useWhatsAppSignup = (
	fb: FacebookSDK | null,
	fbSdkReady: boolean
): UseWhatsAppSignupReturn => {
	const [state, setState] = useState<UseWhatsAppSignupState>({
		isLoading: false,
		error: null,
		success: false,
		channelId: null,
	});

	// Store embedded signup data from postMessage
	const embeddedSignupDataRef = useRef<EmbeddedSignupData | null>(null);

	// Listen for postMessage events from Meta iframe
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			// Only accept messages from Facebook domains
			if (
				!event.origin.endsWith("facebook.com") &&
				!event.origin.endsWith("meta.com")
			) {
				return;
			}

			try {
				// Parse the message data
				const data =
					typeof event.data === "string"
						? (JSON.parse(event.data) as WhatsAppEmbeddedSignupEvent)
						: (event.data as WhatsAppEmbeddedSignupEvent);

				if (data.type === "WA_EMBEDDED_SIGNUP") {
					switch (data.event) {
						case "FINISH":
							if (data.data) {
								embeddedSignupDataRef.current = data.data;
							}
							break;
						case "CANCEL":
						case "ERROR":
							embeddedSignupDataRef.current = null;
							break;
						case "SUBMIT":
							// Intermediate state, wait for FINISH
							break;
					}
				}
			} catch {
				// Non-JSON message or invalid format, ignore
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	const initiateSignup = useCallback(async () => {
		// Validate prerequisites
		if (!fbSdkReady || !fb) {
			setState((prev) => ({
				...prev,
				error: "Facebook SDK not ready. Please try again.",
			}));
			return;
		}

		setState({
			isLoading: true,
			error: null,
			success: false,
			channelId: null,
		});

		// Reset embedded signup data
		embeddedSignupDataRef.current = null;

		try {
			// 1. Get registration config from API
			const configResponse =
				await httpService.get<RegistrationConfigResponseDto>(
					`/channels/registration-config?type=${ChannelType.WHATSAPP}&provider=${ChannelProvider.GUPSHUP}`
				);

			if (!configResponse.success || !configResponse.data) {
				throw new Error(
					configResponse.error?.message || "Failed to get registration config"
				);
			}

			const { config } = configResponse.data;

			// Validate config is WhatsApp type
			if (!isWhatsAppConfig(config)) {
				throw new Error("Invalid registration config received");
			}

			const whatsAppConfig = config as WhatsAppRegistrationConfigDto;

			// 2. Open FB.login with Embedded Signup configuration
			// Note: FB.login callback must be synchronous, so we use an IIFE for async operations
			fb.login(
				(response: FBLoginResponse) => {
					if (response.authResponse) {
						// Handle async operations inside a non-async callback using IIFE
						(async () => {
							// Wait a moment for postMessage with embedded signup data
							await new Promise((resolve) => setTimeout(resolve, 1000));

							const embeddedData = embeddedSignupDataRef.current;

							if (embeddedData) {
								try {
									// 3. Create channel with API
									const createRequest: CreateChannelRequestDto = {
										type: ChannelType.WHATSAPP,
										provider: ChannelProvider.GUPSHUP,
										channelName: `WhatsApp ${embeddedData.phone_number_id}`,
										platformId: embeddedData.phone_number_id,
										config: {
											embeddedSignupData: embeddedData,
										},
									};

									const createResponse =
										await httpService.post<CreateChannelResponseDto>(
											"/channels",
											createRequest
										);

									if (createResponse.success && createResponse.data) {
										setState({
											isLoading: false,
											error: null,
											success: true,
											channelId: createResponse.data.channelId || null,
										});
									} else {
										throw new Error(
											createResponse.error?.message ||
												"Failed to create channel"
										);
									}
								} catch (createError) {
									setState({
										isLoading: false,
										error:
											createError instanceof Error
												? createError.message
												: "Failed to create WhatsApp channel",
										success: false,
										channelId: null,
									});
								}
							} else {
								setState({
									isLoading: false,
									error: "No signup data received from WhatsApp",
									success: false,
									channelId: null,
								});
							}
						})();
					} else {
						// User cancelled or authorization failed
						setState({
							isLoading: false,
							error: "WhatsApp signup was cancelled",
							success: false,
							channelId: null,
						});
					}
				},
				{
					config_id: whatsAppConfig.configurationId,
					auth_type: "rerequest",
					response_type: "code",
					override_default_response_type: true,
					extras: {
						sessionInfoVersion: 3,
						featureType: "",
						setup: {
							solutionID: whatsAppConfig.solutionId,
						},
					},
				}
			);
		} catch (err) {
			setState({
				isLoading: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to start WhatsApp signup",
				success: false,
				channelId: null,
			});
		}
	}, [fb, fbSdkReady]);

	const reset = useCallback(() => {
		setState({
			isLoading: false,
			error: null,
			success: false,
			channelId: null,
		});
		embeddedSignupDataRef.current = null;
	}, []);

	return {
		...state,
		initiateSignup,
		reset,
	};
};

export default useWhatsAppSignup;
