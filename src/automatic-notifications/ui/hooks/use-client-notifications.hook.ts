import { useState, useCallback } from 'react';
import type { IClientNotification } from '../../domain/interfaces/client-notification.interface';
import { mockClientNotifications } from '../../infrastructure/mocks/client-notifications.mock';

export const useClientNotifications = () => {
	const [notifications, setNotifications] = useState<IClientNotification[]>(mockClientNotifications);
	const [isLoading, setIsLoading] = useState(false);

	const toggleNotification = useCallback(async (notificationId: string, enabled: boolean) => {
		setIsLoading(true);
		
		try {
			// TODO: Simulate API call delay, because don't have the API yet
			await new Promise(resolve => setTimeout(resolve, 300));
			
			setNotifications(prev => 
				prev.map(notification => 
					notification.id === notificationId 
						? { ...notification, isEnabled: enabled }
						: notification
				)
			);
		} catch (error) {
			console.error('Error toggling client notification:', error);
			// TODO: Handle error (show toast, etc.)
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		notifications,
		isLoading,
		toggleNotification,
	};
};
