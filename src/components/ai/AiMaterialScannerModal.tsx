import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  Scan,
  RefreshCw,
  Tag,
  ArrowRight
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { AiDetectionResult } from '../../types';

interface AiMaterialScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestions: (result: AiDetectionResult) => void;
}

export const AiMaterialScannerModal: React.FC<AiMaterialScannerModalProps> = ({
  isOpen,
  onClose,
  onApplySuggestions
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState<AiDetectionResult | null>(
    null
  );
  const [selectedSample, setSelectedSample] = useState<string>(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  );

  const sampleImages = [
    {
      label: 'Corrugated Cardboard',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'EPAL Wooden Pallets',
      url: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Polymer Regrind Scrap',
      url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleRunScan = async (imgUrl: string) => {
    setSelectedSample(imgUrl);
    setIsScanning(true);
    setDetectionResult(null);

    try {
      const res = await aiService.detectMaterialFromPhoto(imgUrl);
      setDetectionResult(res);
    } catch {
      // fallback
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirm = () => {
    if (detectionResult) {
      onApplySuggestions(detectionResult);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Autonomous Material Computer Vision"
      subtitle="Upload or select photo of packaging surplus to auto-classify grade and market pricing"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Image Preview / Scanner Area */}
        <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-black/90 border border-[#D9E3DC] flex items-center justify-center">
          <img
            src={selectedSample}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Scanning Line Animation */}
          {isScanning && (
            <div className="absolute inset-0 bg-emerald-900/20 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-pulse absolute top-1/2 -translate-y-1/2" />
              <div className="bg-[#16382C]/90 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-2 border border-emerald-400/40">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Analyzing material polymers, fiber density & grade...</span>
              </div>
            </div>
          )}

          {/* Bounding box simulation */}
          {!isScanning && detectionResult && (
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400 rounded-xl pointer-events-none flex items-start justify-start p-2">
              <span className="bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                Detected: {detectionResult.detectedMaterial} ({detectionResult.confidence}%)
              </span>
            </div>
          )}
        </div>

        {/* Sample selector chips */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#687C71] block mb-2">
            Select Photo or Choose Test Specimen
          </span>
          <div className="flex gap-2">
            {sampleImages.map((s, i) => (
              <button
                key={i}
                onClick={() => handleRunScan(s.url)}
                disabled={isScanning}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                  selectedSample === s.url
                    ? 'bg-[#16382C] text-white border-[#16382C]'
                    : 'bg-white text-[#384A40] border-[#D9E3DC] hover:bg-[#EEF4F0]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detected AI Results */}
        {detectionResult && (
          <div className="p-4 rounded-2xl bg-[#F4F8F5] border border-emerald-200 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Detected Material
                </span>
                <h4 className="text-base font-bold text-[#162720]">
                  {detectionResult.detectedMaterial}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Model Confidence
                </span>
                <span className="text-sm font-mono font-extrabold text-emerald-700">
                  {detectionResult.confidence}% High
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-white rounded-xl border border-[#E3ECE6]">
                <span className="text-[10px] text-[#63756C] block">Estimated Condition</span>
                <span className="font-bold text-[#182620]">{detectionResult.estimatedCondition}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#E3ECE6]">
                <span className="text-[10px] text-[#63756C] block">Suggested Category</span>
                <span className="font-bold text-[#182620]">{detectionResult.suggestedCategory}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#E3ECE6] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#63756C] block">Market Benchmark Price</span>
                <span className="font-mono font-bold text-emerald-800">{detectionResult.suggestedPriceRange}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#63756C] block mb-1">
                Suggested Listing Description
              </span>
              <p className="text-xs text-[#2A3B31] bg-white p-2.5 rounded-xl border border-[#E3ECE6] leading-relaxed">
                "{detectionResult.suggestedDescription}"
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#63756C] block mb-1.5">
                Suggested Taxonomy Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {detectionResult.suggestedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EEF3F0]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRunScan(selectedSample)}
            disabled={isScanning}
            icon={<Scan className="w-3.5 h-3.5" />}
          >
            Re-scan Image
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={!detectionResult || isScanning}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Use AI Suggestions
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
