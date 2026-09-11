import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Bell,
  Leaf,
  Globe2,
  CheckCircle2,
  Save,
  Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { currentUser, setCurrentUser, triggerToast } = useApp();

  const [companyName, setCompanyName] = useState(currentUser.name);
  const [city, setCity] = useState(currentUser.city);
  const [radius, setRadius] = useState(currentUser.operatingRadiusKm);
  const [esgStandard, setEsgStandard] = useState('BRSR (India Core) + GHG Scope 3');
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyDispatch, setNotifyDispatch] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: companyName,
      city,
      operatingRadiusKm: radius
    });
    triggerToast('Settings Saved', 'Enterprise preferences updated successfully.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-[#E3ECE6]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
          Enterprise Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
          Manage corporate identity, operating freight radius, and ESG carbon accounting guidelines.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EEF3F0]">
            <Building2 className="w-5 h-5 text-[#16382C]" />
            <h3 className="font-bold text-base text-[#162720]">
              Corporate Entity & Jurisdiction
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                  Operating City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                  Freight Search Radius
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] font-mono font-bold"
                  />
                  <span className="text-xs font-medium text-[#64766C]">km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ESG Reporting */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EEF3F0]">
            <Leaf className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-[#162720]">
              Carbon & Environmental Accounting Standard
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1.5">
              Primary Framework
            </label>
            <select
              value={esgStandard}
              onChange={(e) => setEsgStandard(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] font-semibold"
            >
              <option value="BRSR (India Core) + GHG Scope 3">
                SEBI BRSR Core (India) + GHG Scope 3 Category 1 & 5
              </option>
              <option value="EU CSRD / ESRS">
                EU CSRD / European Sustainability Reporting Standards
              </option>
              <option value="EPA WARM Direct">
                US EPA Waste Reduction Model (WARM v15)
              </option>
            </select>
            <p className="text-[11px] text-[#697B71] mt-1.5">
              Defines the emissions factor coefficients and verification signatures embedded in generated transport waybills.
            </p>
          </div>
        </div>

        {/* Notifications Config */}
        <div className="bg-white rounded-3xl border border-[#DFE7E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EEF3F0]">
            <Bell className="w-5 h-5 text-[#16382C]" />
            <h3 className="font-bold text-base text-[#162720]">
              Algorithmic Notification Channels
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-1">
              <div>
                <span className="text-xs font-bold text-[#182620] block">
                  High-Affinity Match Alerts (&gt;90% Score)
                </span>
                <span className="text-[11px] text-[#67796F]">
                  Notify immediately when a regional supplier lists relevant material
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyMatches}
                onChange={(e) => setNotifyMatches(e.target.checked)}
                className="w-4 h-4 accent-[#16382C] rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-1 border-t border-[#EEF3F0] pt-2">
              <div>
                <span className="text-xs font-bold text-[#182620] block">
                  Green Fleet In-Transit Milestones
                </span>
                <span className="text-[11px] text-[#67796F]">
                  Receive live GPS status alerts when consignments pass corridor checkpoints
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyDispatch}
                onChange={(e) => setNotifyDispatch(e.target.checked)}
                className="w-4 h-4 accent-[#16382C] rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-3.5 h-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
