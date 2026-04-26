import React from 'react';
import { motion } from 'motion/react';
import {
  Shield, User, Volume2, VolumeX, Heart, Home, Search, Snowflake, Radio,
  HelpCircle, Mail, MessageSquare, Globe, QrCode, XCircle, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { Scenario, ScenarioType, DialogNode, DialogChoice, DialogMessage } from '../../types';

interface PlayingScreenProps {
  rank: {
    title: string;
    color: string;
    bg: string;
  };
  setUserInteracted: (val: boolean) => void;
  setIsSoundEnabled: (val: boolean) => void;
  isSoundEnabled: boolean;
  bgMusicRef: React.RefObject<HTMLAudioElement>;
  score: number;
  showPointsAnimation: number | null;
  evidence: string[];
  health: number;
  timeLeft: number;
  combo: number;
  scenario: Scenario;
  isVoicePlaying: boolean;
  isFrozen: boolean;
  handleChoice: (isFake: boolean) => void;
  setShowExitConfirm: (val: boolean) => void;
  setShowFAQ: (val: boolean) => void;
  playSound: (sound: string) => void;
  usePowerUp: (type: string) => void;
  powerUps: {
    magnifier: number;
    freeze: number;
    call: number;
  };
  showHint: boolean;
  activePowerUp: string | null;
  investigated: {
    sender: boolean;
    url: boolean;
  };
  voiceAudioFailed: boolean;
  handlePlayVoiceAudio: () => void;
  isMobile: boolean;
  currentDialogNodeId: string;
  dialogHistory: string[];
  userResponses: Array<{ nodeId: string; text: string }>;
  handleDialogChoice: (choiceId: string) => void;
  dialogClueRevealed: string | null;
  dialogWarningShown: string | null;
  isTutorialActive: boolean;
  tutorialStep: number;
  setTutorialStep: (step: number | ((prev: number) => number)) => void;
  setIsTutorialActive: (active: boolean) => void;
  onPointerAction: (action: () => void) => React.PointerEventHandler;
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
  rank,
  setUserInteracted,
  setIsSoundEnabled,
  isSoundEnabled,
  bgMusicRef,
  score,
  showPointsAnimation,
  evidence,
  health,
  timeLeft,
  combo,
  scenario,
  isVoicePlaying,
  isFrozen,
  handleChoice,
  setShowExitConfirm,
  setShowFAQ,
  playSound,
  usePowerUp,
  powerUps,
  showHint,
  activePowerUp,
  investigated,
  voiceAudioFailed,
  handlePlayVoiceAudio,
  isMobile,
  currentDialogNodeId,
  dialogHistory,
  userResponses,
  handleDialogChoice,
  dialogClueRevealed,
  dialogWarningShown,
  isTutorialActive,
  tutorialStep,
  setTutorialStep,
  setIsTutorialActive,
  onPointerAction,
}) => {
  return (
    <motion.div
      key="playing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-8 items-stretch justify-center max-w-[1800px] mx-auto w-full px-2 sm:px-6 lg:px-10 relative py-2 sm:py-4 lg:py-6"
    >
      {/* Desktop/Tablet Left Column: Stats & Rank - скрыт на мобильных */}
      <div className="hidden lg:flex flex-col w-48 xl:w-64 2xl:w-80 shrink-0 space-y-3 xl:space-y-4">
        <div id="stats-card" className="bg-zinc-900/60 border border-zinc-800/50 p-4 xl:p-6 rounded-2xl backdrop-blur-xl space-y-3 shadow-2xl relative">
          <div className="flex items-center gap-3">
            <div className={`p-2 xl:p-3 rounded-xl ${rank.bg} border border-white/5`}>
              <User className={`w-5 h-5 xl:w-6 xl:h-6 ${rank.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-zinc-500 uppercase font-black tracking-[0.2em] mb-0.5">Статус</div>
              <div className={`text-sm font-black uppercase tracking-tight leading-none ${rank.color}`}>{rank.title}</div>
            </div>
            <button
              onClick={() => {
                setUserInteracted(true);
                setIsSoundEnabled(!isSoundEnabled);
                if (!isSoundEnabled && bgMusicRef.current) {
                  bgMusicRef.current.play().catch(() => { });
                }
              }}
              className="p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full border border-white/10 text-zinc-400 transition-all shadow-lg backdrop-blur-md shrink-0 focus:ring-2 focus:ring-purple-500"
              aria-label={isSoundEnabled ? "Выключить звук" : "Включить звук"}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" aria-label="Звук включен" /> : <><VolumeX className="w-4 h-4" aria-label="Звук выключен" /><span className="text-xs ml-1">Выкл</span></>}
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-black uppercase tracking-widest relative">
              <span className="text-zinc-500">Счет</span>
              <span className={`text-white ${showPointsAnimation ? 'animate-count-up' : ''}`}>
                {showPointsAnimation ? (
                  <span className="text-green-400">+{showPointsAnimation}</span>
                ) : score}
              </span>
            </div>
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
              <motion.div
                animate={{ width: `${Math.min(100, (score / 5000) * 100)}%` }}
                className={`h-full ${rank.color.replace('text-', 'bg-')} shadow-[0_0_25px_rgba(255,255,255,0.6)] relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/50 p-4 xl:p-6 rounded-2xl backdrop-blur-xl flex-1 min-h-0 overflow-hidden flex flex-col shadow-2xl">
          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 shrink-0">
            <Shield className="w-3 h-3 text-purple-500" />
            История
          </h4>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {evidence.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className="p-2 bg-zinc-950/80 rounded-lg border border-zinc-800/50 text-xs text-zinc-400 font-mono break-all leading-relaxed"
              >
                {item}
              </motion.div>
            ))}
            {evidence.length === 0 && <p className="text-xs text-zinc-600 italic font-mono">Нет улик...</p>}
          </div>
        </div>
      </div>

      {/* Mobile HUD (visible only on mobile < 1024px) */}
      <div id="mobile-hud" className="lg:hidden flex flex-col gap-1 sm:gap-2 shrink-0 w-full max-w-[360px] sm:max-w-sm mx-auto">
        <div className="flex justify-between items-center bg-zinc-900/50 p-2 sm:p-3 px-3 sm:px-5 rounded-xl sm:rounded-2xl border border-zinc-800/50 backdrop-blur-md">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < health ? 'text-red-500 fill-red-500' : 'text-zinc-800'}`} />
            ))}
          </div>
          <div className={`text-lg sm:text-xl font-black font-mono ${isFrozen ? 'text-blue-400' : 'text-purple-500'}`}>
            {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowExitConfirm(true)}
              onPointerDown={onPointerAction(() => setShowExitConfirm(true))}
              className="p-2 sm:p-2.5 bg-red-500 rounded-full text-white shadow-lg backdrop-blur-md hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500"
              aria-label="Выход в меню"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка дома" />
            </button>
            <button
              onClick={() => {
                setUserInteracted(true);
                setIsSoundEnabled(!isSoundEnabled);
                if (!isSoundEnabled && bgMusicRef.current) {
                  bgMusicRef.current.play().catch(() => { });
                }
              }}
              className="p-2 sm:p-2.5 bg-zinc-800/80 rounded-full border border-white/10 text-zinc-400 shadow-lg backdrop-blur-md focus:ring-2 focus:ring-purple-500"
              aria-label={isSoundEnabled ? "Выключить звук" : "Включить звук"}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Звук включен" /> : <><VolumeX className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Звук выключен" /><span className="text-xs ml-1">Выкл</span></>}
            </button>
            <div className="text-right">
              <div className="text-sm font-black text-white font-mono">
                {score}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-1 sm:gap-2">
          <button
            onClick={() => usePowerUp('magnifier')}
            onPointerDown={onPointerAction(() => usePowerUp('magnifier'))}
            disabled={powerUps.magnifier === 0 || showHint || isVoicePlaying || scenario.type === ScenarioType.VOICE}
            className={`p-2 sm:p-3 bg-zinc-900 border rounded-lg sm:rounded-xl text-blue-400 disabled:opacity-30 focus:ring-2 focus:ring-blue-500 min-h-[40px] sm:min-h-[44px] transition-all ${activePowerUp === 'magnifier' ? 'animate-pulse border-blue-400 glow-cyan' : 'border-zinc-800'}`}
            aria-label="Использовать лупу"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка лупы" />
          </button>
          <button
            onClick={() => usePowerUp('freeze')}
            onPointerDown={onPointerAction(() => usePowerUp('freeze'))}
            disabled={powerUps.freeze === 0 || isFrozen || isVoicePlaying}
            className={`p-2 sm:p-3 bg-zinc-900 border rounded-lg sm:rounded-xl text-cyan-400 disabled:opacity-30 focus:ring-2 focus:ring-cyan-500 min-h-[40px] sm:min-h-[44px] transition-all ${activePowerUp === 'freeze' ? 'animate-pulse border-cyan-400 glow-cyan' : 'border-zinc-800'}`}
            aria-label="Использовать заморозку"
          >
            <Snowflake className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка снежинки" />
          </button>
          <button
            onClick={() => usePowerUp('call')}
            onPointerDown={onPointerAction(() => usePowerUp('call'))}
            disabled={powerUps.call === 0 || (investigated.sender && investigated.url) || isVoicePlaying || scenario.type === ScenarioType.DIALOG}
            className={`p-2 sm:p-3 bg-zinc-900 border rounded-lg sm:rounded-xl text-purple-400 disabled:opacity-30 focus:ring-2 focus:ring-purple-500 min-h-[40px] sm:min-h-[44px] transition-all ${activePowerUp === 'call' ? 'animate-pulse border-purple-400 glow-purple' : 'border-zinc-800'}`}
            aria-label="Использовать звонок"
          >
            <Radio className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка радио" />
          </button>
          <button
            onClick={() => setShowFAQ(true)}
            onPointerDown={onPointerAction(() => setShowFAQ(true))}
            className="p-2 sm:p-3 bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl text-zinc-500 focus:ring-2 focus:ring-zinc-500 min-h-[40px] sm:min-h-[44px]"
            aria-label="Показать FAQ"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка помощи" />
          </button>
        </div>

        <div id="mobile-briefing" className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border text-xs font-mono leading-tight overflow-hidden ${scenario.isSpecialMission ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
          <p>{scenario.briefing}</p>
        </div>
      </div>

      {/* Center Column: Smartphone */}
      <div id="smartphone-card" className="flex-1 flex items-center justify-center min-h-0 relative py-2 px-1 sm:px-2 lg:min-w-[320px] xl:min-w-[400px]">
        <div className="smartphone-container relative h-[calc(100dvh-210px)] lg:h-[min(calc(100dvh-100px),850px)] aspect-[9/19] min-w-[240px] bg-zinc-950 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] border-4 sm:border-[6px] md:border-[12px] border-zinc-900 shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(255,255,255,0.03)] overflow-hidden flex flex-col ring-1 ring-white/5 group shrink-0 transition-all duration-500">

          {/* Physical Buttons Realism */}
          <div className="absolute -left-[7px] md:-left-[15px] top-24 w-1 md:w-1.5 h-10 md:h-14 bg-zinc-800 rounded-l-lg border-y border-l border-white/10 shadow-lg" />
          <div className="absolute -left-[7px] md:-left-[15px] top-36 w-1 md:w-1.5 h-10 md:h-14 bg-zinc-800 rounded-l-lg border-y border-l border-white/10 shadow-lg" />
          <div className="absolute -right-[7px] md:-right-[15px] top-32 w-1 md:w-1.5 h-16 md:h-24 bg-zinc-800 rounded-r-lg border-y border-r border-white/10 shadow-lg" />

          {/* Antenna Lines */}
          <div className="absolute top-10 left-0 w-full h-[1px] bg-white/5 opacity-20" />
          <div className="absolute bottom-10 left-0 w-full h-[1px] bg-white/5 opacity-20" />

          {/* Notch / Dynamic Island */}
          <div className="absolute top-1.5 md:top-2.5 left-1/2 -translate-x-1/2 w-20 md:w-36 h-5 md:h-8 bg-black rounded-full z-20 flex items-center justify-center gap-2 md:gap-4 border border-white/10 shadow-2xl">
            <div className="w-1.5 md:w-3 h-1.5 md:h-3 bg-zinc-900 rounded-full border border-white/5 flex items-center justify-center">
              <div className="w-0.5 md:w-1 h-0.5 md:h-1 bg-blue-500/20 rounded-full" />
            </div>
            <div className="w-8 md:w-14 h-1 md:h-2 bg-zinc-900 rounded-full border border-white/5" />
          </div>

          {/* Screen Content */}
          <div className="flex-1 p-3 md:p-6 pt-10 md:pt-16 flex flex-col space-y-3 md:space-y-5 overflow-hidden relative min-h-0">
            {/* Subtle screen reflection */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />

            {scenario.type === ScenarioType.VOICE ? (
              <div className="w-full flex-1 bg-zinc-900/80 rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 border border-zinc-800/50 shadow-2xl backdrop-blur-sm flex flex-col items-center justify-center space-y-3 md:space-y-6 overflow-hidden">
                <motion.div
                  animate={{
                    scale: isVoicePlaying ? [1, 1.05, 1] : 1,
                    boxShadow: isVoicePlaying ? ["0 0 20px rgba(168,85,247,0.3)", "0 0 40px rgba(168,85,247,0.5)", "0 0 20px rgba(168,85,247,0.3)"] : "none"
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-16 h-16 md:w-24 md:h-24 bg-purple-500 rounded-full flex items-center justify-center shadow-2xl shrink-0"
                >
                  {isVoicePlaying ? (
                    <Volume2 className="w-8 h-8 md:w-12 md:h-12 text-black" />
                  ) : voiceAudioFailed ? (
                    <VolumeX className="w-8 h-8 md:w-12 md:h-12 text-black" />
                  ) : (
                    <Volume2 className="w-8 h-8 md:w-12 md:h-12 text-black" />
                  )}
                </motion.div>
                <div className="text-center space-y-1 shrink-0 px-2">
                  <h4 className="text-white font-black text-sm md:text-xl tracking-tight leading-tight break-words">{scenario.sender}</h4>
                  <p className={`text-purple-500 text-xs md:text-sm font-black uppercase tracking-widest ${isVoicePlaying ? 'animate-pulse' : ''}`}>
                    {isVoicePlaying ? 'Идет разговор...' : voiceAudioFailed ? 'Аудио не запустилось' : 'Входящий вызов...'}
                  </p>
                </div>

                {/* Кнопка ручного запуска — на мобильных показываем ВСЕГДА когда не играет */}
                {(voiceAudioFailed || (isMobile && !isVoicePlaying && scenario.type === ScenarioType.VOICE)) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      playSound('click');
                      handlePlayVoiceAudio();
                    }}
                    onPointerDown={onPointerAction(() => {
                      playSound('click');
                      handlePlayVoiceAudio();
                    })}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-black font-black text-sm md:text-base rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-2 transition-all active:scale-95 focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    aria-label={voiceAudioFailed ? 'Повторить аудио' : 'Воспроизвести голос'}
                  >
                    <Volume2 className="w-5 h-5 md:w-6 md:h-6" aria-label="Иконка громкости" />
                    {voiceAudioFailed ? 'Повторить' : 'Воспроизвести голос'}
                  </motion.button>
                )}

                <div className="bg-zinc-950/90 p-3 md:p-4 rounded-2xl border border-zinc-800/50 text-center italic text-xs md:text-sm text-zinc-300 leading-relaxed shadow-xl overflow-hidden">
                  {isVoicePlaying ? "«Слушайте сообщение внимательно...»" : voiceAudioFailed ? "«Нажмите кнопку выше для воспроизведения»" : "«Ожидание ответа...»"}
                </div>
              </div>
            ) : scenario.type === ScenarioType.DIALOG ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {scenario.dialogTree && (
                  <>
                    {(() => {
                      const currentNode = scenario.dialogTree.find((node: DialogNode) => node.id === currentDialogNodeId);

                      // Build dialog history for display - интерлив ответов пользователя и мошенника
                      const dialogMessages: DialogMessage[] = [];

                      // Проходим по истории и добавляем сообщения с ответами пользователя
                      for (let i = 0; i < dialogHistory.length; i++) {
                        const historyItemId = dialogHistory[i];
                        const histNode = scenario.dialogTree.find((n: DialogNode) => n.id === historyItemId);

                        if (histNode && histNode.text && !histNode.text.startsWith('Выберите')) {
                          // Добавляем сообщение мошенника/системы
                          dialogMessages.push({
                            id: histNode.id,
                            speaker: histNode.speaker,
                            text: histNode.text,
                            isCorrect: histNode.isCorrect
                          });

                          // Ищем ответ пользователя для ЭТОГО узла (а не для предыдущего!)
                          // Ответ пользователя сохраняется с nodeId = id узла, на котором был сделан выбор
                          const userResponse = userResponses.find((r) => r.nodeId === historyItemId);
                          if (userResponse) {
                            dialogMessages.push({
                              id: `user-${historyItemId}`,
                              speaker: 'user',
                              text: userResponse.text
                            });
                          }
                        }
                      }

                      // Добавляем текущее сообщение если оно новое
                      if (currentNode && currentNode.text && !dialogHistory.includes(currentNode.id)) {
                        dialogMessages.push({
                          id: currentNode.id,
                          speaker: currentNode.speaker,
                          text: currentNode.text,
                          isCorrect: currentNode.isCorrect
                        });
                      }

                      return (
                        <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
                          {/* Диалог - история сообщений */}
                          <div className="bg-zinc-900/90 rounded-xl p-2 md:p-2.5 lg:p-3 border border-zinc-800 space-y-1 md:space-y-1.5 shadow-2xl flex-1 min-h-0 overflow-y-auto">
                            {dialogMessages.length === 0 ? (
                              <div className="text-center text-zinc-500 text-[10px] xs:text-xs py-2 md:py-3">
                                💬 Диалог начинается...
                              </div>
                            ) : (
                              dialogMessages.map((msg, idx) => (
                                <motion.div
                                  key={`${msg.id}-${idx}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className={`flex items-start gap-1 md:gap-1.5 lg:gap-2`}
                                >
                                  <div className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-black text-white text-[10px] md:text-xs shrink-0 ${msg.speaker === 'scammer' ? 'bg-zinc-700/60 border border-zinc-500/50' :
                                      msg.speaker === 'user' ? 'bg-cyan-500/40 border border-cyan-500/50' :
                                        'bg-zinc-600/60 border border-zinc-500/50'
                                    }`}>
                                    {msg.speaker === 'scammer' ? '💬' : msg.speaker === 'user' ? '🛡️' : 'ℹ️'}
                                  </div>
                                  <div className={`flex-1 min-w-0`}>
                                    <h6 className={`font-semibold text-[10px] md:text-xs ${msg.speaker === 'scammer' ? 'text-red-300' :
                                        msg.speaker === 'user' ? 'text-cyan-300' :
                                          'text-zinc-400'
                                      }`}>
                                      {msg.speaker === 'scammer' ? scenario.sender.replace('Чат: ', '').replace(/'/g, '') : msg.speaker === 'user' ? 'Вы' : 'Система'}
                                    </h6>
                                    <p className="text-[10px] md:text-xs text-zinc-100 leading-tight md:leading-snug py-0.5 break-words">
                                      {msg.text}
                                    </p>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>

                          {/* Кнопки выбора или информационное сообщение */}
                          {currentNode?.choices ? (
                            <div className="grid grid-cols-1 gap-1.5 shrink-0">
                              {currentNode.choices.map((choice: DialogChoice) => (
                                <button
                                  key={choice.id}
                                  onClick={() => handleDialogChoice(choice.id)}
                                  onPointerDown={onPointerAction(() => handleDialogChoice(choice.id))}
                                  className={`p-2.5 md:p-3 rounded-lg border text-xs md:text-sm text-zinc-100 transition-all active:scale-95 focus:ring-2 focus:ring-blue-500 min-h-[40px] text-left relative overflow-hidden ${dialogClueRevealed === choice.id
                                      ? 'bg-blue-500/20 border-blue-500 animate-pulse'
                                      : dialogWarningShown === choice.id
                                        ? 'bg-red-500/20 border-red-500 animate-shake'
                                        : 'bg-zinc-800/60 border-zinc-700 hover:bg-zinc-700/60'
                                    }`}
                                  aria-label={choice.text}
                                >
                                  {dialogClueRevealed === choice.id && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 text-[10px] animate-bounce">
                                      💡
                                    </span>
                                  )}
                                  {dialogWarningShown === choice.id && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 text-[10px] animate-pulse">
                                      ⚠️
                                    </span>
                                  )}
                                  {choice.text}
                                </button>
                              ))}
                            </div>
                          ) : currentNode && !currentNode.choices ? (
                            <div className={`p-3 md:p-4 rounded-xl text-center border-2 ${currentNode.isCorrect === true
                                ? 'bg-green-500/10 border-green-500 text-green-400'
                                : currentNode.isCorrect === false
                                  ? 'bg-red-500/10 border-red-500 text-red-400'
                                  : 'bg-zinc-800/50 border-zinc-600 text-zinc-300'
                              }`}>
                              <p className="font-black text-sm md:text-base">
                                {currentNode.isCorrect === true && '✅ ДИАЛОГ ВЫИГРАН!'}
                                {currentNode.isCorrect === false && '⚠️ ВЫ ПОПАЛИСЬ НА УДОЧКУ!'}
                                {currentNode.isCorrect === undefined && '⏳ Ожидание...'}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-green-500/10 border-2 border-green-500 p-3 md:p-4 rounded-xl text-center">
                              <p className="text-green-400 font-black text-sm md:text-base">✅ Диалог завершен!</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900/80 rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 border border-zinc-800/50 space-y-3 md:space-y-4 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col max-h-full">
                <div className="flex items-center gap-2 md:gap-4 border-b border-zinc-800/50 pb-3 md:pb-4 shrink-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-zinc-800/80 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                    {scenario.type === ScenarioType.EMAIL ? <Mail className="w-4 h-4 md:w-6 md:h-6 text-blue-400" /> :
                      scenario.type === ScenarioType.SMS ? <MessageSquare className="w-4 h-4 md:w-6 md:h-6 text-purple-400" /> :
                        <Globe className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />}
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <div className={`text-xs sm:text-sm md:text-lg font-black tracking-tight leading-tight break-words ${investigated.sender ? 'text-red-400 underline decoration-red-500/50 underline-offset-4' : 'text-white'}`}>
                      {scenario.sender}
                    </div>
                    <div className="text-[8px] md:text-xs lg:text-sm text-zinc-500 uppercase font-mono mt-0.5">Отправитель</div>
                  </div>
                </div>

                <div className="text-xs md:text-base text-zinc-200 leading-relaxed break-words font-medium flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {scenario.type === ScenarioType.WEBSITE ? (
                    <div className="space-y-2 md:space-y-4">
                      <div className="p-2 md:p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 text-xs md:text-sm font-mono break-all text-blue-400 leading-tight">
                        {scenario.content}
                      </div>
                      <div className="text-xs md:text-xs lg:text-sm text-zinc-500 italic font-mono">Нажмите на ссылку для перехода...</div>
                    </div>
                  ) : scenario.type === ScenarioType.QR ? (
                    <div className="flex flex-col items-center gap-2 md:gap-4">
                      <div className="p-3 md:p-4 bg-white rounded-[1.5rem] shadow-2xl">
                        <QrCode className="w-20 h-20 md:w-32 md:h-32 text-black" />
                      </div>
                      <div className="text-xs md:text-xs lg:text-sm text-zinc-500 italic font-mono">Отсканируйте код...</div>
                    </div>
                  ) : <>{scenario.content}</>}
                </div>
              </div>
            )}

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-500/10 border border-purple-500/30 p-4 md:p-6 rounded-2xl flex gap-3 md:gap-4 items-start shrink-0 shadow-xl"
              >
                <HelpCircle className="w-4 h-4 md:w-8 md:h-8 text-purple-500 shrink-0 mt-0.5" />
                <p className="text-xs md:text-lg text-purple-400 font-bold leading-tight">{scenario.hint}</p>
              </motion.div>
            )}
          </div>

          {/* Choice Buttons INSIDE Phone */}
          <div id="choice-buttons" className="p-2 md:p-4 bg-zinc-900/95 border-t border-zinc-800/50 grid grid-cols-2 gap-2 md:gap-4 shrink-0 backdrop-blur-xl">
            <button
              onClick={() => handleChoice(true)}
              onPointerDown={onPointerAction(() => handleChoice(true))}
              className="flex flex-col items-center justify-center gap-1 md:gap-2 p-2 md:p-4 bg-red-500/10 border border-red-500/30 rounded-2xl md:rounded-[2rem] hover:bg-red-500/20 transition-all group active:scale-95 shadow-lg focus:ring-2 focus:ring-red-500 min-h-[44px] md:min-h-[80px]"
              aria-label="Выбрать фейк"
            >
              <XCircle className="w-5 h-5 md:w-12 md:h-12 text-red-500 group-hover:scale-110 transition-transform" aria-label="Крестик" />
              <span className="text-xs md:text-lg font-black text-red-500 uppercase tracking-widest">Фейк</span>
            </button>
            <button
              onClick={() => handleChoice(false)}
              onPointerDown={onPointerAction(() => handleChoice(false))}
              className="flex flex-col items-center justify-center gap-1 md:gap-2 p-2 md:p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl md:rounded-[2rem] hover:bg-purple-500/20 transition-all group active:scale-95 shadow-lg focus:ring-2 focus:ring-purple-500 min-h-[44px] md:min-h-[80px]"
              aria-label="Выбрать ок"
            >
              <CheckCircle2 className="w-5 h-5 md:w-12 md:h-12 text-purple-500 group-hover:scale-110 transition-transform" aria-label="Галочка" />
              <span className="text-xs md:text-lg font-black text-purple-500 uppercase tracking-widest">Ок</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Right Column: HUD, Power-ups, Briefing - скрыт на мобильных */}
      <div className="hidden lg:flex flex-col w-48 xl:w-64 2xl:w-80 shrink-0 space-y-3 xl:space-y-4">
        {/* HUD Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/50 p-4 xl:p-6 rounded-2xl backdrop-blur-xl space-y-3 shadow-2xl relative group/hud">
          <button
            onClick={() => setShowExitConfirm(true)}
            onPointerDown={onPointerAction(() => setShowExitConfirm(true))}
            className="absolute top-2 right-2 p-2 sm:p-3 bg-red-500 text-white rounded-xl sm:rounded-2xl transition-all hover:scale-110 shadow-xl z-20 focus:ring-2 focus:ring-red-500"
            aria-label="Выйти в главное меню"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка дома" />
          </button>
          <div className="flex justify-between items-center pr-10 sm:pr-12">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < health ? 'text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-zinc-800'}`} />
              ))}
            </div>
            <div className={`text-xl font-black font-mono tracking-tighter ${isFrozen ? 'text-blue-400' : 'text-purple-500'}`}>
              {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-800/50 pt-2">
            <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">Комбо</div>
            <motion.div
              key={combo}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className={`text-base font-black italic ${combo >= 3 ? 'text-yellow-400 animate-pulse' : 'text-yellow-500'}`}
            >
              x{combo}
            </motion.div>
          </div>
        </div>

        <div id="tools-card" className="bg-zinc-900/60 border border-zinc-800/50 p-4 xl:p-6 rounded-2xl backdrop-blur-xl space-y-2 shadow-2xl">
          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Инструменты</h4>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => usePowerUp('magnifier')}
              onPointerDown={onPointerAction(() => usePowerUp('magnifier'))}
              disabled={powerUps.magnifier === 0 || showHint || isVoicePlaying || scenario.type === ScenarioType.VOICE}
              className={`flex items-center justify-between p-2 sm:p-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 min-h-[40px] sm:min-h-[44px] ${activePowerUp === 'magnifier' ? 'animate-pulse border-blue-400 glow-cyan' : powerUps.magnifier > 0 && !isVoicePlaying && !showHint && scenario.type !== ScenarioType.VOICE ? 'bg-zinc-950 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 shadow-lg' : 'bg-zinc-950/50 border-zinc-800 text-zinc-700 opacity-50'}`}
              aria-label="Использовать анализ"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка поиска" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-tight">Анализ</span>
              </div>
              <span className="text-sm font-black font-mono">{powerUps.magnifier}</span>
            </button>
            <button
              onClick={() => usePowerUp('freeze')}
              onPointerDown={onPointerAction(() => usePowerUp('freeze'))}
              disabled={powerUps.freeze === 0 || isFrozen || isVoicePlaying}
              className={`flex items-center justify-between p-2 sm:p-3 rounded-xl border transition-all focus:ring-2 focus:ring-cyan-500 min-h-[40px] sm:min-h-[44px] ${activePowerUp === 'freeze' ? 'animate-pulse border-cyan-400 glow-cyan' : powerUps.freeze > 0 && !isVoicePlaying && !isFrozen ? 'bg-zinc-950 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 shadow-lg' : 'bg-zinc-950/50 border-zinc-800 text-zinc-700 opacity-50'}`}
              aria-label="Использовать заморозку"
            >
              <div className="flex items-center gap-2">
                <Snowflake className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка снежинки" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-tight">Заморозка</span>
              </div>
              <span className="text-sm font-black font-mono">{powerUps.freeze}</span>
            </button>
            <button
              onClick={() => usePowerUp('call')}
              onPointerDown={onPointerAction(() => usePowerUp('call'))}
              disabled={powerUps.call === 0 || (investigated.sender && investigated.url) || isVoicePlaying || scenario.type === ScenarioType.DIALOG}
              className={`flex items-center justify-between p-2 sm:p-3 rounded-xl border transition-all focus:ring-2 focus:ring-purple-500 min-h-[40px] sm:min-h-[44px] ${activePowerUp === 'call' ? 'animate-pulse border-purple-400 glow-purple' : powerUps.call > 0 && !isVoicePlaying && !(investigated.sender && investigated.url) && scenario.type !== ScenarioType.DIALOG ? 'bg-zinc-950 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 shadow-lg' : 'bg-zinc-950/50 border-zinc-800 text-zinc-700 opacity-50'}`}
              aria-label="Использовать связь"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка радио" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-tight">Связь</span>
              </div>
              <span className="text-sm font-black font-mono">{powerUps.call}</span>
            </button>
          </div>
        </div>

        {/* Briefing Card */}
        <div id="briefing-card" className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-mono leading-relaxed flex-1 min-h-0 overflow-hidden shadow-2xl ${scenario.isSpecialMission ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse' : 'bg-zinc-900/60 border-zinc-800/50 text-zinc-400'}`}>
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <ShieldAlert className="w-3 h-3 sm:w-4 sm:h-4" aria-label="Иконка предупреждения" />
            <span className="font-black uppercase tracking-[0.2em] text-xs">Брифинг</span>
          </div>
          <div className="flex-1 overflow-hidden">
            {scenario.briefing}
          </div>
        </div>

        <button
          onClick={() => setShowFAQ(true)}
          onPointerDown={onPointerAction(() => setShowFAQ(true))}
          className="w-full py-2 sm:py-3 bg-zinc-900/80 border border-zinc-800/50 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all rounded-xl sm:rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-xl focus:ring-2 focus:ring-zinc-500 min-h-[40px] sm:min-h-[44px]"
          aria-label="Показать помощь"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-label="Иконка помощи" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest">Помощь</span>
        </button>
      </div>

      {/* Tutorial Overlay */}
      {isTutorialActive && (
        <div className={`absolute inset-0 z-[200] pointer-events-none flex p-2 sm:p-4 transition-all duration-500 ${tutorialStep === 0 ? 'justify-center items-end pb-28 sm:pb-32 lg:items-center lg:pb-0 lg:justify-start lg:pl-[30%]' :
            tutorialStep === 1 ? 'justify-center items-center lg:justify-end lg:pr-[5%]' :
              tutorialStep === 2 ? 'justify-center items-center lg:justify-start lg:pl-[5%]' :
                tutorialStep === 3 ? 'justify-center items-end lg:justify-start lg:pl-[5%] lg:pb-[15%]' :
                  'justify-center items-start pt-16 sm:pt-20 lg:pt-[10%]'
          }`}>
          <motion.div
            key={tutorialStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-900 border-2 border-purple-500 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl max-w-[90%] sm:max-w-sm w-full max-h-[calc(100vh-80px)] sm:max-h-none overflow-y-auto shadow-[0_0_50px_rgba(168,85,247,0.6)] space-y-3 sm:space-y-4 relative pointer-events-auto z-[210]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <HelpCircle className="w-6 h-6 text-purple-500" aria-label="Иконка помощи" />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white">Обучение</h3>
            </div>

            <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-bold">
              {tutorialStep === 0 && "Здесь отображается ваш текущий ранг и заработанные очки. Чем выше счет, тем выше ваше звание!"}
              {tutorialStep === 1 && "Это ваше основное рабочее устройство. Внимательно изучайте входящие сообщения, звонки и сайты."}
              {tutorialStep === 2 && "Используйте эти нейро-инструменты для анализа, заморозки времени или получения прямой подсказки от ИИ."}
              {tutorialStep === 3 && "Здесь вы найдете описание текущей ситуации. Всегда читайте его перед принятием решения."}
              {tutorialStep === 4 && "Нажимайте 'Фейк', если считаете сообщение опасным, или 'Ок', если оно безопасно. Удачи!"}
            </p>

            <button
              onClick={() => {
                if (tutorialStep < 4) {
                  setTutorialStep(prev => (prev as number) + 1);
                } else {
                  setIsTutorialActive(false);
                  setTutorialStep(0);
                }
              }}
              className="w-full py-3 bg-purple-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all active:scale-95"
            >
              {tutorialStep < 4 ? "Далее" : "Понятно!"}
            </button>
          </motion.div>

          {/* Highlight Effect */}
          <style dangerouslySetInnerHTML={{
            __html: `
            /* Desktop/Tablet: lg breakpoint (1024px) */
            @media (min-width: 1024px) {
              #${['stats-card', 'smartphone-card', 'tools-card', 'briefing-card', 'choice-buttons'][tutorialStep]} {
                position: relative;
                z-index: 150;
                box-shadow: 0 0 0 9999px rgba(0,0,0,0.85), 0 0 60px rgba(168,85,247,0.8) !important;
                pointer-events: none;
                outline: 4px solid #a855f7;
                outline-offset: 4px;
                border-radius: 1.5rem;
              }
            }
            /* Tablet: between 768px and 1023px */
            @media (min-width: 768px) and (max-width: 1023px) {
              #${['smartphone-card', 'smartphone-card', 'smartphone-card', 'smartphone-card', 'choice-buttons'][tutorialStep]} {
                position: relative;
                z-index: 150;
                box-shadow: 0 0 0 9999px rgba(0,0,0,0.85), 0 0 60px rgba(168,85,247,0.8) !important;
                pointer-events: none;
                outline: 4px solid #a855f7;
                outline-offset: 4px;
                border-radius: 1.5rem;
              }
            }
            /* Mobile: less than 768px */
            @media (max-width: 767px) {
              #${['mobile-hud', 'smartphone-card', 'mobile-hud', 'mobile-briefing', 'choice-buttons'][tutorialStep]} {
                position: relative;
                z-index: 150;
                box-shadow: 0 0 0 9999px rgba(0,0,0,0.85), 0 0 60px rgba(168,85,247,0.8) !important;
                pointer-events: none;
                outline: 4px solid #a855f7;
                outline-offset: 4px;
                border-radius: 1.5rem;
              }
            }
          `}} />
        </div>
      )}
    </motion.div>
  );
};
