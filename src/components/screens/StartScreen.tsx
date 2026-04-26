import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Volume2, VolumeX, ArrowRight, User, Search } from 'lucide-react';
import { GameState } from '../../types';

interface StartScreenProps {
  rank: { bg: string };
  isSoundEnabled: boolean;
  bgMusicRef: React.RefObject<HTMLAudioElement>;
  highScore: number;
  setUserInteracted: (val: boolean) => void;
  setIsSoundEnabled: (val: boolean) => void;
  playSound: (type: 'click') => void;
  handleStart: () => void;
  onPointerAction: (action: () => void) => React.PointerEventHandler;
  setGameState: (val: GameState) => void;
}

export function StartScreen({
  rank,
  isSoundEnabled,
  bgMusicRef,
  highScore,
  setUserInteracted,
  setIsSoundEnabled,
  playSound,
  handleStart,
  onPointerAction,
  setGameState
}: StartScreenProps) {
  return (
    <motion.div 
      key="start"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-6 p-2 md:p-4 lg:p-6 relative"
    >
      <div className="relative inline-block shrink-0 scale-[0.45] sm:scale-50 md:scale-75 lg:scale-90 transition-transform">
        <button
          onClick={() => {
            setUserInteracted(true); // Разблокируем аудио для мобильных
            setIsSoundEnabled(!isSoundEnabled);
            // Пытаемся сразу запустить музыку если включаем звук
            if (!isSoundEnabled && bgMusicRef.current) {
              bgMusicRef.current.play().catch(() => {});
            }
          }}
          className="absolute -top-12 -left-12 p-3 md:p-4 bg-zinc-900/80 hover:bg-zinc-800 rounded-full border border-white/10 text-zinc-400 transition-all z-20 shadow-xl backdrop-blur-md focus:ring-2 focus:ring-purple-500 min-h-[44px]"
          aria-label={isSoundEnabled ? "Выключить звук" : "Включить звук"}
        >
          {isSoundEnabled ? <Volume2 className="w-5 h-5 md:w-8 md:h-8" aria-label="Звук включен" /> : <VolumeX className="w-5 h-5 md:w-8 md:h-8" aria-label="Звук выключен" />}
        </button>
        <motion.div 
          animate={{ 
            boxShadow: ["0 0 20px rgba(168,85,247,0.2)", "0 0 60px rgba(168,85,247,0.4)", "0 0 20px rgba(168,85,247,0.2)"] 
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="p-4 md:p-8 lg:p-10 bg-purple-500/10 rounded-[2rem] md:rounded-[2.5rem] border border-purple-500/30 backdrop-blur-xl"
        >
          <Shield className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 text-purple-500" />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 bg-purple-500 p-1.5 md:p-2.5 lg:p-3 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)]"
        >
          <Zap className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6 text-black" />
        </motion.div>
      </div>
      
      <div className="space-y-2 md:space-y-3 text-center shrink-0 px-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase italic terminal-glow leading-[0.85] select-none break-words">
          КиберЩит<br/><span className="text-purple-500">Детектив</span>
        </h1>
        <div className="flex items-center justify-center gap-2 md:gap-4 text-zinc-500 font-mono text-[10px] sm:text-sm lg:text-base tracking-[0.3em] uppercase">
          <span className="w-1 h-1 md:w-2 md:h-2 bg-purple-500 rounded-full animate-pulse" />
          Система активна // РБ 2026
        </div>
        {highScore > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-500 font-mono text-sm md:text-base lg:text-lg font-bold mt-1 md:mt-2 bg-yellow-500/10 py-1 px-4 md:py-1.5 md:px-6 rounded-full border border-yellow-500/20 inline-block"
          >
            🏆 Рекорд: {highScore}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 md:gap-3 w-full max-w-xs md:max-w-lg lg:max-w-xl mx-auto shrink-0">
        <button 
          onClick={handleStart}
          onPointerDown={onPointerAction(handleStart)}
          className="group relative overflow-hidden px-6 py-4 md:py-5 lg:py-6 bg-purple-500 text-black font-black text-base md:text-2xl lg:text-3xl uppercase tracking-tighter hover:bg-purple-400 transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-4 rounded-xl md:rounded-[1.5rem] lg:rounded-2xl shadow-[0_20px_50px_rgba(168,85,247,0.3)] focus:ring-2 focus:ring-purple-500 min-h-[44px]"
          aria-label="Начать игру"
        >
          Начать службу
          <ArrowRight className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" aria-label="Стрелка вправо" />
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
        </button>
        <div className="flex justify-center gap-2 md:gap-3 lg:gap-4">
          <button 
            onClick={() => { playSound('click'); setGameState('PROFILE'); }}
            onPointerDown={onPointerAction(() => { playSound('click'); setGameState('PROFILE'); })}
            className="flex-1 px-3 py-3 md:py-4 lg:py-5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-sm md:text-lg lg:text-xl uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 md:gap-3 rounded-xl md:rounded-[1.5rem] lg:rounded-2xl focus:ring-2 focus:ring-purple-500 min-h-[44px]"
            aria-label="Открыть профиль"
          >
            <User className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" aria-label="Иконка пользователя" />
            Профиль
          </button>
          <button 
            onClick={() => { playSound('click'); setGameState('GLOSSARY'); }}
            onPointerDown={onPointerAction(() => { playSound('click'); setGameState('GLOSSARY'); })}
            className="flex-1 px-3 py-3 md:py-4 lg:py-5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-sm md:text-lg lg:text-xl uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 md:gap-3 rounded-xl md:rounded-[1.5rem] lg:rounded-2xl focus:ring-2 focus:ring-purple-500 min-h-[44px]"
            aria-label="Открыть словарь"
          >
            <Search className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" aria-label="Иконка поиска" />
            Словарь
          </button>
        </div>
      </div>
    </motion.div>
  );
}
