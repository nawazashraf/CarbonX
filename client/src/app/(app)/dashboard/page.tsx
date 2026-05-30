"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  projectName: string;
  projectCode: string;
  country: string;
  image: string;
  type: "Purchase" | "Retirement";
  amount: number;
  valueUsd: number;
  status: "Completed" | "Processing";
  date: string;
}

interface GrowthPoint {
  label: string;
  val: number; // Y coordinate on scale 0-100
  amount: string; // display value
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

// 12 Months Growth dataset
const GROWTH_12_MONTHS: GrowthPoint[] = [
  { label: "Jan", val: 80, amount: "$22,400" },
  { label: "Feb", val: 75, amount: "$23,100" },
  { label: "Mar", val: 85, amount: "$25,900" },
  { label: "Apr", val: 60, amount: "$28,400" },
  { label: "May", val: 50, amount: "$30,200" },
  { label: "Jun", val: 40, amount: "$32,500" },
  { label: "Jul", val: 35, amount: "$34,100" },
  { label: "Aug", val: 38, amount: "$36,200" },
  { label: "Sep", val: 30, amount: "$38,400" },
  { label: "Oct", val: 25, amount: "$40,900" },
  { label: "Nov", val: 22, amount: "$41,800" },
  { label: "Dec", val: 20, amount: "$42,910" },
];

// Year to Date dataset
const GROWTH_YTD: GrowthPoint[] = [
  { label: "Jan", val: 80, amount: "$35,000" },
  { label: "Feb", val: 72, amount: "$36,800" },
  { label: "Mar", val: 65, amount: "$37,200" },
  { label: "Apr", val: 55, amount: "$39,400" },
  { label: "May", val: 30, amount: "$42,910" },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    projectName: "Amazon Basin II",
    projectCode: "VCS-1842",
    country: "Brazil",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDflhiLPrQ4fs2VoKvH4NE72rsepEASSmSklf2INOWzFTN8fRT1VVm6wKcNMvfrIwk0v0JVLr7xkhS7By1p6hvBDDcfUhGR4N_3cbomH5XYCtNznpWEB84sqmF6GOIDdMZey8fyOth3IQosIkvpsWsd1wgHgg_RSj6nlFYLUZxoaa6zyE_XzLTOBVN96_unrQmBAy1hhrhPsw9_WBLZNCshHXRfiy1M0pUAxnNm8IMS5qbZqDXnF995TO98wzvnQ7p_dFmr2rWXACo",
    type: "Purchase",
    amount: 1200.00,
    valueUsd: 18450.00,
    status: "Completed",
    date: "Oct 24, 2024"
  },
  {
    id: "tx-2",
    projectName: "Sahara Wind Farm",
    projectCode: "GS-552",
    country: "Morocco",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArWpCqShvE3PjPD7woDf1h1HSRf34KAZ9qTmK04L8HFwuIed_CyHEyHURaOTvHBQNNKQmaOyDP2kuTCD3L2PKBzX9sy_pzAfZ4gVg5NEaR214kWeACS18Vn0fKoD9DGAjACUWs6KqYnEC9NtXrSB5yz0mrvTpGkoJSGGFgRIZ1RG4VOdP0xILfwPHEFMmYDktNl1dO0CU5eLOirOskiilyJedRS5QeIyC4BEdPY9R0-qAKuuEENPTL7cKenH6aPOirZPMcsJpK9iA",
    type: "Retirement",
    amount: 450.00,
    valueUsd: 6920.00,
    status: "Completed",
    date: "Oct 18, 2024"
  },
  {
    id: "tx-3",
    projectName: "Coral Reef Restoration",
    projectCode: "VCS-991",
    country: "Indonesia",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9H29b-O0k9tSP2PwyJiri3nModEaFUImpuuuKeROckuyztGsJnqrOS85HWh-sT5E8IG6eV1V5JyO11_IfNyZyPaqOXrulamxElb9yVzYafxiBjnzaD0pecbeH1QPbLH3FijMeYh9kfVeCZUNAYdUdN3iy9LCjcVTCt1HZ-QUvDB21bTKgEdlcNOxNToUV09GA6NY9wCqfUjjOYycCi_V6d2Xmh9tDpXui2RQmxNY0SSw7Tew0BmfHm3JXJ4Uhz2WDk1eeU7a7Hww",
    type: "Purchase",
    amount: 850.00,
    valueUsd: 15200.00,
    status: "Processing",
    date: "Oct 26, 2024"
  },
  {
    id: "tx-4",
    projectName: "Pacific Kelp Forests",
    projectCode: "VCS-1102",
    country: "United States",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9H29b-O0k9tSP2PwyJiri3nModEaFUImpuuuKeROckuyztGsJnqrOS85HWh-sT5E8IG6eV1V5JyO11_IfNyZyPaqOXrulamxElb9yVzYafxiBjnzaD0pecbeH1QPbLH3FijMeYh9kfVeCZUNAYdUdN3iy9LCjcVTCt1HZ-QUvDB21bTKgEdlcNOxNToUV09GA6NY9wCqfUjjOYycCi_V6d2Xmh9tDpXui2RQmxNY0SSw7Tew0BmfHm3JXJ4Uhz2WDk1eeU7a7Hww",
    type: "Retirement",
    amount: 392.15,
    valueUsd: 5880.00,
    status: "Completed",
    date: "Oct 04, 2024"
  }
];

