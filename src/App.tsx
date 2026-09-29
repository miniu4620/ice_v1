import React, { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { Leaderboard } from './components/Leaderboard';
import { Guestbook } from './components/Guestbook';
import { STAGE_CONFIGS } from './types/game';
import { Sparkles, Trophy, HeartHandshake, User, PenTool, Flame, RefreshCw, Layers, ShieldCheck, KeyRound, X } from 'lucide-react';

const SUGGESTED_CHEERS = [
  '오늘 하루도 반짝이는 나를 응원해! ✨',
  '실패해도 괜찮아, 언제나 배움의 과정이야 🌿',
  '손끝에서 피어나는 행복한 공방 시간 🎨',
  '나는 매일매일 더 멋지게 성장하고 있어 🚀',
  '웃는 얼굴로 오늘 만남을 소중히 기억하자 💖'
];

export default function App() {
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('miniu_nickname') || '';
  });
  // Empty default cheerMessage so the placeholder is visible and disappears when typed
  const [cheerMessage, setCheerMessage] = useState(() => {
    return localStorage.getItem('miniu_cheer') || '';
  });
  const [isProfileSet, setIsProfileSet] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('miniu_nickname'));
  });

  const [activeTab, setActiveTab] = useState<'game' | 'ranking' | 'guestbook'>('game');
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Admin Mode states
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminPasswordError, setAdminPasswordError] = useState<boolean>(false);

  // Save profile to local storage for persistence across reloads
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    localStorage.setItem('miniu_nickname', nickname.trim());
    localStorage.setItem('miniu_cheer', cheerMessage.trim());
    setIsProfileSet(true);
  };

  const handleEditProfile = () => {
    setIsProfileSet(false);
  };

  const handleRandomCheer = () => {
    const remaining = SUGGESTED_CHEERS.filter(c => c !== cheerMessage);
    const pick = remaining[Math.floor(Math.random() * remaining.length)] || SUGGESTED_CHEERS[0];
    setCheerMessage(pick);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === '0410') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPasswordInput('');
      setAdminPasswordError(false);
    } else {
      setAdminPasswordError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/25">
              유
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  미니유공방
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                카드뒤집기 스피드 챌린지
              </h1>
            </div>
          </div>

          {/* Right Header Buttons: Profile & Admin Mode */}
          <div className="flex items-center gap-2">
            {isProfileSet && (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-900 font-bold transition active:scale-95 cursor-pointer"
                title="닉네임 / 응원 문구 수정하기"
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span className="max-w-[70px] sm:max-w-[110px] truncate">{nickname}</span>
                <PenTool className="w-3 h-3 text-amber-400" />
              </button>
            )}

            {/* Admin Mode Button */}
            {isAdmin ? (
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs text-red-700 font-bold transition active:scale-95 cursor-pointer"
                title="관리자 모드 종료"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>관리자 ON</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowAdminModal(true);
                  setAdminPasswordError(false);
                  setAdminPasswordInput('');
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 text-xs font-semibold transition active:scale-95 flex items-center gap-1 cursor-pointer"
                title="관리자 모드"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">관리자</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-around border-t border-amber-50 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>카드뒤집기 게임</span>
          </button>

          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ranking'
                ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>명예의 전당 (TOP 10)</span>
          </button>

          <button
            onClick={() => setActiveTab('guestbook')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'guestbook'
                ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>방명록</span>
          </button>
        </div>
      </header>

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xs w-full p-5 relative animate-scaleUp">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              관리자 모드 접속
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              관리자 비밀번호를 입력해주세요.
            </p>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={e => {
                    setAdminPasswordInput(e.target.value);
                    setAdminPasswordError(false);
                  }}
                  placeholder="비밀번호 입력"
                  autoFocus
                  required
                  className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 rounded-xl border focus:outline-none focus:ring-2 ${
                    adminPasswordError
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-amber-400'
                  }`}
                />
                {adminPasswordError && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-md"
              >
                인증 및 관리자 모드 활성화
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="max-w-4xl w-full mx-auto px-4 py-5 flex-1">
        {/* Intro & Nickname Prompt if not set or editing */}
        {(!isProfileSet || !nickname) && (
          <div className="bg-white rounded-3xl shadow-xl border border-amber-200/80 p-5 sm:p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/40 to-orange-100/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                첫 시작 환영합니다!
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">
              미니유공방 참가자 등록
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              닉네임과 나에게 건네는 따뜻한 응원 한마디를 적어주세요. 기록이 명예의 전당에 실시간 등재됩니다!
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1 flex items-center gap-1">
                  <span>1. 게임에서 사용할 닉네임</span>
                  <span className="text-amber-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="예: 공방꿈나무, 미니유러버, 빠른손"
                  maxLength={15}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-amber-50/40 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold text-slate-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-slate-700 flex items-center gap-1">
                    <span>2. 나에게 건네는 응원 한마디</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomCheer}
                    className="text-[11px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    추천 문구 넣기
                  </button>
                </div>
                {/* Gray placeholder that disappears upon typing as requested */}
                <input
                  type="text"
                  value={cheerMessage}
                  onChange={e => setCheerMessage(e.target.value)}
                  placeholder="오늘 하루도 멋지게 나만의 작품을 완성하자! ✨"
                  maxLength={40}
                  className="w-full px-4 py-2.5 text-sm bg-amber-50/40 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-slate-800 placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  이 응원 문구는 게임 화면과 랭킹 순위표에 내 닉네임과 함께 반짝입니다 💛
                </p>
              </div>

              <button
                type="submit"
                disabled={!nickname.trim()}
                className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                도전 시작하기!
              </button>
            </form>
          </div>
        )}

        {/* Tab 1: Game View */}
        {activeTab === 'game' && (
          <div>
            {/* Stage Selector Ribbon */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-amber-100 p-2.5 mb-4 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 mb-2">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  스텝별 난이도 선택 (총 5단계)
                </span>
                <span className="text-[11px] text-amber-600 font-semibold">모바일 최적화</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {STAGE_CONFIGS.map(cfg => {
                  const isCurrent = cfg.stage === currentStage;
                  return (
                    <button
                      key={cfg.stage}
                      onClick={() => setCurrentStage(cfg.stage)}
                      className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 font-black scale-102'
                          : 'bg-amber-50/70 hover:bg-amber-100/70 text-slate-700 font-bold'
                      }`}
                    >
                      <div className="text-[10px] sm:text-xs">스텝 {cfg.stage}</div>
                      <div className="text-[9px] opacity-80 hidden sm:block">
                        {cfg.gridRows}×{cfg.gridCols}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Game Board */}
            <GameBoard
              nickname={nickname || '미니유'}
              cheerMessage={cheerMessage}
              currentStageNum={currentStage}
              onChangeStage={s => setCurrentStage(s)}
              onFinishGame={() => setActiveTab('ranking')}
            />
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'ranking' && (
          <Leaderboard
            initialStage={currentStage}
            currentNickname={nickname}
            isAdmin={isAdmin}
            onSelectStage={s => setCurrentStage(s)}
          />
        )}

        {/* Tab 3: Guestbook */}
        {activeTab === 'guestbook' && (
          <Guestbook
            currentNickname={nickname}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-100 bg-white/70 py-4 px-4 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-500 mb-0.5">
          미니유공방 아이스브레이킹 카드뒤집기 챌린지 🎨
        </p>
        <p className="text-[11px]">
          이 게임을 하는 모든 분들이 행복해지고 따뜻한 활력을 얻어가시길 응원합니다 ✨
        </p>
      </footer>
    </div>
  );
}
