"use client";

import { useEffect, useState, useRef } from "react";

export function useNotifications(intervalMs = 30000) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastCheckRef = useRef(Date.now());

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/notifications?since=${lastCheckRef.current}`,
        );
        const data = await res.json();

        if (data.notifications?.length > 0) {
          setNotifications((prev) => [...data.notifications, ...prev].slice(0, 100));
          setUnreadCount(data.unreadCount);
          lastCheckRef.current = data.timestamp;
        }
      } catch (error) {
        console.error("Notification poll failed:", error);
      }
    };

    poll();
    const interval = setInterval(poll, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  const markAsRead = async (ids: string[]) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationIds: ids }),
    });
    setUnreadCount((prev) => Math.max(0, prev - ids.length));
  };

  return { notifications, unreadCount, markAsRead };
}
