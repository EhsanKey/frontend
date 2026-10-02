'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Info,
} from 'lucide-react';
import type {
  IPipelineStage,
  ISimulationScenario,
  ISimulationStep,
} from '@/models';
import type { CanvasNodeLayout, CanvasParticle } from './types';

interface BotFlowCanvasProps {
  stages: IPipelineStage[];
  selectedStageId: string | null;
  onSelectStage: (stage: IPipelineStage) => void;
  activeScenario: ISimulationScenario | null;
  currentStepIndex: number;
  isPlaying: boolean;
}

export const BotFlowCanvas = ({
  stages,
  selectedStageId,
  onSelectStage,
  activeScenario,
  currentStepIndex,
  isPlaying,
}: BotFlowCanvasProps) => {
  const t = useTranslations('botFlow');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Transform state (Pan & Zoom)
  const [transform, setTransform] = useState({ x: 40, y: 40, scale: 0.85 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Animation state
  const particlesRef = useRef<CanvasParticle[]>([]);
  const pulseAngleRef = useRef(0);

  // Pre-calculate node positions in an aesthetic 3-row serpentine pipeline
  const nodeLayouts: CanvasNodeLayout[] = useMemo(() => {
    const sorted = [...stages].sort((a, b) => a.order - b.order);
    const layouts: CanvasNodeLayout[] = [];

    const nodeWidth = 220;
    const nodeHeight = 105;
    const colSpacing = 280;
    const rowSpacing = 170;
    const startX = 60;
    const startY = 60;

    sorted.forEach((stage, idx) => {
      let col = 0;
      let row = 0;

      if (idx < 4) {
        // Row 1: Left to Right (1, 2, 3, 4)
        row = 0;
        col = idx;
      } else if (idx < 8) {
        // Row 2: Right to Left (5, 6, 7, 8 serpentine)
        row = 1;
        col = 3 - (idx - 4);
      } else {
        // Row 3: Left to Right (9, 10, 11, 12)
        row = 2;
        col = idx - 8;
      }

      layouts.push({
        id: stage.id,
        stage,
        x: startX + col * colSpacing,
        y: startY + row * rowSpacing,
        width: nodeWidth,
        height: nodeHeight,
        column: col,
        row,
      });
    });

    return layouts;
  }, [stages]);

  // Color mapping by category
  const categoryColors: Record<string, { border: string; glow: string; header: string; badge: string }> = useMemo(
    () => ({
      security: { border: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', header: '#fda4af', badge: '#e11d48' },
      routing: { border: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', header: '#d8b4fe', badge: '#9333ea' },
      context: { border: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)', header: '#7dd3fc', badge: '#0284c7' },
      concurrency: { border: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', header: '#fcd34d', badge: '#d97706' },
      ux: { border: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)', header: '#f472b6', badge: '#db2777' },
      ai: { border: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)', header: '#a5b4fc', badge: '#4f46e5' },
      tool: { border: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', header: '#6ee7b7', badge: '#059669' },
      database: { border: '#14b8a6', glow: 'rgba(20, 184, 166, 0.4)', header: '#5eead4', badge: '#0d9488' },
      delivery: { border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', header: '#93c5fd', badge: '#2563eb' },
    }),
    [],
  );

  // Active step from simulation
  const activeStep: ISimulationStep | null = useMemo(() => {
    if (!activeScenario || activeScenario.steps.length === 0) return null;
    return activeScenario.steps[Math.min(currentStepIndex, activeScenario.steps.length - 1)];
  }, [activeScenario, currentStepIndex]);

  // Initialize background flow particles
  useEffect(() => {
    const particles: CanvasParticle[] = [];
    const count = 36;

    for (let i = 0; i < count; i++) {
      const fromIdx = Math.floor(Math.random() * (stages.length - 1));
      const fromNode = stages[fromIdx];
      const toNode = stages[fromIdx + 1];

      if (fromNode && toNode) {
        particles.push({
          id: i,
          fromNodeId: fromNode.id,
          toNodeId: toNode.id,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          color: '#38bdf8',
          size: 2.5 + Math.random() * 2,
        });
      }
    }

    particlesRef.current = particles;
  }, [stages]);

  // Main Canvas Rendering Loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Clear background (Deep dark slate canvas)
    ctx.fillStyle = '#080c16';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Subtle Tech Grid with increased contrast
    const gridSize = 40 * transform.scale;
    const offsetX = (transform.x % gridSize);
    const offsetY = (transform.y % gridSize);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Transform world
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // Node lookup by ID
    const layoutMap = new Map<string, CanvasNodeLayout>();
    nodeLayouts.forEach((l) => layoutMap.set(l.id, l));

    // 3. Draw Branching Bypass Paths
    // Branch A: FSM Form Bypass (Node 2: routing_fsm to Node 12: telegram_delivery)
    const node2 = layoutMap.get('routing_fsm');
    const node12 = layoutMap.get('telegram_delivery');
    if (node2 && node12) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
      ctx.lineWidth = 2.5;
      const startX = node2.x + node2.width / 2;
      const startY = node2.y + node2.height;
      const endX = node12.x + node12.width / 2;
      const endY = node12.y;
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(startX, startY + 80, endX, endY - 80, endX, endY);
      ctx.stroke();

      // Label on bypass curve with solid contrasting pill
      const labelText = t('canvas.fsmBypassLabel');
      ctx.font = 'bold 10px Vazirmatn, system-ui, sans-serif';
      const textW = ctx.measureText(labelText).width;
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      ctx.fillStyle = '#2e1065';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(midX - textW / 2 - 10, midY - 12, textW + 20, 24, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f5f3ff';
      ctx.textAlign = 'center';
      ctx.fillText(labelText, midX, midY + 4);
      ctx.restore();
    }

    // Branch B: Rate Limit Drop Path (Node 4: concurrency_ratelimit)
    const node4 = layoutMap.get('concurrency_ratelimit');
    if (node4) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.lineWidth = 2.5;
      const startX = node4.x + node4.width;
      const startY = node4.y + node4.height / 2;
      const endX = startX + 50;
      const endY = startY + 40;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Drop icon/marker
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Pill label for drop
      const dropText = '✕ Drop: Rate Limited';
      ctx.font = 'bold 9.5px Vazirmatn, system-ui, sans-serif';
      const dropW = ctx.measureText(dropText).width;

      ctx.fillStyle = '#4c0519';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(endX + 8, endY - 10, dropW + 16, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffe4e6';
      ctx.textAlign = 'left';
      ctx.fillText(dropText, endX + 16, endY + 4);
      ctx.restore();
    }

    // 4. Draw Sequential Connections (Bézier curves between stages 1 -> 12)
    for (let i = 0; i < nodeLayouts.length - 1; i++) {
      const current = nodeLayouts[i];
      const next = nodeLayouts[i + 1];

      let startX: number;
      let startY: number;
      let endX: number;
      let endY: number;
      let cp1X: number;
      let cp1Y: number;
      let cp2X: number;
      let cp2Y: number;

      if (current.row === next.row) {
        // Horizontal connection in same row
        if (current.row === 1) {
          // Row 2 flows Right to Left
          startX = current.x;
          startY = current.y + current.height / 2;
          endX = next.x + next.width;
          endY = next.y + next.height / 2;
          cp1X = startX - 30;
          cp1Y = startY;
          cp2X = endX + 30;
          cp2Y = endY;
        } else {
          // Rows 0 & 2 flow Left to Right
          startX = current.x + current.width;
          startY = current.y + current.height / 2;
          endX = next.x;
          endY = next.y + next.height / 2;
          cp1X = startX + 30;
          cp1Y = startY;
          cp2X = endX - 30;
          cp2Y = endY;
        }
      } else {
        // Serpentine curve between rows (Row 0 -> Row 1 or Row 1 -> Row 2)
        startX = current.x + current.width / 2;
        startY = current.y + current.height;
        endX = next.x + next.width / 2;
        endY = next.y;
        cp1X = startX;
        cp1Y = startY + 50;
        cp2X = endX;
        cp2Y = endY - 50;
      }

      ctx.save();
      // Glowing underlayer
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.stroke();

      // Main line with high contrast cyan
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.stroke();

      // Direction Arrow Head
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Draw Animated Glowing Particles along connections
    const speedMultiplier = isPlaying ? 1.75 : 1.0;
    pulseAngleRef.current += 0.04 * speedMultiplier;
    const particles = particlesRef.current;
    particles.forEach((p) => {
      p.progress += p.speed * speedMultiplier;
      if (p.progress > 1) {
        p.progress = 0;
      }

      const fromNode = layoutMap.get(p.fromNodeId);
      const toNode = layoutMap.get(p.toNodeId);
      if (fromNode && toNode) {
        const startX = fromNode.x + fromNode.width / 2;
        const startY = fromNode.y + fromNode.height / 2;
        const endX = toNode.x + toNode.width / 2;
        const endY = toNode.y + toNode.height / 2;

        const currX = startX + (endX - startX) * p.progress;
        const currY = startY + (endY - startY) * p.progress;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // 6. Draw Nodes with Elevated High-Contrast Surface
    nodeLayouts.forEach((node) => {
      const isSelected = selectedStageId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const isActiveInSimulation = activeStep?.stageId === node.id;
      const colors = categoryColors[node.stage.category] || categoryColors.ai;

      ctx.save();

      // Active simulation energy pulse ring
      if (isActiveInSimulation) {
        const pulse = (Math.sin(pulseAngleRef.current * 2) + 1) * 6;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 3;
        ctx.shadowColor = colors.border;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(
          node.x - 6 - pulse / 2,
          node.y - 6 - pulse / 2,
          node.width + 12 + pulse,
          node.height + 12 + pulse,
          16,
        );
        ctx.stroke();
      }

      // Drop shadow for node elevation
      if (isSelected) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 28;
        ctx.shadowOffsetY = 0;
      } else if (isHovered) {
        ctx.shadowColor = colors.border;
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 4;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 5;
      }

      // Distinct, elevated solid card gradient
      const cardGrad = ctx.createLinearGradient(node.x, node.y, node.x, node.y + node.height);
      if (isSelected) {
        cardGrad.addColorStop(0, '#1e3860');
        cardGrad.addColorStop(1, '#0f2038');
      } else if (isHovered) {
        cardGrad.addColorStop(0, '#24324a');
        cardGrad.addColorStop(1, '#162234');
      } else {
        cardGrad.addColorStop(0, '#1c263a');
        cardGrad.addColorStop(1, '#111a28');
      }

      ctx.fillStyle = cardGrad;
      ctx.strokeStyle = isSelected
        ? '#38bdf8'
        : isHovered
          ? colors.border
          : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = isSelected ? 2.5 : isHovered ? 2 : 1.5;

      ctx.beginPath();
      ctx.roundRect(node.x, node.y, node.width, node.height, 12);
      ctx.fill();
      ctx.stroke();

      // Top colored accent strip (5px height for clean aesthetic)
      ctx.fillStyle = colors.border;
      ctx.beginPath();
      ctx.roundRect(node.x, node.y, node.width, 5, [12, 12, 0, 0]);
      ctx.fill();

      // Order number badge (top-right)
      ctx.fillStyle = colors.badge;
      ctx.beginPath();
      ctx.roundRect(node.x + node.width - 34, node.y + 11, 24, 18, 5);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Vazirmatn, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(node.stage.order), node.x + node.width - 22, node.y + 24);

      // Component Name (Monospace, crisp Slate-300 on top-left)
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 9.5px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(node.stage.component, node.x + 12, node.y + 24);

      // Persian Title (Row 2, pure white bold text)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12.5px Vazirmatn, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(node.stage.title, node.x + node.width - 12, node.y + 53);

      // Row 3: Dedicated Footer Badges (Category & Grounded AI)
      const pillY = node.y + 70;

      // Category Pill (Right aligned in footer)
      const catText = t(`categories.${node.stage.category}`);
      ctx.font = 'bold 10px Vazirmatn, system-ui, sans-serif';
      const catMetrics = ctx.measureText(catText);
      const catPillW = Math.max(catMetrics.width + 16, 68);
      const catPillX = node.x + node.width - 12 - catPillW;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(catPillX, pillY, catPillW, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = colors.header;
      ctx.textAlign = 'center';
      ctx.fillText(catText, catPillX + catPillW / 2, pillY + 15);

      // Grounded AI shield badge (Left aligned in footer)
      if (node.stage.isGroundedAiProtected) {
        const groundText = '🛡️ Grounded';
        ctx.font = 'bold 9.5px system-ui, sans-serif';
        const gMetrics = ctx.measureText(groundText);
        const gPillW = gMetrics.width + 14;
        const gPillX = node.x + 12;

        ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(gPillX, pillY, gPillW, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText(groundText, gPillX + gPillW / 2, pillY + 15);
      }

      // Simulation Status Indicator overlay
      if (isActiveInSimulation && activeStep) {
        const isPassed = activeStep.status === 'passed';
        const isBranch = activeStep.status === 'branch_taken';

        ctx.fillStyle = isPassed ? '#10b981' : isBranch ? '#f59e0b' : '#f43f5e';
        ctx.beginPath();
        ctx.roundRect(node.x + 8, node.y - 10, 84, 20, 10);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9.5px Vazirmatn, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          isPassed ? t('canvas.statusPassed') : isBranch ? t('canvas.statusBranch') : t('canvas.statusDropped'),
          node.x + 50,
          node.y + 4,
        );
      }

      ctx.restore();
    });

    ctx.restore();

    // 7. Draw Mini-Map in Bottom-Left corner (Solid slate-900 surface)
    const miniW = 160;
    const miniH = 90;
    const miniX = 16;
    const miniY = height - miniH - 16;

    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(miniX, miniY, miniW, miniH, 10);
    ctx.fill();
    ctx.stroke();

    // Scale world to fit in minimap
    const worldW = 1200;
    const worldH = 600;
    const mapScaleX = miniW / worldW;
    const mapScaleY = miniH / worldH;

    nodeLayouts.forEach((n) => {
      ctx.fillStyle = categoryColors[n.stage.category]?.border || '#38bdf8';
      ctx.fillRect(
        miniX + n.x * mapScaleX,
        miniY + n.y * mapScaleY,
        n.width * mapScaleX,
        n.height * mapScaleY,
      );
    });

    // Viewport box in minimap with highlighted fill
    const viewW = (width / transform.scale) * mapScaleX;
    const viewH = (height / transform.scale) * mapScaleY;
    const viewX = miniX + (-transform.x / transform.scale) * mapScaleX;
    const viewY = miniY + (-transform.y / transform.scale) * mapScaleY;

    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(viewX, viewY, Math.min(viewW, miniW), Math.min(viewH, miniH));
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(viewX, viewY, Math.min(viewW, miniW), Math.min(viewH, miniH));
    ctx.restore();
  }, [
    transform,
    nodeLayouts,
    selectedStageId,
    hoveredNodeId,
    activeStep,
    categoryColors,
    isPlaying,
    t,
  ]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation Start & Stop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [draw]);

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      }));
      return;
    }

    // Check hit test for hover
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - transform.x) / transform.scale;
    const mouseY = (e.clientY - rect.top - transform.y) / transform.scale;

    let foundId: string | null = null;
    for (const node of nodeLayouts) {
      if (
        mouseX >= node.x &&
        mouseX <= node.x + node.width &&
        mouseY >= node.y &&
        mouseY <= node.y + node.height
      ) {
        foundId = node.id;
        break;
      }
    }

    setHoveredNodeId(foundId);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - transform.x) / transform.scale;
    const mouseY = (e.clientY - rect.top - transform.y) / transform.scale;

    for (const node of nodeLayouts) {
      if (
        mouseX >= node.x &&
        mouseX <= node.x + node.width &&
        mouseY >= node.y &&
        mouseY <= node.y + node.height
      ) {
        onSelectStage(node.stage);
        return;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.4), 2.2);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Zoom around cursor
    setTransform((prev) => ({
      scale: newScale,
      x: cursorX - (cursorX - prev.x) * (newScale / prev.scale),
      y: cursorY - (cursorY - prev.y) * (newScale / prev.scale),
    }));
  };

  // Zoom / Fit Buttons
  const handleZoomIn = () => {
    setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale * 1.15, 2.2) }));
  };

  const handleZoomOut = () => {
    setTransform((prev) => ({ ...prev, scale: Math.max(prev.scale * 0.85, 0.4) }));
  };

  const handleReset = () => {
    setTransform({ x: 40, y: 40, scale: 0.85 });
  };

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `university-assistant-pipeline-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-default-200/50 bg-[#090d16] shadow-2xl select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        className={`w-full h-full block ${
          isDragging ? 'cursor-grabbing' : hoveredNodeId ? 'cursor-pointer' : 'cursor-grab'
        }`}
      />

      {/* Floating Controls Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          title={t('controls.zoomIn')}
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          title={t('controls.zoomOut')}
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          title={t('controls.resetView')}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-700 mx-0.5" />

        <button
          type="button"
          onClick={handleExportPng}
          className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          title={t('controls.exportImage')}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas Interaction Hint */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[11px] text-slate-200 font-medium shadow-lg">
        <Info className="w-3.5 h-3.5 text-sky-400" />
        <span>{t('controls.canvasHint')}</span>
      </div>

      {/* Mini Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 text-[10.5px] text-slate-200 font-medium shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-sky-400/30" />
          <span>{t('canvas.legendSequential')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-purple-400/30" />
          <span>{t('canvas.legendFsm')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30" />
          <span>{t('canvas.legendGrounded')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 ring-2 ring-rose-400/30" />
          <span>{t('canvas.legendRateLimit')}</span>
        </div>
      </div>
    </div>
  );
};
