import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

interface LoadingScreenProps {
  currentLevel: number;
}

export function LoadingScreen({ currentLevel }: LoadingScreenProps) {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center space-y-6"
    >
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-zinc-800 border-t-purple-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-black text-white uppercase tracking-tighter animate-pulse">
          Обработка данных...
        </h3>
        <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-[0.3em]">
          Сектор {currentLevel + 1} // Анализ угроз
        </p>
      </div>
      <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5 }}
          className="h-full bg-purple-500"
        />
      </div>
    </motion.div>
  );
}
