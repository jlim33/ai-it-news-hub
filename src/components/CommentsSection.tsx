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
  onCommentCountChange?: (count: number) => void;
}

const PRESET_NICKNAMES = [
  "판교 AI 엔지니어",
  "테크 얼리어답터",
  "실리콘밸리 구독자",
  "생성형 AI 연구원",
  "클라우드 아키텍트",
  "스타트업 창업가"
];

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

export function CommentsSection({ articleId, onCommentCountChange }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const list = getArticleComments(articleId);
    setComments(list);
    if (onCommentCountChange) onCommentCountChange(list.length);

    const savedName = getSavedNickname();
    if (savedName) {
      setNickname(savedName);
    } else {
      const randomPreset = PRESET_NICKNAMES[Math.floor(Math.random() * PRESET_NICKNAMES.length)];
      setNickname(randomPreset);
    }
  }, [articleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const chosenName = nickname.trim() || "익명의 독자";
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
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const formatKoreanTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
    } catch {
      return "방금 전";
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            독자 의견 및 토론 ({comments.length})
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          자유롭게 의견을 나눠보세요
        </span>
      </div>

      {/* Comment Input Box */}
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">닉네임:</span>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {PRESET_NICKNAMES.slice(0, 3).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNickname(preset)}
                className="px-2 py-0.5 rounded-md text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 기사에 대한 생각이나 분석, 질문을 남겨주세요..."
            rows={3}
            className="w-full p-3 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={`absolute right-2.5 bottom-3.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
              !content.trim() ? "opacity-50 cursor-not-allowed" : "scale-100 active:scale-95"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>등록</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Smile className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              아직 작성된 댓글이 없습니다.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              첫 번째로 의견을 남겨보세요!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                      comment.avatarColor || "from-blue-500 to-indigo-600"
                    } text-white flex items-center justify-center text-[10px] font-bold shadow-sm`}
                  >
                    {comment.author.charAt(0)}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {comment.author}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {formatKoreanTime(comment.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-semibold transition-colors"
                    title="댓글 추천"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="댓글 삭제"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-8">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
