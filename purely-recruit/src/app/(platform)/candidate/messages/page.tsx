"use client";

import { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  body: string;
  subject?: string;
  createdAt: string;
  channel: string;
}

interface Thread {
  threadId?: string;
  senderId: string;
  senderName?: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<Map<string, Thread>>(new Map());
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedThread]);

  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();

      // Group messages by thread
      const threadMap = new Map<string, Thread>();

      for (const msg of data.data || []) {
        const threadId = msg.threadId || `${msg.senderId}-${Date.now()}`;

        if (!threadMap.has(threadId)) {
          threadMap.set(threadId, {
            threadId,
            senderId: msg.senderId,
            senderName: msg.senderName,
            lastMessage: msg.body.slice(0, 50),
            lastMessageTime: msg.createdAt,
            messages: [],
          });
        }

        const thread = threadMap.get(threadId)!;
        thread.messages.push(msg);
        thread.lastMessage = msg.body.slice(0, 50);
        thread.lastMessageTime = msg.createdAt;
      }

      // Sort by most recent
      const sortedThreads = Array.from(threadMap.entries())
        .sort(
          ([, a], [, b]) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        )
        .reduce((map, [key, val]) => map.set(key, val), new Map());

      setThreads(sortedThreads);
      setMessages(data.data || []);

      if (sortedThreads.size > 0 && !selectedThread) {
        setSelectedThread(Array.from(sortedThreads.keys())[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;

    try {
      setSending(true);
      const thread = threads.get(selectedThread);

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: newMessage,
          recipientId: thread?.senderId,
          subject: thread?.messages[0]?.subject,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setNewMessage("");
      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#3CB3A2]" />
      </div>
    );
  }

  const currentThread = selectedThread ? threads.get(selectedThread) : null;

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Communicate with your recruiter"
      />

      <div className="flex gap-6 h-[600px] rounded-lg border bg-white overflow-hidden shadow-sm">
        {/* Thread List */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto">
          {threads.size === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No messages yet
            </div>
          ) : (
            <div className="divide-y">
              {Array.from(threads.entries()).map(([threadId, thread]) => (
                <button
                  key={threadId}
                  onClick={() => setSelectedThread(threadId)}
                  className={`w-full text-left p-4 border-l-4 transition ${
                    selectedThread === threadId
                      ? "bg-white border-[#3CB3A2]"
                      : "border-transparent hover:bg-white"
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900">
                    {thread.senderName || "Recruiter"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {thread.lastMessage}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(thread.lastMessageTime).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col">
          {currentThread ? (
            <>
              {/* Header */}
              <div className="border-b p-4">
                <h2 className="font-semibold text-gray-900">
                  {currentThread.senderName || "Recruiter"}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === "current-user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === "current-user"
                          ? "bg-[#3CB3A2] text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.body}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === "current-user"
                            ? "text-[#3CB3A2]/70"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t p-4 flex gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB3A2] focus:border-transparent disabled:bg-gray-50"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-2 bg-[#3CB3A2] text-white font-medium rounded-lg hover:bg-[#35a096] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
