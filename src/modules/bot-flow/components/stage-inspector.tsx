'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  FileCode,
  ShieldAlert,
  ShieldCheck,
  X,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Cpu,
  Layers,
} from 'lucide-react';
import type { IPipelineStage, ISimulationScenario } from '@/models';

interface StageInspectorProps {
  selectedStage: IPipelineStage | null;
  activeScenario: ISimulationScenario | null;
  onClose: () => void;
}

export const StageInspector = ({
  selectedStage,
  activeScenario,
  onClose,
}: StageInspectorProps) => {
  const t = useTranslations('botFlow');
  const nf = useMemo(() => new Intl.NumberFormat('fa-IR'), []);

  // Find simulation step for this stage in active scenario
  const simulationStep = useMemo(() => {
    if (!selectedStage || !activeScenario) return null;
    return activeScenario.steps.find((s) => s.stageId === selectedStage.id) ?? null;
  }, [selectedStage, activeScenario]);

  if (!selectedStage) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-default-400 border border-dashed border-default-200/50 rounded-2xl bg-default-50/20 backdrop-blur-sm">
        <div className="p-3 rounded-2xl bg-default-100 text-default-400 mb-3 animate-pulse">
          <Layers className="w-8 h-8" />
        </div>
        <h4 className="text-sm font-semibold text-default-700 mb-1">
          {t('inspector.noSelection')}
        </h4>
        <p className="text-xs text-default-400 max-w-[240px] leading-relaxed">
          {t('inspector.noSelectionDesc')}
        </p>
      </div>
    );
  }

  const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
    security: { bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-800 dark:text-rose-200', border: 'border-rose-300 dark:border-rose-500/30' },
    routing: { bg: 'bg-purple-100 dark:bg-purple-500/15', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-500/30' },
    context: { bg: 'bg-sky-100 dark:bg-sky-500/15', text: 'text-sky-800 dark:text-sky-200', border: 'border-sky-300 dark:border-sky-500/30' },
    concurrency: { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-300 dark:border-amber-500/30' },
    ux: { bg: 'bg-pink-100 dark:bg-pink-500/15', text: 'text-pink-800 dark:text-pink-200', border: 'border-pink-300 dark:border-pink-500/30' },
    ai: { bg: 'bg-indigo-100 dark:bg-indigo-500/15', text: 'text-indigo-800 dark:text-indigo-200', border: 'border-indigo-300 dark:border-indigo-500/30' },
    tool: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-300 dark:border-emerald-500/30' },
    database: { bg: 'bg-teal-100 dark:bg-teal-500/15', text: 'text-teal-800 dark:text-teal-200', border: 'border-teal-300 dark:border-teal-500/30' },
    delivery: { bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-300 dark:border-blue-500/30' },
  };

  const catStyle = categoryColorMap[selectedStage.category] || {
    bg: 'bg-default-100',
    text: 'text-default-700',
    border: 'border-default-300',
  };

  return (
    <div className="h-full flex flex-col rounded-2xl border border-default-200/80 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-default-200/80 flex items-start justify-between gap-3 bg-default-100/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-600 dark:text-primary-400 font-extrabold text-sm">
            {nf.format(selectedStage.order)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-default-900 leading-tight">
              {selectedStage.title}
            </h3>
            <span
              className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {t(`categories.${selectedStage.category}`)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-default-400 hover:text-default-700 hover:bg-default-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Grounded AI Badge */}
        {selectedStage.isGroundedAiProtected && (
          <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900 dark:text-amber-300">
                {t('inspector.groundedProtection')}
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-200/90 leading-relaxed mt-0.5 font-medium">
                {t('inspector.groundedProtectionDesc')}
              </p>
            </div>
          </div>
        )}

        {/* Code Location */}
        <div className="rounded-xl border border-default-200/80 dark:border-default-700 bg-default-100/60 dark:bg-default-50/10 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-default-700 dark:text-default-300 font-bold">
            <FileCode className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
            <span>{t('inspector.file')}</span>
          </div>
          <div
            dir="ltr"
            className="font-mono text-[11px] font-semibold text-default-900 dark:text-default-100 bg-background px-2.5 py-1.5 rounded-lg border border-default-200/80 dark:border-default-700 break-all select-all shadow-xs"
          >
            {selectedStage.file}
          </div>

          <div className="flex items-center justify-between text-[11px] text-default-700 dark:text-default-300 pt-1">
            <span className="flex items-center gap-1 text-default-600 dark:text-default-400 font-medium">
              <Cpu className="w-3 h-3 text-default-500" />
              {t('inspector.component')}:
            </span>
            <span dir="ltr" className="font-mono font-bold text-default-900 dark:text-default-100">
              {selectedStage.component}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-default-700 dark:text-default-300">
            <span className="flex items-center gap-1 text-default-600 dark:text-default-400 font-medium">
              <Terminal className="w-3 h-3 text-default-500" />
              {t('inspector.function')}:
            </span>
            <span dir="ltr" className="font-mono font-bold text-default-900 dark:text-default-100 truncate max-w-[180px]">
              {selectedStage.functionName}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="font-bold text-default-700 dark:text-default-300">{t('inspector.description')}</div>
          <p className="text-default-800 dark:text-default-200 leading-relaxed text-[11.5px] bg-default-100/50 dark:bg-default-50/10 p-3 rounded-xl border border-default-200/80 dark:border-default-700 font-medium">
            {selectedStage.description}
          </p>
        </div>

        {/* Inputs & Outputs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 font-bold text-sky-700 dark:text-sky-400">
              <ArrowRightLeft className="w-3 h-3" />
              <span>{t('inspector.inputs')}</span>
            </div>
            <div className="space-y-1">
              {selectedStage.inputs.map((inp, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30 text-sky-900 dark:text-sky-200 font-semibold text-[10.5px] leading-tight"
                >
                  {inp}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
              <ArrowRightLeft className="w-3 h-3" />
              <span>{t('inspector.outputs')}</span>
            </div>
            <div className="space-y-1">
              {selectedStage.outputs.map((out, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200 font-semibold text-[10.5px] leading-tight"
                >
                  {out}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guards */}
        {selectedStage.guards.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('inspector.guards')}</span>
            </div>
            <div className="space-y-1">
              {selectedStage.guards.map((guard, idx) => (
                <div
                  key={idx}
                  dir="ltr"
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-300 dark:border-indigo-500/30 font-mono font-semibold text-[10px] text-indigo-900 dark:text-indigo-200 select-all"
                >
                  {guard}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drop Reasons */}
        {selectedStage.dropReasons.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{t('inspector.dropReasons')}</span>
            </div>
            <div className="space-y-1">
              {selectedStage.dropReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30 text-rose-900 dark:text-rose-200 font-semibold text-[10.5px] flex items-start gap-1.5"
                >
                  <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simulation Log for Active Scenario */}
        {simulationStep && (
          <div className="mt-4 p-3.5 rounded-xl border border-primary-300 dark:border-primary-500/40 bg-primary-50/70 dark:bg-primary-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary-900 dark:text-primary-300">
                {t('inspector.simulationLog')}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                  simulationStep.status === 'passed'
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                    : simulationStep.status === 'branch_taken'
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                      : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40'
                }`}
              >
                {t(`simulation.status.${simulationStep.status === 'branch_taken' ? 'branchTaken' : simulationStep.status}`)}
              </span>
            </div>
            <p className="text-[11.5px] text-default-800 dark:text-default-200 leading-relaxed font-medium">
              {simulationStep.annotation}
            </p>
            {simulationStep.payloadPreview && (
              <pre
                dir="ltr"
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9.5px] text-emerald-300 overflow-x-auto shadow-inner"
              >
                {JSON.stringify(simulationStep.payloadPreview, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
