import {
	ImagePreviewComponent,
	UploadFileComponent,
} from "@shared/ui/components";
import { useAuraToast } from "@beweco/aurora-ui";
import { useState } from "react";

interface BrandLogoUploadProps {
	logoUrl: string | null;
	isFetching: boolean;
	onLogoUpload: (files: File[]) => void;
	onLogoRemove: () => void;
}

export const BrandLogoUpload = ({
	logoUrl,
	isFetching,
	onLogoUpload,
	onLogoRemove,
}: BrandLogoUploadProps) => {
	const [isChangingLogo, setIsChangingLogo] = useState(false);
	const { showToast } = useAuraToast();

	const handleError = (error: string) => {
		showToast({
			color: "warning",
			title: error,
		});
	};

	const handleLogoUpdate = (files: File[]) => {
		onLogoUpload(files);
		setIsChangingLogo(false);
	};

	return (
		<div className="space-y-2">
			<p className="block text-sm font-medium text-gray-900 dark:text-white">
				Logo de tu Empresa
			</p>
			{isFetching ? (
				<div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
			) : (
				<div className="space-y-3">
					{logoUrl && !isChangingLogo ? (
						<>
							<ImagePreviewComponent
								images={logoUrl}
								onRemove={() => onLogoRemove()}
								size="small"
							/>
							<div className="flex justify-start">
								<button
									type="button"
									onClick={() => setIsChangingLogo(true)}
									className="text-sm font-medium text-primary hover:underline"
								>
									Cambiar imagen
								</button>
							</div>
						</>
					) : (
						<>
							<UploadFileComponent
								size="medium"
								acceptedFiles={[
									"image/png",
									"image/jpeg"
								]}
								maxFiles={1}
								multiple={false}
								maxFileSize={5 * 1024 * 1024}
								onUpload={handleLogoUpdate}
								onError={handleError}
								width="100%"
								height="auto"
								icon="solar:cloud-upload-bold"
							/>
							{logoUrl ? (
								<div className="flex justify-start">
									<button
										type="button"
										onClick={() => setIsChangingLogo(false)}
										className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline"
									>
										Cancelar
									</button>
								</div>
							) : null}
						</>
					)}
				</div>
			)}
			<p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				Sube el logo de tu empresa (PNG, JPEG - Máx. 5MB)
			</p>
		</div>
	);
};
