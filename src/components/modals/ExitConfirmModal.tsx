import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home } from 'lucide-react';

interface ExitConfirmModalProps {
  showExitConfirm: boolean;
  setShowExitConfirm: (val: boolean) => void;
  handleExitToHome: () => void;
}

export function ExitConfirmModal({ showExitConfirm, setShowExitConfirm, handleExitToHome }: ExitConfirmModalProps) {
  return (
    <AnimatePresence>
      {showExitConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border-2 border-red-500/50 p-8 rounded-[2.5rem] max-w-sm w-full max-h-[calc(100vh-40px)] overflow-y-auto text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <Home className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Выйти из игры?</h3>
              <p className="text-zinc-400 font-bold">Весь текущий прогресс смены будет потерян.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="py-4 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-700 transition-all"
              >
                Отмена
              </button>
              <button 
                onClick={handleExitToHome}
                className="py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-400 transition-all shadow-lg"
              >
                Выйти
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
