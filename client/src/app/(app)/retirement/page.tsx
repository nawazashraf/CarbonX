"use client";

import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useRetirements } from "@/hooks/retirement/useRetirements";
import { useRetireCredits } from "@/hooks/retirement/useRetireCredits";
import { useProjects } from "@/hooks/projects/useProjects";

interface RetirementItem {
  _id: string;
  project: {
    _id: string;
    name: string;
    location: string;
    category: string;
  };
  ownerWallet: string;
  creditsRetired: number;
  reason: string;
  txHash: string;
  certificateId: string;
  createdAt: string;
}

export default function RetirementPage() {
  const { address } = useAccount();
  const walletAddress = address ? address.toLowerCase() : "";

  // Queries
  const { data: retirementsResponse, isLoading: isRetirementsLoading } = useRetirements(walletAddress);
  const { data: projectsResponse, isLoading: isProjectsLoading } = useProjects();
  const retireMutation = useRetireCredits();

  // State
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [creditsToRetire, setCreditsToRetire] = useState<number | "">("");
  const [reason, setReason] = useState("Corporate Carbon Offset");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<RetirementItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatted data
  const retirements: RetirementItem[] = useMemo(() => {
    if (!retirementsResponse?.data && !Array.isArray(retirementsResponse)) return [];
    return Array.isArray(retirementsResponse) ? retirementsResponse : retirementsResponse.data || [];
  }, [retirementsResponse]);

  const projects = useMemo(() => {
    if (!projectsResponse?.data && !Array.isArray(projectsResponse)) return [];
    const list = Array.isArray(projectsResponse) ? projectsResponse : projectsResponse.data || [];
    // Only allow verified projects with available credits to be retired
    return list.filter((p: any) => p.verified && p.availableCredits > 0);
  }, [projectsResponse]);

  const selectedProject = useMemo(() => {
    return projects.find((p: any) => p._id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRetireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      showToast("Please connect your Web3 wallet first.");
      return;
    }
    if (!selectedProjectId) {
      showToast("Please select a carbon project to retire from.");
      return;
    }
    if (!creditsToRetire || Number(creditsToRetire) <= 0) {
      showToast("Please enter a valid credit quantity.");
      return;
    }
    if (selectedProject && Number(creditsToRetire) > selectedProject.availableCredits) {
      showToast(`Cannot retire more than available: ${selectedProject.availableCredits} tCO2e`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate/Generate on-chain txHash for local registry validation
      const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      
      await retireMutation.mutateAsync({
        projectId: selectedProjectId,
        ownerWallet: walletAddress,
        creditsRetired: Number(creditsToRetire),
        reason,
        txHash: mockTxHash,
      });

      showToast("Carbon credits successfully retired and certificate generated!");
      setSelectedProjectId("");
      setCreditsToRetire("");
      setReason("Corporate Carbon Offset");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to process carbon credit retirement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface text-on-surface p-6 lg:p-8 flex flex-col items-center pb-24">
      
      {/* Toast Alert */}
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

      <div className="max-w-[1100px] w-full space-y-8 text-left">
        
        <div>
          <h1 className="text-3xl font-headline-md font-black text-white">Credit Retirement Vault</h1>
          <p className="text-xs text-on-surface-variant mt-1">Permanently burn carbon offsets from circulation to claim environmental credits.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Section */}
          <div className="lg:col-span-5 bg-surface-container border border-outline rounded-2xl p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="font-headline-md text-lg font-bold text-white mb-1">Retire Carbon Credits</h3>
              <p className="text-xs text-on-surface-variant">Lock carbon offsets permanently out of market circulation.</p>
            </div>

            {!address ? (
              <div className="p-6 bg-surface-container-low border border-outline rounded-xl text-center space-y-3">
                <span className="material-symbols-outlined text-warning text-3xl">account_balance_wallet</span>
                <h4 className="text-sm font-bold text-white">Wallet Connection Required</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Connect your Web3 wallet address to retrieve ownable assets and verify retirement signatures.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRetireSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Select Carbon Project
                  </label>
                  {isProjectsLoading ? (
                    <div className="text-xs text-on-surface-variant animate-pulse py-2">Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className="p-3 bg-surface-container-low border border-outline rounded-xl text-xs text-on-surface-variant">
                      No active carbon assets with available balances found.
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-xs text-white focus:border-primary transition-all outline-none appearance-none pr-8 cursor-pointer font-bold"
                      >
                        <option value="">Select project</option>
                        {projects.map((p: any) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.availableCredits?.toLocaleString()} tCO2)
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                        expand_more
                      </span>
                    </div>
                  )}
                </div>

                {selectedProject && (
                  <div className="p-3.5 bg-surface-container-low border border-outline rounded-xl text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant font-medium">Category:</span>
                      <span className="text-white font-semibold">{selectedProject.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant font-medium">Available Balance:</span>
                      <span className="text-primary font-bold">{selectedProject.availableCredits?.toLocaleString()} tCO2e</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Credits to Retire (tCO2e)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={creditsToRetire}
                      onChange={(e) => setCreditsToRetire(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-xs text-white focus:border-primary transition-all outline-none"
                    />
                    {selectedProject && (
                      <button
                        type="button"
                        onClick={() => setCreditsToRetire(selectedProject.availableCredits)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded hover:bg-primary/20 transition-all"
                      >
                        Max
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Retirement Reason / Beneficiary
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Q4 Offset Certification"
                    className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-xs text-white focus:border-primary transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedProjectId}
                  className="w-full bg-primary text-on-primary-container py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                      Retiring Credits...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">energy_savings_leaf</span>
                      Retire Credits
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: List of Retirements */}
          <div className="lg:col-span-7 bg-surface-container border border-outline rounded-2xl p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="font-headline-md text-lg font-bold text-white mb-1">Retirement Ledger</h3>
              <p className="text-xs text-on-surface-variant">Cryptographic records of retired environmental assets.</p>
            </div>

            {!address ? (
              <div className="py-20 text-center border border-dashed border-outline rounded-xl bg-surface-container-low/30 text-xs text-on-surface-variant">
                Connect wallet to inspect personal certificate vault.
              </div>
            ) : isRetirementsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-xs text-on-surface-variant animate-pulse font-bold uppercase tracking-wider">Loading certificate records...</p>
              </div>
            ) : retirements.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-outline rounded-xl bg-surface-container-low/30 text-xs text-on-surface-variant">
                No credits have been retired under this wallet.
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {retirements.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-surface-container-low border border-outline rounded-xl flex items-center justify-between gap-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.project?.name || "Registry Asset"}</h4>
                      <div className="flex flex-wrap gap-2 text-[10px] text-on-surface-variant mt-1">
                        <span className="font-mono truncate max-w-32">Tx: {item.txHash}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">{item.reason}</p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <div>
                        <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Retired</p>
                        <p className="text-sm font-black text-white">{item.creditsRetired.toLocaleString()} tCO2</p>
                      </div>
                      <button
                        onClick={() => setSelectedCertificate(item)}
                        className="bg-white/5 border border-outline hover:bg-white/10 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Certificate Viewer Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-[#14151B] border border-outline rounded-3xl p-8 shadow-2xl relative space-y-6 text-center"
          >
            {/* Validation badge */}
            <div className="absolute top-6 right-6 flex items-center gap-1 bg-success/20 text-success border border-success/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">verified</span>
              Verified
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-black text-primary tracking-widest uppercase">Certificate of Retirement</h2>
              <p className="text-[10px] text-on-surface-variant font-semibold tracking-wider uppercase">CarbonX Cryptographic Protocol</p>
            </div>

            <div className="h-px bg-outline/20"></div>

            <div className="space-y-6 py-4">
              <div className="space-y-1">
                <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">This certifies that</span>
                <p className="text-sm font-black text-white truncate max-w-xs mx-auto">{selectedCertificate.ownerWallet}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">has permanently retired</span>
                <p className="text-3xl font-black text-white">{selectedCertificate.creditsRetired.toLocaleString()} Metric Tons CO2e</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">originating from project registry logs of</span>
                <p className="text-sm font-bold text-white">{selectedCertificate.project?.name || "Registry Asset"}</p>
                <p className="text-[10px] text-on-surface-variant">{selectedCertificate.project?.location || "Global Registry"}</p>
              </div>
            </div>

            <div className="h-px bg-outline/20"></div>

            <div className="grid grid-cols-2 gap-4 text-left text-[9px] text-on-surface-variant font-mono">
              <div>
                <span>SERIAL NUMBER:</span>
                <p className="text-white font-bold truncate max-w-40 mt-0.5">{selectedCertificate.certificateId}</p>
              </div>
              <div className="text-right">
                <span>DATE RECORDED:</span>
                <p className="text-white font-bold mt-0.5">{new Date(selectedCertificate.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCertificate(null)}
              className="w-full bg-surface-container border border-outline hover:bg-surface-container-high text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Done & Close
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
