'use client';

import React, { useId, useState } from 'react';
import { Card, Chip } from '@heroui/react';
import { Activity, MessageSquare, HelpCircle, FileCheck2, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { IActivityTrendPoint } from '@/models';

interface ActivityTrendChartProps {
  data?: IActivityTrendPoint[];
  trends?: IActivityTrendPoint[];
}

type MetricTab = 'all' | 'messages' | 'inquiries' | 'submissions';

export const ActivityTrendChart = ({ data, trends }: ActivityTrendChartProps) => {
  const t = useTranslations('dashboard');
  const [activeTab, setActiveTab] = useState<MetricTab>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const idPrefix = useId();

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat('fa-IR').format(num);

  const formatPersianDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fa-IR', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const rawData = data ?? trends ?? [];
  const points = rawData.length > 0 ? rawData : [
    { date: '2026-09-25', messages: 120, inquiries: 30, submissions: 10 },
    { date: '2026-09-26', messages: 150, inquiries: 45, submissions: 15 },
    { date: '2026-09-27', messages: 240, inquiries: 50, submissions: 18 },
    { date: '2026-09-28', messages: 210, inquiries: 48, submissions: 14 },
    { date: '2026-09-29', messages: 290, inquiries: 65, submissions: 22 },
    { date: '2026-09-30', messages: 340, inquiries: 78, submissions: 30 },
    { date: '2026-10-01', messages: 390, inquiries: 85, submissions: 35 },
  ];

  const totalMessages = points.reduce((acc, p) => acc + p.messages, 0);
  const totalInquiries = points.reduce((acc, p) => acc + p.inquiries, 0);
  const totalSubmissions = points.reduce((acc, p) => acc + p.submissions, 0);
  const totalVolume = totalMessages + totalInquiries + totalSubmissions;

  // Chart dimensions & scaling
  const width = 760;
  const height = 260;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(
    ...points.map((p) => {
      if (activeTab === 'messages') return p.messages;
      if (activeTab === 'inquiries') return p.inquiries;
      if (activeTab === 'submissions') return p.submissions;
      return Math.max(p.messages, p.inquiries, p.submissions);
    }),
    10,
  );

  const roundedMax = Math.ceil(maxVal * 1.15);

  const getX = (index: number) => {
    if (points.length <= 1) return paddingX + innerWidth / 2;
    return paddingX + (index / (points.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return paddingTop + innerHeight - (val / roundedMax) * innerHeight;
  };

  // Build smooth bezier path
  const buildSmoothPath = (values: number[]) => {
    if (values.length === 0) return '';
    const coords = values.map((v, i) => ({ x: getX(i), y: getY(v) }));
    if (coords.length === 1) return `M ${coords[0]!.x} ${coords[0]!.y}`;

    let path = `M ${coords[0]!.x},${coords[0]!.y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i]!;
      const next = coords[i + 1]!;
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      path += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${next.x},${next.y}`;
    }
    return path;
  };

  const buildAreaPath = (values: number[]) => {
    const linePath = buildSmoothPath(values);
    if (!linePath) return '';
    const lastX = getX(values.length - 1);
    const firstX = getX(0);
    const bottomY = paddingTop + innerHeight;
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  const messageValues = points.map((p) => p.messages);
  const inquiryValues = points.map((p) => p.inquiries);
  const submissionValues = points.map((p) => p.submissions);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <Card className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 border-b border-neutral-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
              <Activity className="size-5" />
            </div>
            <div>
              <h3 className="text-title font-bold text-neutral-900">
                {t('charts.activityTitle')}
              </h3>
              <p className="mt-0.5 text-caption text-neutral-500">
                {t('charts.activitySubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-neutral-100/90 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t('charts.tabAll')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span className="size-2 rounded-full bg-blue-500" />
            {t('charts.tabMessages')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-white text-amber-700 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span className="size-2 rounded-full bg-amber-500" />
            {t('charts.tabInquiries')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-caption font-semibold transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span className="size-2 rounded-full bg-emerald-500" />
            {t('charts.tabSubmissions')}
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100/60">
          <div className="flex items-center justify-between">
            <span className="text-caption font-medium text-blue-700">{t('charts.legendMessages')}</span>
            <MessageSquare className="size-3.5 text-blue-500" />
          </div>
          <p className="mt-1 text-h3 font-bold text-blue-900">{formatNumber(totalMessages)}</p>
        </div>

        <div className="rounded-xl bg-amber-50/60 p-3 border border-amber-100/60">
          <div className="flex items-center justify-between">
            <span className="text-caption font-medium text-amber-700">{t('charts.legendInquiries')}</span>
            <HelpCircle className="size-3.5 text-amber-500" />
          </div>
          <p className="mt-1 text-h3 font-bold text-amber-900">{formatNumber(totalInquiries)}</p>
        </div>

        <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-100/60">
          <div className="flex items-center justify-between">
            <span className="text-caption font-medium text-emerald-700">{t('charts.legendSubmissions')}</span>
            <FileCheck2 className="size-3.5 text-emerald-500" />
          </div>
          <p className="mt-1 text-h3 font-bold text-emerald-900">{formatNumber(totalSubmissions)}</p>
        </div>

        <div className="rounded-xl bg-primary-50/60 p-3 border border-primary-100/60">
          <div className="flex items-center justify-between">
            <span className="text-caption font-medium text-primary-700">کل تعاملات ۷ روز</span>
            <TrendingUp className="size-3.5 text-primary-500" />
          </div>
          <p className="mt-1 text-h3 font-bold text-primary-900">{formatNumber(totalVolume)}</p>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative mt-6 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id={`${idPrefix}-msg-grad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-inq-grad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-sub-grad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid horizontal lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + innerHeight * (1 - ratio);
            const val = Math.round(roundedMax * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-neutral-400 font-sans"
                >
                  {formatNumber(val)}
                </text>
              </g>
            );
          })}

          {/* Messages Area & Line */}
          {(activeTab === 'all' || activeTab === 'messages') && (
            <>
              <path
                d={buildAreaPath(messageValues)}
                fill={`url(#${idPrefix}-msg-grad)`}
                className="transition-all duration-300"
              />
              <path
                d={buildSmoothPath(messageValues)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </>
          )}

          {/* Inquiries Area & Line */}
          {(activeTab === 'all' || activeTab === 'inquiries') && (
            <>
              <path
                d={buildAreaPath(inquiryValues)}
                fill={`url(#${idPrefix}-inq-grad)`}
                className="transition-all duration-300"
              />
              <path
                d={buildSmoothPath(inquiryValues)}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </>
          )}

          {/* Submissions Area & Line */}
          {(activeTab === 'all' || activeTab === 'submissions') && (
            <>
              <path
                d={buildAreaPath(submissionValues)}
                fill={`url(#${idPrefix}-sub-grad)`}
                className="transition-all duration-300"
              />
              <path
                d={buildSmoothPath(submissionValues)}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </>
          )}

          {/* X Axis labels */}
          {points.map((p, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g key={p.date}>
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered ? 'fill-primary-600 font-bold' : 'fill-neutral-500'
                  }`}
                >
                  {formatPersianDate(p.date)}
                </text>
              </g>
            );
          })}

          {/* Hover Crosshair & Data Points */}
          {hoveredIndex !== null && (
            <g className="pointer-events-none transition-all">
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={paddingTop + innerHeight}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {(activeTab === 'all' || activeTab === 'messages') && (
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(points[hoveredIndex]!.messages)}
                  r="5"
                  fill="#ffffff"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
              )}

              {(activeTab === 'all' || activeTab === 'inquiries') && (
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(points[hoveredIndex]!.inquiries)}
                  r="5"
                  fill="#ffffff"
                  stroke="#f59e0b"
                  strokeWidth="3"
                />
              )}

              {(activeTab === 'all' || activeTab === 'submissions') && (
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(points[hoveredIndex]!.submissions)}
                  r="5"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="3"
                />
              )}
            </g>
          )}

          {/* Invisible hover trigger columns */}
          {points.map((_, i) => {
            const x = getX(i);
            const colWidth = innerWidth / (points.length - 1);
            return (
              <rect
                key={i}
                x={x - colWidth / 2}
                y={paddingTop}
                width={colWidth}
                height={innerHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute z-20 flex flex-col gap-1.5 rounded-xl border border-neutral-200/90 bg-neutral-900/90 px-3.5 py-2.5 text-white shadow-xl backdrop-blur-md transition-all duration-150"
            style={{
              top: '15px',
              left: `${Math.min(
                Math.max(10, (getX(hoveredIndex) / width) * 100),
                80,
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1 text-caption font-semibold text-neutral-300">
              <span>{formatPersianDate(activePoint.date)}</span>
              <span className="font-mono text-[10px] text-neutral-400">{activePoint.date}</span>
            </div>

            <div className="flex flex-col gap-1 text-caption">
              {(activeTab === 'all' || activeTab === 'messages') && (
                <div className="flex items-center justify-between gap-3 text-blue-300">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-400" />
                    پیام‌های بات:
                  </span>
                  <span className="font-bold">{formatNumber(activePoint.messages)}</span>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'inquiries') && (
                <div className="flex items-center justify-between gap-3 text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-400" />
                    استعلام‌ها:
                  </span>
                  <span className="font-bold">{formatNumber(activePoint.inquiries)}</span>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'submissions') && (
                <div className="flex items-center justify-between gap-3 text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    نظرات و منابع:
                  </span>
                  <span className="font-bold">{formatNumber(activePoint.submissions)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
