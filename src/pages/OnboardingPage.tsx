import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Building2,
  Package,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, triggerToast } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [companyName, setCompanyName] = useState(currentUser.name || 'ABC Manufacturing');
  const [businessType, setBusinessType] = useState<'Manufacturer' | 'Packaging Supplier' | 'Recycler' | 'Retailer'>(
    'Manufacturer'
  );
  const [industry, setIndustry] = useState('Automotive & Precision Components');

  // Step 2: Materials handled
  const [materialsHandled, setMaterialsHandled] = useState<string[]>([
    'Cardboard',
    'Pallets'
  ]);

  // Step 3: What looking for
  const [intent, setIntent] = useState<'both' | 'buy' | 'sell'>('both');
  const [monthlyVolumeKg, setMonthlyVolumeKg] = useState(3000);

  // Step 4: Where operate
  const [locationCity, setLocationCity] = useState(currentUser.city || 'Ahmedabad');
  const [operatingRadiusKm, setOperatingRadiusKm] = useState(120);

  const toggleMaterial = (mat: string) => {
    setMaterialsHandled((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete
      setCurrentUser({
        ...currentUser,
        name: companyName,
        city: locationCity,
        operatingRadiusKm
      });
      triggerToast(
        'Circular Profile Completed',
        `Welcome to CIRCULA. Initial score calculated: 82/100.`
      );
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E3ECE6] mb-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#16382C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ♻
            </span>
            <span className="font-extrabold text-lg tracking-wider text-[#16382C]">
              CIRCULA
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              0{currentStep} / 05
            </span>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step <= currentStep ? 'bg-[#16382C]' : 'bg-[#E4EDE7]'
              }`}
            />
          ))}
        </div>

        {/* Card Content Container */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] shadow-lg p-6 sm:p-10 space-y-6">
          {/* STEP 1: Tell us about your business */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Step 01 of 05
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#162720] mt-1">
                  Tell us about your business.
                </h2>
                <p className="text-xs sm:text-sm text-[#55695E] mt-1">
                  Help the algorithm categorize your material generation profiles and tax compliance credentials.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#D9E3DC] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1.5">
                    Primary Operational Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Manufacturer',
                      'Packaging Supplier',
                      'Recycler',
                      'Retailer'
                    ].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setBusinessType(role as any)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                          businessType === role
                            ? 'bg-[#16382C] text-white border-[#16382C] shadow-xs'
                            : 'bg-[#FAFCFA] text-[#3F5045] border-[#DAE4DC] hover:bg-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1.5">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#D9E3DC] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: What materials do you work with? */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Step 02 of 05
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#162720] mt-1">
                  What materials do you work with?
                </h2>
                <p className="text-xs sm:text-sm text-[#55695E] mt-1">
                  Select packaging material streams your facility generates as waste or requires as input.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { name: 'Cardboard', desc: 'Corrugated boxes & sheets' },
                  { name: 'Plastic', desc: 'HDPE, PP, Stretch film' },
                  { name: 'Pallets', desc: 'Wooden & plastic skids' },
                  { name: 'Paper', desc: 'Kraft, liners, angle boards' },
                  { name: 'Glass', desc: 'Bottles, cullet, jars' },
                  { name: 'Metal', desc: 'Steel bands, aluminum tins' }
                ].map((mat) => {
                  const selected = materialsHandled.includes(mat.name);
                  return (
                    <div
                      key={mat.name}
                      onClick={() => toggleMaterial(mat.name)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selected
                          ? 'bg-[#EEF5F0] border-emerald-700 ring-1 ring-emerald-700 shadow-xs'
                          : 'bg-[#FAFCFA] border-[#DCE5DE] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#172721]">
                          {mat.name}
                        </span>
                        {selected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#5B6D62]">{mat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: What are you looking for? */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Step 03 of 05
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#162720] mt-1">
                  What are you looking for?
                </h2>
                <p className="text-xs sm:text-sm text-[#55695E] mt-1">
                  Define your primary transaction objectives across procurement and off-take.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'both', label: 'Both Buy & Sell', sub: 'Balanced circular loop' },
                    { id: 'buy', label: 'Procure Surplus', sub: 'Lower material costs' },
                    { id: 'sell', label: 'Offload Waste', sub: 'Zero-landfill compliance' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIntent(opt.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        intent === opt.id
                          ? 'bg-[#16382C] text-white border-[#16382C] shadow-xs'
                          : 'bg-[#FAFCFA] text-[#3D4F44] border-[#DCE5DE] hover:bg-white'
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm block">
                        {opt.label}
                      </span>
                      <span
                        className={`text-[10px] block mt-1 ${
                          intent === opt.id ? 'text-emerald-200' : 'text-[#677A6F]'
                        }`}
                      >
                        {opt.sub}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1.5">
                    <label className="font-bold uppercase tracking-wider text-[#35483E]">
                      Estimated Monthly Volume
                    </label>
                    <span className="font-mono font-bold text-[#16382C]">
                      {monthlyVolumeKg.toLocaleString()} kg / month
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={monthlyVolumeKg}
                    onChange={(e) => setMonthlyVolumeKg(Number(e.target.value))}
                    className="w-full accent-[#16382C] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Where do you operate? */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Step 04 of 05
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#162720] mt-1">
                  Where do you operate?
                </h2>
                <p className="text-xs sm:text-sm text-[#55695E] mt-1">
                  Define your geographic nexus to unlock low-emission, cost-efficient local exchanges.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1.5">
                    Plant or Warehouse Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                      placeholder="e.g. Sanand Industrial Estate, Ahmedabad"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F6FAF7] border border-[#D9E3DC] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label className="font-bold uppercase tracking-wider text-[#35483E]">
                      Preferred Counterparty Search Radius
                    </label>
                    <span className="font-mono font-bold text-[#16382C]">
                      {operatingRadiusKm} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="10"
                    value={operatingRadiusKm}
                    onChange={(e) => setOperatingRadiusKm(Number(e.target.value))}
                    className="w-full accent-[#16382C] cursor-pointer"
                  />
                  <p className="text-[11px] text-[#63756C] mt-1">
                    94% of circular packaging transactions occur within a 120 km transport corridor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Complete your circular profile */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Step 05 of 05
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#162720] mt-1">
                  Complete your circular profile.
                </h2>
                <p className="text-xs sm:text-sm text-[#55695E] mt-1">
                  Your baseline circularity index is prepared. Review your credentials before entering the live exchange.
                </p>
              </div>

              {/* Profile summary card */}
              <div className="p-5 rounded-2xl bg-[#F4F8F5] border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200/70">
                  <div>
                    <h4 className="font-bold text-base text-[#162720]">
                      {companyName}
                    </h4>
                    <p className="text-xs text-[#52645B]">
                      {businessType} • {locationCity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Estimated Index
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-[#16382C]">
                      82 / 100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#697C72] block">
                      Materials Configured
                    </span>
                    <span className="font-medium text-[#1A2821]">
                      {materialsHandled.join(', ') || 'Cardboard, Pallets'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#697C72] block">
                      Operating Radius
                    </span>
                    <span className="font-medium text-[#1A2821]">
                      {operatingRadiusKm} km around {locationCity}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#DCE7DF] flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Entity eligible for <strong>Trusted Circular Partner</strong> tier upon first verified bill of lading.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#EEF3F0]">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              {currentStep === 5 ? 'Launch Platform Dashboard' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
