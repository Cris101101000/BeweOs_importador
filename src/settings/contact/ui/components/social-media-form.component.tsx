import { Button, Card, Input } from "@beweco/aurora-ui";
import type { ISocialNetwork } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useSocialMediaForm } from "../hooks/use-social-media-form.hook";

/**
 * Props for the SocialMediaForm component
 */
interface SocialMediaFormProps {
	/** Initial social network data to populate the form */
	socialNetwork: ISocialNetwork;
	/** Callback to refresh data after successful update */
	onDataUpdated?: () => void;
}

/**
 * Social Media Form Component
 *
 * A form component for managing social media URLs (Instagram, Facebook, TikTok, Twitter, LinkedIn).
 * Features include:
 * - URL validation with optional fields
 * - Real-time form validation
 * - Loading states during submission
 * - Automatic form reset when initial data changes
 *
 * @param props - Component props
 * @returns JSX element representing the social media form
 */
export const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
	socialNetwork,
	onDataUpdated,
}) => {
	const { t } = useTranslate();

	const { register, handleSubmit, errors, isValid, isSubmitting } =
		useSocialMediaForm({
			initialData: socialNetwork,
			onSuccess: () => {
				console.log("Social media updated successfully");
			},
			onError: (error) => {
				console.error("Failed to update social media:", error);
			},
			onDataUpdated,
		});

	return (
		<Card className="p-5 w-full gap-4">
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_contact_social_media_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_contact_social_media_description")}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
				<Input
					label={t("settings_contact_social_media_instagram")}
					placeholder="https://instagram.com/tunegocio"
					{...register("instagramUrl")}
					isInvalid={!!errors.instagramUrl}
					errorMessage={errors.instagramUrl?.message}
				/>

				<Input
					label={t("settings_contact_social_media_facebook")}
					placeholder="https://facebook.com/tunegocio"
					{...register("facebookUrl")}
					isInvalid={!!errors.facebookUrl}
					errorMessage={errors.facebookUrl?.message}
				/>

				<Input
					label={t("settings_contact_social_media_tiktok")}
					placeholder="https://tiktok.com/@tunegocio"
					{...register("tiktokUrl")}
					isInvalid={!!errors.tiktokUrl}
					errorMessage={errors.tiktokUrl?.message}
				/>

				<Input
					label={t("settings_contact_social_media_twitter")}
					placeholder="https://twitter.com/tunegocio"
					{...register("twitterUrl")}
					isInvalid={!!errors.twitterUrl}
					errorMessage={errors.twitterUrl?.message}
				/>

				<Input
					label={t("settings_contact_social_media_linkedin")}
					placeholder="https://linkedin.com/company/tunegocio"
					{...register("linkedinUrl")}
					isInvalid={!!errors.linkedinUrl}
					errorMessage={errors.linkedinUrl?.message}
				/>

				<Button
					type="submit"
					className="w-36"
					isLoading={isSubmitting}
					isDisabled={!isValid}
				>
					{isSubmitting ? t("button_saving") : t("button_save")}
				</Button>
			</form>
		</Card>
	);
};
