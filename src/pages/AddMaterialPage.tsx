import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Scan,
  Bot,
  MapPin,
  Layers,
  Leaf,
  Scale,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { AiMaterialScannerModal } from '../components/ai/AiMaterialScannerModal';
import { aiService } from '../services/aiService';
import {
  MaterialCategory,
  MaterialCondition,
  TransactionType,
  AiDetectionResult
} from '../types';

export const AddMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const { addMaterial, currentUser, triggerToast } = useApp();

  const [step, setStep] = useState(1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState<MaterialCategory>('Cardboard');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(2500);
  const [unit, setUnit] = useState('kg');
  const [condition, setCondition] = useState<MaterialCondition>('Good');
  const [grade, setGrade] = useState('Double Wall 5-Ply / 150 GSM');
  const [dimensions, setDimensions] = useState('600 x 400 x 400 mm');
  const [transactionType, setTransactionType] = useState<TransactionType>('Purchase');
  const [pricePerUnit, setPricePerUnit] = useState(8.5);
  const [city, setCity] = useState(currentUser.city || 'Ahmedabad');
  const [state, setState] = useState('Gujarat');
  const [operatingRadiusKm, setOperatingRadiusKm] = useState(120);
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  ]);
  const [tags, setTags] = useState<string[]>([
    'Reusable',
    'Recyclable',
    'Corrugated',
    'Secondary Packaging'
  ]);

  // Handle AI scanner suggestions
  const handleApplyAiSuggestions = (result: AiDetectionResult) => {
    setCategory(result.suggestedCategory.split('→')[1]?.trim() as any || 'Cardboard');
    setTitle(`${result.estimatedCondition} ${result.detectedMaterial}`);
    setDescription(result.suggestedDescription);
    setCondition(result.estimatedCondition as any);
    setTags(result.suggestedTags);
    triggerToast(
      'AI Spec Applied',
      `Auto-filled category and description with ${result.confidence}% confidence.`
    );
  };

  // Handle natural language prompt listing generator
  const handleAiPromptGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    try {
      const generated = await aiService.generateListingFromPrompt(aiPrompt);
      setTitle(generated.title);
      setDescription(generated.description);
      setCategory(generated.category as any);
      setQuantity(generated.quantity);
      setUnit(generated.unit);
      setCondition(generated.condition as any);
      setPricePerUnit(generated.pricePerUnit);
      setTags(generated.tags);
      triggerToast(
        'Draft Synthesized',
        'Your listing specifications were drafted by Circular AI.'
      );
    } catch {
      // ignore
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePublish = async () => {
    // Validation
    if (!quantity || quantity <= 0) {
      setSubmitError('Material quantity must be greater than zero.');
      setStep(4);
      return;
    }

    if (transactionType === 'Purchase' && (!pricePerUnit || pricePerUnit <= 0)) {
      setSubmitError('Please specify a valid price per unit for purchased surplus.');
      setStep(5);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await addMaterial({
        title: title || `${condition} ${category} Surplus`,
        category,
        condition,
        quantity: Number(quantity),
        unit,
        pricePerUnit: transactionType === 'Free Claim' ? 0 : Number(pricePerUnit),
        currency: 'INR',
        transactionType,
        location: {
          city: city || 'Ahmedabad',
          state: state || 'Gujarat',
          pincode: '382110',
          coordinates: [72.5714, 23.0225]
        },
        distanceKm: 28,
        description:
          description ||
          `High-quality surplus ${category.toLowerCase()} ready for circular redistribution and immediate dispatch.`,
        images: imageUrls,
        specifications: {
          grade,
          dimensions,
          weightPerUnit: '0.65 kg',
          moistureContent: '< 8%',
          recyclability: '100% Recyclable',
          packagingFormat: 'Palletized & Strapped',
          pickupRequirements: 'Forklift Access Required'
        },
        supplier: {
          id: currentUser.id,
          name: currentUser.name,
          verified: true,
          rating: 4.9,
          city: currentUser.city,
          circularityScore: currentUser.circularityScore
        },
        tags,
        impact: {
          virginMaterialAvoidedKg: Math.round(quantity * 0.7),
          wasteDivertedKg: quantity,
          co2AvoidedTonnes: Number((quantity * 0.00072).toFixed(2)),
          waterSavedLiters: Math.round(quantity * 4.9)
        }
      });

      triggerToast(
        'Listing Published',
        'Your material is live on the CIRCULA marketplace and being evaluated for smart matches.'
      );
      navigate('/marketplace');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to publish listing. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: MaterialCategory[] = [
    'Cardboard',
    'Plastic',
    'Pallets',
    'Paper',
    'Glass',
    'Metal',
    'Other'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E1EAE3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Step 0{step} / 08
            </span>
            <span className="text-xs text-[#62756A]">•</span>
            <span className="text-xs text-[#62756A] font-semibold">
              Surplus Cataloging Workflow
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#162720] tracking-tight">
            List Packaging Surplus Material
          </h1>
        </div>

        {/* AI Camera Scan Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsScannerOpen(true)}
          icon={<Scan className="w-3.5 h-3.5 text-emerald-700" />}
        >
          AI Vision Scanner
        </Button>
      </div>

      {/* Natural Language Prompt Assistant Banner */}
      <div className="p-4 rounded-2xl bg-[#EEF5F0] border border-[#D5E5DA] space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#16382C]">
          <Bot className="w-4 h-4 text-emerald-700" />
          <span>AI Listing Assistant</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Create a listing for 3 tonnes of good-quality cardboard boxes"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiPromptGenerate()}
            className="flex-1 px-3.5 py-2 bg-white border border-[#CCDCD1] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleAiPromptGenerate}
            disabled={isGeneratingAi}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {isGeneratingAi ? 'Drafting...' : 'Auto-Draft'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-[#16382C]' : 'bg-[#E2EBE5]'
            }`}
          />
        ))}
      </div>

      {/* Step Form Box */}
      <div className="bg-white rounded-3xl border border-[#DCE6DE] shadow-xs p-6 sm:p-8 space-y-6">
        {/* Step 1: Select Material */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#162720]">
                Step 1: Select Material Stream
              </h3>
              <p className="text-xs text-[#596B61] mt-0.5">
                Choose the primary packaging material classification for your surplus lot.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    category === cat
                      ? 'bg-[#16382C] text-white border-[#16382C] shadow-xs'
                      : 'bg-[#FAFCFA] text-[#3D4F44] border-[#DAE4DC] hover:bg-white'
                  }`}
                >
                  <span className="text-sm font-bold block">{cat}</span>
                  <span
                    className={`text-[11px] block mt-0.5 ${
                      category === cat ? 'text-emerald-200' : 'text-[#67796E]'
                    }`}
                  >
                    Industrial packaging
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Material Information */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#162720]">
                Step 2: Material Specifications & Volume
              </h3>
              <p className="text-xs text-[#596B61] mt-0.5">
                Define the title, volume, condition, and polymer/board grade.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Surplus Corrugated Cardboard Boxes (Double Wall)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                    Measurement Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] font-semibold focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="tonnes">tonnes (Metric Tonnes)</option>
                    <option value="units">units (Items)</option>
                    <option value="pallets">pallets (Skids)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                    Material Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] font-semibold focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                  >
                    <option value="New">New (Overstock Surplus)</option>
                    <option value="Good">Good (Single-Use Cleared)</option>
                    <option value="Used">Used (Functional Structural)</option>
                    <option value="Recyclable">Recyclable (Direct Regrind/Pulp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                    Grade Specification
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                  Dimensions / Packaging Size
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Transaction Type */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#162720]">
                Step 3: Transaction Model
              </h3>
              <p className="text-xs text-[#596B61] mt-0.5">
                Select whether this material is for commercial sale, free circular off-take, or barter exchange.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                {
                  id: 'Purchase',
                  label: 'Sell Material',
                  desc: 'Monetize surplus inventory at verified market benchmark'
                },
                {
                  id: 'Free Claim',
                  label: 'Free Circular Claim',
                  desc: 'Zero price. Recipient only covers logistics & haulage'
                },
                {
                  id: 'Exchange',
                  label: 'Material Barter',
                  desc: 'Trade surplus in return for required packaging streams'
                }
              ].map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTransactionType(t.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    transactionType === t.id
                      ? 'bg-[#16382C] text-white border-[#16382C] shadow-xs'
                      : 'bg-[#FAFCFA] border-[#D8E3DC] hover:bg-white text-[#384A40]'
                  }`}
                >
                  <span className="font-bold text-sm block">{t.label}</span>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      transactionType === t.id ? 'text-emerald-200' : 'text-[#64766C]'
                    }`}
                  >
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#162720]">
                Step 4: Pricing & Valuation
              </h3>
              <p className="text-xs text-[#596B61] mt-0.5">
                Benchmark your pricing against virgin market rates to maximize uptake speed.
              </p>
            </div>

            {transactionType === 'Free Claim' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                You have selected <strong>Free Circular Claim</strong>. Counterparties will only be billed for verified green freight and loading.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label className="font-bold uppercase tracking-wider text-[#35483E]">
                      Price per {unit} (₹)
                    </label>
                    <span className="font-mono text-emerald-800 font-bold">
                      Virgin Benchmark: ₹14.30 / {unit}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-sm font-mono font-bold text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#DEE7E0] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#5C6E64] block">
                      Total Estimated Batch Value
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-[#16382C]">
                      ₹{(quantity * pricePerUnit).toLocaleString()}
                    </span>
                  </div>
                  <Badge variant="emerald" size="md">
                    ~41% Discount to Virgin
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Location */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#162720]">
                Step 5: Pickup Location & Dispatch Radius
              </h3>
              <p className="text-xs text-[#596B61] mt-0.5">
                Set origin loading bay coordinates and dispatch service radius.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1">
                  City
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
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#DAE3DD] rounded-xl text-xs sm:text-sm text-[#182620]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-bold uppercase tracking-wider text-[#35483E]">
                  Counterparty Radius (Distance)
                </label>
                <span className="font-mono font-bold text-[#16382C]">
                  {operatingRadiusKm} km
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={operatingRadiusKm}
                onChange={(e) => setOperatingRadiusKm(Number(e.target.value))}
                className="w-full accent-[#16382C] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Step 6: Upload Images */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#162720]">
                Step 6: Material Photographs
              </h3>
              <p className="text-xs text-[#596B61] mt-0.5">
                Upload clear photographs of the surplus lot for AI verification and counterparty trust.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative h-32 rounded-2xl overflow-hidden border border-[#D8E3DC] group"
                >
                  <img
                    src={url}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      Primary Photo
                    </span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="h-32 rounded-2xl border-2 border-dashed border-[#CCD8D0] hover:border-emerald-700 bg-[#F9FBF9] flex flex-col items-center justify-center p-3 text-center transition-colors"
              >
                <Camera className="w-5 h-5 text-emerald-800 mb-1" />
                <span className="text-xs font-bold text-[#16382C]">
                  Take Photo / Scanner
                </span>
                <span className="text-[10px] text-[#697B71] mt-0.5">
                  Run Computer Vision
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Review Listing */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-[#162720]">
                Step 7: Review Listing & Estimated Impact
              </h3>
              <p className="text-xs text-[#596B61] mt-0.5">
                Review your material card details and projected Scope 3 emission avoidance before publishing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#DEE7E0] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E1EDE4]">
                <div>
                  <Badge variant="primary" size="sm">
                    {category}
                  </Badge>
                  <h4 className="text-base font-bold text-[#182620] mt-1">
                    {title || `${condition} ${category} Surplus`}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-lg text-[#16382C]">
                    ₹{pricePerUnit}
                  </span>
                  <span className="text-xs text-[#5A6C62] block">/ {unit}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#697C71] block">Volume:</span>
                  <span className="font-bold text-[#182620]">
                    {quantity} {unit}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#697C71] block">Condition:</span>
                  <span className="font-bold text-[#182620]">{condition}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#697C71] block">Origin:</span>
                  <span className="font-bold text-[#182620]">{city}</span>
                </div>
              </div>

              {/* Projected carbon */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs font-semibold text-emerald-900">
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>Projected Carbon Avoidance:</span>
                </div>
                <span className="font-mono font-bold text-sm">
                  {(quantity * 0.00072).toFixed(2)} t CO₂e
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Publish Ready */}
        {step === 8 && (
          <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 max-w-md mx-auto text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-[#162720]">
              Ready to Publish Material to Exchange
            </h3>
            <p className="text-xs sm:text-sm text-[#54675C] max-w-md mx-auto leading-relaxed">
              Your material will immediately be indexed by the matching engine. You will receive notifications when verified buyers in your radius initiate requests.
            </p>
          </div>
        )}

        {/* Form Stepper Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-[#EEF3F0]">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => setStep(step - 1)}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 8 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(step + 1)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              onClick={handlePublish}
              icon={
                isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )
              }
            >
              {isSubmitting ? 'Publishing Consignment...' : 'Publish Listing to Exchange'}
            </Button>
          )}
        </div>
      </div>

      {/* AI Computer Vision Modal */}
      <AiMaterialScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplySuggestions={handleApplyAiSuggestions}
      />
    </div>
  );
};
