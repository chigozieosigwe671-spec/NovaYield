"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { User, Shield } from "lucide-react";

interface Conversation {
  id: string;
  user_id: string;
  status: string;
  created_at: string;

  last_message_at?: string;
  unread_count?: number;

  profiles?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function AdminSupportPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    // Load existing messages
    loadMessages(selectedConversation.id);

    // Listen for new messages
    const channel = supabase
      .channel("admin-chat-" + selectedConversation.id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        () => {
          loadMessages(selectedConversation.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  async function fetchConversations() {
  setLoading(true);

      // Get all conversations
     const { data: conversationsData, error } = await supabase
      .from("support_conversations")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Get all profiles
      const { data: profilesData, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email");

      if (profileError) {
        console.error(profileError);
        setLoading(false);
        return;
      }

      // Merge conversations with profiles
      const merged = conversationsData.map((conversation) => ({
        ...conversation,
        profiles: profilesData.find(
          (profile) => profile.id === conversation.user_id
        ),
      }));

      console.log("Merged conversations:", JSON.stringify(merged, null, 2));

          const conversationsWithLastMessage = await Promise.all(
           merged.map(async (conversation) => {
          const { data } = await supabase
            .from("support_messages")
            .select("created_at")
            .eq("conversation_id", conversation.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const { count } = await supabase
            .from("support_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conversation.id)
            .eq("sender", "user")
            .eq("read", false);

          return {
            ...conversation,
            last_message_at: data?.created_at || conversation.created_at,
            unread_count: count || 0,
          };
        })
      );

      conversationsWithLastMessage.sort(
        (a: any, b: any) =>
          new Date(b.last_message_at).getTime() -
          new Date(a.last_message_at).getTime()
      );

      setConversations(conversationsWithLastMessage as any);

      setLoading(false);
    }
    async function loadMessages(conversationId: string) {
        const { data, error } = await supabase
          .from("support_messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error(error);
          return;
        }

        setMessages(data || []);
        await supabase
          .from("support_messages")
          .update({
            read: true,
          })
          .eq("conversation_id", conversationId)
          .eq("sender", "user")
          .eq("read", false);

        fetchConversations();
      }
    
      async function sendReply() {
    if (!reply.trim() || !selectedConversation || !user) return;

    const { error } = await supabase
      .from("support_messages")
      .insert({
        conversation_id: selectedConversation.id,
        sender: "admin",
        message: reply,
      });

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    await loadMessages(selectedConversation.id);

        await supabase
          .from("support_conversations")
          .update({
            admin_typing: false,
          })
          .eq("id", selectedConversation.id);

        setReply("");
  } 
  async function closeConversation() {
      if (!selectedConversation) return;

      const { error } = await supabase
        .from("support_conversations")
        .update({
          status: "closed",
        })
        .eq("id", selectedConversation.id);

      if (error) {
        console.log(error);
        return;
      }

      await fetchConversations();

      setSelectedConversation(null);
      setMessages([]);
    }

  return (
    <div className="p-3 sm:p-8">

      <h1 className="text-3xl font-bold mb-8">
        Live Support
      </h1>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">

        <div className="w-full lg:col-span-4 rounded-none border bg-card max-h-[300px] lg:max-h-[calc(100vh-180px)] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="font-semibold">Conversations</h2>
            <p className="text-sm text-gray-500">
              Total: {conversations.length}
            </p>
          </div>

          {loading ? (

            <div className="p-4">
              Loading...
            </div>

          ) : (

            conversations.map((conversation) => (

              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className="w-full text-left p-4 border-b hover:bg-muted transition"
              >

               <div className="flex items-center justify-between">

                <h3 className="font-semibold">
                  {conversation.profiles?.first_name}{" "}
                  {conversation.profiles?.last_name}
                </h3>

                {(conversation.unread_count ?? 0) > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {conversation.unread_count ?? 0}
                  </span>
                )}

              </div>

                <p className="text-xs text-red-500">
                  {conversation.id}
                </p>

                <p className="text-sm text-muted-foreground">
                  {conversation.profiles?.email}
                </p>

              </button>

            ))

          )}

        </div>

        <div className="w-full lg:col-span-8 rounded-none border bg-card flex flex-col h-[70vh] lg:h-[calc(100vh-180px)]">

            {selectedConversation ? (

              <>

                {/* Header */}
                <div className="border-b p-3 sm:p-3">

                  <h2 className="font-bold text-sm">

                    {selectedConversation.profiles?.first_name}{" "}
                    {selectedConversation.profiles?.last_name}

                  </h2>

                  <p className="text-sm text-muted-foreground">

                    {selectedConversation.profiles?.email}

                  </p>
                  <div className="mt-4">
                    <button
                      onClick={closeConversation}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-none text-sm"
                    >
                      Close Conversation
                    </button>
                  </div>

                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">

                  {messages.length === 0 ? (

                    <p className="text-muted-foreground">

                      No messages yet.

                    </p>

                  ) : (

                    messages.map((msg) => (

                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >

                    <div
                      className={`flex items-end gap-2 max-w-[80%] ${
                        msg.sender === "admin"
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          msg.sender === "user"
                            ? "bg-gray-300"
                            : "bg-red-600"
                        }`}
                      >

                        {msg.sender === "user" ? (

                          <User className="w-5 h-5 text-gray-700" />

                        ) : (

                          <Shield className="w-5 h-5 text-white" />

                        )}

                      </div>

                      <div
                        className={`rounded-lg px-3 py-1 ${
                          msg.sender === "user"
                            ? "bg-gray-100"
                            : "bg-red-600 text-white"
                        }`}
                      >

                        <p className="text-sm leading-6 break-words break-all whitespace-pre-wrap">
                          {msg.message}
                        </p>
                       

                        <p
                          className={`text-[8px] mt-2 ${
                            msg.sender === "user"
                              ? "text-gray-500"
                              : "text-red-100"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                      </div>

                    </div>

                  </div>

                ))

                  )}

                </div>

                
                {/* Reply box */}
                <div className="border-t p-3 sm:p-4 flex gap-2">

                  <input
                      value={reply}
                      onChange={async (e) => {
                        const value = e.target.value;

                        setReply(value);

                        console.log("Updating typing:", value.length > 0);

                        if (!selectedConversation) return;

                        await supabase
                          .from("support_conversations")
                          .update({
                            admin_typing: value.length > 0,
                          })
                          .eq("id", selectedConversation.id);
                      }}
                      placeholder="Type your reply..."
                      className="flex-1 border rounded-none px-3 sm:px-4 py-3 text-sm sm:text-base"
                    />

                  <button
                    onClick={sendReply}
                    className="bg-red-600 text-white px-4 sm:px-4 rounded-none whitespace-nowrap text-sm"
                  >
                    Send
                  </button>

                </div>

              </>

            ) : (

              <div className="flex-1 flex items-center justify-center">

                <p className="text-muted-foreground">

                  Select a conversation

                </p>

              </div>

            )}

          </div>

      </div>

    </div>
  );
}