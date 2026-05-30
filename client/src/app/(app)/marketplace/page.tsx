"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useSendTransaction } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";

interface Project {
  id: string;
  name: string;
  projectNumber: string;
  location: string;
  category: "Forestry" | "Energy" | "Ocean" | "Tech";
  price: number;
  score: number;
  image: string;
  description: string;
  verified: boolean;
  developer: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Amazon Basin Reforestation",
    projectNumber: "#4022",
    location: "Brazil",
    category: "Forestry",
    price: 24.5,
    score: 98,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmYck8zMT03Vz_euIoi1PRgoYdFKMhUoGMmkjdP_olcgkQvKU_MNyFmtlkUYictINVBi9pMWgw_pUZkxmlH6RZ744qQb0IybpApyWuW9441WlkdDLd4_zSvlFsPjsLWjbJiFQTl4ea7PCt0Ciw4j1L6b6g0ISAMjjT8CmG-NIm6RfESik3_7r-VzHdNdd0CU6W5-RjLNERwSMi2E7ZZ8rtV1R5tnG2G5Wmaq1Eia17eWHdtBAj60n3CCs7MffES5Lnmd-dAlkuInU",
    description: "Restoring native tree species across the Amazon Basin to secure carbon sinks and support indigenous communities.",
    verified: true,
    developer: "BioCarbon Brazil",
  },
  {
    id: "proj-2",
    name: "Sahara Solar Expansion",
    projectNumber: "#1289",
    location: "Morocco",
    category: "Energy",
    price: 18.9,
    score: 92,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRK2LV0NHYEdwHpzw_F6kr0BZntyjSLjuDr3P_UAopCPm-WNbDWQICeOMw3MthUxZSEX-DSTXhpmKZdNIFmpkWYoH-jKAFoQeS9TXF0RM_7LuL-5etL5qfbeBGdfsR2GcVCRbDzsQl1BBIeNr78hsgDiEEezmndgcXRP6f2Csm4UsnALfeapsloEZXZUE_1w1tsP2JmvVVcVE2zlECInRZF7H7MoXi83o2h73BBRMnf-SOK53H_VIlBmJRJQrs7NhjTK8apY4rbXU",
    description: "Harnessing solar power from the Sahara Desert to displace fossil fuel dependency in North Africa.",
    verified: true,
    developer: "Atlas Renewables",
  },
  {
    id: "proj-3",
    name: "Andean Carbon Sink",
    projectNumber: "#8831",
    location: "Peru",
    category: "Forestry",
    price: 32.0,
    score: 95,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhO6PVM1vsgvy-hhe2b9EC5J8m14I7UADf6zoUgQejZf04GHuQzVSYwqqip42bSUwWXqtZCE7bDQgJXExlG-iR7pwCX5zcKdp8ADMkMgveDlzCAKNzbAMCJf99Xj-fHMmR2seId0h26mmM3u9NGsUgwnvGfsO-HRe1Hz9Cdc7NQfOeUT1fTcyRb3WKQcG1kNunAyjMp92IMRSZO7t7fRlJCyIa8lKqTFJTjT-XAQf1O1rw8Oi47T9td62d09OwouuKH0cs60-w5Vw",
    description: "High-altitude mountain forestry conservation preventing soil erosion and enhancing regional carbon sequestration.",
    verified: true,
    developer: "Andes Conservation",
  },
  {
    id: "proj-4",
    name: "Direct Air Algae Capture",
    projectNumber: "#5521",
    location: "Iceland",
    category: "Tech",
    price: 120.0,
    score: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDY2KLYhYENQo6KhTBWpAXA7q2InYGY95Xvmf81-MDT2sgcFPPtpel29K8ylPwx9JaVDU8VJF4Vrm6kkvPi21K2mRfcemwhIb65aXALCPGnXvzG7m3u3g00kp5iFCg2j0P7fimn7AQhARLLXJdaRtPKlPXWEykqv3OuCWbV6BrLr0haEZ7GWZEGrVMw20QGCcuontEX86kmrLSsDUuTXP1ZhbIsW5Uzk7cFYy1A-aptovom_9OGGGf2PwlW-YWjRrSKDajI7HHU_YU",
    description: "Utilizing modern laboratory bioreactors to cultivate high-density algae, securing long-term geological carbon storage.",
    verified: true,
    developer: "Sinc-Algae Tech",
  },
];

