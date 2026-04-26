import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  showResetConfirm: boolean;
  resetProgress: () => void;
  setShowResetConfirm: (val: boolean) => void;
}

export function ResetConfirmModal({ showResetConfirm, resetProgress, setShowResetConfirm }: ResetConfirmModalProps) {
  return (
    <AnimatePresence>
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-zinc-900 border border-red-500/30 p-8 md:p-12 rounded-[2.5rem] w-full max-w-md max-h-[calc(100vh-40px)] overflow-y-auto space-y-8 text-center"
          >
            <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Полный сброс?</h2>
              <p className="text-zinc-400 font-bold">Вы уверены, что хотите обнулить игру? Все ваши достижения, рекорды и звания будут безвозвратно удалены.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={resetProgress}
                className="w-full py-4 bg-red-500 text-black font-black uppercase tracking-widest hover:bg-red-400 transition-all rounded-xl"
              >
                Да, удалить всё
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-4 bg-zinc-800 text-white font-black uppercase tracking-widest hover:bg-zinc-700 transition-all rounded-xl"
              >
                Отмена
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
