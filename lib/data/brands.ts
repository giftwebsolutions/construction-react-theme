import type { Brand, MaterialType } from "@/types";
import { slugify } from "@/lib/utils/format";

type BrandSeed = [name: string, color: string, tagline: string, founded: number, types: MaterialType[], featured?: boolean];

const seeds: BrandSeed[] = [
  ["UltraTech", "#E3A21A", "The Engineer's Choice", 1983, ["cement", "waterproofing"], true],
  ["ACC", "#D7262E", "Cement that builds nations", 1936, ["cement"], true],
  ["Ambuja", "#0060A9", "Giant strength", 1983, ["cement"]],
  ["Ramco", "#C8102E", "Super strong since decades", 1961, ["cement"]],
  ["Dalmia", "#E4002B", "Build strong, build green", 1939, ["cement"]],
  ["Birla White", "#1B75BC", "India's No.1 white cement", 1988, ["cement", "paint"]],
  ["Tata Tiscon", "#0A4DA2", "Superlinks for stronger homes", 1868, ["steel"], true],
  ["JSW Neosteel", "#0055A5", "Better everyday", 1982, ["steel"], true],
  ["SAIL", "#004B8D", "There's a little bit of SAIL in everybody's life", 1954, ["steel"]],
  ["Kamdhenu", "#E31E24", "Strength of steel", 1994, ["steel"]],
  ["Wienerberger", "#C8102E", "Porotherm clay blocks", 1819, ["bricks", "roofing"]],
  ["Magicrete", "#E65100", "Build faster, build smarter", 2008, ["bricks", "waterproofing"]],
  ["Siporex", "#2E7D32", "Lightweight AAC blocks", 1974, ["bricks"]],
  ["Robo Sand", "#6D4C41", "Engineered manufactured sand", 2005, ["aggregates"]],
  ["Kajaria", "#B71C1C", "India's No.1 tile company", 1985, ["tiles", "sanitary"], true],
  ["Somany", "#8E24AA", "Tiles & bathware", 1968, ["tiles", "sanitary"]],
  ["Johnson Tiles", "#1565C0", "Endura strength", 1958, ["tiles"]],
  ["Asian Paints", "#E4002B", "Har ghar kuch kehta hai", 1942, ["paint", "waterproofing"], true],
  ["Berger", "#0033A0", "Paint your dreams", 1760, ["paint"]],
  ["Nerolac", "#D32F2F", "Healthy home paints", 1920, ["paint"]],
  ["Dr. Fixit", "#0072BC", "Waterproofing expert", 1959, ["waterproofing"], true],
  ["Fosroc", "#E53935", "Constructive solutions", 1970, ["waterproofing"]],
  ["Astral", "#1E88E5", "Pipes that last", 1996, ["plumbing"], true],
  ["Supreme", "#0D47A1", "Plastics that work", 1942, ["plumbing"]],
  ["Finolex", "#E53935", "Pipes & cables you can trust", 1958, ["plumbing", "electrical"]],
  ["Ashirvad", "#00897B", "Pipes by Aliaxis", 1998, ["plumbing"]],
  ["Sintex", "#0277BD", "Water tanks for every home", 1931, ["plumbing"]],
  ["Havells", "#E4002B", "Wires that don't catch fire", 1958, ["electrical"], true],
  ["Polycab", "#D32F2F", "Ideas. Connected.", 1964, ["electrical"]],
  ["Anchor", "#C62828", "Anchor by Panasonic", 1963, ["electrical"]],
  ["Schneider", "#3DCD58", "Life is On", 1836, ["electrical"]],
  ["Jaquar", "#1A1A1A", "Luxury bathing", 1960, ["sanitary"], true],
  ["Hindware", "#0D47A1", "Everything bathroom", 1960, ["sanitary"]],
  ["Cera", "#00695C", "Sanitaryware & faucets", 1980, ["sanitary"]],
  ["Century Ply", "#C62828", "Sab ke liye kuch khaas", 1986, ["wood", "doors-windows"], true],
  ["Greenply", "#2E7D32", "Plywood & decorative surfaces", 1990, ["wood", "doors-windows"]],
  ["Action Tesa", "#EF6C00", "HDHMR & MDF boards", 1972, ["wood"]],
  ["Fenesta", "#1565C0", "UPVC windows & doors", 2002, ["doors-windows"]],
  ["Saint-Gobain", "#003F7D", "Glass solutions", 1665, ["doors-windows"]],
  ["Tata BlueScope", "#003DA5", "Durashine roofing", 2005, ["roofing"]],
  ["Everest", "#1976D2", "Building solutions", 1934, ["roofing"]],
  ["Hettich", "#E30613", "Furniture fittings", 1888, ["hardware"]],
  ["Godrej", "#512DA8", "Locks & security", 1897, ["hardware"]],
  ["Dorset", "#37474F", "Architectural hardware", 1990, ["hardware"]],
  ["Bosch", "#E20015", "Invented for life", 1886, ["tools"], true],
  ["Stanley", "#FFB300", "Make something great", 1843, ["tools"]],
  ["Karam", "#F57C00", "Safety first", 1994, ["safety"]],
  ["Udyogi", "#FBC02D", "Personal protective equipment", 1981, ["safety"]],
];

const typeToCategoryId = (t: MaterialType) => ["cement", "steel", "bricks", "aggregates", "tiles", "roofing"].includes(t) ? "cat-civil" : ["plumbing", "sanitary"].includes(t) ? "cat-plumbing" : t === "electrical" ? "cat-electrical" : t === "safety" ? "cat-fire-protection" : "cat-mechanical";

export const brands: Brand[] = seeds.map(([name, color, tagline, founded, types, featured]) => ({
  id: `brand-${slugify(name)}`,
  slug: slugify(name),
  name,
  color,
  tagline,
  description: `${name} is one of India's most trusted names in ${types
    .map((t) => t.replace("-", " & "))
    .join(", ")}. Established in ${founded}, Smart-MEP sources ${name} products directly from authorised distributors so every order ships with a genuine VAT invoice and manufacturer warranty.`,
  country: ["Wienerberger", "Schneider", "Saint-Gobain", "Hettich", "Bosch", "Stanley", "Fosroc"].includes(name) ? "International" : "India",
  founded,
  categoryIds: types.map(typeToCategoryId),
  isFeatured: featured,
}));

brands.push({ id: "brand-smart-mep", slug: "smart-mep", name: "Smart-MEP", color: "#0F2C5C", tagline: "Project supply solutions", description: "Smart-MEP project-series mock catalogue for airport, mechanical, electrical, plumbing, civil and fire protection procurement.", country: "UAE", founded: 2026, categoryIds: ["cat-airport-systems-and-airside", "cat-mechanical", "cat-electrical", "cat-plumbing", "cat-civil", "cat-fire-protection"], isFeatured: true });
