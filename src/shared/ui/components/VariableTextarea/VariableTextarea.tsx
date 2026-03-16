import { Textarea } from "@beweco/aurora-ui";
import type { TextAreaProps } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useRef } from "react";
import { VARIABLE_DEFINITIONS } from "@shared/domain/constants";

interface VariableTextareaProps
	extends Omit<TextAreaProps, "onChange" | "value"> {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	showHint?: boolean;
}

/**
 * Textarea component with clickable variable chips
 * Clicking a variable chip inserts it at the cursor position
 *
 * @example
 * <VariableTextarea
 *   value={text}
 *   onChange={handleChange}
 *   label="Description"
 *   placeholder="Enter text with {{variables}}"
 *   showHint={true}
 * />
 */
export const VariableTextarea: React.FC<VariableTextareaProps> = ({
	value,
	onChange,
	showHint = true,
	description,
	...props
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { t } = useTranslate();

	/**
	 * Insert variable at cursor position in the textarea
	 */
	const insertVariable = (variable: string) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const cursorPosition = textarea.selectionStart || 0;
		const textBefore = value.substring(0, cursorPosition);
		const textAfter = value.substring(cursorPosition);

		// Insert variable with spaces if needed
		const needsSpaceBefore =
			textBefore.length > 0 &&
			!textBefore.endsWith(" ") &&
			!textBefore.endsWith("\n");
		const needsSpaceAfter =
			textAfter.length > 0 &&
			!textAfter.startsWith(" ") &&
			!textAfter.startsWith("\n");

		const variableText = `${needsSpaceBefore ? " " : ""}{{${variable}}}${needsSpaceAfter ? " " : ""}`;
		const newValue = textBefore + variableText + textAfter;

		// Create synthetic event to trigger onChange
		const syntheticEvent = {
			target: { value: newValue },
			currentTarget: { value: newValue },
		} as React.ChangeEvent<HTMLInputElement>;

		onChange(syntheticEvent);

		// Set cursor position after the inserted variable
		setTimeout(() => {
			const newCursorPosition = cursorPosition + variableText.length;
			textarea.setSelectionRange(newCursorPosition, newCursorPosition);
			textarea.focus();
		}, 0);
	};

	return (
		<div className="w-full space-y-3">
			{/* Textarea for editing */}
			<Textarea
				{...props}
				ref={textareaRef}
				value={value}
				onChange={onChange}
				description={description}
			/>

			{/* Panel showing available variables - always visible and clickable */}
			{showHint && (
				<div className="p-3 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800 rounded-lg shadow-sm">
					<strong className="block text-violet-900 dark:text-violet-100 text-xs font-semibold mb-2.5">
						💡 {t("variable_textarea_available_variables")}:
					</strong>
					<div className="flex flex-wrap gap-2">
						{VARIABLE_DEFINITIONS.map((variable) => (
							<button
								type="button"
								key={variable.value}
								onClick={() => insertVariable(variable.value)}
								className="inline-block px-2.5 py-1 bg-white dark:bg-gray-900 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700 rounded-md text-xs font-sans font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/50 hover:border-violet-500 dark:hover:border-violet-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
								title={`${t(variable.translationKey)} - Se insertará: {{${variable.value}}}`}
							>
								{t(variable.translationKey)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
