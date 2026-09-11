import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Recycle,
  X,
  Compass,
  Package
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface MapNode {
  id: string;
  name: string;
  type: 'Supplier' | 'Buyer' | 'Recycler' | 'Logistics';
  city: string;
  materials: string[];
  volume: string;
  distanceKm: number;
  circularityScore: number;
  coords: { x: number; y: number }; // percentage coords on canvas
}

export const OpportunityMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  const nodes: MapNode[] = [
    {
      id: 'node-1',
      name: 'ABC Packaging Ltd',
      type: 'Supplier',
      city: 'Changodar GIDC',
      materials: ['Cardboard', 'Paper'],
      volume: '2,500 kg Surplus',
      distanceKm: 32,
      circularityScore: 89,
      coords: { x: 22, y: 35 }
    },
    {
      id: 'node-2',
      name: 'ABC Manufacturing (Your Plant)',
      type: 'Buyer',
      city: 'Sanand Industrial Estate',
      materials: ['Cardboard', 'Pallets'],
      volume: '3,000 kg Demand',
      distanceKm: 0,
      circularityScore: 82,
      coords: { x: 55, y: 48 }
    },
    {
      id: 'node-3',
      name: 'EcoPlast Polymer Refiners',
      type: 'Recycler',
      city: 'Vatva Chemical Zone',
      materials: ['Plastic', 'HDPE Regrind'],
      volume: '5,000 kg Capacity',
      distanceKm: 46,
      circularityScore: 94,
      coords: { x: 75, y: 30 }
    },
    {
      id: 'node-4',
      name: 'ReLoop Green Transit Hub',
      type: 'Logistics',
      city: 'Aslali Ring Corridor',
      materials: ['Fleet EV Dispatch', 'Cross-Docking'],
      volume: '18 EV Haulers Active',
      distanceKm: 28,
      circularityScore: 91,
      coords: { x: 40, y: 65 }
    },
    {
      id: 'node-5',
      name: 'Western Pallet Recovery Skids',
      type: 'Supplier',
      city: 'Kadi Industrial Area',
      materials: ['Pallets', 'Wood'],
      volume: '850 Units',
      distanceKm: 58,
      circularityScore: 86,
      coords: { x: 35, y: 20 }
    },
    {
      id: 'node-6',
      name: 'Sun Pharma Packaging Bay',
      type: 'Buyer',
      city: 'Bavla Pharma Nexus',
      materials: ['Paper', 'Glass'],
      volume: '1,500 kg Demand',
      distanceKm: 42,
      circularityScore: 88,
      coords: { x: 68, y: 68 }
    }
  ];

  const filteredNodes = nodes.filter(
    (n) => selectedType === 'All' || n.type === selectedType
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E3ECE6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
              Ecosystem Spatial Map
            </span>
            <span className="text-xs text-[#63766B] font-medium">
              Regional Material Nodes & Freight Clusters
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162720] tracking-tight">
            Circular Opportunity Map
          </h1>
          <p className="text-xs sm:text-sm text-[#54675B] mt-0.5">
            Discover nearby suppliers, off-take buyers, and certified circular recyclers within your freight corridor.
          </p>
        </div>

        {/* Node Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          {['All', 'Supplier', 'Buyer', 'Recycler', 'Logistics'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedType === t
                  ? 'bg-[#16382C] text-white shadow-xs'
                  : 'bg-white border border-[#DCE5DE] text-[#425449] hover:bg-[#F3F7F4]'
              }`}
            >
              {t === 'All' ? 'All Entities' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Canvas (8 or 12 cols depending on selection) */}
        <div className="lg:col-span-8 bg-[#E9EFEA] rounded-3xl border border-[#D3DFD5] h-[480px] sm:h-[540px] relative overflow-hidden shadow-xs select-none">
          {/* Subtle Grid dots */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(#AFC1B0 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Connecting SVG Corridors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Corridor between Supplier 1 and Buyer 2 */}
            <line
              x1="22%"
              y1="35%"
              x2="55%"
              y2="48%"
              stroke="#16382C"
              strokeWidth="2.5"
              strokeDasharray="5,5"
              className="opacity-70"
            />
            {/* Corridor between Buyer 2 and Logistics 4 */}
            <line
              x1="55%"
              y1="48%"
              x2="40%"
              y2="65%"
              stroke="#16382C"
              strokeWidth="2"
              className="opacity-40"
            />
            {/* Corridor between Recycler 3 and Buyer 2 */}
            <line
              x1="55%"
              y1="48%"
              x2="75%"
              y2="30%"
              stroke="#2C6E53"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              className="opacity-50"
            />
          </svg>

          {/* Interactive Facility Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            let nodeBg = 'bg-[#16382C]';
            let ringColor = 'ring-emerald-300';
            if (node.type === 'Buyer') {
              nodeBg = 'bg-blue-700';
              ringColor = 'ring-blue-300';
            } else if (node.type === 'Recycler') {
              nodeBg = 'bg-amber-600';
              ringColor = 'ring-amber-300';
            } else if (node.type === 'Logistics') {
              nodeBg = 'bg-teal-700';
              ringColor = 'ring-teal-300';
            }

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs whitespace-nowrap mb-1 transition-all ${
                      isSelected
                        ? 'bg-[#16382C] text-white scale-105'
                        : 'bg-white text-[#182620] border border-[#CBD7CF] group-hover:scale-105'
                    }`}
                  >
                    {node.name.split(' ')[0]} ({node.type})
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full ${nodeBg} text-white flex items-center justify-center ring-4 ring-white shadow-md transition-transform group-hover:scale-110 ${
                      isSelected ? `ring-8 ${ringColor}` : ''
                    }`}
                  >
                    {node.type === 'Supplier' && <Package className="w-4 h-4" />}
                    {node.type === 'Buyer' && <Building2 className="w-4 h-4" />}
                    {node.type === 'Recycler' && <Recycle className="w-4 h-4" />}
                    {node.type === 'Logistics' && <Truck className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-[#CCD8CE] shadow-sm text-xs space-y-1.5">
            <span className="font-bold text-[#2A3B31] uppercase tracking-wider text-[10px] block mb-1">
              Network Topology Legend
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#16382C]" />
              <span className="text-[#4E6155]">Suppliers (Surplus Source)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-700" />
              <span className="text-[#4E6155]">Buyers (Demand Offtake)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              <span className="text-[#4E6155]">Recyclers & Regrinders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-700" />
              <span className="text-[#4E6155]">EV Logistics Corridors</span>
            </div>
          </div>
        </div>

        {/* Right Inspection Drawer (4 cols) */}
        <div className="lg:col-span-4">
          {selectedNode ? (
            <div className="bg-white rounded-3xl border border-[#DCE6DE] p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between pb-3 border-b border-[#EEF3F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary" size="sm">
                      {selectedNode.type}
                    </Badge>
                    <span className="text-xs text-[#63766B] font-mono">
                      {selectedNode.distanceKm === 0
                        ? 'Your Facility'
                        : `${selectedNode.distanceKm} km away`}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-[#162720]">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs text-[#54675B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{selectedNode.city}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-[#677B70] hover:bg-[#EEF4F0]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F6FAF7] border border-[#DEEBE1]">
                  <span className="text-[10px] uppercase font-bold text-[#62756A] block">
                    Active Volume
                  </span>
                  <span className="font-mono font-bold text-sm text-[#16382C]">
                    {selectedNode.volume}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F6FAF7] border border-[#DEEBE1]">
                  <span className="text-[10px] uppercase font-bold text-[#62756A] block">
                    Focus Packaging Streams
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.materials.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#D7E2DC] font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F6FAF7] border border-[#DEEBE1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#62756A] block">
                      Circularity Index
                    </span>
                    <span className="font-mono font-extrabold text-base text-emerald-800">
                      {selectedNode.circularityScore} / 100
                    </span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/matches')}
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Calculate Affinity Match
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/marketplace')}
                >
                  View Lot Listings
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAFCFA] rounded-3xl border border-dashed border-[#CCD7CF] p-8 text-center space-y-3">
              <Compass className="w-8 h-8 text-emerald-800 mx-auto" />
              <h4 className="font-bold text-sm text-[#182620]">
                Select Any Facility Node
              </h4>
              <p className="text-xs text-[#5D6F64] leading-relaxed">
                Click on any node in the Ahmedabad–Sanand circular corridor to inspect packaging flows, inventory capacity, and transit distances.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
