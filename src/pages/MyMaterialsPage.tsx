import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Sparkles,
  MapPin,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const MyMaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { materials, currentUser, triggerToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  // Filter materials belonging to current user (or demo listings)
  const myMaterials = materials.filter(
    (m) =>
      m.supplier.id === currentUser.id ||
      m.supplier.name.includes('ABC') ||
      m.supplier.name.includes('Apex')
  );

  const handleDelete = (id: string, title: string) => {
    triggerToast('Listing Archived', `"${title}" has been unlisted.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3ECE6]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            My Material Inventory
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Manage your listed packaging surplus, stock counts, and buyer demand pipelines.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/materials/new')}
          icon={<PlusCircle className="w-3.5 h-3.5" />}
        >
          Add New Listing
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3ECE6] pb-2 text-xs font-semibold">
        {[
          { id: 'all', label: `All Lots (${myMaterials.length})` },
          { id: 'active', label: 'Active on Exchange' },
          { id: 'pending', label: 'In Negotiation' },
          { id: 'completed', label: 'Dispatched & Settled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#16382C] text-white'
                : 'text-[#506257] hover:bg-[#EEF4F0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings List */}
      {myMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-2xl border border-[#DFE7E1] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-3.5">
                <img
                  src={material.images[0]}
                  alt={material.title}
                  className="w-20 h-20 rounded-xl object-cover border border-[#DDE6E0] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary" size="sm">
                      {material.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-emerald-800 font-bold">
                      {material.condition}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#162720] truncate">
                    {material.title}
                  </h3>
                  <p className="text-xs text-[#5D6F65] mt-0.5">
                    Available: <strong>{material.quantity.toLocaleString()} {material.unit}</strong> @ ₹{material.pricePerUnit}/{material.unit}
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E2ECE5] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#63756C] block">Batch Value</span>
                  <span className="font-mono font-bold text-[#182620]">
                    ₹{(material.quantity * material.pricePerUnit).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#63756C] block">Avoided Scope 3</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {material.estimatedCo2AvoidedTonnes} t CO₂e
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#EEF3F0]">
                <button
                  onClick={() => navigate('/matches')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Matches</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/marketplace/${material.id}`)}
                    icon={<ExternalLink className="w-3 h-3" />}
                  >
                    Preview
                  </Button>
                  <button
                    onClick={() => handleDelete(material.id, material.title)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                    title="Unlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No surplus materials listed yet"
          description="Monetize your packaging waste streams and divert commercial cardboard, plastic, or pallets from landfills."
          actionLabel="Create First Listing"
          onAction={() => navigate('/materials/new')}
        />
      )}
    </div>
  );
};
