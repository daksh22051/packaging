import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  Leaf,
  Truck,
  RotateCcw,
  Sparkles,
  Info,
  HelpCircle,
  TrendingDown,
  Droplets,
  Scale
} from 'lucide-react';
import { impactService } from '../../services/dataServices';

export const CarbonCalculator: React.FC = () => {
  const [material, setMaterial] = useState<string>('Cardboard');
  const [quantityKg, setQuantityKg] = useState<number>(2500);
  const [replacementPct, setReplacementPct] = useState<number>(70);
  const [distanceKm, setDistanceKm] = useState<number>(32);
  const [transportMode, setTransportMode] = useState<
    'Electric LCV' | 'CNG Medium' | 'Standard Diesel'
  >('Electric LCV');

  const results = impactService.calculateCustomImpact({
    material,
    quantityKg,
    virginReplacementPct: replacementPct,
    distanceKm,
    transportMode
  });

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EEF3F0] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Interactive Model
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#162720] mt-0.5">
            Carbon & Material Displacement Simulator
          </h3>
          <p className="text-xs text-[#596B61] mt-0.5">
            Calculate avoided lifecycle emissions and transport overhead based on WARM v15 and GLEC frameworks
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#6B7D72] bg-[#F4F8F5] px-3 py-1.5 rounded-xl border border-[#DCE7DF] self-start sm:self-auto">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Configurable Assumptions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Material Category selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#35463D] mb-2">
              Packaging Material
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['Cardboard', 'Plastic', 'Pallets', 'Paper', 'Glass', 'Metal'].map(
                (mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setMaterial(mat)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      material === mat
                        ? 'bg-[#16382C] text-white border-[#16382C] shadow-xs'
                        : 'bg-white text-[#45564C] border-[#D9E2DB] hover:bg-[#F3F7F4]'
                    }`}
                  >
                    {mat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label className="font-bold text-[#35463D] uppercase tracking-wider">
                Exchanged Quantity (kg)
              </label>
              <span className="font-mono font-bold text-[#16382C]">
                {quantityKg.toLocaleString()} kg
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="15000"
              step="100"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              className="w-full accent-[#16382C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#788A80] font-mono mt-1">
              <span>200 kg</span>
              <span>7,500 kg</span>
              <span>15,000 kg</span>
            </div>
          </div>

          {/* Virgin Replacement % Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label className="font-bold text-[#35463D] uppercase tracking-wider">
                Virgin Material Displacement Rate
              </label>
              <span className="font-mono font-bold text-emerald-800">
                {replacementPct}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="5"
              value={replacementPct}
              onChange={(e) => setReplacementPct(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <p className="text-[11px] text-[#697B71] mt-1">
              Portion of recovered packaging directly replacing virgin raw material inputs.
            </p>
          </div>

          {/* Transit Distance & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EEF3F0]">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-bold text-[#35463D] uppercase tracking-wider">
                  Transport Distance
                </label>
                <span className="font-mono font-bold text-[#16382C]">
                  {distanceKm} km
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-[#16382C] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35463D] mb-1.5">
                Carrier Fleet Profile
              </label>
              <select
                value={transportMode}
                onChange={(e) =>
                  setTransportMode(
                    e.target.value as 'Electric LCV' | 'CNG Medium' | 'Standard Diesel'
                  )
                }
                className="w-full py-2 px-3 bg-[#F6FAF7] border border-[#D9E3DC] rounded-xl text-xs font-semibold text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
              >
                <option value="Electric LCV">Electric LCV (0.045 kg CO₂/t-km)</option>
                <option value="CNG Medium">CNG Medium (0.082 kg CO₂/t-km)</option>
                <option value="Standard Diesel">Standard Diesel (0.128 kg CO₂/t-km)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-5 bg-[#F6FAF7] border border-[#DEEBE1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Estimated Net Environmental Impact
            </span>

            {/* Big Hero Metric */}
            <div className="mt-2 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#16382C] font-mono tracking-tight">
                  {results.netCo2AvoidedTonnes.toFixed(2)} t
                </span>
                <span className="text-base font-bold text-[#16382C]">CO₂e</span>
              </div>
              <p className="text-xs text-[#52645B] mt-1 font-medium">
                Net avoided lifecycle greenhouse gas emissions
              </p>
            </div>

            {/* Breakdown Submetrics */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E1EDE4]">
              <div className="p-3 bg-white rounded-xl border border-[#E3EDE6]">
                <div className="flex items-center gap-1.5 text-xs text-[#5D7065] mb-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Virgin Replaced</span>
                </div>
                <span className="font-mono font-bold text-sm sm:text-base text-[#182620]">
                  {results.virginReplacedKg.toLocaleString()} kg
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E3EDE6]">
                <div className="flex items-center gap-1.5 text-xs text-[#5D7065] mb-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Waste Diverted</span>
                </div>
                <span className="font-mono font-bold text-sm sm:text-base text-[#182620]">
                  {results.wasteDivertedKg.toLocaleString()} kg
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E3EDE6]">
                <div className="flex items-center gap-1.5 text-xs text-[#5D7065] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  <span>Water Saved</span>
                </div>
                <span className="font-mono font-bold text-sm sm:text-base text-[#182620]">
                  {results.waterSavedLiters.toLocaleString()} L
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E3EDE6]">
                <div className="flex items-center gap-1.5 text-xs text-[#5D7065] mb-1">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Transit CO₂e</span>
                </div>
                <span className="font-mono font-bold text-sm sm:text-base text-[#182620]">
                  {results.transportCo2Kg} kg
                </span>
              </div>
            </div>
          </div>

          {/* AI-style Explanation Note */}
          <div className="p-3 rounded-xl bg-white border border-[#DCE8E0] text-xs text-[#3E5146] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-[#16382C] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Explain My Impact</span>
            </div>
            <p>
              "By replacing an estimated {results.virginReplacedKg.toLocaleString()} kg of virgin {material.toLowerCase()} with recovered material, this exchange could avoid approximately {results.netCo2AvoidedTonnes.toFixed(2)} tonnes of CO₂e, factoring {results.transportCo2Kg} kg for {distanceKm} km transport via {transportMode}."
            </p>
            <span className="block text-[10px] text-[#7A8C81] mt-1.5 italic">
              Estimate based on configurable material and transport assumptions.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
