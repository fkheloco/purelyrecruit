"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <button className="relative rounded-full p-2 text-gray-400 hover:text-gray-500">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
