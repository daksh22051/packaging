/**
 * Curated high-resolution, editorial climate-tech & industrial packaging photography
 * Conforming strictly to CIRCULA's creative direction:
 * - Natural daylight, clean industrial architecture, authentic materials
 * - Cardboard, polymers, wooden pallets, green logistics, sustainable manufacturing
 */

export const BRAND_IMAGES = {
  // Hero split-screen main imagery: Modern clean warehouse with cardboard packaging & daylight
  heroWarehouse:
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85',

  // 1. Corrugated cardboard warehouse & stacked bales
  cardboardWarehouse:
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
  cardboardRolls:
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',

  // 2. Recyclable plastic materials & clean pellets
  plasticPellets:
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80',
  plasticFilm:
    'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1200&q=80',

  // 3. Wooden pallets in logistics warehouse
  woodenPallets:
    'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=1200&q=80',
  euroPallets:
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80',

  // 4. Clean manufacturing facility
  manufacturingFacility:
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
  assemblyLine:
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80',

  // 5. Packaging sorting & recycling stream
  sortingFacility:
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',

  // 6. Delivery & logistics green fleet
  logisticsTruck:
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
  freightHub:
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',

  // 7. Modern warehouse professionals inspecting inventory
  warehouseOperator:
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',

  // 8. Recycled paper & molded fiber
  moldedFiber:
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
  kraftPaper:
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80',

  // 9. Industrial material storage & staging
  industrialStorage:
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',

  // 10. Glass & specialized reusable containers
  glassContainers:
    'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=80',
  reusableCrates:
    'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80'
};

export const CATEGORY_SHOWCASE = [
  {
    name: 'Cardboard & Board',
    slug: 'Cardboard',
    headline: 'Corrugated Flutes & Linerboard',
    description: 'Post-industrial sheet offcuts, surplus boxes, and baled Kraft liners.',
    image: BRAND_IMAGES.cardboardWarehouse,
    availableVolume: '14,800 KG',
    avgPrice: '₹8.50 / kg',
    avoidedCo2PerTonne: '1.8 t CO₂e'
  },
  {
    name: 'Post-Industrial Plastics',
    slug: 'Plastic',
    headline: 'LLDPE, HDPE & PP Regrind',
    description: 'Clean stretch wrap, unprinted baled film, and extrusion scrap.',
    image: BRAND_IMAGES.plasticPellets,
    availableVolume: '8,400 KG',
    avgPrice: '₹22.00 / kg',
    avoidedCo2PerTonne: '2.4 t CO₂e'
  },
  {
    name: 'Pallets & Staging',
    slug: 'Pallets',
    headline: 'Standard Euro & Industrial Pallets',
    description: 'Heat-treated ISPM-15 compliant pallets, plastic runners, and collar frames.',
    image: BRAND_IMAGES.woodenPallets,
    availableVolume: '1,450 Units',
    avgPrice: '₹240 / unit',
    avoidedCo2PerTonne: '1.2 t CO₂e'
  },
  {
    name: 'Industrial Paper',
    slug: 'Paper',
    headline: 'Virgin & Recycled Kraft Rolls',
    description: 'Slit reel ends, honeycomb void fill, and unlaminated packaging paper.',
    image: BRAND_IMAGES.kraftPaper,
    availableVolume: '9,200 KG',
    avgPrice: '₹14.00 / kg',
    avoidedCo2PerTonne: '1.5 t CO₂e'
  },
  {
    name: 'Molded Fiber & Pulp',
    slug: 'Packaging Material',
    headline: 'Biodegradable Shock Absorbers',
    description: 'Thermoformed trays, corner protectors, and edge guards.',
    image: BRAND_IMAGES.moldedFiber,
    availableVolume: '5,100 KG',
    avgPrice: '₹18.50 / kg',
    avoidedCo2PerTonne: '1.6 t CO₂e'
  },
  {
    name: 'Reusable Packaging',
    slug: 'Other',
    headline: 'Collapsible Crates & IBC Containers',
    description: 'Multi-trip returnable transport packaging for closed loops.',
    image: BRAND_IMAGES.reusableCrates,
    availableVolume: '3,200 Units',
    avgPrice: '₹380 / unit',
    avoidedCo2PerTonne: '3.1 t CO₂e'
  }
];
