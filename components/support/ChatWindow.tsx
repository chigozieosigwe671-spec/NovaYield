"use client";

import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { useRef } from "react";

interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [adminTyping, setAdminTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
      if (user) {
        initializeConversation();
      }
    }, [user]);
    useEffect(() => {
      if (!conversation) return;

      const channel = supabase
        .channel("typing-" + conversation.id)
       
        .subscribe();

      
    }, [conversation]);

    async function initializeConversation() {

      const { data: conversations, error } = await supabase
          .from("support_conversations")
          .select("*")
          .eq("user_id", user!.id)
          .eq("status", "open")
          .order("created_at", { ascending: false });

        if (error) throw error;

        let conversation = conversations?.[0];

        if (!conversation) {
          const { data, error } = await supabase
            .from("support_conversations")
            .insert({
              user_id: user!.id,
              status: "open",
            })
            .select()
            .single();

          if (error) throw error;

          conversation = data;
        }

      setConversation(conversation);

      loadMessages(conversation.id);

     const channel = supabase
  .channel("support-" + conversation.id)

  // Listen for new messages
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "support_messages",
      filter: `conversation_id=eq.${conversation.id}`,
    },
    (payload) => {

      console.log("Realtime received:", payload.new);

      setMessages((old) => {

        if (old.some((m) => m.id === payload.new.id)) {
          return old;
        }

        return [...old, payload.new];

      });

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);

    }
  )

  // Listen for typing updates
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "support_conversations",
      filter: `id=eq.${conversation.id}`,
    },
    (payload: any) => {

      console.log("Typing update:", payload.new.admin_typing);
      setAdminTyping(payload.new.admin_typing);

    }
  )

  .subscribe((status) => {
  console.log("Realtime status:", status);
});
    
}

    async function loadMessages(conversationId: string) {

      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at");

      setMessages(data || []);
      setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);

    }
  const sendMessage = async () => {
        if (!user) {
            toast.error("Please login first.");
            return;
        }

        if (!message.trim()) return;

        setLoading(true);

        try {
           const { data: conversations, error } = await supabase
              .from("support_conversations")
              .select("*")
              .eq("user_id", user.id)
              .eq("status", "open")
              .order("created_at", { ascending: false });

            if (error) throw error;

            let conversation = conversations?.[0];

            if (!conversation) {
              const {
                  data,
                  error: conversationError,
                } = await supabase
                .from("support_conversations")
                .insert({
                  user_id: user.id,
                  status: "open",
                })
                .select()
                .single();

              if (conversationError) throw conversationError;

              conversation = data;
            }

            const text = message;

            const {
                  data,
                  error: messageError,
                } = await supabase
              .from("support_messages")
              .insert({
                conversation_id: conversation.id,
                sender: "user",
                message: text,
              })
              .select()
              .single();

            if (messageError) throw messageError;

            // Immediately show the message
            await loadMessages(conversation.id);

            
         setMessage("");

        toast.success("Message sent.");

        } catch (err: any) {
            toast.error(err.message);
        }

        setLoading(false);
        };
  return (
          <div
        className="
          fixed
          z-50
          bg-[#07152F]
          border
          border-red-600
          shadow-2xl
          flex
          flex-col
          overflow-hidden

          w-full
          h-[100dvh]
          bottom-0
          left-0

          sm:w-[380px]
          sm:h-[550px]
          sm:bottom-24
          sm:right-6
          sm:left-auto
          sm:rounded-xl
        "
      >

    <div className="bg-[#091B39] p-4 border-b border-red-700 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#E31E24] flex items-center justify-center text-white font-bold">
            NY
          </div>

          <div>
            <h2 className="text-white font-semibold">
              NovaYield Support
            </h2>

            <p className="text-green-400 text-sm">
              ● Online
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white hover:text-red-500 text-xl"
        >
          ✕
        </button>

      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

  {messages.length === 0 ? (

  <div className="bg-[#10284E] p-4 rounded-lg max-w-[90%]">

          <p className="text-white">
            👋 Welcome to NovaYield Support.
            <br /><br />
            How may we assist you today?
          </p>

        </div>

      ) : (

        <>
          {messages.map((msg) => (

            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`max-w-[75%] rounded-sm p-3 ${
                msg.sender === "user"
                  ? "bg-red-600 text-white ml-auto"
                  : "bg-[#10284E] text-white mr-auto"
              }`}
            >
              <p className="break-words break-all whitespace-pre-wrap">
                {msg.message}
              </p>
            </motion.div>

          ))}

          <div ref={bottomRef}></div>
        </>

      )}

    </div>

      {adminTyping && (
        <div className="px-4 pb-2">
          <p className="text-sm italic text-gray-400">
            NovaYield Support is typing...
          </p>
        </div>
      )}
      <div className="sticky bottom-0 bg-[#07152F] p-3 border-t border-red-700 flex gap-2">

           <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#10284E] rounded-none px-4 text-white outline-none p-2"
            />

           <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={loading}
            className="bg-[#E31E24] w-12 rounded-lg flex items-center justify-center"
            >

           <Send className="text-white w-5 h-5"/>

           </motion.button>

      </div>

    </div>
  );
}