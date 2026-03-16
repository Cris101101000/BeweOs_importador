/**
 * Hook to load and initialize the Facebook SDK for WhatsApp Embedded Signup
 */

import { useCallback, useEffect, useState } from "react";

// Facebook App ID from environment
const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID || "";
const FACEBOOK_SDK_VERSION = "v24.0";

// =============================================================================
// Global Types for Facebook SDK
// =============================================================================

export interface FBLoginResponse {
	authResponse?: {
		code: string;
		accessToken?: string;
		expiresIn?: number;
		signedRequest?: string;
		userID?: string;
	};
	status?: "connected" | "not_authorized" | "unknown";
}

export interface FBLoginOptions {
	config_id: string;
	auth_type: string;
	response_type: string;
	override_default_response_type: boolean;
	extras: {
		sessionInfoVersion: number;
		featureType: string;
		setup: {
			solutionID: string;
		};
	};
}

export interface FacebookSDK {
	init: (params: {
		appId: string;
		autoLogAppEvents: boolean;
		xfbml: boolean;
		version: string;
	}) => void;
	login: (
		callback: (response: FBLoginResponse) => void,
		options: FBLoginOptions
	) => void;
	getLoginStatus: (
		callback: (response: FBLoginResponse) => void,
		force?: boolean
	) => void;
	logout: (callback: () => void) => void;
}

// Extend Window interface for FB SDK
declare global {
	interface Window {
		FB?: FacebookSDK;
		fbAsyncInit?: () => void;
	}
}

// =============================================================================
// Hook State
// =============================================================================

interface UseFacebookSDKState {
	isReady: boolean;
	isLoading: boolean;
	error: string | null;
}

interface UseFacebookSDKReturn extends UseFacebookSDKState {
	FB: FacebookSDK | null;
	reload: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export const useFacebookSDK = (): UseFacebookSDKReturn => {
	const [state, setState] = useState<UseFacebookSDKState>({
		isReady: false,
		isLoading: true,
		error: null,
	});

	const loadSDK = useCallback(() => {
		// Check if SDK is already loaded
		if (window.FB) {
			setState({
				isReady: true,
				isLoading: false,
				error: null,
			});
			return;
		}

		// Check for App ID
		if (!FACEBOOK_APP_ID) {
			setState({
				isReady: false,
				isLoading: false,
				error: "Facebook App ID not configured",
			});
			return;
		}

		setState((prev) => ({ ...prev, isLoading: true, error: null }));

		// Initialize FB SDK when loaded
		window.fbAsyncInit = () => {
			if (window.FB) {
				window.FB.init({
					appId: FACEBOOK_APP_ID,
					autoLogAppEvents: true,
					xfbml: true,
					version: FACEBOOK_SDK_VERSION,
				});

				setState({
					isReady: true,
					isLoading: false,
					error: null,
				});
			}
		};

		// Check if script already exists
		const existingScript = document.getElementById("facebook-jssdk");
		if (existingScript) {
			// SDK script exists, check if FB is ready
			if (window.FB) {
				setState({
					isReady: true,
					isLoading: false,
					error: null,
				});
			}
			return;
		}

		// Load SDK script
		const script = document.createElement("script");
		script.id = "facebook-jssdk";
		script.async = true;
		script.defer = true;
		script.crossOrigin = "anonymous";
		script.src = "https://connect.facebook.net/es_ES/sdk.js";

		script.onerror = () => {
			setState({
				isReady: false,
				isLoading: false,
				error: "Failed to load Facebook SDK",
			});
		};

		// Insert script before the first script tag
		const firstScript = document.getElementsByTagName("script")[0];
		if (firstScript?.parentNode) {
			firstScript.parentNode.insertBefore(script, firstScript);
		} else {
			document.head.appendChild(script);
		}
	}, []);

	// Load SDK on mount
	useEffect(() => {
		loadSDK();
	}, [loadSDK]);

	return {
		...state,
		FB: state.isReady ? (window.FB ?? null) : null,
		reload: loadSDK,
	};
};

export default useFacebookSDK;
