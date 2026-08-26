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
  onUpdateRefreshInterval: (min: number) => void;
}

const CATEGORIES: Category[] = [
  "생성형 AI",
  "LLM & 연구",
  "반도체 & 칩",
  "사이버 보안",
  "클라우드 & 개발",
  "오픈소스",
  "빅테크 이슈",
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
  const [newCategory, setNewCategory] = useState<Category>("생성형 AI");
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
      setAddError("피드 이름과 RSS URL을 모두 입력해주세요.");
      return;
    }

    try {
      new URL(newUrl);
    } catch {
      setAddError("올바른 URL 형식(https:// 또는 http://)을 입력해주세요.");
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
    if (confirm("모든 뉴스 피드 소스를 초기 기본값으로 재설정하시겠습니까?")) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                뉴스 피드 소스 및 환경설정
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                수집할 RSS 소스 활성화, 자동 갱신 주기, Gemini AI API 키 설정
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

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Section 1: Auto Refresh Interval */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                실시간 자동 뉴스 수집 주기
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                백그라운드에서 최신 RSS 피드를 확인하고 갱신하는 주기 설정
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    refreshInterval === min
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {min}분
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Gemini API Key (Optional) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-slate-950/40 dark:to-indigo-950/30 border border-indigo-200/80 dark:border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-bold text-indigo-950 dark:text-purple-200 uppercase tracking-wider">
                Google Gemini API Key (선택 사항)
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              개인 Gemini API 키를 입력하시면 더 정교하고 심층적인 한국어 생성형 AI 분석을 이용하실 수 있습니다. (기본 휴리스틱 NLP 요약 엔진이 기본 활성화되어 있습니다.)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 focus:border-indigo-500 outline-none"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold transition-all shrink-0 shadow-md"
              >
                {savedKeySuccess ? "저장 완료!" : "키 저장"}
              </button>
            </div>
          </div>

          {/* Section 3: Add Custom RSS Feed */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              나만의 커스텀 RSS / Atom 피드 추가
            </h4>

            {addError && (
              <div className="p-2 mb-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {addError}
              </div>
            )}

            <form onSubmit={handleAddFeed} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="피드 이름 (예: 네이버 D2 블로그)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="sm:col-span-4 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
              <input
                type="url"
                placeholder="https://d2.naver.com/d2.atom"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="sm:col-span-5 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="sm:col-span-2 px-2 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="sm:col-span-1 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center font-bold shadow-sm"
                title="피드 추가"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Section 4: Current Feed Sources List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                현재 활성화된 피드 소스 ({feeds.length}개)
              </h4>
              <button
                onClick={handleResetDefaults}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                기본값 초기화
              </button>
            </div>

            <div className="space-y-2">
              {feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => handleToggleFeed(feed.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        feed.enabled
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${feed.enabled ? "text-slate-800 dark:text-slate-200" : "text-slate-400 line-through"}`}>
                          {feed.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {feed.category}
                        </span>
                        {feed.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                            사용자 추가
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                      title="피드 삭제"
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
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
          >
            저장 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
