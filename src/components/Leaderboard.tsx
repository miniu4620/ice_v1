import React, { useState, useEffect } from 'react';
import { getTopRankings, deleteScore } from '../lib/gameService';
import { ScoreRecord, STAGE_CONFIGS } from '../types/game';
import { formatTime } from '../lib/confetti';
import { ConfirmModal } from './ConfirmModal';
import { Trophy, Clock, Sparkles, RefreshCw, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LeaderboardProps {
  initialStage?: number;
  currentNickname?: string;
  isAdmin?: boolean;
  onSelectStage?: (stage: number) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  initialStage = 1,
  currentNickname,
  isAdmin = false,
  onSelectStage
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(initialStage);
  const [rankings, setRankings] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Custom delete confirmation modal state
  const [modalTarget, setModalTarget] = useState<{ id: string; nickname: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchStageRankings = async (stageNum: number) => {
    setLoading(true);
    try {
      const data = await getTopRankings(stageNum);
      setRankings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStageRankings(selectedStage);
  }, [selectedStage]);

  const confirmDeleteScore = async () => {
    if (!modalTarget) return;
    const { id, nickname } = modalTarget;

    setDeletingId(id);
    try {
      await deleteScore(id);
      setRankings(prev => prev.filter(r => r.id !== id));
      setModalTarget(null);
      showToast(`"${nickname}" 님의 스텝 ${selectedStage} 기록이 삭제되었습니다.`);
    } catch (err) {
      console.error('Failed to delete score:', err);
      showToast('기록 삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const currentStageInfo = STAGE_CONFIGS.find(s => s.stage === selectedStage) || STAGE_CONFIGS[0];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-amber-100/80 p-5 md:p-6 transition-all relative">
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
        title="명예의 전당 기록 삭제"
        message={`해당 교육생의 스텝 ${selectedStage} 순위 기록을 데이터베이스에서 완전히 삭제합니다.`}
        targetName={modalTarget?.nickname}
        onConfirm={confirmDeleteScore}
        onCancel={() => setModalTarget(null)}
        isDeleting={Boolean(deletingId)}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Trophy className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                명예의 전당 <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">TOP 10</span>
              </h2>
              {isAdmin && (
                <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  관리자 모드 (개별 삭제 가능)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">스텝별 최고 스피드 기록자 랭킹</p>
          </div>
        </div>

        <button
          onClick={() => fetchStageRankings(selectedStage)}
          className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition active:scale-95 cursor-pointer"
          title="새로고침"
          aria-label="새로고침"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
        </button>
      </div>

      {/* Stage Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {STAGE_CONFIGS.map(cfg => {
          const isSelected = cfg.stage === selectedStage;
          return (
            <button
              key={cfg.stage}
              onClick={() => {
                setSelectedStage(cfg.stage);
                if (onSelectStage) onSelectStage(cfg.stage);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30 scale-102'
                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {cfg.name} ({cfg.gridRows}×{cfg.gridCols})
            </button>
          );
        })}
      </div>

      {/* Stage Details Bar */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 mb-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-900">{currentStageInfo.name}</span>
          <span className="text-slate-500">• {currentStageInfo.totalPairs}쌍 매칭</span>
        </div>
        <span className="text-amber-700 font-medium">{currentStageInfo.badge}</span>
      </div>

      {/* Ranking List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-sm">기록을 불러오는 중입니다...</p>
        </div>
      ) : rankings.length === 0 ? (
        <div className="py-10 text-center text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-400" />
          <p className="font-medium text-sm text-slate-700">아직 {currentStageInfo.name} 기록이 없습니다!</p>
          <p className="text-xs text-slate-400 mt-1">지금 바로 첫 번째 1위 주인공이 되어보세요 👑</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {rankings.map((rec, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            const isMe = currentNickname && rec.nickname.toLowerCase() === currentNickname.toLowerCase();

            return (
              <div
                key={rec.id || idx}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/50 shadow-sm'
                    : isTop3
                    ? 'bg-gradient-to-r from-amber-50/40 to-orange-50/30 border-amber-100 hover:border-amber-200'
                    : 'bg-white border-slate-100 hover:border-amber-100'
                }`}
              >
                {/* Left: Rank Badge + Nickname + Cheer Message */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl font-black text-sm">
                    {rank === 1 && (
                      <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm">
                        🥇 1
                      </span>
                    )}
                    {rank === 2 && (
                      <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shadow-sm">
                        🥈 2
                      </span>
                    )}
                    {rank === 3 && (
                      <span className="w-8 h-8 rounded-xl bg-amber-200/90 text-amber-900 flex items-center justify-center shadow-sm">
                        🥉 3
                      </span>
                    )}
                    {rank > 3 && (
                      <span className="text-slate-400 font-bold">
                        {rank}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-slate-800 truncate">
                        {rec.nickname}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                          나
                        </span>
                      )}
                    </div>
                    {rec.cheerMessage && (
                      <p className="text-xs text-amber-800/80 truncate italic mt-0.5">
                        &quot;{rec.cheerMessage}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Time & Moves & Admin Delete */}
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-black text-amber-600">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{formatTime(rec.timeMs)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {rec.moves}회 시도
                    </div>
                  </div>

                  {isAdmin && rec.id && (
                    <button
                      type="button"
                      onClick={() => setModalTarget({ id: rec.id!, nickname: rec.nickname })}
                      disabled={deletingId === rec.id}
                      className="p-2 ml-1 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition border border-rose-200 hover:border-rose-500 active:scale-95 cursor-pointer disabled:opacity-50"
                      title="이 기록 삭제 (관리자)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
