"use client";

import { motion } from "framer-motion";
import type { WikiCategory } from "@/types/wiki";

type WikiSidebarProps = {
  categories: WikiCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
};

export function WikiSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
}: WikiSidebarProps) {
  return (
    <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-900/55 p-3 backdrop-blur lg:sticky lg:top-20">
      <p className="px-2 text-xs uppercase tracking-[0.16em] text-zinc-400">Categories</p>
      <div className="mt-2 space-y-1.5">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <motion.button
              key={category.id}
              whileHover={{ x: 2 }}
              onClick={() => onCategorySelect(category.id)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                isActive
                  ? "border-blue-400/25 bg-zinc-800/85 text-zinc-100"
                  : "border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/70"
              }`}
            >
              <category.icon className="size-4 shrink-0" />
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
