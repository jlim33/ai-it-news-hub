"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Trash2,
  User,
  Sparkles,
  Smile,
  ShieldCheck
} from "lucide-react";
import { Comment } from "@/lib/types";
import {
  getArticleComments,
  addArticleComment,
  deleteArticleComment,
  likeArticleComment,
  getSavedNickname,
  saveNickname
} from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface CommentsSectionProps {
  articleId: string;
  locale?: "ko" | "en";
  onCommentCountChange?: (count: number) => void;
}

const PRESET_NICKNAMES_KO = [
  "판교 AI 엔지니어",
  "테크 얼리어답터",
  "실리콘밸리 구독자",
  "생성형 AI 연구원",
  "클라우드 아키텍트",
  "스타트업 창업가"
];

const PRESET_NICKNAMES_EN = [
  "Silicon Valley Dev",
  "GenAI Researcher",
  "Cloud Architect",
  "Tech Early Adopter",
  "Open Source Hacker",
  "ML Systems Engineer"
];

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

export function CommentsSection({ articleId, locale = "ko", onCommentCountChange }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEn = locale === "en";

  useEffect(() => {
    const list = getArticleComments(articleId);
    setComments(list);
    if (onCommentCountChange) onCommentCountChange(list.length);

    const savedName = getSavedNickname();
    if (savedName) {
      setNickname(savedName);
    } else {
      const presets = isEn ? PRESET_NICKNAMES_EN : PRESET_NICKNAMES_KO;
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      setNickname(randomPreset);
    }
  }, [articleId, isEn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const defaultAnonymous = isEn ? "Anonymous Reader" : "익명의 독자";
    const chosenName = nickname.trim() || defaultAnonymous;
    saveNickname(chosenName);

    const randomGradient = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
    const newComment = addArticleComment(articleId, chosenName, content.trim(), randomGradient);

    const updated = [newComment, ...comments];
    setComments(updated);
    setContent("");
    setIsSubmitting(false);
    if (onCommentCountChange) onCommentCountChange(updated.length);
  };

  const handleDelete = (commentId: string) => {
    deleteArticleComment(articleId, commentId);
    const updated = comments.filter((c) => c.id !== commentId);
    setComments(updated);
    if (onCommentCountChange) onCommentCountChange(updated.length);
  };

  const handleLike = (commentId: string) => {
    likeArticleComment(articleId, commentId);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
  };

  const formatCommentDate = (isoStr: string) => {
    try {
      if (isEn) {
        return formatDistanceToNow(new Date(isoStr), { addSuffix: true });
      }
      return formatDistanceToNow(new Date(isoStr), { addSuffix: true, locale: ko });
    } catch {
      return isEn ? "Just now" : "방금 전";
    }
  };

  return (
    <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800">
      
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-blue-500/20 text-indigo-700 dark:text-blue-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-wide">
            {isEn ? "Live Reader Discussion" : "실시간 독자 토론 & 의견"}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-blue-400 border border-indigo-200 dark:border-slate-700">
            {comments.length}
          </span>
        </div>

        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          {isEn ? "Open Community" : "자유로운 테크 의견 교환"}
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isEn ? "Handle:" : "닉네임:"}</span>
          </div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={isEn ? "Enter your handle..." : "닉네임을 입력하세요..."}
            className="w-full max-w-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isEn
                ? "Share your perspective, technical analysis, or insights on this story..."
                : "이 기사에 대한 생각, 기술적 견해, 질문 등을 자유롭게 남겨보세요..."
            }
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-indigo-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 resize-none transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">
              {content.length} {isEn ? "chars" : "자"}
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isEn ? "Post Comment" : "댓글 등록"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-medium">
            <Smile className="w-6 h-6 mx-auto mb-2 text-slate-400" />
            <p>{isEn ? "No comments yet. Be the first to share your thoughts!" : "아직 작성된 댓글이 없습니다. 첫 번째 의견을 남겨보세요!"}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${
                      comment.avatarColor || "from-blue-500 to-indigo-600"
                    } text-white font-black text-xs flex items-center justify-center shadow-xs`}
                  >
                    {comment.author.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {comment.author}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatCommentDate(comment.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-semibold transition-all"
                    title={isEn ? "Upvote comment" : "댓글 추천"}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                    title={isEn ? "Delete comment" : "댓글 삭제"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-9 font-medium">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
