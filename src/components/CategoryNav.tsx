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
  ArrowUpDown
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
  { name: "전체", label: "전체 뉴스", icon: Layers },
  { name: "생성형 AI", label: "생성형 AI", icon: Sparkles },
  { name: "LLM & 연구", label: "LLM & 연구", icon: BookOpen },
  { name: "반도체 & 칩", label: "반도체 & 칩", icon: Cpu },
  { name: "사이버 보안", label: "사이버 보안", icon: ShieldAlert },
  { name: "클라우드 & 개발", label: "클라우드 & 개발", icon: Cloud },
  { name: "오픈소스", label: "오픈소스", icon: GitBranch },
  { name: "빅테크 이슈", label: "빅테크 이슈", icon: Flame },
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
  const getCount = (cat: Category) => {
    if (cat === "전체") return articles.length;
    return articles.filter((a) => a.category === cat).length;
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-200/80 dark:border-slate-800/80">
      
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
        {CATEGORIES.map(({ name, label, icon: Icon }) => {
          const isSelected = selectedCategory === name;
          const count = getCount(name);

          return (
            <button
              key={name}
              onClick={() => onSelectCategory(name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-lg shadow-indigo-500/25 scale-[1.02]"
                  : "bg-white/90 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 shadow-sm"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-indigo-500"}`} />
              <span>{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? "bg-indigo-700 text-indigo-100" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* View Switcher & Sorting */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 text-xs">
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-transparent text-slate-700 dark:text-slate-300 font-bold outline-none cursor-pointer pr-1"
          >
            <option value="latest" className="bg-white dark:bg-slate-900">최신순</option>
            <option value="popular" className="bg-white dark:bg-slate-900">좋아요/인기순</option>
            <option value="readTime" className="bg-white dark:bg-slate-900">빠른 읽기순</option>
          </select>
        </div>

        {/* Grid vs List View */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === "grid"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
            title="그리드 뷰"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === "list"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
            title="리스트 뷰"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
