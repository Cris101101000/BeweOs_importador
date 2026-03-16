/**
 * DependencyInjection for Contact List Feature
 *
 * This file provides factory functions that create use case instances
 * with their required adapters. This centralizes dependency injection
 * and makes the feature independent of infrastructure details.
 */

import { CreateViewUseCase } from "@clients/application/create-view.usecase";
import { DeleteClientsUseCase } from "@clients/application/delete-clients.usecase";
import { DeleteViewUseCase } from "@clients/application/delete-view.usecase";
import { ExportClientsUseCase } from "@clients/application/export-clients.usecase";
import { GetClientsByFilterUseCase } from "@clients/application/get-clients-by-filter.usecase";
import { GetViewsUseCase } from "@clients/application/get-views.usecase";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type { ICreateView } from "@clients/domain/interfaces/view.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { ViewAdapter } from "@clients/infrastructure/adapters/view.adapter";

// Singleton adapters
const clientAdapter = new ClientAdapter();
const viewAdapter = new ViewAdapter();

/**
 * Get clients by filter
 */
export const GetClientsByFilter = (filters?: IClientFilter) =>
	new GetClientsByFilterUseCase(clientAdapter).execute(filters);

/**
 * Delete multiple clients
 */
export const DeleteClients = (clientIds: string[]) =>
	new DeleteClientsUseCase(clientAdapter).execute(clientIds);

/**
 * Export clients data
 */
export const ExportClients = (
	customColumns?: string[],
	options?: { selectedClientIds?: string[]; filters?: IClientFilter }
) => new ExportClientsUseCase(clientAdapter).execute(customColumns, options);

/**
 * Get saved views
 */
export const GetViews = (page = 1, limit = 20) =>
	new GetViewsUseCase(viewAdapter).execute(page, limit);

/**
 * Create a new view
 */
export const CreateView = (viewData: ICreateView) =>
	new CreateViewUseCase(viewAdapter).execute(viewData);

/**
 * Delete a view
 */
export const DeleteView = (viewId: string, userId: string) =>
	new DeleteViewUseCase(viewAdapter).execute(viewId, userId);
