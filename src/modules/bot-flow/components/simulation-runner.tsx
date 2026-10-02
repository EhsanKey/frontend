'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { ISimulationScenario } from '@/models';

interface SimulationRunnerProps {
  scenarios: ISimulationScenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  currentStepIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

export const SimulationRunner = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  currentStepIndex,
  isPlaying,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  speed,
  onChangeSpeed,
}: SimulationRunnerProps) => {
  const t = useTranslations('botFlow');
  const nf = useMemo(() => new Intl.NumberFormat('fa-IR'), []);

  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.id === activeScenarioId) ?? scenarios[0];
  }, [scenarios, activeScenarioId]);

  const currentStep = useMemo(() => {
    if (!activeScenario || activeScenario.steps.length === 0) return null;
    return activeScenario.steps[Math.min(currentStepIndex, activeScenario.steps.length - 1)];
  }, [activeScenario, currentStepIndex]);

  const totalSteps = activeScenario?.steps.length ?? 0;

  return (
    <div className="rounded-2xl border border-default-200/80 bg-background/95 backdrop-blur-xl p-4 shadow-lg space-y-3">
      {/* Top Bar: Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <div className="p-2 rounded-xl bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold text-default-700 dark:text-default-300 block mb-0.5">
              {t('simulation.selectScenario')}
            </label>
            <select
              value={activeScenarioId}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="w-full text-xs font-bold bg-default-100 dark:bg-default-800 text-default-900 dark:text-default-100 border border-default-300 dark:border-default-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer shadow-xs"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-background text-foreground font-semibold">
                  {sc.title} ({sc.chatType === 'group' ? t('simulation.chatTypeGroup') : t('simulation.chatTypePrivate')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Playback Actions */}
        <div className="flex items-center gap-1.5 bg-default-100 dark:bg-default-800/80 p-1.5 rounded-xl border border-default-300 dark:border-default-700 shadow-xs">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIndex <= 0}
            className="p-1.5 rounded-lg text-default-700 dark:text-default-300 hover:text-default-950 dark:hover:text-white hover:bg-default-200 dark:hover:bg-default-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title={t('simulation.prev')}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600'
                : 'bg-primary-600 text-white shadow-primary-500/20 hover:bg-primary-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t('simulation.pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t('simulation.play')}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-1.5 rounded-lg text-default-700 dark:text-default-300 hover:text-default-950 dark:hover:text-white hover:bg-default-200 dark:hover:bg-default-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title={t('simulation.next')}
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-default-700 dark:text-default-300 hover:text-default-950 dark:hover:text-white hover:bg-default-200 dark:hover:bg-default-700 transition-colors"
            title={t('simulation.reset')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-default-300 dark:bg-default-600 mx-1" />

          {/* Speed Buttons */}
          <div className="flex items-center text-[10px] font-bold">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  speed === s
                    ? 'bg-primary-600 text-white dark:bg-primary-500 dark:text-white font-extrabold shadow-xs'
                    : 'hover:bg-default-200 dark:hover:bg-default-700 text-default-700 dark:text-default-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated User Input Bubble */}
      {activeScenario && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-default-100/70 dark:bg-default-50/10 border border-default-200/80 dark:border-default-700">
          <div className="p-2 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0 border border-sky-500/25">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                {t('simulation.userMessageSimulated')}
              </span>
              <span className="text-[10.5px] text-default-600 dark:text-default-400 font-mono font-medium">
                {activeScenario.chatType === 'group' ? 'Group Superchat' : 'Private Direct Message'}
              </span>
            </div>
            <p className="text-xs text-default-950 dark:text-default-50 font-bold leading-relaxed bg-background p-2.5 rounded-lg border border-default-200/80 dark:border-default-700 shadow-xs">
              «{activeScenario.sampleInput}»
            </p>
          </div>
        </div>
      )}

      {/* Current Step Banner & Progress */}
      {currentStep && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-default-950 dark:text-white">
                {t('simulation.step', {
                  current: nf.format(currentStepIndex + 1),
                  total: nf.format(totalSteps),
                })}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  currentStep.status === 'passed'
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                    : currentStep.status === 'branch_taken'
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                      : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40'
                }`}
              >
                {t(`simulation.status.${currentStep.status === 'branch_taken' ? 'branchTaken' : currentStep.status}`)}
              </span>
            </div>

            <span className="text-[11px] font-bold text-default-700 dark:text-default-300">
              {t('simulation.completionRate', {
                percent: nf.format(Math.round(((currentStepIndex + 1) / totalSteps) * 100)),
              })}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-default-200 dark:bg-default-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>

          <p className="text-xs text-primary-950 dark:text-primary-100 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/60 p-3 rounded-xl leading-relaxed mt-1 flex items-start gap-2.5 font-medium shadow-xs">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
            <span>{currentStep.annotation}</span>
          </p>
        </div>
      )}
    </div>
  );
};
