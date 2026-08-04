"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
  return null;
}

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

     {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#E31E24] shadow-2xl flex items-center justify-center hover:scale-105 transition-all"
        >
          <MessageCircle className="text-white w-8 h-8" />
        </button>
      )}
    </>
  );
}