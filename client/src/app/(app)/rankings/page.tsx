"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContributorHistory {
  title: string;
  desc: string;
  date: string;
  status: "success" | "pending";
}

interface Contributor {
  rank: number;
  name: string;
  category: string;
  region: string;
  impactLevel: "High" | "Medium" | "Low";
  logoText: string;
  logoBg: string;
  logoUrl?: string;
  creditsRetired: number;
  carbonOffset: string;
  carbonOffsetVal: number;
  trustScore: string;
  impactScore: number;
  sustainabilityScore: number;
  sector: string;
  description: string;
  auditScore: number;
  growthYoY: string;
  votes: string;
  projectsCount: number;
  countriesCount: number;
  history: ContributorHistory[];
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

// Data structures for the 3 timeframes
const DATA_MONTHLY: Contributor[] = [
  {
    rank: 1,
    name: "GreenSeed Foundation",
    category: "Forestry",
    region: "Global",
    impactLevel: "High",
    logoText: "G",
    logoBg: "bg-emerald-500/20 text-emerald-400",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTTfSwAuUZYZUrIm5UGqEAERoV_ddMorElxQSL8HjOMJQdzQfByGiXXCddg94F6PaLAbqRudBR58tAp5vGv_DUiGee-e1hOc_HIpGvb5Pksy_balXzbPKURwMdmYKvlhgYw54_Gplg2gS6rZwvccih54WERSgMAKl_ay1n1_av0Ujl3zl5ouSy5o9NIPHrcoVW59jT8b6h3P3Tp9b5w_Iz24cJYaormDkffWQtobxsV7SFW74xlJ7Odl35_EW8IAKXbMeLcHdRrf-4",
    creditsRetired: 3400000,
    carbonOffset: "3.4M t",
    carbonOffsetVal: 3.4,
    trustScore: "AAA",
    impactScore: 98,
    sustainabilityScore: 98,
    sector: "Global Forest Preservation",
    description: "GreenSeed Foundation leads global efforts in ecological restoration, leveraging high-trust canopy preservation programs across the Amazon Basin, Congo rainforest, and Southeast Asian peatlands. Using satellite analytics and smart contracts, they ensure 100% auditable carbon removal.",
    auditScore: 99.8,
    growthYoY: "+380%",
    votes: "14.2k",
    projectsCount: 142,
    countriesCount: 18,
    history: [
      { title: "Quarterly Audit Complete", desc: "Verra & Gold Standard verify 1.2M additional credits.", date: "May 20, 2026", status: "success" },
      { title: "AI Biomass Verification", desc: "Canopy density confirmed by Sentinel-2 satellite telemetry.", date: "May 12, 2026", status: "success" },
      { title: "New Forestry Initiative Logs", desc: "500k hectares registered under Brazilian jurisdiction.", date: "Apr 28, 2026", status: "success" }
    ]
  },
  {
    rank: 2,
    name: "TechNova Corp",
    category: "Industrial",
    region: "Americas",
    impactLevel: "High",
    logoText: "T",
    logoBg: "bg-blue-500/20 text-blue-400",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPp7mHYUx0t9GAE6F44ijWT3mouZai4s5MSQXl8GUhL9LXX62EeH0zEmnIivf01Fj4XRWg3O7R9AuHTbp1OcRA5rAI_99uNKcRUb4C7N4Dudgbzobspi-xHrrW91Trd29J9P_Hfn6CRm3NBHz-2h4QLwEErPSyd6GWd8cToiVk0SeWNldcH2pDOKE8Tt_QpLmlmZPwNZIt2qG2nRPqwmLncccAsOAmHf0ZGKgy-D_xGnfENNz2P_eXXZvhc2xc0ijTiPaxTtm9Z8YL",
    creditsRetired: 1200000,
    carbonOffset: "1.2M t",
    carbonOffsetVal: 1.2,
    trustScore: "AA+",
    impactScore: 94,
    sustainabilityScore: 94,
    sector: "Industrial Innovation",
    description: "TechNova Corp integrates cutting-edge carbon capture and carbon offset logistics directly within high-emission industrial pipelines, heavily curbing atmospheric discharge for steel and heavy manufacturing sectors.",
    auditScore: 96.2,
    growthYoY: "+240%",
    votes: "8.9k",
    projectsCount: 45,
    countriesCount: 7,
    history: [
      { title: "Flue-gas Capture Audit", desc: "Sensors report 92% recovery efficiency in Ohio facility.", date: "May 15, 2026", status: "success" },
      { title: "Verification Ledger Registered", desc: "EPA logs 300k industrial carbon-offset units.", date: "May 02, 2026", status: "success" }
    ]
  },
  {
    rank: 3,
    name: "Solaris Energy",
    category: "Renewable",
    region: "Europe",
    impactLevel: "Medium",
    logoText: "S",
    logoBg: "bg-amber-500/20 text-amber-400",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfcsMT82fWhPKUUYMz9AXRvZIgrW53l-fusZFd8kLCDjy5C2gnXjSBuoRMNTqoUt54-dfCq1B0bd2LTvzashs7VQAnDOqjnUPB9pmrNrTgxsAZpD2Xk3_QxLiZEjshbUHFy9u3qQAgV88sReJHQek3QdNXkATIqEN-mNLChirbBKhO2GH2JeCs8bGOHZf8IGAgtRAMTmz0U6G5ytBDRt_BhfhcSMnkcoGh7loy_Vos8z5Rrmv_01Z4xFEoGAPnGCL5eu7ug4Vw75Wy",
    creditsRetired: 900000,
    carbonOffset: "0.9M t",
    carbonOffsetVal: 0.9,
    trustScore: "AA",
    impactScore: 91,
    sustainabilityScore: 91,
    sector: "Renewable Infrastructure",
    description: "Solaris Energy accelerates global decarbonization by funding community solar grids, wind installations, and utility-scale battery banks. They bridge the gap between clean energy yields and institutional offset credits.",
    auditScore: 95.5,
    growthYoY: "+195%",
    votes: "6.4k",
    projectsCount: 88,
    countriesCount: 14,
    history: [
      { title: "Community Solar Grid Online", desc: "15MW installation active in Alentejo, Portugal.", date: "May 22, 2026", status: "success" },
      { title: "Carbon Credit Issuance Logs", desc: "European Energy Registry issues 220k tCO2e credits.", date: "May 08, 2026", status: "success" }
    ]
  },
  {
    rank: 4,
    name: "Vesta Carbon",
    category: "Blue Carbon",
    region: "Americas",
    impactLevel: "High",
    logoText: "V",
    logoBg: "bg-teal-500/20 text-teal-400",
    creditsRetired: 840200,
    carbonOffset: "620.5k t",
    carbonOffsetVal: 0.6205,
    trustScore: "AA+",
    impactScore: 88,
    sustainabilityScore: 88,
    sector: "Blue Carbon Initiatives",
    description: "Vesta Carbon specializes in coastal mangrove restoration, sea-grass preservation, and ocean acidification mitigation. Their coastal restoration models sequester up to 10x more carbon than terrestrial ecosystems.",
    auditScore: 97.4,
    growthYoY: "+290%",
    votes: "9.2k",
    projectsCount: 36,
    countriesCount: 5,
    history: [
      { title: "Mangrove Planting Audit", desc: "Benthic survey confirms 94% seedling survival rate.", date: "May 18, 2026", status: "success" },
      { title: "Ecosystem Credits Certified", desc: "Blue Carbon standard issues 180k tCO2e offsets.", date: "May 01, 2026", status: "success" }
    ]
  },
  {
    rank: 5,
    name: "Oceanic Pure",
    category: "Blue Carbon",
    region: "Asia-Pacific",
    impactLevel: "High",
    logoText: "O",
    logoBg: "bg-cyan-500/20 text-cyan-400",
    creditsRetired: 712000,
    carbonOffset: "540.2k t",
    carbonOffsetVal: 0.5402,
    trustScore: "AA",
    impactScore: 84,
    sustainabilityScore: 84,
    sector: "Marine Ecosystems",
    description: "Oceanic Pure deploys premium macroalgae/kelp farming arrays in deep-water currents to sequester biological carbon in oceanic abyssal plains. Highly auditable oceanography models ensure permanence.",
    auditScore: 94.8,
    growthYoY: "+180%",
    votes: "5.1k",
    projectsCount: 22,
    countriesCount: 3,
    history: [
      { title: "Deep Sea Deep-Dive Audit", desc: "Autonomous gliders verify kelp biomass sink permanence.", date: "May 14, 2026", status: "success" },
      { title: "Satellite Growth Telemetry", desc: "Algal bloom maps processed for carbon tonnage.", date: "Apr 25, 2026", status: "success" }
    ]
  },
  {
    rank: 6,
    name: "Lithium Ventures",
    category: "Industrial",
    region: "Americas",
    impactLevel: "Medium",
    logoText: "L",
    logoBg: "bg-purple-500/20 text-purple-400",
    creditsRetired: 680000,
    carbonOffset: "490.8k t",
    carbonOffsetVal: 0.4908,
    trustScore: "A+",
    impactScore: 82,
    sustainabilityScore: 82,
    sector: "Supply Chain Efficiency",
    description: "Lithium Ventures partners with electric vehicle and smart battery manufacturers to offset heavy-metal mining operations, deploying verified carbon reduction units exactly along their resource pipelines.",
    auditScore: 92.1,
    growthYoY: "+115%",
    votes: "4.3k",
    projectsCount: 19,
    countriesCount: 6,
    history: [
      { title: "Mine Reclamation Audit", desc: "Revegetation program verified at Salar de Uyuni site.", date: "May 09, 2026", status: "success" }
    ]
  },
  {
    rank: 7,
    name: "Nero Dynamic Solutions",
    category: "Tech",
    region: "Europe",
    impactLevel: "High",
    logoText: "N",
    logoBg: "bg-rose-500/20 text-rose-400",
    creditsRetired: 580000,
    carbonOffset: "412.0k t",
    carbonOffsetVal: 0.412,
    trustScore: "A+",
    impactScore: 81,
    sustainabilityScore: 80,
    sector: "Decentralized Grid Optimization",
    description: "Nero Dynamic Solutions leverages smart power grids and AI-directed server distribution systems to slash dynamic power overhead, generating premium, technology-backed carbon offsets.",
    auditScore: 98.9,
    growthYoY: "+412%",
    votes: "11.2k",
    projectsCount: 31,
    countriesCount: 9,
    history: [
      { title: "Dynamic Load Audit Complete", desc: "Data center power routing records 30% reduction in heat waste.", date: "May 25, 2026", status: "success" }
    ]
  },
  {
    rank: 8,
    name: "Alpine Preservation",
    category: "Forestry",
    region: "Europe",
    impactLevel: "High",
    logoText: "A",
    logoBg: "bg-lime-500/20 text-lime-400",
    creditsRetired: 520000,
    carbonOffset: "392.5k t",
    carbonOffsetVal: 0.3925,
    trustScore: "AAA",
    impactScore: 80,
    sustainabilityScore: 99,
    sector: "Montane Ecology Protection",
    description: "Alpine Preservation defends fragile high-altitude biomes, implementing strict conservation easements and biodiversity restoration initiatives in the Swiss and Italian Alps.",
    auditScore: 99.8,
    growthYoY: "+80%",
    votes: "7.8k",
    projectsCount: 54,
    countriesCount: 4,
    history: [
      { title: "Glacial Edge Bio-Survey", desc: "Conifer reforestation metrics match peak models.", date: "May 19, 2026", status: "success" }
    ]
  },
  {
    rank: 9,
    name: "Village Solar Hub",
    category: "Renewable",
    region: "Asia-Pacific",
    impactLevel: "Medium",
    logoText: "V",
    logoBg: "bg-indigo-500/20 text-indigo-400",
    creditsRetired: 460000,
    carbonOffset: "320.1k t",
    carbonOffsetVal: 0.3201,
    trustScore: "A",
    impactScore: 78,
    sustainabilityScore: 85,
    sector: "Decentralized Rural Solar",
    description: "Village Solar Hub funds local solar micro-grids across India and Bangladesh, shifting rural agriculture away from diesel generators to solar pumps, creating massive societal and carbon co-benefits.",
    auditScore: 94.1,
    growthYoY: "+190%",
    votes: "12.4k",
    projectsCount: 67,
    countriesCount: 3,
    history: [
      { title: "Micro-grid Commissioning Log", desc: "40 solar micro-pumps installed in Bihar cluster.", date: "May 10, 2026", status: "success" }
    ]
  }
];

const DATA_QUARTERLY: Contributor[] = DATA_MONTHLY.map((item) => {
  const mult = 2.8;
  const credits = Math.round(item.creditsRetired * mult);
  const offsetVal = Number((item.carbonOffsetVal * mult).toFixed(1));
  const newGrowth = parseInt(item.growthYoY) ? `+${Math.round(parseInt(item.growthYoY) * 0.95)}%` : item.growthYoY;
  return {
    ...item,
    creditsRetired: credits,
    carbonOffset: `${offsetVal}M t`,
    carbonOffsetVal: offsetVal,
    growthYoY: newGrowth,
  };
});

const DATA_ALLTIME: Contributor[] = DATA_MONTHLY.map((item) => {
  const mult = 8.6;
  const credits = Math.round(item.creditsRetired * mult);
  const offsetVal = Number((item.carbonOffsetVal * mult).toFixed(1));
  const newGrowth = parseInt(item.growthYoY) ? `+${Math.round(parseInt(item.growthYoY) * 0.85)}%` : item.growthYoY;
  return {
    ...item,
    creditsRetired: credits,
    carbonOffset: `${offsetVal}M t`,
    carbonOffsetVal: offsetVal,
    growthYoY: newGrowth,
  };
});

// Growth trends for timeframe dashboard
const GROWTH_MONTHLY = [
  { label: "Jan", val: 20 },
  { label: "Feb", val: 35 },
  { label: "Mar", val: 45 },
  { label: "Apr", val: 65 },
  { label: "May", val: 85 },
  { label: "Latest", val: 100, isLatest: true },
];

const GROWTH_QUARTERLY = [
  { label: "Q1 '25", val: 30 },
  { label: "Q2 '25", val: 45 },
  { label: "Q3 '25", val: 55 },
  { label: "Q4 '25", val: 75 },
  { label: "Q1 '26", val: 90 },
  { label: "Latest", val: 100, isLatest: true },
];

const GROWTH_ALLTIME = [
  { label: "2021", val: 15 },
  { label: "2022", val: 35 },
  { label: "2023", val: 55 },
  { label: "2024", val: 70 },
  { label: "2025", val: 88 },
  { label: "Latest", val: 100, isLatest: true },
];

export default function Rankings() {
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly" | "alltime">("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [selectedImpact, setSelectedImpact] = useState("All");

  // Sorting state for workability
  const [sortBy, setSortBy] = useState<"rank" | "credits" | "score">("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Dropdown UI states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);

  // Selected Contributor details drawer
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);

  // Map Modal
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);

