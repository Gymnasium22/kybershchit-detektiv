import React from 'react';
import { motion } from 'motion/react';
import { Home, ShieldAlert, Scissors } from 'lucide-react';

interface MiniGameData {
  type: 'PASSWORD' | 'CABLE';
  target: string;
  progress: string | number;
}

interface MinigameScreenProps {
  miniGameData: MiniGameData;
  setShowExitConfirm: (val: boolean) => void;
  playSound: (type: 'click') => void;
  handleMiniGameSuccess: () => void;
  handleMiniGameFailure: () => void;
  setMiniGameData: (val: MiniGameData) => void;
}

export function MinigameScreen({
  miniGameData,
  setShowExitConfirm,
  playSound,
  handleMiniGameSuccess,
  handleMiniGameFailure,
  setMiniGameData
}: MinigameScreenProps) {
  return (
    <motion.div
      key="minigame"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900/90 border-2 border-red-500/50 p-1.5 md:p-6 rounded-[1.2rem] md:rounded-[2.5rem] backdrop-blur-xl space-y-1 md:space-y-4 shadow-[0_0_60px_rgba(239,68,68,0.3)] w-[95%] max-w-xl mx-auto max-h-[calc(100vh-80px)] overflow-y-auto flex flex-col relative"
    >
      <button 
        onClick={() => setShowExitConfirm(true)}
        className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg z-20 hover:bg-red-600 transition-all"
        title="Выйти в меню"
      >
        <Home className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      <div className="text-center space-y-0.5 md:space-y-2">
        <div className="inline-flex p-1 md:p-3 bg-red-500/20 rounded-full">
          <ShieldAlert className="w-4 h-4 md:w-10 md:h-10 text-red-500" />
        </div>
        <h2 className="text-base md:text-4xl font-black text-white uppercase tracking-tighter">
          {miniGameData.type === 'PASSWORD' ? 'ВЗЛОМ СИСТЕМЫ!' : 'УТЕЧКА ДАННЫХ!'}
        </h2>
        <p className="text-zinc-400 text-xs md:text-base lg:text-lg font-mono bg-red-500/10 py-0.5 px-1.5 md:py-2 md:px-4 rounded-lg border border-red-500/20">
          {miniGameData.type === 'PASSWORD' ? 'ОШИБКА! ВВЕДИТЕ КОД ВОССТАНОВЛЕНИЯ' : 'ОШИБКА! ОБОРВИТЕ СОЕДИНЕНИЕ (3 КЛИКА)'}
        </p>
      </div>

      {miniGameData.type === 'PASSWORD' ? (
        <div className="space-y-2 md:space-y-6">
          <div className="text-center space-y-0.5 md:space-y-2 bg-zinc-950 p-1.5 md:p-4 rounded-xl md:rounded-2xl border border-zinc-800">
            <div className="text-[6px] md:text-sm text-purple-500/70 uppercase font-black tracking-widest animate-pulse">ЗАПОМНИТЕ ЭТОТ КОД:</div>
            <div className="text-xl md:text-6xl font-black text-purple-500 font-mono tracking-[0.4em] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              {miniGameData.target}
            </div>
          </div>

          <div className="flex justify-center gap-1 md:gap-3">
            {miniGameData.target.split('').map((_, i) => (
              <div key={i} className={`w-6 h-9 md:w-16 md:h-20 flex items-center justify-center text-sm md:text-4xl font-black rounded-lg md:rounded-xl border-2 transition-all ${String(miniGameData.progress).length > i ? 'bg-purple-500/20 border-purple-500 text-purple-500' : 'bg-zinc-950 border-zinc-800 text-zinc-700'}`}>
                {String(miniGameData.progress)[i] || '?'}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1 md:gap-3">
            {'ABCDEF123456'.split('').map(char => (
              <button
                key={char}
                onClick={() => {
                  playSound('click');
                  const newProgress = String(miniGameData.progress) + char;
                  if (newProgress === miniGameData.target) {
                    handleMiniGameSuccess();
                  } else if (newProgress.length >= 4) {
                    handleMiniGameFailure();
                  } else {
                    setMiniGameData({ ...miniGameData, progress: newProgress });
                  }
                }}
                className="py-1 md:py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg md:rounded-xl border border-zinc-700 active:scale-95 text-[10px] md:text-xl"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 md:gap-10 py-2 md:py-12">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-20 h-20 md:w-56 md:h-56 border-4 border-dashed border-red-500 rounded-full"
            />
            <button
              onClick={() => {
                playSound('click');
                const newProgress = (miniGameData.progress as number) + 1;
                if (newProgress >= 3) {
                  handleMiniGameSuccess();
                } else {
                  setMiniGameData({ ...miniGameData, progress: newProgress });
                }
              }}
              className="absolute inset-0 m-auto w-12 h-12 md:w-32 md:h-32 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-90 transition-transform"
            >
              <Scissors className="w-6 h-6 md:w-16 md:h-16 text-black" />
            </button>
          </div>
          <div className="flex gap-1.5 md:gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-2 h-2 md:w-6 md:h-6 rounded-full ${i < (miniGameData.progress as number) ? 'bg-purple-500' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <button 
          onClick={handleMiniGameFailure}
          className="text-[10px] md:text-base text-zinc-600 uppercase font-bold tracking-widest hover:text-zinc-400"
        >
          [ Сдаться ]
        </button>
      </div>
    </motion.div>
  );
}
