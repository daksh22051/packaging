import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Leaf,
  Scale,
  Droplets,
  Package,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Truck,
  Building2,
  Info,
  AlertCircle,
  RefreshCw,
  Receipt,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { materialService } from '../services/materialService';
import { Material, Transaction } from '../types';

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { materials, requestMaterial, triggerToast, currentUser } = useApp();

  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestQty, setRequestQty] = useState<number>(1000);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showHowCalculated, setShowHowCalculated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Submitting transaction state
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);

  // Load material by ID from API with local fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchMaterial() {
      if (!id) {
        setLoadError('No material ID specified.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const { material: fetchedMat } = await materialService.getById(id);
        if (!isMounted) return;

        if (fetchedMat) {
          setMaterial(fetchedMat);
          setSelectedImage(fetchedMat.images[0] || '');
          setRequestQty(fetchedMat.quantity);
        } else {
          // Check local context as safety
          const localMat = materials.find((m) => m.id === id);
          if (localMat) {
            setMaterial(localMat);
            setSelectedImage(localMat.images[0] || '');
            setRequestQty(localMat.quantity);
          } else {
            setLoadError(`Material with ID "${id}" was not found or is no longer listed.`);
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        setLoadError(err.message || 'Failed to load material details.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMaterial();
    return () => {
      isMounted = false;
    };
  }, [id, materials]);

  const handleConfirmRequest = async () => {
    if (!material) return;

    // Check if buyer is trying to order from their own company
    if (material.supplierId === currentUser.id) {
      setOrderError('You cannot create an exchange order for materials listed by your own company.');
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError(null);

    try {
      const tx = await requestMaterial(material.id, requestQty, deliveryNotes);
      setCompletedTransaction(tx);
    } catch (err: any) {
      setOrderError(err.message || 'Transaction submission failed. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    triggerToast(
      isSaved ? 'Listing Removed' : 'Listing Saved',
      isSaved
        ? 'Material removed from your watchlist.'
        : 'Material added to your saved circular watchlist.'
    );
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-[#16382C]" />
        <p className="text-sm font-semibold text-[#52655A]">
          Retrieving real material specification from CIRCULA registry...
        </p>
      </div>
    );
  }

  if (loadError || !material) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-[#162720]">Material Listing Not Found</h2>
        <p className="text-xs sm:text-sm text-[#5D6F64]">
          {loadError || 'The material you requested does not exist or may have been claimed.'}
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const isSoldOut = material.quantity <= 0 || material.status === 'Completed';

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#55675D] hover:text-[#16382C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-[#4D5E53] border-[#DAE3DD] hover:bg-[#F3F7F4]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSaved ? 'Saved' : 'Save Listing'}
            </span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              triggerToast('Link Copied', 'Material link copied to clipboard.');
            }}
            className="p-2 rounded-xl bg-white border border-[#DAE3DD] text-[#4D5E53] hover:bg-[#F3F7F4] text-xs font-medium flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Purchasing Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery & Description (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gallery View */}
          <div className="bg-white rounded-3xl border border-[#DDE6E0] p-4 shadow-xs space-y-3">
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-black/5 border border-[#E7EFE9]">
              <img
                src={selectedImage || material.images[0]}
                alt={material.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="primary" size="md">
                  {material.category}
                </Badge>
                <Badge variant="sage" size="md">
                  {material.condition} Condition
                </Badge>
                {isSoldOut ? (
                  <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold shadow-xs">
                    Allocated / Completed
                  </span>
                ) : (
                  <Badge variant="emerald" size="md">
                    {material.status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {material.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {material.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? 'border-[#16382C] shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl border border-[#DDE6E0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base sm:text-lg text-[#162720]">
                Material Description & Provenance
              </h3>
              <span className="text-xs text-[#6B7E73]">
                Listed: {material.createdAt}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#46584E] leading-relaxed">
              {material.description ||
                `High-grade industrial surplus batch of ${material.category.toLowerCase()} ready for immediate circular reallocation and zero-landfill diversion.`}
            </p>

            {/* Tags */}
            {material.tags && material.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {material.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#EFF5F1] text-[#293B31] text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Specifications Table */}
          <div className="bg-white rounded-3xl border border-[#DDE6E0] p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base sm:text-lg text-[#162720]">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE5]">
                <span className="text-[10px] uppercase font-bold text-[#64776C] block">
                  Grade / Subtype
                </span>
                <span className="font-bold text-[#182620]">
                  {material.specs?.grade || 'Industrial Standard'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE5]">
                <span className="text-[10px] uppercase font-bold text-[#64776C] block">
                  Dimensions
                </span>
                <span className="font-bold text-[#182620]">
                  {material.specs?.dimensions || 'Standard Form Factor'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE5]">
                <span className="text-[10px] uppercase font-bold text-[#64776C] block">
                  Unit Weight
                </span>
                <span className="font-bold text-[#182620]">
                  {material.specs?.weightPerUnitKg ? `${material.specs.weightPerUnitKg} kg` : '0.65 kg'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE5]">
                <span className="text-[10px] uppercase font-bold text-[#64776C] block">
                  Recyclability Rate
                </span>
                <span className="font-bold text-emerald-800">
                  {material.specs?.recyclabilityRate || '100% Recyclable'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#E2ECE5] sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-[#64776C] block">
                  Pickup & Dock Requirements
                </span>
                <span className="font-bold text-[#182620]">
                  {material.specs?.pickupRequirements || 'Standard Forklift & Pallet Jack Bay Access'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Purchasing Box & Impact Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          {/* Main Action Card */}
          <div className="bg-white rounded-3xl border border-[#DCE5DF] p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#5D6F64] mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {material.city || material.location}, {material.state || ''} ({material.distanceKm} km away)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#162720] tracking-tight">
                {material.title}
              </h1>
            </div>

            {/* Pricing and Available volume */}
            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#DFE8E2] space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#16382C]">
                    ₹{material.pricePerUnit}
                  </span>
                  <span className="text-xs text-[#5D6F64] font-medium ml-1">
                    / {material.unit}
                  </span>
                </div>
                <Badge variant="emerald" size="sm">
                  {material.transactionType}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-[#52645B] pt-2 border-t border-[#E4ECE6]">
                <span>Available Volume:</span>
                <span className="font-mono font-bold text-[#182620]">
                  {material.quantity.toLocaleString()} {material.unit}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSoldOut}
                onClick={() => setIsRequestModalOpen(true)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                {isSoldOut
                  ? 'Listing Allocated'
                  : material.transactionType === 'Free Claim'
                  ? 'Claim Material Free'
                  : material.transactionType === 'Exchange'
                  ? 'Initiate Exchange'
                  : 'Buy Material Surplus'}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/matches')}
                  icon={<Sparkles className="w-3.5 h-3.5 text-emerald-700" />}
                >
                  Find Matches
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() =>
                    triggerToast(
                      'Message Sent',
                      `Inquiry initiated with ${material.supplier.name}.`
                    )
                  }
                >
                  Contact Supplier
                </Button>
              </div>
            </div>

            {/* Logistics teaser */}
            <div className="p-3 rounded-xl bg-[#F4F8F5] border border-emerald-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-medium">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Green EV Hauler Telematics Ready</span>
              </div>
              <Link
                to="/logistics"
                className="font-bold text-[#16382C] hover:underline"
              >
                View Route →
              </Link>
            </div>
          </div>

          {/* Dedicated Impact Card */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Estimated Circular Impact
                </span>
              </div>
              <button
                onClick={() => setShowHowCalculated(!showHowCalculated)}
                className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 underline"
              >
                <HelpCircle className="w-3 h-3" />
                <span>How calculated?</span>
              </button>
            </div>

            {showHowCalculated && (
              <div className="p-3 rounded-xl bg-white/10 text-xs text-emerald-100 leading-relaxed border border-white/15 animate-in fade-in">
                Lifecycle emissions calculations reflect EPA WARM v15 packaging factors and GLEC freight emission standards for regional transport.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-emerald-200/80 uppercase block">
                  Virgin Avoided
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-white">
                  {(material.impact?.virginMaterialReplacedKg || Math.round(material.quantity * 0.85)).toLocaleString()} kg
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-emerald-200/80 uppercase block">
                  Waste Diverted
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-white">
                  {(material.impact?.landfillWasteAvoidedKg || material.quantity).toLocaleString()} kg
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-emerald-200/80 uppercase block">
                  CO₂e Avoided
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-300">
                  {material.impact?.co2eAvoidedTonnes || Number(((material.quantity * 0.94) / 1000).toFixed(2))} t
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-emerald-200/80 uppercase block">
                  Water Saved
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-white">
                  {(material.impact?.waterSavedLiters || Math.round(material.quantity * 6.5)).toLocaleString()} L
                </span>
              </div>
            </div>
          </div>

          {/* Supplier Card */}
          <div className="bg-white rounded-3xl border border-[#DCE5DF] p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EBF2EC] text-[#16382C] flex items-center justify-center font-bold text-base">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#182620]">
                    {material.supplier?.name || 'Verified Supplier'}
                  </span>
                  {material.supplier?.verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  )}
                </div>
                <p className="text-xs text-[#596B61]">
                  ★ {material.supplier?.rating || 4.8} • {material.supplier?.city || material.city}
                </p>
              </div>
            </div>

            <Link
              to={`/companies/${material.supplier?.id || material.supplierId}`}
              className="text-xs font-bold text-[#16382C] hover:underline"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Request Material Modal / Transaction Execution */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => {
          if (!isSubmittingOrder) {
            setIsRequestModalOpen(false);
            setCompletedTransaction(null);
            setOrderError(null);
          }
        }}
        title={completedTransaction ? "Exchange Order Confirmed!" : "Initiate Material Exchange"}
        subtitle={
          completedTransaction
            ? `Order #${completedTransaction.orderNumber} successfully registered`
            : `Requesting ${material.title} from ${material.supplier?.name || 'Seller'}`
        }
        maxWidth="lg"
      >
        {completedTransaction ? (
          /* Transaction Success Result Display (Section 7) */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-sm">Order Registered on CIRCULA Exchange</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your circular agreement has been recorded. Logistics dispatch telematics and digital chain-of-custody tokens are active.
              </p>
            </div>

            {/* Detailed Transaction Summary Cards */}
            <div className="bg-[#F8FAF8] rounded-2xl border border-[#DFE8E2] p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E3ECE6]">
                <div>
                  <span className="text-[10px] text-[#617468] uppercase font-bold block">Order Number</span>
                  <span className="font-mono font-bold text-sm text-[#16382C]">{completedTransaction.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#617468] uppercase font-bold block">Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    {completedTransaction.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E3ECE6]">
                <div>
                  <span className="text-[10px] text-[#617468] uppercase font-bold block">Consignment Volume</span>
                  <span className="font-bold text-[#182620]">{completedTransaction.quantity.toLocaleString()} {completedTransaction.unit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#617468] uppercase font-bold block">Total Amount (Incl. Freight)</span>
                  <span className="font-mono font-bold text-[#182620]">₹{completedTransaction.totalInr.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E3ECE6]">
                <div>
                  <span className="text-[10px] text-[#617468] uppercase font-bold block">Dispatch Origin</span>
                  <span className="font-bold text-[#182620]">{material.supplier?.name} ({material.city})</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#617468] uppercase font-bold block">Receiving Plant</span>
                  <span className="font-bold text-[#182620]">{currentUser.name} ({currentUser.city})</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="font-semibold text-xs text-emerald-100">Carbon Avoidance Credited:</span>
                </div>
                <span className="font-mono font-bold text-sm text-emerald-300">
                  {completedTransaction.estimatedCo2AvoidedTonnes} t CO₂e
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsRequestModalOpen(false);
                  setCompletedTransaction(null);
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsRequestModalOpen(false);
                  navigate('/transactions');
                }}
                icon={<FileCheck2 className="w-3.5 h-3.5" />}
              >
                View in Transactions Hub
              </Button>
            </div>
          </div>
        ) : (
          /* Order Initiation Form */
          <div className="space-y-4">
            {orderError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{orderError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1.5">
                Requested Quantity ({material.unit})
              </label>
              <input
                type="number"
                min="10"
                max={material.quantity}
                value={requestQty}
                onChange={(e) => setRequestQty(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 bg-[#F6FAF7] border border-[#D9E3DC] rounded-xl text-sm font-mono font-bold text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
              />
              <span className="text-[11px] text-[#617468] mt-1 block">
                Available surplus: {material.quantity.toLocaleString()} {material.unit}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAFCFA] border border-[#DFE7E1] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B6D62]">Estimated Material Subtotal:</span>
                <span className="font-mono font-bold text-[#182620]">
                  ₹{(requestQty * material.pricePerUnit).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B6D62]">Green Logistics (Optimized Route):</span>
                <span className="font-mono font-bold text-emerald-800">
                  ₹4,650 (Save ₹750)
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EEF3F0] font-bold text-sm">
                <span className="text-[#162720]">Estimated Net Total:</span>
                <span className="font-mono text-[#16382C]">
                  ₹{(requestQty * material.pricePerUnit + 4650).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#35483E] mb-1.5">
                Dispatch Instructions & Receiving Bay Notes
              </label>
              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Forklift bay required at Gate 4 receiving dock."
                className="w-full px-3.5 py-2 bg-[#F6FAF7] border border-[#D9E3DC] rounded-xl text-xs text-[#182620] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmittingOrder}
                onClick={() => setIsRequestModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isSubmittingOrder || requestQty <= 0 || requestQty > material.quantity}
                onClick={handleConfirmRequest}
                icon={
                  isSubmittingOrder ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )
                }
              >
                {isSubmittingOrder
                  ? 'Authorizing Trade...'
                  : material.transactionType === 'Free Claim'
                  ? 'Confirm Free Claim'
                  : material.transactionType === 'Exchange'
                  ? 'Confirm Exchange Order'
                  : 'Confirm Purchase Order'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
