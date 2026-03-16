/**
 * Clients UI Module
 *
 * Main barrel export for the clients UI layer.
 * Following hexagonal architecture with feature-based organization.
 */

// Features
export * from "./features";

// Shared
export * from "./_shared";

// Pages
export { ClientsPage } from "./pages/clients-page/clients.page";
export { default as ClientDetailsPage } from "./pages/details/client-details.page";
