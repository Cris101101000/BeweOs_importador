import { getAccessToken } from "@beweco/utils-js";
import { useCallback, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useNotificationsStore } from "src/shared/ui/store/useNotificationsStore";
import {
	mapWsPayloadToNotification,
	type WebpushNotificationPayload,
} from "../mappers/notification.mapper";

function getWsBaseUrl(): string {
	const wsUrl = process.env.REACT_APP_WS_BASE_URL;
	if (wsUrl) return wsUrl.replace(/\/+$/, "");

	const apiUrl = process.env.REACT_APP_BASE_URL_BACKEND;
	if (apiUrl) return apiUrl.replace(/\/+$/, "");

	return "";
}

// Module-level socket reference so markAsRead can be called from anywhere
let globalSocket: Socket | null = null;

/**
 * Mark a single notification as read via WebSocket.
 * Emits 'message_read' event with { channelMessageId, readAt }.
 */
export function markNotificationAsReadViaSocket(channelMessageId: string): void {
	if (!globalSocket?.connected) {
		console.warn("[NotificationSocket] Socket not connected, cannot mark as read");
		return;
	}
	const readAt = new Date().toISOString();
	globalSocket.emit("message_read", { channelMessageId, readAt });
}

/**
 * Mark all notifications as read via WebSocket.
 * Emits 'message_read' for each notification that is currently unread in the store.
 */
export function markAllNotificationsAsReadViaSocket(): void {
	if (!globalSocket?.connected) {
		console.warn("[NotificationSocket] Socket not connected, cannot mark all as read");
		return;
	}
	const readAt = new Date().toISOString();
	const unread = useNotificationsStore
		.getState()
		.notifications.filter((n) => !n.read);

	for (const notification of unread) {
		globalSocket.emit("message_read", {
			channelMessageId: notification.id,
			readAt,
		});
	}
}

/**
 * Hook that establishes a WebSocket connection via Socket.IO
 * to receive real-time notifications.
 *
 * Connects to /channels/webpush namespace and listens for webpush_message events.
 * New notifications are added to the Zustand store automatically.
 * Also exposes markAsRead functionality via module-level functions.
 */
export function useNotificationSocket(): void {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const baseUrl = getWsBaseUrl();
		if (!baseUrl) {
			console.warn("[NotificationSocket] No WebSocket base URL configured");
			return;
		}

		const token = getAccessToken();
		if (!token) {
			console.warn("[NotificationSocket] No access token available");
			return;
		}

		let cancelled = false;

		const socket = io(`${baseUrl}/channels/webpush`, {
			transports: ["websocket"],
			auth: { token },
			reconnection: true,
			reconnectionAttempts: 10,
			reconnectionDelay: 2000,
			reconnectionDelayMax: 30000,
		});

		socketRef.current = socket;
		globalSocket = socket;

		socket.on("connect", () => {
			if (cancelled) return;
			console.log("[NotificationSocket] Connected");
		});

		socket.on("disconnect", (reason) => {
			if (cancelled) return;
			console.log("[NotificationSocket] Disconnected:", reason);
		});

		socket.on("connect_error", (err) => {
			if (cancelled) return;
			console.error("[NotificationSocket] Connection error:", err.message);
		});

		// Refresh token on reconnection attempt
		socket.on("reconnect_attempt", () => {
			const freshToken = getAccessToken();
			if (freshToken) {
				socket.auth = { token: freshToken };
			}
		});

		socket.on("webpush_message", (payload: WebpushNotificationPayload) => {
			if (cancelled) return;
			const notification = mapWsPayloadToNotification(payload);
			useNotificationsStore.getState().addServerNotification(notification);
		});

		return () => {
			cancelled = true;
			socketRef.current = null;
			globalSocket = null;
			socket.disconnect();
		};
	}, []);
}
