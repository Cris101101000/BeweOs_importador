import { MenuComponent } from "@beweco/aurora-ui";
import type { MenuComponentProps } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { memo } from "react";

const MOBILE_BOTTOM_BAR_GROUP_KEY = "menu_group_overview";

const Menu = memo(
	({
		menuItems,
		userInfo,
		commerceInfo,
		helpButton,
		isOpenSidebar,
		onOpenSidebarChange,
	}: MenuComponentProps) => {
		const { t } = useTranslate();

		return (
			<MenuComponent
				commerceInfo={commerceInfo}
				helpButton={helpButton}
				isOpenSidebar={isOpenSidebar}
				menuItems={menuItems}
				mobileBottomBarGroupKey={MOBILE_BOTTOM_BAR_GROUP_KEY}
				onOpenSidebarChange={onOpenSidebarChange}
				translations={{
					menuLabel: t("menu_label", "Menú"),
					closeSidebarAriaLabel: t("menu_close_sidebar", "Cerrar menú lateral"),
					mobileNavAriaLabel: t("menu_mobile_nav", "Navegación móvil"),
					logoAlt: t("menu_logo_alt", "Logo de"),
				}}
				userInfo={userInfo}
			/>
		);
	}
);

export default Menu;