  // Selected donut segment info
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<string | null>(null);

  // Toast Notification State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Helper to add dynamic notification toasts
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Active dataset based on timeframe
  const activeDataset = useMemo(() => {
    switch (timeframe) {
      case "quarterly":
        return DATA_QUARTERLY;
      case "alltime":
        return DATA_ALLTIME;
      default:
        return DATA_MONTHLY;
    }
  }, [timeframe]);

  // Compute global impact summary metrics
  const globalImpact = useMemo(() => {
    const totalCredits = activeDataset.reduce((sum, item) => sum + item.creditsRetired, 0);
    const totalOffset = activeDataset.reduce((sum, item) => sum + item.carbonOffsetVal, 0);
    const totalContributors = timeframe === "monthly" ? "3.2k+" : timeframe === "quarterly" ? "14.2k+" : "42k+";

    return {
      credits: (totalCredits / 1000000).toFixed(1) + "M",
      offset: totalOffset.toFixed(1) + "Mt",
      contributors: totalContributors,
    };
  }, [activeDataset, timeframe]);

  // Filtered contributors
  const filteredContributors = useMemo(() => {
    return activeDataset.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sector.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesRegion = selectedRegion === "Global" || item.region === selectedRegion;
      const matchesImpact = selectedImpact === "All" || item.impactLevel === selectedImpact;

      return matchesSearch && matchesCategory && matchesRegion && matchesImpact;
    });
  }, [activeDataset, searchQuery, selectedCategory, selectedRegion, selectedImpact]);

  // Sorted list for Workability and Dynamic Reordering
  const sortedContributors = useMemo(() => {
    const result = [...filteredContributors];
    result.sort((a, b) => {
      let aVal = 0;
      let bVal = 0;

      if (sortBy === "rank") {
        aVal = a.rank;
        bVal = b.rank;
      } else if (sortBy === "credits") {
        aVal = a.creditsRetired;
        bVal = b.creditsRetired;
      } else if (sortBy === "score") {
        aVal = a.impactScore;
        bVal = b.impactScore;
      }

      if (sortDirection === "asc") {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });
    return result;
  }, [filteredContributors, sortBy, sortDirection]);

  // Top 3 for Podium
  const podiumContributors = useMemo(() => {
    return sortedContributors.slice(0, 3);
  }, [sortedContributors]);

  // Active growth trend for the chart
  const activeGrowthTrend = useMemo(() => {
    switch (timeframe) {
      case "quarterly":
        return GROWTH_QUARTERLY;
      case "alltime":
        return GROWTH_ALLTIME;
      default:
        return GROWTH_MONTHLY;
    }
  }, [timeframe]);

  // Toggle sort function
  const handleSort = (field: "rank" | "credits" | "score") => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("desc"); // Default to desc (e.g. highest first)
    }
    addToast(`Leaderboard sorted by ${field === "credits" ? "Credits" : field === "score" ? "Impact Score" : "Rank"}`, "info");
  };

  // Map hotspots dataset
  const mapHotspots = [
    { id: 1, name: "Amazon Reforestation", lat: "30%", lng: "45%", credits: "3.4M credits", country: "Brazil", category: "Forestry" },
    { id: 2, name: "Congo Basin Conservation", lat: "55%", lng: "62%", credits: "1.8M credits", country: "Congo", category: "Forestry" },
    { id: 3, name: "Sunda Trench Mangroves", lat: "60%", lng: "80%", credits: "940k credits", country: "Indonesia", category: "Blue Carbon" },
    { id: 4, name: "Pacific Seagrass Recovery", lat: "45%", lng: "25%", credits: "1.2M credits", country: "USA (West Coast)", category: "Blue Carbon" },
    { id: 5, name: "Alpine Re-wilding", lat: "35%", lng: "58%", credits: "520k credits", country: "Switzerland", category: "Forestry" },
  ];

  return (
    <div className="flex flex-col flex-1 w-full bg-[#0e150e] text-[#dce5d9] selection:bg-[#22c55e]/30 pt-6 pb-20 px-4 md:px-margin-desktop max-w-[1280px] mx-auto space-y-16">
      
      {/* Title Meta for SEO inside Page */}
      <title>Rankings | CarbonX Protocol</title>

      {/* Global Toast Container */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="pointer-events-auto bg-[#161d16] border border-white/10 shadow-2xl rounded-xl px-5 py-3.5 flex items-center gap-3 w-80 text-xs font-bold"
            >
              <span className={`material-symbols-outlined shrink-0 ${
                toast.type === "success" ? "text-[#4be277]" : "text-blue-400"
              }`}>
                {toast.type === "success" ? "check_circle" : "info"}
              </span>
              <span className="text-white grow">{toast.message}</span>
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="material-symbols-outlined text-on-surface-variant hover:text-white text-sm cursor-pointer select-none"
              >
                close
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end">
        <div className="lg:col-span-7 space-y-stack-md">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display-lg text-display-lg-mobile md:text-[56px] text-on-surface leading-tight font-extrabold tracking-tight"
          >
            Rankings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant text-body-lg max-w-xl"
          >
            Recognizing organizations and individuals driving real-world climate impact through precise, verified carbon reduction strategies.
          </motion.p>
          
          <div className="flex gap-2 p-1.5 bg-[#161d16] rounded-xl w-fit border border-outline-variant/20 shadow-md">
            {(["monthly", "quarterly", "alltime"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setTimeframe(mode);
                  addToast(`Timeframe changed to ${mode === "alltime" ? "All Time" : mode}`, "info");
                }}
                className="px-6 py-2 rounded-lg text-body-sm font-bold uppercase transition-all duration-300 relative cursor-pointer"
                style={{
                  backgroundColor: timeframe === mode ? "#22c55e" : "transparent",
                  color: timeframe === mode ? "#004b1e" : "#bccbb9",
                  transform: timeframe === mode ? "scale(0.95)" : "none",
                  boxShadow: timeframe === mode ? "0 10px 15px -3px rgba(34, 197, 94, 0.2)" : "none"
                }}
              >
                {mode === "alltime" ? "All Time" : mode}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.1),0_0_20px_rgba(75,226,119,0.05)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.3),0_0_30px_rgba(75,226,119,0.1)] transition-all duration-300 space-y-4"
          >
            <h3 className="font-label-caps text-xs tracking-widest text-[#4be277] uppercase font-bold">
              Global Impact Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider">Credits Retired</p>
                <motion.p 
                  key={timeframe + "-credits"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[28px] leading-tight font-extrabold text-white"
                >
                  {globalImpact.credits}
                </motion.p>
              </div>
              <div className="space-y-1">
                <p className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider">CO2 Offset</p>
                <motion.p 
                  key={timeframe + "-offset"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[28px] leading-tight font-extrabold text-[#4be277]"
                >
                  {globalImpact.offset}
                </motion.p>
              </div>
              <div className="space-y-1">
                <p className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider">Contributors</p>
                <motion.p 
                  key={timeframe + "-contributors"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[28px] leading-tight font-extrabold text-white"
                >
                  {globalImpact.contributors}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Podium */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-end pt-4">
        {/* Rank 2 - Left */}
        {podiumContributors[1] && (
          <div className="order-2 md:order-1 h-fit">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedContributor(podiumContributors[1])}
              className="glass-card p-6 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.05),0_0_15px_rgba(75,226,119,0.02)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.3),0_0_30px_rgba(75,226,119,0.1)] relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-4 right-4 text-[70px] text-white/5 font-black leading-none select-none">2</div>
              {podiumContributors[1].logoUrl ? (
                <img 
                  alt={podiumContributors[1].name} 
                  className="w-20 h-20 rounded-xl mb-4 object-cover bg-[#242c24] border border-white/10" 
                  src={podiumContributors[1].logoUrl} 
                />
              ) : (
                <div className={`w-20 h-20 rounded-xl mb-4 flex items-center justify-center font-bold text-3xl border border-white/10 ${podiumContributors[1].logoBg}`}>
                  {podiumContributors[1].logoText}
                </div>
              )}
              <h3 className="font-headline-sm text-xl font-bold text-on-surface flex items-center gap-2 group-hover:text-[#4be277] transition-colors">
                {podiumContributors[1].name} 
                <span className="material-symbols-outlined text-[#4be277] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </h3>
              <p className="text-on-surface-variant text-xs font-semibold mb-4 uppercase tracking-wider">{podiumContributors[1].sector}</p>
              
              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="space-y-0.5">
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase font-medium">Sustainability Score</p>
                  <p className="font-extrabold text-white text-base">{podiumContributors[1].sustainabilityScore}/100</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase font-medium">Carbon Offset</p>
                  <p className="font-extrabold text-[#4be277] text-base">{podiumContributors[1].carbonOffset}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Rank 1 - Center */}
        {podiumContributors[0] && (
          <div className="order-1 md:order-2 h-fit">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedContributor(podiumContributors[0])}
              className="glass-card p-8 rounded-card border border-[#4be277]/20 bg-[#4be277]/5 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.2),0_0_25px_rgba(75,226,119,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.4),0_0_40px_rgba(75,226,119,0.15)] md:scale-105 relative overflow-hidden group hover:-translate-y-3 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-4 right-4 text-[90px] text-[#4be277]/10 font-black leading-none select-none">1</div>
              {podiumContributors[0].logoUrl ? (
                <img 
                  alt={podiumContributors[0].name} 
                  className="w-24 h-24 rounded-xl mb-4 object-cover bg-[#242c24] ring-2 ring-[#4be277]/50" 
                  src={podiumContributors[0].logoUrl} 
                />
              ) : (
                <div className={`w-24 h-24 rounded-xl mb-4 flex items-center justify-center font-bold text-4xl border border-[#4be277]/20 ring-2 ring-[#4be277]/50 ${podiumContributors[0].logoBg}`}>
                  {podiumContributors[0].logoText}
                </div>
              )}
              <h3 className="font-headline-md text-2xl font-bold text-on-surface flex items-center gap-2 group-hover:text-[#4be277] transition-colors">
                {podiumContributors[0].name} 
                <span className="material-symbols-outlined text-[#4be277] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </h3>
              <p className="text-on-surface-variant text-sm font-semibold mb-6 uppercase tracking-wider">{podiumContributors[0].sector}</p>
              
              <div className="flex justify-between items-end border-t border-[#4be277]/10 pt-4 mb-4">
                <div className="space-y-0.5">
                  <p className="font-label-caps text-xs text-on-surface-variant uppercase font-medium">Sustainability Score</p>
                  <p className="text-xl font-extrabold text-white">{podiumContributors[0].sustainabilityScore}/100</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-label-caps text-xs text-on-surface-variant uppercase font-medium">Carbon Offset</p>
                  <p className="text-xl font-extrabold text-[#4be277]">{podiumContributors[0].carbonOffset}</p>
                </div>
              </div>
              <div className="h-1.5 bg-[#161d16] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${podiumContributors[0].sustainabilityScore}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-[#4be277] shadow-[0_0_10px_rgba(75,226,119,0.8)]"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Rank 3 - Right */}
        {podiumContributors[2] && (
          <div className="order-3 h-fit">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setSelectedContributor(podiumContributors[2])}
              className="glass-card p-6 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.05),0_0_15px_rgba(75,226,119,0.02)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.3),0_0_30px_rgba(75,226,119,0.1)] relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute top-4 right-4 text-[70px] text-white/5 font-black leading-none select-none">3</div>
              {podiumContributors[2].logoUrl ? (
                <img 
                  alt={podiumContributors[2].name} 
                  className="w-20 h-20 rounded-xl mb-4 object-cover bg-[#242c24] border border-white/10" 
                  src={podiumContributors[2].logoUrl} 
                />
              ) : (
                <div className={`w-20 h-20 rounded-xl mb-4 flex items-center justify-center font-bold text-3xl border border-white/10 ${podiumContributors[2].logoBg}`}>
                  {podiumContributors[2].logoText}
                </div>
              )}
              <h3 className="font-headline-sm text-xl font-bold text-on-surface flex items-center gap-2 group-hover:text-[#4be277] transition-colors">
                {podiumContributors[2].name} 
                <span className="material-symbols-outlined text-[#4be277] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </h3>
              <p className="text-on-surface-variant text-xs font-semibold mb-4 uppercase tracking-wider">{podiumContributors[2].sector}</p>
              
              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="space-y-0.5">
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase font-medium">Sustainability Score</p>
                  <p className="font-extrabold text-white text-base">{podiumContributors[2].sustainabilityScore}/100</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase font-medium">Carbon Offset</p>
                  <p className="font-extrabold text-[#4be277] text-base">{podiumContributors[2].carbonOffset}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Filters & Table */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <h2 className="font-headline-md text-2xl font-bold text-on-surface flex items-center gap-3">
            Top Contributors
            <span className="text-sm bg-white/5 border border-white/10 text-on-surface-variant font-medium px-2 py-0.5 rounded-full">
              {filteredContributors.length} listed
            </span>
          </h2>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="flex flex-1 md:flex-initial items-center bg-[#161d16] border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#22c55e]/50 transition-colors w-full md:w-60 shadow-md">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] select-none">search</span>
              <input
                className="bg-transparent border-none focus:outline-none text-xs w-full text-white ml-2 placeholder:text-on-surface-variant"
                placeholder="Search entities or sectors..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => { setCategoryOpen(!categoryOpen); setRegionOpen(false); setImpactOpen(false); }}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-[#161d16] border border-white/10 rounded-xl text-xs text-on-surface-variant font-bold hover:text-white cursor-pointer select-none min-w-[120px] text-left shadow-md transition-all active:scale-95"
              >
                <span>Category: {selectedCategory}</span>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>
              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 z-30 w-44 bg-[#161d16] border border-white/10 rounded-xl p-1.5 shadow-2xl overflow-hidden"
                  >
                    {["All", "Forestry", "Blue Carbon", "Renewable", "Industrial", "Tech"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); addToast(`Category filter: ${cat}`, "info"); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedCategory === cat ? "bg-[#22c55e]/15 text-[#4be277]" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Region Filter */}
            <div className="relative">
              <button
                onClick={() => { setRegionOpen(!regionOpen); setCategoryOpen(false); setImpactOpen(false); }}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-[#161d16] border border-white/10 rounded-xl text-xs text-on-surface-variant font-bold hover:text-white cursor-pointer select-none min-w-[120px] text-left shadow-md transition-all active:scale-95"
              >
                <span>Region: {selectedRegion}</span>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>
              <AnimatePresence>
                {regionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 z-30 w-44 bg-[#161d16] border border-white/10 rounded-xl p-1.5 shadow-2xl overflow-hidden"
                  >
                    {["Global", "Americas", "Europe", "Asia-Pacific"].map((reg) => (
                      <button
                        key={reg}
                        onClick={() => { setSelectedRegion(reg); setRegionOpen(false); addToast(`Region filter: ${reg}`, "info"); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedRegion === reg ? "bg-[#22c55e]/15 text-[#4be277]" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Impact Filter */}
            <div className="relative">
              <button
                onClick={() => { setImpactOpen(!impactOpen); setCategoryOpen(false); setRegionOpen(false); }}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-[#161d16] border border-white/10 rounded-xl text-xs text-on-surface-variant font-bold hover:text-white cursor-pointer select-none min-w-[130px] text-left shadow-md transition-all active:scale-95"
              >
                <span>Impact: {selectedImpact}</span>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>
              <AnimatePresence>
                {impactOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 z-30 w-44 bg-[#161d16] border border-white/10 rounded-xl p-1.5 shadow-2xl overflow-hidden"
                  >
                    {["All", "High", "Medium", "Low"].map((imp) => (
                      <button
                        key={imp}
                        onClick={() => { setSelectedImpact(imp); setImpactOpen(false); addToast(`Impact filter: ${imp}`, "info"); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedImpact === imp ? "bg-[#22c55e]/15 text-[#4be277]" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {imp === "All" ? "All Impact" : `${imp} Impact`}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dynamic Table with Interactive Sorting */}
        <div className="overflow-x-auto w-full">
          {sortedContributors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-surface-container-low/20">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4 select-none">sentiment_dissatisfied</span>
              <h3 className="text-lg font-bold text-white mb-1">No Contributors Found</h3>
              <p className="text-sm text-on-surface-variant">No registry items match your search criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-3.5">
              <thead>
                <tr className="text-[11px] font-label-caps text-on-surface-variant uppercase tracking-widest font-semibold border-b border-white/5 select-none">
                  
                  {/* Sortable Rank */}
                  <th 
                    onClick={() => handleSort("rank")}
                    className="px-6 py-2 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Rank</span>
                      <span className="material-symbols-outlined text-xs">
                        {sortBy === "rank" ? (sortDirection === "asc" ? "arrow_upward" : "arrow_downward") : "import_export"}
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-6 py-2">Entity Name</th>
                  
                  {/* Sortable Credits */}
                  <th 
                    onClick={() => handleSort("credits")}
                    className="px-6 py-2 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Credits Retired</span>
                      <span className="material-symbols-outlined text-xs">
                        {sortBy === "credits" ? (sortDirection === "asc" ? "arrow_upward" : "arrow_downward") : "import_export"}
                      </span>
                    </div>
                  </th>
                  
                  <th className="px-6 py-2">Carbon Offset</th>
                  <th className="px-6 py-2 text-center">Trust Score</th>
                  
                  {/* Sortable Score */}
                  <th 
                    onClick={() => handleSort("score")}
                    className="px-6 py-2 text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Impact Score</span>
                      <span className="material-symbols-outlined text-xs">
                        {sortBy === "score" ? (sortDirection === "asc" ? "arrow_upward" : "arrow_downward") : "import_export"}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-sm">
                {sortedContributors.map((entity) => {
                  const formattedRank = entity.rank < 10 ? `0${entity.rank}` : entity.rank;
                  const isTopThree = entity.rank <= 3;
                  
                  return (
                    <tr 
                      key={entity.name}
                      onClick={() => setSelectedContributor(entity)}
                      className="bg-[#161d16]/40 hover:bg-[#161d16] border border-white/5 transition-all group cursor-pointer relative"
                    >
                      <td className="px-6 py-4 rounded-l-2xl font-black text-on-surface-variant">
                        {isTopThree ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            entity.rank === 1 ? "bg-amber-500/20 text-amber-400" :
                            entity.rank === 2 ? "bg-slate-400/20 text-slate-300" :
                            "bg-amber-700/20 text-amber-600"
                          }`}>
                            #{formattedRank}
                          </span>
                        ) : (
                          formattedRank
                        )}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        {entity.logoUrl ? (
                          <img 
                            alt={entity.name} 
                            className="w-10 h-10 rounded-full object-cover bg-white/5 border border-white/10" 
                            src={entity.logoUrl} 
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base border border-white/10 ${entity.logoBg}`}>
                            {entity.logoText}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white group-hover:text-[#4be277] transition-colors flex items-center gap-1.5">
                            {entity.name}
                            <span className="material-symbols-outlined text-[#4be277] text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-semibold tracking-wider uppercase mt-0.5">{entity.sector}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {entity.creditsRetired.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[#4be277] font-semibold">
                        {entity.carbonOffset}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-0.5 font-bold rounded text-[10px] ${
                          entity.trustScore.includes("AAA") || entity.trustScore.includes("AA+")
                            ? "bg-[#22c55e]/15 text-[#4be277] border border-[#22c55e]/30"
                            : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        }`}>
                          {entity.trustScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 rounded-r-2xl text-right font-display-lg text-lg font-extrabold text-white">
                        {entity.impactScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Sustainability Champions */}
      <section className="space-y-6">
        <h2 className="font-headline-md text-2xl font-bold text-on-surface">Sustainability Champions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          
          {/* Champion 1 */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => {
              const item = activeDataset.find(e => e.name === "Nero Dynamic Solutions") || activeDataset[0];
              setSelectedContributor(item);
            }}
            className="glass-card p-6 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.05),0_0_20px_rgba(75,226,119,0.02)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.3),0_0_30px_rgba(75,226,119,0.1)] group cursor-pointer transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[#4be277] mb-2 text-3xl select-none">rocket_launch</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-[#4be277] transition-colors">Fastest Growing</h3>
            <p className="text-on-surface-variant text-xs font-semibold mt-1 uppercase tracking-wider">Nero Dynamic Solutions</p>
            <div className="mt-4 flex items-center gap-2 text-[#4be277]">
              <span className="font-extrabold text-lg">+412%</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium">Growth YoY</span>
            </div>
          </motion.div>

          {/* Champion 2 */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => {
              const item = activeDataset.find(e => e.name === "Alpine Preservation") || activeDataset[0];
              setSelectedContributor(item);
            }}
            className="glass-card p-6 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.05),0_0_20px_rgba(75,226,119,0.02)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.3),0_0_30px_rgba(75,226,119,0.1)] group cursor-pointer transition-all duration-300"
          >
            <span className="material-symbols-outlined text-blue-400 mb-2 text-3xl select-none">verified_user</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-blue-400 transition-colors">Most Trusted</h3>
            <p className="text-on-surface-variant text-xs font-semibold mt-1 uppercase tracking-wider">Alpine Preservation</p>
            <div className="mt-4 flex items-center gap-2 text-blue-400">
              <span className="font-extrabold text-lg">99.8%</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium">Audit Score</span>
            </div>
          </motion.div>

          {/* Champion 3 */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => {
              const item = activeDataset.find(e => e.name === "Village Solar Hub") || activeDataset[0];
              setSelectedContributor(item);
            }}
            className="glass-card p-6 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.05),0_0_20px_rgba(75,226,119,0.02)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.3),0_0_30px_rgba(75,226,119,0.1)] group cursor-pointer transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[#d3bcff] mb-2 text-3xl select-none">groups</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-[#d3bcff] transition-colors">Community Choice</h3>
            <p className="text-on-surface-variant text-xs font-semibold mt-1 uppercase tracking-wider">Village Solar Hub</p>
            <div className="mt-4 flex items-center gap-2 text-[#d3bcff]">
              <span className="font-extrabold text-lg">12.4k</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium">Votes</span>
            </div>
          </motion.div>

          {/* Champion 4 */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => {
              const item = activeDataset.find(e => e.name === "GreenSeed Foundation") || activeDataset[0];
              setSelectedContributor(item);
            }}
            className="glass-card p-6 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.05),0_0_20px_rgba(75,226,119,0.02)] hover:shadow-[inset_0_0_0_1px_rgba(75,226,119,0.3),0_0_30px_rgba(75,226,119,0.1)] group cursor-pointer transition-all duration-300"
          >
            <span className="material-symbols-outlined text-rose-400 mb-2 text-3xl select-none">leaderboard</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-rose-400 transition-colors">Highest Offset</h3>
            <p className="text-on-surface-variant text-xs font-semibold mt-1 uppercase tracking-wider">GreenSeed Foundation</p>
            <div className="mt-4 flex items-center gap-2 text-rose-400">
              <span className="font-extrabold text-lg">{globalImpact.offset}</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium">Total CO2</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Environmental Impact Dashboard */}
      <section className="glass-card p-8 rounded-card border border-white/10 shadow-[inset_0_0_0_1px_rgba(75,226,119,0.1),0_0_25px_rgba(75,226,119,0.05)] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface">Environmental Impact Dashboard</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-1">Real-time indicators of project verification rates and credit distribution ecosystems.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span> Growth (Mt)
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-[#22c55e]"></span> Distribution %
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stats Grid */}
          <div className="space-y-4">
            <div className="p-5 bg-[#161d16]/30 rounded-xl border border-white/5 shadow-md">
              <p className="text-on-surface-variant text-[11px] font-label-caps uppercase tracking-wider font-semibold">Verified Projects</p>
              <p className="text-3xl font-extrabold text-white mt-1">1,428</p>
            </div>
            <div className="p-5 bg-[#161d16]/30 rounded-xl border border-white/5 shadow-md">
              <p className="text-on-surface-variant text-[11px] font-label-caps uppercase tracking-wider font-semibold">Countries Participating</p>
              <p className="text-3xl font-extrabold text-white mt-1">84</p>
            </div>
            <div className="p-5 bg-[#22c55e]/5 rounded-xl border border-[#22c55e]/25 shadow-lg shadow-[#22c55e]/5">
              <p className="text-[#4be277] text-[11px] font-label-caps uppercase tracking-wider font-semibold">Total Credits Retired</p>
              <p className="text-3xl font-extrabold text-[#4be277] mt-1">{timeframe === "monthly" ? "8.2M" : timeframe === "quarterly" ? "24.6M" : "82.1M"}</p>
            </div>
          </div>

          {/* Charts Area */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Animated Offset Growth Bar Chart */}
            <div className="bg-[#161d16]/30 rounded-xl p-6 border border-white/5 shadow-md flex flex-col justify-between h-[280px] group relative overflow-hidden">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Offset Growth Trend</p>
              <div className="flex items-end justify-between h-44 gap-2 pt-6">
                {activeGrowthTrend.map((bar, idx) => {
                  const animatedHeight = `${bar.val}%`;
                  const scaledVal = timeframe === "monthly" 
                    ? (0.2 + idx * 0.15).toFixed(2) 
                    : timeframe === "quarterly" 
                    ? (0.6 + idx * 0.5).toFixed(1)
                    : (1.2 + idx * 1.5).toFixed(1);

                  return (
                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group/bar relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-[#0e150e] border border-white/10 rounded px-2 py-1 text-[10px] font-bold text-[#4be277] opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none shadow-2xl z-10 whitespace-nowrap">
                        {scaledVal}Mt CO2e
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full bg-blue-500/10 hover:bg-blue-500/20 rounded-t-lg relative flex items-end h-full overflow-hidden transition-all duration-300">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: animatedHeight }}
                          transition={{ duration: 0.8, delay: idx * 0.08 }}
                          className={`w-full rounded-t-lg ${bar.isLatest ? "bg-blue-500" : "bg-blue-500/60"} relative`}
                        >
                          {bar.isLatest && (
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          )}
                        </motion.div>
                      </div>
                      
                      <span className="text-[10px] font-label-caps text-on-surface-variant uppercase font-medium">{bar.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Category Distribution Donut Chart */}
            <div className="bg-[#161d16]/30 rounded-xl p-6 border border-white/5 shadow-md flex flex-col items-center justify-between h-[280px]">
              <p className="text-xs font-bold text-white uppercase tracking-wider self-start">Category Distribution</p>
              
              <div className="flex items-center justify-center gap-6 w-full">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#161d16" strokeWidth="8" />
                    
                    {/* Forestry (64%) */}
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#4be277" strokeWidth="9" 
                      strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.64)} 
                      className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                      onMouseEnter={() => setHoveredDonutSegment("Forestry")}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                    />
                    
                    {/* Renewable (20%) */}
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#b4c5ff" strokeWidth="9" 
                      strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.20)} 
                      transform="rotate(230 50 50)"
                      className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                      onMouseEnter={() => setHoveredDonutSegment("Renewable")}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                    />
                    
                    {/* Blue Carbon (10%) */}
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#d0bcff" strokeWidth="9" 
                      strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.10)} 
                      transform="rotate(302 50 50)"
                      className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                      onMouseEnter={() => setHoveredDonutSegment("Blue Carbon")}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                    />

                    {/* Industrial (6%) */}
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#f43f5e" strokeWidth="9" 
                      strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.06)} 
                      transform="rotate(338 50 50)"
                      className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                      onMouseEnter={() => setHoveredDonutSegment("Industrial")}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">
                      {hoveredDonutSegment === "Forestry" ? "64%" :
                       hoveredDonutSegment === "Renewable" ? "20%" :
                       hoveredDonutSegment === "Blue Carbon" ? "10%" :
                       hoveredDonutSegment === "Industrial" ? "6%" : "64%"}
                    </span>
                    <span className="text-[9px] font-label-caps text-on-surface-variant uppercase font-bold tracking-wider">
                      {hoveredDonutSegment || "Forestry"}
                    </span>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex flex-col gap-2.5 text-[10px] text-on-surface-variant">
                  <div 
                    className="flex items-center gap-2 cursor-pointer transition-all hover:text-white"
                    onMouseEnter={() => setHoveredDonutSegment("Forestry")}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4be277]"></span> Forestry (64%)
                  </div>
                  <div 
                    className="flex items-center gap-2 cursor-pointer transition-all hover:text-white"
                    onMouseEnter={() => setHoveredDonutSegment("Renewable")}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b4c5ff]"></span> Renewable (20%)
                  </div>
                  <div 
                    className="flex items-center gap-2 cursor-pointer transition-all hover:text-white"
                    onMouseEnter={() => setHoveredDonutSegment("Blue Carbon")}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d0bcff]"></span> Blue Carbon (10%)
                  </div>
                  <div 
                    className="flex items-center gap-2 cursor-pointer transition-all hover:text-white"
                    onMouseEnter={() => setHoveredDonutSegment("Industrial")}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Industrial (6%)
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Regional Impact Map Wrapper */}
        <div 
          onClick={() => {
            setMapModalOpen(true);
            addToast("Global project coordinates loaded successfully", "success");
          }}
          className="w-full h-80 bg-[#161d16]/30 border border-white/5 rounded-xl relative overflow-hidden group cursor-pointer shadow-lg hover:border-[#22c55e]/30 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0e150e]/60 z-10"></div>
          <img 
            alt="World Map" 
            className="w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-1000 select-none" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb7OyDCWp7YkPcEJU1FxS09M-4N9v6KlvXgqXtoEF88wpApxXH-5WpNpzFyc7O_hB7llH-L3AD6p68l-EBDSzTGdO3uQtpxAlvarPrfJTog4bnTzjAH--I66C5iYwIQqRteu80Nur9erogAXttkjzY3dYfJVFagEUhxYgeHNI89f9jyJfZ6855cVoQQklvKf2Bm0pvUilGqR1dFtQ7yI5C8CshdVrEQBhd3ggRu3mnByW0bfGrErxlLaNaUl9hPghDCeAnKM5vgENF" 
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="glass-card px-8 py-3.5 rounded-full text-[#4be277] border border-[#22c55e]/35 bg-[#161d16]/80 flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform active:scale-95 duration-300">
              <span className="material-symbols-outlined animate-spin select-none" style={{ animationDuration: "8s" }}>explore</span>
              <span className="font-extrabold text-sm uppercase tracking-wider">Explore Interactive Map</span>
            </div>
          </div>
          
          <div className="absolute top-8 left-12 bg-[#0e150e]/80 border border-white/10 px-3 py-1.5 rounded-xl hidden md:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4be277] animate-pulse"></span>
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Americas Portal Active</span>
          </div>
          <div className="absolute bottom-8 right-12 bg-[#0e150e]/80 border border-white/10 px-3 py-1.5 rounded-xl hidden md:flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#d3bcff] animate-pulse"></span>
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Sunda Mangroves Verification Online</span>
          </div>
        </div>
      </section>

      {/* Detail Slide-over Drawer */}
      <AnimatePresence>
        {selectedContributor && (
          <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContributor(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-[#0c0e16] border-l border-white/10 shadow-2xl z-10 flex flex-col p-8 overflow-y-auto"
            >
              {/* Close and Category */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase font-extrabold text-[#4be277] tracking-widest px-3 py-1 rounded bg-[#22c55e]/15 border border-[#22c55e]/30">
                  {selectedContributor.category}
                </span>
                <button
                  onClick={() => setSelectedContributor(null)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer select-none"
                >
                  close
                </button>
              </div>

              {/* Identity Row */}
              <div className="flex items-start gap-5 mb-8">
                {selectedContributor.logoUrl ? (
                  <img 
                    alt={selectedContributor.name} 
                    className="w-20 h-20 rounded-2xl object-cover bg-white/5 border border-white/10 shrink-0" 
                    src={selectedContributor.logoUrl} 
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-4xl border border-white/10 shrink-0 ${selectedContributor.logoBg}`}>
                    {selectedContributor.logoText}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    {selectedContributor.name}
                    <span className="material-symbols-outlined text-[#4be277] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </h2>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mt-1">{selectedContributor.sector}</p>
                  <p className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">public</span>
                    Region: {selectedContributor.region}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Entity Overview</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {selectedContributor.description}
                </p>
              </div>

              <div className="h-px bg-white/5 mb-8" />

              {/* Core Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#161d16]/30 p-5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Credits Retired</p>
                  <p className="text-xl font-extrabold text-white mt-1.5">{selectedContributor.creditsRetired.toLocaleString()}</p>
                </div>
                <div className="bg-[#22c55e]/5 p-5 rounded-xl border border-[#22c55e]/25">
                  <p className="text-[#4be277] text-[10px] uppercase tracking-wider font-bold">Carbon Offset</p>
                  <p className="text-xl font-extrabold text-[#4be277] mt-1.5">{selectedContributor.carbonOffset}</p>
                </div>
                <div className="bg-[#161d16]/30 p-5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Audit Score</p>
                  <p className="text-xl font-extrabold text-blue-400 mt-1.5">{selectedContributor.auditScore}%</p>
                </div>
                <div className="bg-[#161d16]/30 p-5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Trust Rating</p>
                  <p className="text-xl font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]"></span>
                    {selectedContributor.trustScore}
                  </p>
                </div>
              </div>

              {/* Verification Timeline */}
              <div className="space-y-4 flex-grow mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Live Verification Logs</h4>
                <div className="relative pl-6 border-l border-white/10 space-y-5 text-xs">
                  {selectedContributor.history.map((log, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0.5 bg-[#0c0e16] p-0.5 text-[#4be277]">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      </div>
                      <p className="font-bold text-white text-sm">{log.title}</p>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">{log.desc}</p>
                      <p className="text-[9px] text-[#4be277]/70 font-semibold mt-1">{log.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => {
                  addToast(`Manifest reports downloaded for ${selectedContributor.name}`, "success");
                }}
                className="w-full py-4 rounded-xl bg-[#22c55e] text-[#004b1e] font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition-opacity cursor-pointer mt-auto flex items-center justify-center gap-2 shadow-lg shadow-[#22c55e]/15"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download Audit Manifest
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Impact Interactive Hotspots Map Modal */}
      <AnimatePresence>
        {mapModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setMapModalOpen(false); setSelectedHotspot(null); }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl bg-[#0c0e16] border border-white/10 rounded-card overflow-hidden shadow-2xl z-10 flex flex-col h-[80vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 shrink-0 bg-[#161d16]/30">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4be277] select-none">explore</span>
                    Interactive Global Project Map
                  </h3>
                  <p className="text-[10px] text-on-surface-variant font-semibold tracking-wider uppercase mt-0.5">Click pulsing hotspot coordinates to audit telemetry</p>
                </div>
                <button
                  onClick={() => { setMapModalOpen(false); setSelectedHotspot(null); }}
                  className="material-symbols-outlined text-on-surface-variant hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer select-none"
                >
                  close
                </button>
              </div>

              {/* Map Canvas */}
              <div className="flex-1 w-full bg-[#0e150e] relative overflow-hidden">
                <img 
                  alt="World Map Overlay" 
                  className="w-full h-full object-cover opacity-20 select-none pointer-events-none" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb7OyDCWp7YkPcEJU1FxS09M-4N9v6KlvXgqXtoEF88wpApxXH-5WpNpzFyc7O_hB7llH-L3AD6p68l-EBDSzTGdO3uQtpxAlvarPrfJTog4bnTzjAH--I66C5iYwIQqRteu80Nur9erogAXttkjzY3dYfJVFagEUhxYgeHNI89f9jyJfZ6855cVoQQklvKf2Bm0pvUilGqR1dFtQ7yI5C8CshdVrEQBhd3ggRu3mnByW0bfGrErxlLaNaUl9hPghDCeAnKM5vgENF"
                />

                {/* Hotspots */}
                {mapHotspots.map((spot) => (
                  <div
                    key={spot.id}
                    className="absolute cursor-pointer"
                    style={{ top: spot.lat, left: spot.lng }}
                    onClick={() => {
                      setSelectedHotspot(spot);
                      addToast(`Sensor telemetry loaded for ${spot.name}`, "info");
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-6 w-6 rounded-full bg-[#22c55e] opacity-40 animate-ping" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#4be277] border-2 border-white shadow-xl hover:scale-125 transition-transform" />
                    </div>
                  </div>
                ))}

                {/* Selected Hotspot Card */}
                <AnimatePresence>
                  {selectedHotspot && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 10 }}
                      className="absolute bottom-6 left-6 right-6 md:left-8 md:right-auto md:w-80 bg-[#161d16]/95 border border-white/10 p-5 rounded-xl shadow-2xl backdrop-blur-md z-20 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase font-extrabold text-[#4be277] tracking-widest px-2 py-0.5 rounded bg-[#22c55e]/15 border border-[#22c55e]/30">
                          {selectedHotspot.category}
                        </span>
                        <button
                          onClick={() => setSelectedHotspot(null)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-white text-sm select-none"
                        >
                          close
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{selectedHotspot.name}</h4>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">{selectedHotspot.country}</p>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-on-surface-variant font-medium">Credits Retired:</span>
                        <span className="text-[#4be277] font-bold">{selectedHotspot.credits}</span>
                      </div>
                      <button 
                        onClick={() => {
                          addToast(`Navigating to ${selectedHotspot.name} telemetry records...`, "info");
                          setMapModalOpen(false);
                          setSelectedHotspot(null);
                        }}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                        View Registry Dossier
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
