import React from 'react';
import { motion } from 'motion/react';
import { Home, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Scenario } from '../../types';

interface FeedbackScreenProps {
  lastResult: { correct: boolean; message: string } | null;
  scenario: Scenario;
  setShowExitConfirm: (val: boolean) => void;
  nextLevel: () => void;
}

export function FeedbackScreen({ lastResult, scenario, setShowExitConfirm, nextLevel }: FeedbackScreenProps) {
  return (
    <motion.div 
      key="feedback"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center space-y-3 sm:space-y-5 lg:space-y-8 text-center p-2 sm:p-4 overflow-y-auto custom-scrollbar h-full w-full max-w-lg sm:max-w-2xl lg:max-w-5xl mx-auto relative"
    >
      <button 
        onClick={() => setShowExitConfirm(true)}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-red-500 text-white rounded-xl sm:rounded-2xl shadow-xl z-20 hover:bg-red-600 transition-all"
        title="Выйти в меню"
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-8 lg:h-8" />
      </button>
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center shrink-0"
      >
        <div className={`p-3 sm:p-6 lg:p-10 rounded-full border-3 sm:border-4 ${lastResult?.correct ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-pulse-glow' : 'bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)] animate-danger-pulse'}`}>
          {lastResult?.correct ? <CheckCircle2 className="w-8 h-8 sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 text-purple-500" /> : <ShieldAlert className="w-8 h-8 sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 text-red-500" />}
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2 sm:space-y-4 max-w-xl sm:max-w-2xl lg:max-w-4xl shrink-0"
      >
        <h2 className={`text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase italic tracking-tighter leading-none ${lastResult?.correct ? 'text-purple-500 animate-pulse' : 'text-red-500 animate-text-glitch'}`}>
          {lastResult?.message}
        </h2>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/60 p-3 sm:p-5 lg:p-8 rounded-xl sm:rounded-2xl border border-zinc-800/50 backdrop-blur-xl shadow-2xl"
        >
          <p className="text-xs sm:text-sm lg:text-xl xl:text-2xl leading-relaxed font-medium">
            {scenario.explanation}
          </p>
        </motion.div>
      </motion.div>
      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={nextLevel}
        className="group inline-flex items-center gap-3 md:gap-6 px-8 md:px-12 py-3 md:py-6 bg-zinc-100 text-black font-black text-base md:text-2xl lg:text-3xl uppercase tracking-widest hover:bg-white transition-all active:scale-95 rounded-xl md:rounded-2xl shadow-2xl shrink-0"
      >
        Продолжить
        <ArrowRight className="w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:translate-x-2 transition-transform" />
      </motion.button>
    </motion.div>
  );
}
