import React from 'react';
import { motion } from 'motion/react';
import { Home, Award, AlertTriangle, ArrowRight } from 'lucide-react';
import { Scenario } from '../../types';

interface EducationalScreenProps {
  scenario: Scenario;
  setShowExitConfirm: (val: boolean) => void;
  continueAfterEdu: () => void;
}

export function EducationalScreen({ scenario, setShowExitConfirm, continueAfterEdu }: EducationalScreenProps) {
  return (
    <motion.div 
      key="educational"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 w-full max-w-5xl mx-auto h-full overflow-hidden relative"
    >
      <button 
        onClick={() => setShowExitConfirm(true)}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-red-500 text-white rounded-2xl shadow-xl z-20 hover:bg-red-600 transition-all"
        title="Выйти в меню"
      >
        <Home className="w-5 h-5 md:w-8 md:h-8" />
      </button>
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 md:p-8 lg:p-10 rounded-[2rem] md:rounded-[3rem] space-y-4 md:space-y-6 shadow-2xl backdrop-blur-3xl relative w-full max-w-2xl max-h-full overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 pointer-events-none">
          <Award className="w-16 h-16 md:w-40 md:h-40 lg:w-56 lg:h-56 text-blue-500" />
        </div>
        
        <div className="flex items-center gap-3 md:gap-6 lg:gap-10 shrink-0">
          <div className="p-3 md:p-5 lg:p-6 bg-blue-500/20 rounded-xl md:rounded-2xl border border-blue-500/30">
            <AlertTriangle className="w-5 h-5 md:w-10 md:h-10 lg:w-14 lg:h-14 text-blue-400" />
          </div>
          <h2 className="text-lg md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            {scenario.educationalInfo.title}
          </h2>
        </div>
        
        <div className="space-y-4 md:space-y-8 text-zinc-200 text-xs md:text-xl lg:text-2xl leading-relaxed font-medium">
          <p>{scenario.educationalInfo.description}</p>
          
          {scenario.educationalInfo.realExample && (
            <div className="bg-zinc-950 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-zinc-800/50 relative shadow-inner">
              <div className="absolute -top-2.5 left-4 md:left-8 px-3 md:px-5 bg-zinc-800 text-[6px] md:text-sm font-black uppercase tracking-[0.2em] text-zinc-400 py-1 md:py-1.5 rounded-lg">
                Важно знать
              </div>
              <p className="text-[9px] md:text-xl italic text-zinc-400 leading-relaxed">
                {scenario.educationalInfo.realExample}
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={continueAfterEdu}
          className="w-full py-4 md:py-8 bg-purple-500 text-black font-black text-base md:text-2xl lg:text-3xl uppercase tracking-widest hover:bg-purple-400 transition-all flex items-center justify-center gap-3 md:gap-5 shadow-[0_15px_40px_rgba(168,85,247,0.25)] rounded-xl md:rounded-2xl shrink-0"
        >
          Следующий сектор
          <ArrowRight className="w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12" />
        </button>
      </div>
    </motion.div>
  );
}
