"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Send } from "lucide-react";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export default function ClientMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then(r => r.json())
      .then(data => {
        setMessages(data.data || []);
        setIsLoading(false);
      });
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });
      setNewMessage("");
      // Refresh messages
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.conversationId]) {
      acc[msg.conversationId] = [];
    }
    acc[msg.conversationId].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  const conversations = Object.entries(groupedMessages).map(([convId, msgs]) => ({
    id: convId,
    latestMessage: msgs[msgs.length - 1],
    messageCount: msgs.length,
  }));

  return (
    <div>
      <PageHeader title="Messages" description="Communicate with your recruiter" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-white h-[600px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
                <MessageSquare className="h-12 w-12 mb-3 text-gray-300" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                      selectedConversation === conv.id ? "bg-[#3CB3A2] bg-opacity-10 border-l-4 border-[#3CB3A2]" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {conv.latestMessage.senderName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {conv.latestMessage.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(conv.latestMessage.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages View */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="rounded-lg border bg-white h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {groupedMessages[selectedConversation]?.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex gap-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {msg.senderName}
                      </p>
                      <div className="mt-1 rounded-lg bg-gray-100 px-4 py-2">
                        <p className="text-sm text-gray-700">{msg.content}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t p-4"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3CB3A2]"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="rounded-lg bg-[#3CB3A2] px-4 py-2 text-sm font-medium text-white hover:bg-[#2fa496] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-lg border bg-white h-[600px] flex items-center justify-center text-gray-500 text-center">
              <div>
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
