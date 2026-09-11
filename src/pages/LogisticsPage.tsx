import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Leaf,
  TrendingDown,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Phone,
  User,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RouteMapVisualizer } from '../components/logistics/RouteMapVisualizer';
import { RouteComparisonCard } from '../components/logistics/RouteComparisonCard';
import { ShipmentTimeline } from '../components/logistics/ShipmentTimeline';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LogisticsPage: React.FC = () => {
  const { logisticsPlan, transactions, triggerToast } = useApp();
  const [routeMode, setRouteMode] = useState<'optimized' | 'standard'>('optimized');

  const activeTransaction = transactions[0]; // Active transaction demo

  const handleConfirmTransport = () => {
    triggerToast(
      'Green Transport Dispatched',
      'Optimized route booked with ReLoop Green EV Fleet. Waybill #GJ-EV-8842.'
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E3ECE6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
              Green Logistics
            </span>
            <span className="text-xs text-[#63766B] font-medium">
              Autonomous Multimodal Dispatch & Route Optimization
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            Logistics Intelligence & Route Optimization
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Compare haulage routes, reduce freight emissions, and trace custodial shipments in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">
            EV Priority Corridor Active
          </Badge>
        </div>
      </div>

      {/* Map Topology Visualizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#34463C] uppercase tracking-wider">
            Interactive Transit Map Topology
          </span>
          <span className="text-[#64766C]">
            Live Carrier Location: <strong>Bypass Kilometer 38.4</strong>
          </span>
        </div>
        <RouteMapVisualizer
          plan={logisticsPlan}
          routeMode={routeMode}
          onToggleMode={setRouteMode}
        />
      </div>

      {/* Route Comparison (Section 39) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#34463C] uppercase tracking-wider">
            Route Cost & Emissions Comparison
          </span>
          <span className="text-emerald-800 font-semibold">
            ReLoop Green Fleet saves 18 kg CO₂e on this exchange
          </span>
        </div>
        <RouteComparisonCard
          plan={logisticsPlan}
          routeMode={routeMode}
          onSelectRoute={setRouteMode}
          onConfirmTransport={handleConfirmTransport}
        />
      </div>

      {/* Live Active Shipment Tracking (Section 40) */}
      <div className="bg-white rounded-3xl border border-[#DFE7E1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEF3F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Live Shipment Tracking
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-[#162720] mt-0.5">
              Consignment: {activeTransaction.materialTitle}
            </h3>
            <p className="text-xs text-[#52645B] mt-0.5">
              Order ID: <strong className="font-mono">{activeTransaction.id}</strong> • Transporter:{' '}
              <strong>{activeTransaction.logistics.carrierName}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#63766B] block">Tracking Code:</span>
            <span className="font-mono font-bold text-sm text-[#16382C]">
              {activeTransaction.logistics.trackingCode}
            </span>
          </div>
        </div>

        {/* Stepper Progress & Feed */}
        <ShipmentTimeline
          events={activeTransaction.logistics.events}
          currentStatus={activeTransaction.status}
        />

        {/* Driver / Carrier Details */}
        <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#DEEBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16382C] text-white flex items-center justify-center font-bold shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#182620]">
                  ReLoop EV Hauler #GJ-01-EV-2041
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  100% Electric
                </span>
              </div>
              <p className="text-[#596B61] mt-0.5">
                Driver: Ramesh Patel • Verified Commercial Hazmat/Packaging Clear
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                triggerToast('Transporter Contact', 'Dialing Ramesh Patel (+91 98250 11920)...')
              }
              icon={<Phone className="w-3.5 h-3.5" />}
            >
              Contact Driver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
