import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Leaf,
  TrendingDown,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Truck,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/dashboard/KpiCard';
import { CircularityScoreCard } from '../components/dashboard/CircularityScoreCard';
import { MaterialFlowVisualizer } from '../components/dashboard/MaterialFlowVisualizer';
import { MatchCard } from '../components/matches/MatchCard';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userStats, matches, transactions, setIsAiAssistantOpen } =
    useApp();

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Operations Control
            </span>
            <span className="text-xs text-[#7A8D81]">•</span>
            <span className="text-xs text-[#52655B] font-medium">
              {currentUser?.city || 'Industrial'} Plant NEXUS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15251F] tracking-tight">
            Good morning, {currentUser?.name || 'Partner'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Your circular packaging exchange overview, live telemetry, and algorithmic matches.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAiAssistantOpen(true)}
            icon={<Sparkles className="w-3.5 h-3.5 text-emerald-700" />}
          >
            Ask Circular AI
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/materials/new')}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            List Surplus Material
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid (Section 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Materials Exchanged"
          value="2,450 kg"
          subtitle="4.8 tonnes total volume moved"
          change={{ value: '18% vs last quarter', positive: true }}
          icon={<Package className="w-4 h-4 text-[#16382C]" />}
          color="emerald"
        />

        <KpiCard
          title="Waste Diverted"
          value="4.8 t"
          subtitle="Landfill diversion rate 84%"
          change={{ value: '1.2 t added this month', positive: true }}
          icon={<Leaf className="w-4 h-4 text-emerald-700" />}
          color="emerald"
        />

        <KpiCard
          title="Carbon Avoided"
          value="3.2 t CO₂e"
          subtitle="Scope 3 Category 1 reduction"
          change={{ value: 'Equal to 142 trees planted', positive: true }}
          icon={<TrendingDown className="w-4 h-4 text-[#16382C]" />}
          color="green"
        />

        <KpiCard
          title="Cost Savings"
          value="₹48,500"
          subtitle="34% below virgin market rates"
          change={{ value: '₹12,400 saved this week', positive: true }}
          icon={<Sparkles className="w-4 h-4 text-amber-700" />}
          color="sage"
        />
      </div>

      {/* Middle Row: Circularity Score & Material Flow Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <CircularityScoreCard />
        </div>
        <div className="lg:col-span-8">
          <MaterialFlowVisualizer />
        </div>
      </div>

      {/* Recommended Smart Matches Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h2 className="text-lg sm:text-xl font-bold text-[#162620]">
                High-Affinity Circular Matches
              </h2>
            </div>
            <p className="text-xs text-[#5D7065] mt-0.5">
              Algorithmically ranked by material polymer grade, proximity radius, and batch compatibility
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/matches')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            View All Matches ({matches.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.slice(0, 2).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      {/* Recent Activity & Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Exchanges / Transactions */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#EEF3F0] mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#162620]">
                Active Material Exchanges
              </h3>
              <p className="text-xs text-[#5D7065]">
                Real-time tracking of confirmed shipments and custody transfers
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/transactions')}
            >
              All Orders
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 3).map((tx) => (
              <div
                key={tx.id}
                onClick={() => navigate(`/transactions/${tx.id}`)}
                className="p-3.5 rounded-xl bg-[#FAFCFA] border border-[#E3ECE6] hover:border-emerald-600 hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF2EC] text-[#16382C] flex items-center justify-center font-bold shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#182620]">
                        {tx.materialTitle}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C6E64] mt-0.5">
                      Counterparty: <strong>{tx.supplierCompany?.name || tx.supplier?.name || 'Counterparty'}</strong> • {tx.quantity} {tx.unit}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="font-mono font-bold text-xs text-[#16382C] block">
                    ₹{(tx.totalAmountInr ?? tx.totalInr ?? 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold">
                    {tx.co2SavedTonnes ?? tx.estimatedCo2AvoidedTonnes ?? 0} t CO₂e Avoided
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Circular Action Prompts & Insights */}
        <div className="lg:col-span-5 bg-[#F6FAF7] rounded-2xl border border-[#DCE8DF] p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Circular Strategy Recommendation</span>
            </div>
            <h4 className="text-base font-bold text-[#162720] mb-1.5">
              Increase Pallet Recovery by 15%
            </h4>
            <p className="text-xs text-[#3E5146] leading-relaxed">
              Based on your monthly dispatch velocity, you are utilizing 120 standard wooden pallets that could be claimed from nearby logistics hubs at Changodar for an estimated ₹12,400 monthly savings.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#DCE7DF] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#2D3E35]">Next Step:</span>
              <span className="text-emerald-800 font-bold">2 suppliers available</span>
            </div>
            <p className="text-[11px] text-[#5A6C62]">
              EPAL standard certified pallets located within 22 km.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/impact')}
            >
              Carbon Simulator
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/marketplace?category=Pallets')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              View Pallets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
