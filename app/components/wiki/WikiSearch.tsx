"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

type WikiSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function WikiSearch({ value, onChange }: WikiSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/75 px-4 py-3 backdrop-blur transition hover:border-zinc-700"
    >
      <Search className="size-4 text-zinc-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search cybersecurity topics..."
        className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
      />
    </motion.div>
  );
}
