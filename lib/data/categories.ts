import type { Category, CategoryIconName, MaterialType } from "@/types";
import { slugify } from "@/lib/utils/format";

interface CategorySeed {
  name: string;
  shortName: string;
  materialType: MaterialType;
  icon: CategoryIconName;
  description: string;
  subCategories: string[];
  facetKeys: string[];
  cardAttributeKeys: string[];
}

const seeds: CategorySeed[] = [
  {
    name: "Cement & Concrete",
    shortName: "Cement",
    materialType: "cement",
    icon: "factory",
    description: "OPC, PPC and PSC cement from India's leading plants, ready-mix concrete and dry mortars delivered to site.",
    subCategories: ["OPC 43", "OPC 53", "PPC", "PSC", "White Cement", "Ready-Mix Concrete", "Dry Mortar"],
    facetKeys: ["grade", "type", "bagWeight", "compressiveStrength", "isCode", "rmcGrade"],
    cardAttributeKeys: ["grade", "bagWeight"],
  },
  {
    name: "Steel & TMT",
    shortName: "Steel",
    materialType: "steel",
    icon: "construction",
    description: "Fe500, Fe500D and Fe550D TMT bars, structural sections, MS pipes and binding wire at live market prices.",
    subCategories: ["TMT Bars", "Binding Wire", "Structural Steel", "MS Pipes", "Mesh"],
    facetKeys: ["diameter", "grade", "length", "corrosionResistant", "bundleSize"],
    cardAttributeKeys: ["grade", "diameter"],
  },
  {
    name: "Bricks & Blocks",
    shortName: "Bricks",
    materialType: "bricks",
    icon: "brick-wall",
    description: "Red clay and fly ash bricks, AAC blocks, solid and hollow concrete blocks and interlocking pavers.",
    subCategories: ["Red Clay Bricks", "Fly Ash Bricks", "AAC Blocks", "Concrete Blocks", "Paver Blocks"],
    facetKeys: ["size", "density", "compressiveStrength", "waterAbsorption", "piecesPerPallet"],
    cardAttributeKeys: ["size", "compressiveStrength"],
  },
  {
    name: "Sand & Aggregates",
    shortName: "Sand",
    materialType: "aggregates",
    icon: "mountain",
    description: "Washed river sand, M-Sand, P-Sand, 20mm and 40mm blue metal, gravel and stone dust by the tonne or truck load.",
    subCategories: ["River Sand", "M-Sand", "P-Sand", "Aggregate", "Gravel", "Stone Dust"],
    facetKeys: ["particleSize", "source", "siltContent", "truckLoad"],
    cardAttributeKeys: ["particleSize", "source"],
  },
  {
    name: "Tiles & Flooring",
    shortName: "Tiles",
    materialType: "tiles",
    icon: "grid",
    description: "Vitrified, ceramic and porcelain tiles, natural granite, marble and Kota stone, wooden and SPC flooring.",
    subCategories: ["Vitrified Tiles", "Ceramic Tiles", "Porcelain Tiles", "Wall Tiles", "Granite", "Marble", "Kota Stone", "Wooden Flooring", "Vinyl & SPC"],
    facetKeys: ["size", "finish", "thickness", "colour", "application", "antiSkid"],
    cardAttributeKeys: ["size", "finish"],
  },
  {
    name: "Paints & Coatings",
    shortName: "Paints",
    materialType: "paint",
    icon: "paint-roller",
    description: "Interior and exterior emulsions, primers, enamels, wood finishes, wall putty and textures.",
    subCategories: ["Interior Emulsion", "Exterior Emulsion", "Primer", "Enamel", "Wood Finish", "Putty", "Texture"],
    facetKeys: ["finish", "packSize", "coverage", "washable", "vocLevel", "colourFamily"],
    cardAttributeKeys: ["finish", "packSize"],
  },
  {
    name: "Waterproofing & Chemicals",
    shortName: "Waterproofing",
    materialType: "waterproofing",
    icon: "droplets",
    description: "Roof coatings, membranes, concrete admixtures, tile adhesives, grouts, sealants and epoxy systems.",
    subCategories: ["Roof Coatings", "Membranes", "Admixtures", "Tile Adhesive", "Grout", "Sealants", "Epoxy"],
    facetKeys: ["applicationArea", "packSize", "base", "cureTime"],
    cardAttributeKeys: ["base", "packSize"],
  },
  {
    name: "Plumbing & Pipes",
    shortName: "Plumbing",
    materialType: "plumbing",
    icon: "pipette",
    description: "CPVC, UPVC, PVC, GI and HDPE pipes with fittings, valves and multi-layer water tanks.",
    subCategories: ["CPVC Pipes", "UPVC Pipes", "PVC Pipes", "GI Pipes", "HDPE Pipes", "Fittings", "Valves", "Water Tanks"],
    facetKeys: ["material", "diameter", "pressureClass", "length", "tankCapacity", "layers"],
    cardAttributeKeys: ["material", "diameter"],
  },
  {
    name: "Electrical",
    shortName: "Electrical",
    materialType: "electrical",
    icon: "plug",
    description: "FR, FRLS and HFFR house wires, modular switches, MCBs and distribution boards, conduits, lighting and fans.",
    subCategories: ["Wires & Cables", "Switches & Sockets", "MCBs & DBs", "Conduits", "Lighting", "Fans"],
    facetKeys: ["wireGauge", "core", "fireRating", "currentRating", "coilLength", "colour"],
    cardAttributeKeys: ["wireGauge", "fireRating"],
  },
  {
    name: "Sanitaryware & Bath",
    shortName: "Sanitary",
    materialType: "sanitary",
    icon: "shower-head",
    description: "Wall-hung and floor-mounted WCs, wash basins, faucets, showers, kitchen sinks and bath accessories.",
    subCategories: ["WC", "Wash Basins", "Faucets", "Showers", "Kitchen Sinks", "Accessories"],
    facetKeys: ["mounting", "trapType", "flushType", "material", "finish"],
    cardAttributeKeys: ["mounting", "finish"],
  },
  {
    name: "Wood, Plywood & Boards",
    shortName: "Plywood",
    materialType: "wood",
    icon: "trees",
    description: "MR, BWR, BWP and marine plywood, block boards, MDF, HDHMR, laminates, veneers and flush doors.",
    subCategories: ["Plywood", "Block Board", "MDF", "HDHMR", "Laminates", "Veneers"],
    facetKeys: ["grade", "thickness", "size", "coreWood", "isCode"],
    cardAttributeKeys: ["grade", "thickness"],
  },
  {
    name: "Doors, Windows & Glass",
    shortName: "Doors & Windows",
    materialType: "doors-windows",
    icon: "door-open",
    description: "Flush and membrane doors, UPVC and aluminium windows, toughened and laminated glass, and door hardware.",
    subCategories: ["Flush Doors", "UPVC Windows", "Aluminium Windows", "Glass", "Door Hardware"],
    facetKeys: ["material", "size", "glassType", "thickness", "frameColour"],
    cardAttributeKeys: ["material", "size"],
  },
  {
    name: "Roofing & Sheets",
    shortName: "Roofing",
    materialType: "roofing",
    icon: "house",
    description: "Colour-coated metal roofing, polycarbonate sheets, fibre cement sheets, roof tiles and insulation.",
    subCategories: ["Metal Roofing", "Polycarbonate", "Cement Sheets", "Roof Tiles", "Insulation"],
    facetKeys: ["material", "thickness", "length", "profile", "colour", "coating"],
    cardAttributeKeys: ["thickness", "coating"],
  },
  {
    name: "Hardware & Fasteners",
    shortName: "Hardware",
    materialType: "hardware",
    icon: "hammer",
    description: "Hinges, mortise locks, handles, drawer channels, screws, anchors and nails in SS, brass and MS.",
    subCategories: ["Hinges", "Locks", "Handles", "Screws", "Anchors", "Nails", "Channels"],
    facetKeys: ["material", "size", "finish", "packQuantity"],
    cardAttributeKeys: ["material", "size"],
  },
  {
    name: "Tools & Equipment",
    shortName: "Tools",
    materialType: "tools",
    icon: "drill",
    description: "Power tools, hand tools, laser levels and measuring tools, concrete mixers and scaffolding to rent or buy.",
    subCategories: ["Power Tools", "Hand Tools", "Measuring", "Mixers", "Scaffolding"],
    facetKeys: ["power", "voltage", "battery", "warranty"],
    cardAttributeKeys: ["power", "warranty"],
  },
  {
    name: "Safety Gear",
    shortName: "Safety",
    materialType: "safety",
    icon: "hard-hat",
    description: "ISI and EN certified helmets, safety shoes, gloves, full-body harnesses and hi-vis jackets.",
    subCategories: ["Helmets", "Safety Shoes", "Gloves", "Harnesses", "Jackets"],
    facetKeys: ["size", "standard", "material", "colour"],
    cardAttributeKeys: ["standard", "material"],
  },
];

