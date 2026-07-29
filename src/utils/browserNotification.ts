export type NotificationPermissionState = NotificationPermission | "unsupported";

export function isNotificationSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermissionState {
    if (!isNotificationSupported()) return "unsupported";
    return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
    if (!isNotificationSupported()) return "unsupported";

    if (Notification.permission !== "default") return Notification.permission;

    try {
        const result = Notification.requestPermission();
        if (result && typeof (result as Promise<NotificationPermission>).then === "function") {
            return await result;
        }
        return await new Promise<NotificationPermission>((resolve) => {
            Notification.requestPermission((permission) => resolve(permission));
        });
    } catch (err) {
        console.error("Không xin được quyền thông báo:", err);
        return getNotificationPermission();
    }
}

interface ShowNotificationOptions {
    title: string;
    body?: string;
    icon?: string;
    tag?: string;
    data?: unknown;
    onClick?: (notification: Notification) => void;
}

export function showBrowserNotification(options: ShowNotificationOptions): Notification | null {
    if (!isNotificationSupported() || Notification.permission !== "granted") return null;

    try {
        const notification = new Notification(options.title, {
            body: options.body,
            icon: options.icon,
            tag: options.tag,
            data: options.data,
        });

        if (options.onClick) {
            notification.onclick = () => options.onClick?.(notification);
        }

        return notification;
    } catch (err) {
        // Chrome Android throw TypeError: yêu cầu ServiceWorkerRegistration.showNotification.
        console.warn("Không hiện được thông báo trình duyệt:", err);
        return null;
    }
}
