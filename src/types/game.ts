export interface StageConfig {
  stage: number;
  name: string;
  themeTitle: string;
  subtitle: string;
  gridRows: number;
  gridCols: number; // e.g. 2x3=6 (3 pairs), 2x4=8 (4 pairs), 3x4=12 (6 pairs), 4x4=16 (8 pairs), 4x5=20 (10 pairs)
  totalPairs: number;
  badge: string;
  bgGradient: string;
  cardColor: string;
  description: string;
}

export interface CardItem {
  id: string; // unique card instance id
  pairKey: string; // key matching the pair
  label: string;
  emoji: string;
  cheerPhrase: string;
  themeColor: string;
}

export interface ScoreRecord {
  id?: string;
  nickname: string;
  cheerMessage: string;
  stage: number;
  timeMs: number;
  moves: number;
  createdAt: number; // epoch ms
  formattedDate?: string;
}

export interface GuestbookEntry {
  id?: string;
  nickname: string;
  message: string;
  tag?: string; // e.g. '🎉 활력충전', '💛 힐링', '🔥 승부욕'
  createdAt: number;
  likes?: number;
}

export interface ParticipantRecord {
  id?: string;
  nickname: string;
  cheerMessage: string;
  lastPlayedAt: number;
  stagesCompleted: number[];
  totalGamesPlayed: number;
}

// 5 Stages with perfectly balanced mobile grids:
export const STAGE_CONFIGS: StageConfig[] = [
  {
    stage: 1,
    name: "스텝 1",
    themeTitle: "첫 만남의 설렘",
    subtitle: "가볍게 손을 풀며 서로에게 건네는 따뜻한 미소",
    gridRows: 2,
    gridCols: 4, // 8 cards, 4 pairs
    totalPairs: 4,
    badge: "🌱 새싹",
    bgGradient: "from-emerald-500 to-teal-600",
    cardColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
    description: "8장 매칭 (2×4)! 가벼운 마음으로 탭해보세요."
  },
  {
    stage: 2,
    name: "스텝 2",
    themeTitle: "뿜뿜 긍정 기운",
    subtitle: "오늘 하루 나를 춤추게 만드는 기분 좋은 말들",
    gridRows: 2,
    gridCols: 4, // 8 cards, 4 pairs
    totalPairs: 4,
    badge: "☀️ 활력",
    bgGradient: "from-amber-500 to-orange-500",
    cardColor: "bg-amber-50 border-amber-200 text-amber-800",
    description: "8장의 카드 속 긍정의 에너지를 채워보세요!"
  },
  {
    stage: 3,
    name: "스텝 3",
    themeTitle: "창의력과 공방의 매력",
    subtitle: "손 끝에서 피어나는 미니유공방의 마법 같은 순간",
    gridRows: 3,
    gridCols: 4, // 12 cards, 6 pairs
    totalPairs: 6,
    badge: "🎨 영감",
    bgGradient: "from-sky-500 to-indigo-600",
    cardColor: "bg-sky-50 border-sky-200 text-sky-800",
    description: "12장 매칭! 미니유공방의 창작 감성을 찾아보세요."
  },
  {
    stage: 4,
    name: "스텝 4",
    themeTitle: "모바일 황금비율 16칸",
    subtitle: "짜릿한 기억력 대결! 교육생들 사이 최고 속도에 도전",
    gridRows: 4,
    gridCols: 4, // 16 cards, 8 pairs
    totalPairs: 8,
    badge: "⚡ 몰입",
    bgGradient: "from-rose-500 to-pink-600",
    cardColor: "bg-rose-50 border-rose-200 text-rose-800",
    description: "스마트폰 화면에 딱 알맞은 16장 (4×4) 정통 카드 뒤집기!"
  },
  {
    stage: 5,
    name: "스텝 5",
    themeTitle: "궁극의 스피드 챌린지",
    subtitle: "모든 미니유공방 교육생 중 전설의 스피드 스타는 누구?",
    gridRows: 5,
    gridCols: 4, // 20 cards, 10 pairs
    totalPairs: 10,
    badge: "👑 챔피언",
    bgGradient: "from-violet-600 to-purple-800",
    cardColor: "bg-purple-50 border-purple-200 text-purple-800",
    description: "20장의 카드! 가장 정교하고 빠른 손놀림을 보여주세요!"
  }
];

