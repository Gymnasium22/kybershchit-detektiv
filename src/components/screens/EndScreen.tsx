import React from 'react';
import { motion } from 'motion/react';
import { Award, FileText, Gift } from 'lucide-react';
import { GameState } from '../../types';

interface EndScreenProps {
  rank: { title: string; color: string; border?: string };
  health: number;
  isNewGamePlus: boolean;
  score: number;
  currentLevel: number;
  accuracy: string | number;
  evidence: string[];
  completedAllLevels: boolean;
  isPrizeEligible: boolean;
  setShowPrizeConfirm: (val: boolean) => void;
  playSound: (type: 'click') => void;
  setIsNewGamePlus: (val: boolean) => void;
  setCurrentLevel: (val: number) => void;
  setCombo: (val: number) => void;
  setStats: (val: { correct: number; total: number }) => void;
  setEvidence: (val: string[]) => void;
  setHealth: (val: number) => void;
  setTimeLeft: (val: number) => void;
  setScore: (val: number) => void;
  setGameState: (val: GameState) => void;
}

export function EndScreen({
  rank,
  health,
  isNewGamePlus,
  score,
  currentLevel,
  accuracy,
  evidence,
  completedAllLevels,
  isPrizeEligible,
  setShowPrizeConfirm,
  playSound,
  setIsNewGamePlus,
  setCurrentLevel,
  setCombo,
  setStats,
  setEvidence,
  setHealth,
  setTimeLeft,
  setScore,
  setGameState
}: EndScreenProps) {
  return (
    <motion.div 
      key="end"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center space-y-1 text-center w-full p-2 md:p-4 min-h-0 py-4"
    >
      <div className="bg-zinc-900/90 border border-zinc-800 p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.2rem] backdrop-blur-2xl space-y-2 md:space-y-4 shadow-2xl w-full max-w-xl flex flex-col items-center">
        
        {/* Rank Badge Pill */}
        <div className="w-full max-w-md bg-zinc-950 border-2 border-white/10 rounded-xl md:rounded-full p-0.5 md:p-1.5 flex items-center gap-1.5 md:gap-3 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden group shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />
          <div className={`shrink-0 w-6 h-6 md:w-16 md:h-16 rounded-full border-2 ${rank.border || 'border-purple-500'} bg-zinc-900 flex items-center justify-center shadow-xl z-10 relative`}>
            <Award className={`w-2.5 h-2.5 md:w-8 md:h-8 ${rank.color}`} />
            <div className="absolute inset-0 rounded-full bg-current opacity-5 animate-pulse" />
          </div>
          <div className="flex-1 text-left z-10 py-0.5">
            <div className="text-[5px] md:text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-0.5">Ваш итоговый статус</div>
            <div className={`text-[9px] md:text-xl font-black uppercase tracking-tight leading-tight ${rank.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>{rank.title}</div>
          </div>
        </div>

        <div className="space-y-0.5 md:space-y-1.5 shrink-0">
          <h2 className="text-base md:text-4xl font-black uppercase italic terminal-glow leading-none tracking-tighter text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            {health <= 0 ? 'Связь Потеряна' : isNewGamePlus ? 'Эксперт Кибербезопасности' : 'Миссия Выполнена'}
          </h2>
          <div className="flex justify-center gap-4 md:gap-10 pt-0.5 md:pt-1">
            <div className="text-center">
              <div className="text-base md:text-3xl font-black text-white">{score}</div>
              <div className="text-[6px] md:text-[10px] uppercase text-zinc-500 font-mono font-bold tracking-[0.15em]">Счет</div>
            </div>
            <div className="text-center">
              <div className="text-base md:text-3xl font-black text-white">{currentLevel + (health > 0 ? 1 : 0)}{isNewGamePlus && health > 0 ? '+' : ''}</div>
              <div className="text-[6px] md:text-[10px] uppercase text-zinc-500 font-mono font-bold tracking-[0.15em]">Уровни</div>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-950/50 border border-zinc-800/50 p-2 md:p-3 rounded-[1rem] md:rounded-[1.5rem] max-w-xl w-full text-left space-y-1 md:space-y-2 shadow-inner">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-[8px] md:text-base uppercase text-purple-500 italic tracking-wider">Рапорт Управления «К»</h3>
            <div className="text-[5px] md:text-[9px] text-zinc-600 font-mono opacity-50">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
          </div>
          
          <p className="text-zinc-400 text-[8px] md:text-sm leading-relaxed font-medium">
            {health <= 0
              ? "Цифровой иммунитет сломлен. Мошенники оказались хитрее. Изучите ошибки и попробуйте снова."
              : isNewGamePlus
              ? "Вы прошли продвинутый уровень подготовки! Навыки кибердетектива достигли профессионального уровня. Граждане Беларуси под надежной защитой."
              : "Вы продемонстрировали выдающиеся навыки кибердетектива. Граждане Беларуси защищены."}
          </p>

          <div className="grid grid-cols-2 gap-2 py-1 md:py-2 border-y border-zinc-800/30">
            <div className="space-y-0.5">
              <div className="text-[5px] md:text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Точность</div>
              <div className="text-[9px] md:text-lg font-black text-white font-mono">{accuracy}%</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[5px] md:text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Статус</div>
              <div className={`text-[9px] md:text-lg font-black font-mono ${health > 0 ? 'text-purple-500' : 'text-red-500'}`}>
                {health > 0 ? 'УСПЕХ' : 'ПРОВАЛ'}
              </div>
            </div>
          </div>

          {evidence.length > 0 && (
            <div className="space-y-0.5">
              <p className="text-[5px] md:text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Собранные улики</p>
              <div className="flex flex-wrap gap-1">
                {evidence.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-1 px-1 py-0.5 bg-zinc-900 rounded-full border border-zinc-800 text-[5px] md:text-[10px] text-zinc-300 font-bold shadow-sm">
                    <FileText className="w-1.5 h-1.5 text-blue-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {completedAllLevels && (
          <div className={`w-full max-w-xl p-2 md:p-5 rounded-[1rem] md:rounded-[2rem] border relative overflow-hidden ${
            isPrizeEligible
              ? 'bg-gradient-to-r from-purple-500/15 via-cyan-500/10 to-purple-500/15 border-purple-400/50 shadow-[0_0_50px_rgba(168,85,247,0.25)]'
              : 'bg-zinc-950/50 border-zinc-800/60'
          }`}>
            {isPrizeEligible && (
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] animate-[border-flow_4s_linear_infinite]" />
            )}
            <div className="relative z-10 flex items-center justify-between gap-3 md:gap-5">
              <div className="min-w-0">
                <div className={`text-[7px] md:text-xs uppercase font-black tracking-[0.2em] ${isPrizeEligible ? 'text-cyan-300' : 'text-zinc-500'}`}>
                  Награда за прохождение
                </div>
                <h3 className={`text-[10px] md:text-lg font-black uppercase tracking-tight ${isPrizeEligible ? 'text-white' : 'text-zinc-300'}`}>
                  {isPrizeEligible ? 'Приз разблокирован: стикерпак в Telegram' : 'Приз пока недоступен'}
                </h3>
                <p className="text-[7px] md:text-sm text-zinc-400 mt-0.5">
                  {isPrizeEligible
                    ? 'Вы успешно прошли полный курс. Нажмите кнопку, чтобы получить стикерпак.'
                    : `Условия: точность от 85% и счёт от 1800. Сейчас: ${accuracy}% и ${score}.`}
                </p>
              </div>
              <button
                onClick={() => setShowPrizeConfirm(true)}
                disabled={!isPrizeEligible}
                className={`shrink-0 px-2 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black uppercase tracking-wider text-[7px] md:text-xs transition-all min-h-[40px] md:min-h-[44px] ${
                  isPrizeEligible
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.45)] hover:brightness-110 active:scale-95'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                }`}
                aria-label="Получить приз"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Gift className="w-3 h-3 md:w-4 md:h-4" />
                  Получить приз
                </span>
              </button>
            </div>
          </div>
        )}

          <div className="grid grid-cols-1 gap-1 w-full max-w-xs md:max-w-md shrink-0">
            {!isNewGamePlus && health > 0 ? (
              <>
                <button
                  onClick={() => {
                    playSound('click');
                    setIsNewGamePlus(true);
                    setCurrentLevel(0);
                    setCombo(1);
                    setStats({ correct: 0, total: 0 });
                    setEvidence([]);
                    setHealth(3);
                    setTimeLeft(120);
                    setScore(0);
                    setGameState('STORY');
                  }}
                  className="w-full py-2 md:py-3 bg-purple-500 text-black font-black uppercase tracking-[0.15em] hover:bg-purple-400 transition-all rounded-xl md:rounded-2xl text-[8px] md:text-sm shadow-[0_10px_20px_rgba(168,85,247,0.3)] active:scale-95"
                >
                  Уровень 2: Режим Эксперта
                </button>
                <button
                  onClick={() => { setIsNewGamePlus(false); setGameState('START'); }}
                  className="w-full py-2 md:py-3 bg-zinc-900 text-white font-black uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all rounded-xl md:rounded-2xl border border-zinc-800 text-[8px] md:text-sm active:scale-95"
                >
                  В главное меню
                </button>
              </>
            ) : health <= 0 ? (
              <>
                <button
                  onClick={() => {
                    setIsNewGamePlus(false);
                    setCurrentLevel(0);
                    setCombo(1);
                    setStats({ correct: 0, total: 0 });
                    setEvidence([]);
                    setHealth(3);
                    setTimeLeft(120);
                    setScore(0);
                    setGameState('START');
                  }}
                  className="w-full py-2 md:py-3 bg-purple-500 text-black font-black uppercase tracking-[0.15em] hover:bg-purple-400 transition-all rounded-xl md:rounded-2xl text-[8px] md:text-sm shadow-[0_10px_20px_rgba(168,85,247,0.3)] active:scale-95"
                >
                  Попробовать снова
                </button>
                <button
                  onClick={() => { setIsNewGamePlus(false); setGameState('START'); }}
                  className="w-full py-2 md:py-3 bg-zinc-900 text-white font-black uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all rounded-xl md:rounded-2xl border border-zinc-800 text-[8px] md:text-sm active:scale-95"
                >
                  В главное меню
                </button>
              </>
            ) : (
              <button
                onClick={() => { setIsNewGamePlus(false); setGameState('START'); }}
                className="w-full py-2 md:py-3 bg-purple-500 text-black font-black uppercase tracking-[0.15em] hover:bg-purple-400 transition-all rounded-xl md:rounded-2xl text-[8px] md:text-sm shadow-[0_10px_20px_rgba(168,85,247,0.3)] active:scale-95"
              >
                В главное меню
              </button>
            )}
        </div>
      </div>
    </motion.div>
  );
}
