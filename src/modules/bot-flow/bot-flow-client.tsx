'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  GitFork,
  TableProperties,
  LayoutGrid,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useGetRequest } from '@/hooks';
import { clientSystemPipelineServices } from '@/apis/services/system-pipeline';
import type {
  IPipelineStage,
  PipelineStageCategory,
} from '@/models';
import type { BotFlowClientProps, BotFlowViewMode } from './types';
import { BotFlowCanvas } from './bot-flow-canvas';
import { PipelineMetrics } from './components/pipeline-metrics';
import { StageInspector } from './components/stage-inspector';
import { SimulationRunner } from './components/simulation-runner';
import { ToolsMatrixModal } from './components/tools-matrix-modal';

export const BotFlowClient = ({ initialSpec }: BotFlowClientProps) => {
  const t = useTranslations('botFlow');

  // Fetch or use initial spec
  const { data: specData, isLoading: isRefreshing, refetch } = useGetRequest({
    queryKey: ['system-pipeline', 'message-flow'],
    requestFn: () => clientSystemPipelineServices.getMessagePipeline(),
    initialData: initialSpec,
  });

  const spec = specData ?? initialSpec;

  // View mode
  const [viewMode, setViewMode] = useState<BotFlowViewMode>('canvas');
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // Search & Category filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PipelineStageCategory | 'all'>('all');

  // Manual stage selection override (if user clicks on a node)
  const [selectedStageIdOverride, setSelectedStageIdOverride] = useState<string | null>(null);

  // Simulation State
  const scenarios = useMemo(() => spec?.scenarios || [], [spec]);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    scenarios[0]?.id || 'scenario-professor-review',
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const activeScenario = useMemo(() => {
    return scenarios.find((s) => s.id === activeScenarioId) ?? scenarios[0] ?? null;
  }, [scenarios, activeScenarioId]);

  // Derive active simulation stage ID
  const activeSimulationStageId = useMemo(() => {
    if (activeScenario && activeScenario.steps[currentStepIndex]) {
      return activeScenario.steps[currentStepIndex].stageId;
    }
    return null;
  }, [activeScenario, currentStepIndex]);

  // Derived selected stage (manual selection takes precedence over active step)
  const selectedStage = useMemo(() => {
    const stageId = selectedStageIdOverride ?? activeSimulationStageId ?? spec?.stages?.[0]?.id;
    if (!stageId || !spec?.stages) return null;
    return spec.stages.find((s) => s.id === stageId) ?? null;
  }, [selectedStageIdOverride, activeSimulationStageId, spec]);

  const handleSelectStage = useCallback((stage: IPipelineStage | null) => {
    setSelectedStageIdOverride(stage?.id ?? null);
  }, []);

  // Simulation auto-play timer
  useEffect(() => {
    if (!isPlaying || !activeScenario) return;

    const baseDelay = 2200;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= activeScenario.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, baseDelay / speed);

    return () => clearInterval(interval);
  }, [isPlaying, activeScenario, speed]);

  const handleTogglePlay = useCallback(() => {
    if (!activeScenario) return;
    setSelectedStageIdOverride(null);
    if (currentStepIndex >= activeScenario.steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying((prev) => !prev);
  }, [activeScenario, currentStepIndex]);

  const handleNextStep = useCallback(() => {
    if (!activeScenario) return;
    setSelectedStageIdOverride(null);
    setCurrentStepIndex((prev) => Math.min(prev + 1, activeScenario.steps.length - 1));
  }, [activeScenario]);

  const handlePrevStep = useCallback(() => {
    setSelectedStageIdOverride(null);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleResetSimulation = useCallback(() => {
    setSelectedStageIdOverride(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const handleSelectScenario = useCallback((id: string) => {
    setSelectedStageIdOverride(null);
    setActiveScenarioId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Filtered stages for pipeline card view
  const filteredStages = useMemo(() => {
    if (!spec?.stages) return [];
    return spec.stages.filter((stage) => {
      const matchesCategory =
        selectedCategory === 'all' || stage.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        stage.title.toLowerCase().includes(q) ||
        stage.component.toLowerCase().includes(q) ||
        stage.file.toLowerCase().includes(q) ||
        stage.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [spec, selectedCategory, searchTerm]);

  const categories: Array<PipelineStageCategory | 'all'> = [
    'all',
    'security',
    'routing',
    'context',
    'concurrency',
    'ux',
    'ai',
    'tool',
    'database',
    'delivery',
  ];

  if (!spec) {
    return null;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl border border-default-200/80 bg-gradient-to-br from-background via-default-50/60 to-primary-500/5 backdrop-blur-xl shadow-lg">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/30 shadow-xs">
              <GitFork className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-default-950 dark:text-white">
              {t('header.title')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              {t('header.liveSyncBadge')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 shadow-xs">
              {t('header.developerBadge')}
            </span>
          </div>
          <p className="text-xs text-default-600 dark:text-default-400 max-w-2xl leading-relaxed font-medium">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Modes */}
          <div className="flex items-center gap-1 p-1 bg-default-100 rounded-xl border border-default-200/60">
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'canvas'
                  ? 'bg-background text-primary-500 shadow-sm'
                  : 'text-default-500 hover:text-default-900'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>{t('controls.viewModes.canvas')}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'pipeline'
                  ? 'bg-background text-primary-500 shadow-sm'
                  : 'text-default-500 hover:text-default-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('controls.viewModes.pipeline')}</span>
            </button>
          </div>

          {/* Matrix Trigger */}
          <button
            type="button"
            onClick={() => setIsMatrixOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all shadow-sm"
          >
            <TableProperties className="w-4 h-4" />
            <span>{t('controls.viewModes.matrix')}</span>
          </button>

          {/* Refresh Spec */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-default-500 hover:text-default-900 bg-default-100 hover:bg-default-200 border border-default-200/60 transition-colors disabled:opacity-50"
            title={t('header.refreshTooltip')}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <PipelineMetrics spec={spec} />

      {/* Interactive Simulation Runner Bar */}
      <SimulationRunner
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        currentStepIndex={currentStepIndex}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onReset={handleResetSimulation}
        speed={speed}
        onChangeSpeed={setSpeed}
      />

      {/* Main View Area */}
      {viewMode === 'canvas' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Canvas Engine */}
          <div className="xl:col-span-8">
            <BotFlowCanvas
              stages={spec.stages}
              selectedStageId={selectedStage?.id || null}
              onSelectStage={handleSelectStage}
              activeScenario={activeScenario}
              currentStepIndex={currentStepIndex}
              isPlaying={isPlaying}
            />
          </div>

          {/* Side Stage Inspector */}
          <div className="xl:col-span-4 h-[620px]">
            <StageInspector
              selectedStage={selectedStage}
              activeScenario={activeScenario}
              onClose={() => handleSelectStage(null)}
            />
          </div>
        </div>
      ) : (
        /* Alternative Card / Pipeline View */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-default-200/50 bg-background/80 backdrop-blur-md">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-default-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('controls.searchPlaceholder')}
                className="w-full text-xs bg-default-100/70 border border-default-200/60 rounded-xl pr-9 pl-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-default-100 text-default-600 hover:bg-default-200/70'
                  }`}
                >
                  {cat === 'all' ? t('controls.filterAll') : t(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStages.map((stage) => {
              const isSelected = selectedStage?.id === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => handleSelectStage(stage)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 backdrop-blur-md flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500/10 dark:bg-primary-500/15 shadow-xl scale-[1.01]'
                      : 'border-default-200/80 dark:border-default-800 bg-card hover:border-default-400 dark:hover:border-default-600 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10.5px] font-semibold text-default-600 dark:text-default-400">
                        {stage.component}
                      </span>
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-default-200 dark:bg-default-800 text-default-900 dark:text-default-100 font-extrabold text-xs shadow-xs">
                        {stage.order}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-default-950 dark:text-white leading-snug">
                      {stage.title}
                    </h3>

                    <p className="text-xs text-default-700 dark:text-default-300 line-clamp-3 leading-relaxed font-medium">
                      {stage.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-default-200/60 dark:border-default-800 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-default-600 dark:text-default-400 font-bold">
                      {t(`categories.${stage.category}`)}
                    </span>
                    {stage.isGroundedAiProtected && (
                      <span className="text-amber-700 dark:text-amber-300 font-bold text-[10.5px]">
                        🛡️ Grounded AI
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inspector below cards if selected */}
          {selectedStage && (
            <div className="mt-6">
              <StageInspector
                selectedStage={selectedStage}
                activeScenario={activeScenario}
                onClose={() => handleSelectStage(null)}
              />
            </div>
          )}
        </div>
      )}

      {/* Tools Matrix Modal */}
      <ToolsMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </div>
  );
};