export default function PortfolioDashboard() {
  // Sidebar navigation active state
  const [activeTab, setActiveTab] = useState<"Overview" | "Portfolio" | "Verification" | "Offsets" | "Settings">("Portfolio");

  // Chart and filtering states
  const [timeframe, setTimeframe] = useState<"Last 12 Months" | "Year to Date">("Last 12 Months");
  const [hoveredNode, setHoveredNode] = useState<GrowthPoint | null>(null);
  const [hoveredAllocationSegment, setHoveredAllocationSegment] = useState<string | null>(null);
  
  // Table search and type filtering
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState<"All" | "Purchase" | "Retirement">("All");
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // Dynamic drawer triggers
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const [certificationOpen, setCertificationOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Buy Credits Form state
  const [selectedBuyProject, setSelectedBuyProject] = useState("Amazon Basin II");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyProcessState, setBuyProcessState] = useState<"idle" | "verifying" | "success">("idle");

  // Get Certified Form state
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("Corporate");
  const [certUploaded, setCertUploaded] = useState(false);
  const [certState, setCertState] = useState<"idle" | "auditing" | "success">("idle");

  // Standard interactive notification trigger
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Active line growth dataset
  const activeGrowthData = useMemo(() => {
    return timeframe === "Last 12 Months" ? GROWTH_12_MONTHS : GROWTH_YTD;
  }, [timeframe]);

  // Compute SVG line points dynamically
  const svgPathPoints = useMemo(() => {
    if (activeGrowthData.length === 0) return "";
    const width = 1000;
    const height = 280;
    const stepX = width / (activeGrowthData.length - 1);
    
    return activeGrowthData.map((pt, idx) => {
      const x = idx * stepX;
      // val is 0-100 representing distance from TOP (0 is top, 100 is bottom)
      const y = (pt.val / 100) * (height - 40) + 20;
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  }, [activeGrowthData]);

  // Compute SVG area path for gradient fills
  const svgAreaPoints = useMemo(() => {
    if (activeGrowthData.length === 0) return "";
    const width = 1000;
    const height = 280;
    const stepX = width / (activeGrowthData.length - 1);
    
    const linePath = activeGrowthData.map((pt, idx) => {
      const x = idx * stepX;
      const y = (pt.val / 100) * (height - 40) + 20;
      return `L ${x} ${y}`;
    }).join(" ");
    
    // Close the area loop (L lastX height -> L 0 height -> Z)
    return `M 0 280 ${linePath} L 1000 280 L 0 280 Z`;
  }, [activeGrowthData]);

  // Filtered transactions for dynamic table search and toggle
  const filteredTransactions = useMemo(() => {
    const matched = INITIAL_TRANSACTIONS.filter((tx) => {
      const matchesSearch = tx.projectName.toLowerCase().includes(txSearch.toLowerCase()) ||
                            tx.projectCode.toLowerCase().includes(txSearch.toLowerCase());
      const matchesType = txTypeFilter === "All" || tx.type === txTypeFilter;
      return matchesSearch && matchesType;
    });

    return showAllTransactions ? matched : matched.slice(0, 3);
  }, [txSearch, txTypeFilter, showAllTransactions]);

  // Handle Buy Credits submission
  const handleBuyCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyAmount || isNaN(Number(buyAmount))) return;
    setBuyProcessState("verifying");

    setTimeout(() => {
      setBuyProcessState("success");
      addToast(`Successfully purchased ${buyAmount} tCO2e for ${selectedBuyProject}!`, "success");
      // Add fake transaction to logs
      INITIAL_TRANSACTIONS.unshift({
        id: `tx-${Date.now()}`,
        projectName: selectedBuyProject,
        projectCode: selectedBuyProject.includes("Amazon") ? "VCS-1842" : selectedBuyProject.includes("Sahara") ? "GS-552" : "VCS-991",
        country: selectedBuyProject.includes("Amazon") ? "Brazil" : selectedBuyProject.includes("Sahara") ? "Morocco" : "Indonesia",
        image: selectedBuyProject.includes("Amazon") ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDflhiLPrQ4fs2VoKvH4NE72rsepEASSmSklf2INOWzFTN8fRT1VVm6wKcNMvfrIwk0v0JVLr7xkhS7By1p6hvBDDcfUhGR4N_3cbomH5XYCtNznpWEB84sqmF6GOIDdMZey8fyOth3IQosIkvpsWsd1wgHgg_RSj6nlFYLUZxoaa6zyE_XzLTOBVN96_unrQmBAy1hhrhPsw9_WBLZNCshHXRfiy1M0pUAxnNm8IMS5qbZqDXnF995TO98wzvnQ7p_dFmr2rWXACo" : "https://lh3.googleusercontent.com/aida-public/AB6AXuArWpCqShvE3PjPD7woDf1h1HSRf34KAZ9qTmK04L8HFwuIed_CyHEyHURaOTvHBQNNKQmaOyDP2kuTCD3L2PKBzX9sy_pzAfZ4gVg5NEaR214kWeACS18Vn0fKoD9DGAjACUWs6KqYnEC9NtXrSB5yz0mrvTpGkoJSGGFgRIZ1RG4VOdP0xILfwPHEFMmYDktNl1dO0CU5eLOirOskiilyJedRS5QeIyC4BEdPY9R0-qAKuuEENPTL7cKenH6aPOirZPMcsJpK9iA",
        type: "Purchase",
        amount: Number(buyAmount),
        valueUsd: Number(buyAmount) * 15.37,
        status: "Processing",
        date: "Today"
      });
      setTimeout(() => {
        setBuyCreditsOpen(false);
        setBuyProcessState("idle");
        setBuyAmount("");
      }, 1500);
    }, 2000);
  };

  // Handle Certification submission
  const handleCertificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !certUploaded) return;
    setCertState("auditing");

    setTimeout(() => {
      setCertState("success");
      addToast(`CarbonX Certification issued successfully to ${orgName}!`, "success");
      setTimeout(() => {
        setCertificationOpen(false);
        setCertState("idle");
        setOrgName("");
        setCertUploaded(false);
      }, 1500);
    }, 2000);
  };

  const handleDownloadReport = () => {
    const headers = "Project Name,Project Code,Country,Type,Amount (tCO2e),Value (USD),Status,Date\n";
    const rows = INITIAL_TRANSACTIONS.map((tx) => 
      `"${tx.projectName}","${tx.projectCode}","${tx.country}","${tx.type}",${tx.amount},${tx.valueUsd},"${tx.status}","${tx.date}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `carbon_portfolio_report_\${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast("Portfolio Asset CSV Report successfully downloaded!", "success");
  };

  return (
    <div className="flex flex-1 pt-16 bg-[#0c0e16] text-[#E5E2E1] selection:bg-[#22c55e]/30 font-sans relative">
      
      {/* Global Toast Container */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="pointer-events-auto bg-[#171717] border border-white/10 shadow-2xl rounded-xl px-5 py-3.5 flex items-center gap-3 w-80 text-xs font-bold"
            >
              <span className={`material-symbols-outlined shrink-0 ${
                toast.type === "success" ? "text-[#4ae176]" : "text-blue-400"
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

      {/* Main Content Canvas */}
      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-margin-desktop py-8 flex flex-col space-y-8 overflow-x-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="font-headline-lg text-[32px] font-extrabold text-white leading-tight mb-2">Portfolio Dashboard</h1>
            <p className="font-body-md text-sm text-text-secondary">Track your carbon asset performance and environmental impact in real-time.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end shrink-0">
            <button 
              onClick={handleDownloadReport}
              className="px-4 py-2.5 border border-[#2A2A2A] bg-white/5 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
            >
              Download Report
            </button>
            <button 
              onClick={() => setCertificationOpen(true)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Get Certified
            </button>
            <button 
              onClick={() => setBuyCreditsOpen(true)}
              className="px-4 py-2.5 bg-[#2563eb] hover:opacity-90 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2563eb]/15"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Buy Credits
            </button>
          </div>
        </div>

        {/* Bento Grid Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Credits Owned */}
          <div className="glass-card p-6 rounded-xl flex flex-col gap-4 bg-[#171717] border border-[#2A2A2A] hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-[#2563eb]/10 rounded-lg text-[#b4c5ff] border border-[#2563eb]/20">
                <span className="material-symbols-outlined text-lg">database</span>
              </div>
              <span className="text-[#4ae176] font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                +12.5%
              </span>
            </div>
            <div>
              <p className="font-semibold text-xs text-text-secondary uppercase tracking-wider">Credits Owned</p>
              <h3 className="text-2xl font-black text-white mt-1.5 flex items-baseline gap-1">
                2,840.50
                <span className="text-xs text-text-secondary font-medium lowercase">tCO2e</span>
              </h3>
            </div>
          </div>

          {/* Card 2: Credits Retired */}
          <div className="glass-card p-6 rounded-xl flex flex-col gap-4 bg-[#171717] border border-[#2A2A2A] hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-[#22c55e]/10 rounded-lg text-[#4ae176] border border-[#22c55e]/20">
                <span className="material-symbols-outlined text-lg">energy_savings_leaf</span>
              </div>
              <span className="text-[#4ae176] font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                +4.2%
              </span>
            </div>
            <div>
              <p className="font-semibold text-xs text-text-secondary uppercase tracking-wider">Credits Retired</p>
              <h3 className="text-2xl font-black text-white mt-1.5 flex items-baseline gap-1">
                842.15
                <span className="text-xs text-text-secondary font-medium lowercase">tCO2e</span>
              </h3>
            </div>
          </div>

          {/* Card 3: Portfolio Value */}
          <div className="glass-card p-6 rounded-xl flex flex-col gap-4 bg-[#171717] border border-[#2A2A2A] hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-[#7d4ce7]/10 rounded-lg text-[#d0bcff] border border-[#7d4ce7]/20">
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
              <span className="text-[#4ae176] font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                +2.1%
              </span>
            </div>
            <div>
              <p className="font-semibold text-xs text-text-secondary uppercase tracking-wider">Portfolio Value</p>
              <h3 className="text-2xl font-black text-white mt-1.5">$42,910.00</h3>
            </div>
          </div>

          {/* Card 4: Impact Score */}
          <div className="glass-card p-6 rounded-xl flex flex-col gap-4 bg-[#171717] border border-[#2A2A2A] hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-[#22c55e]/10 rounded-lg text-[#4ae176] border border-[#22c55e]/20">
                <span className="material-symbols-outlined text-lg">shield_with_heart</span>
              </div>
              <span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#4ae176] border border-[#22c55e]/30 text-[9px] font-bold rounded-full uppercase tracking-wider">
                Elite
              </span>
            </div>
            <div>
              <p className="font-semibold text-xs text-text-secondary uppercase tracking-wider">Impact Score</p>
              <div className="flex items-center gap-3 mt-1.5 w-full">
                <h3 className="text-2xl font-black text-white shrink-0">94/100</h3>
                <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden flex-grow">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-[#4ae176]"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Portfolio Growth Line Chart with interactive nodes */}
          <div className="glass-card p-6 rounded-xl lg:col-span-2 bg-[#171717] border border-[#2A2A2A] flex flex-col justify-between h-[380px] relative">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Portfolio Growth (12 Months)</h4>
              
              <select 
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value as any);
                  addToast(`Growth dataset switched to ${e.target.value}`, "info");
                }}
                className="bg-[#171717] border border-[#2A2A2A] rounded-lg font-semibold text-xs text-text-secondary px-3 py-1.5 focus:outline-none focus:border-[#b4c5ff] cursor-pointer"
              >
                <option value="Last 12 Months">Last 12 Months</option>
                <option value="Year to Date">Year to Date</option>
              </select>
            </div>

            <div className="h-[250px] w-full relative overflow-hidden flex flex-col justify-end pt-4 select-none">
              {/* Dynamic SVG Drawing */}
              <div className="w-full h-40 relative">
                <svg className="w-full h-full" viewBox="0 0 1000 280" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="area-grad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Area */}
                  <motion.path 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    transition={{ duration: 1 }}
                    d={svgAreaPoints} 
                    fill="url(#area-grad)" 
                  />
                  
                  {/* Chart Line */}
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    d={svgPathPoints} 
                    fill="none" 
                    stroke="#2563EB" 
                    strokeWidth="3.5" 
                  />
                </svg>

                {/* Hotspot Interactive Nodes */}
                <div className="absolute inset-0 flex justify-between items-end px-1">
                  {activeGrowthData.map((pt, idx) => {
                    const widthScale = 100 / (activeGrowthData.length - 1);
                    const positionX = `${idx * widthScale}%`;
                    const positionY = `${pt.val}%`;
                    
                    return (
                      <div 
                        key={pt.label}
                        className="absolute cursor-pointer -translate-x-1/2 flex flex-col items-center group/node"
                        style={{ left: positionX, bottom: `calc(100% - ${positionY})` }}
                        onMouseEnter={() => setHoveredNode(pt)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        {/* Pulse Node Ring */}
                        <div className="relative flex items-center justify-center h-4 w-4">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-[#2563EB]/40 animate-ping group-hover/node:scale-125" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB] border border-white shadow-md transition-transform duration-200 group-hover/node:scale-110" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Tooltip Display */}
                <AnimatePresence>
                  {hoveredNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0e0e0e]/95 border border-white/10 px-4 py-2 rounded-xl shadow-2xl z-30 flex items-center gap-3 text-xs font-bold text-white pointer-events-none"
                    >
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>{hoveredNode.label}:</span>
                      <span className="text-blue-400 font-black">{hoveredNode.amount}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* X-Axis Labels */}
              <div className="w-full flex justify-between text-[10px] text-text-secondary px-2 border-t border-white/5 pt-3 mt-4">
                {activeGrowthData.map((pt) => (
                  <span key={pt.label} className="font-semibold uppercase tracking-wider">{pt.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Donut Allocation Chart */}
          <div className="glass-card p-6 rounded-xl bg-[#171717] border border-[#2A2A2A] flex flex-col justify-between h-[380px]">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Asset Allocation</h4>
            
            <div className="flex flex-col gap-6">
              {/* SVG donut */}
              <div className="relative w-40 h-40 mx-auto shrink-0 select-none">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1c1b1b" strokeWidth="8" />
                  
                  {/* Reforestation (45%) */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="#4ae176" strokeWidth="9" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.45)} 
                    className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                    onMouseEnter={() => setHoveredAllocationSegment("Reforestation")}
                    onMouseLeave={() => setHoveredAllocationSegment(null)}
                  />
                  
                  {/* Renewable Energy (30%) */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="#2563eb" strokeWidth="9" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.30)} 
                    transform="rotate(162 50 50)"
                    className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                    onMouseEnter={() => setHoveredAllocationSegment("Renewable Energy")}
                    onMouseLeave={() => setHoveredAllocationSegment(null)}
                  />

                  {/* Blue Carbon (20%) */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="#7d4ce7" strokeWidth="9" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.20)} 
                    transform="rotate(270 50 50)"
                    className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                    onMouseEnter={() => setHoveredAllocationSegment("Blue Carbon")}
                    onMouseLeave={() => setHoveredAllocationSegment(null)}
                  />

                  {/* Other (5%) */}
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="#2A2A2A" strokeWidth="9" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.05)} 
                    transform="rotate(342 50 50)"
                    className="cursor-pointer transition-all duration-300 hover:stroke-[11px]"
                    onMouseEnter={() => setHoveredAllocationSegment("Other")}
                    onMouseLeave={() => setHoveredAllocationSegment(null)}
                  />
                </svg>

                {/* Central percentage stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    {hoveredAllocationSegment === "Reforestation" ? "45%" :
                     hoveredAllocationSegment === "Renewable Energy" ? "30%" :
                     hoveredAllocationSegment === "Blue Carbon" ? "20%" :
                     hoveredAllocationSegment === "Other" ? "5%" : "24"}
                  </span>
                  <span className="text-[8px] font-semibold text-text-secondary uppercase tracking-wider mt-0.5">
                    {hoveredAllocationSegment || "Total Assets"}
                  </span>
                </div>
              </div>

              {/* Allocation Legends */}
              <div className="flex flex-col gap-2">
                <div 
                  className={`flex justify-between items-center text-[11px] cursor-pointer transition-all ${hoveredAllocationSegment === "Reforestation" ? "text-white font-bold" : "text-text-secondary"}`}
                  onMouseEnter={() => setHoveredAllocationSegment("Reforestation")}
                  onMouseLeave={() => setHoveredAllocationSegment(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded bg-[#4ae176]"></div>
                    <span>Reforestation</span>
                  </div>
                  <span className="font-bold text-white">45%</span>
                </div>
                
                <div 
                  className={`flex justify-between items-center text-[11px] cursor-pointer transition-all ${hoveredAllocationSegment === "Renewable Energy" ? "text-white font-bold" : "text-text-secondary"}`}
                  onMouseEnter={() => setHoveredAllocationSegment("Renewable Energy")}
                  onMouseLeave={() => setHoveredAllocationSegment(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded bg-[#2563eb]"></div>
                    <span>Renewable Energy</span>
                  </div>
                  <span className="font-bold text-white">30%</span>
                </div>

                <div 
                  className={`flex justify-between items-center text-[11px] cursor-pointer transition-all ${hoveredAllocationSegment === "Blue Carbon" ? "text-white font-bold" : "text-text-secondary"}`}
                  onMouseEnter={() => setHoveredAllocationSegment("Blue Carbon")}
                  onMouseLeave={() => setHoveredAllocationSegment(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded bg-[#7d4ce7]"></div>
                    <span>Blue Carbon</span>
                  </div>
                  <span className="font-bold text-white">20%</span>
                </div>

                <div 
                  className={`flex justify-between items-center text-[11px] cursor-pointer transition-all ${hoveredAllocationSegment === "Other" ? "text-white font-bold" : "text-text-secondary"}`}
                  onMouseEnter={() => setHoveredAllocationSegment("Other")}
                  onMouseLeave={() => setHoveredAllocationSegment(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded bg-[#2A2A2A]"></div>
                    <span>Other</span>
                  </div>
                  <span className="font-bold text-white">5%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Transaction History Section */}
        <div className="glass-card rounded-xl overflow-hidden bg-[#171717] border border-[#2A2A2A] flex flex-col space-y-4">
          
          <div className="p-6 border-b border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-base text-white">Transaction History</h4>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-0.5">Auditable carbon credit registry transactions</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              
              {/* Local Search input */}
              <div className="flex flex-1 sm:flex-initial items-center bg-[#0c0e16] border border-[#2A2A2A] rounded-lg px-3 py-1.5 focus-within:border-[#b4c5ff]/50 transition-colors shadow-inner">
                <span className="material-symbols-outlined text-text-secondary text-base select-none">search</span>
                <input 
                  type="text" 
                  placeholder="Filter logs..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-xs w-full sm:w-32 text-white ml-2 placeholder:text-text-secondary"
                />
              </div>

              {/* Purchase vs Retirement Filters */}
              <div className="flex gap-1.5 bg-[#0c0e16] border border-[#2A2A2A] p-1 rounded-lg">
                {(["All", "Purchase", "Retirement"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTxTypeFilter(type);
                      addToast(`Transactions filtered by ${type}`, "info");
                    }}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      txTypeFilter === type
                        ? "bg-[#2563eb] text-white"
                        : "text-text-secondary hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* View All Button */}
              <button 
                onClick={() => {
                  setShowAllTransactions(!showAllTransactions);
                  addToast(showAllTransactions ? "Showing top transactions" : "Showing all logged records", "info");
                }}
                className="text-[#2563eb] text-xs font-bold hover:underline select-none shrink-0"
              >
                {showAllTransactions ? "Collapse" : "View All"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="material-symbols-outlined text-[36px] text-text-secondary mb-2 select-none">receipt_long</span>
                <p className="text-xs text-text-secondary">No recorded transactions match the filter criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#1c1b1b] text-[10px] font-semibold text-text-secondary uppercase tracking-widest border-b border-[#2A2A2A]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Project Name</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount (tCO2e)</th>
                    <th className="px-6 py-4 font-semibold text-right">Value (USD)</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A] text-xs text-[#E5E2E1]">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#201f1f]/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            alt={tx.projectName} 
                            className="w-9 h-9 rounded object-cover bg-white/5 border border-white/10 shrink-0" 
                            src={tx.image} 
                          />
                          <div>
                            <p className="font-bold text-white group-hover:text-[#b4c5ff] transition-colors">{tx.projectName}</p>
                            <p className="text-[10px] text-text-secondary mt-0.5">{tx.projectCode} • {tx.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === "Purchase"
                            ? "bg-[#2563eb]/10 text-[#b4c5ff] border border-[#2563eb]/20"
                            : "bg-[#22c55e]/10 text-[#4ae176] border border-[#22c55e]/20"
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-white">
                        {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-white">
                        ${tx.valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            tx.status === "Completed" ? "bg-[#22C55E] shadow-[0_0_8px_#22C55E]" : "bg-blue-400 animate-pulse"
                          }`} />
                          <span className={`${tx.status === "Completed" ? "text-[#4ae176]" : "text-blue-400"} font-semibold text-[11px]`}>
                            {tx.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-secondary">
                        {tx.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>

      {/* Dynamic Slide-over Drawer for Buy Credits */}
      <AnimatePresence>
        {buyCreditsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBuyCreditsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#0c0e16] border-l border-[#2A2A2A] shadow-2xl z-10 flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase font-bold text-[#b4c5ff] tracking-widest px-3 py-1 rounded bg-[#2563eb]/15 border border-[#2563eb]/30">
                  Asset Order
                </span>
                <button
                  onClick={() => setBuyCreditsOpen(false)}
                  className="material-symbols-outlined text-text-secondary hover:text-white p-2 rounded-lg cursor-pointer select-none"
                >
                  close
                </button>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">Buy Carbon Credits</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Expand your institutional ecological balance. Choose a high-trust registry and define credit quantities to retire or hold.
              </p>

              {buyProcessState === "idle" && (
                <form onSubmit={handleBuyCreditsSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">Select Registry Project</label>
                    <select 
                      value={selectedBuyProject}
                      onChange={(e) => setSelectedBuyProject(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563eb] text-white cursor-pointer"
                    >
                      <option value="Amazon Basin II">Amazon Basin II (VCS-1842)</option>
                      <option value="Sahara Wind Farm">Sahara Wind Farm (GS-552)</option>
                      <option value="Coral Reef Restoration">Coral Reef Restoration (VCS-991)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">Amount (tCO2e)</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 500"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563eb] text-white"
                    />
                  </div>

                  <div className="p-4 bg-[#171717] rounded-xl border border-[#2A2A2A] space-y-3">
                    <div className="flex justify-between items-center text-xs text-text-secondary">
                      <span>Rate per tCO2e:</span>
                      <span className="font-bold text-white">$15.37 USD</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-text-secondary">
                      <span>Network Gas Fee:</span>
                      <span className="font-bold text-white">$4.20 USD</span>
                    </div>
                    <div className="h-px bg-white/5 my-2" />
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-white">Est. Total:</span>
                      <span className="text-[#2563eb]">
                        ${buyAmount && !isNaN(Number(buyAmount)) 
                          ? (Number(buyAmount) * 15.37 + 4.2).toLocaleString(undefined, { minimumFractionDigits: 2 }) 
                          : "0.00"
                        } USD
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#2563eb] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#2563eb]/20"
                  >
                    <span className="material-symbols-outlined text-base">shopping_cart</span>
                    Confirm Assets Order
                  </button>
                </form>
              )}

              {buyProcessState === "verifying" && (
                <div className="p-12 text-center space-y-6 flex-grow flex flex-col justify-center items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb]" />
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">Verifying Transaction</h4>
                    <p className="text-xs text-text-secondary max-w-[240px] mx-auto leading-relaxed">
                      Broadcasting carbon manifest locks to decentralized ledger nodes. Waiting for confirmations...
                    </p>
                  </div>
                </div>
              )}

              {buyProcessState === "success" && (
                <div className="p-8 text-center space-y-6 flex-grow flex flex-col justify-center items-center">
                  <div className="h-16 w-16 bg-[#22c55e]/15 border border-[#22c55e]/30 rounded-full flex items-center justify-center text-[#4ae176] shadow-xl shadow-[#22c55e]/10">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">Purchase Confirmed!</h4>
                    <p className="text-xs text-text-secondary max-w-[260px] leading-relaxed">
                      The {buyAmount} tCO2e asset blocks have been issued under your wallet credential. Registry files are ready.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Slide-over Drawer for Get Certified */}
      <AnimatePresence>
        {certificationOpen && (
          <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCertificationOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#0c0e16] border-l border-[#2A2A2A] shadow-2xl z-10 flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase font-bold text-[#4ae176] tracking-widest px-3 py-1 rounded bg-[#22c55e]/15 border border-[#22c55e]/30">
                  Certification
                </span>
                <button
                  onClick={() => setCertificationOpen(false)}
                  className="material-symbols-outlined text-text-secondary hover:text-white p-2 rounded-lg cursor-pointer select-none"
                >
                  close
                </button>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">Institutional Certification</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Apply for CarbonX verified climate positive auditing. Elite certifications unlock advanced carbon offset registry APIs.
              </p>

              {certState === "idle" && (
                <form onSubmit={handleCertificationSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">Organization Legal Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. EcoNova Holdings"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563eb] text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">Corporate Sector Type</label>
                    <select 
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className="w-full bg-[#171717] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563eb] text-white cursor-pointer"
                    >
                      <option value="Corporate">Corporate / Enterprise</option>
                      <option value="NGO">Non-Governmental Org</option>
                      <option value="Registry">Carbon Registry Operator</option>
                      <option value="Sovereign">Sovereign / State Entity</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">Auditing Proof Manifest</label>
                    <div 
                      onClick={() => setCertUploaded(!certUploaded)}
                      className="border-2 border-dashed border-[#2A2A2A] hover:border-[#b4c5ff] transition-colors rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#171717]"
                    >
                      <span className="material-symbols-outlined text-[#b4c5ff] text-[28px] mb-2">upload_file</span>
                      <p className="text-xs text-white font-bold">Mock upload carbon audit ledger</p>
                      <p className="text-[10px] text-text-secondary mt-1">PDF, XML up to 50MB</p>
                    </div>

                    {certUploaded && (
                      <div className="p-3 bg-[#22c55e]/5 border border-[#22c55e]/30 rounded-xl flex items-center justify-between text-xs text-[#4ae176] mt-2">
                        <span className="flex items-center gap-1.5 truncate max-w-[280px]">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          carbon_audit_ledger_2026.pdf
                        </span>
                        <span className="text-[9px] opacity-75 font-semibold">Attached</span>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#b4c5ff] hover:opacity-95 text-[#002a78] font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#b4c5ff]/20"
                  >
                    <span className="material-symbols-outlined text-base">verified</span>
                    Submit Certification Audits
                  </button>
                </form>
              )}

              {certState === "auditing" && (
                <div className="p-12 text-center space-y-6 flex-grow flex flex-col justify-center items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#b4c5ff]" />
                    <div className="absolute animate-pulse h-10 w-10 bg-[#b4c5ff]/20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">Running AI Carbon Audit</h4>
                    <p className="text-xs text-text-secondary max-w-[240px] mx-auto leading-relaxed">
                      Cross-referencing reported offsets with global Sentinel canopy maps. Verifying audit integrity...
                    </p>
                  </div>
                </div>
              )}

              {certState === "success" && (
                <div className="p-8 text-center space-y-6 flex-grow flex flex-col justify-center items-center">
                  <div className="h-16 w-16 bg-[#22c55e]/15 border border-[#22c55e]/30 rounded-full flex items-center justify-center text-[#4ae176] shadow-xl shadow-[#22c55e]/10">
                    <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">Auditing Certification Successful!</h4>
                    <p className="text-xs text-text-secondary max-w-[260px] leading-relaxed">
                      CarbonX certified credentials issued under the cryptographic signature of the registry protocol.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
