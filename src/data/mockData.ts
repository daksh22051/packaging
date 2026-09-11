import {
  Company,
  Material,
  SmartMatch,
  Transaction,
  LogisticsPlan,
  EcosystemNode,
  NotificationItem,
  UserStats
} from '../types';

export const CURRENT_USER_COMPANY: Company = {
  id: 'comp-abc-mfg',
  name: 'ABC Manufacturing',
  type: 'Manufacturer',
  industry: 'Automotive & Industrial Goods',
  location: 'Sanand Industrial Estate, Ahmedabad, Gujarat',
  city: 'Ahmedabad',
  state: 'Gujarat',
  rating: 4.9,
  reviewCount: 42,
  verifiedLevel: 'Trusted Circular Partner',
  circularityScore: 82,
  materialsExchangedTonnes: 14.2,
  co2eAvoidedTonnes: 18.6,
  wasteDivertedTonnes: 24.8,
  transactionsCount: 38,
  activeListingsCount: 5,
  memberSince: 'March 2024',
  contactEmail: 'procurement@abcmfg.in',
  phone: '+91 79 4001 2890',
  operatingRadiusKm: 120,
  bio: 'Leading precision components manufacturer committed to zero-landfill packaging operations and circular supply chain integration.'
};

export const MOCK_COMPANIES: Company[] = [
  CURRENT_USER_COMPANY,
  {
    id: 'comp-abc-pack',
    name: 'ABC Packaging Pvt Ltd',
    type: 'Packaging Supplier',
    industry: 'Corrugated & Paper Packaging',
    location: 'Changodar GIDC, Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    rating: 4.8,
    reviewCount: 58,
    verifiedLevel: 'Trusted Circular Partner',
    circularityScore: 89,
    materialsExchangedTonnes: 45.6,
    co2eAvoidedTonnes: 62.4,
    wasteDivertedTonnes: 78.1,
    transactionsCount: 94,
    activeListingsCount: 8,
    memberSince: 'January 2024',
    contactEmail: 'circular@abcpackaging.com',
    phone: '+91 79 2685 9110',
    operatingRadiusKm: 150,
    bio: 'Pioneer in eco-friendly corrugation and recovered paper solutions with regional collection networks.'
  },
  {
    id: 'comp-greenpack',
    name: 'GreenPack Industries',
    type: 'Packaging Supplier',
    industry: 'Rigid Plastics & Thermoforming',
    location: 'Bhiwandi Logistics Hub, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.7,
    reviewCount: 31,
    verifiedLevel: 'Verified',
    circularityScore: 78,
    materialsExchangedTonnes: 28.3,
    co2eAvoidedTonnes: 34.2,
    wasteDivertedTonnes: 41.0,
    transactionsCount: 52,
    activeListingsCount: 6,
    memberSince: 'April 2024',
    contactEmail: 'recycle@greenpack.co.in',
    phone: '+91 22 6120 4400',
    operatingRadiusKm: 200,
    bio: 'Specializing in post-industrial plastic regrinds, stretch film reclamation, and food-grade packaging.'
  },
  {
    id: 'comp-ecocycle',
    name: 'EcoCycle Materials',
    type: 'Recycler',
    industry: 'Secondary Raw Materials & Pelletizing',
    location: 'Makarpura GIDC, Vadodara, Gujarat',
    city: 'Vadodara',
    state: 'Gujarat',
    rating: 4.9,
    reviewCount: 84,
    verifiedLevel: 'Trusted Circular Partner',
    circularityScore: 94,
    materialsExchangedTonnes: 112.0,
    co2eAvoidedTonnes: 148.5,
    wasteDivertedTonnes: 195.0,
    transactionsCount: 165,
    activeListingsCount: 12,
    memberSince: 'November 2023',
    contactEmail: 'partners@ecocycle.in',
    phone: '+91 265 264 8830',
    operatingRadiusKm: 250,
    bio: 'State-of-the-art polymer washing, pelletizing, and closed-loop material recycling plant.'
  },
  {
    id: 'comp-urbanretail',
    name: 'Urban Retail Solutions',
    type: 'Retailer',
    industry: 'Omnichannel FMCG & Logistics',
    location: 'Kalyan Fulfillment Center, Thane, Maharashtra',
    city: 'Thane',
    state: 'Maharashtra',
    rating: 4.6,
    reviewCount: 22,
    verifiedLevel: 'Verified',
    circularityScore: 71,
    materialsExchangedTonnes: 38.9,
    co2eAvoidedTonnes: 44.1,
    wasteDivertedTonnes: 59.2,
    transactionsCount: 46,
    activeListingsCount: 4,
    memberSince: 'June 2024',
    contactEmail: 'sustainability@urbanretail.in',
    phone: '+91 22 4099 7700',
    operatingRadiusKm: 100,
    bio: 'Pan-state distribution warehouse generating clean, pre-sorted secondary packaging and transit boxes.'
  },
  {
    id: 'comp-circularbox',
    name: 'CircularBox Manufacturing',
    type: 'Manufacturer',
    industry: 'Heavy Machinery & Export Packaging',
    location: 'Chakan MIDC, Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 4.9,
    reviewCount: 65,
    verifiedLevel: 'Trusted Circular Partner',
    circularityScore: 86,
    materialsExchangedTonnes: 67.4,
    co2eAvoidedTonnes: 88.0,
    wasteDivertedTonnes: 104.2,
    transactionsCount: 110,
    activeListingsCount: 9,
    memberSince: 'February 2024',
    contactEmail: 'hello@circularbox.com',
    phone: '+91 20 6790 3200',
    operatingRadiusKm: 180,
    bio: 'Heavy-duty timber pallet refurbishment, reusable crate pooling, and closed-loop logistics systems.'
  },
  {
    id: 'comp-reloop',
    name: 'ReLoop Logistics',
    type: 'Logistics',
    industry: 'Green Freight & Return Logistics',
    location: 'Aslali Transport Hub, Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    rating: 4.8,
    reviewCount: 39,
    verifiedLevel: 'Verified',
    circularityScore: 85,
    materialsExchangedTonnes: 0,
    co2eAvoidedTonnes: 29.4,
    wasteDivertedTonnes: 0,
    transactionsCount: 88,
    activeListingsCount: 0,
    memberSince: 'August 2024',
    contactEmail: 'dispatch@relooplogistics.in',
    phone: '+91 79 3344 5500',
    operatingRadiusKm: 500,
    bio: 'Low-carbon fleet aggregator providing electric LCVs, backhaul optimization, and verified custody chain tracking.'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-001',
    title: 'Corrugated Cardboard Sheets & Boxes',
    category: 'Cardboard',
    quantity: 2500,
    unit: 'kg',
    pricePerUnit: 8.5,
    totalEstimatedValue: 21250,
    condition: 'Good',
    transactionType: 'Purchase',
    supplierId: 'comp-abc-pack',
    supplier: MOCK_COMPANIES[1], // ABC Packaging
    location: 'Changodar Industrial Zone, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    distanceKm: 32,
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      grade: 'Grade A - Double Wall 5-Ply',
      dimensions: '1200 x 800 x 15 mm flat stacked',
      weightPerUnitKg: 1.2,
      moistureContent: '< 8% dry storage',
      recyclabilityRate: '100% Repulpable',
      packagingFormat: 'Baled and strapped on standard skids',
      pickupRequirements: 'Forklift accessible bay; closed dry truck required'
    },
    impact: {
      virginMaterialReplacedKg: 1750,
      landfillWasteAvoidedKg: 2500,
      co2eAvoidedTonnes: 1.8,
      waterSavedLiters: 12400,
      energySavedKwh: 1650,
      calculationAssumptions: 'Based on EPA WARM v15 and Indian Paper & Paperboards Federation recovered fiber displacement factors.'
    },
    availability: 'Immediate',
    availableDate: 'Ready for pickup',
    description: 'Surplus double-wall corrugated sheets and clean unprinted master cartons generated from high-volume export packaging runs. Uniformly stacked and plastic-banded.',
    tags: ['Cardboard', '5-Ply', 'Baled', 'Export Grade', 'Low Moisture'],
    isVerified: true,
    createdAt: '2 hours ago',
    status: 'Available'
  },
  {
    id: 'mat-002',
    title: 'Clean Industrial HDPE Regrind Flakes',
    category: 'Plastic',
    quantity: 4200,
    unit: 'kg',
    pricePerUnit: 34.0,
    totalEstimatedValue: 142800,
    condition: 'Good',
    transactionType: 'Purchase',
    supplierId: 'comp-greenpack',
    supplier: MOCK_COMPANIES[2],
    location: 'Bhiwandi, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    distanceKm: 85,
    images: [
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      grade: 'Extrusion Grade MFI 0.35',
      dimensions: '4-8mm flake size',
      moistureContent: '< 0.5%',
      recyclabilityRate: '98% pure polymer',
      packagingFormat: 'Jumbo FIBC bulk bags (1,000 kg each)'
    },
    impact: {
      virginMaterialReplacedKg: 3800,
      landfillWasteAvoidedKg: 4200,
      co2eAvoidedTonnes: 4.6,
      waterSavedLiters: 28000,
      energySavedKwh: 5800
    },
    availability: 'Within 3 Days',
    availableDate: 'Sep 14, 2026',
    description: 'De-labeled and washed natural HDPE flakes from internal bottle molding scrap. Excellent Melt Flow Index for blow molding and corrugated pipe production.',
    tags: ['HDPE', 'Regrind', 'Polymer', 'Clean Flake', 'Bulk Bags'],
    isVerified: true,
    createdAt: '1 day ago',
    status: 'Available'
  },
  {
    id: 'mat-003',
    title: 'Standard EPAL Four-Way Wooden Pallets',
    category: 'Pallets',
    quantity: 350,
    unit: 'units',
    pricePerUnit: 280.0,
    totalEstimatedValue: 98000,
    condition: 'Good',
    transactionType: 'Purchase',
    supplierId: 'comp-circularbox',
    supplier: MOCK_COMPANIES[5],
    location: 'Chakan MIDC, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    distanceKm: 140,
    images: [
      'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      grade: 'EPAL 1 / ISPM 15 Heat Treated',
      dimensions: '1200 x 800 x 144 mm',
      weightPerUnitKg: 24,
      moistureContent: 'Kiln dried < 18%',
      recyclabilityRate: '100% Solid Pine',
      packagingFormat: 'Stacks of 20 pallets'
    },
    impact: {
      virginMaterialReplacedKg: 8400,
      landfillWasteAvoidedKg: 8400,
      co2eAvoidedTonnes: 5.2,
      waterSavedLiters: 9500,
      energySavedKwh: 3100
    },
    availability: 'Immediate',
    availableDate: 'Ready for dispatch',
    description: 'Inspected and certified Grade A Euro wooden pallets from returnable logistics loops. All structural blocks intact, dry-stored, and stamp-verified.',
    tags: ['Pallets', 'EPAL', 'Heat Treated', 'Euro standard', 'Heavy Duty'],
    isVerified: true,
    createdAt: '3 days ago',
    status: 'Available'
  },
  {
    id: 'mat-004',
    title: 'Heavy Duty Kraft Paper Rolls & Edge Protectors',
    category: 'Paper',
    quantity: 1800,
    unit: 'kg',
    pricePerUnit: 14.5,
    totalEstimatedValue: 26100,
    condition: 'New',
    transactionType: 'Purchase',
    supplierId: 'comp-urbanretail',
    supplier: MOCK_COMPANIES[4],
    location: 'Kalyan, Thane',
    city: 'Thane',
    state: 'Maharashtra',
    distanceKm: 65,
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      grade: 'Virgin Unbleached Kraft 180 GSM',
      dimensions: '1000mm width rolls & 50x50x4mm angle boards',
      recyclabilityRate: '100% Compostable/Recyclable'
    },
    impact: {
      virginMaterialReplacedKg: 1400,
      landfillWasteAvoidedKg: 1800,
      co2eAvoidedTonnes: 1.3,
      waterSavedLiters: 11000
    },
    availability: 'Immediate',
    availableDate: 'Ready for pickup',
    description: 'Surplus packaging supply from finished retail fulfillment campaigns. Pristine rolls with minimal edge scuffs and heavy-duty angle boards.',
    tags: ['Kraft', '180 GSM', 'Edge Protectors', 'High Strength'],
    isVerified: true,
    createdAt: '4 days ago',
    status: 'Available'
  },
  {
    id: 'mat-005',
    title: 'Clean Post-Industrial LLDPE Stretch Film',
    category: 'Plastic',
    quantity: 1200,
    unit: 'kg',
    pricePerUnit: 19.0,
    totalEstimatedValue: 22800,
    condition: 'Recyclable',
    transactionType: 'Exchange',
    supplierId: 'comp-abc-pack',
    supplier: MOCK_COMPANIES[1],
    location: 'Sanand, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    distanceKm: 28,
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      grade: 'Clear LLDPE Film Scrap',
      recyclabilityRate: '99% Clean Virgin Grade equivalent'
    },
    impact: {
      virginMaterialReplacedKg: 1100,
      landfillWasteAvoidedKg: 1200,
      co2eAvoidedTonnes: 1.5,
      waterSavedLiters: 8200
    },
    availability: 'Within 3 Days',
    availableDate: 'Sep 15, 2026',
    description: 'Clear, unprinted stretch wrap collected directly from inbound pallet unboxing. Separated from tape and paper labels at source.',
    tags: ['LLDPE', 'Stretch Film', 'Baled', 'Clean Film'],
    isVerified: true,
    createdAt: '5 days ago',
    status: 'Available'
  },
  {
    id: 'mat-006',
    title: 'Industrial Aluminum Bundling Bands & Foil Offcuts',
    category: 'Metal',
    quantity: 950,
    unit: 'kg',
    pricePerUnit: 115.0,
    totalEstimatedValue: 109250,
    condition: 'Good',
    transactionType: 'Purchase',
    supplierId: 'comp-ecocycle',
    supplier: MOCK_COMPANIES[3],
    location: 'Makarpura, Vadodara',
    city: 'Vadodara',
    state: 'Gujarat',
    distanceKm: 110,
    images: [
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80'
    ],
    specs: {
      grade: 'Alloy 3003 / 5052 Strips',
      recyclabilityRate: '100% Infinitely Recyclable'
    },
    impact: {
      virginMaterialReplacedKg: 950,
      landfillWasteAvoidedKg: 950,
      co2eAvoidedTonnes: 7.8,
      waterSavedLiters: 16000
    },
    availability: 'Scheduled Recurring',
    availableDate: 'Weekly collection',
    description: 'High purity secondary aluminum offcuts and heavy gauge strapping coils with minimal surface oxidation.',
    tags: ['Aluminum', 'Metal', 'High Recovery', 'Circular Alloy'],
    isVerified: true,
    createdAt: '1 week ago',
    status: 'Available'
  }
];

