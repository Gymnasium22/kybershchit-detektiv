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
  HelpCircle, 
  ArrowRight, 
  Mail,
  MessageSquare,
  Globe,
  User,
  CheckCircle2,
  XCircle,
  Search,
  Snowflake,
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
  Home,
  Gift
} from 'lucide-react';
import { DialogChoice, DialogNode, NEW_SCENARIOS, SCENARIOS, ScenarioType, GameState, DialogMessage } from './types';
import { GlossaryScreen } from './components/screens/GlossaryScreen';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { EndScreen } from './components/screens/EndScreen';
import { EducationalScreen } from './components/screens/EducationalScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';
import { MinigameScreen } from './components/screens/MinigameScreen';
import { StartScreen } from './components/screens/StartScreen';
import { StoryScreen } from './components/screens/StoryScreen';
import { PlayingScreen } from './components/screens/PlayingScreen';
import { ResetConfirmModal } from './components/modals/ResetConfirmModal';
import { ExitConfirmModal } from './components/modals/ExitConfirmModal';
import { FAQModal } from './components/modals/FAQModal';
import { PrizeConfirmModal } from './components/modals/PrizeConfirmModal';

export default function App() {
  return (
    <GameContent />
  );
}

function GameContent() {
  const onPointerAction = useCallback((action: () => void) => (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    e.preventDefault();
    action();
  }, []);

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
    if (!saved) return 0;
    const parsed = Number.parseInt(saved, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  const [totalStats, setTotalStats] = useState(() => {
    const saved = localStorage.getItem('cybershield_stats');
    if (!saved) return { scenarios: 0, score: 0, rank: 'Курсант' };
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed?.scenarios !== 'number' || typeof parsed?.score !== 'number') {
        return { scenarios: 0, score: 0, rank: 'Курсант' };
      }
      return parsed;
    } catch {
      return { scenarios: 0, score: 0, rank: 'Курсант' };
    }
  });

  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [voiceAudioFailed, setVoiceAudioFailed] = useState(false);
  const [isNewGamePlus, setIsNewGamePlus] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDialogNodeId, setCurrentDialogNodeId] = useState('start');
  const [dialogHistory, setDialogHistory] = useState<string[]>([]);
  const [userResponses, setUserResponses] = useState<{nodeId: string; text: string}[]>([]);
  const [dialogScore, setDialogScore] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioHandlersRef = React.useRef<{ onended?: ((this: HTMLAudioElement, ev: Event) => void) | null; onerror?: ((this: HTMLAudioElement, ev: Event) => void) | null }>({});
  const bgMusicRef = React.useRef<HTMLAudioElement | null>(null);
  const bgMusicResumeListenersRef = React.useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const scenariosList = isNewGamePlus ? NEW_SCENARIOS : SCENARIOS;
  const scenario = scenariosList[currentLevel];

  const getRank = useCallback(() => {
    const totalScore = totalStats.score + score;
    if (totalScore >= 5000) return { title: 'Генерал Кибервойск', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500' };
    if (totalScore >= 3000) return { title: 'Полковник «К»', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500' };
    if (totalScore >= 1500) return { title: 'Майор Безопасности', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500' };
    if (totalScore >= 500) return { title: 'Лейтенант ГУПК', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500' };
    return { title: 'Курсант Академии', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500' };
  }, [score, totalStats.score]);

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
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      let soundDurationSec = 0.1;

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        soundDurationSec = 0.1;
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
        soundDurationSec = 0.5;
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        soundDurationSec = 0.2;
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        soundDurationSec = 0.05;
      } else if (type === 'powerup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        soundDurationSec = 0.3;
      } else if (type === 'minigame') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        soundDurationSec = 0.5;
      } else if (type === 'win') {
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
        soundDurationSec = 0.5;
      } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        soundDurationSec = 0.5;
      }

      window.setTimeout(() => {
        ctx.close().catch(() => {});
      }, Math.ceil(soundDurationSec * 1000) + 200);
    } catch {
    }
  }, [isSoundEnabled]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioHandlersRef.current.onended) {
        audioRef.current.removeEventListener('ended', audioHandlersRef.current.onended);
      }
      if (audioHandlersRef.current.onerror) {
        audioRef.current.removeEventListener('error', audioHandlersRef.current.onerror);
      }
      audioHandlersRef.current = {};
    }
    setIsVoicePlaying(false);
  }, []);

  const playAudioFile = useCallback(async (url: string, onEnd?: () => void) => {
    if (!isSoundEnabled) {
      setVoiceAudioFailed(true);
      return;
    }

    stopAudio();

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      const audio = audioRef.current;
      
      if (audioHandlersRef.current.onended) {
        audio.removeEventListener('ended', audioHandlersRef.current.onended);
      }
      if (audioHandlersRef.current.onerror) {
        audio.removeEventListener('error', audioHandlersRef.current.onerror);
      }
      audioHandlersRef.current = {};
      
      audio.currentTime = 0;
      audio.src = url;
      audio.currentTime = 0;
      audio.volume = 1.0;
      
      setIsVoicePlaying(true);

      let bgMusicWasPlaying = false;
      if (bgMusicRef.current && !bgMusicRef.current.paused) {
        bgMusicWasPlaying = true;
        bgMusicRef.current.pause();
      }
      
      await new Promise<void>((resolve, reject) => {
        let resolved = false;
        const canPlay = () => {
          if (!resolved) {
            resolved = true;
            audio.removeEventListener('canplaythrough', canPlay);
            audio.removeEventListener('error', errorHandler);
            resolve();
          }
        };
        const errorHandler = (e: Event) => {
          if (!resolved) {
            resolved = true;
            audio.removeEventListener('canplaythrough', canPlay);
            audio.removeEventListener('error', errorHandler);
            reject(e);
          }
        };
        audio.addEventListener('canplaythrough', canPlay, { once: true });
        audio.addEventListener('error', errorHandler, { once: true });
        audio.load();
      });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      const onended = () => {
        setIsVoicePlaying(false);
        setVoiceAudioFailed(false);
        if (isSoundEnabled && bgMusicRef.current && bgMusicWasPlaying) {
          bgMusicRef.current.play().catch(() => {});
        }
        if (onEnd) onEnd();
      };

      const onerror = () => {
        setIsVoicePlaying(false);
        setVoiceAudioFailed(true);
        if (isSoundEnabled && bgMusicRef.current && bgMusicWasPlaying) {
          bgMusicRef.current.play().catch(() => {});
        }
      };

      audio.addEventListener('ended', onended);
      audio.addEventListener('error', onerror);
      
      audioHandlersRef.current = { onended, onerror };
    } catch {
      setIsVoicePlaying(false);
      setVoiceAudioFailed(true);

      const enableAudio = () => {
        playAudioFile(url, onEnd).catch(() => {});
        window.removeEventListener('click', enableAudio);
        window.removeEventListener('touchstart', enableAudio);
        window.removeEventListener('keydown', enableAudio);
      };
      window.addEventListener('click', enableAudio, { once: true });
      window.addEventListener('touchstart', enableAudio, { once: true });
      window.addEventListener('keydown', enableAudio, { once: true });
    }
  }, [stopAudio, isSoundEnabled]);

  const handleStart = useCallback(() => {
    playSound('click');
    setUserInteracted(true);
    
    const dummyAudio = new Audio();
    dummyAudio.play().then(() => {
      dummyAudio.pause();
    }).catch(() => {});
    
    setGameState('STORY');
    playAudioFile('audio/briefing.mp3');
  }, [playSound, playAudioFile]);

  const startInvestigation = useCallback((withTutorial = false) => {
    playSound('click');
    stopAudio();
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
    setCurrentDialogNodeId('start');
    setDialogHistory(['start']);
    setUserResponses([]);
    setDialogScore(0);
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

  const [showPointsAnimation, setShowPointsAnimation] = useState<number | null>(null);

  const handleChoice = useCallback((isPhishing: boolean) => {
    if (gameState !== 'PLAYING') return;
    
    stopAudio();
    
    const correct = isPhishing === scenario.isPhishing;
    setStats(prev => ({ ...prev, total: prev.total + 1, correct: prev.correct + (correct ? 1 : 0) }));
    setShowHint(false);
    if (correct) {
      playSound('correct');
      const points = (100 + Math.floor(timeLeft * 5)) * combo;
      setShowPointsAnimation(points);
      setTimeout(() => setShowPointsAnimation(null), 1500);
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

  const [dialogClueRevealed, setDialogClueRevealed] = useState<string | null>(null);
  const [dialogWarningShown, setDialogWarningShown] = useState<string | null>(null);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);

  const handleDialogChoice = useCallback((choiceId: string) => {
    if (gameState !== 'PLAYING' || !scenario.dialogTree) return;

    const currentNode = scenario.dialogTree.find((node: DialogNode) => node.id === currentDialogNodeId);
    if (!currentNode || !currentNode.choices) return;

    const choice = currentNode.choices.find((c: DialogChoice) => c.id === choiceId);
    if (!choice) return;

    playSound('click');

    // Показать визуальную подсказку если выбор раскрывает улику
    if (choice.revealsClue) {
      setDialogClueRevealed(choice.id);
      setTimeout(() => setDialogClueRevealed(null), 2000);
    }
    
    // Показать предупреждение если выбор рискованный
    if (choice.isRisky) {
      setDialogWarningShown(choice.id);
      setTimeout(() => setDialogWarningShown(null), 2000);
      playSound('wrong');
    }

    // Накапливаем очки
    const newScore = (choice.points || 0);
    setDialogScore(prev => prev + newScore);

    // Переходим на следующий узел
    const nextNodeId = choice.nextNodeId;
    const nextNode = scenario.dialogTree.find((node: DialogNode) => node.id === nextNodeId);

    // Добавляем ответ пользователя
    setUserResponses(prev => [...prev, { nodeId: currentNode.id, text: choice.text }]);

    // Проверяем финальное состояние
    if (nextNode) {
      if (nextNode.isCorrect === true) {
        // Успешно выбран правильный путь
        setShowHint(false);
        const points = (100 + Math.floor(timeLeft * 5)) * combo;
        setScore(s => s + (points + dialogScore + newScore));
        setCombo(c => Math.min(c + 1, 5));
        setLastResult({ correct: true, message: "МАНИПУЛЯЦИЯ ВЫЯВЛЕНА" });
        setEvidence(prev => [...new Set([...prev, `Диалог: ${scenario.sender}`])]);
        setGameState('FEEDBACK');
      } else if (nextNode.isCorrect === false) {
        // Неправильный путь - штраф
        setCombo(1);
        startMiniGame(Math.random() > 0.5 ? 'PASSWORD' : 'CABLE');
      } else {
        // Промежуточный узел - продолжаем диалог
        const newHistory = [...dialogHistory];
        if (!newHistory.includes(currentNode.id)) {
          newHistory.push(currentNode.id);
        }
        newHistory.push(nextNodeId);
        setDialogHistory(newHistory);
        setCurrentDialogNodeId(nextNodeId);
      }
    }
  }, [gameState, scenario, currentDialogNodeId, timeLeft, combo, dialogScore, dialogHistory, playSound, startMiniGame]);

  const usePowerUp = useCallback((type: 'magnifier' | 'freeze' | 'call') => {
    if (powerUps[type] <= 0 || gameState !== 'PLAYING' || isVoicePlaying) return;
    
    // Don't consume if already active for this level
    if (type === 'magnifier' && showHint) return;
    if (type === 'call' && (investigated.sender && investigated.url)) return;
    if (type === 'freeze' && isFrozen) return;

    // Magnifier is useless in voice calls
    if (type === 'magnifier' && scenario.type === ScenarioType.VOICE) return;
    
    // Call power-up is useless in dialog mode
    if (type === 'call' && scenario.type === ScenarioType.DIALOG) return;

    playSound('powerup');
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    
    // Анимация активации
    setActivePowerUp(type);
    setTimeout(() => setActivePowerUp(null), 1000);

    if (type === 'magnifier') {
      setShowHint(true);
    } else if (type === 'freeze') {
      setIsFrozen(true);
      setTimeout(() => setIsFrozen(false), 8000);
    } else if (type === 'call') {
      // Auto-investigate everything for non-dialog types
      setInvestigated({ sender: true, url: true });
    }
  }, [powerUps, gameState, playSound, showHint, scenario.type, investigated.sender, investigated.url, isFrozen, isVoicePlaying]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem('cybershield_highscore');
    localStorage.removeItem('cybershield_stats');
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
        setCurrentDialogNodeId('start'); // Сбросить состояние диалога
        setDialogHistory(['start']); // Сбросить историю диалога
        setUserResponses([]); // Сбросить ответы пользователя
        setDialogScore(0); // Сбросить очки диалога
        setGameState('PLAYING');

        // Автозапуск голосовых только на десктопе — на мобильных пользователь нажмёт кнопку сам
        if (!isMobile && nextScenario.type === ScenarioType.VOICE && nextScenario.audioUrl) {
          playAudioFile(nextScenario.audioUrl);
        }
      } else {
        // Проверяем, завершены ли все сценарии основного уровня
        if (!isNewGamePlus && scenariosList === SCENARIOS) {
          // Переходим на уровень 2 (NEW_SCENARIOS)
          playSound('win');
          setGameState('END');
          // После этого пользователь нажмет кнопку в END экране
        } else {
          // Завершена вся игра (все уровни)
          playSound('win');
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('cybershield_highscore', score.toString());
          }
          setGameState('END');
        }
      }
    }, 1500);
  }, [currentLevel, playSound, score, highScore, updateStats, playAudioFile, scenariosList, isNewGamePlus, isMobile]);

  // Ручной запуск голосового сообщения (для мобильных если не запустилось автоматически)
  const handlePlayVoiceAudio = useCallback(() => {
    setUserInteracted(true);
    if (scenario.type === ScenarioType.VOICE && scenario.audioUrl) {
      setVoiceAudioFailed(false);
      playAudioFile(scenario.audioUrl);
    }
  }, [scenario.type, scenario.audioUrl, playAudioFile]);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showPrizeConfirm, setShowPrizeConfirm] = useState(false);
  const TELEGRAM_STICKERPACK_URL = 'https://t.me/addstickers/KibershchitDetektiv';

  const handleExitToHome = () => {
    playSound('click');
    setIsNewGamePlus(false);
    setGameState('START');
    setShowExitConfirm(false);
  };

  useEffect(() => {
    const MUSIC_URL = 'audio/bg_music.mp3';
    const MUSIC_VOLUME = 0.02;

    bgMusicResumeListenersRef.current?.();
    bgMusicResumeListenersRef.current = null;

    if (isSoundEnabled && userInteracted) {
      const checkAndPlay = async () => {
        try {
          if (!bgMusicRef.current) {
            bgMusicRef.current = new Audio(MUSIC_URL);
            bgMusicRef.current.loop = true;
            bgMusicRef.current.volume = MUSIC_VOLUME;
          }

          if (bgMusicRef.current.paused) {
            await bgMusicRef.current.play();
          }
        } catch {
          const enableAudio = () => {
            bgMusicRef.current?.play().catch(() => {});
            window.removeEventListener('click', enableAudio);
            window.removeEventListener('touchstart', enableAudio);
            window.removeEventListener('keydown', enableAudio);
            bgMusicResumeListenersRef.current = null;
          };
          bgMusicResumeListenersRef.current = () => {
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
      bgMusicResumeListenersRef.current?.();
      bgMusicResumeListenersRef.current = null;
    };
  }, [isSoundEnabled, userInteracted]);

  useEffect(() => {
    if (!isVoicePlaying && isSoundEnabled && userInteracted && bgMusicRef.current) {
      const timer = setTimeout(() => {
        if (bgMusicRef.current && bgMusicRef.current.paused) {
          bgMusicRef.current.play().catch(() => {});
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

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleChoice(!scenario.isPhishing);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, scenario, handleChoice, isFrozen, isVoicePlaying]);

  const GLOSSARY_DATA = [
    { term: "Фишинг", def: "Поддельные сайты или письма, крадущие пароли." },
    { term: "Смишинг", def: "Фишинг через СМС-сообщения." },
    { term: "Вишинг", def: "Мошенничество через телефонные звонки или голос." },
    { term: "Квишинг", def: "Фишинг через поддельные QR-коды." },
    { term: "Дроп", def: "Человек, которого используют для вывода краденых денег." },
    { term: "2FA", def: "Двухфакторная аутентификация (пароль + код из СМС)." },
  ];
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const completedAllLevels = isNewGamePlus && health > 0 && currentLevel >= scenariosList.length - 1;
  const isPrizeEligible = completedAllLevels && accuracy >= 85 && score >= 1800;

  const handleClaimPrize = () => {
    setShowPrizeConfirm(false);
    window.open(TELEGRAM_STICKERPACK_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`h-screen w-full bg-black text-white relative overflow-hidden font-sans selection:bg-purple-500/30 transition-all duration-700 ${isShaking ? 'animate-shake' : ''}`}>
      <div className="scanline" />

      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${rank.bg.replace('/10', '/20')} blur-[150px] rounded-full transition-colors duration-1000`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${rank.bg.replace('/10', '/20')} blur-[150px] rounded-full transition-colors duration-1000`} />
      </div>

      <main className="w-full max-w-[1920px] min-h-screen flex flex-col z-10 py-1 md:py-4 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {gameState === 'START' && (
            <StartScreen
              rank={rank}
              isSoundEnabled={isSoundEnabled}
              bgMusicRef={bgMusicRef}
              highScore={highScore}
              setUserInteracted={setUserInteracted}
              setIsSoundEnabled={setIsSoundEnabled}
              playSound={playSound}
              handleStart={handleStart}
              onPointerAction={onPointerAction}
              setGameState={setGameState}
            />
          )}
          {gameState === 'STORY' && (
            <StoryScreen
              isNewGamePlus={isNewGamePlus}
              startInvestigation={startInvestigation}
              onPointerAction={onPointerAction}
            />
          )}

          {gameState === 'PLAYING' && (
            <PlayingScreen
              rank={rank}
              setUserInteracted={setUserInteracted}
              setIsSoundEnabled={setIsSoundEnabled}
              isSoundEnabled={isSoundEnabled}
              bgMusicRef={bgMusicRef}
              score={score}
              showPointsAnimation={showPointsAnimation}
              evidence={evidence}
              health={health}
              timeLeft={timeLeft}
              combo={combo}
              scenario={scenario}
              isVoicePlaying={isVoicePlaying}
              isFrozen={isFrozen}
              handleChoice={handleChoice}
              setShowExitConfirm={setShowExitConfirm}
              setShowFAQ={setShowFAQ}
              playSound={playSound}
              usePowerUp={usePowerUp}
              powerUps={powerUps}
              showHint={showHint}
              activePowerUp={activePowerUp}
              investigated={investigated}
              voiceAudioFailed={voiceAudioFailed}
              handlePlayVoiceAudio={handlePlayVoiceAudio}
              isMobile={isMobile}
              currentDialogNodeId={currentDialogNodeId}
              dialogHistory={dialogHistory}
              userResponses={userResponses}
              handleDialogChoice={handleDialogChoice}
              dialogClueRevealed={dialogClueRevealed}
              dialogWarningShown={dialogWarningShown}
              isTutorialActive={isTutorialActive}
              tutorialStep={tutorialStep}
              setTutorialStep={setTutorialStep}
              setIsTutorialActive={setIsTutorialActive}
              onPointerAction={onPointerAction}
            />
          )}


          {gameState === 'MINIGAME' && miniGameData && (
            <MinigameScreen 
              miniGameData={miniGameData}
              setShowExitConfirm={setShowExitConfirm}
              playSound={playSound}
              handleMiniGameSuccess={handleMiniGameSuccess}
              handleMiniGameFailure={handleMiniGameFailure}
              setMiniGameData={setMiniGameData}
            />
          )}

          {gameState === 'FEEDBACK' && (
            <FeedbackScreen 
              lastResult={lastResult}
              scenario={scenario}
              setShowExitConfirm={setShowExitConfirm}
              nextLevel={nextLevel}
            />
          )}

          {gameState === 'EDUCATIONAL' && (
            <EducationalScreen 
              scenario={scenario}
              setShowExitConfirm={setShowExitConfirm}
              continueAfterEdu={continueAfterEdu}
            />
          )}

          {gameState === 'PROFILE' && (
            <ProfileScreen 
              rank={rank}
              score={score}
              totalStats={totalStats}
              getAchievements={getAchievements}
              playSound={playSound}
              setIsNewGamePlus={setIsNewGamePlus}
              setGameState={setGameState}
              setShowResetConfirm={setShowResetConfirm}
            />
          )}

          {gameState === 'LOADING' && (
            <LoadingScreen currentLevel={currentLevel} />
          )}

          {gameState === 'GLOSSARY' && (
            <GlossaryScreen 
              playSound={playSound}
              setIsNewGamePlus={setIsNewGamePlus}
              setGameState={setGameState}
            />
          )}

          {gameState === 'END' && (
            <EndScreen 
              rank={rank}
              health={health}
              isNewGamePlus={isNewGamePlus}
              score={score}
              currentLevel={currentLevel}
              accuracy={stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : '0.0'}
              evidence={evidence}
              completedAllLevels={completedAllLevels}
              isPrizeEligible={isPrizeEligible}
              setShowPrizeConfirm={setShowPrizeConfirm}
              playSound={playSound}
              setIsNewGamePlus={setIsNewGamePlus}
              setCurrentLevel={setCurrentLevel}
              setCombo={setCombo}
              setStats={setStats}
              setEvidence={setEvidence}
              setHealth={setHealth}
              setTimeLeft={setTimeLeft}
              setScore={setScore}
              setGameState={setGameState}
            />
          )}
        </AnimatePresence>

          {/* Reset Confirmation Modal - Moved to component */}
          <ResetConfirmModal 
            showResetConfirm={showResetConfirm}
            resetProgress={resetProgress}
            setShowResetConfirm={setShowResetConfirm}
          />
        </main>
        {/* FAQ Modal */}
        <ExitConfirmModal 
          showExitConfirm={showExitConfirm}
          setShowExitConfirm={setShowExitConfirm}
          handleExitToHome={handleExitToHome}
        />
        <FAQModal 
          showFAQ={showFAQ}
          setShowFAQ={setShowFAQ}
        />

        <PrizeConfirmModal 
          showPrizeConfirm={showPrizeConfirm}
          setShowPrizeConfirm={setShowPrizeConfirm}
          handleClaimPrize={handleClaimPrize}
        />

      <footer className="absolute bottom-2 sm:bottom-6 left-0 right-0 text-center text-[5px] xs:text-[8px] text-zinc-700 uppercase tracking-[0.2em] sm:tracking-[0.5em] font-mono pointer-events-none pb-[env(safe-area-inset-bottom)] px-2">
        Защищенный протокол v2.0 // МВД // РБ 2026
      </footer>
    </div>
  );
}
