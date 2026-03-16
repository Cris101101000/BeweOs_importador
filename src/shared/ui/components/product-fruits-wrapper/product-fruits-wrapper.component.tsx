import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { useTolgee } from "@tolgee/react";
import { ProductFruits } from "react-product-fruits";

/**
 * Product Fruits Wrapper Component
 *
 * Wraps the ProductFruits component from react-product-fruits library
 * and automatically provides user data from session context
 */
export const ProductFruitsWrapper = () => {
	const { user, agency } = useSession();
	const tolgee = useTolgee(["language"]);
	console.log("lenguaje tolgee", tolgee.getLanguage());
	console.log("lenguaje user", user?.language);

	// Get workspace code from environment
	const workspaceCode = process.env.REACT_APP_PRODUCT_FRUITS_CODE;

	// Check if Product Fruits should be enabled
	const isEnabled =
		!!workspaceCode &&
		(agency?.configurations?.productFruitsEnabled === undefined ||
			agency?.configurations?.productFruitsEnabled);

	// Don't render if not enabled or no workspace code
	if (!isEnabled || !workspaceCode) {
		if (process.env.NODE_ENV === "development") {
			console.log(
				"⚠️ Product Fruits - Not enabled (workspace code missing or disabled by agency)"
			);
		}
		return null;
	}

	// Don't render if no user data
	if (!user) {
		if (process.env.NODE_ENV === "development") {
			console.log("⏳ Product Fruits - Waiting for user data...");
		}
		return null;
	}

	// Prepare user identifier (email)
	const userId = user.id || user.email;

	if (!userId) {
		console.warn("⚠️ Product Fruits - User has no id or email");
		return null;
	}

	// Get current language
	const currentLanguage = tolgee.getLanguage() || "en";
	console.log("currentLanguage", currentLanguage);

	// Prepare user name
	const emailPrefix = user.email.split("@")[0];

	// Prepare user info for Product Fruits
	const userInfo = {
		username: userId,
		email: user.email,
		firstname: user.firstname || emailPrefix,
		lastname: user.lastname,
		role: user.isAdmin ? "admin" : "user",
		props: {
			// Add any additional custom properties here
			platform: "BeweOS SMBS",
		},
	};

	// Log in development
	if (process.env.NODE_ENV === "development") {
		console.log("✅ Product Fruits - Rendering component with data:", {
			workspaceCode,
			language: currentLanguage,
			user: {
				username: userInfo.username,
				email: userInfo.email,
				firstname: userInfo.firstname,
				lastname: userInfo.lastname,
				role: userInfo.role,
			},
		});
	}

	return (
		<ProductFruits
			workspaceCode={workspaceCode}
			language={currentLanguage}
			user={userInfo}
		/>
	);
};
