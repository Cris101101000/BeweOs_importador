import { Input, Textarea } from "@beweco/aurora-ui";

interface BrandFormFieldsProps {
	businessNameId: string;
	descriptionId: string;
	businessName: string;
	description: string;
	isFetching: boolean;
	onBusinessNameChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
}

export const BrandFormFields = ({
	businessNameId,
	descriptionId,
	businessName,
	description,
	isFetching,
	onBusinessNameChange,
	onDescriptionChange,
}: BrandFormFieldsProps) => {
	return (
		<>
			<div className="space-y-2">
				<label
					htmlFor={businessNameId}
					className="block text-sm font-medium text-gray-900 dark:text-white"
				>
					Nombre del Negocio <span className="text-red-500">*</span>
				</label>
				{isFetching ? (
					<div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
				) : (
					<Input
						id={businessNameId}
						placeholder="Nombre de tu empresa"
						value={businessName}
						onValueChange={onBusinessNameChange}
						variant="bordered"
						radius="md"
						size="lg"
						isRequired
						className="w-full"
					/>
				)}
			</div>

			<div className="space-y-2">
				<label
					htmlFor={descriptionId}
					className="block text-sm font-medium text-gray-900 dark:text-white"
				>
					Descripción del Negocio <span className="text-red-500">*</span>
				</label>
				{isFetching ? (
					<div className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
				) : (
					<Textarea
						id={descriptionId}
						placeholder="Describe tu negocio..."
						value={description}
						onChange={(event) => onDescriptionChange(event.target.value)}
						variant="bordered"
						radius="md"
						size="lg"
						minRows={2}
						maxRows={3}
						isRequired
						isInvalid={
							description.trim().length > 0 &&
							description.trim().length < 20
						}
						errorMessage={
							description.trim().length > 0 &&
							description.trim().length < 20
								? `Mínimo 20 caracteres (${description.trim().length}/20)`
								: undefined
						}
						className="w-full"
					/>
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
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Extraído de tu sitio web. Puedes editarlo libremente. (Mínimo 20
					caracteres)
				</p>
			</div>
		</>
	);
};
