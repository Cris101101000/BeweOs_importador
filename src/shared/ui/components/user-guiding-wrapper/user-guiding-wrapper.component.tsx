import { useEffect, useRef } from "react";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { useTolgee } from "@tolgee/react";

// Extend Window interface for UserGuiding
declare global {
	interface Window {
		userGuiding?: {
			identify: (
				userId: string,
				attributes?: Record<string, unknown>
			) => void;
			track: (eventName: string, properties?: Record<string, unknown>) => void;
			previewGuide: (guideId: string) => void;
			finishPreview: () => void;
			triggerNps: () => void;
			hideChecklist: () => void;
			launchChecklist: () => void;
			q?: unknown[];
		};
		userGuidingLayer?: unknown[];
	}
}

/**
 * UserGuiding Wrapper Component
 *
 * Integrates UserGuiding for user onboarding, product tours, and tooltips.
 * Automatically provides user data from session context.
 */
export const UserGuidingWrapper = () => {
	const { user, agency } = useSession();
	const tolgee = useTolgee(["language"]);
	const isInitialized = useRef(false);

	// Get container key from environment
	const containerKey = process.env.REACT_APP_USER_GUIDING_CONTAINER_KEY;

	// Check if UserGuiding should be enabled
	const isEnabled =
		!!containerKey &&
		(agency?.configurations?.userGuidingEnabled === undefined ||
			agency?.configurations?.userGuidingEnabled);

	// Load UserGuiding script
	useEffect(() => {
		if (!isEnabled || !containerKey || isInitialized.current) {
			return;
		}

		// Check if script already exists
		const existingScript = document.querySelector(
			'script[src*="userguiding"]'
		);
		if (existingScript) {
			isInitialized.current = true;
			return;
		}

		// Initialize UserGuiding layer
		window.userGuidingLayer = window.userGuidingLayer || [];

		// Create and load the script
		const script = document.createElement("script");
		script.async = true;
		script.src = `https://static.userguiding.com/media/user-guiding-${containerKey}-embedded.js`;

		script.onload = () => {
			if (process.env.NODE_ENV === "development") {
				console.log("✅ UserGuiding - Script loaded successfully");
			}
			isInitialized.current = true;
		};

		script.onerror = () => {
			console.error("❌ UserGuiding - Failed to load script");
		};

		// Insert script into document
		const firstScript = document.getElementsByTagName("script")[0];
		if (firstScript?.parentNode) {
			firstScript.parentNode.insertBefore(script, firstScript);
		} else {
			document.head.appendChild(script);
		}

		// Initialize userGuiding object with queue
		if (!window.userGuiding) {
			const queue: unknown[] = [];
			const createMethod = (methodName: string) => {
				return (...args: unknown[]) => {
					queue.push([methodName, args]);
				};
			};

			window.userGuiding = {
				q: queue,
				identify: createMethod("identify"),
				track: createMethod("track"),
				previewGuide: createMethod("previewGuide"),
				finishPreview: createMethod("finishPreview"),
				triggerNps: createMethod("triggerNps"),
				hideChecklist: createMethod("hideChecklist"),
				launchChecklist: createMethod("launchChecklist"),
			};
		}

		return () => {
			// Cleanup is optional - UserGuiding typically stays loaded
		};
	}, [isEnabled, containerKey]);

	// Identify user when user data is available
	useEffect(() => {
		if (!isEnabled || !user || !window.userGuiding?.identify) {
			return;
		}

		const userId = user.id || user.email;

		if (!userId) {
			console.warn("⚠️ UserGuiding - User has no id or email");
			return;
		}

		// Get current language
		const currentLanguage = tolgee.getLanguage() || "en";

		// Prepare user attributes
		const userAttributes = {
			email: user.email,
			name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
			firstname: user.firstname,
			lastname: user.lastname,
			language: currentLanguage,
			role: user.isAdmin ? "admin" : "user",
			platform: "BeweOS SMBS",
			agencyId: agency?.id,
			agencyName: agency?.name,
		};

		// Identify user in UserGuiding
		window.userGuiding.identify(userId, userAttributes);

		if (process.env.NODE_ENV === "development") {
			console.log("✅ UserGuiding - User identified:", {
				userId,
				...userAttributes,
			});
		}
	}, [isEnabled, user, agency, tolgee]);

	// Don't render if not enabled
	if (!isEnabled || !containerKey) {
		if (process.env.NODE_ENV === "development") {
			console.log(
				"⚠️ UserGuiding - Not enabled (container key missing or disabled by agency)"
			);
		}
		return null;
	}

	// Don't render if no user
	if (!user) {
		if (process.env.NODE_ENV === "development") {
			console.log("⏳ UserGuiding - Waiting for user data...");
		}
		return null;
	}

	// UserGuiding doesn't require a visible component
	return null;
};
