import React from 'react';
import { motion } from 'motion/react';
import { User, Trophy, Award } from 'lucide-react';
import { GameState } from '../../types';

interface Rank {
  title: string;
  color: string;
  bg: string;
  border: string;
}

interface TotalStats {
  scenarios: number;
  score: number;
  rank: string;
}

interface Achievement {
  icon: React.ReactNode;
  text: string;
}

interface ProfileScreenProps {
  rank: Rank;
  score: number;
  totalStats: TotalStats;
  getAchievements: () => Achievement[];
  playSound: (type: 'click') => void;
  setIsNewGamePlus: (val: boolean) => void;
  setGameState: (state: GameState) => void;
  setShowResetConfirm: (val: boolean) => void;
}

export function ProfileScreen({
  rank,
  score,
  totalStats,
  getAchievements,
  playSound,
  setIsNewGamePlus,
  setGameState,
  setShowResetConfirm
}: ProfileScreenProps) {
  return (
    <motion.div 
      key="profile"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center w-full min-h-0 p-4 overflow-hidden h-full"
    >
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl space-y-4 md:space-y-6 shadow-2xl w-full max-w-2xl max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 md:gap-8 border-b border-zinc-800 pb-4 md:pb-6">
          <div className="relative shrink-0">
            <div className={`w-14 h-14 md:w-24 md:h-24 rounded-2xl border-2 flex items-center justify-center ${rank.bg}`}>
              <User className={`w-7 h-7 md:w-12 md:h-12 ${rank.color}`} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-500 p-1 md:p-1.5 rounded-lg shadow-lg">
              <Trophy className="w-3 h-3 md:w-6 md:h-6 text-black" />
            </div>
          </div>
          <div className="space-y-0.5 md:space-y-1 min-w-0">
            <h3 className="text-zinc-500 font-mono text-[6px] md:text-xs uppercase tracking-widest truncate">Личное дело №2026-РБ</h3>
            <h2 className={`text-lg md:text-4xl font-black uppercase tracking-tighter truncate ${rank.color}`}>{rank.title}</h2>
              <div className="flex items-center gap-2 md:gap-3">
              <div className="h-3 md:h-5 w-24 md:w-48 bg-zinc-800 rounded-full overflow-hidden border border-white/10 relative">
                <div className={`h-full ${rank.color.replace('text-', 'bg-')} shadow-[0_0_15px_rgba(255,255,255,0.4)] relative`} style={{ width: `${Math.min(100, ((totalStats.score + score) % 500) / 5)}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                </div>
              </div>
              <span className="text-[6px] md:text-xs text-zinc-500 font-mono">ОПЫТ</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 p-3 md:p-4 rounded-xl md:rounded-2xl border border-zinc-800 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <h4 className="text-[8px] md:text-xs font-black text-zinc-500 uppercase tracking-widest">Развитие Академии</h4>
            <span className="text-[8px] md:text-xs font-mono text-purple-500 uppercase">УРОВЕНЬ {Math.floor(totalStats.scenarios / 10) + 1}</span>
          </div>
          <div className="flex justify-center items-end gap-1 md:gap-1.5 h-12 md:h-20">
            {[...Array(5)].map((_, i) => {
              const isActive = i <= Math.floor(totalStats.scenarios / 10);
              return (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: isActive ? `${(i + 1) * 20}%` : '10%' }}
                  className={`w-6 md:w-10 rounded-t-lg transition-colors duration-500 ${isActive ? 'bg-purple-500/40 border-t border-purple-500' : 'bg-zinc-900 border-t border-zinc-800'}`}
                />
              );
            })}
          </div>
          <p className="text-[7px] md:text-xs text-zinc-500 text-center mt-1 md:mt-2 uppercase font-bold tracking-tighter">
            {totalStats.scenarios < 10 ? 'Строительство фундамента...' : 
             totalStats.scenarios < 20 ? 'Установка серверов...' :
             totalStats.scenarios < 30 ? 'Формирование спецотряда...' :
             'Академия полностью укомплектована!'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div className="bg-zinc-950 p-2 md:p-3 rounded-xl border border-zinc-800 text-center">
            <div className="text-[7px] md:text-xs text-zinc-500 uppercase font-bold">Очки</div>
            <div className="text-base md:text-3xl font-black text-white font-mono">{totalStats.score}</div>
          </div>
          <div className="bg-zinc-950 p-2 md:p-3 rounded-xl border border-zinc-800 text-center">
            <div className="text-[7px] md:text-xs text-zinc-500 uppercase font-bold">Дела</div>
            <div className="text-base md:text-3xl font-black text-white font-mono">{totalStats.scenarios}</div>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <h4 className="text-[8px] md:text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
            <Award className="w-3 h-3 md:w-6 md:h-6" />
            Трофеи
          </h4>
          <div className="grid grid-cols-3 gap-1.5 md:gap-2">
            {getAchievements().map((ach, i) => (
              <div key={i} className="flex flex-col items-center gap-1 md:gap-1.5 p-1.5 md:p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="p-1 md:p-1.5 bg-yellow-500/10 rounded-full text-yellow-500">
                  {ach.icon}
                </div>
                <span className="text-[7px] md:text-[10px] text-zinc-400 text-center font-bold uppercase leading-tight">{ach.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-3 pt-1 md:pt-2">
          <button 
            onClick={() => { playSound('click'); setIsNewGamePlus(false); setGameState('START'); }}
            className="w-full py-3 md:py-4 bg-zinc-800 text-white font-black uppercase tracking-widest hover:bg-zinc-700 transition-all rounded-xl text-xs md:text-lg"
          >
            Вернуться в штаб
          </button>
          <button 
            onClick={() => { playSound('click'); setShowResetConfirm(true); }}
            className="w-full py-1.5 text-red-500/50 hover:text-red-500 font-mono text-[8px] md:text-sm uppercase tracking-widest transition-all"
          >
            Сбросить прогресс
          </button>
        </div>
      </div>
    </motion.div>
  );
}
