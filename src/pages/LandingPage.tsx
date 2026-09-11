import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Leaf,
  Recycle,
  Building2,
  TrendingDown,
  TrendingUp,
  Truck,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpRight,
  BarChart3,
  Factory,
  Globe2,
  MapPin,
  Clock,
  Compass,
  Zap,
  Check
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { BRAND_IMAGES, CATEGORY_SHOWCASE } from '../data/brandAssets';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory, setIsAiAssistantOpen } = useApp();
  const [activeStoryStep, setActiveStoryStep] = useState<number>(0);

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F3] text-[#16211B] selection:bg-[#DCE9DA] selection:text-[#123C2B]">
      {/* ── TOP EDITORIAL NAVIGATION ── */}
      <header className="sticky top-0 z-40 bg-[#FBFCF8]/95 backdrop-blur-md border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#123C2B] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1C4E3A] transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-xl font-extrabold text-[#123C2B] tracking-wider font-display">
                CIRCULA
              </span>
              <span className="text-[10px] font-semibold text-[#657169] tracking-widest uppercase mt-0.5">
                Circular Materials Exchange
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#657169]">
            <a href="#how-it-works" className="hover:text-[#123C2B] transition-colors">
              How It Works
            </a>
            <a href="#categories" className="hover:text-[#123C2B] transition-colors">
              Materials
            </a>
            <a href="#smart-matching" className="hover:text-[#123C2B] transition-colors">
              Smart Matches
            </a>
            <a href="#material-story" className="hover:text-[#123C2B] transition-colors">
              Exchange Flow
            </a>
            <a href="#carbon-impact" className="hover:text-[#123C2B] transition-colors">
              Carbon Impact
            </a>
            <a href="#opportunity-map" className="hover:text-[#123C2B] transition-colors">
              Opportunity Map
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-[#123C2B] hover:bg-[#EEF2E8] px-3.5 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Launch Platform
            </Button>
          </div>
        </div>
      </header>

      {/* ── 1. EDITORIAL SPLIT-SCREEN HERO ── */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE9DA] border border-[#CBD6CA] text-xs font-bold text-[#123C2B] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse" />
                <span>CIRCULAR MATERIALS EXCHANGE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#123C2B] tracking-tight leading-[1.08] font-display">
                TURN PACKAGING WASTE INTO BUSINESS VALUE.
              </h1>

              <p className="text-base sm:text-lg text-[#657169] leading-relaxed max-w-xl">
                CIRCULA connects businesses with surplus packaging materials, nearby buyers and optimized logistics — turning waste into measurable economic and environmental value.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/marketplace')}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="w-full sm:w-auto px-8"
                >
                  EXPLORE MATERIALS
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/materials/new')}
                  className="w-full sm:w-auto px-8"
                >
                  LIST YOUR MATERIAL
                </Button>
              </div>

              {/* Visual story tag */}
              <div className="pt-4 flex items-center gap-6 border-t border-[#DDE4DC] max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
                  <span className="text-xs font-semibold text-[#16211B]">Zero Virgin Packaging Goal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D5B]" />
                  <span className="text-xs font-semibold text-[#16211B]">Sub-100km Regional Clusters</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Large High-Quality Realistic Image with Floating Data Panel */}
            <div className="lg:col-span-6 relative">
              {/* Subtle animated circular movement indicator */}
              <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE4DC] shadow-xs text-[11px] font-bold text-[#123C2B] z-20">
                <span className="font-mono text-[#2E7D5B]">FLOW:</span>
                <span>MATERIAL</span>
                <span>→</span>
                <span>MATCH</span>
                <span>→</span>
                <span>EXCHANGE</span>
                <span>→</span>
                <span>IMPACT</span>
              </div>

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-[#DDE4DC] shadow-sm bg-white aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={BRAND_IMAGES.heroWarehouse}
                  alt="Modern clean packaging logistics facility with daylight and organized cardboard inventory"
                  className="w-full h-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                {/* Subtle soft gradient scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#123C2B]/60 via-transparent to-black/10" />

                {/* Floating Glass/White Product Data Panel (Floating over bottom-left of the image) */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#DDE4DC] shadow-lg text-left">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#DDE4DC]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B] animate-ping" />
                      <span className="font-mono font-extrabold text-sm text-[#123C2B]">
                        2,500 KG
                      </span>
                    </div>
                    <Badge variant="emerald" size="sm">
                      AVAILABLE
                    </Badge>
                  </div>

                  <div className="py-2.5 space-y-1">
                    <div className="text-xs font-extrabold text-[#16211B] uppercase tracking-wider font-display">
                      CORRUGATED CARDBOARD
                    </div>
                    <p className="text-[11px] text-[#657169]">
                      Double-wall slotted containers • Clean dry stored
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#DDE4DC] text-center">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#657169] block">
                        Price
                      </span>
                      <span className="font-mono font-bold text-xs text-[#123C2B]">
                        ₹8.50 / KG
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#657169] block">
                        Proximity
                      </span>
                      <span className="font-mono font-bold text-xs text-[#16211B]">
                        32 KM AWAY
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#657169] block">
                        CO₂e Avoided
                      </span>
                      <span className="font-mono font-bold text-xs text-[#2E7D5B]">
                        1.8 T CO₂e
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUSTED ECOSYSTEM & LIVE TELEMETRY STATISTICS ── */}
      <section className="py-12 bg-white border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
                Verified Platform Telemetry
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#123C2B] mt-0.5 font-display">
                Industrial Circularity Network Statistics
              </h2>
            </div>
            <span className="text-xs text-[#657169] font-mono">
              Live Regional Aggregates (FY 2026)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#123C2B] font-mono tracking-tight block">
                12,450+
              </span>
              <span className="text-xs text-[#657169] font-semibold mt-1 block">
                Materials Exchanged
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#123C2B] font-mono tracking-tight block">
                1,280+
              </span>
              <span className="text-xs text-[#657169] font-semibold mt-1 block">
                Businesses Connected
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2E7D5B] font-mono tracking-tight block">
                8,920+
              </span>
              <span className="text-xs text-[#657169] font-semibold mt-1 block">
                Tonnes Waste Diverted
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2E7D5B] font-mono tracking-tight block">
                32.4K
              </span>
              <span className="text-xs text-[#657169] font-semibold mt-1 block">
                Tonnes CO₂e Avoided
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC] col-span-2 md:col-span-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#123C2B] font-mono tracking-tight block">
                ₹4.8 Cr
              </span>
              <span className="text-xs text-[#657169] font-semibold mt-1 block">
                Estimated Business Savings
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MATERIAL CATEGORIES (Cardboard, Plastic, Pallets, Paper, Glass, Reusable Packaging) ── */}
      <section id="categories" className="py-20 sm:py-24 bg-[#F7F8F3] border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
                Material Taxonomy
              </span>
              <h2 className="text-3xl font-extrabold text-[#123C2B] mt-1 tracking-tight font-display">
                Packaging Material Streams
              </h2>
              <p className="text-sm text-[#657169] mt-1">
                Explore active circular inventory with live volume, audited pricing benchmarks, and avoided emissions.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/marketplace')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Browse All Materials
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_SHOWCASE.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group bg-white rounded-2xl border border-[#DDE4DC] overflow-hidden hover:border-[#123C2B]/40 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="sage" size="sm">
                      {cat.availableVolume}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#123C2B]/90 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg font-mono font-bold">
                    Avg {cat.avgPrice}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#16211B] group-hover:text-[#123C2B] transition-colors font-display">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#2E7D5B] mt-0.5">
                      {cat.headline}
                    </p>
                    <p className="text-xs text-[#657169] mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#DDE4DC] flex items-center justify-between text-xs">
                    <span className="text-[#657169]">
                      Impact: <strong className="text-[#123C2B]">{cat.avoidedCo2PerTonne}</strong>
                    </span>
                    <span className="font-bold text-[#123C2B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Stream →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW CIRCULA WORKS (MATERIAL → MATCH → MOVE → MEASURE) ── */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-white border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
              Closed-Loop Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123C2B] mt-1 tracking-tight font-display">
              How CIRCULA Works
            </h2>
            <p className="text-sm sm:text-base text-[#657169] mt-3">
              A frictionless four-stage operational workflow connecting industrial surplus packaging directly into nearby supply chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC] relative">
              <span className="font-mono text-xs font-extrabold text-[#123C2B] bg-[#DCE9DA] px-2.5 py-1 rounded-md mb-4 inline-block">
                01 / MATERIAL
              </span>
              <h3 className="text-lg font-bold text-[#16211B] mb-2 font-display">LIST INVENTORY</h3>
              <p className="text-xs sm:text-sm text-[#657169] leading-relaxed">
                List surplus corrugated cardboard, polymer film, or heat-treated pallets with automated photo scanning and specification benchmarking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC] relative">
              <span className="font-mono text-xs font-extrabold text-[#123C2B] bg-[#DCE9DA] px-2.5 py-1 rounded-md mb-4 inline-block">
                02 / MATCH
              </span>
              <h3 className="text-lg font-bold text-[#16211B] mb-2 font-display">SMART COMPATIBILITY</h3>
              <p className="text-xs sm:text-sm text-[#657169] leading-relaxed">
                Autonomous graph matching pairs your material with manufacturers within an optimal 100km corridor based on technical grade and recurring demand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC] relative">
              <span className="font-mono text-xs font-extrabold text-[#123C2B] bg-[#DCE9DA] px-2.5 py-1 rounded-md mb-4 inline-block">
                03 / MOVE
              </span>
              <h3 className="text-lg font-bold text-[#16211B] mb-2 font-display">OPTIMIZED LOGISTICS</h3>
              <p className="text-xs sm:text-sm text-[#657169] leading-relaxed">
                Automate vehicle dispatch, backhaul consolidation, digital chain-of-custody transfer, and transit tracking to minimize haulage emissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC] relative">
              <span className="font-mono text-xs font-extrabold text-[#123C2B] bg-[#DCE9DA] px-2.5 py-1 rounded-md mb-4 inline-block">
                04 / MEASURE
              </span>
              <h3 className="text-lg font-bold text-[#16211B] mb-2 font-display">AUDITED IMPACT</h3>
              <p className="text-xs sm:text-sm text-[#657169] leading-relaxed">
                Generate downloadable Scope 3 carbon reduction certificates, virgin material displacement credits, and financial savings ledgers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SMART MATCHING VISUAL ── */}
      <section id="smart-matching" className="py-20 sm:py-24 bg-[#F7F8F3] border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
                Algorithmic Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123C2B] tracking-tight leading-snug font-display">
                Waste is only waste when it has nowhere to go.
              </h2>
              <p className="text-sm sm:text-base text-[#657169] leading-relaxed">
                CIRCULA replaces arbitrary broker phone calls with deterministic multi-parameter matching: material grade, moisture thresholds, vehicle weight limits, and geographic clusters.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#16211B] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                  <span>Sub-second grade and moisture compatibility validation</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#16211B] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                  <span>Real-time logistics corridor feasibility calculation</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#16211B] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                  <span>Automated virgin price parity and net payback tracking</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/matches')}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Explore Smart Matches
                </Button>
              </div>
            </div>

            {/* Smart Matching Interface Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-[#DDE4DC] shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DDE4DC]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" />
                    <span className="text-xs font-bold text-[#123C2B] uppercase tracking-wider">
                      Live Demonstration Match
                    </span>
                  </div>
                  <Badge variant="sage" size="md">
                    94% COMPATIBILITY SCORE
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Supplier Card */}
                  <div className="p-4 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#657169]">
                      Origin / Supplier
                    </span>
                    <p className="font-bold text-sm text-[#16211B] mt-1 font-display">
                      ABC Packaging Pvt Ltd
                    </p>
                    <p className="text-xs text-[#657169] mt-0.5">
                      2,500 kg Surplus Corrugated Cardboard
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono text-[#2E7D5B] font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Ahmedabad Hub (Facility 4)</span>
                    </div>
                  </div>

                  {/* Buyer Card */}
                  <div className="p-4 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#657169]">
                      Destination / Buyer
                    </span>
                    <p className="font-bold text-sm text-[#16211B] mt-1 font-display">
                      XYZ / ABC Manufacturing
                    </p>
                    <p className="text-xs text-[#657169] mt-0.5">
                      Needs 2,000–3,000 kg Secondary Packaging
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono text-[#2E7D5B] font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Sanand Industrial Estate</span>
                    </div>
                  </div>
                </div>

                {/* Match Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#DCE9DA]/40 border border-[#CBD6CA] text-center">
                  <div>
                    <span className="text-[11px] text-[#657169] block">Transit Distance</span>
                    <span className="font-mono font-extrabold text-sm sm:text-base text-[#123C2B]">
                      32 km
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#657169] block">Net Savings</span>
                    <span className="font-mono font-extrabold text-sm sm:text-base text-[#2E7D5B]">
                      ₹14,500
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#657169] block">Carbon Avoided</span>
                    <span className="font-mono font-extrabold text-sm sm:text-base text-[#123C2B]">
                      1.8 t CO₂e
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[#657169]">
                  <span>Algorithmic confidence verified with zero manual brokerage</span>
                  <Link
                    to="/matches/match-101"
                    className="font-bold text-[#123C2B] hover:underline flex items-center gap-1"
                  >
                    <span>View match details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. REAL-WORLD MATERIAL EXCHANGE STORY ── */}
      <section id="material-story" className="py-20 sm:py-24 bg-white border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
              Case Study & Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123C2B] mt-1 tracking-tight font-display">
              ONE COMPANY'S WASTE. ANOTHER COMPANY'S RESOURCE.
            </h2>
            <p className="text-sm sm:text-base text-[#657169] mt-3">
              See how 2,500 kg of post-production corrugated cardboard flowed through CIRCULA's network with zero landfill diversion.
            </p>
          </div>

          {/* Sequential Chain Flow Diagram */}
          <div className="bg-[#F7F8F3] rounded-3xl border border-[#DDE4DC] p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              {/* Step 1: Supplier */}
              <div className="flex-1 w-full p-5 rounded-2xl bg-white border border-[#DDE4DC] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#123C2B] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span className="text-xs font-bold text-[#657169] uppercase tracking-wider">
                    SURPLUS GENERATION
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#16211B] font-display">ABC Packaging</h4>
                <p className="text-xs font-mono font-bold text-[#123C2B] mt-0.5">
                  2,500 KG Surplus Cardboard
                </p>
                <p className="text-[11px] text-[#657169] mt-2">
                  Double-wall die cut overrun from high-speed packaging run.
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="flex items-center justify-center text-[#2E7D5B] font-mono text-xs font-bold rotate-90 md:rotate-0">
                <span>↓</span>
              </div>

              {/* Step 2: Algorithmic Match */}
              <div className="flex-1 w-full p-5 rounded-2xl bg-white border border-[#DDE4DC] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#2E7D5B] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span className="text-xs font-bold text-[#657169] uppercase tracking-wider">
                    CIRCULA ENGINE
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#16211B] font-display">CIRCULA Intelligence</h4>
                <p className="text-xs font-mono font-bold text-[#2E7D5B] mt-0.5">
                  94% Compatibility Match
                </p>
                <p className="text-[11px] text-[#657169] mt-2">
                  Automated fluting & burst strength compatibility verification.
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="flex items-center justify-center text-[#2E7D5B] font-mono text-xs font-bold rotate-90 md:rotate-0">
                <span>↓</span>
              </div>

              {/* Step 3: Buyer Demand */}
              <div className="flex-1 w-full p-5 rounded-2xl bg-white border border-[#DDE4DC] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#123C2B] text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span className="text-xs font-bold text-[#657169] uppercase tracking-wider">
                    RECEPTIVE BUYER
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#16211B] font-display">XYZ Manufacturing</h4>
                <p className="text-xs font-mono font-bold text-[#123C2B] mt-0.5">
                  2,000 KG Active Demand
                </p>
                <p className="text-[11px] text-[#657169] mt-2">
                  Used directly for protective crating and parts transit.
                </p>
              </div>

              {/* Arrow 3 */}
              <div className="flex items-center justify-center text-[#2E7D5B] font-mono text-xs font-bold rotate-90 md:rotate-0">
                <span>↓</span>
              </div>

              {/* Step 4: Move & Impact */}
              <div className="flex-1 w-full p-5 rounded-2xl bg-[#DCE9DA]/60 border border-[#CBD6CA] text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#123C2B] text-white flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span className="text-xs font-bold text-[#123C2B] uppercase tracking-wider">
                    DELIVERY & IMPACT
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#123C2B] font-display">Optimized Delivery</h4>
                <p className="text-xs font-mono font-bold text-[#2E7D5B] mt-0.5">
                  112 KM • 1.7 T CO₂e AVOIDED
                </p>
                <p className="text-[11px] text-[#657169] mt-2">
                  Backhaul freight consolidation with verified digital bill of lading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. LOGISTICS OPTIMIZATION ── */}
      <section className="py-20 sm:py-24 bg-[#F7F8F3] border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-[#DDE4DC] shadow-sm aspect-[4/3]">
              <img
                src={BRAND_IMAGES.logisticsTruck}
                alt="Green logistics fleet carrying recycled packaging materials"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123C2B]/80 via-transparent to-black/10" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <Badge variant="emerald" size="sm">
                  FLEET OPTIMIZATION
                </Badge>
                <h4 className="text-xl font-bold font-display">
                  Dynamic Backhaul Load Balancing
                </h4>
                <p className="text-xs text-white/80 leading-relaxed max-w-md">
                  Eliminating empty transit miles by scheduling return legs with verified circular materials.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
                Intelligent Transport Routing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123C2B] tracking-tight leading-snug font-display">
                Circular materials should never travel further than necessary.
              </h2>
              <p className="text-sm sm:text-base text-[#657169] leading-relaxed">
                Logistics accounts for up to 30% of secondary material costs. CIRCULA's route engine automatically clusters transactions into high-density industrial corridors to minimize ton-kilometer transit emissions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#DDE4DC]">
                  <div className="w-8 h-8 rounded-xl bg-[#EEF2E8] text-[#123C2B] flex items-center justify-center font-bold mb-3">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#16211B] font-display">Corridor Clustering</h4>
                  <p className="text-xs text-[#657169] mt-1">
                    Groups deliveries within regional manufacturing hubs to minimize deadhead distance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#DDE4DC]">
                  <div className="w-8 h-8 rounded-xl bg-[#EEF2E8] text-[#123C2B] flex items-center justify-center font-bold mb-3">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#16211B] font-display">Transit CO₂ Calculation</h4>
                  <p className="text-xs text-[#657169] mt-1">
                    Computes GLEC-compliant well-to-wheel greenhouse gas figures for every delivery.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/logistics')}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  View Logistics Center
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. AUDIT-READY CARBON IMPACT ── */}
      <section id="carbon-impact" className="py-20 sm:py-24 bg-white border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
              Audit-Ready Carbon Accounting
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123C2B] mt-1 tracking-tight font-display">
              Every exchange creates measurable impact.
            </h2>
            <p className="text-sm sm:text-base text-[#657169] mt-3">
              Generate defensible ESG sustainability reports for BRSR, CSRD, and GHG Protocol Scope 3 Category 1 and Category 5 reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2E8] text-[#123C2B] mx-auto flex items-center justify-center mb-3">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#123C2B] font-mono block">
                100%
              </span>
              <span className="text-xs text-[#657169] font-medium mt-1 block">Material Reused</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2E8] text-[#123C2B] mx-auto flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#123C2B] font-mono block">
                8.9k t
              </span>
              <span className="text-xs text-[#657169] font-medium mt-1 block">Waste Diverted</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2E8] text-[#123C2B] mx-auto flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#123C2B] font-mono block">
                6.2k t
              </span>
              <span className="text-xs text-[#657169] font-medium mt-1 block">Virgin Avoided</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2E8] text-[#123C2B] mx-auto flex items-center justify-center mb-3">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#123C2B] font-mono block">
                32.4k t
              </span>
              <span className="text-xs text-[#657169] font-medium mt-1 block">CO₂e Avoided</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F3] border border-[#DDE4DC]">
              <div className="w-10 h-10 rounded-xl bg-[#DCE9DA] text-[#123C2B] mx-auto flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#123C2B] font-mono block">
                ₹4.8 Cr
              </span>
              <span className="text-xs text-[#657169] font-medium mt-1 block">Financial Savings</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/impact')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Explore ESG & Carbon Calculator
            </Button>
          </div>
        </div>
      </section>

      {/* ── 9. CIRCULAR OPPORTUNITY MAP PREVIEW ── */}
      <section id="opportunity-map" className="py-20 sm:py-24 bg-[#F7F8F3] border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5B]">
                Geographic Clustering
              </span>
              <h2 className="text-3xl font-extrabold text-[#123C2B] mt-1 tracking-tight font-display">
                Circular Opportunity Map
              </h2>
              <p className="text-sm text-[#657169] mt-1">
                Explore real-time regional packaging density across active industrial clusters.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/opportunity-map')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Open Interactive Map
            </Button>
          </div>

          {/* Interactive Visual Map Preview Container */}
          <div className="bg-white rounded-3xl border border-[#DDE4DC] p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[#F7F8F3] border border-[#DDE4DC]">
                <span className="text-[10px] font-bold text-[#657169] uppercase tracking-wider">Cluster 1</span>
                <p className="font-bold text-sm text-[#16211B] mt-0.5 font-display">Ahmedabad - Sanand</p>
                <span className="font-mono text-xs font-bold text-[#2E7D5B]">3,420 Tonnes Active</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F8F3] border border-[#DDE4DC]">
                <span className="text-[10px] font-bold text-[#657169] uppercase tracking-wider">Cluster 2</span>
                <p className="font-bold text-sm text-[#16211B] mt-0.5 font-display">Pune - Chakan</p>
                <span className="font-mono text-xs font-bold text-[#2E7D5B]">2,850 Tonnes Active</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F8F3] border border-[#DDE4DC]">
                <span className="text-[10px] font-bold text-[#657169] uppercase tracking-wider">Cluster 3</span>
                <p className="font-bold text-sm text-[#16211B] mt-0.5 font-display">NCR - Manesar</p>
                <span className="font-mono text-xs font-bold text-[#2E7D5B]">4,120 Tonnes Active</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F8F3] border border-[#DDE4DC]">
                <span className="text-[10px] font-bold text-[#657169] uppercase tracking-wider">Cluster 4</span>
                <p className="font-bold text-sm text-[#16211B] mt-0.5 font-display">Bengaluru - Peenya</p>
                <span className="font-mono text-xs font-bold text-[#2E7D5B]">1,940 Tonnes Active</span>
              </div>
            </div>

            {/* Simulated Vector Heatmap Box */}
            <div className="h-64 sm:h-80 w-full rounded-2xl bg-[#EEF2E8]/60 border border-[#DDE4DC] relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#123C2B_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Regional Node Pins */}
              <div className="absolute top-1/4 left-1/3 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#DDE4DC] shadow-xs text-xs font-bold text-[#123C2B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B] animate-pulse" />
                <span>Ahmedabad (142 Listings)</span>
              </div>

              <div className="absolute top-1/2 left-2/5 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#DDE4DC] shadow-xs text-xs font-bold text-[#123C2B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" />
                <span>Pune / Mumbai Corridor (98 Listings)</span>
              </div>

              <div className="absolute top-1/5 right-1/3 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#DDE4DC] shadow-xs text-xs font-bold text-[#123C2B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" />
                <span>Delhi NCR (115 Listings)</span>
              </div>

              <div className="text-center z-10 bg-white/90 backdrop-blur-xs px-6 py-4 rounded-2xl border border-[#DDE4DC] shadow-xs max-w-sm">
                <p className="font-bold text-sm text-[#123C2B] font-display">Regional Supply-Demand Balances</p>
                <p className="text-xs text-[#657169] mt-1">
                  Discover local recycling facilities and high-volume industrial off-takers within 50km.
                </p>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/opportunity-map')}
                  >
                    Explore Cluster Corridors
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. CIRCULAR AI COPILOT ── */}
      <section className="py-20 sm:py-24 bg-white border-b border-[#DDE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE9DA] text-xs font-bold text-[#123C2B]">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D5B]" />
                <span>Autonomous Circular Intelligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123C2B] tracking-tight leading-snug font-display">
                Meet Circular AI. Your supply chain co-pilot.
              </h2>
              <p className="text-sm sm:text-base text-[#657169] leading-relaxed">
                Circular AI scans inventory images, predicts fair-market transaction values, verifies technical grade compliance, and coordinates logistics routing in plain English.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#F7F8F3] border border-[#DDE4DC] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#16211B]">"What's the fair salvage price for 5 tonnes of double-wall cardboard?"</span>
                  <span className="text-xs font-mono font-bold text-[#2E7D5B]">₹8.20–₹8.80 / kg</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F7F8F3] border border-[#DDE4DC] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#16211B]">"Find plastic regrind buyers with available transit within 40 km"</span>
                  <span className="text-xs font-mono font-bold text-[#2E7D5B]">3 Qualified Matches</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsAiAssistantOpen(true)}
                  icon={<Sparkles className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Try Circular AI
                </Button>
              </div>
            </div>

            {/* AI Assistant Preview Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#123C2B] rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C6E865] animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white font-display">
                      CIRCULAR AI ASSISTANT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300">
                    Live Model v2.4
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-white/10 text-emerald-100">
                    <p className="font-sans text-xs">
                      "I have 3,000 kg of used wooden euro pallets. What is my best option in Sanand?"
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/15 border border-white/10 space-y-2">
                    <p className="font-bold text-white font-sans text-xs">
                      CIRCULAR AI RECOMMENDATION:
                    </p>
                    <p className="text-emerald-200 text-[11px] leading-relaxed">
                      Found 2 regional industrial manufacturers with recurring monthly pallet replenishment needs. Recommended price: ₹240 / unit. Avoided emissions: 1.4 t CO₂e.
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#2E7D5B] text-white text-[10px] font-bold">
                        98% Match
                      </span>
                      <span className="text-[10px] text-emerald-300">
                        Sanand Industrial Estate (14 km away)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. FINAL EDITORIAL CALL TO ACTION ── */}
      <section className="py-20 sm:py-28 bg-[#123C2B] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C6E865] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 1,280+ Verified Industrial Enterprises</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
            BUILD A SUPPLY CHAIN WHERE WASTE BECOMES A RESOURCE.
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Start exchanging surplus packaging with verified regional partners in under 5 minutes. No custom software or complex ERP integration required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/onboarding')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto px-8"
            >
              JOIN CIRCULA
            </Button>
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 text-sm font-semibold transition-colors"
            >
              EXPLORE MARKETPLACE
            </button>
          </div>
        </div>
      </section>

      {/* ── 12. FOOTER ── */}
      <footer className="bg-[#FBFCF8] border-t border-[#DDE4DC] py-14 text-xs text-[#657169]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#123C2B] text-white flex items-center justify-center text-sm font-bold">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              </div>
              <span className="text-base font-extrabold text-[#123C2B] tracking-wider font-display">
                CIRCULA
              </span>
            </div>
            <p className="max-w-xs text-xs text-[#657169] leading-relaxed">
              B2B Circular Materials Exchange + Carbon Intelligence Platform. Transforming industrial packaging waste streams into quantifiable business value.
            </p>
            <p className="text-[11px] text-[#657169]">
              © 2026 CIRCULA Technologies Inc. All rights reserved.
            </p>
          </div>

          <div>
            <span className="font-bold text-[#16211B] uppercase tracking-wider block mb-3 font-display">
              Platform
            </span>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="hover:text-[#123C2B] transition-colors">Marketplace</Link></li>
              <li><Link to="/matches" className="hover:text-[#123C2B] transition-colors">Smart Matching</Link></li>
              <li><Link to="/logistics" className="hover:text-[#123C2B] transition-colors">Green Logistics</Link></li>
              <li><Link to="/opportunity-map" className="hover:text-[#123C2B] transition-colors">Ecosystem Map</Link></li>
              <li><Link to="/transactions" className="hover:text-[#123C2B] transition-colors">Transactions</Link></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-[#16211B] uppercase tracking-wider block mb-3 font-display">
              Intelligence
            </span>
            <ul className="space-y-2">
              <li><Link to="/impact" className="hover:text-[#123C2B] transition-colors">Carbon Calculator</Link></li>
              <li><Link to="/analytics" className="hover:text-[#123C2B] transition-colors">Analytics & GMV</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#123C2B] transition-colors">Circularity Score</Link></li>
              <li><Link to="/materials/new" className="hover:text-[#123C2B] transition-colors">Vision AI Scanner</Link></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-[#16211B] uppercase tracking-wider block mb-3 font-display">
              Enterprise
            </span>
            <ul className="space-y-2">
              <li><Link to="/onboarding" className="hover:text-[#123C2B] transition-colors">Company Verification</Link></li>
              <li><Link to="/profile" className="hover:text-[#123C2B] transition-colors">ESG Audit Registry</Link></li>
              <li><a href="mailto:contact@circula.earth" className="hover:text-[#123C2B] transition-colors">Security & Privacy</a></li>
              <li><a href="mailto:contact@circula.earth" className="hover:text-[#123C2B] transition-colors">Terms of Trade</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
