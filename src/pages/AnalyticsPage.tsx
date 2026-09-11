import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Building2,
  Package,
  Sparkles,
  ArrowUpRight,
  Globe2,
  Clock,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const AnalyticsPage: React.FC = () => {
  const [granularity, setGranularity] = useState<'monthly' | 'quarterly'>('monthly');

  const gmvData = [
    { month: 'Oct 2025', gmvInr: 1850000, volumeKg: 32000 },
    { month: 'Nov 2025', gmvInr: 2420000, volumeKg: 44000 },
    { month: 'Dec 2025', gmvInr: 3100000, volumeKg: 58000 },
    { month: 'Jan 2026', gmvInr: 3950000, volumeKg: 72000 },
    { month: 'Feb 2026', gmvInr: 4800000, volumeKg: 89000 },
    { month: 'Mar 2026', gmvInr: 5840000, volumeKg: 104000 }
  ];

  const supplyDemandData = [
    { category: 'Cardboard', supplyKg: 42000, demandKg: 48000 },
    { category: 'Plastic', supplyKg: 28000, demandKg: 31000 },
    { category: 'Pallets', supplyKg: 16000, demandKg: 19500 },
    { category: 'Paper', supplyKg: 14000, demandKg: 12000 },
    { category: 'Glass', supplyKg: 6500, demandKg: 5200 },
    { category: 'Metal', supplyKg: 8200, demandKg: 9400 }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E3ECE6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
              Macro Intelligence
            </span>
            <span className="text-xs text-[#63766B] font-medium">
              Regional Material Flow & Secondary Market Pricing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            Exchange Analytics & Market Dynamics
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Real-time liquidity, supply-demand matching ratios, and material turnover velocities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGranularity('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              granularity === 'monthly'
                ? 'bg-[#16382C] text-white'
                : 'bg-white border border-[#DCE5DE] text-[#45574C]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setGranularity('quarterly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              granularity === 'quarterly'
                ? 'bg-[#16382C] text-white'
                : 'bg-white border border-[#DCE5DE] text-[#45574C]'
            }`}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5D7065] font-semibold">Total Exchange GMV</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-[#16382C]">
            ₹2.19 Cr
          </span>
          <p className="text-[11px] text-emerald-800 font-semibold mt-1">
            +28.4% month-over-month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5D7065] font-semibold">Active Enterprises</span>
            <Building2 className="w-4 h-4 text-[#16382C]" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-[#162720]">
            1,280
          </span>
          <p className="text-[11px] text-[#55675D] font-medium mt-1">
            Across Gujarat & Maharashtra
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5D7065] font-semibold">Average Match Score</span>
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-emerald-800">
            91.4%
          </span>
          <p className="text-[11px] text-[#55675D] font-medium mt-1">
            Sub-45 km median freight distance
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DFE7E1] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#5D7065] font-semibold">Turnover Velocity</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <span className="text-3xl font-extrabold font-mono text-[#143227]">
            2.8 Days
          </span>
          <p className="text-[11px] text-[#55675D] font-medium mt-1">
            Average listing time to match
          </p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GMV Trajectory */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DFE7E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF3F0]">
            <div>
              <h3 className="font-bold text-base text-[#162720]">
                Marketplace Trading Volume (INR)
              </h3>
              <p className="text-xs text-[#5D6F64]">
                Cumulative gross material values transacted through CIRCULA
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              ₹58.4L in March
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gmvData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBF2EC" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6C7E74' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6C7E74' }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'GMV']}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#D8E3DC',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="gmvInr" fill="#16382C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supply vs Demand */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#DFE7E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF3F0]">
            <div>
              <h3 className="font-bold text-base text-[#162720]">
                Supply vs. Demand (kg)
              </h3>
              <p className="text-xs text-[#5D6F64]">
                Available surplus inventory vs. active procurement requests
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyDemandData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBF2EC" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6C7E74' }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#162720' }} width={70} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} kg`]}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#D8E3DC',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="supplyKg" name="Listed Supply" fill="#16382C" radius={[0, 4, 4, 0]} />
                <Bar dataKey="demandKg" name="Active Demand" fill="#569E7B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
