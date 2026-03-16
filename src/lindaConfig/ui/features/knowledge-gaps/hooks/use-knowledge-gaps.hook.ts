import { useAuraToast } from "@beweco/aurora-ui";
import { configureSuccessToast } from "@shared/utils/toast-config.utils";
import { useCallback, useEffect, useState } from "react";
import { ManageKnowledgeGapsUseCase } from "../../../../application/knowledge-gaps/manage-knowledge-gaps.usecase";
import type { IKnowledgeGap } from "../../../../domain/knowledge-gaps";
import { KnowledgeGapRepositoryAdapter } from "../../../../infrastructure/knowledge-gaps/adapters/knowledge-gaps.adapter";

const repository = new KnowledgeGapRepositoryAdapter();
const manageKnowledgeGapsUseCase = new ManageKnowledgeGapsUseCase(repository);

export const useKnowledgeGaps = (chatbotId: string) => {
	const [knowledgeGaps, setKnowledgeGaps] = useState<IKnowledgeGap[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { showToast } = useAuraToast();

	const loadKnowledgeGaps = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const gaps = await manageKnowledgeGapsUseCase.getAll(chatbotId);
			setKnowledgeGaps(gaps);
		} catch (err) {
			setError("Error al cargar las lagunas de conocimiento");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, [chatbotId]);

	useEffect(() => {
		loadKnowledgeGaps();
	}, [loadKnowledgeGaps]);

	const deleteGap = useCallback(
		async (gapId: string) => {
			try {
				setIsLoading(true);
				await manageKnowledgeGapsUseCase.deleteGap(gapId);
				await loadKnowledgeGaps();

				showToast(
					configureSuccessToast(
						"Laguna eliminada",
						"La laguna de conocimiento se ha eliminado correctamente"
					)
				);
			} catch (err) {
				setError("Error al eliminar la laguna de conocimiento");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		},
		[loadKnowledgeGaps, showToast]
	);

	return {
		knowledgeGaps,
		isLoading,
		error,
		deleteGap,
		reload: loadKnowledgeGaps,
	};
};
