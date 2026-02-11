"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate } from "@/lib/utils";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages").then(r => r.json()).then(data => {
      setMessages(data.data || []);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader title="Messages" description="Communication hub" />
      
      <div className="rounded-lg border bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No messages yet</p>
        ) : (
          <div className="divide-y">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{msg.subject || "No subject"}</p>
                  <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{msg.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