export const legacyCategories: Category[] = seeds.map((s) => {
  const slug = slugify(s.name);
  return {
    id: `cat-${s.materialType}`,
    slug,
    name: s.name,
    shortName: s.shortName,
    materialType: s.materialType,
    icon: s.icon,
    image: `/images/categories/${s.materialType}.jpg`,
    banner: `/images/categories/${s.materialType}-banner.jpg`,
    description: s.description,
    subCategories: s.subCategories.map((name) => ({
      id: `sub-${s.materialType}-${slugify(name)}`,
      slug: slugify(name),
      name,
      categoryId: `cat-${s.materialType}`,
    })),
    facetKeys: s.facetKeys,
    cardAttributeKeys: s.cardAttributeKeys,
  };
});

/** Human labels (and optional value suffix) for attribute keys across all material types. */
export const ATTRIBUTE_LABELS: Record<string, { label: string; suffix?: string }> = {
  grade: { label: "Grade" },
  type: { label: "Type" },
  bagWeight: { label: "Bag Weight" },
  settingTime: { label: "Initial Setting Time" },
  compressiveStrength: { label: "Compressive Strength" },
  isCode: { label: "IS Code" },
  rmcGrade: { label: "RMC Grade" },
  diameter: { label: "Diameter" },
  length: { label: "Length" },
  weightPerMetre: { label: "Weight / Metre" },
  corrosionResistant: { label: "Corrosion Resistant" },
  bundleSize: { label: "Bundle Size" },
  size: { label: "Size" },
  density: { label: "Density" },
  waterAbsorption: { label: "Water Absorption" },
  piecesPerPallet: { label: "Pieces / Pallet" },
  particleSize: { label: "Particle Size" },
  source: { label: "Source" },
  siltContent: { label: "Silt Content" },
  truckLoad: { label: "Truck Load" },
  finish: { label: "Finish" },
  thickness: { label: "Thickness" },
  colour: { label: "Colour" },
  application: { label: "Application" },
  coveragePerBox: { label: "Coverage / Box" },
  antiSkid: { label: "Anti-skid Rating" },
  packSize: { label: "Pack Size" },
  coverage: { label: "Coverage" },
  coats: { label: "Recommended Coats" },
  washable: { label: "Washable" },
  vocLevel: { label: "VOC Level" },
  colourFamily: { label: "Colour Family" },
  applicationArea: { label: "Application Area" },
  cureTime: { label: "Cure Time" },
  base: { label: "Base" },
  material: { label: "Material" },
  pressureClass: { label: "Pressure Class" },
  tankCapacity: { label: "Tank Capacity" },
  layers: { label: "Layers" },
  wireGauge: { label: "Wire Size" },
  core: { label: "Core" },
  voltage: { label: "Voltage" },
  currentRating: { label: "Current Rating" },
  fireRating: { label: "Fire Rating" },
  coilLength: { label: "Coil Length" },
  mounting: { label: "Mounting" },
  trapType: { label: "Trap Type" },
  flushType: { label: "Flush Type" },
  dimensions: { label: "Dimensions" },
  coreWood: { label: "Core Wood" },
  glassType: { label: "Glass Type" },
  frameColour: { label: "Frame Colour" },
  profile: { label: "Profile" },
  coating: { label: "Coating" },
  packQuantity: { label: "Pack Quantity" },
  power: { label: "Power" },
  battery: { label: "Battery" },
  warranty: { label: "Warranty" },
  standard: { label: "Standard" },
};

