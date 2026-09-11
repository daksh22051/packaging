import React from 'react';
import { CheckCircle2, Clock, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { TrackingEvent, TransactionStatus } from '../../types';

interface ShipmentTimelineProps {
  events: TrackingEvent[];
  currentStatus: TransactionStatus;
}

export const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({
  events,
  currentStatus
}) => {
  const steps: { status: TransactionStatus; label: string }[] = [
    { status: 'Order Confirmed', label: 'Order Confirmed' },
    { status: 'Pickup Scheduled', label: 'Pickup Scheduled' },
    { status: 'In Transit', label: 'In Transit' },
    { status: 'Delivered', label: 'Delivered' },
    { status: 'Verified', label: 'Verified & Audited' }
  ];

  const statusHierarchy: Record<TransactionStatus, number> = {
    'Order Confirmed': 1,
    'Pickup Scheduled': 2,
    'In Transit': 3,
    'Delivered': 4,
    'Verified': 5
  };

  const currentLevel = statusHierarchy[currentStatus] || 1;

  return (
    <div className="w-full">
      {/* Horizontal Stepper Progress */}
      <div className="relative flex items-center justify-between pb-8">
        {/* Track Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#E4ECE6] -z-0">
          <div
            className="h-full bg-[#16382C] transition-all duration-500 ease-out"
            style={{
              width: `${((currentLevel - 1) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = idx + 1 <= currentLevel;
          const isCurrent = idx + 1 === currentLevel;

          return (
            <div
              key={step.status}
              className="flex flex-col items-center relative z-10 text-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-[#16382C] text-white ring-4 ring-white shadow-sm'
                    : 'bg-white border-2 border-[#D2DED5] text-[#86998E]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-mono font-bold">{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 max-w-[80px] sm:max-w-none ${
                  isCurrent
                    ? 'text-[#16382C] font-bold'
                    : isCompleted
                    ? 'text-[#2D3F35]'
                    : 'text-[#84978C]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Event Details Feed */}
      <div className="space-y-3 pt-2 border-t border-[#EEF3F0]">
        {events.map((evt, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3.5 p-3 rounded-xl transition-colors ${
              evt.completed ? 'bg-[#FAFCFA] border border-[#E5EBE6]' : 'opacity-60'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                evt.completed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {evt.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <p className="text-xs font-bold text-[#182620]">{evt.status}</p>
                <span className="text-[10px] font-mono text-[#6C7E74]">
                  {evt.date} • {evt.time}
                </span>
              </div>
              <p className="text-xs text-[#52645A] mt-0.5 leading-relaxed">
                {evt.description}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[#718479] mt-1 font-medium">
                <MapPin className="w-3 h-3 text-emerald-700" />
                <span>{evt.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
