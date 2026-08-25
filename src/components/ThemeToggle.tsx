"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | "cyber">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ai_news_theme_v1") as "dark" | "light" | "cyber" | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (newTheme: "dark" | "light" | "cyber") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "cyber");
    root.classList.add(newTheme);
    localStorage.setItem("ai_news_theme_v1", newTheme);
  };

  const cycleTheme = () => {
    const nextTheme = theme === "dark" ? "cyber" : theme === "cyber" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium backdrop-blur-md shadow-sm"
      title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
    >
      {theme === "dark" && <Moon className="w-4 h-4 text-blue-400" />}
      {theme === "cyber" && <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />}
      {theme === "light" && <Sun className="w-4 h-4 text-amber-400" />}
      <span className="hidden sm:inline capitalize">{theme}</span>
    </button>
  );
}
