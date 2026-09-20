/**
 * K's ENTERPRISES - Fish Feed Company
 * Mock Data for Protected Views (/home, /products, /profile, /company)
 */

export const MOCK_DATA = {
  company: {
    name: "K's ENTERPRISES",
    established: "2018",
    tagline: "High-Performance Aquaculture Nutrition & Sustainable Aquafeed Systems",
    about: "K's ENTERPRISES is a premier manufacturer and distributor of scientifically balanced fish and shrimp feed. We formulate nutrient-dense, easily digestible floating and sinking pellets designed to maximize growth rates, Feed Conversion Ratio (FCR), and overall aquatic health across commercial aquaculture operations.",
    stats: [
      { label: "Annual Production", value: "25,000+ MT" },
      { label: "Active Farm Partners", value: "1,200+" },
      { label: "Feed Conversion Ratio", value: "1.18 Avg FCR" },
      { label: "Quality Certifications", value: "HACCP & ISO 22000" }
    ],
    contact: {
      email: "info@ksenterprises.com",
      phone: "+1 (800) 555-FEED / +91 98765 43210",
      headquarters: "Aquaculture Industrial Corridor, Coastal Zone A-12",
      feedMill: "EcoFeed Manufacturing Plant #3, Harbor Way"
    }
  },

  products: [
    {
      id: "feed-01",
      name: "AquaMax Pro 42% Floating Pellets",
      category: "Floating Feed",
      targetSpecies: "Tilapia, Pangasius, Catfish",
      protein: "42% Crude Protein",
      fat: "8% Crude Fat",
      pelletSize: "2.0mm - 4.5mm",
      fcr: "1.15",
      badge: "Best Seller",
      description: "Extruded high-buoyancy floating feed fortified with spirulina, vitamin C, and digestible amino acids for maximum growth acceleration."
    },
    {
      id: "feed-02",
      name: "Carp Supreme Dense Sinking Pellets",
      category: "Sinking Feed",
      targetSpecies: "Rohu, Catla, Common Carp, Grass Carp",
      protein: "34% Crude Protein",
      fat: "6% Crude Fat",
      pelletSize: "3.0mm - 6.0mm",
      fcr: "1.22",
      badge: "Bottom Feeder Choice",
      description: "Uniform density sinking feed with slow water disintegration to eliminate nutrient leaching in intensive carp polyculture ponds."
    },
    {
      id: "feed-03",
      name: "Vannamei Elite Shrimp Micro-Feed",
      category: "Crustacean Nutrition",
      targetSpecies: "Litopenaeus vannamei, Tiger Prawns",
      protein: "48% Marine Protein",
      fat: "9% Phospholipids & Lipids",
      pelletSize: "0.8mm - 1.5mm Crumble",
      fcr: "1.08",
      badge: "High Digestibility",
      description: "Ultra-fine crumbly feed formulated with squid meal and krill extract to stimulate feeding instincts and strengthen carapace immunity."
    },
    {
      id: "feed-04",
      name: "Nursery Fry Starter Powder #1",
      category: "Hatchery Feed",
      targetSpecies: "Fish Fry & Early Larvae Stages",
      protein: "52% Ultra-Pure Protein",
      fat: "11% Marine Omega-3",
      pelletSize: "200 - 400 Microns",
      fcr: "1.02",
      badge: "Hatchery Grade",
      description: "Micro-encapsulated nursery crumble that prevents water turbidity while delivering vital bioactive immunoglobulins to delicate fry."
    }
  ],

  recentBatches: [
    { batchId: "LOT-2026-F98", feedType: "AquaMax Pro 42%", dispatched: "2026-09-18", status: "Quality Tested - Optimal FCR", proteinTested: "42.3%" },
    { batchId: "LOT-2026-S14", feedType: "Carp Supreme Sinking", dispatched: "2026-09-15", status: "Shipped to Hub 4", proteinTested: "34.1%" },
    { batchId: "LOT-2026-V88", feedType: "Vannamei Elite Prawn", dispatched: "2026-09-12", status: "Approved HACCP Standard", proteinTested: "48.2%" }
  ]
};