export const INITIAL_MATCHES: SmartMatch[] = [
  {
    id: 'match-001',
    materialId: 'mat-001',
    material: INITIAL_MATERIALS[0],
    buyerCompanyId: 'comp-abc-mfg',
    buyerCompany: CURRENT_USER_COMPANY,
    supplierCompany: MOCK_COMPANIES[1], // ABC Packaging
    matchScore: 94,
    compatibility: {
      material: 100,
      quantity: 92,
      distance: 98,
      price: 86,
      carbon: 95
    },
    distanceKm: 32,
    potentialSavingsInr: 14500,
    estimatedCo2AvoidedTonnes: 1.6,
    whyThisMatch:
      'This supplier is a strong match because the material grade (Grade A 5-Ply) meets your secondary boxing requirements, the available quantity (2,500 kg) matches your quarterly demand (2,000–3,000 kg), and the supplier is located just 32 km away within your preferred operating radius.',
    keyDrivers: [
      'Exact material grade alignment (Double Wall 5-Ply)',
      'Optimal batch size: fits 1 medium LCV haul',
      'Short transit radius: 32 km vs 150 km market average',
      'Verified Trusted Circular Partner with 4.8★ reliability'
    ],
    suggestedAction: 'Initiate purchase or inspect sample before batch dispatch'
  },
  {
    id: 'match-002',
    materialId: 'mat-003',
    material: INITIAL_MATERIALS[2],
    buyerCompanyId: 'comp-abc-mfg',
    buyerCompany: CURRENT_USER_COMPANY,
    supplierCompany: MOCK_COMPANIES[5],
    matchScore: 88,
    compatibility: {
      material: 95,
      quantity: 85,
      distance: 82,
      price: 90,
      carbon: 91
    },
    distanceKm: 140,
    potentialSavingsInr: 28000,
    estimatedCo2AvoidedTonnes: 5.2,
    whyThisMatch:
      'Certified EPAL 1 standard pallets heat-treated to ISPM 15 standards, perfectly matching your export machinery palletization specs at 32% lower cost than virgin timber.',
    keyDrivers: [
      'Export certified ISPM 15 heat treated',
      'Immediate readiness for dispatch',
      'High carbon avoidance (5.2 t CO₂e)',
      'Verified counterparty with 65+ transactions'
    ],
    suggestedAction: 'Request batch reservation with consolidated return logistics'
  },
  {
    id: 'match-003',
    materialId: 'mat-005',
    material: INITIAL_MATERIALS[4],
    buyerCompanyId: 'comp-abc-mfg',
    buyerCompany: CURRENT_USER_COMPANY,
    supplierCompany: MOCK_COMPANIES[1],
    matchScore: 85,
    compatibility: {
      material: 90,
      quantity: 80,
      distance: 99,
      price: 78,
      carbon: 88
    },
    distanceKm: 28,
    potentialSavingsInr: 6800,
    estimatedCo2AvoidedTonnes: 1.5,
    whyThisMatch:
      'Local LLDPE stretch film available on direct exchange or procurement, offering rapid 28 km turnaround and eliminating single-use packaging overhead.',
    keyDrivers: [
      'Hyperlocal proximity (28 km)',
      'High purity clean unprinted film',
      'Flexible exchange transaction option'
    ],
    suggestedAction: 'Offer closed-loop exchange with surplus cardboard'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1092',
    orderNumber: 'CIR-2026-8901',
    materialId: 'mat-001',
    materialTitle: 'Corrugated Cardboard Sheets (Batch 1)',
    materialCategory: 'Cardboard',
    quantity: 2450,
    unit: 'kg',
    supplier: MOCK_COMPANIES[1], // ABC Packaging
    buyer: CURRENT_USER_COMPANY,
    supplierCompany: MOCK_COMPANIES[1],
    buyerCompany: CURRENT_USER_COMPANY,
    materialCostInr: 20825,
    transportCostInr: 4650,
    totalInr: 25475,
    totalAmountInr: 25475,
    status: 'Order Confirmed',
    type: 'Purchase',
    date: 'Sep 11, 2026',
    createdAt: 'Sep 11, 2026',
    estimatedCo2AvoidedTonnes: 1.8,
    co2SavedTonnes: 1.8,
    wasteDivertedTonnes: 2.45,
    optimizedRouteSavingsInr: 750,
    carbonAvoidedTransportKg: 18,
    trackingEvents: [
      {
        status: 'Order Confirmed',
        date: 'Sep 11, 2026',
        time: '10:15 AM',
        location: 'CIRCULA Platform',
        description: 'Smart match confirmed and digital bill of lading drafted.',
        completed: true
      },
      {
        status: 'Pickup Scheduled',
        date: 'Sep 12, 2026',
        time: '09:00 AM',
        location: 'Changodar GIDC, Ahmedabad',
        description: 'ReLoop Green LCV assigned for optimized pickup slot.',
        completed: false
      },
      {
        status: 'In Transit',
        date: 'Sep 12, 2026',
        time: '11:30 AM',
        location: 'Ahmedabad Ring Road Corridor',
        description: 'Telematics route tracking active with eco-routing.',
        completed: false
      },
      {
        status: 'Delivered',
        date: 'Sep 12, 2026',
        time: '02:00 PM',
        location: 'Sanand Industrial Estate, Ahmedabad',
        description: 'Inbound weighbridge verification and QR scan.',
        completed: false
      },
      {
        status: 'Verified',
        date: 'Sep 12, 2026',
        time: '04:00 PM',
        location: 'Digital Registry',
        description: 'Carbon reduction certificate and invoice finalized.',
        completed: false
      }
    ],
    logistics: {
      events: [
        {
          status: 'Order Confirmed',
          date: 'Sep 11, 2026',
          time: '10:15 AM',
          location: 'CIRCULA Platform',
          description: 'Smart match confirmed and digital bill of lading drafted.',
          completed: true
        },
        {
          status: 'Pickup Scheduled',
          date: 'Sep 12, 2026',
          time: '09:00 AM',
          location: 'Changodar GIDC, Ahmedabad',
          description: 'ReLoop Green LCV assigned for optimized pickup slot.',
          completed: false
        },
        {
          status: 'In Transit',
          date: 'Sep 12, 2026',
          time: '11:30 AM',
          location: 'Ahmedabad Ring Road Corridor',
          description: 'Telematics route tracking active with eco-routing.',
          completed: false
        },
        {
          status: 'Delivered',
          date: 'Sep 12, 2026',
          time: '02:00 PM',
          location: 'Sanand Industrial Estate, Ahmedabad',
          description: 'Inbound weighbridge verification and QR scan.',
          completed: false
        },
        {
          status: 'Verified',
          date: 'Sep 12, 2026',
          time: '04:00 PM',
          location: 'Digital Registry',
          description: 'Carbon reduction certificate and invoice finalized.',
          completed: false
        }
      ]
    }
  },
  {
    id: 'tx-1088',
    orderNumber: 'CIR-2026-8420',
    materialId: 'mat-003',
    materialTitle: 'Standard Wooden Pallets (Lot 4)',
    materialCategory: 'Pallets',
    quantity: 120,
    unit: 'units',
    supplier: MOCK_COMPANIES[5],
    buyer: CURRENT_USER_COMPANY,
    supplierCompany: MOCK_COMPANIES[5],
    buyerCompany: CURRENT_USER_COMPANY,
    materialCostInr: 33600,
    transportCostInr: 5200,
    totalInr: 38800,
    totalAmountInr: 38800,
    status: 'Verified',
    type: 'Purchase',
    date: 'Aug 28, 2026',
    createdAt: 'Aug 28, 2026',
    estimatedCo2AvoidedTonnes: 1.4,
    co2SavedTonnes: 1.4,
    wasteDivertedTonnes: 2.35,
    optimizedRouteSavingsInr: 1100,
    carbonAvoidedTransportKg: 24,
    trackingEvents: [
      {
        status: 'Order Confirmed',
        date: 'Aug 28, 2026',
        time: '09:30 AM',
        location: 'CIRCULA Platform',
        description: 'Trade agreement completed.',
        completed: true
      },
      {
        status: 'Pickup Scheduled',
        date: 'Aug 29, 2026',
        time: '10:00 AM',
        location: 'Pune MIDC',
        description: 'Pallet lot inspected and loaded.',
        completed: true
      },
      {
        status: 'In Transit',
        date: 'Aug 30, 2026',
        time: '01:00 PM',
        location: 'Western Freight Corridor',
        description: 'Interstate transit completed on schedule.',
        completed: true
      },
      {
        status: 'Delivered',
        date: 'Aug 31, 2026',
        time: '11:00 AM',
        location: 'Sanand Plant',
        description: 'Received at Dock 3.',
        completed: true
      },
      {
        status: 'Verified',
        date: 'Aug 31, 2026',
        time: '03:00 PM',
        location: 'CIRCULA Blockchain Registry',
        description: 'ESG compliance audited and certificate issued.',
        completed: true
      }
    ],
    logistics: {
      events: [
        {
          status: 'Order Confirmed',
          date: 'Aug 28, 2026',
          time: '09:30 AM',
          location: 'CIRCULA Platform',
          description: 'Trade agreement completed.',
          completed: true
        },
        {
          status: 'Pickup Scheduled',
          date: 'Aug 29, 2026',
          time: '10:00 AM',
          location: 'Pune MIDC',
          description: 'Pallet lot inspected and loaded.',
          completed: true
        },
        {
          status: 'In Transit',
          date: 'Aug 30, 2026',
          time: '01:00 PM',
          location: 'Western Freight Corridor',
          description: 'Interstate transit completed on schedule.',
          completed: true
        },
        {
          status: 'Delivered',
          date: 'Aug 31, 2026',
          time: '11:00 AM',
          location: 'Sanand Plant',
          description: 'Received at Dock 3.',
          completed: true
        },
        {
          status: 'Verified',
          date: 'Aug 31, 2026',
          time: '03:00 PM',
          location: 'CIRCULA Blockchain Registry',
          description: 'ESG compliance audited and certificate issued.',
          completed: true
        }
      ]
    }
  }
];

