/**
 * Instagram OAuth Callback Page
 * Handles the OAuth redirect from Instagram and creates the channel
 * Path: /instagram/login
 */

import { Spinner } from "@beweco/aurora-ui";
import { useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInstagramOAuth } from "../hooks/use-instagram-oauth.hook";

const InstagramCallbackPage: FC = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();
	const { showToast } = useAuraToast();

	// The hook automatically handles the OAuth callback when URL params are present
	const { isLoading, error, success, channelId } = useInstagramOAuth();

	// Handle success or error states
	useEffect(() => {
		if (success && channelId) {
			// Show success toast
			showToast(
				configureSuccessToast(
					t("integrations_instagram_success_title", "Instagram conectado"),
					t(
						"integrations_instagram_success_description",
						"Tu cuenta de Instagram Business se ha conectado exitosamente"
					)
				)
			);

			// Redirect to integrations page after a brief delay
			setTimeout(() => {
				navigate("/integrations", { replace: true });
			}, 1500);
		} else if (error) {
			// Show error toast
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"integrations_instagram_error_title",
					"integrations_instagram_error_description"
				)
			);

			// Redirect to integrations page after a brief delay
			setTimeout(() => {
				navigate("/integrations", { replace: true });
			}, 2000);
		}
	}, [success, error, channelId, navigate, showToast, t]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
			<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
				{/* Instagram Logo */}
				<div className="flex justify-center mb-6">
					<div className="w-16 h-16 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center">
						<svg
							className="w-10 h-10 text-white"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Instagram</title>
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
						</svg>
					</div>
				</div>

				{/* Content */}
				<div className="text-center">
					{isLoading && (
						<>
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								{t(
									"integrations_instagram_connecting_title",
									"Conectando Instagram"
								)}
							</h2>
							<p className="text-gray-600 mb-6">
								{t(
									"integrations_instagram_connecting_description",
									"Estamos procesando tu autorización y configurando tu cuenta..."
								)}
							</p>
							<Spinner size="lg" color="primary" />
						</>
					)}

					{success && (
						<>
							<div className="flex justify-center mb-4">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
									<svg
										className="w-8 h-8 text-green-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Éxito</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								{t("integrations_instagram_success_title", "¡Conectado!")}
							</h2>
							<p className="text-gray-600 mb-6">
								{t(
									"integrations_instagram_success_redirect",
									"Redirigiendo a integraciones..."
								)}
							</p>
						</>
					)}

					{error && (
						<>
							<div className="flex justify-center mb-4">
								<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
									<svg
										className="w-8 h-8 text-red-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Error</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</div>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								{t("integrations_instagram_error_title", "Error al conectar")}
							</h2>
							<p className="text-red-600 mb-6">{error}</p>
							<p className="text-gray-600 text-sm">
								{t(
									"integrations_instagram_error_redirect",
									"Redirigiendo de vuelta a integraciones..."
								)}
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default InstagramCallbackPage;
