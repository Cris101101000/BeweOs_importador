/**
 * Layout Component
 *
 * This component serves as the main layout wrapper for the application. It is responsible for:
 * - Fetching and providing initial user, agency, and menu data.
 * - Rendering the sidebar menu and header.
 * - Managing the sidebar's open/close state, especially for responsive breakpoints.
 * - Displaying a loading spinner while initial data is being loaded.
 * - Passing user, agency, and menu information to child components.
 * - Providing a slot for rendering the main content of each page.
 *
 * Features:
 * - Responsive sidebar: Automatically opens on desktop, toggles on mobile.
 * - Internationalization: Uses translation hooks for all labels.
 * - Memoization: Uses React's useMemo to optimize derived data.
 *
 * Props:
 * - children: ReactNode - The main content to be rendered inside the layout.
 *
 * Usage:
 *
 * <Layout>
 *   <YourPageComponent />
 * </Layout>
 *
 * Dependencies:
 * - Aurora UI Spinner for loading state.
 * - Custom hooks for session, breakpoint, and initial data.
 * - Header and Menu components for navigation and branding.
 */

import { GlobalToast, Spinner } from "@beweco/aurora-ui";
import { clearAuthCookies } from "@beweco/utils-js";
import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import { TGoToLogin, goToLogin } from "@shared/ui/functions/go-to-login";
import { useConfirmDeleteModal } from "@shared/ui/store/useConfirmDeleteModal";
import { getFullName } from "@shared/utils/user-name.utils";
import { useTranslate } from "@tolgee/react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import { useBreadcrumbs } from "../../../../shared/ui/contexts/breadcrumbs-context/breadcrumbs.context";
import { useSession } from "../../../../shared/ui/contexts/session-context/session-context";
import { useBreakpoint } from "../../../../shared/ui/hooks/useBreakpoint";
import { useNotificationSocket } from "../../../infrastructure/hooks/useNotificationSocket";
import { useInitialData } from "../../hooks/use-initial-data.hook";
import Header from "../header/header.component";
import Menu from "../menu/menu.component";
import type { ILayout } from "./layout.type";
import { mapModulesToMenuItems } from "./mappers/map-modules-to-menu-items.mapper";

/**
 * Main application layout component.
 * Handles sidebar, header, and main content area.
 */
