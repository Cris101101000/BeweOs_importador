import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { useCallback, useMemo, useState } from "react";
import type {
	IEnrichedTagAssignment,
	ITagAssignment,
	ITagAssignmentsResponse,
} from "../../domain/interfaces/tag-assignment.interface";
import { AssignmentSmartTagAdapter } from "../../infrastructure/adapters/assignment-smart-tags.adapter";

const assignmentAdapter = new AssignmentSmartTagAdapter();
const clientAdapter = new ClientAdapter();

/**
 * Interface for the hook response
 */
interface UseTagAssignmentsResponse {
	clientAssignments: IEnrichedTagAssignment[];
	conversationAssignments: IEnrichedTagAssignment[];
	noteAssignments: IEnrichedTagAssignment[];
	isLoadingClients: boolean;
	isLoadingConversations: boolean;
	isLoadingNotes: boolean;
	errorClients: string | null;
	errorConversations: string | null;
	errorNotes: string | null;
	fetchClientAssignments: (tagId: string) => Promise<void>;
	fetchConversationAssignments: (tagId: string) => Promise<void>;
	fetchNoteAssignments: (tagId: string) => Promise<void>;
	refetch: (tagId: string) => Promise<void>;
	tagInfo: ITagAssignmentsResponse["tag"] | null;
	counts: {
		clients: number;
		conversations: number;
		notes: number;
	};
}

/**
 * Enriches tag assignments with client data
 */
async function enrichAssignmentsWithClientData(
	assignments: ITagAssignment[]
): Promise<IEnrichedTagAssignment[]> {
	if (assignments.length === 0) {
		return [];
	}

	// Get unique entity IDs
	const entityIds = [...new Set(assignments.map((a) => a.assignment.entityId))];

	// Fetch all clients in parallel (using individual requests since we don't have a batch endpoint)
	const clientPromises = entityIds.map(async (entityId) => {
		try {
			const client = await clientAdapter.getClientById(entityId);
			return { entityId, client };
		} catch (error) {
			console.warn(`Failed to fetch client ${entityId}:`, error);
			return { entityId, client: null };
		}
	});

	const clientResults = await Promise.all(clientPromises);

	// Create a map for quick lookup
	const clientMap = new Map<string, IClient | null>();
	for (const result of clientResults) {
		clientMap.set(result.entityId, result.client);
	}

	// Enrich assignments with client data
	return assignments.map((assignment): IEnrichedTagAssignment => {
		const client = clientMap.get(assignment.assignment.entityId);

		if (client) {
			return {
				...assignment,
				entityData: {
					name: client.name,
					email: client.email,
					phone: client.phones?.[0]?.number || undefined,
					avatarUrl: client.avatarUrl || null,
				},
			};
		}

		return {
			...assignment,
			entityData: {
				name: "Cliente no encontrado",
				email: undefined,
				phone: undefined,
				avatarUrl: null,
			},
		};
	});
}

/**
 * Hook for fetching and managing tag assignments with enriched entity data
 */
