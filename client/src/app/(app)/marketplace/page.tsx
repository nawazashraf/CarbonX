"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useListings } from "@/hooks/marketplace/useListings";
import { useBuyCredits } from "@/hooks/marketplace/useBuyCredits";
import { useOverview } from "@/hooks/analytics/useOverview";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";

interface ListingItem {
  _id: string;
  contractListingId: number;
  creditsListed: number;
  pricePerCredit: number;
  sellerWallet: string;
  project: {
    _id: string;
    name: string;
    location: string;
    category: "Forestry" | "Energy" | "Ocean" | "Tech";
    developer: string;
    climateScore: number;
    description: string;
  };
}

export default function Marketplace() {
  const { address } = useAccount();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("score-desc");
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  
  // Transaction flow states
  const [txState, setTxState] = useState<"idle" | "submitting" | "success">("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Queries & Mutations
  const { data, isLoading, error } = useListings();
  const { data: overview } = useOverview();
  const buyMutation = useBuyCredits();

  // Format list
  const listings: ListingItem[] = useMemo(() => {
    if (!data?.data && !Array.isArray(data)) return [];
    const rawList = Array.isArray(data) ? data : data.data || [];
    
    return rawList.map((item: any) => ({
      _id: item._id,
      contractListingId: item.contractListingId,
      creditsListed: item.creditsListed,
      pricePerCredit: item.pricePerCredit,
      sellerWallet: item.sellerWallet,
      project: item.project || {
        _id: "",
        name: "Legacy Offset Registry",
        location: "Global",
        category: "Forestry",
        developer: "CarbonX Core",
        climateScore: 85,
        description: "Verified carbon reduction offset unit."
      }
    }));
  }, [data]);

  // Live stats simulator
  const [liveReduced, setLiveReduced] = useState(2400150320);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveReduced((prev) => prev + Math.floor(Math.random() * 15) + 5);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const totalCredits = overview?.totalCreditsMinted || 4200154;
  const totalRetired = overview?.totalCreditsRetired || 1804230;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (l) => l.project.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.project.name.toLowerCase().includes(q) ||
          l.project.location.toLowerCase().includes(q) ||
          l.sellerWallet.toLowerCase().includes(q),
      );
    }

    // Sort listings
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.pricePerCredit - b.pricePerCredit);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.pricePerCredit - a.pricePerCredit);
    } else if (sortBy === "score-desc") {
      result.sort((a, b) => b.project.climateScore - a.project.climateScore);
    }

    return result;
  }, [listings, selectedCategory, searchQuery, sortBy]);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(listings.map((l) => l.project.category)))];
  }, [listings]);

  const handleBuyClick = (listing: ListingItem) => {
    if (!address) {
      showToast("Please connect your Web3 wallet first.");
      return;
    }
    setSelectedListing(listing);
    setTxState("idle");
  };

  const handleConfirmPurchase = async () => {
    if (!selectedListing) return;
    setTxState("submitting");
    try {
      showToast("Step 1/2: Approving USDC & transferring credits on-chain...");
      const receipt = await buyMutation.mutateAsync(selectedListing);
      
      setTxHash(receipt.transactionHash);
      setTxState("success");
      showToast("Carbon credits successfully purchased and registered!");
    } catch (err: any) {
      showToast(err?.message || "Purchase failed or was rejected.");
      setTxState("idle");
    }
  };

  const getCategoryImage = (category: string) => {
    switch (category) {
      case "Forestry":
        return "https://lh3.googleusercontent.com/aida-public/AB6AXuC1eka-Uo3HgLTSctqczQh7SS2ViiR_3Qjm76_CRs4q6Os0h_x1xd0pddv-cTD-kR7FNR2dfCrkT6t23XJ6zjeFI8mqyIbQFufjHDivxO9LVOyWcRM11E5_RW81pifo7_3LHZCMV-7KeoxerbivHMrYdq4KQss5x-rxOGGRrkpGWbEHKCSBJFPuWjP5sUZm02si1NR9WIWkVX0tzH06SGwhKlIvGrlAlUHQMrWHrrZZ-ioSgC1mc7RtImumHWFCh9ZSF6zzLFiQwyg";
      case "Energy":
        return "https://lh3.googleusercontent.com/aida-public/AB6AXuDzIC5p-B4U2mNGqPEUVGEoy_-fDJcv96SnxGfV76i8-9cUhbyDcO57RQk-AOJLeU9rKyVChzw9MDiA169fgLTwXktNutidbqhKTx7JCZdxx3ZNCI3mODdKzsUeqwBiXKAyvBeq8b4P4C03Zf8MxXaJLZ_zNCnYSeb_1-uvNCXkygzyvkBPhmjNuo3ntj1Dfgayp8M04o9r0Lf-EQ-0eTBAtSbeskkfj0V29NICs0HxFdqAK8O7jyerXY0b88F-NVvdYlk_3pOnq1E";
      case "Ocean":
        return "https://lh3.googleusercontent.com/aida-public/AB6AXuABHI_-PMKfWDhdwXK8BAnCy0NDTxxtbnMQvmHZAzG7KyZxjVhbm1b9Gqrz4PPsfL_bN6DkZOfAKJ9lttB5_nfUekp5ZB873eI7mdqKY1RF_Ferjb1jr4myC5zP6Olgn0OhkNhOwCRWtcobY0Sz_Xd_7kZ60dqpgwmZwqZJHwpQP0V2v70ibUe_2Jw9beAj7lPRR_e6mdfTpkeXgT-nJPA-E8Gql4-MEPFCt7DSEEYD-95eTB_u0he24rhueSwb-PcIzeTEBfVNCcw";
      default:
        return "https://lh3.googleusercontent.com/aida-public/AB6AXuDY2KLYhYENQo6KhTBWpAXA7q2InYGY95Xvmf81-MDT2sgcFPPtpel29K8ylPwx9JaVDU8VJF4Vrm6kkvPi21K2mRfcemwhIb65aXALCPGnXvzG7m3u3g00kp5iFCg2j0P7fimn7AQhARLLXJdaRtPKlPXWEykqv3OuCWbV6BrLr0haEZ7GWZEGrVMw20QGCcuontEX86kmrLSsDUuTXP1ZhbIsW5Uzk7cFYy1A-aptovom_9OGGGf2PwlW-YWjRrSKDajI7HHU_YU";
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface text-on-surface pb-24">
      
      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1D1F27] border border-primary/30 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-white font-semibold text-xs tracking-wide"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">info</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero statistics */}
      <section className="relative overflow-hidden border-b border-outline/10 bg-radial-gradient py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-surface-container/30 backdrop-blur-md border border-[#2A2A2A] rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Credits Issued</span>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-3xl font-black text-white">{totalCredits.toLocaleString()}</span>
              <span className="text-xs text-on-surface-variant">tCO2</span>
            </div>
          </div>
          
          <div className="p-6 bg-surface-container/30 backdrop-blur-md border border-[#2A2A2A] rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Credits Retired</span>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-3xl font-black text-white">{totalRetired.toLocaleString()}</span>
              <span className="text-xs text-on-surface-variant">tCO2</span>
            </div>
          </div>

          <div className="p-6 bg-surface-container/30 backdrop-blur-md border border-[#2A2A2A] rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">CO2 Reduced</span>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-3xl font-black text-secondary">{liveReduced.toLocaleString()}</span>
              <span className="text-xs text-on-surface-variant">kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main catalog */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 space-y-8 text-left">
        
        {/* Header filters */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-headline-md font-black text-white">Marketplace Listings</h1>
            <p className="text-xs text-on-surface-variant mt-1">Invest in institutional-grade certified environmental assets.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="flex flex-1 lg:flex-initial items-center bg-surface-container border border-outline rounded-xl px-3.5 py-2 focus-within:border-primary transition-colors min-w-[240px]">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
              <input
                className="bg-transparent border-none focus:outline-none text-xs w-full text-on-surface ml-2 placeholder:text-on-surface-variant"
                placeholder="Search by project or seller..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container border border-outline rounded-xl px-4 py-2.5 text-xs text-white focus:border-primary transition-all outline-none appearance-none pr-8 cursor-pointer"
              >
                <option value="score-desc">Climate Score</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">
                expand_more
              </span>
            </div>
          </div>
        </header>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-outline/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-container/50 text-on-surface-variant hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-xs text-on-surface-variant animate-pulse font-bold tracking-widest uppercase">Fetching listings...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30">
            <span className="material-symbols-outlined text-error text-[48px]">error</span>
            <h3 className="text-lg font-bold text-white">Marketplace connection failure</h3>
            <p className="text-xs text-on-surface-variant">Ensure backend Express servers and blockchain clients are online.</p>
          </div>
        ) : filteredAndSortedListings.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30">
            <span className="material-symbols-outlined text-on-surface-variant text-[48px]">storefront</span>
            <h3 className="text-lg font-bold text-white">No active listings</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">No carbon asset listings match your filter selections at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-surface-graphite border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-[#111] overflow-hidden relative">
                    <img
                      alt={listing.project.name}
                      className="w-full h-full object-cover opacity-80"
                      src={getCategoryImage(listing.project.category)}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-success/20 text-success border border-success/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary tracking-widest inline-block mb-2">
                        {listing.project.category}
                      </span>
                      <h3 className="text-xl font-headline-md font-bold text-white line-clamp-1">{listing.project.name}</h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {listing.project.location}
                      </p>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {listing.project.description}
                    </p>

                    <div className="h-px bg-outline"></div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Seller Wallet</p>
                        <p className="font-mono text-primary mt-0.5 font-bold truncate max-w-36">{listing.sellerWallet}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Credits Listed</p>
                        <p className="text-white font-bold mt-0.5">{listing.creditsListed.toLocaleString()} tCO2e</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-surface-container-low border border-outline rounded-xl">
                    <div>
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold">Price per credit</p>
                      <p className="text-base font-black text-white mt-0.5">
                        ${listing.pricePerCredit.toFixed(2)}{" "}
                        <span className="text-[10px] text-on-surface-variant font-normal">USDC</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold">Total price</p>
                      <p className="text-base font-black text-secondary mt-0.5">
                        ${(listing.creditsListed * listing.pricePerCredit).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyClick(listing)}
                    className="w-full bg-primary text-on-primary-container py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    Buy Carbon Credits
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Purchase Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-surface-container border border-outline rounded-2xl p-6 shadow-2xl space-y-6 text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-lg font-bold text-white">Purchase Order</h3>
                <p className="text-xs text-on-surface-variant">Confirm environmental asset settlement details.</p>
              </div>
              {txState !== "submitting" && (
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-on-surface-variant hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>

            {txState === "idle" && (
              <div className="space-y-6">
                <div className="p-4 bg-surface-container-low border border-outline rounded-xl space-y-3 text-xs">
                  <div>
                    <span className="text-on-surface-variant font-medium">Project Name:</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedListing.project.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-on-surface-variant font-medium">Quantity:</span>
                      <p className="font-bold text-white mt-0.5">{selectedListing.creditsListed.toLocaleString()} tCO2e</p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-medium">Unit Price:</span>
                      <p className="font-bold text-white mt-0.5">${selectedListing.pricePerCredit.toFixed(2)} USDC</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low border border-outline rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-white">Total Order Value</span>
                  <span className="text-lg font-black text-secondary">
                    ${(selectedListing.creditsListed * selectedListing.pricePerCredit).toLocaleString()} USDC
                  </span>
                </div>

                <button
                  onClick={handleConfirmPurchase}
                  className="w-full bg-primary text-on-primary-container py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">payments</span>
                  Approve USDC &amp; Purchase
                </button>
              </div>
            )}

            {txState === "submitting" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-white">Verifying Transaction</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                    Executing smart contract exchange. Please sign the prompts in your connected wallet client.
                  </p>
                </div>
              </div>
            )}

            {txState === "success" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2 py-4">
                  <span className="material-symbols-outlined text-success text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <h4 className="text-lg font-bold text-white">Order Completed</h4>
                  <p className="text-xs text-on-surface-variant">The purchased offsets have been transferred to your address.</p>
                </div>

                <div className="p-4 bg-surface-container-low border border-outline rounded-xl space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Tx Hash:</span>
                    <span className="font-mono text-primary truncate max-w-48 font-bold select-all">{txHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Quantity Purchased:</span>
                    <span className="text-white font-bold">{selectedListing.creditsListed.toLocaleString()} tCO2e</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedListing(null)}
                  className="w-full bg-surface-container-high hover:bg-surface-container-highest border border-outline text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
