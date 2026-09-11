import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  Package,
  Leaf,
  Calendar,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { TransactionStatus } from '../types';

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, triggerToast } = useApp();
  const [filterTab, setFilterTab] = useState<'All' | 'Purchases' | 'Sales' | 'In Transit' | 'Completed'>(
    'All'
  );

  const filtered = transactions.filter((tx) => {
    if (filterTab === 'Purchases' && tx.type !== 'Purchase') return false;
    if (filterTab === 'Sales' && tx.type !== 'Sale') return false;
    if (filterTab === 'In Transit' && tx.status !== 'In Transit') return false;
    if (filterTab === 'Completed' && tx.status !== 'Verified') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3ECE6]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            Exchange Orders & Custody Chain
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Monitor consignment lifecycle, digital bills of lading, and verified Scope 3 avoidance records.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            triggerToast(
              'Ledger Exported',
              'Audited transaction records exported to CSV.'
            )
          }
          icon={<Download className="w-3.5 h-3.5" />}
        >
          Export CSV Ledger
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none border-b border-[#E3ECE6] pb-2">
        {['All', 'Purchases', 'Sales', 'In Transit', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab as any)}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterTab === tab
                ? 'bg-[#16382C] text-white shadow-xs'
                : 'text-[#485A50] hover:bg-[#EEF4F0]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction Cards List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              onClick={() => navigate(`/transactions/${tx.id}`)}
              className="bg-white rounded-2xl border border-[#DFE7E1] p-5 sm:p-6 shadow-2xs hover:border-[#16382C] hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF2EC] text-[#16382C] flex items-center justify-center font-bold shrink-0">
                  <Truck className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#64766C]">
                      {tx.id}
                    </span>
                    <span className="text-xs text-[#90A297]">•</span>
                    <span className="font-extrabold text-base text-[#162720]">
                      {tx.materialTitle}
                    </span>
                    <Badge variant="emerald" size="sm">
                      {tx.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#52645B]">
                    Supplier:{' '}
                    <strong className="text-[#1A2821]">
                      {tx.supplierCompany?.name || tx.supplier?.name || 'Supplier'}
                    </strong>{' '}
                    → Buyer:{' '}
                    <strong className="text-[#1A2821]">
                      {tx.buyerCompany?.name || tx.buyer?.name || 'Buyer'}
                    </strong>
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#6E8075] pt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-[#16382C]" />
                      {tx.createdAt || tx.date || 'Recent'}
                    </span>
                    <span>•</span>
                    <span>
                      Volume: <strong>{tx.quantity} {tx.unit}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial and Carbon avoidance summary */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#EEF3F0]">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-[#697C71] block">
                    Total Invoiced
                  </span>
                  <span className="font-mono font-extrabold text-base sm:text-lg text-[#16382C]">
                    ₹{(tx.totalAmountInr ?? tx.totalInr ?? 0).toLocaleString()}
                  </span>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-[11px] text-[#697C71] block">
                    Scope 3 Avoidance
                  </span>
                  <span className="font-mono font-extrabold text-base sm:text-lg text-emerald-800">
                    {tx.co2SavedTonnes ?? tx.estimatedCo2AvoidedTonnes ?? 0} t CO₂e
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-[#8BA094] hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No transactions found"
          description="There are no active or historical exchanges under this filter category."
          actionLabel="Browse Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      )}
    </div>
  );
};
