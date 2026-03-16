/**
 * Hook to handle Instagram OAuth redirect flow
 * Manages authorization URL retrieval, redirect, and callback handling
 */

import { httpService } from "@shared/infrastructure/services/api-http.service";
import { useCallback, useEffect, useState } from "react";
import {
	ChannelProvider,
	ChannelType,
	type CreateChannelRequestDto,
	type CreateChannelResponseDto,
	type InstagramRegistrationConfigDto,
	type RegistrationConfigResponseDto,
	isInstagramConfig,
} from "../../infrastructure/dtos/channels.dto";

// =============================================================================
// Constants
// =============================================================================

const INSTAGRAM_OAUTH_STATE_KEY = "instagram_oauth_state";
const INSTAGRAM_OAUTH_PENDING_KEY = "instagram_oauth_pending";

// =============================================================================
// Types
// =============================================================================

interface UseInstagramOAuthState {
	isLoading: boolean;
	error: string | null;
	success: boolean;
	channelId: string | null;
}

interface UseInstagramOAuthReturn extends UseInstagramOAuthState {
	initiateOAuth: () => Promise<void>;
	reset: () => void;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generates a cryptographically secure random state for CSRF protection
 */
function generateState(): string {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	// Fallback for older browsers
	return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Gets OAuth parameters from URL
 */
function getOAuthParamsFromUrl(): {
	code: string | null;
	state: string | null;
	error: string | null;
	errorDescription: string | null;
} {
	const urlParams = new URLSearchParams(window.location.search);
	return {
		code: urlParams.get("code"),
		state: urlParams.get("state"),
		error: urlParams.get("error"),
		errorDescription: urlParams.get("error_description"),
	};
}

/**
 * Cleans OAuth parameters from URL
 */
function cleanUrlParams(): void {
	const url = new URL(window.location.href);
	url.searchParams.delete("code");
	url.searchParams.delete("state");
	url.searchParams.delete("error");
	url.searchParams.delete("error_description");
	window.history.replaceState({}, document.title, url.pathname + url.search);
}

// =============================================================================
// Hook Implementation
// =============================================================================

export const useInstagramOAuth = (): UseInstagramOAuthReturn => {
	const [state, setState] = useState<UseInstagramOAuthState>({
		isLoading: false,
		error: null,
		success: false,
		channelId: null,
	});

	/**
	 * Handles the OAuth callback when user returns from Instagram
	 */
	const handleCallback = useCallback(async (code: string) => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			// Verify CSRF state
			const savedState = sessionStorage.getItem(INSTAGRAM_OAUTH_STATE_KEY);
			const { state: returnedState } = getOAuthParamsFromUrl();

			if (savedState && returnedState && savedState !== returnedState) {
				throw new Error("Security validation failed. Please try again.");
			}

			// Create channel with auth code
			const createRequest: CreateChannelRequestDto = {
				type: ChannelType.INSTAGRAM,
				provider: ChannelProvider.META_INSTAGRAM,
				channelName: "Instagram Business",
				platformId: `instagram-${Date.now()}`,
				config: {
					authCode: code,
				},
			};

			const response = await httpService.post<CreateChannelResponseDto>(
				"/channels",
				createRequest
			);

			if (response.success && response.data) {
				setState({
					isLoading: false,
					error: null,
					success: true,
					channelId: response.data.channelId || null,
				});
			} else {
				throw new Error(
					response.error?.message || "Failed to create Instagram channel"
				);
			}

			// Clean up session storage
			sessionStorage.removeItem(INSTAGRAM_OAUTH_STATE_KEY);
			sessionStorage.removeItem(INSTAGRAM_OAUTH_PENDING_KEY);
		} catch (err) {
			setState({
				isLoading: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to complete Instagram connection",
				success: false,
				channelId: null,
			});
		}
	}, []);

	// Handle OAuth callback from URL params on mount
	useEffect(() => {
		const { code, error, errorDescription } = getOAuthParamsFromUrl();
		const isPending = sessionStorage.getItem(INSTAGRAM_OAUTH_PENDING_KEY);

		// Only process if we have pending OAuth and URL params
		if (!isPending) {
			return;
		}

		// Clean URL params
		cleanUrlParams();

		if (code) {
			handleCallback(code);
		} else if (error) {
			setState({
				isLoading: false,
				error:
					errorDescription || "Instagram authorization was cancelled or failed",
				success: false,
				channelId: null,
			});
			// Clean up session storage
			sessionStorage.removeItem(INSTAGRAM_OAUTH_STATE_KEY);
			sessionStorage.removeItem(INSTAGRAM_OAUTH_PENDING_KEY);
		}
	}, [handleCallback]);

	/**
	 * Initiates the Instagram OAuth flow
	 */
	const initiateOAuth = useCallback(async () => {
		setState({
			isLoading: true,
			error: null,
			success: false,
			channelId: null,
		});

		try {
			// Generate CSRF state
			const oauthState = generateState();
			sessionStorage.setItem(INSTAGRAM_OAUTH_STATE_KEY, oauthState);
			sessionStorage.setItem(INSTAGRAM_OAUTH_PENDING_KEY, "true");

			// Get authorization URL from API
			const response = await httpService.get<RegistrationConfigResponseDto>(
				`/channels/registration-config?type=${ChannelType.INSTAGRAM}&provider=${ChannelProvider.META_INSTAGRAM}&state=${oauthState}`
			);

			if (!response.success || !response.data) {
				throw new Error(
					response.error?.message || "Failed to get Instagram authorization URL"
				);
			}

			const { config } = response.data;

			// Validate config is Instagram type
			if (!isInstagramConfig(config)) {
				throw new Error("Invalid registration config received");
			}

			const instagramConfig = config as InstagramRegistrationConfigDto;

			// Redirect to Instagram OAuth
			window.location.href = instagramConfig.authorizationUrl;
		} catch (err) {
			// Clean up on error
			sessionStorage.removeItem(INSTAGRAM_OAUTH_STATE_KEY);
			sessionStorage.removeItem(INSTAGRAM_OAUTH_PENDING_KEY);

			setState({
				isLoading: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to start Instagram connection",
				success: false,
				channelId: null,
			});
		}
	}, []);

	/**
	 * Resets the hook state
	 */
	const reset = useCallback(() => {
		setState({
			isLoading: false,
			error: null,
			success: false,
			channelId: null,
		});
		sessionStorage.removeItem(INSTAGRAM_OAUTH_STATE_KEY);
		sessionStorage.removeItem(INSTAGRAM_OAUTH_PENDING_KEY);
	}, []);

	return {
		...state,
		initiateOAuth,
		reset,
	};
};

export default useInstagramOAuth;