export const DEMO_LOGISTICS_PLAN: LogisticsPlan = {
  id: 'log-8901',
  transactionId: 'tx-1092',
  orderNumber: 'CIR-2026-8901',
  origin: 'ABC Packaging Hub, Changodar GIDC, Ahmedabad',
  destination: 'ABC Manufacturing Plant, Sanand Industrial Estate, Ahmedabad',
  materialQuantityKg: 2450,
  vehicleType: 'EV Small Truck',
  standardRoute: {
    distanceKm: 138,
    costInr: 5400,
    co2Kg: 92,
    durationHours: 3.5
  },
  optimizedRoute: {
    distanceKm: 112,
    costInr: 4650,
    co2Kg: 74,
    durationHours: 2.4
  },
  savingsInr: 750,
  emissionsAvoidedKg: 18,
  emissionsReductionPercent: 19.5,
  status: 'Order Confirmed',
  waypoints: [
    { name: 'Supplier: ABC Packaging (Changodar)', type: 'origin', lat: 22.923, lng: 72.441 },
    { name: 'Consolidation Waypoint: Sarkhej Hub', type: 'hub', lat: 22.981, lng: 72.502 },
    { name: 'Eco Corridor: Ring Bypass bypass route', type: 'hub', lat: 23.015, lng: 72.412 },
    { name: 'Buyer: ABC Manufacturing (Sanand)', type: 'destination', lat: 22.992, lng: 72.378 }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New 94% Smart Match Found',
    message: '2,500 kg Corrugated Cardboard from ABC Packaging matches your Sanand facility demand.',
    timestamp: '10 mins ago',
    read: false,
    type: 'match',
    link: '/matches'
  },
  {
    id: 'notif-2',
    title: 'Order Confirmed: CIR-2026-8901',
    message: 'Your purchase request for 2,450 kg Cardboard was accepted. Optimized route prepared.',
    timestamp: '1 hour ago',
    read: false,
    type: 'order',
    link: '/transactions'
  },
  {
    id: 'notif-3',
    title: 'Logistics Route Optimized',
    message: 'Eco-routing saved ₹750 and avoided 18 kg CO₂e transport emissions for shipment CIR-2026-8901.',
    timestamp: '2 hours ago',
    read: false,
    type: 'logistics',
    link: '/logistics'
  },
  {
    id: 'notif-4',
    title: 'Circularity Score Updated to 82 / 100',
    message: 'Your diversion rate reached 91% following last month’s verified packaging exchanges.',
    timestamp: '1 day ago',
    read: true,
    type: 'impact',
    link: '/impact'
  },
  {
    id: 'notif-5',
    title: 'Verified Business Status Renewed',
    message: 'Annual circular supply audit completed with zero non-conformities.',
    timestamp: '3 days ago',
    read: true,
    type: 'verification',
    link: '/profile'
  }
];