export default function Marketplace() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { sendTransactionAsync } = useSendTransaction();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("score-desc");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Purchase Modal Form State
  const [purchaseTons, setPurchaseTons] = useState<number>(10);
  const [txState, setTxState] = useState<"idle" | "submitting" | "confirming" | "success">("idle");
  const [txHash, setTxHash] = useState<string>("");

  // Live Statistics States
  const [liveCreditsIssued, setLiveCreditsIssued] = useState(4200154);
  const [liveCreditsRetired, setLiveCreditsRetired] = useState(1804230);
  const [liveCarbonReduced, setLiveCarbonReduced] = useState(2400150320);

  // Live updates simulator
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random small fractions of carbon credits/tons reduced to make dashboard feel alive
      setLiveCreditsIssued((prev) => prev + Math.floor(Math.random() * 2) + 1);
      setLiveCreditsRetired((prev) => prev + Math.floor(Math.random() * 2));
      setLiveCarbonReduced((prev) => prev + Math.floor(Math.random() * 15) + 5);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.projectNumber.toLowerCase().includes(q)
      );
    }

    // Sort Projects
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "score-desc") {
      result.sort((a, b) => b.score - a.score);
    }

    return result;
  }, [projects, selectedCategory, searchQuery, sortBy]);

  const categories = ["All", "Forestry", "Energy", "Ocean", "Tech"];

  const handleBuyClick = (project: Project) => {
    setSelectedProject(project);
    setPurchaseTons(10);
    setTxState("idle");
    setTxHash("");
  };

  const handleConfirmPurchase = async () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      } else {
        showToast("Please connect your wallet first");
      }
      return;
    }

    try {
      setTxState("submitting");

      // We send 0.0001 ETH per ton of carbon credit to a mock Carbon Credit Vault
      const ethAmount = (purchaseTons * 0.0001).toFixed(4);
      const tx = await sendTransactionAsync({
        to: "0x71C7656EC7ab88b098defB751B7401B5f6d1476B", // Dummy Carbon Vault Address
        value: parseEther(ethAmount),
      });

      setTxState("confirming");
      setTxHash(tx);

      // Verifying blockchain registry and updating stats
      setTimeout(() => {
        setTxState("success");
        // Update local stats based on the purchase size
        setLiveCreditsRetired((prev) => prev + purchaseTons);
        setLiveCarbonReduced((prev) => prev + purchaseTons * 1000); // 1 credit ≈ 1000kg/1 Ton
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setTxState("idle");
      if (err.message?.includes("rejected") || err.message?.includes("User denied")) {
        showToast("Transaction was rejected by user.");
      } else {
        showToast("Transaction failed: " + (err.shortMessage || err.message || "Unknown error"));
      }
    }
  };

  const handleMockPurchase = () => {
    setTxState("submitting");
    showToast("Bypassing wallet: executing simulated transaction...");
    setTimeout(() => {
      setTxState("confirming");
      setTimeout(() => {
        setTxState("success");
        const hash = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setTxHash(hash);
        setLiveCreditsRetired((prev) => prev + purchaseTons);
        setLiveCarbonReduced((prev) => prev + purchaseTons * 1000);
      }, 2000);
    }, 1500);
  };

  // Calculations for purchase
  const purchaseCost = selectedProject ? selectedProject.price * purchaseTons : 0;
  const protocolFee = purchaseCost * 0.01; // 1% fee
  const totalCost = purchaseCost + protocolFee;

  return (
    <div className="flex-1 w-full bg-surface-container-lowest text-on-surface relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1D1F27] border border-success/35 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-success font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              info
            </span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[750px] flex items-center overflow-hidden px-6 lg:px-8 py-16 lg:py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 -left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border-slate">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-xs text-secondary uppercase tracking-widest font-semibold">
                Live: V2 Protocol Deployment
              </span>
            </div>
            <h1 className="font-headline-xl text-4xl sm:text-5xl lg:text-6xl max-w-xl leading-[1.1] font-extrabold tracking-tight">
              Turn Real <span className="brand-text-gradient">Climate Action</span> Into Digital Carbon Assets
            </h1>
            <p className="font-body-lg text-lg text-text-secondary max-w-lg leading-relaxed">
              Accelerate global net-zero goals through a high-integrity, transparent marketplace for tokenized carbon removals and biodiversity credits.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects-catalog"
                className="brand-gradient px-8 py-4 rounded-xl font-label-md text-sm text-on-primary font-bold shadow-2xl shadow-primary/20 hover:opacity-95 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                Browse Marketplace
              </a>
              <button className="bg-surface-container-high border border-border-slate px-8 py-4 rounded-xl font-label-md text-sm text-text-primary font-bold hover:bg-surface-container-highest transition-all hover:scale-[1.02] active:scale-[0.98]">
                Read Whitepaper
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
              <img
                alt="Climate Action"
                className="w-full aspect-video object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtV4S_07QtwadIHZDaOFEoTei5shIbToja_1TQdI43emNaEplXUOQmKdcQaJFB7DAYufWrRtMmEM2G-4-A3MMqO4wMsD1oqgZXDPKSlT34MA6ZZnLwxbwrFtn0ZR8vPCLHCZ9eDL0dpiHLuTe7BTJ1kG2LaW77KjSSlKmFaUYARk9539wdj1RTuqKviVSnUf3dR__cVmvxbbiF0ICFSNQO9WVObSlKXYONQqMFGnE7uayZDV3zrxZVaaSQJAzrwfPnlv7W5zW6m14"
              />
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-xs text-text-secondary">Global Impact Tracker</span>
                  <span className="font-label-sm text-xs text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    +12.4% vs Last Mo
                  </span>
                </div>
                <div className="h-24 w-full bg-surface-container-lowest/50 rounded-lg flex items-end gap-1.5 px-3 pb-3">
                  <div className="w-full bg-primary/40 rounded-t h-[40%] transition-all duration-500"></div>
                  <div className="w-full bg-primary/40 rounded-t h-[55%] transition-all duration-500"></div>
                  <div className="w-full bg-primary/40 rounded-t h-[45%] transition-all duration-500"></div>
                  <div className="w-full bg-primary/40 rounded-t h-[70%] transition-all duration-500"></div>
                  <div className="w-full bg-primary/40 rounded-t h-[60%] transition-all duration-500"></div>
                  <div className="w-full bg-primary/40 rounded-t h-[85%] transition-all duration-500"></div>
                  <div className="w-full bg-primary/70 rounded-t h-[95%] shadow-[0_0_10px_rgba(180,197,255,0.4)] transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-12 bg-surface-container-lowest border-y border-border-slate">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="font-label-sm text-xs text-text-secondary uppercase font-semibold">Total Credits Issued</p>
              <h3 className="font-headline-md text-2xl font-bold text-primary">
                {(liveCreditsIssued / 1000000).toFixed(4)}M TCO2e
              </h3>
            </div>
            <div className="space-y-1">
              <p className="font-label-sm text-xs text-text-secondary uppercase font-semibold">Credits Retired</p>
              <h3 className="font-headline-md text-2xl font-bold text-secondary">
                {(liveCreditsRetired / 1000000).toFixed(4)}M TCO2e
              </h3>
            </div>
            <div className="space-y-1">
              <p className="font-label-sm text-xs text-text-secondary uppercase font-semibold">Active Projects</p>
              <h3 className="font-headline-md text-2xl font-bold text-text-primary">142 Projects</h3>
            </div>
            <div className="space-y-1">
              <p className="font-label-sm text-xs text-text-secondary uppercase font-semibold">Carbon Reduced</p>
              <h3 className="font-headline-md text-2xl font-bold text-tertiary">
                {(liveCarbonReduced / 1000000000).toFixed(4)}B Tons
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Catalog */}
      <section id="projects-catalog" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="font-headline-lg text-3xl font-bold text-white">Carbon Projects Marketplace</h2>
            <p className="font-body-md text-sm text-text-secondary max-w-xl">
              Discover institutional-grade carbon offsets verified by satellite monitoring, AI analysis, and third-party validation registries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[200px] sm:min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-border-slate rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-white placeholder-text-secondary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white text-[16px] cursor-pointer"
                >
                  close
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-surface-container border border-border-slate rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-white cursor-pointer"
              >
                <option value="score-desc">Highest Climate Score</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px] pointer-events-none">
                unfold_more
              </span>
            </div>

            {/* Categories */}
            <div className="flex bg-surface-container rounded-xl p-1 border border-border-slate overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-surface-container-high text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Grid */}
        {filteredAndSortedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-slate rounded-2xl">
            <span className="material-symbols-outlined text-[48px] text-text-secondary mb-4">
              search_off
            </span>
            <h3 className="text-lg font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-sm text-text-secondary">
              Try adjusting your filters or search query to find carbon offset credits.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {filteredAndSortedProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                className="group glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 glow-hover flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={project.image}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-surface/85 backdrop-blur px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 font-semibold border border-white/5">
                        <span
                          className="material-symbols-outlined text-[14px] text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        Verified
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-surface-container-high/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold text-primary border border-primary/20">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="font-headline-md text-lg text-text-primary group-hover:text-primary transition-colors font-bold line-clamp-1">
                        {project.name}
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Project {project.projectNumber} • {project.location}
                      </p>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-4">
                  <div className="flex justify-between items-center py-3 border-y border-border-slate">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-text-secondary uppercase font-semibold">Price</p>
                      <p className="font-label-md text-base text-text-primary font-bold">
                        ${project.price.toFixed(2)}{" "}
                        <span className="text-text-secondary font-normal text-xs">/ Ton</span>
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[10px] text-text-secondary uppercase font-semibold">Climate Score</p>
                      <div className="px-2 py-0.5 rounded-full border border-secondary/35 text-secondary text-xs font-bold bg-secondary/5">
                        {project.score}/100
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyClick(project)}
                    className="w-full py-3 rounded-xl bg-surface-container-high border border-border-slate font-label-md text-sm text-text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 font-bold hover:scale-[1.02] cursor-pointer"
                  >
                    Buy Credit
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-16 flex justify-center">
          <button className="inline-flex items-center gap-2 text-primary font-label-md text-sm group cursor-pointer hover:underline font-bold">
            View All Projects
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="brand-gradient rounded-3xl p-12 md:p-20 relative overflow-hidden text-center md:text-left shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl text-on-primary font-extrabold tracking-tight">
                  Ready to Offset Your Footprint?
                </h2>
                <p className="font-body-lg text-base sm:text-lg text-on-primary/80 max-w-md leading-relaxed">
                  Join over 500+ enterprises and thousands of individuals using CarbonX to manage and retire their environmental footprint assets.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a
                    href="#projects-catalog"
                    className="bg-on-primary text-primary px-8 py-4 rounded-xl font-label-md text-sm font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all block text-center"
                  >
                    Get Started
                  </a>
                  <button className="border border-on-primary/30 text-on-primary px-8 py-4 rounded-xl font-label-md text-sm font-bold hover:bg-on-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Contact Sales
                  </button>
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <div className="w-full max-w-sm glass-card rounded-2xl p-6 border-on-primary/20 bg-on-primary/10 backdrop-blur-md">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                        <span className="material-symbols-outlined text-on-secondary">eco</span>
                      </div>
                      <span className="text-on-primary font-bold text-sm tracking-wide">Registry Verified</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-on-primary/20 rounded-full overflow-hidden">
                        <div className="h-2 w-3/4 bg-secondary rounded-full"></div>
                      </div>
                      <div className="h-2 w-full bg-on-primary/20 rounded-full overflow-hidden">
                        <div className="h-2 w-1/2 bg-secondary rounded-full"></div>
                      </div>
                      <div className="h-2 w-full bg-on-primary/20 rounded-full overflow-hidden">
                        <div className="h-2 w-5/6 bg-secondary rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-on-primary/60 text-xs italic leading-relaxed">
                      &ldquo;CarbonX provides the most granular data overlays for our compliance and ESG disclosure requirements.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide-over/Modal Purchase Credit Container */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (txState !== "submitting" && txState !== "confirming") {
                  setSelectedProject(null);
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl z-10 border border-border-slate flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-border-slate">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">shopping_cart</span>
                  Purchase Carbon Credits
                </h3>
                {(txState === "idle" || txState === "success") && (
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="material-symbols-outlined p-1 text-text-secondary hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    close
                  </button>
                )}
              </div>

              {txState === "idle" && (
                <div className="p-6 space-y-6 flex-grow">
                  {/* Selected Project Summary */}
                  <div className="flex gap-4 p-3 bg-surface-container/50 border border-border-slate rounded-xl">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        alt={selectedProject.name}
                        className="w-full h-full object-cover"
                        src={selectedProject.image}
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{selectedProject.name}</h4>
                      <p className="text-xs text-text-secondary truncate">
                        {selectedProject.location} • Price: ${selectedProject.price.toFixed(2)}/Ton
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[9px] uppercase font-bold text-secondary border border-secondary/35 rounded-full bg-secondary/5">
                          Score {selectedProject.score}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input Tons */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Quantity of Credits (Tons of CO2e)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={purchaseTons}
                        onChange={(e) => setPurchaseTons(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full px-4 py-3 bg-surface-container border border-border-slate rounded-xl text-sm focus:outline-none focus:border-primary text-white font-semibold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-secondary">
                        Tons
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      Each credit represents 1 metric ton of CO2 offset verified by satellite carbon mapping.
                    </p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-4 bg-surface-container-lowest/50 border border-border-slate rounded-xl space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary">Credits Cost ({purchaseTons} Tons)</span>
                      <span className="font-semibold text-white">${purchaseCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary">Registry Protocol Fee (1%)</span>
                      <span className="font-semibold text-white">${protocolFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-px bg-border-slate my-1"></div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-primary">Total Est. Cost</span>
                      <span className="text-white">${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleConfirmPurchase}
                    className="w-full py-4 rounded-xl brand-gradient font-label-md text-sm text-on-primary font-bold shadow-xl shadow-primary-container/10 hover:opacity-95 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">payments</span>
                    Confirm Purchase & Retire Credits
                  </button>

                  {/* Fallback Option */}
                  <div className="text-center mt-2.5">
                    <button
                      type="button"
                      onClick={handleMockPurchase}
                      className="text-xs text-text-secondary hover:text-white transition-colors underline cursor-pointer"
                    >
                      Bypass Wallet (Simulate Offline Purchase)
                    </button>
                  </div>
                </div>
              )}

              {(txState === "submitting" || txState === "confirming") && (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 flex-grow">
                  {/* Glowing Spinner */}
                  <div className="relative flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="absolute animate-pulse h-10 w-10 bg-primary/20 rounded-full"></div>
                  </div>

                  <div className="space-y-2 max-w-xs mx-auto">
                    <h4 className="text-base font-bold text-white">
                      {txState === "submitting" ? "Initiating Order Transaction" : "Verifying Carbon Registry"}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {txState === "submitting"
                        ? "Connecting to local ledger and reserving selected tokenized credits..."
                        : "Settling assets on-chain and registering retirement to climate vaults..."}
                    </p>
                  </div>
                </div>
              )}

              {txState === "success" && (
                <div className="p-8 text-center space-y-6 flex-grow">
                  {/* Success Indicator */}
                  <div className="mx-auto h-16 w-16 bg-secondary/15 rounded-full flex items-center justify-center border border-secondary/35 text-secondary shadow-[0_0_15px_rgba(74,225,118,0.2)]">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">Purchase Confirmed!</h4>
                    <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                      You have successfully purchased and retired <span className="text-secondary font-bold">{purchaseTons} Tons</span> of carbon offsets. An immutable certificate of retirement has been minted to your address.
                    </p>
                  </div>

                  {/* Tx Details */}
                  <div className="p-4 bg-surface-container/50 border border-border-slate rounded-xl text-left space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary font-semibold uppercase">Tx Hash</span>
                      <span className="font-mono text-primary select-all max-w-[180px] truncate">{txHash}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary font-semibold uppercase">Credits Retired</span>
                      <span className="text-white font-bold">{purchaseTons} Tons CO2e</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary font-semibold uppercase">Registry Registry</span>
                      <span className="text-secondary font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Verra V2 Verified
                      </span>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-full py-3 rounded-xl bg-surface-container-high border border-border-slate font-label-md text-sm text-text-primary hover:bg-surface-container-highest transition-all duration-300 font-bold cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
