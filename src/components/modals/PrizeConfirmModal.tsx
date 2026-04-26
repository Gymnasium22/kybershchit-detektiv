import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift } from 'lucide-react';

interface PrizeConfirmModalProps {
  showPrizeConfirm: boolean;
  setShowPrizeConfirm: (val: boolean) => void;
  handleClaimPrize: () => void;
}

export function PrizeConfirmModal({ showPrizeConfirm, setShowPrizeConfirm, handleClaimPrize }: PrizeConfirmModalProps) {
  return (
    <AnimatePresence>
      {showPrizeConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[320] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-cyan-400/40 p-6 md:p-8 rounded-[2rem] max-w-md w-full text-center space-y-5 shadow-[0_0_60px_rgba(34,211,238,0.2)]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-cyan-400/30">
              <Gift className="w-8 h-8 text-cyan-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Получить стикерпак</h3>
              <p className="text-zinc-400 text-sm md:text-base">
                Сейчас откроется Telegram. Подтвердите добавление стикерпака в приложении.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPrizeConfirm(false)}
                className="py-3 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-xl hover:bg-zinc-700 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleClaimPrize}
                className="py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                Открыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
