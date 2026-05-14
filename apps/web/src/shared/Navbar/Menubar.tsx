"use client";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

interface MenubarProps {
  isOpen: boolean;
}

const Menubar = ({ isOpen }: MenubarProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "circOut" }}
          className="absolute top-full left-0 right-0 mt-3 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-3 border-neutral-100 z-40"
        >
          <div className="flex flex-col gap-2">
            <Button
              className="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border border-neutral-200/50 justify-start gap-3 h-12 text-sm font-semibold transition-all duration-300 rounded-xl group"
              onClick={() => window.open("https://aistudio.google.com/app/apikey", "_blank")}
            >
              <div className="bg-white p-2 rounded-lg border border-neutral-200 shadow-sm ">
                <Key className="size-4 text-neutral-600" />
              </div>
              Get Gemini API Key
            </Button>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menubar;
