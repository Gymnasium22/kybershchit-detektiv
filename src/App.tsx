/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Timer, 
  HelpCircle, 
  ArrowRight, 
  RefreshCcw,
  Mail,
  MessageSquare,
  Globe,
  User,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Snowflake,
  Lock,
  Scissors,
  Radio,
  FileText,
  Trophy,
  Heart,
  Award,
  Zap,
  Volume2,
  VolumeX,
  QrCode,
  Home
} from 'lucide-react';
import { SCENARIOS, ScenarioType, NEW_SCENARIOS } from './types';

type GameState = 'START' | 'STORY' | 'TUTORIAL' | 'PLAYING' | 'FEEDBACK' | 'EDUCATIONAL' | 'MINIGAME' | 'END' | 'GLOSSARY' | 'PROFILE' | 'LOADING';

export default function App() {
  return (
    <GameContent />
  );
}

function GameContent() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showHint, setShowHint] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [lastResult, setLastResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [powerUps, setPowerUps] = useState({
    magnifier: 2,
    freeze: 1,
    call: 1
  });
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isFrozen, setIsFrozen] = useState(false);
  const [investigated, setInvestigated] = useState({ sender: false, url: false });
  const [evidence, setEvidence] = useState<string[]>([]);
  const [miniGameData, setMiniGameData] = useState<{ type: 'PASSWORD' | 'CABLE', target: string, progress: string | number } | null>(null);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('cybershield_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [totalStats, setTotalStats] = useState(() => {
    const saved = localStorage.getItem('cybershield_stats');
    return saved ? JSON.parse(saved) : { scenarios: 0, score: 0, rank: 'Курсант' };
  });

  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false); // Отслеживаем первое взаимодействие
  const [voiceAudioFailed, setVoiceAudioFailed] = useState(false); // Если аудио не запустилось
  const [isNewGamePlus, setIsNewGamePlus] = useState(false); // Режим новой смены после прохождения
  const [isMobile, setIsMobile] = useState(false); // Мобильное устройство
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = React.useRef<HTMLAudioElement | null>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  // Используем разные сценарии для обычной игры и новой смены
  const scenariosList = isNewGamePlus ? NEW_SCENARIOS : SCENARIOS;
  const scenario = scenariosList[currentLevel];

  const getRank = useCallback(() => {
    if (score >= 5000) return { title: 'Генерал Кибервойск', color: 'text-purple-400', bg: 'bg-purple-500/10' };
    if (score >= 3000) return { title: 'Полковник «К»', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (score >= 1500) return { title: 'Майор Безопасности', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    if (score >= 500) return { title: 'Лейтенант ГУПК', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    return { title: 'Курсант Академии', color: 'text-zinc-400', bg: 'bg-zinc-500/10' };
  }, [score]);

  const rank = getRank();

  const getAchievements = useCallback(() => {
    const achievements = [];
    if (totalStats.score >= 5000) achievements.push({ icon: <Zap className="w-4 h-4" />, text: "Легенда Академии" });
    if (totalStats.scenarios >= 50) achievements.push({ icon: <ShieldCheck className="w-4 h-4" />, text: "Ветеран КиберЩита" });
    if (totalStats.score >= 1000) achievements.push({ icon: <Award className="w-4 h-4" />, text: "Первая тысяча" });
    if (evidence.length >= 5) achievements.push({ icon: <FileText className="w-4 h-4" />, text: "Мастер Улик" });
    if (highScore >= 2000) achievements.push({ icon: <Trophy className="w-4 h-4" />, text: "Рекордсмен" });
    if (totalStats.scenarios >= 15) achievements.push({ icon: <CheckCircle2 className="w-4 h-4" />, text: "Спец по угрозам" });
    if (combo >= 5) achievements.push({ icon: <Zap className="w-4 h-4" />, text: "Комбо-Мастер" });
    return achievements;
  }, [totalStats, evidence, highScore, combo]);

  const updateStats = useCallback((newScore: number, scenariosCompleted: number) => {
    const updated = {
      scenarios: totalStats.scenarios + scenariosCompleted,
      score: totalStats.score + newScore,
      rank: getRank().title
    };
    setTotalStats(updated);
    localStorage.setItem('cybershield_stats', JSON.stringify(updated));
  }, [totalStats, getRank]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'click' | 'win' | 'lose' | 'powerup' | 'minigame' | 'ringing') => {
    if (!isSoundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'ringing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(480, now);
        osc2.frequency.exponentialRampToValueAtTime(530, now + 0.5);
        gain2.gain.setValueAtTime(0.1, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc2.start(now);
        osc2.stop(now + 0.5);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'powerup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'minigame') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'win') {
        // Radio static effect
        const noise = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [isSoundEnabled]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsVoicePlaying(false);
  }, []);

  const playAudioFile = useCallback(async (url: string, onEnd?: () => void) => {
    // Если звук выключен, не пытаемся играть
    if (!isSoundEnabled) {
      setVoiceAudioFailed(true);
      return;
    }

    stopAudio(); // останавливаем предыдущее воспроизведение
    setVoiceAudioFailed(false);

    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 1.0;
      audio.load(); // Lazy load

      // Дожидаемся, пока аудио можно будет воспроизвести
      await new Promise<void>((resolve, reject) => {
        const canPlay = () => {
          audio.removeEventListener('canplaythrough', canPlay);
          audio.removeEventListener('error', reject);
          resolve();
        };
        const errorHandler = (e: Event) => {
          audio.removeEventListener('canplaythrough', canPlay);
          audio.removeEventListener('error', errorHandler);
          reject(e);
        };
        audio.addEventListener('canplaythrough', canPlay, { once: true });
        audio.addEventListener('error', errorHandler, { once: true });
        audio.load();
      });

      audioRef.current = audio;
      setIsVoicePlaying(true);

      // Приостанавливаем фоновую музыку
      let bgMusicWasPlaying = false;
      if (bgMusicRef.current && !bgMusicRef.current.paused) {
        bgMusicWasPlaying = true;
        bgMusicRef.current.pause();
      }

      // Запускаем воспроизведение
      await audio.play();

      audio.onended = () => {
        setIsVoicePlaying(false);
        audioRef.current = null;
        setVoiceAudioFailed(false);
        if (isSoundEnabled && bgMusicRef.current && bgMusicWasPlaying) {
          bgMusicRef.current.play().catch(() => {});
        }
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        console.error(`Audio error for ${url}:`, e);
        setIsVoicePlaying(false);
        audioRef.current = null;
        setVoiceAudioFailed(true);
        if (isSoundEnabled && bgMusicRef.current && bgMusicWasPlaying) {
          bgMusicRef.current.play().catch(() => {});
        }
      };
    } catch (err) {
      console.error('Audio playback failed:', err);
      setIsVoicePlaying(false);
      audioRef.current = null;
      setVoiceAudioFailed(true);
    }
  }, [stopAudio, isSoundEnabled]);

  const handleStart = useCallback(() => {
    playSound('click');
    setUserInteracted(true);
    setGameState('STORY');
    // Убираем setTimeout – аудио запустится сразу после клика
    playAudioFile('audio/briefing.mp3');
  }, [playSound, playAudioFile]);

  const startInvestigation = useCallback((withTutorial = false) => {
    playSound('click');
    setGameState('PLAYING');
    setCurrentLevel(0);
    setScore(0);
    setHealth(3);
    setTimeLeft(120);
    setShowHint(false);
    setCombo(1);
    setIsFrozen(false);
    setInvestigated({ sender: false, url: false });
    setEvidence([]);
    setPowerUps({ magnifier: 3, freeze: 2, call: 1 });
    if (withTutorial) {
      setIsTutorialActive(true);
      setTutorialStep(0);
    }
  }, [playSound]);

  const startMiniGame = useCallback((type: 'PASSWORD' | 'CABLE') => {
    playSound('minigame');
    if (type === 'PASSWORD') {
      const chars = 'ABCDEF123456';
      const target = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
      setMiniGameData({ type, target, progress: '' });
    } else {
      setMiniGameData({ type, target: '3', progress: 0 });
    }
    setGameState('MINIGAME');
  }, [playSound]);

  const handleChoice = useCallback((isPhishing: boolean) => {
    if (gameState !== 'PLAYING') return;
    
    const correct = isPhishing === scenario.isPhishing;
    setStats(prev => ({ ...prev, total: prev.total + 1, correct: prev.correct + (correct ? 1 : 0) }));
    setShowHint(false);
    if (correct) {
      playSound('correct');
      const points = (100 + Math.floor(timeLeft * 5)) * combo;
      setScore(s => s + points);
      setCombo(c => Math.min(c + 1, 5));
      setLastResult({ correct: true, message: "УГРОЗА НЕЙТРАЛИЗОВАНА" });
      if (scenario.isPhishing) {
        setEvidence(prev => [...new Set([...prev, scenario.sender])]);
      }
      setGameState('FEEDBACK');
    } else {
      playSound('wrong');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      setCombo(1);
      // Trigger mini-game instead of direct health loss
      startMiniGame(Math.random() > 0.5 ? 'PASSWORD' : 'CABLE');
    }
  }, [gameState, scenario, timeLeft, combo, playSound, startMiniGame]);

  const handleMiniGameSuccess = useCallback(() => {
    playSound('correct');
    setLastResult({ correct: false, message: "АТАКА ОТРАЖЕНА (ЧАСТИЧНО)" });
    setGameState('FEEDBACK');
  }, [playSound]);

  const handleMiniGameFailure = useCallback(() => {
    playSound('lose');
    setHealth(h => Math.max(0, h - 1));
    setLastResult({ correct: false, message: "СИСТЕМА СКОМПРОМЕТИРОВАНА" });
    setGameState('FEEDBACK');
  }, [playSound]);

  const usePowerUp = useCallback((type: 'magnifier' | 'freeze' | 'call') => {
    if (powerUps[type] <= 0 || gameState !== 'PLAYING' || isVoicePlaying) return;
    
    // Don't consume if already active for this level
    if (type === 'magnifier' && showHint) return;
    if (type === 'call' && (investigated.sender && investigated.url)) return;
    if (type === 'freeze' && isFrozen) return;

    // Magnifier is useless in voice calls
    if (type === 'magnifier' && scenario.type === ScenarioType.VOICE) return;

    playSound('powerup');
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));

    if (type === 'magnifier') {
      setShowHint(true);
    } else if (type === 'freeze') {
      setIsFrozen(true);
      setTimeout(() => setIsFrozen(false), 8000);
    } else if (type === 'call') {
      // Auto-investigate everything
      setInvestigated({ sender: true, url: true });
    }
  }, [powerUps, gameState, playSound]);

  const resetProgress = useCallback(() => {
    localStorage.clear();
    setScore(0);
    setHighScore(0);
    setTotalStats({ score: 0, scenarios: 0, rank: 'Курсант Академии' });
    setCurrentLevel(0);
    setHealth(3);
    setPowerUps({ magnifier: 3, freeze: 2, call: 1 });
    setGameState('START');
    setShowResetConfirm(false);
    window.location.reload();
  }, []);

  const nextLevel = useCallback(() => {
    playSound('click');
    if (health <= 0) {
      playSound('lose');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('cybershield_highscore', score.toString());
      }
      setGameState('END');
      return;
    }
    setGameState('EDUCATIONAL');
  }, [health, playSound, score, highScore]);

  const continueAfterEdu = useCallback(() => {
    playSound('click');
    updateStats(score, 1);
    setGameState('LOADING');

    setTimeout(() => {
      if (currentLevel < scenariosList.length - 1) {
        const nextIdx = currentLevel + 1;
        const nextScenario = scenariosList[nextIdx];
        if (nextScenario.isSpecialMission) {
          playSound('minigame');
        }
        setCurrentLevel(nextIdx);
        setTimeLeft(120);
        setShowHint(false);
        setInvestigated({ sender: false, url: false });
        setIsVoicePlaying(false);
        setVoiceAudioFailed(false); // Сбрасываем флаг ошибки
        setGameState('PLAYING');

        // Автозапуск голосовых только на десктопе — на мобильных пользователь нажмёт кнопку сам
        if (!isMobile && nextScenario.type === ScenarioType.VOICE && nextScenario.audioUrl) {
          playAudioFile(nextScenario.audioUrl);
        }
      } else {
        playSound('win');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('cybershield_highscore', score.toString());
        }
        setGameState('END');
      }
    }, 1500);
  }, [currentLevel, playSound, score, highScore, updateStats, playAudioFile, scenariosList, userInteracted, isNewGamePlus, isMobile]);

  // Ручной запуск голосового сообщения (для мобильных если не запустилось автоматически)
  const handlePlayVoiceAudio = useCallback(() => {
    setUserInteracted(true);
    if (scenario.type === ScenarioType.VOICE && scenario.audioUrl) {
      setVoiceAudioFailed(false);
      playAudioFile(scenario.audioUrl);
    }
  }, [scenario.type, scenario.audioUrl, playAudioFile]);

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleExitToHome = () => {
    playSound('click');
    setGameState('START');
    setShowExitConfirm(false);
  };

  useEffect(() => {
    // --- НАСТРОЙКИ ФОНОВОЙ МУЗЫКИ ---
    const MUSIC_URL = 'audio/bg_music.mp3'; // Путь к файлу
    const MUSIC_VOLUME = 0.02; // Громкость (от 0.0 до 1.0). 0.15 = 15% громкости.
    // --------------------------------

    // На мобильных аудио не запустится без взаимодействия пользователя
    if (isSoundEnabled && userInteracted) {
      const checkAndPlay = async () => {
        try {
          // Check if file exists before playing to avoid console errors
          const response = await fetch(MUSIC_URL, { method: 'HEAD' });
          if (!response.ok) return;

          if (!bgMusicRef.current) {
            bgMusicRef.current = new Audio(MUSIC_URL);
            bgMusicRef.current.loop = true;
            bgMusicRef.current.volume = MUSIC_VOLUME;
          }

          // Пытаемся запустить сразу или возобновить если пауза
          if (bgMusicRef.current.paused) {
            await bgMusicRef.current.play();
            // Background music started/resumed
          }
        } catch (e) {
          // Если не получилось - вешаем обработчики на все клики
          const enableAudio = () => {
            bgMusicRef.current?.play().catch(() => {});
            window.removeEventListener('click', enableAudio);
            window.removeEventListener('touchstart', enableAudio);
            window.removeEventListener('keydown', enableAudio);
          };
          window.addEventListener('click', enableAudio);
          window.addEventListener('touchstart', enableAudio);
          window.addEventListener('keydown', enableAudio);
        }
      };

      checkAndPlay();
    } else if (!isSoundEnabled) {
      bgMusicRef.current?.pause();
    }

    return () => {
      bgMusicRef.current?.pause();
    };
  }, [isSoundEnabled, userInteracted]);

  // Отдельный эффект для возобновления музыки после голосового сообщения
  useEffect(() => {
    if (!isVoicePlaying && isSoundEnabled && userInteracted && bgMusicRef.current) {
      // Небольшая задержка чтобы избежать конфликта с audio.onended
      const timer = setTimeout(() => {
        if (bgMusicRef.current && bgMusicRef.current.paused) {
          bgMusicRef.current.play().then(() => {
            // Background music auto-resumed after voice
          }).catch((err) => {
            // Failed to auto-resume background music
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVoicePlaying, isSoundEnabled, userInteracted]);

  useEffect(() => {
    // Голосовые сообщения для сценариев VOICE запускаем только в PLAYING
    // (основной запуск происходит в continueAfterEdu)
    // Здесь только останавливаем аудио при выходе из PLAYING
    if (gameState !== 'PLAYING' && gameState !== 'STORY') {
      stopAudio();
    }

    return () => stopAudio();
  }, [gameState, stopAudio]);

  useEffect(() => {
    if (gameState !== 'PLAYING' || isFrozen || isVoicePlaying) return;

    if (timeLeft <= 0) {
      handleChoice(!scenario.isPhishing);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, scenario, handleChoice, isFrozen, isVoicePlaying]);

  const GLOSSARY_DATA = [
    { term: "Фишинг", def: "Поддельные сайты или письма, крадущие пароли." },
    { term: "Смишинг", def: "Фишинг через СМС-сообщения." },
    { term: "Вишинг", def: "Мошенничество через телефонные звонки или голос." },
    { term: "Квишинг", def: "Фишинг через поддельные QR-коды." },
    { term: "Дроп", def: "Человек, которого используют для вывода краденых денег." },
    { term: "2FA", def: "Двухфакторная аутентификация (пароль + код из СМС)." },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center">
      <div className="scanline" />
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${rank.bg.replace('/10', '/20')} blur-[150px] rounded-full transition-colors duration-1000`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${rank.bg.replace('/10', '/20')} blur-[150px] rounded-full transition-colors duration-1000`} />
      </div>

      <main className="w-full max-w-[1920px] h-full flex flex-col z-10 py-1 md:py-4 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {gameState === 'START' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-6 p-2 md:p-4 lg:p-6 overflow-hidden"
            >
              <div className="relative inline-block shrink-0 scale-50 md:scale-75 lg:scale-90">
                <button
                  onClick={() => {
                    setUserInteracted(true); // Разблокируем аудио для мобильных
                    setIsSoundEnabled(!isSoundEnabled);
                    // Пытаемся сразу запустить музыку если включаем звук
                    if (!isSoundEnabled && bgMusicRef.current) {
                      bgMusicRef.current.play().catch(() => {});
                    }
                  }}
                  onTouchStart={() => {
                    setUserInteracted(true);
                    setIsSoundEnabled(!isSoundEnabled);
                    if (!isSoundEnabled && bgMusicRef.current) {
                      bgMusicRef.current.play().catch(() => {});
                    }
                  }}
                  className="absolute -top-12 -left-12 p-3 md:p-4 bg-zinc-900/80 hover:bg-zinc-800 rounded-full border border-white/10 text-zinc-400 transition-all z-20 shadow-xl backdrop-blur-md focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                  aria-label={isSoundEnabled ? "Выключить звук" : "Включить звук"}
                >
                  {isSoundEnabled ? <Volume2 className="w-5 h-5 md:w-8 md:h-8" aria-label="Звук включен" /> : <VolumeX className="w-5 h-5 md:w-8 md:h-8" aria-label="Звук выключен" />}
                </button>
                <motion.div 
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(168,85,247,0.2)", "0 0 60px rgba(168,85,247,0.4)", "0 0 20px rgba(168,85,247,0.2)"] 
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="p-4 md:p-8 lg:p-10 bg-purple-500/10 rounded-[2rem] md:rounded-[2.5rem] border border-purple-500/30 backdrop-blur-xl"
                >
                  <Shield className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 text-purple-500" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 bg-purple-500 p-1.5 md:p-2.5 lg:p-3 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)]"
                >
                  <Zap className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6 text-black" />
                </motion.div>
              </div>
              
              <div className="space-y-2 md:space-y-3 text-center shrink-0">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase italic terminal-glow leading-[0.85] select-none">
                  КиберЩит<br/><span className="text-purple-500">Детектив</span>
                </h1>
                <div className="flex items-center justify-center gap-2 md:gap-4 text-zinc-500 font-mono text-[8px] md:text-sm lg:text-base tracking-[0.3em] uppercase">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-pulse" />
                  Система активна // РБ 2026
                </div>
                {highScore > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-500 font-mono text-[9px] md:text-base lg:text-lg font-bold mt-1 md:mt-2 bg-yellow-500/10 py-1 px-4 md:py-1.5 md:px-6 rounded-full border border-yellow-500/20 inline-block"
                  >
                    🏆 Рекорд: {highScore}
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 md:gap-3 w-full max-w-xs md:max-w-lg lg:max-w-xl mx-auto shrink-0">
                <button 
                  onClick={handleStart}
                  onTouchStart={handleStart}
                  className="group relative overflow-hidden px-6 py-4 md:py-5 lg:py-6 bg-purple-500 text-black font-black text-base md:text-2xl lg:text-3xl uppercase tracking-tighter hover:bg-purple-400 transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-4 rounded-xl md:rounded-[1.5rem] lg:rounded-2xl shadow-[0_20px_50px_rgba(168,85,247,0.3)] focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                  aria-label="Начать игру"
                >
                  Начать службу
                  <ArrowRight className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" aria-label="Стрелка вправо" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </button>
                <div className="flex justify-center gap-2 md:gap-3 lg:gap-4">
                  <button 
                    onClick={() => { playSound('click'); setGameState('PROFILE'); }}
                    onTouchStart={() => { playSound('click'); setGameState('PROFILE'); }}
                    className="flex-1 px-3 py-3 md:py-4 lg:py-5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[10px] md:text-lg lg:text-xl uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 md:gap-3 rounded-xl md:rounded-[1.5rem] lg:rounded-2xl focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    aria-label="Открыть профиль"
                  >
                    <User className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" aria-label="Иконка пользователя" />
                    Профиль
                  </button>
                  <button 
                    onClick={() => { playSound('click'); setGameState('GLOSSARY'); }}
                    onTouchStart={() => { playSound('click'); setGameState('GLOSSARY'); }}
                    className="flex-1 px-3 py-3 md:py-4 lg:py-5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[10px] md:text-lg lg:text-xl uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 md:gap-3 rounded-xl md:rounded-[1.5rem] lg:rounded-2xl focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    aria-label="Открыть словарь"
                  >
                    <Search className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" aria-label="Иконка поиска" />
                    Словарь
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'STORY' && (
            <motion.div 
              key="story"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 w-full max-w-2xl mx-auto h-full overflow-hidden"
            >
              <div className="bg-zinc-900/90 border border-zinc-800 p-4 md:p-8 rounded-[2rem] shadow-2xl space-y-4 md:space-y-6 w-full max-h-full flex flex-col overflow-hidden">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="p-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-blue-500 font-black text-[8px] md:text-xs uppercase tracking-widest">Входящий приказ</div>
                    <div className="text-white font-black text-base md:text-xl uppercase tracking-tight">ИИ-Помощник «ЩИТ»</div>
                  </div>
                </div>

                <div className="h-px bg-zinc-800 w-full shrink-0" />

                <div className="space-y-3 md:space-y-4 overflow-hidden flex-1 min-h-0">
                  <p className="text-zinc-500 font-mono text-[8px] md:text-xs uppercase tracking-widest shrink-0">_ ИНИЦИАЛИЗАЦИЯ КУРСАНТА...</p>
                  <div className="space-y-2 md:space-y-4 overflow-hidden">
                    <p className="text-zinc-300 text-xs md:text-lg leading-relaxed font-medium">
                      Добро пожаловать в Управление «К». В 2026 году киберпреступность стала главной угрозой в Беларуси. Мошенники используют ИИ, дипфейки и поддельные сервисы.
                    </p>
                    <p className="text-zinc-300 text-xs md:text-lg leading-relaxed font-medium">
                      Твоя задача: фильтровать поток данных. У тебя есть 3 единицы «Цифрового иммунитета». Каждая ошибка — это утечка данных граждан.
                    </p>
                  </div>
                  <p className="text-purple-500 font-mono text-[8px] md:text-xs uppercase tracking-widest shrink-0">_ ГОТОВ К ЗАДАНИЮ?</p>
                </div>

                <button 
                  onClick={() => {
                    startInvestigation(true);
                  }}
                  onTouchStart={() => {
                    startInvestigation(true);
                  }}
                  className="w-full py-3 md:py-5 bg-white text-black font-black text-base md:text-xl uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-2xl shadow-xl active:scale-95 shrink-0 focus:ring-2 focus:ring-white min-h-[44px]"
                  aria-label="Приступить к работе"
                >
                  Приступить к работе
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'PLAYING' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col md:flex-row h-full w-full gap-2 md:gap-6 lg:gap-10 p-1 md:p-4 lg:p-8 overflow-hidden relative"
            >
              {/* Desktop Left Column: Stats & Rank */}
              <div className="hidden md:flex flex-col w-56 lg:w-72 xl:w-96 shrink-0 space-y-3 lg:space-y-6">
                  <div id="stats-card" className="bg-zinc-900/60 border border-zinc-800/50 p-4 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-xl space-y-3 lg:space-y-6 shadow-2xl relative">
                    <div className="flex items-center gap-3 lg:gap-5">
                      <div className={`p-2 lg:p-4 rounded-2xl ${rank.bg} border border-white/5`}>
                        <User className={`w-5 h-5 lg:w-8 lg:h-8 ${rank.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[7px] lg:text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-0.5">Текущий статус</div>
                        <div className={`text-[10px] lg:text-lg xl:text-xl font-black uppercase tracking-tight leading-none ${rank.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]`}>{rank.title}</div>
                      </div>
                      <button
                        onClick={() => {
                          setUserInteracted(true);
                          setIsSoundEnabled(!isSoundEnabled);
                          if (!isSoundEnabled && bgMusicRef.current) {
                            bgMusicRef.current.play().catch(() => {});
                          }
                        }}
                        onTouchStart={() => {
                          setUserInteracted(true);
                          setIsSoundEnabled(!isSoundEnabled);
                          if (!isSoundEnabled && bgMusicRef.current) {
                            bgMusicRef.current.play().catch(() => {});
                          }
                        }}
                        className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-full border border-white/10 text-zinc-400 transition-all shadow-lg backdrop-blur-md shrink-0 focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                        aria-label={isSoundEnabled ? "Выключить звук" : "Включить звук"}
                      >
                        {isSoundEnabled ? <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" aria-label="Звук включен" /> : <><VolumeX className="w-4 h-4 lg:w-5 lg:h-5" aria-label="Звук выключен" /><span className="text-xs ml-1">Выкл</span></>}
                      </button>
                    </div>
                    <div className="space-y-2 lg:space-y-3">
                      <div className="flex justify-between text-[10px] lg:text-sm font-black uppercase tracking-widest">
                        <span className="text-zinc-500">Счет</span>
                        <span className="text-white">{score}</span>
                      </div>
                      <div className="h-3 lg:h-5 bg-zinc-800 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
                        <motion.div 
                          animate={{ width: `${Math.min(100, (score / 5000) * 100)}%` }}
                          className={`h-full ${rank.color.replace('text-', 'bg-')} shadow-[0_0_25px_rgba(255,255,255,0.6)] relative`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                <div className="bg-zinc-900/60 border border-zinc-800/50 p-4 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-xl flex-1 min-h-0 overflow-hidden flex flex-col shadow-2xl">
                  <h4 className="text-[8px] lg:text-sm font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 lg:gap-3 mb-3 lg:mb-6 shrink-0">
                    <Shield className="w-3 h-3 lg:w-5 lg:h-5 text-purple-500" />
                    История операций
                  </h4>
                  <div className="flex-1 overflow-hidden space-y-2 lg:space-y-3 pr-2">
                    {evidence.slice(-5).map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="p-2 lg:p-3 bg-zinc-950/80 rounded-xl lg:rounded-2xl border border-zinc-800/50 text-[8px] lg:text-xs text-zinc-400 font-mono break-all leading-relaxed"
                      >
                        {item}
                      </motion.div>
                    ))}
                    {evidence.length === 0 && <p className="text-[8px] lg:text-xs text-zinc-600 italic font-mono">Нет собранных улик...</p>}
                  </div>
                </div>
              </div>

              {/* Mobile HUD (visible only on mobile) - MOVED TO TOP */}
                <div id="mobile-hud" className="md:hidden flex flex-col gap-2 shrink-0 w-full max-w-sm mx-auto">
                <div className="flex justify-between items-center bg-zinc-900/50 p-3 px-5 rounded-2xl border border-zinc-800/50 backdrop-blur-md">
                  <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <Heart key={i} className={`w-5 h-5 ${i < health ? 'text-red-500 fill-red-500' : 'text-zinc-800'}`} />
                    ))}
                  </div>
                  <div className={`text-xl font-black font-mono ${isFrozen ? 'text-blue-400' : 'text-purple-500'}`}>
                    {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowExitConfirm(true)}
                      onTouchStart={() => setShowExitConfirm(true)}
                      className="p-2.5 bg-red-500 rounded-full text-white shadow-lg backdrop-blur-md hover:bg-red-600 transition-all focus:ring-2 focus:ring-red-500 min-h-[44px]"
                      aria-label="Выход в меню"
                    >
                      <Home className="w-5 h-5" aria-label="Иконка дома" />
                    </button>
                    <button
                      onClick={() => {
                        setUserInteracted(true);
                        setIsSoundEnabled(!isSoundEnabled);
                        if (!isSoundEnabled && bgMusicRef.current) {
                          bgMusicRef.current.play().catch(() => {});
                        }
                      }}
                      onTouchStart={() => {
                        setUserInteracted(true);
                        setIsSoundEnabled(!isSoundEnabled);
                        if (!isSoundEnabled && bgMusicRef.current) {
                          bgMusicRef.current.play().catch(() => {});
                        }
                      }}
                      className="p-2.5 bg-zinc-800/80 rounded-full border border-white/10 text-zinc-400 shadow-lg backdrop-blur-md focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                      aria-label={isSoundEnabled ? "Выключить звук" : "Включить звук"}
                    >
                      {isSoundEnabled ? <Volume2 className="w-5 h-5" aria-label="Звук включен" /> : <><VolumeX className="w-5 h-5" aria-label="Звук выключен" /><span className="text-xs ml-1">Выкл</span></>}
                    </button>
                    <div className="text-right">
                      <div className="text-sm font-black text-white font-mono">
                        {score}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => usePowerUp('magnifier')}
                    onTouchStart={() => usePowerUp('magnifier')}
                    disabled={powerUps.magnifier === 0 || showHint || isVoicePlaying || scenario.type === ScenarioType.VOICE}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-400 disabled:opacity-30 focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    aria-label="Использовать лупу"
                  >
                    <Search className="w-5 h-5" aria-label="Иконка лупы" />
                  </button>
                  <button 
                    onClick={() => usePowerUp('freeze')}
                    onTouchStart={() => usePowerUp('freeze')}
                    disabled={powerUps.freeze === 0 || isFrozen || isVoicePlaying}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-cyan-400 disabled:opacity-30 focus:ring-2 focus:ring-cyan-500 min-h-[44px]"
                    aria-label="Использовать заморозку"
                  >
                    <Snowflake className="w-5 h-5" aria-label="Иконка снежинки" />
                  </button>
                  <button 
                    onClick={() => usePowerUp('call')}
                    onTouchStart={() => usePowerUp('call')}
                    disabled={powerUps.call === 0 || (investigated.sender && investigated.url) || isVoicePlaying}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-purple-400 disabled:opacity-30 focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    aria-label="Использовать звонок"
                  >
                    <Radio className="w-5 h-5" aria-label="Иконка радио" />
                  </button>
                  <button 
                    onClick={() => setShowFAQ(true)}
                    onTouchStart={() => setShowFAQ(true)}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 focus:ring-2 focus:ring-zinc-500 min-h-[44px]"
                    aria-label="Показать FAQ"
                  >
                    <HelpCircle className="w-5 h-5" aria-label="Иконка помощи" />
                  </button>
                </div>

                <div id="mobile-briefing" className={`p-2 lg:p-3 rounded-xl border text-[8px] lg:text-[11px] font-mono leading-tight overflow-hidden ${scenario.isSpecialMission ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
                  <p>{scenario.briefing}</p>
                </div>
              </div>

              {/* Center Column: Smartphone */}
              <div id="smartphone-card" className="flex-1 flex items-center justify-center min-h-0 relative py-1 md:py-2">
                <div className="relative h-full max-h-[min(90vh,850px)] aspect-[9/19] bg-zinc-950 rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] md:border-[12px] border-zinc-900 shadow-[0_0_100px_rgba(0,0,0,1),inset_0_0_40px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col ring-1 ring-white/5 group">
                  
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
                      <div className="flex-1 flex flex-col items-center justify-center space-y-3 md:space-y-6 overflow-hidden">
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
                        <div className="text-center space-y-1 shrink-0">
                          <h4 className="text-white font-black text-base md:text-xl tracking-tight">{scenario.sender}</h4>
                          <p className={`text-purple-500 text-[8px] md:text-sm font-black uppercase tracking-widest ${isVoicePlaying ? 'animate-pulse' : ''}`}>
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
                            onTouchStart={() => {
                              playSound('click');
                              handlePlayVoiceAudio();
                            }}
                            className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-black font-black text-sm md:text-base rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-2 transition-all active:scale-95 focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                            aria-label={voiceAudioFailed ? 'Повторить аудио' : 'Воспроизвести голос'}
                          >
                            <Volume2 className="w-5 h-5 md:w-6 md:h-6" aria-label="Иконка громкости" />
                            {voiceAudioFailed ? 'Повторить' : 'Воспроизвести голос'}
                          </motion.button>
                        )}

                        <div className="bg-zinc-900/90 p-3 md:p-4 rounded-2xl border border-zinc-800/50 text-center italic text-[8px] md:text-sm text-zinc-300 leading-relaxed shadow-xl overflow-hidden">
                          {isVoicePlaying ? "«Слушайте сообщение внимательно...»" : voiceAudioFailed ? "«Нажмите кнопку выше для воспроизведения»" : "«Ожидание ответа...»"}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-900/80 rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 border border-zinc-800/50 space-y-3 md:space-y-4 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col max-h-full">
                        <div className="flex items-center gap-2 md:gap-4 border-b border-zinc-800/50 pb-3 md:pb-4 shrink-0">
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-zinc-800/80 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                            {scenario.type === ScenarioType.EMAIL ? <Mail className="w-4 h-4 md:w-6 md:h-6 text-blue-400" /> : 
                             scenario.type === ScenarioType.SMS ? <MessageSquare className="w-4 h-4 md:w-6 md:h-6 text-purple-400" /> :
                             <Globe className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />}
                          </div>
                          <div className="overflow-hidden">
                            <div className={`text-[10px] md:text-lg font-black truncate tracking-tight ${investigated.sender ? 'text-red-400 underline decoration-red-500/50 underline-offset-4' : 'text-white'}`}>
                              {scenario.sender}
                            </div>
                            <div className="text-[6px] md:text-[10px] text-zinc-500 uppercase font-mono">Отправитель</div>
                          </div>
                        </div>
                        
                        <div className="text-[9px] md:text-base text-zinc-200 leading-relaxed break-words font-medium overflow-hidden">
                          {scenario.type === ScenarioType.WEBSITE ? (
                            <div className="space-y-2 md:space-y-4">
                              <div className="p-2 md:p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 text-[8px] md:text-sm font-mono break-all text-blue-400 leading-tight">
                                {scenario.content}
                              </div>
                              <div className="text-[6px] md:text-[10px] text-zinc-500 italic font-mono">Нажмите на ссылку для перехода...</div>
                            </div>
                          ) : scenario.type === ScenarioType.QR ? (
                            <div className="flex flex-col items-center gap-2 md:gap-4">
                              <div className="p-3 md:p-4 bg-white rounded-[1.5rem] shadow-2xl">
                                <QrCode className="w-20 h-20 md:w-32 md:h-32 text-black" />
                              </div>
                              <div className="text-[6px] md:text-[10px] text-zinc-500 italic font-mono">Отсканируйте код...</div>
                            </div>
                          ) : (
                            <div className="max-h-full overflow-hidden">
                              {scenario.content}
                            </div>
                          )}
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
                        <p className="text-[10px] md:text-lg text-purple-400 font-bold leading-tight">{scenario.hint}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Choice Buttons INSIDE Phone */}
                  <div id="choice-buttons" className="p-4 md:p-8 bg-zinc-900/95 border-t border-zinc-800/50 grid grid-cols-2 gap-3 md:gap-5 shrink-0 backdrop-blur-xl">
                    <button 
                      onClick={() => handleChoice(true)}
                      onTouchStart={() => handleChoice(true)}
                      className="flex flex-col items-center justify-center gap-1.5 md:gap-4 p-3 md:p-6 bg-red-500/10 border border-red-500/30 rounded-2xl md:rounded-[2rem] hover:bg-red-500/20 transition-all group active:scale-95 shadow-lg focus:ring-2 focus:ring-red-500 min-h-[44px]"
                      aria-label="Выбрать фейк"
                    >
                      <XCircle className="w-6 h-6 md:w-12 md:h-12 text-red-500 group-hover:scale-110 transition-transform" aria-label="Крестик" />
                      <span className="text-[9px] md:text-lg font-black text-red-500 uppercase tracking-widest">Фейк</span>
                    </button>
                    <button 
                      onClick={() => handleChoice(false)}
                      onTouchStart={() => handleChoice(false)}
                      className="flex flex-col items-center justify-center gap-1.5 md:gap-4 p-3 md:p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl md:rounded-[2rem] hover:bg-purple-500/20 transition-all group active:scale-95 shadow-lg focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                      aria-label="Выбрать ок"
                    >
                      <CheckCircle2 className="w-6 h-6 md:w-12 md:h-12 text-purple-500 group-hover:scale-110 transition-transform" aria-label="Галочка" />
                      <span className="text-[9px] md:text-lg font-black text-purple-500 uppercase tracking-widest">Ок</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Right Column: HUD, Power-ups, Briefing */}
              <div className="hidden md:flex flex-col w-56 lg:w-72 xl:w-96 shrink-0 space-y-3 lg:space-y-6">
                {/* HUD Card */}
                <div className="bg-zinc-900/60 border border-zinc-800/50 p-4 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-xl space-y-3 lg:space-y-6 shadow-2xl relative group/hud">
                  <button 
                    onClick={() => setShowExitConfirm(true)}
                    onTouchStart={() => setShowExitConfirm(true)}
                    className="absolute -top-3 -right-3 p-3 bg-red-500 text-white rounded-2xl transition-all hover:scale-110 shadow-xl z-10 focus:ring-2 focus:ring-red-500 min-h-[44px]"
                    aria-label="Выйти в главное меню"
                  >
                    <Home className="w-5 h-5 lg:w-6 lg:h-6" aria-label="Иконка дома" />
                  </button>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 lg:gap-2">
                      {[...Array(3)].map((_, i) => (
                        <Heart key={i} className={`w-4 h-4 lg:w-7 lg:h-7 ${i < health ? 'text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-zinc-800'}`} />
                      ))}
                    </div>
                    <div className={`text-xl lg:text-4xl font-black font-mono tracking-tighter ${isFrozen ? 'text-blue-400' : 'text-purple-500'}`}>
                      {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-zinc-800/50 pt-2 lg:pt-4">
                    <div className="text-[8px] lg:text-xs font-black text-zinc-500 uppercase tracking-widest">Комбо</div>
                    <div className="text-base lg:text-2xl font-black text-yellow-500 italic">x{combo}</div>
                  </div>
                </div>

                <div id="tools-card" className="bg-zinc-900/60 border border-zinc-800/50 p-4 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-xl space-y-2 lg:space-y-4 shadow-2xl">
                  <h4 className="text-[8px] lg:text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 lg:mb-4">Инструменты</h4>
                  <div className="grid grid-cols-1 gap-1.5 lg:gap-3">
                    <button 
                      onClick={() => usePowerUp('magnifier')}
                      onTouchStart={() => usePowerUp('magnifier')}
                      disabled={powerUps.magnifier === 0 || showHint || isVoicePlaying || scenario.type === ScenarioType.VOICE}
                      className={`flex items-center justify-between p-2 lg:p-5 rounded-xl lg:rounded-2xl border transition-all focus:ring-2 focus:ring-blue-500 min-h-[44px] ${powerUps.magnifier > 0 && !isVoicePlaying && !showHint && scenario.type !== ScenarioType.VOICE ? 'bg-zinc-950 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 shadow-lg' : 'bg-zinc-950/50 border-zinc-800 text-zinc-700 opacity-50'}`}
                      aria-label="Использовать анализ"
                    >
                      <div className="flex items-center gap-2 lg:gap-4">
                        <Search className="w-4 h-4 lg:w-7 lg:h-7" aria-label="Иконка поиска" />
                        <span className="text-[8px] lg:text-base font-black uppercase tracking-tight">Анализ</span>
                      </div>
                      <span className="text-sm lg:text-xl font-black font-mono">{powerUps.magnifier}</span>
                    </button>
                    <button 
                      onClick={() => usePowerUp('freeze')}
                      onTouchStart={() => usePowerUp('freeze')}
                      disabled={powerUps.freeze === 0 || isFrozen || isVoicePlaying}
                      className={`flex items-center justify-between p-2 lg:p-5 rounded-xl lg:rounded-2xl border transition-all focus:ring-2 focus:ring-cyan-500 min-h-[44px] ${powerUps.freeze > 0 && !isVoicePlaying && !isFrozen ? 'bg-zinc-950 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 shadow-lg' : 'bg-zinc-950/50 border-zinc-800 text-zinc-700 opacity-50'}`}
                      aria-label="Использовать заморозку"
                    >
                      <div className="flex items-center gap-2 lg:gap-4">
                        <Snowflake className="w-4 h-4 lg:w-7 lg:h-7" aria-label="Иконка снежинки" />
                        <span className="text-[8px] lg:text-base font-black uppercase tracking-tight">Заморозка</span>
                      </div>
                      <span className="text-sm lg:text-xl font-black font-mono">{powerUps.freeze}</span>
                    </button>
                    <button 
                      onClick={() => usePowerUp('call')}
                      onTouchStart={() => usePowerUp('call')}
                      disabled={powerUps.call === 0 || (investigated.sender && investigated.url) || isVoicePlaying}
                      className={`flex items-center justify-between p-2 lg:p-5 rounded-xl lg:rounded-2xl border transition-all focus:ring-2 focus:ring-purple-500 min-h-[44px] ${powerUps.call > 0 && !isVoicePlaying && !(investigated.sender && investigated.url) ? 'bg-zinc-950 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 shadow-lg' : 'bg-zinc-950/50 border-zinc-800 text-zinc-700 opacity-50'}`}
                      aria-label="Использовать связь"
                    >
                      <div className="flex items-center gap-2 lg:gap-4">
                        <Radio className="w-4 h-4 lg:w-7 lg:h-7" aria-label="Иконка радио" />
                        <span className="text-[8px] lg:text-base font-black uppercase tracking-tight">Связь</span>
                      </div>
                      <span className="text-sm lg:text-xl font-black font-mono">{powerUps.call}</span>
                    </button>
                  </div>
                </div>

                {/* Briefing Card */}
                <div id="briefing-card" className={`p-4 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] border text-[7px] lg:text-[14px] font-mono leading-relaxed flex-1 min-h-0 overflow-hidden shadow-2xl ${scenario.isSpecialMission ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse' : 'bg-zinc-900/60 border-zinc-800/50 text-zinc-400'}`}>
                  <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-3 shrink-0">
                    <ShieldAlert className="w-3 h-3 lg:w-5 lg:h-5" aria-label="Иконка предупреждения" />
                    <span className="font-black uppercase tracking-[0.2em] text-[7px] lg:text-[11px]">Брифинг</span>
                  </div>
                  <div className="flex-1">
                    {scenario.briefing}
                  </div>
                </div>

                <button 
                  onClick={() => setShowFAQ(true)}
                  onTouchStart={() => setShowFAQ(true)}
                  className="w-full py-2 lg:py-4 bg-zinc-900/80 border border-zinc-800/50 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all rounded-[1.2rem] lg:rounded-[1.5rem] flex items-center justify-center gap-2 lg:gap-3 shadow-xl focus:ring-2 focus:ring-zinc-500 min-h-[44px]"
                  aria-label="Показать помощь"
                >
                  <HelpCircle className="w-4 h-4 lg:w-6 lg:h-6" aria-label="Иконка помощи" />
                  <span className="text-[8px] lg:text-sm font-black uppercase tracking-widest">Помощь</span>
                </button>
              </div>

            {/* Tutorial Overlay */}
            {isTutorialActive && (
              <div className={`absolute inset-0 z-[200] pointer-events-none flex p-4 transition-all duration-500 ${
                tutorialStep === 0 ? 'justify-center items-end pb-20 md:items-center md:pb-0 md:justify-start md:pl-[30%]' :
                tutorialStep === 1 ? 'justify-center items-center md:justify-end md:pr-[5%]' :
                tutorialStep === 2 ? 'justify-center items-center md:justify-start md:pl-[5%]' :
                tutorialStep === 3 ? 'justify-center items-end md:justify-start md:pl-[5%] md:pb-[15%]' :
                'justify-center items-start pt-20 md:pt-[10%]'
              }`}>
                <motion.div 
                  key={tutorialStep}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-zinc-900 border-2 border-purple-500 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] max-w-[90%] md:max-w-sm w-full shadow-[0_0_50px_rgba(168,85,247,0.6)] space-y-3 md:space-y-4 relative pointer-events-auto z-[210]"
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
                      playSound('click');
                      if (tutorialStep < 4) {
                        setTutorialStep(tutorialStep + 1);
                      } else {
                        setIsTutorialActive(false);
                      }
                    }}
                    onTouchStart={() => {
                      playSound('click');
                      if (tutorialStep < 4) {
                        setTutorialStep(tutorialStep + 1);
                      } else {
                        setIsTutorialActive(false);
                      }
                    }}
                    className="w-full py-3 bg-purple-500 text-black font-black text-base uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all active:scale-95 shadow-lg focus:ring-2 focus:ring-purple-500 min-h-[44px]"
                    aria-label={tutorialStep < 4 ? 'Понял' : 'Начать работу'}
                  >
                    {tutorialStep < 4 ? 'Понял' : 'Начать работу'}
                  </button>
                </motion.div>

                {/* Highlight Effect */}
                <style dangerouslySetInnerHTML={{ __html: `
                  #${['stats-card', 'smartphone-card', 'tools-card', 'briefing-card', 'choice-buttons'][tutorialStep]} {
                    position: relative;
                    z-index: 150;
                    box-shadow: 0 0 0 9999px rgba(0,0,0,0.85), 0 0 60px rgba(168,85,247,0.8) !important;
                    pointer-events: none;
                    outline: 4px solid #a855f7;
                    outline-offset: 4px;
                    border-radius: 2rem;
                  }
                  @media (max-width: 768px) {
                    #${['mobile-hud', 'smartphone-card', 'mobile-hud', 'mobile-briefing', 'choice-buttons'][tutorialStep]} {
                      position: relative;
                      z-index: 150;
                      box-shadow: 0 0 0 9999px rgba(0,0,0,0.85), 0 0 60px rgba(168,85,247,0.8) !important;
                      pointer-events: none;
                      outline: 4px solid #a855f7;
                      outline-offset: 4px;
                    }
                  }
                `}} />
              </div>
            )}
          </motion.div>
        )}

          {gameState === 'MINIGAME' && miniGameData && (
            <motion.div 
              key="minigame"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/90 border-2 border-red-500/50 p-1.5 md:p-6 rounded-[1.2rem] md:rounded-[2.5rem] backdrop-blur-xl space-y-1 md:space-y-4 shadow-[0_0_60px_rgba(239,68,68,0.3)] w-[95%] max-w-xl mx-auto max-h-[90vh] overflow-y-auto flex flex-col relative"
            >
              <button 
                onClick={() => setShowExitConfirm(true)}
                className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg z-20 hover:bg-red-600 transition-all"
                title="Выйти в меню"
              >
                <Home className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <div className="text-center space-y-0.5 md:space-y-2">
                <div className="inline-flex p-1 md:p-3 bg-red-500/20 rounded-full">
                  <ShieldAlert className="w-4 h-4 md:w-10 md:h-10 text-red-500" />
                </div>
                <h2 className="text-base md:text-4xl font-black text-white uppercase tracking-tighter">
                  {miniGameData.type === 'PASSWORD' ? 'ВЗЛОМ СИСТЕМЫ!' : 'УТЕЧКА ДАННЫХ!'}
                </h2>
                <p className="text-zinc-400 text-[7px] md:text-lg font-mono bg-red-500/10 py-0.5 px-1.5 md:py-2 md:px-4 rounded-lg border border-red-500/20">
                  {miniGameData.type === 'PASSWORD' ? 'ОШИБКА! ВВЕДИТЕ КОД ВОССТАНОВЛЕНИЯ' : 'ОШИБКА! ОБОРВИТЕ СОЕДИНЕНИЕ (3 КЛИКА)'}
                </p>
              </div>

              {miniGameData.type === 'PASSWORD' ? (
                <div className="space-y-2 md:space-y-6">
                  <div className="text-center space-y-0.5 md:space-y-2 bg-zinc-950 p-1.5 md:p-4 rounded-xl md:rounded-2xl border border-zinc-800">
                    <div className="text-[6px] md:text-sm text-purple-500/70 uppercase font-black tracking-widest animate-pulse">ЗАПОМНИТЕ ЭТОТ КОД:</div>
                    <div className="text-xl md:text-6xl font-black text-purple-500 font-mono tracking-[0.4em] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                      {miniGameData.target}
                    </div>
                  </div>

                  <div className="flex justify-center gap-1 md:gap-3">
                    {miniGameData.target.split('').map((char, i) => (
                      <div key={i} className={`w-6 h-9 md:w-16 md:h-20 flex items-center justify-center text-sm md:text-4xl font-black rounded-lg md:rounded-xl border-2 transition-all ${String(miniGameData.progress).length > i ? 'bg-purple-500/20 border-purple-500 text-purple-500' : 'bg-zinc-950 border-zinc-800 text-zinc-700'}`}>
                        {String(miniGameData.progress)[i] || '?'}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1 md:gap-3">
                    {'ABCDEF123456'.split('').map(char => (
                      <button
                        key={char}
                        onClick={() => {
                          playSound('click');
                          const newProgress = String(miniGameData.progress) + char;
                          if (newProgress === miniGameData.target) {
                            handleMiniGameSuccess();
                          } else if (newProgress.length >= 4) {
                            handleMiniGameFailure();
                          } else {
                            setMiniGameData({ ...miniGameData, progress: newProgress });
                          }
                        }}
                        className="py-1 md:py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg md:rounded-xl border border-zinc-700 active:scale-95 text-[10px] md:text-xl"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 md:gap-10 py-2 md:py-12">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-20 h-20 md:w-56 md:h-56 border-4 border-dashed border-red-500 rounded-full"
                    />
                    <button
                      onClick={() => {
                        playSound('click');
                        const newProgress = (miniGameData.progress as number) + 1;
                        if (newProgress >= 3) {
                          handleMiniGameSuccess();
                        } else {
                          setMiniGameData({ ...miniGameData, progress: newProgress });
                        }
                      }}
                      className="absolute inset-0 m-auto w-12 h-12 md:w-32 md:h-32 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-90 transition-transform"
                    >
                      <Scissors className="w-6 h-6 md:w-16 md:h-16 text-black" />
                    </button>
                  </div>
                  <div className="flex gap-1.5 md:gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 md:w-6 md:h-6 rounded-full ${i < (miniGameData.progress as number) ? 'bg-purple-500' : 'bg-zinc-800'}`} />
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button 
                  onClick={handleMiniGameFailure}
                  className="text-[10px] md:text-base text-zinc-600 uppercase font-bold tracking-widest hover:text-zinc-400"
                >
                  [ Сдаться ]
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'FEEDBACK' && (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-8 text-center p-4 overflow-y-auto custom-scrollbar h-full w-full max-w-5xl mx-auto relative"
            >
              <button 
                onClick={() => setShowExitConfirm(true)}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-red-500 text-white rounded-2xl shadow-xl z-20 hover:bg-red-600 transition-all"
                title="Выйти в меню"
              >
                <Home className="w-5 h-5 md:w-8 md:h-8" />
              </button>
              <div className="flex justify-center shrink-0">
                <div className={`p-4 md:p-8 lg:p-10 rounded-full border-4 ${lastResult?.correct ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)]' : 'bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]'}`}>
                  {lastResult?.correct ? <CheckCircle2 className="w-12 h-12 md:w-24 md:h-24 lg:w-32 lg:h-32 text-purple-500" /> : <ShieldAlert className="w-12 h-12 md:w-24 md:h-24 lg:w-32 lg:h-32 text-red-500" />}
                </div>
              </div>
              <div className="space-y-3 md:space-y-5 max-w-4xl shrink-0">
                <h2 className={`text-2xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none ${lastResult?.correct ? 'text-purple-500' : 'text-red-500'}`}>
                  {lastResult?.message}
                </h2>
                <div className="bg-zinc-900/60 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-zinc-800/50 backdrop-blur-xl shadow-2xl">
                  <p className="text-zinc-200 text-xs md:text-xl lg:text-2xl leading-relaxed font-medium">
                    {scenario.explanation}
                  </p>
                </div>
              </div>
              <button 
                onClick={nextLevel}
                className="group inline-flex items-center gap-3 md:gap-6 px-8 md:px-12 py-3 md:py-6 bg-zinc-100 text-black font-black text-base md:text-2xl lg:text-3xl uppercase tracking-widest hover:bg-white transition-all active:scale-95 rounded-xl md:rounded-2xl shadow-2xl shrink-0"
              >
                Продолжить
                <ArrowRight className="w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}

          {gameState === 'EDUCATIONAL' && (
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
          )}

          {gameState === 'PROFILE' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center w-full min-h-0 p-4 overflow-hidden h-full"
            >
              <div className="bg-zinc-900/90 border border-zinc-800 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl space-y-4 md:space-y-6 shadow-2xl w-full max-w-2xl max-h-full overflow-hidden flex flex-col">
                <div className="flex items-center gap-4 md:gap-8 border-b border-zinc-800 pb-4 md:pb-6">
                  <div className="relative shrink-0">
                    <div className={`w-14 h-14 md:w-24 md:h-24 rounded-2xl border-2 flex items-center justify-center ${rank.bg}`}>
                      <User className={`w-7 h-7 md:w-12 md:h-12 ${rank.color}`} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 p-1 md:p-1.5 rounded-lg shadow-lg">
                      <Trophy className="w-3 h-3 md:w-6 md:h-6 text-black" />
                    </div>
                  </div>
                  <div className="space-y-0.5 md:space-y-1 min-w-0">
                    <h3 className="text-zinc-500 font-mono text-[6px] md:text-xs uppercase tracking-widest truncate">Личное дело №2026-РБ</h3>
                    <h2 className={`text-lg md:text-4xl font-black uppercase tracking-tighter truncate ${rank.color}`}>{rank.title}</h2>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-3 md:h-5 w-24 md:w-48 bg-zinc-800 rounded-full overflow-hidden border border-white/10 relative">
                        <div className={`h-full ${rank.color.replace('text-', 'bg-')} shadow-[0_0_15px_rgba(255,255,255,0.4)] relative`} style={{ width: `${(score % 500) / 5}%` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                        </div>
                      </div>
                      <span className="text-[6px] md:text-xs text-zinc-500 font-mono">ОПЫТ</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-3 md:p-4 rounded-xl md:rounded-2xl border border-zinc-800 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <h4 className="text-[8px] md:text-xs font-black text-zinc-500 uppercase tracking-widest">Развитие Академии</h4>
                    <span className="text-[8px] md:text-xs font-mono text-purple-500 uppercase">УРОВЕНЬ {Math.floor(totalStats.scenarios / 10) + 1}</span>
                  </div>
                  <div className="flex justify-center items-end gap-1 md:gap-1.5 h-12 md:h-20">
                    {[...Array(5)].map((_, i) => {
                      const isActive = i <= Math.floor(totalStats.scenarios / 10);
                      return (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: isActive ? `${(i + 1) * 20}%` : '10%' }}
                          className={`w-6 md:w-10 rounded-t-lg transition-colors duration-500 ${isActive ? 'bg-purple-500/40 border-t border-purple-500' : 'bg-zinc-900 border-t border-zinc-800'}`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[7px] md:text-xs text-zinc-500 text-center mt-1 md:mt-2 uppercase font-bold tracking-tighter">
                    {totalStats.scenarios < 10 ? 'Строительство фундамента...' : 
                     totalStats.scenarios < 20 ? 'Установка серверов...' :
                     totalStats.scenarios < 30 ? 'Формирование спецотряда...' :
                     'Академия полностью укомплектована!'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <div className="bg-zinc-950 p-2 md:p-3 rounded-xl border border-zinc-800 text-center">
                    <div className="text-[7px] md:text-xs text-zinc-500 uppercase font-bold">Очки</div>
                    <div className="text-base md:text-3xl font-black text-white font-mono">{totalStats.score}</div>
                  </div>
                  <div className="bg-zinc-950 p-2 md:p-3 rounded-xl border border-zinc-800 text-center">
                    <div className="text-[7px] md:text-xs text-zinc-500 uppercase font-bold">Дела</div>
                    <div className="text-base md:text-3xl font-black text-white font-mono">{totalStats.scenarios}</div>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <h4 className="text-[8px] md:text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                    <Award className="w-3 h-3 md:w-6 md:h-6" />
                    Трофеи
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                    {getAchievements().map((ach, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 md:gap-1.5 p-1.5 md:p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div className="p-1 md:p-1.5 bg-yellow-500/10 rounded-full text-yellow-500">
                          {ach.icon}
                        </div>
                        <span className="text-[7px] md:text-[10px] text-zinc-400 text-center font-bold uppercase leading-tight">{ach.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 md:gap-3 pt-1 md:pt-2">
                  <button 
                    onClick={() => { playSound('click'); setGameState('START'); }}
                    className="w-full py-3 md:py-4 bg-zinc-800 text-white font-black uppercase tracking-widest hover:bg-zinc-700 transition-all rounded-xl text-xs md:text-lg"
                  >
                    Вернуться в штаб
                  </button>
                  <button 
                    onClick={() => { playSound('click'); setShowResetConfirm(true); }}
                    className="w-full py-1.5 text-red-500/50 hover:text-red-500 font-mono text-[8px] md:text-sm uppercase tracking-widest transition-all"
                  >
                    Сбросить прогресс
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reset Confirmation Modal moved outside */}

          {gameState === 'LOADING' && (
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
          )}

          {gameState === 'GLOSSARY' && (
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
                  onClick={() => { playSound('click'); setGameState('START'); }}
                  className="w-full py-3 bg-zinc-800 text-white font-black uppercase tracking-widest hover:bg-zinc-700 transition-all rounded-xl text-[10px] md:text-base"
                >
                  Вернуться в штаб
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'END' && (
            <motion.div 
              key="end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center space-y-2 text-center w-full p-1.5 md:p-4 overflow-hidden h-full"
            >
              <div className="bg-zinc-900/90 border border-zinc-800 p-1.5 md:p-8 rounded-[1.5rem] md:rounded-[3rem] backdrop-blur-2xl space-y-1 md:space-y-6 shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto flex flex-col items-center scrollbar-hide shrink-0">
                
                {/* Rank Badge Pill */}
                <div className="w-full max-w-md bg-zinc-950 border-2 border-white/10 rounded-xl md:rounded-full p-0.5 md:p-2.5 flex items-center gap-1.5 md:gap-4 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative overflow-hidden group shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />
                  <div className={`shrink-0 w-6 h-6 md:w-16 md:h-16 rounded-full border-2 ${rank.border || 'border-purple-500'} bg-zinc-900 flex items-center justify-center shadow-xl z-10 relative`}>
                    <Award className={`w-2.5 h-2.5 md:w-8 md:h-8 ${rank.color}`} />
                    <div className="absolute inset-0 rounded-full bg-current opacity-5 animate-pulse" />
                  </div>
                  <div className="flex-1 text-left z-10 py-0.5">
                    <div className="text-[5px] md:text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-0.5">Ваш итоговый статус</div>
                    <div className={`text-[9px] md:text-xl font-black uppercase tracking-tight leading-tight ${rank.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>{rank.title}</div>
                  </div>
                </div>

                <div className="space-y-0.5 md:space-y-2 shrink-0">
                  <h2 className="text-lg md:text-5xl font-black uppercase italic terminal-glow leading-none tracking-tighter text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                    {health > 0 ? 'Миссия Выполнена' : 'Связь Потеряна'}
                  </h2>
                  <div className="flex justify-center gap-4 md:gap-12 pt-0.5 md:pt-4">
                    <div className="text-center">
                      <div className="text-base md:text-4xl font-black text-white">{score}</div>
                      <div className="text-[6px] md:text-[10px] uppercase text-zinc-500 font-mono font-bold tracking-[0.15em]">Счет</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base md:text-4xl font-black text-white">{currentLevel + (health > 0 ? 1 : 0)}</div>
                      <div className="text-[6px] md:text-[10px] uppercase text-zinc-500 font-mono font-bold tracking-[0.15em]">Уровни</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-zinc-950/50 border border-zinc-800/50 p-2 md:p-6 rounded-[1rem] md:rounded-[2rem] max-w-xl w-full text-left space-y-1 md:space-y-4 shadow-inner">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-[8px] md:text-base uppercase text-purple-500 italic tracking-wider">Рапорт Управления «К»</h3>
                    <div className="text-[5px] md:text-[9px] text-zinc-600 font-mono opacity-50">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                  </div>
                  
                  <p className="text-zinc-400 text-[8px] md:text-base leading-relaxed font-medium">
                    {health > 0 
                      ? "Вы продемонстрировали выдающиеся навыки кибердетектива. Граждане Беларуси защищены."
                      : "Цифровой иммунитет сломлен. Мошенники оказались хитрее. Изучите ошибки и попробуйте снова."}
                  </p>

                  <div className="grid grid-cols-2 gap-2 py-1 md:py-4 border-y border-zinc-800/30">
                    <div className="space-y-0.5">
                      <div className="text-[5px] md:text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Точность</div>
                      <div className="text-[9px] md:text-xl font-black text-white font-mono">
                        {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[5px] md:text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Статус</div>
                      <div className={`text-[9px] md:text-xl font-black font-mono ${health > 0 ? 'text-purple-500' : 'text-red-500'}`}>
                        {health > 0 ? 'УСПЕХ' : 'ПРОВАЛ'}
                      </div>
                    </div>
                  </div>

                  {evidence.length > 0 && (
                    <div className="space-y-0.5">
                      <p className="text-[5px] md:text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Собранные улики</p>
                      <div className="flex flex-wrap gap-1">
                        {evidence.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex items-center gap-1 px-1 py-0.5 bg-zinc-900 rounded-full border border-zinc-800 text-[5px] md:text-10px text-zinc-300 font-bold shadow-sm">
                            <FileText className="w-1.5 h-1.5 text-blue-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1 w-full max-w-xs md:max-w-md">
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-2 md:py-4 bg-purple-500 text-black font-black uppercase tracking-[0.15em] hover:bg-purple-400 transition-all rounded-xl md:rounded-2xl text-[8px] md:text-base shadow-[0_10px_20px_rgba(168,85,247,0.3)] active:scale-95"
                  >
                    Новая смена
                  </button>
                  <button 
                    onClick={() => setGameState('START')}
                    className="w-full py-2 md:py-4 bg-zinc-900 text-white font-black uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all rounded-xl md:rounded-2xl border border-zinc-800 text-[8px] md:text-base active:scale-95"
                  >
                    В главное меню
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Modal - Moved outside main AnimatePresence to fix mode="wait" warning */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-zinc-900 border border-red-500/30 p-8 md:p-12 rounded-[2.5rem] w-full max-w-md space-y-8 text-center"
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
      </main>
        {/* FAQ Modal */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-900 border-2 border-red-500/50 p-8 rounded-[2.5rem] max-w-sm w-full text-center space-y-6 shadow-2xl"
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
                className="bg-zinc-900 border border-zinc-800 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl my-auto space-y-4 md:space-y-6 shadow-2xl relative max-h-full overflow-hidden flex flex-col"
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

                <div className="grid gap-3 md:gap-6 overflow-hidden flex-1 min-h-0">
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
                        { icon: Search, color: 'blue', title: 'Анализ', desc: 'Подсвечивает подозрительные детали.' },
                        { icon: Snowflake, color: 'cyan', title: 'Заморозка', desc: 'Останавливает время на 10 секунд.' },
                        { icon: Radio, color: 'purple', title: 'Связь', desc: 'ИИ «ЩИТ» даст прямую подсказку.' }
                      ].map((tool, i) => (
                        <div key={i} className={`flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-2 p-2 md:p-4 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-${tool.color}-500/30 transition-all group overflow-hidden`}>
                          <tool.icon className={`w-4 h-4 md:w-6 md:h-6 text-${tool.color}-400 group-hover:scale-110 transition-transform shrink-0`} />
                          <div>
                            <h4 className={`font-black text-${tool.color}-400 text-[8px] md:text-xs uppercase`}>{tool.title}</h4>
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

      <footer className="absolute bottom-6 left-0 right-0 text-center text-[8px] text-zinc-700 uppercase tracking-[0.5em] font-mono pointer-events-none">
        Защищенный протокол v2.0 // Министерство внутренних дел // Республика Беларусь
      </footer>
    </div>
  );
}