export const INITIAL_USER_STATS: UserStats = {
  materialsPurchasedKg: 2450,
  materialsListedKg: 1850,
  wasteDivertedTonnes: 4.8,
  co2eAvoidedTonnes: 3.2,
  moneySavedInr: 48500,
  circularityScore: 82,
  scoreBreakdown: {
    materialReuse: 87,
    recycledInputs: 76,
    wasteDiversion: 91,
    localSourcing: 74
  }
};

export const ECOSYSTEM_NODES: EcosystemNode[] = [
  {
    id: 'eco-1',
    name: 'ABC Packaging Hub',
    type: 'Supplier',
    location: 'Changodar, Ahmedabad',
    city: 'Ahmedabad',
    xPercent: 32,
    yPercent: 42,
    materials: ['Cardboard', 'Paper Packaging'],
    demandOrSupply: 'Supply: 2,500 kg/wk Cardboard',
    circularityScore: 89,
    distanceKm: 32,
    potentialCo2Tonnes: 2.1,
    potentialSavingsInr: 16500
  },
  {
    id: 'eco-2',
    name: 'ABC Manufacturing (You)',
    type: 'Buyer',
    location: 'Sanand Estate, Ahmedabad',
    city: 'Ahmedabad',
    xPercent: 48,
    yPercent: 50,
    materials: ['Needs Cardboard', 'Needs Pallets'],
    demandOrSupply: 'Demand: 3,000 kg packaging',
    circularityScore: 82,
    distanceKm: 0,
    potentialCo2Tonnes: 3.2,
    potentialSavingsInr: 48500
  },
  {
    id: 'eco-3',
    name: 'EcoCycle Polymer Recovery',
    type: 'Recycler',
    location: 'Makarpura GIDC, Vadodara',
    city: 'Vadodara',
    xPercent: 68,
    yPercent: 62,
    materials: ['HDPE Flakes', 'LLDPE Film'],
    demandOrSupply: 'Processes 25 tonnes/mo polymers',
    circularityScore: 94,
    distanceKm: 110,
    potentialCo2Tonnes: 6.8,
    potentialSavingsInr: 82000
  },
  {
    id: 'eco-4',
    name: 'ReLoop Green Transit Hub',
    type: 'Logistics Hub',
    location: 'Aslali Freight Bypass',
    city: 'Ahmedabad',
    xPercent: 42,
    yPercent: 35,
    materials: ['Electric LCVs', 'Consolidated Freight'],
    demandOrSupply: 'Fleet Capacity: 40 tonnes/day',
    circularityScore: 85,
    distanceKm: 25,
    potentialCo2Tonnes: 1.8,
    potentialSavingsInr: 12000
  },
  {
    id: 'eco-5',
    name: 'GreenPack Rigid Plastics',
    type: 'Supplier',
    location: 'Bhiwandi Hub, Mumbai',
    city: 'Mumbai',
    xPercent: 78,
    yPercent: 32,
    materials: ['HDPE Regrind', 'PP Buckets'],
    demandOrSupply: 'Supply: 5,000 kg/mo plastics',
    circularityScore: 78,
    distanceKm: 240,
    potentialCo2Tonnes: 4.6,
    potentialSavingsInr: 54000
  },
  {
    id: 'eco-6',
    name: 'Urban Retail Logistics Center',
    type: 'Buyer',
    location: 'Kalyan Fulfillment',
    city: 'Thane',
    xPercent: 62,
    yPercent: 28,
    materials: ['Kraft Paper', 'Mailing Cartons'],
    demandOrSupply: 'Demand: 2,000 units Pallets',
    circularityScore: 71,
    distanceKm: 210,
    potentialCo2Tonnes: 2.9,
    potentialSavingsInr: 31000
  },
  {
    id: 'eco-7',
    name: 'CircularBox Pallet Depot',
    type: 'Supplier',
    location: 'Chakan MIDC, Pune',
    city: 'Pune',
    xPercent: 55,
    yPercent: 75,
    materials: ['EPAL Pallets', 'Plywood Boxes'],
    demandOrSupply: 'Supply: 800 pallets/mo',
    circularityScore: 86,
    distanceKm: 180,
    potentialCo2Tonnes: 5.2,
    potentialSavingsInr: 38000
  }
];

