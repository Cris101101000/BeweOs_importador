/**
 * DependencyInjection for Kanban View Feature
 *
 * This file provides factory functions that create use case instances
 * with their required adapters for the Kanban view functionality.
 */

import { GetClientsByFilterUseCase } from "@clients/application/get-clients-by-filter.usecase";
import { UpdateClientUseCase } from "@clients/application/update-client.usecase";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";

// Singleton adapter
const clientAdapter = new ClientAdapter();

/**
 * Get clients by filter (for Kanban columns)
 */
export const GetClientsByFilter = (filters?: IClientFilter) =>
	new GetClientsByFilterUseCase(clientAdapter).execute(filters);

/**
 * Update client (for status changes via drag & drop)
 */
export const UpdateClient = (clientId: string, data: Partial<IClient>) =>
	new UpdateClientUseCase(clientAdapter).execute(clientId, data);