export const useTagAssignments = (): UseTagAssignmentsResponse => {
	// State for client assignments
	const [clientAssignments, setClientAssignments] = useState<
		IEnrichedTagAssignment[]
	>([]);
	const [isLoadingClients, setIsLoadingClients] = useState(false);
	const [errorClients, setErrorClients] = useState<string | null>(null);

	// State for conversation assignments
	const [conversationAssignments, setConversationAssignments] = useState<
		IEnrichedTagAssignment[]
	>([]);
	const [isLoadingConversations, setIsLoadingConversations] = useState(false);
	const [errorConversations, setErrorConversations] = useState<string | null>(
		null
	);

	// State for note assignments
	const [noteAssignments, setNoteAssignments] = useState<
		IEnrichedTagAssignment[]
	>([]);
	const [isLoadingNotes, setIsLoadingNotes] = useState(false);
	const [errorNotes, setErrorNotes] = useState<string | null>(null);

	// Tag info state
	const [tagInfo, setTagInfo] = useState<ITagAssignmentsResponse["tag"] | null>(
		null
	);

	/**
	 * Fetch client assignments for a tag
	 */
	const fetchClientAssignments = useCallback(async (tagId: string) => {
		setIsLoadingClients(true);
		setErrorClients(null);

		try {
			const response = await assignmentAdapter.getTagAssignments(
				tagId,
				"CLIENT"
			);

			// Store tag info
			setTagInfo(response.tag);

			// Enrich assignments with client data
			const enrichedAssignments = await enrichAssignmentsWithClientData(
				response.tagAssignments
			);

			setClientAssignments(enrichedAssignments);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al obtener asignaciones de clientes";
			setErrorClients(errorMessage);
			setClientAssignments([]);
		} finally {
			setIsLoadingClients(false);
		}
	}, []);

	/**
	 * Fetch conversation assignments for a tag
	 * Note: Conversations enrichment will be implemented when the conversation service is available
	 */
	const fetchConversationAssignments = useCallback(async (tagId: string) => {
		setIsLoadingConversations(true);
		setErrorConversations(null);

		try {
			const response = await assignmentAdapter.getTagAssignments(
				tagId,
				"COMMUNICATION"
			);

			// Store tag info (using functional update to avoid dependency)
			setTagInfo((prevTagInfo) => prevTagInfo ?? response.tag);

			// TODO: Enrich with conversation data when service is available
			// For now, just return the assignments with placeholder data
			const enrichedAssignments: IEnrichedTagAssignment[] =
				response.tagAssignments.map((assignment) => ({
					...assignment,
					entityData: {
						name: `Conversación ${assignment.assignment.entityId.slice(0, 8)}`,
						customerName: "Cliente",
						lastMessage: "Mensaje no disponible",
						messagesCount: 0,
					},
				}));

			setConversationAssignments(enrichedAssignments);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al obtener asignaciones de conversaciones";
			setErrorConversations(errorMessage);
			setConversationAssignments([]);
		} finally {
			setIsLoadingConversations(false);
		}
	}, []);

	/**
	 * Fetch note assignments for a tag
	 * Note: Notes enrichment will be implemented when the notes service is available
	 */
	const fetchNoteAssignments = useCallback(async (tagId: string) => {
		setIsLoadingNotes(true);
		setErrorNotes(null);

		try {
			const response = await assignmentAdapter.getTagAssignments(tagId, "NOTE");

			// Store tag info (using functional update to avoid dependency)
			setTagInfo((prevTagInfo) => prevTagInfo ?? response.tag);

			// For notes: entityId is the clientId (the client that owns the note)
			// The context contains the note content/description
			const enrichedAssignments: IEnrichedTagAssignment[] =
				response.tagAssignments.map((assignment) => ({
					...assignment,
					entityData: {
						name: `Nota ${assignment.assignment.entityId.slice(0, 8)}`,
						noteContent:
							assignment.source?.context || "Contenido no disponible",
						noteType: "general",
						clientName: "Cliente",
					},
				}));

			setNoteAssignments(enrichedAssignments);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al obtener asignaciones de notas";
			setErrorNotes(errorMessage);
			setNoteAssignments([]);
		} finally {
			setIsLoadingNotes(false);
		}
	}, []);

	/**
	 * Refetch all assignments for a tag
	 */
	const refetch = useCallback(
		async (tagId: string) => {
			await Promise.all([
				fetchClientAssignments(tagId),
				fetchConversationAssignments(tagId),
				fetchNoteAssignments(tagId),
			]);
		},
		[fetchClientAssignments, fetchConversationAssignments, fetchNoteAssignments]
	);

	/**
	 * Computed counts for clients, conversations and notes
	 */
	const counts = useMemo(
		() => ({
			clients: clientAssignments.length,
			conversations: conversationAssignments.length,
			notes: noteAssignments.length,
		}),
		[
			clientAssignments.length,
			conversationAssignments.length,
			noteAssignments.length,
		]
	);

	return {
		clientAssignments,
		conversationAssignments,
		noteAssignments,
		isLoadingClients,
		isLoadingConversations,
		isLoadingNotes,
		errorClients,
		errorConversations,
		errorNotes,
		fetchClientAssignments,
		fetchConversationAssignments,
		fetchNoteAssignments,
		refetch,
		tagInfo,
		counts,
	};
};