export const IMPACT_TIME_SERIES = [
  { month: 'Apr', exchangedKg: 1100, co2AvoidedTonnes: 1.4, wasteDivertedTonnes: 1.8, savingsInr: 18000 },
  { month: 'May', exchangedKg: 1450, co2AvoidedTonnes: 1.9, wasteDivertedTonnes: 2.3, savingsInr: 24000 },
  { month: 'Jun', exchangedKg: 1800, co2AvoidedTonnes: 2.3, wasteDivertedTonnes: 3.1, savingsInr: 31500 },
  { month: 'Jul', exchangedKg: 2100, co2AvoidedTonnes: 2.7, wasteDivertedTonnes: 3.9, savingsInr: 39000 },
  { month: 'Aug', exchangedKg: 2350, co2AvoidedTonnes: 3.0, wasteDivertedTonnes: 4.4, savingsInr: 44200 },
  { month: 'Sep (YTD)', exchangedKg: 2450, co2AvoidedTonnes: 3.2, wasteDivertedTonnes: 4.8, savingsInr: 48500 }
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Cardboard', value: 52, color: '#16382C' },
  { name: 'Plastic', value: 28, color: '#0F766E' },
  { name: 'Pallets', value: 14, color: '#2563EB' },
  { name: 'Other', value: 6, color: '#D97706' }
];
