"use client";

import React from "react";
import {
  Sparkles,
  BookOpen,
  Cpu,
  ShieldAlert,
  Cloud,
  GitBranch,
  Layers,
  LayoutGrid,
  List,
  Flame,
  Clock,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { Category, NewsArticle } from "@/lib/types";

interface CategoryNavProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  articles: NewsArticle[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: "latest" | "popular" | "readTime";
  onSortChange: (sort: "latest" | "popular" | "readTime") => void;
}

const CATEGORIES: { name: Category; label: string; icon: any }[] = [
  { name: "All", label: "All News", icon: Layers },
  { name: "Generative AI", label: "Generative AI", icon: Sparkles },
  { name: "LLMs & Research", label: "LLMs & Research", icon: BookOpen },
  { name: "Hardware & Chips", label: "Hardware & Chips", icon: Cpu },
  { name: "Cybersecurity", label: "Cybersecurity", icon: ShieldAlert },
  { name: "Cloud & DevOps", label: "Cloud & DevOps", icon: Cloud },
  { name: "Open Source", label: "Open Source", icon: GitBranch },
  { name: "Big Tech", label: "Big Tech", icon: Flame },
];

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
  articles,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: CategoryNavProps) {
  // Compute count per category
  const getCount = (cat: Category) => {
    if (cat === "All") return articles.length;
    return articles.filter((a) => a.category === cat).length;
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-800/80">
      
      {/* Category Pills (Horizontally scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
        {CATEGORIES.map(({ name, label, icon: Icon }) => {
          const isSelected = selectedCategory === name;
          const count = getCount(name);

          return (
            <button
              key={name}
              onClick={() => onSelectCategory(name)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 scale-[1.02]"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
              <span>{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? "bg-blue-700 text-blue-100" : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* View Switcher & Sorting Controls */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 text-xs">
        
        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-transparent text-slate-300 font-medium outline-none cursor-pointer pr-1"
          >
            <option value="latest" className="bg-slate-900 text-slate-200">Latest First</option>
            <option value="popular" className="bg-slate-900 text-slate-200">High Impact</option>
            <option value="readTime" className="bg-slate-900 text-slate-200">Quick Reads</option>
          </select>
        </div>

        {/* Grid vs List View */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Compact List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
