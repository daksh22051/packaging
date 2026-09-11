import React from 'react';
import { Card } from '../common/Card';
import {
  PackagePlus,
  Sparkles,
  ArrowRight,
  Repeat,
  Recycle,
  Leaf,
  CheckCircle2
} from 'lucide-react';

export const MaterialFlowVisualizer: React.FC = () => {
  const steps = [
    {
      title: 'Listed',
      count: '18.4 tonnes',
      sub: 'Surplus Packaging',
      conversion: '100%',
      icon: PackagePlus,
      color: 'bg-[#EEF5F0] text-[#16382C]'
    },
    {
      title: 'Matched',
      count: '16.2 tonnes',
      sub: 'Algorithmic Affinity',
      conversion: '88% match rate',
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-800'
    },
    {
      title: 'Exchanged',
      count: '14.2 tonnes',
      sub: 'Custody Handed Over',
      conversion: '87% closed',
      icon: Repeat,
      color: 'bg-teal-50 text-teal-800'
    },
    {
      title: 'Reused / Recycled',
      count: '13.8 tonnes',
      sub: 'Zero Landfill',
      conversion: '97% recovery',
      icon: Recycle,
      color: 'bg-blue-50 text-blue-800'
    },
    {
      title: 'Impact Realized',
      count: '18.6 t CO₂e',
      sub: '32.4K L Water Saved',
      conversion: '100% verified',
      icon: Leaf,
      color: 'bg-[#16382C] text-white'
    }
  ];

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#162720]">
            Circular Material Pipeline
          </h3>
          <p className="text-xs text-[#586A60]">
            End-to-end material flow from surplus listing to verified carbon displacement
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Closed-Loop Conversion 84.6%</span>
        </div>
      </div>

      {/* Horizontal Flow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="relative p-3.5 rounded-xl border border-[#E3ECE6] bg-[#FAFCFA] hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${step.color} shadow-2xs`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#66786F]">
                    0{idx + 1}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#172721]">{step.title}</p>
                <p className="text-sm sm:text-base font-extrabold text-[#16382C] font-mono mt-0.5">
                  {step.count}
                </p>
                <p className="text-[11px] text-[#607369] mt-0.5">{step.sub}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#EAEFEA] flex items-center justify-between text-[10px] font-semibold text-emerald-800">
                <span>{step.conversion}</span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-[#92A59A] hidden md:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
