import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  Leaf,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ShipmentTimeline } from '../components/logistics/ShipmentTimeline';

export const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions, triggerToast } = useApp();

  const tx = transactions.find((t) => t.id === id) || transactions[0];

  if (!tx) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-[#DFE7E1]">
        <h2 className="text-xl font-bold text-[#162720]">Order Not Found</h2>
        <p className="text-xs text-[#52645B] mt-1 mb-4">The requested transaction could not be located.</p>
        <Button onClick={() => navigate('/transactions')}>Back to Orders</Button>
      </div>
    );
  }

  const handleDownloadWaybill = () => {
    triggerToast(
      'Waybill Downloaded',
      `Digital Custody Waybill & Scope 3 Transfer Slip for ${tx.id} exported.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#54665C] hover:text-[#16382C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadWaybill}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download Waybill
          </Button>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-[#DFE7E1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EEF3F0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#67796F]">
                Order #{tx.orderNumber || tx.id}
              </span>
              <span className="text-xs text-[#96A89E]">•</span>
              <span className="text-xs text-[#52645B] font-medium">
                Placed on {tx.createdAt || tx.date || 'Recent'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
              {tx.materialTitle}
            </h1>
          </div>

          <Badge variant="emerald" size="lg">
            {tx.status}
          </Badge>
        </div>

        {/* Live Timeline Component */}
        <div className="py-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#35483E] mb-4">
            Custodial Delivery Progress
          </h3>
          <ShipmentTimeline
            events={tx.logistics?.events || tx.trackingEvents || []}
            currentStatus={tx.status}
          />
        </div>

        {/* Counterparties and Cost Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EEF3F0]">
          {/* Supplier */}
          <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#DEE7E0] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#66786D] block">
              Consignor / Supplier
            </span>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#182620]">
                {tx.supplierCompany?.name || tx.supplier?.name || 'Supplier'}
              </h4>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-xs text-[#52645B]">
              Origin: {tx.supplierCompany?.city || tx.supplier?.city || 'Regional Hub'}
            </p>
          </div>

          {/* Buyer */}
          <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#DEE7E0] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#66786D] block">
              Consignee / Buyer
            </span>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#182620]">
                {tx.buyerCompany?.name || tx.buyer?.name || 'Buyer'}
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified Hub
              </span>
            </div>
            <p className="text-xs text-[#52645B]">
              Delivery Destination: {tx.buyerCompany?.city || tx.buyer?.city || 'Regional Hub'}
            </p>
          </div>
        </div>

        {/* Financial & Environmental Statement */}
        <div className="p-5 rounded-2xl bg-[#EEF5F0] border border-[#D5E5DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
              Verified Environmental Ledger Entry
            </span>
            <p className="text-xs text-[#2A3C31]">
              Displaced virgin input materials and diverted from municipal landfill processing.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#55675D] block">
                Total Invoiced
              </span>
              <span className="font-mono text-xl font-extrabold text-[#16382C]">
                ₹{(tx.totalAmountInr ?? tx.totalInr ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="border-l border-[#CCDCD1] pl-6">
              <span className="text-[10px] uppercase font-bold text-[#55675D] block">
                CO₂e Avoided
              </span>
              <span className="font-mono text-xl font-extrabold text-emerald-800">
                {tx.co2SavedTonnes ?? tx.estimatedCo2AvoidedTonnes ?? 0} t
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
