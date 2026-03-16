import { useAuraToast } from "@beweco/aurora-ui";
import { useCallback, useState } from "react";
import { SaveVertical } from "../DependencyInjection";

export const useVerticalSave = () => {
	const [isSaving, setIsSaving] = useState(false);
	const { showToast } = useAuraToast();

	const handleSave = useCallback(
		async (vertical: string): Promise<boolean> => {
			setIsSaving(true);

			const result = await SaveVertical(vertical);
			setIsSaving(false);

			if (!result.isSuccess) {
				showToast({
					color: "danger",
					title: "Error al guardar la vertical",
					description: "Intenta nuevamente",
				});
				return false;
			}

			return true;
		},
		[showToast],
	);

	return { isSaving, handleSave };
};
