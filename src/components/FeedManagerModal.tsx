"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Rss,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  Key,
  Globe,
  Sliders,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { FeedSource, Category } from "@/lib/types";
import { getStoredApiKey, setStoredApiKey, getAutoRefreshInterval, setAutoRefreshInterval } from "@/lib/storage";

interface FeedManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedsUpdated: () => void;
  refreshInterval: number;
  onUpdateRefreshInterval: (min: number) => void;
}

const CATEGORIES: Category[] = [
  "Generative AI",
  "LLMs & Research",
  "Hardware & Chips",
  "Cybersecurity",
  "Cloud & DevOps",
  "Open Source",
  "Big Tech",
];

export function FeedManagerModal({
  isOpen,
  onClose,
  onFeedsUpdated,
  refreshInterval,
  onUpdateRefreshInterval,
}: FeedManagerModalProps) {
  const [feeds, setFeeds] = useState<FeedSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [savedKeySuccess, setSavedKeySuccess] = useState<boolean>(false);

  // New Feed Form State
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Generative AI");
  const [addError, setAddError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadFeeds();
      setApiKey(getStoredApiKey());
    }
  }, [isOpen]);

  const loadFeeds = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/feeds");
      const data = await res.json();
      setFeeds(data.feeds || []);
    } catch (e) {
      console.error("Failed to load feeds:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeed = async (feedId: string) => {
    const updated = feeds.map((f) => (f.id === feedId ? { ...f, enabled: !f.enabled } : f));
    setFeeds(updated);
    await saveFeeds(updated);
  };

  const handleDeleteFeed = async (feedId: string) => {
    const updated = feeds.filter((f) => f.id !== feedId);
    setFeeds(updated);
    await saveFeeds(updated);
  };

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    if (!newName.trim() || !newUrl.trim()) {
      setAddError("Please fill in both name and feed URL.");
      return;
    }

    try {
      new URL(newUrl); // basic URL format test
    } catch {
      setAddError("Please enter a valid URL (starting with https:// or http://).");
      return;
    }

    const newFeed: FeedSource = {
      id: "custom-" + Date.now(),
      name: newName.trim(),
      url: newUrl.trim(),
      category: newCategory,
      enabled: true,
      isCustom: true,
      type: "rss",
    };

    const updated = [newFeed, ...feeds];
    setFeeds(updated);
    setNewName("");
    setNewUrl("");
    await saveFeeds(updated);
  };

  const handleResetDefaults = async () => {
    if (confirm("Reset all news sources to factory defaults?")) {
      try {
        const res = await fetch("/api/feeds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "reset" }),
        });
        const data = await res.json();
        setFeeds(data.feeds || []);
        onFeedsUpdated();
      } catch (e) {
        console.error("Failed to reset feeds:", e);
      }
    }
  };

  const saveFeeds = async (newFeeds: FeedSource[]) => {
    try {
      await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeds: newFeeds }),
      });
      onFeedsUpdated();
    } catch (e) {
      console.error("Failed to save feeds:", e);
    }
  };

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKey.trim());
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white">
                Feed Manager & Settings
              </h2>
              <p className="text-xs text-slate-400">
                Manage RSS sources, auto-refresh frequency, and AI credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Section 1: Auto Refresh Interval */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Auto-Update Frequency
              </h4>
              <p className="text-xs text-slate-400">
                Background interval to check and ingest fresh RSS feed updates
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[5, 15, 30, 60].map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    onUpdateRefreshInterval(min);
                    setAutoRefreshInterval(min);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    refreshInterval === min
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Gemini API Key (Optional) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-950/40 to-indigo-950/30 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                Gemini AI Key (Optional)
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Provide a Google Gemini API Key for enhanced deep analytical summaries. (Built-in high performance NLP is active by default).
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200 focus:border-purple-500 outline-none"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shrink-0"
              >
                {savedKeySuccess ? "Saved!" : "Save Key"}
              </button>
            </div>
          </div>

          {/* Section 3: Add Custom RSS Feed */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-400" />
              Add Custom RSS / Atom Feed
            </h4>

            {addError && (
              <div className="p-2 mb-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {addError}
              </div>
            )}

            <form onSubmit={handleAddFeed} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Source Name (e.g. Meta AI Blog)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="sm:col-span-4 px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-blue-500"
              />
              <input
                type="url"
                placeholder="https://example.com/rss.xml"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="sm:col-span-5 px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200 outline-none focus:border-blue-500"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="sm:col-span-2 px-2 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-300 outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="sm:col-span-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold"
                title="Add Feed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Section 4: Current Feed Sources List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Configured Sources ({feeds.length})
              </h4>
              <button
                onClick={handleResetDefaults}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            <div className="space-y-2">
              {feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => handleToggleFeed(feed.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        feed.enabled
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-700 bg-slate-800 text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${feed.enabled ? "text-slate-200" : "text-slate-500 line-through"}`}>
                          {feed.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                          {feed.category}
                        </span>
                        {feed.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 font-semibold">
                            Custom
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate block font-mono">
                        {feed.url}
                      </span>
                    </div>
                  </div>

                  {feed.isCustom && (
                    <button
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Delete feed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
