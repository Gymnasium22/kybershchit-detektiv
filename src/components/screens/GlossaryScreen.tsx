import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { GameState } from '../../types';

interface GlossaryScreenProps {
  playSound: (type: 'click') => void;
  setIsNewGamePlus: (val: boolean) => void;
  setGameState: (state: GameState) => void;
}

const GLOSSARY_DATA = [
  { term: "Фишинг", def: "Поддельные сайты или письма, крадущие пароли." },
  { term: "Смишинг", def: "Фишинг через СМС-сообщения." },
  { term: "Вишинг", def: "Мошенничество через телефонные звонки или голос." },
  { term: "Квишинг", def: "Фишинг через поддельные QR-коды." },
  { term: "Дроп", def: "Человек, которого используют для вывода краденых денег." },
  { term: "2FA", def: "Двухфакторная аутентификация (пароль + код из СМС)." },
];

export function GlossaryScreen({ playSound, setIsNewGamePlus, setGameState }: GlossaryScreenProps) {
  return (
    <motion.div 
      key="glossary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center space-y-4 w-full h-full p-4 overflow-hidden"
    >
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl backdrop-blur-xl space-y-3 shadow-2xl w-full max-w-2xl max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg md:text-3xl font-black uppercase tracking-tighter text-white">Кибер-Словарь</h2>
            <p className="text-[8px] md:text-xs text-zinc-500 uppercase font-bold tracking-widest">База знаний Академии</p>
          </div>
        </div>

        <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          {GLOSSARY_DATA.map((item, i) => (
            <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 hover:border-blue-500/30 transition-colors">
              <h4 className="text-blue-400 font-black uppercase text-[10px] md:text-sm mb-0.5">{item.term}</h4>
              <p className="text-zinc-400 text-[9px] md:text-base leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={() => { playSound('click'); setIsNewGamePlus(false); setGameState('START'); }}
          className="w-full py-3 bg-zinc-800 text-white font-black uppercase tracking-widest hover:bg-zinc-700 transition-all rounded-xl text-[10px] md:text-base"
        >
          Вернуться в штаб
        </button>
      </div>
    </motion.div>
  );
}
