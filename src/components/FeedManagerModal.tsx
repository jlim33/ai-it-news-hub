"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Rss,
  Plus,
  Trash2,
  RotateCcw,
  Check,
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
  locale?: "ko" | "en";
  onUpdateRefreshInterval: (min: number) => void;
}

const CATEGORIES_KO: Category[] = [
  "생성형 AI",
  "LLM & 연구",
  "반도체 & 칩",
  "사이버 보안",
  "클라우드 & 개발",
  "오픈소스",
  "빅테크 이슈",
];

const CATEGORIES_EN: Category[] = [
  "Generative AI",
  "LLMs & Research",
  "Chips & Hardware",
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
  locale = "ko",
  onUpdateRefreshInterval,
}: FeedManagerModalProps) {
  const isEn = locale === "en";
  const [feeds, setFeeds] = useState<FeedSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [savedKeySuccess, setSavedKeySuccess] = useState<boolean>(false);

  // New Feed Form State
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<Category>(isEn ? "Generative AI" : "생성형 AI");
  const [addError, setAddError] = useState("");

  const activeCategories = isEn ? CATEGORIES_EN : CATEGORIES_KO;

  useEffect(() => {
    if (isOpen) {
      loadFeeds();
      setApiKey(getStoredApiKey());
      setNewCategory(isEn ? "Generative AI" : "생성형 AI");
    }
  }, [isOpen, isEn]);

  const loadFeeds = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/feeds");
      const data = await res.json();
      setFeeds(data.feeds || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeed = async (feedId: string) => {
    const updated = feeds.map((f) =>
      f.id === feedId ? { ...f, enabled: !f.enabled } : f
    );
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
      setAddError(isEn ? "Please fill in both name and RSS URL." : "피드 이름과 RSS URL을 모두 입력해주세요.");
      return;
    }

    try {
      new URL(newUrl.trim());
    } catch {
      setAddError(isEn ? "Please enter a valid URL (e.g. https://domain.com/feed.xml)." : "올바른 URL 형식을 입력해주세요 (예: https://domain.com/feed.xml)");
      return;
    }

    const newFeed: FeedSource = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      url: newUrl.trim(),
      category: newCategory,
      enabled: true,
      isCustom: true,
      type: "rss",
      lang: isEn ? "en" : "ko",
      icon: "Rss",
    };

    const updated = [...feeds, newFeed];
    setFeeds(updated);
    setNewName("");
    setNewUrl("");
    await saveFeeds(updated);
  };

  const handleResetFeeds = async () => {
    if (!confirm(isEn ? "Are you sure you want to reset all feeds to system defaults?" : "모든 피드 설정을 시스템 기본값으로 초기화하시겠습니까?")) return;
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      setFeeds(data.feeds);
      onFeedsUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const saveFeeds = async (updatedFeeds: FeedSource[]) => {
    try {
      await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeds: updatedFeeds }),
      });
      onFeedsUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKey.trim());
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {isEn ? "RSS Feed Sources Manager" : "RSS 뉴스 피드 소스 관리"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? "Enable, disable or add custom RSS/Atom intelligence sources" : "수집 대상 피드 활성화/비활성화 및 나만의 맞춤 RSS 추가"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Refresh Interval Settings */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                {isEn ? "Auto-Refresh Interval" : "실시간 자동 새로고침 주기"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn ? "Background polling interval for latest stories" : "백그라운드에서 최신 뉴스를 가져오는 주기"}
              </span>
            </div>

            <select
              value={refreshInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateRefreshInterval(val);
                setAutoRefreshInterval(val);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value={5}>{isEn ? "Every 5 min" : "5분마다"}</option>
              <option value={15}>{isEn ? "Every 15 min (Default)" : "15분마다 (기본값)"}</option>
              <option value={30}>{isEn ? "Every 30 min" : "30분마다"}</option>
              <option value={60}>{isEn ? "Every 1 hour" : "1시간마다"}</option>
            </select>
          </div>

          {/* Add Custom Feed Form */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-indigo-50/70 dark:from-slate-850 dark:to-indigo-950/30 border border-amber-200/70 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Plus className="w-4 h-4 text-amber-500" />
              <span>{isEn ? "Add Custom RSS / Atom Feed" : "커스텀 RSS / Atom 피드 추가"}</span>
            </div>

            <form onSubmit={handleAddFeed} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={isEn ? "Feed Name (e.g. Meta AI Blog)" : "피드 이름 (예: 메타 AI 블로그)"}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Category)}
                  className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 outline-none"
                >
                  {activeCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://domain.com/feed.xml"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-all shadow-md shadow-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? "Add Feed" : "추가"}</span>
                </button>
              </div>

              {addError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{addError}</span>
                </div>
              )}
            </form>
          </div>

          {/* Active Feeds List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isEn ? "Configured News Sources" : "현재 수집 중인 소스 목록"} ({feeds.length})
              </span>
              <button
                onClick={handleResetFeeds}
                className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 text-[11px] font-semibold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isEn ? "Reset Defaults" : "기본값 초기화"}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-6 text-slate-400 text-xs">{isEn ? "Loading feeds..." : "피드 목록 불러오는 중..."}</div>
              ) : (
                feeds.map((feed) => (
                  <div
                    key={feed.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <input
                        type="checkbox"
                        checked={feed.enabled}
                        onChange={() => handleToggleFeed(feed.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs truncate ${feed.enabled ? "text-slate-900 dark:text-white" : "text-slate-400 line-through"}`}>
                            {feed.name}
                          </span>
                          {feed.isCustom && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono truncate block">
                          {feed.url}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium">
                        {feed.category}
                      </span>
                      {feed.isCustom && (
                        <button
                          onClick={() => handleDeleteFeed(feed.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title={isEn ? "Delete custom feed" : "피드 삭제"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm"
          >
            {isEn ? "Done" : "완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
