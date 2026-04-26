import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, HelpCircle, Shield, Zap, Search, Snowflake, Radio } from 'lucide-react';

interface FAQModalProps {
  showFAQ: boolean;
  setShowFAQ: (val: boolean) => void;
}

export function FAQModal({ showFAQ, setShowFAQ }: FAQModalProps) {
  return (
    <AnimatePresence>
      {showFAQ && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-2xl overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl max-h-[calc(100vh-60px)] space-y-4 md:space-y-6 shadow-2xl relative overflow-hidden flex flex-col"
          >
            <button
              onClick={() => setShowFAQ(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-all active:scale-90 z-10"
            >
              <XCircle className="w-4 h-4 md:w-6 md:h-6 text-zinc-400" />
            </button>

            <div className="flex items-center gap-2 md:gap-4 border-b border-zinc-800 pb-3 md:pb-4 shrink-0">
              <div className="p-2 md:p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <HelpCircle className="w-5 h-5 md:w-8 md:h-8 text-purple-500" />
              </div>
              <div>
                <h2 className="text-lg md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Инструктаж</h2>
                <p className="text-[6px] md:text-xs text-zinc-500 uppercase font-bold tracking-widest mt-0.5 md:mt-1">Как защитить цифровой суверенитет</p>
              </div>
            </div>

            <div className="grid gap-3 md:gap-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
              <section className="space-y-1 md:space-y-2 shrink-0">
                <h3 className="text-xs md:text-lg font-black text-purple-500 uppercase italic flex items-center gap-1.5">
                  <Shield className="w-3 h-3 md:w-4 md:h-4" />
                  Твоя цель
                </h3>
                <p className="text-zinc-300 text-[9px] md:text-sm leading-relaxed font-medium">
                  Анализируй входящие сообщения, звонки и сайты. Твоя задача — отличить реальные уведомления от фишинговых атак. Каждая ошибка ослабляет цифровой иммунитет страны.
                </p>
              </section>

              <section className="space-y-1.5 md:space-y-3 overflow-hidden flex flex-col">
                <h3 className="text-xs md:text-lg font-black text-blue-400 uppercase italic flex items-center gap-1.5 shrink-0">
                  <Zap className="w-3 h-3 md:w-4 md:h-4" />
                  Инструменты (Power-ups)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 overflow-hidden">
                  {[
                    {
                      icon: Search,
                      title: 'Анализ',
                      desc: 'Подсвечивает подозрительные детали.',
                      borderClass: 'hover:border-blue-500/30',
                      textClass: 'text-blue-400'
                    },
                    {
                      icon: Snowflake,
                      title: 'Заморозка',
                      desc: 'Останавливает время на 10 секунд.',
                      borderClass: 'hover:border-cyan-500/30',
                      textClass: 'text-cyan-400'
                    },
                    {
                      icon: Radio,
                      title: 'Связь',
                      desc: 'ИИ «ЩИТ» даст прямую подсказку.',
                      borderClass: 'hover:border-purple-500/30',
                      textClass: 'text-purple-400'
                    }
                  ].map((tool, i) => (
                    <div key={i} className={`flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-2 p-2 md:p-4 bg-zinc-950 rounded-xl border border-zinc-800 ${tool.borderClass} transition-all group overflow-hidden`}>
                      <tool.icon className={`w-4 h-4 md:w-6 md:h-6 ${tool.textClass} group-hover:scale-110 transition-transform shrink-0`} />
                      <div>
                        <h4 className={`font-black ${tool.textClass} text-[8px] md:text-xs uppercase`}>{tool.title}</h4>
                        <p className="text-zinc-500 text-[7px] md:text-[10px] mt-0.5 leading-tight line-clamp-1 md:line-clamp-2">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <button
              onClick={() => setShowFAQ(false)}
              className="w-full py-3 md:py-5 bg-purple-500 text-black font-black text-base md:text-xl uppercase tracking-widest hover:bg-purple-400 transition-all rounded-xl md:rounded-2xl shadow-[0_15px_30px_rgba(168,85,247,0.2)] shrink-0"
            >
              Все понятно!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
