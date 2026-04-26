import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface StoryScreenProps {
  isNewGamePlus: boolean;
  startInvestigation: (val: boolean) => void;
  onPointerAction: (action: () => void) => React.PointerEventHandler;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({
  isNewGamePlus,
  startInvestigation,
  onPointerAction,
}) => {
  return (
    <motion.div
      key="story"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 w-full max-w-lg sm:max-w-2xl mx-auto h-full overflow-hidden"
    >
      <div className="bg-zinc-900/90 border border-zinc-800 p-3 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-[2rem] shadow-2xl space-y-3 sm:space-y-5 w-full max-h-full flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-full border border-blue-500/30">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-blue-500 font-black text-xs uppercase tracking-widest">Входящий приказ</div>
            <div className="text-white font-black text-sm sm:text-base lg:text-xl uppercase tracking-tight">ИИ-Помощник «ЩИТ»</div>
          </div>
        </div>

        <div className="h-px bg-zinc-800 w-full shrink-0" />

        <div className="space-y-2 sm:space-y-3 overflow-hidden flex-1 min-h-0">
          <p className="text-zinc-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest shrink-0">_ ИНИЦИАЛИЗАЦИЯ КУРСАНТА...</p>
          <div className="space-y-2 sm:space-y-3 overflow-hidden">
            {!isNewGamePlus ? (
              <>
                <p className="text-zinc-300 text-xs sm:text-sm lg:text-lg leading-relaxed font-medium">
                  Добро пожаловать в Управление «К». В 2026 году киберпреступность стала главной угрозой в Беларуси. Мошенники используют ИИ, дипфейки и поддельные сервисы.
                </p>
                <p className="text-zinc-300 text-xs sm:text-sm lg:text-lg leading-relaxed font-medium">
                  Твоя задача: фильтровать поток данных. У тебя есть 3 единицы «Цифрового иммунитета». Каждая ошибка — это утечка данных граждан.
                </p>
              </>
            ) : (
              <>
                <p className="text-zinc-300 text-xs sm:text-sm lg:text-lg leading-relaxed font-medium">
                  Поздравляем! Ты прошел основной курс подготовки. Теперь начинается продвинутый уровень — режим Эксперта.
                </p>
                <p className="text-zinc-300 text-xs sm:text-sm lg:text-lg leading-relaxed font-medium">
                  На этом уровне мошенники используют комбинированные атаки: несколько каналов одновременно, социальную инженерию и адаптивные методы. Будь готов к неожиданному!
                </p>
              </>
            )}
          </div>
          <p className="text-purple-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest shrink-0">_ ГОТОВ К ЗАДАНИЮ?</p>
        </div>

        <button
          onClick={() => {
            startInvestigation(true);
          }}
          onPointerDown={onPointerAction(() => startInvestigation(true))}
          className="w-full py-3 md:py-5 bg-white text-black font-black text-base md:text-xl uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-2xl shadow-xl active:scale-95 shrink-0 focus:ring-2 focus:ring-white min-h-[44px]"
          aria-label="Приступить к работе"
        >
          Приступить к работе
        </button>
      </div>
    </motion.div>
  );
};
