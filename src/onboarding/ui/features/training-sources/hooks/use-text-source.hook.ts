import { useCallback, useState } from "react";

export const useTextSource = (initialText: string) => {
	const [textInput, setTextInput] = useState(initialText);

	const handleAddText = useCallback(() => {
		if (textInput.trim().length < 60) {
			return;
		}
	}, [textInput]);

	return {
		textInput,
		setTextInput,
		handleAddText,
	};
};
