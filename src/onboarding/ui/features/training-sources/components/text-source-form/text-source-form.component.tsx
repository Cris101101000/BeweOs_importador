import { Button, Textarea } from "@beweco/aurora-ui";

interface TextSourceFormProps {
	textInput: string;
	onTextChange: (value: string) => void;
	onAddText: () => void;
}

export const TextSourceForm = ({
	textInput,
	onTextChange,
	onAddText,
}: TextSourceFormProps) => {
	return (
		<div className="space-y-4">
			<Textarea
				minRows={8}
				placeholder="Describe tu empresa"
				value={textInput}
				onChange={(event) => onTextChange(event.target.value)}
				className="w-full"
			/>
			<div className="flex justify-between items-center">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					Minimo 60 caracteres ({textInput.length}/60)
				</p>
				<Button
					size="sm"
					color="primary"
					variant="bordered"
					onPress={onAddText}
					isDisabled={textInput.trim().length < 60}
					className="rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 px-4 py-1 font-medium"
				>
					Agregar
				</Button>
			</div>
		</div>
	);
};
