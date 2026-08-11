import { create } from "zustand";
import type { NotificationItem } from "@/nui/types";
import { mockNotifications } from "@/nui/mock";

interface NotificationsState {
  notifications: NotificationItem[];
  markAllRead: () => void;
  hydrate: (payload: Partial<NotificationsState>) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: mockNotifications,
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  hydrate: (payload) => set(payload),
}));
