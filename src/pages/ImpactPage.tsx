import React, { useState } from 'react';
import {
  Leaf,
  TrendingDown,
  TrendingUp,
  Scale,
  Droplets,
  Package,
  Sparkles,
  Download,
  Share2,
  FileText,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/dashboard/KpiCard';
import { CarbonCalculator } from '../components/impact/CarbonCalculator';
import { Button } from '../components/common/Button';

export const ImpactPage: React.FC = () => {
  const { userStats, monthlyImpactHistory, triggerToast } = useApp();
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('6m');

  const categoryDistribution = [
    { name: 'Cardboard', value: 52, color: '#16382C' },
    { name: 'Plastic', value: 28, color: '#2C6E53' },
    { name: 'Pallets', value: 14, color: '#569E7B' },
    { name: 'Other', value: 6, color: '#97C4AE' }
  ];

  const handleDownloadCertificate = () => {
    triggerToast(
      'ESG Certificate Generated',
      'Scope 3 GHG & Circularity Audit Certificate #CIRC-2026-894 compiled as PDF.'
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E3ECE6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
              ESG Scope 3 Accounting
            </span>
            <span className="text-xs text-[#63766B] font-medium">
              GHG Protocol & WARM v15 Standards
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            Your Circular Impact & Carbon Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Audit-ready reporting on avoided virgin materials, landfill diversion, and embodied carbon abatement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCertificate}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download ESG Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              triggerToast(
                'Ledger Synced',
                'Telemetry synced with your SAP / Oracle ERP emissions module.'
              )
            }
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Sync to ERP
          </Button>
        </div>
      </div>

      {/* KPI Headline Summary (Section 24) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-[#5D6F64] mb-1">
            <Package className="w-3.5 h-3.5 text-[#16382C]" />
            <span>Materials Exchanged</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-[#162720] block">
            2,450 kg
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
            +18% vs Q3
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-[#5D6F64] mb-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>Waste Diverted</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-emerald-800 block">
            4.8 t
          </span>
          <span className="text-[11px] text-[#55675D] font-medium mt-1 block">
            Zero landfill compliance
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-[#5D6F64] mb-1">
            <Scale className="w-3.5 h-3.5 text-[#16382C]" />
            <span>Virgin Avoided</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-[#162720] block">
            3,400 kg
          </span>
          <span className="text-[11px] text-[#55675D] font-medium mt-1 block">
            Raw fiber displaced
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-[#5D6F64] mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
            <span>Carbon Avoided</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-emerald-800 block">
            3.2 t CO₂e
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
            Scope 3 Cat 1
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-[#5D6F64] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>Cost Savings</span>
          </div>
          <span className="text-2xl font-extrabold font-mono text-[#143227] block">
            ₹48,500
          </span>
          <span className="text-[11px] text-[#55675D] font-medium mt-1 block">
            34% below virgin
          </span>
        </div>
      </div>

      {/* Historical Charts (Section 43) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carbon & Volume Trajectory (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#DFE7E1] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EEF3F0]">
            <div>
              <h3 className="font-bold text-base text-[#162720]">
                Avoided Lifecycle Emissions & Volume Exchanged
              </h3>
              <p className="text-xs text-[#5E7166]">
                Monthly trajectory (October 2025 – March 2026)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-[#16382C] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16382C]" />
                Volume (kg)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                CO₂e Avoided (t)
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyImpactHistory}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16382C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16382C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#6C7E74' }}
                  axisLine={{ stroke: '#E2ECE5' }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#6C7E74' }}
                  axisLine={{ stroke: '#E2ECE5' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#6C7E74' }}
                  axisLine={{ stroke: '#E2ECE5' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    borderColor: '#D8E3DC',
                    fontSize: '12px'
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="volumeKg"
                  stroke="#16382C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#volGrad)"
                  name="Volume (kg)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="co2AvoidedTonnes"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="none"
                  name="CO₂e Avoided (t)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Stream Breakdown Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#DFE7E1] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#162720]">
              Exchange Category Distribution
            </h3>
            <p className="text-xs text-[#5E7166]">
              Share of recovered materials by mass
            </p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-base font-extrabold text-[#16382C]">
                2,450 kg
              </span>
              <span className="text-[10px] text-[#718479]">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-2 border-t border-[#EEF3F0] text-xs">
            {categoryDistribution.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-[#3F5146] font-medium">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-[#182620]">
                  {c.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Carbon Calculator (Section 44 & 45) */}
      <CarbonCalculator />

      {/* Scope 3 Audit Certification Banner */}
      <div className="p-6 rounded-3xl bg-[#16382C] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">
              Compliant with GHG Protocol Corporate Standard
            </h4>
            <p className="text-xs text-emerald-100/80 mt-0.5 max-w-xl">
              All circular transfers are verified by signed digital waybills and automated emission reduction certificates recognized under India BRSR and EU CSRD guidelines.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={handleDownloadCertificate}
          icon={<Download className="w-3.5 h-3.5" />}
          className="shrink-0"
        >
          Generate Certificate
        </Button>
      </div>
    </div>
  );
};
