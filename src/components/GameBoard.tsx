import React, { useState, useEffect, useRef } from 'react';
import { Card } from './Card';
import { CardItem, StageConfig, STAGE_CONFIGS, POSITIVE_CARD_DECK, sounds } from '../types/game';
import { saveScore } from '../lib/gameService';
import { fireFireworks, formatTime } from '../lib/confetti';
import { Timer, Zap, Trophy, Play, RotateCcw, ChevronRight, Award, Heart, Sparkles, Smile } from 'lucide-react';

interface GameBoardProps {
  nickname: string;
  cheerMessage: string;
  currentStageNum: number;
  onChangeStage: (stage: number) => void;
  onFinishGame: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  nickname,
  cheerMessage,
  currentStageNum,
  onChangeStage,
  onFinishGame
}) => {
  const stageConfig = STAGE_CONFIGS.find(s => s.stage === currentStageNum) || STAGE_CONFIGS[0];

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalTimeMs, setFinalTimeMs] = useState<number>(0);
  const [savingScore, setSavingScore] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  // Initialize deck for current stage
  const initializeDeck = () => {
    // Shuffle available positive phrases and pick needed amount of pairs
    const shuffledDeck = [...POSITIVE_CARD_DECK].sort(() => Math.random() - 0.5);
    const selectedPhrases = shuffledDeck.slice(0, stageConfig.totalPairs);

    const generatedCards: CardItem[] = [];
    selectedPhrases.forEach((phrase, idx) => {
      // Card instance 1
      generatedCards.push({
        id: `${phrase.key}_a_${Date.now()}_${idx}`,
        pairKey: phrase.key,
        label: phrase.label,
        emoji: phrase.emoji,
        cheerPhrase: phrase.cheerPhrase,
        themeColor: phrase.bgTone
      });
      // Card instance 2
      generatedCards.push({
        id: `${phrase.key}_b_${Date.now()}_${idx}`,
        pairKey: phrase.key,
        label: phrase.label,
        emoji: phrase.emoji,
        cheerPhrase: phrase.cheerPhrase,
        themeColor: phrase.bgTone
      });
    });

    // Shuffle the full card deck
    const randomized = generatedCards.sort(() => Math.random() - 0.5);
    setCards(randomized);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsPlaying(false);
    setStartTime(null);
    setElapsedTime(0);
    setIsCompleted(false);
    setSavedSuccess(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    initializeDeck();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStageNum]);

  // Stopwatch timer runner
  useEffect(() => {
    if (isPlaying && startTime) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, startTime]);

  // Handle Start with brief countdown
  const handleStartGame = () => {
    setCountdown(3);
    const countTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countTimer);
          // Start actual game
          setIsPlaying(true);
          const now = Date.now();
          setStartTime(now);
          setElapsedTime(0);
          return null;
        }
        return prev - 1;
      });
    }, 600);
  };

  // Card click handler
  const handleCardClick = (index: number) => {
    // If not started yet, first click automatically starts the game
    if (!isPlaying && !isCompleted && countdown === null) {
      setIsPlaying(true);
      const now = Date.now();
      setStartTime(now);
      setElapsedTime(0);
    }

    if (flippedIndices.length >= 2 || flippedIndices.includes(index)) return;

    sounds.playFlip();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If 2 cards are flipped, check for match
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.pairKey === secondCard.pairKey) {
        // Matched!
        setTimeout(() => {
          sounds.playMatch();
          const newMatched = [...matchedPairs, firstCard.pairKey];
          setMatchedPairs(newMatched);
          setFlippedIndices([]);

          // Check if all pairs are found
          if (newMatched.length === stageConfig.totalPairs) {
            handleVictory();
          }
        }, 350);
      } else {
        // Mismatch - flip back after short pause
        setTimeout(() => {
          sounds.playMismatch();
          setFlippedIndices([]);
        }, 750);
      }
    }
  };

  // Victory celebration & auto-save to Firestore
  const handleVictory = async () => {
    setIsPlaying(false);
    const finalMs = startTime ? Date.now() - startTime : elapsedTime;
    setFinalTimeMs(finalMs);
    setIsCompleted(true);
    sounds.playVictory();
    fireFireworks();

    // Auto save score to Firestore
    if (nickname.trim()) {
      setSavingScore(true);
      try {
        await saveScore({
          nickname: nickname.trim(),
          cheerMessage: cheerMessage.trim() || '오늘도 반짝이는 하루!',
          stage: currentStageNum,
          timeMs: finalMs,
          moves: moves + 1
        });
        setSavedSuccess(true);
      } catch (err) {
        console.error('Failed to save score:', err);
      } finally {
        setSavingScore(false);
      }
    }
  };

  // Grid columns class based on stage
  const getGridColsClass = () => {
    // Stage 1: 3x2 (2 cols)
    if (stageConfig.gridCols === 2) return 'grid-cols-2 max-w-xs';
    // Stage 2: 2x4 (4 cols)
    if (stageConfig.gridCols === 4) {
      if (stageConfig.gridRows === 2) return 'grid-cols-4 max-w-lg';
      if (stageConfig.gridRows === 3) return 'grid-cols-3 sm:grid-cols-4 max-w-xl';
      if (stageConfig.gridRows === 4) return 'grid-cols-4 max-w-md sm:max-w-lg';
      if (stageConfig.gridRows === 5) return 'grid-cols-4 sm:grid-cols-5 max-w-lg sm:max-w-xl';
    }
    return 'grid-cols-3 sm:grid-cols-4 max-w-lg';
  };

  return (
    <div className="relative">
      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center animate-fadeIn">
          <div className="text-center">
            <div className="text-8xl font-black text-amber-300 drop-shadow-2xl animate-bounce">
              {countdown}
            </div>
            <p className="text-white text-lg font-bold mt-4">준비... 집중하세요!</p>
          </div>
        </div>
      )}

      {/* Stage Banner & Stats Bar */}
      <div className="bg-white rounded-3xl shadow-lg border border-amber-100 p-4 md:p-5 mb-4">
        {/* Top Info: Nickname & Cheer phrase */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-50 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-800">
                  {nickname || '익명 도전자'}
                </span>
              </div>
              {cheerMessage && (
                <p className="text-xs text-amber-700 font-medium italic mt-0.5">
                  &quot;{cheerMessage}&quot;
                </p>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 sm:self-center">
            <span>남은 짝: <strong className="text-amber-600 font-bold">{stageConfig.totalPairs - matchedPairs.length}쌍</strong></span>
            <span>•</span>
            <span>총 {stageConfig.gridRows * stageConfig.gridCols}칸 ({stageConfig.gridRows}×{stageConfig.gridCols})</span>
          </div>
        </div>

        {/* Live Timer & Moves */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">소요 시간</div>
              <div className="text-base font-black text-slate-800 font-mono">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>

          <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">뒤집은 횟수</div>
              <div className="text-base font-black text-slate-800 font-mono">
                {moves}회
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            {!isPlaying && !isCompleted ? (
              <button
                type="button"
                onClick={handleStartGame}
                className="w-full h-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-2xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>카운트다운 시작</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={initializeDeck}
                className="w-full h-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 섞기</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Grid Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100/80 p-3 sm:p-5 mb-4">
        {!isPlaying && !isCompleted && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-center text-xs text-amber-900 font-medium mb-3">
            💡 카드를 누르면 즉시 타이머가 돌아갑니다! 가장 빠른 손놀림을 보여주세요.
          </div>
        )}

        <div className={`grid gap-2 sm:gap-3 mx-auto ${getGridColsClass()}`}>
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index);
            const isMatched = matchedPairs.includes(card.pairKey);

            return (
              <Card
                key={card.id}
                card={card}
                isFlipped={isFlipped}
                isMatched={isMatched}
                onClick={() => handleCardClick(index)}
                disabled={isCompleted || (flippedIndices.length >= 2 && !isFlipped)}
                stageNum={currentStageNum}
              />
            );
          })}
        </div>
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 max-w-md w-full p-6 text-center transform animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-400/30">
              <Trophy className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
              🎉 {stageConfig.name} 클리어 성공!
            </span>

            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              대단해요, {nickname}!
            </h3>

            <p className="text-xs text-slate-500 mt-1 mb-4 italic">
              &quot;{cheerMessage || '나를 응원하는 따뜻한 마음'}&quot;
            </p>

            {/* Score summary */}
            <div className="grid grid-cols-2 gap-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5 mb-5">
              <div>
                <div className="text-[11px] text-slate-500 font-semibold">최종 기록</div>
                <div className="text-xl font-black text-amber-600 font-mono">
                  {formatTime(finalTimeMs)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-semibold">시도 횟수</div>
                <div className="text-xl font-black text-slate-800 font-mono">
                  {moves}회
                </div>
              </div>
            </div>

            {/* Database saved confirmation */}
            <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-3 mb-5 flex items-center justify-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>
                {savingScore
                  ? '데이터베이스에 랭킹을 등록하는 중...'
                  : savedSuccess
                  ? '기록이 명예의 전당(TOP 10)에 성공적으로 저장되었습니다!'
                  : '기록이 저장되었습니다!'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {currentStageNum < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    onChangeStage(currentStageNum + 1);
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
                >
                  <span>다음 {currentStageNum + 1}단계 도전하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3 bg-violet-50 text-violet-800 rounded-2xl border border-violet-200 text-xs font-bold mb-1">
                  👑 축하합니다! 5단계 전 코스를 모두 정복하셨습니다!
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={initializeDeck}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>현재 단계 다시하기</span>
                </button>

                <button
                  type="button"
                  onClick={onFinishGame}
                  className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>랭킹 & 방명록 보기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
