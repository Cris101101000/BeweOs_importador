import { HeaderComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, memo, useCallback } from "react";
import { selectUnreadCount, useNotificationsStore } from "../../../../shared/ui/store/useNotificationsStore";
import { NotificationsPanel } from "../notifications-panel";
import type { HeaderProps } from "./header.type";

const Header: FC<HeaderProps> = memo(
	({ onMenuClick, onLogout, onOptionSelect, onBreadcrumbClick, options, breadcrumbs }) => {
		const { t } = useTranslate();
		const unreadCount = useNotificationsStore(selectUnreadCount);
		const hasNewNotification = useNotificationsStore((state) => state.hasNewNotification);
		const setIsOpen = useNotificationsStore((state) => state.setIsOpen);

		const handleNotificationClick = useCallback(() => {
			setIsOpen(true);
		}, [setIsOpen]);

		return (
			<header className="relative w-full pt-4
			">
				{/* Animation styles for pulsate effect */}
				<style>
					{`
						@keyframes pulse {
							0% {
								transform: scale(1);
								opacity: 1;
							}
							60% {
								transform: scale(1.3);
								opacity: 0.4;
							}
							100% {
								transform: scale(1.4);
								opacity: 0;
							}
						}
						.pulsate-ring {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							animation: pulse 1s ease infinite;
							border-radius: 50%;
							border: 3px double #f31260;
						}
					`}
				</style>
				<HeaderComponent
					translations={{
						logout: t("menu_logout"),
					}}
					notificationCount={unreadCount}
					onMenuClick={onMenuClick}
					onLogout={onLogout}
					onOptionSelect={onOptionSelect}
					onBreadcrumbClick={onBreadcrumbClick}
					options={options}
					breadcrumbs={breadcrumbs}
				/>
				{/* Transparent overlay for notifications - captures clicks on the existing notification icon */}
				<div className="absolute right-[72px] sm:right-[84px] top-1/2 -translate-y-1/2 z-[100]">
					<NotificationsPanel />
				</div>
				{/* Pulsating ring effect around badge */}
				{hasNewNotification && unreadCount > 0 && (
					<div className="absolute right-[70px] sm:right-[82px] top-[14px] sm:top-[16px] z-[99] pointer-events-none">
						<div className="relative w-[18px] h-[18px]">
							<span className="pulsate-ring" />
						</div>
					</div>
				)}
			</header>
		);
	}
);

export default Header;
