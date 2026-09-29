import React, { useState, useEffect } from 'react';
import { addGuestbookEntry, getGuestbookEntries, deleteGuestbookEntry } from '../lib/gameService';
import { GuestbookEntry } from '../types/game';
import { ConfirmModal } from './ConfirmModal';
import { MessageSquareHeart, Send, Sparkles, Smile, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface GuestbookProps {
  currentNickname: string;
  isAdmin?: boolean;
}

const TAG_OPTIONS = [
  '🎉 활력충전 100%',
  '💛 힐링 가득',
  '🔥 짜릿한 승부욕',
  '🌸 미니유공방 최고',
  '✨ 응원해요!'
];

export const Guestbook: React.FC<GuestbookProps> = ({ currentNickname, isAdmin = false }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(currentNickname || '');
  const [message, setMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState(TAG_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Custom modal state
  const [modalTarget, setModalTarget] = useState<{ id: string; nickname: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (currentNickname && !author) {
      setAuthor(currentNickname);
    }
  }, [currentNickname, author]);

  const loadGuestbook = async () => {
    setLoading(true);
    try {
      const data = await getGuestbookEntries(40);
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuestbook();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await addGuestbookEntry({
        nickname: author.trim(),
        message: message.trim(),
        tag: selectedTag
      });
      setMessage('');
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
      await loadGuestbook();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteEntry = async () => {
    if (!modalTarget) return;
    const { id, nickname } = modalTarget;

    setDeletingId(id);
    try {
      await deleteGuestbookEntry(id);
      setEntries(prev => prev.filter(e => e.id !== id));
      setModalTarget(null);
      showToast(`"${nickname}" 님의 방명록 글이 삭제되었습니다.`);
    } catch (err) {
      console.error('Failed to delete guestbook entry:', err);
      showToast('방명록 삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${m}월 ${d}일 ${h}:${min}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-amber-100/80 p-5 md:p-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(modalTarget)}
        title="방명록 글 삭제"
        message="작성된 방명록 소감글을 데이터베이스에서 완전히 삭제합니다."
        targetName={modalTarget?.nickname}
        onConfirm={confirmDeleteEntry}
        onCancel={() => setModalTarget(null)}
        isDeleting={Boolean(deletingId)}
      />

      {/* Header */}
      <div className="flex items-center space-x-2.5 border-b border-amber-100 pb-4 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
          <MessageSquareHeart className="w-5 h-5 text-pink-50" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              방명록
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
                소통공간
              </span>
            </h2>
            {isAdmin && (
              <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                관리자 모드 (개별 삭제 가능)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">게임을 마친 소감이나 동료들을 향한 따스한 응원을 남겨보세요!</p>
        </div>
      </div>

      {/* Guestbook Form */}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-amber-50/60 to-rose-50/40 border border-amber-200/70 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                닉네임
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                required
                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                기분 태그
              </label>
              <select
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-slate-700"
              >
                {TAG_OPTIONS.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              남기고 싶은 한마디 & 소감
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="오늘 공방 수업 화이팅! 카드 찾느라 손에 땀을 쥐었네요 ㅎㅎ"
              maxLength={250}
              rows={2}
              required
              className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 font-normal resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              {message.length} / 250자
            </span>
            <button
              type="submit"
              disabled={submitting || !author.trim() || !message.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-rose-600 transition flex items-center gap-1.5 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? '등록 중...' : '방명록 남기기'}</span>
            </button>
          </div>

          {successNotice && (
            <div className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5" />
              소중한 한마디가 등록되었습니다! 감사합니다.
            </div>
          )}
        </div>
      </form>

      {/* Guestbook List */}
      {loading ? (
        <div className="py-8 text-center text-slate-400">
          <p className="text-xs">방명록을 불러오고 있습니다...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
          <Smile className="w-7 h-7 mx-auto mb-1.5 text-pink-400" />
          <p className="font-semibold text-sm">첫 방명록을 남겨보세요!</p>
          <p className="text-xs text-slate-400 mt-0.5">교육 동료들과 즐거운 에너지를 나눠보세요.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="bg-slate-50/70 hover:bg-amber-50/40 border border-slate-200/80 hover:border-amber-200 rounded-2xl p-3.5 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-800">
                    {entry.nickname}
                  </span>
                  {entry.tag && (
                    <span className="text-[10px] bg-rose-100/80 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                      {entry.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDate(entry.createdAt)}
                  </span>
                  {isAdmin && entry.id && (
                    <button
                      type="button"
                      onClick={() => setModalTarget({ id: entry.id!, nickname: entry.nickname })}
                      disabled={deletingId === entry.id}
                      className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition border border-rose-200 hover:border-rose-500 active:scale-95 cursor-pointer disabled:opacity-50"
                      title="이 방명록 글 삭제 (관리자)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed break-words whitespace-pre-wrap">
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