export function attributeLabel(key: string) {
  return ATTRIBUTE_LABELS[key]?.label ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

/** Shared Smart-MEP taxonomy for navigation, listing and search. */
export const categories: Category[] = [
  {
    "id": "cat-airport-systems-and-airside",
    "slug": "airport-systems-and-airside",
    "name": "Airport Systems & Airside",
    "shortName": "Airport & Airside",
    "materialType": "electrical",
    "icon": "plane",
    "image": "/images/categories/airport.svg",
    "banner": "/images/categories/airport.svg",
    "description": "Airfield lighting, airside infrastructure and passenger terminal systems.",
    "subCategories": [
      {
        "id": "sub-airport-systems-and-airside-airfield-lighting",
        "slug": "airfield-lighting",
        "name": "Airfield Lighting",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-runway-taxiway-signs",
        "slug": "runway-taxiway-signs",
        "name": "Runway/Taxiway Signs",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-papi-system",
        "slug": "papi-system",
        "name": "PAPI System",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-approach-lighting",
        "slug": "approach-lighting",
        "name": "Approach Lighting",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-ccr",
        "slug": "ccr",
        "name": "CCR",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-agl-cables",
        "slug": "agl-cables",
        "name": "AGL Cables",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-baggage-conveyor",
        "slug": "baggage-conveyor",
        "name": "Baggage Conveyor",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-passenger-boarding-equipment",
        "slug": "passenger-boarding-equipment",
        "name": "Passenger Boarding Equipment",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-passenger-information-displays",
        "slug": "passenger-information-displays",
        "name": "Passenger Information Displays",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-access-control",
        "slug": "access-control",
        "name": "Access Control",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-cctv",
        "slug": "cctv",
        "name": "CCTV",
        "categoryId": "cat-airport-systems-and-airside"
      },
      {
        "id": "sub-airport-systems-and-airside-public-address-system",
        "slug": "public-address-system",
        "name": "Public Address System",
        "categoryId": "cat-airport-systems-and-airside"
      }
    ],
    "facetKeys": [
      "material",
      "size",
      "grade",
      "diameter",
      "voltage",
      "power",
      "finish",
      "application"
    ],
    "cardAttributeKeys": [
      "grade",
      "diameter",
      "material",
      "size"
    ]
  },
  {
    "id": "cat-mechanical",
    "slug": "mechanical",
    "name": "Mechanical",
    "shortName": "Mechanical",
    "materialType": "tools",
    "icon": "fan",
    "image": "/images/categories/mechanical.svg",
    "banner": "/images/categories/mechanical.svg",
    "description": "HVAC equipment, ductwork, insulation and piping for efficient building services.",
    "subCategories": [
      {
        "id": "sub-mechanical-ahu",
        "slug": "ahu",
        "name": "AHU",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-fcu",
        "slug": "fcu",
        "name": "FCU",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-chillers",
        "slug": "chillers",
        "name": "Chillers",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-pumps",
        "slug": "pumps",
        "name": "Pumps",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-gi-ductwork",
        "slug": "gi-ductwork",
        "name": "GI Ductwork",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-duct-insulation",
        "slug": "duct-insulation",
        "name": "Duct Insulation",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-chilled-water-pipe",
        "slug": "chilled-water-pipe",
        "name": "Chilled-Water Pipe",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-refrigerant-pipe",
        "slug": "refrigerant-pipe",
        "name": "Refrigerant Pipe",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-valves",
        "slug": "valves",
        "name": "Valves",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-dampers",
        "slug": "dampers",
        "name": "Dampers",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-diffusers-grilles",
        "slug": "diffusers-grilles",
        "name": "Diffusers / Grilles",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-exhaust-fans",
        "slug": "exhaust-fans",
        "name": "Exhaust Fans",
        "categoryId": "cat-mechanical"
      },
      {
        "id": "sub-mechanical-louvers",
        "slug": "louvers",
        "name": "Louvers",
        "categoryId": "cat-mechanical"
      }
    ],
    "facetKeys": [
      "material",
      "size",
      "grade",
      "diameter",
      "voltage",
      "power",
      "finish",
      "application"
    ],
    "cardAttributeKeys": [
      "grade",
      "diameter",
      "material",
      "size"
    ]
  },
  {
    "id": "cat-electrical",
    "slug": "electrical",
    "name": "Electrical",
    "shortName": "Electrical",
    "materialType": "electrical",
    "icon": "plug",
    "image": "/images/categories/electrical.jpg",
    "banner": "/images/categories/electrical-banner.jpg",
    "description": "Power distribution, cables, containment, backup power and lighting.",
    "subCategories": [
      {
        "id": "sub-electrical-lv-cables",
        "slug": "lv-cables",
        "name": "LV Cables",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-mv-cables",
        "slug": "mv-cables",
        "name": "MV Cables",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-cable-trays",
        "slug": "cable-trays",
        "name": "Cable Trays",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-conduits",
        "slug": "conduits",
        "name": "Conduits",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-main-switchboards",
        "slug": "main-switchboards",
        "name": "Main Switchboards",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-smdb-db",
        "slug": "smdb-db",
        "name": "SMDB / DB",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-mcc",
        "slug": "mcc",
        "name": "MCC",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-circuit-breakers",
        "slug": "circuit-breakers",
        "name": "Circuit Breakers",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-transformers",
        "slug": "transformers",
        "name": "Transformers",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-generator",
        "slug": "generator",
        "name": "Generator",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-ups",
        "slug": "ups",
        "name": "UPS",
        "categoryId": "cat-electrical"
      },
      {
        "id": "sub-electrical-lighting-fixtures",
        "slug": "lighting-fixtures",
        "name": "Lighting Fixtures",
        "categoryId": "cat-electrical"
      }
    ],
    "facetKeys": [
      "material",
      "size",
      "grade",
      "diameter",
      "voltage",
      "power",
      "finish",
      "application"
    ],
    "cardAttributeKeys": [
      "grade",
      "diameter",
      "material",
      "size"
    ]
  },
  {
    "id": "cat-plumbing",
    "slug": "plumbing",
    "name": "Plumbing",
    "shortName": "Plumbing",
    "materialType": "plumbing",
    "icon": "pipette",
    "image": "/images/categories/plumbing.jpg",
    "banner": "/images/categories/plumbing-banner.jpg",
    "description": "Water supply, drainage, pumps, fixtures and pipework for every project.",
    "subCategories": [
      {
        "id": "sub-plumbing-potable-water-pipe",
        "slug": "potable-water-pipe",
        "name": "Potable-Water Pipe",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-drainage-pipe",
        "slug": "drainage-pipe",
        "name": "Drainage Pipe",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-pipe-fittings",
        "slug": "pipe-fittings",
        "name": "Pipe Fittings",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-water-tanks",
        "slug": "water-tanks",
        "name": "Water Tanks",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-transfer-booster",
        "slug": "transfer-booster",
        "name": "Transfer / Booster",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-water-heaters",
        "slug": "water-heaters",
        "name": "Water Heaters",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-valves",
        "slug": "valves",
        "name": "Valves",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-floor-drains",
        "slug": "floor-drains",
        "name": "Floor Drains",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-sanitary-fixtures",
        "slug": "sanitary-fixtures",
        "name": "Sanitary Fixtures",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-pipe-insulation",
        "slug": "pipe-insulation",
        "name": "Pipe Insulation",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-grease-trap",
        "slug": "grease-trap",
        "name": "Grease Trap",
        "categoryId": "cat-plumbing"
      },
      {
        "id": "sub-plumbing-oil-separator",
        "slug": "oil-separator",
        "name": "Oil Separator",
        "categoryId": "cat-plumbing"
      }
    ],
    "facetKeys": [
      "material",
      "size",
      "grade",
      "diameter",
      "voltage",
      "power",
      "finish",
      "application"
    ],
    "cardAttributeKeys": [
      "grade",
      "diameter",
      "material",
      "size"
    ]
  },
  {
    "id": "cat-civil",
    "slug": "civil",
    "name": "Civil",
    "shortName": "Civil",
    "materialType": "cement",
    "icon": "construction",
    "image": "/images/categories/cement.jpg",
    "banner": "/images/categories/cement-banner.jpg",
    "description": "Concrete, reinforcement, aggregates and paving materials for site construction.",
    "subCategories": [
      {
        "id": "sub-civil-ready-mix-concrete",
        "slug": "ready-mix-concrete",
        "name": "Ready-Mix Concrete",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-reinforcement-steel",
        "slug": "reinforcement-steel",
        "name": "Reinforcement Steel",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-structural-steel",
        "slug": "structural-steel",
        "name": "Structural Steel",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-cement",
        "slug": "cement",
        "name": "Cement",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-fine-aggregate",
        "slug": "fine-aggregate",
        "name": "Fine Aggregate",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-coarse-aggregate",
        "slug": "coarse-aggregate",
        "name": "Coarse Aggregate",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-sub-base-material",
        "slug": "sub-base-material",
        "name": "Sub-Base Material",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-asphalt",
        "slug": "asphalt",
        "name": "Asphalt",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-concrete-paving",
        "slug": "concrete-paving",
        "name": "Concrete Paving",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-kerbstones",
        "slug": "kerbstones",
        "name": "Kerbstones",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-interlock-pavers",
        "slug": "interlock-pavers",
        "name": "Interlock / Pavers",
        "categoryId": "cat-civil"
      },
      {
        "id": "sub-civil-concrete-blocks",
        "slug": "concrete-blocks",
        "name": "Concrete Blocks",
        "categoryId": "cat-civil"
      }
    ],
    "facetKeys": [
      "material",
      "size",
      "grade",
      "diameter",
      "voltage",
      "power",
      "finish",
      "application"
    ],
    "cardAttributeKeys": [
      "grade",
      "diameter",
      "material",
      "size"
    ]
  },
  {
    "id": "cat-fire-protection",
    "slug": "fire-protection",
    "name": "Fire Protection",
    "shortName": "Fire Protection",
    "materialType": "safety",
    "icon": "flame",
    "image": "/images/categories/fire-protection.svg",
    "banner": "/images/categories/fire-protection.svg",
    "description": "Fire suppression, detection and alarm systems for building and site safety.",
    "subCategories": [
      {
        "id": "sub-fire-protection-fire-pumps",
        "slug": "fire-pumps",
        "name": "Fire Pumps",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-fire-water-pipes",
        "slug": "fire-water-pipes",
        "name": "Fire-Water Pipes",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-sprinklers",
        "slug": "sprinklers",
        "name": "Sprinklers",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-fire-hydrants",
        "slug": "fire-hydrants",
        "name": "Fire Hydrants",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-hose-reels",
        "slug": "hose-reels",
        "name": "Hose Reels",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-fire-extinguishers",
        "slug": "fire-extinguishers",
        "name": "Fire Extinguishers",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-fire-alarm-panels",
        "slug": "fire-alarm-panels",
        "name": "Fire Alarm Panels",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-smoke-heat-detectors",
        "slug": "smoke-heat-detectors",
        "name": "Smoke / Heat Detectors",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-fire-alarm-modules",
        "slug": "fire-alarm-modules",
        "name": "Fire Alarm Modules",
        "categoryId": "cat-fire-protection"
      },
      {
        "id": "sub-fire-protection-fire-rated-cables",
        "slug": "fire-rated-cables",
        "name": "Fire-Rated Cables",
        "categoryId": "cat-fire-protection"
      }
    ],
    "facetKeys": [
      "material",
      "size",
      "grade",
      "diameter",
      "voltage",
      "power",
      "finish",
      "application"
    ],
    "cardAttributeKeys": [
      "grade",
      "diameter",
      "material",
      "size"
    ]
  }
];