const Layout: FC<ILayout> = ({ children }) => {
	/**
	 * State to control sidebar open/close.
	 * Starts closed by default (for mobile/tablet), opens on desktop via useEffect.
	 */
	const [isOpenSidebar, setIsOpenSidebar] = useState(false);

	/**
	 * Get user and agency data from session context.
	 */
	const { user, agency } = useSession();

	/**
	 * Get current breadcrumbs from context.
	 */
	const { breadcrumbs } = useBreadcrumbs();

	/**
	 * Fetch initial data: user, agency, and menu.
	 */
	const { isLoading, menuData } = useInitialData();

	// Initialize WebSocket connection for real-time notifications
	useNotificationSocket();

	/**
	 * Determine if the current viewport is desktop size.
	 */
	const isDesktop = useBreakpoint("sm");

	/**
	 * Get current location for menu selection.
	 */
	const location = useLocation();
	const navigate = useNavigate();

	/**
	 * Translation function for internationalization.
	 */
	const { t } = useTranslate();

	const isOnboardingRoute = location.pathname.startsWith("/onboarding");
	const hasOnboardingRole =
		user?.roles?.some((role) => role.toLowerCase() === "onboarding") ?? false;

	/**
	 * Effect: Open sidebar automatically on desktop, close on mobile/tablet.
	 */
	useEffect(() => {
		setIsOpenSidebar(isDesktop);
	}, [isDesktop]);

	/**
	 * Toggle sidebar open/close state (only on mobile).
	 * Memoized to prevent re-renders of child components
	 */
	const handleToggleSidebar = useCallback(() => {
		if (!isDesktop) {
			setIsOpenSidebar((prev) => !prev);
		}
	}, [isDesktop]);

	/**
	 * Handle sidebar open/close from MenuComponent (overlay, close button, or bottom bar).
	 * Required so the sidebar actually closes on mobile when user taps overlay or close.
	 */
	const handleOpenSidebarChange = useCallback((open: boolean) => {
		setIsOpenSidebar(open);
	}, []);

	/**
	 * Handle user logout action.
	 */
	const handleLogout = () => {
		clearAuthCookies();
		// Redirigir al login
		goToLogin(TGoToLogin.Logout);
	};

	/**
	 * Memoized header options for navigation dropdown.
	 * Only recalculate when translation function changes
	 */
	const headerOptions = useMemo(
		() => [
			{
				href: "settings",
				label: t("menu_configuration"),
			},
			{
				href: "profile",
				label: t("menu_profile"),
			},
		],
		[t]
	);

	/**
	 * Memoized user information for the sidebar.
	 */
	const userInfo = useMemo(
		() => ({
			avatar: user?.imageProfile ?? "",
			name: getFullName(user?.firstname ?? "", user?.lastname),
			role: user?.roles[0] ?? "",
		}),
		[user]
	);

	/**
	 * Memoized agency (commerce) information for the sidebar.
	 */
	const commerceInfo = useMemo(
		() => ({
			logo: agency?.logo ?? "",
			name: agency?.name ?? "",
		}),
		[agency]
	);

	/**
	 * Memoized menu items for the sidebar navigation.
	 */
	const handleMenuSelect = useCallback(
		(_key: string, href?: string) => {
			if (href) navigate(href);
		},
		[navigate]
	);

	const handleOptionSelect = useCallback(
		(href: string) => {
			navigate(`/${href}`);
		},
		[navigate]
	);

	const handleBreadcrumbClick = useCallback(
		(href: string) => {
			navigate(href);
		},
		[navigate]
	);

	const menuItems = useMemo(
		() => ({
			items: mapModulesToMenuItems(menuData?.groups ?? [], t),
			selectedPath: location.pathname,
			onSelect: handleMenuSelect,
			// selectedKey no es necesario cuando se pasa selectedPath (la librería lo calcula).
			// Se deja por compatibilidad con tipos de versiones anteriores de @beweco/aurora-ui.
			selectedKey: "",
		}),
		[menuData, location.pathname, t, handleMenuSelect]
	);

	/**
	 * Global Confirm Delete Modal store values and actions
	 */
	const {
		isOpen: isConfirmOpen,
		isLoading: isConfirmLoading,
		title: confirmTitle,
		description: confirmDescription,
		itemName: confirmItemName,
		closeModal: closeConfirmModal,
		confirmDelete,
	} = useConfirmDeleteModal(
		useShallow((state) => ({
			isOpen: state.isOpen,
			isLoading: state.isLoading,
			title: state.title,
			description: state.description,
			itemName: state.itemName,
			closeModal: state.closeModal,
			confirmDelete: state.confirmDelete,
		}))
	);

	/**
	 * Show loading spinner while initial data is being fetched.
	 */
	if (!isOnboardingRoute && isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Spinner size="lg" />
			</div>
		);
	}

	if (hasOnboardingRole && !isOnboardingRoute) {
		return <Navigate to="/onboarding" replace />;
	}

	if (isOnboardingRoute) {
		return (
			<main className="h-screen w-screen overflow-hidden">
				{children}
				<GlobalToast />
			</main>
		);
	}
	/**
	 * Main layout rendering.
	 */
	return (
		<main className="grid h-screen sm:grid-cols-[auto,1fr] gradient-animated">
			<Menu
				userInfo={userInfo}
				commerceInfo={commerceInfo}
				helpButton={{
					redirect: "",
					title: t("menu_help"),
				}}
				menuItems={menuItems}
				isOpenSidebar={isOpenSidebar}
				onOpenSidebarChange={handleOpenSidebarChange}
			/>
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header
					onMenuClick={handleToggleSidebar}
					onLogout={handleLogout}
					onOptionSelect={handleOptionSelect}
					onBreadcrumbClick={handleBreadcrumbClick}
					options={headerOptions}
					breadcrumbs={breadcrumbs}
				/>
				<div className="flex-1 overflow-y-auto min-h-0 pb-8 sm:pt-3 lg:pt-4 xs:px-4 lg:px-7">
					<div className="mx-auto">{children}</div>
				</div>
			</div>
			<GlobalToast />

			{/* Delete Confirmation Modal (Global) */}
			<ConfirmDeleteModal
				isOpen={isConfirmOpen}
				onClose={closeConfirmModal}
				onConfirm={confirmDelete}
				title={confirmTitle}
				description={confirmDescription}
				itemName={confirmItemName}
				isLoading={isConfirmLoading}
			/>
		</main>
	);
};

export default memo(Layout);
