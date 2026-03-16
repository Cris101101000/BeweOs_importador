import { Button, Input } from "@beweco/aurora-ui";

interface WebsiteSourceFormProps {
	websiteUrl: string;
	isWebsiteUrlValid: boolean;
	websiteValidationMessage?: string;
	onWebsiteChange: (value: string) => void;
	onAddWebsite: () => void;
}

export const WebsiteSourceForm = ({
	websiteUrl,
	isWebsiteUrlValid,
	websiteValidationMessage,
	onWebsiteChange,
	onAddWebsite,
}: WebsiteSourceFormProps) => {
	return (
		<div className="space-y-1">
			<div className="flex gap-2">
				<Input
					placeholder="www.ejemplo.com"
					value={websiteUrl}
					onValueChange={onWebsiteChange}
					size="lg"
					className="flex-1"
					startContent={
						<span className="text-gray-400 text-sm">https://</span>
					}
					isInvalid={Boolean(websiteValidationMessage)}
					errorMessage={websiteValidationMessage}
				/>
				<Button
					size="sm"
					color="primary"
					variant="bordered"
					onPress={onAddWebsite}
					isDisabled={!websiteUrl.trim() || !isWebsiteUrlValid}
					className="rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 px-4 py-1 font-medium"
				>
					Agregar
				</Button>
			</div>
		</div>
	);
};