// Rich set of positive words, encouraging Korean phrases and vibrant visuals for workshop participants
export const POSITIVE_CARD_DECK = [
  {
    key: "cheer_01",
    label: "당신은 빛나요",
    emoji: "✨",
    cheerPhrase: "오늘 가장 빛나는 별!",
    bgTone: "bg-amber-100 border-amber-300 text-amber-900"
  },
  {
    key: "cheer_02",
    label: "해낼 수 있어",
    emoji: "🚀",
    cheerPhrase: "자신을 믿는 순간 기적이!",
    bgTone: "bg-blue-100 border-blue-300 text-blue-900"
  },
  {
    key: "cheer_03",
    label: "미소가 번져요",
    emoji: "🥰",
    cheerPhrase: "당신의 웃음이 주변을 환하게",
    bgTone: "bg-pink-100 border-pink-300 text-pink-900"
  },
  {
    key: "cheer_04",
    label: "매일 성장 중",
    emoji: "🌱",
    cheerPhrase: "한 걸음씩 단단해지는 나",
    bgTone: "bg-emerald-100 border-emerald-300 text-emerald-900"
  },
  {
    key: "cheer_05",
    label: "마음의 여유",
    emoji: "☕",
    cheerPhrase: "따스한 커피 한잔의 평화",
    bgTone: "bg-stone-100 border-stone-300 text-stone-900"
  },
  {
    key: "cheer_06",
    label: "반짝이는 감각",
    emoji: "💡",
    cheerPhrase: "번뜩이는 아이디어의 원천!",
    bgTone: "bg-yellow-100 border-yellow-300 text-yellow-900"
  },
  {
    key: "cheer_07",
    label: "행운의 네잎클로버",
    emoji: "🍀",
    cheerPhrase: "오늘 당신에게 큰 행운이!",
    bgTone: "bg-green-100 border-green-300 text-green-900"
  },
  {
    key: "cheer_08",
    label: "따뜻한 공방",
    emoji: "🎨",
    cheerPhrase: "손끝에 깃든 정성과 온기",
    bgTone: "bg-orange-100 border-orange-300 text-orange-900"
  },
  {
    key: "cheer_09",
    label: "소중한 나",
    emoji: "💖",
    cheerPhrase: "세상에 단 하나뿐인 특별함",
    bgTone: "bg-rose-100 border-rose-300 text-rose-900"
  },
  {
    key: "cheer_10",
    label: "꿈을 향해",
    emoji: "🌈",
    cheerPhrase: "비 온 뒤 반드시 무지개가 떠요",
    bgTone: "bg-violet-100 border-violet-300 text-violet-900"
  },
  {
    key: "cheer_11",
    label: "함께라서 든든해",
    emoji: "🤝",
    cheerPhrase: "서로를 응원하는 소중한 동료",
    bgTone: "bg-teal-100 border-teal-300 text-teal-900"
  },
  {
    key: "cheer_12",
    label: "최고의 오늘",
    emoji: "🏆",
    cheerPhrase: "오늘 하루 멋지게 완성해요!",
    bgTone: "bg-amber-100 border-amber-400 text-amber-950"
  }
];

// Helper sound effects using Web Audio API so no external assets are required
class SoundController {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlip() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio might be muted
    }
  }

  playMatch() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.18);
      });
    } catch {}
  }

  playMismatch() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  playVictory() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.45);
      });
    } catch {}
  }
}

export const sounds = new SoundController();
