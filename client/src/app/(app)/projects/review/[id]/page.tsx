"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/api/projects";
import { useVerifyProject } from "@/hooks/verification/useVerifyProject";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConductAuditPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: projectResponse, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });

  const project = projectResponse?.data || projectResponse;

  const [approvedCredits, setApprovedCredits] = useState<number | "">("");
  const [remarks, setRemarks] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const verifyMutation = useVerifyProject();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvedCredits || Number(approvedCredits) <= 0) {
      showToast("Please enter a valid credit approval amount.");
      return;
    }
    if (!remarks.trim()) {
      showToast("Please enter verification audit remarks.");
      return;
    }

    try {
      await verifyMutation.mutateAsync({
        id,
        payload: {
          approvedCredits: Number(approvedCredits),
          remarks,
        },
      });
      showToast("Project successfully verified and registry logs updated.");
      setTimeout(() => {
        router.push("/projects/review");
      }, 1500);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to submit verification audit.");
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
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1D1F27] border border-success/35 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-success font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">info</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1000px] w-full space-y-8 text-left">
        
        {/* Back navigation */}
        <button
          onClick={() => router.push("/projects/review")}
          className="text-on-surface-variant hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Review Board
        </button>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-xs text-on-surface-variant animate-pulse font-bold tracking-widest uppercase">Loading project logs...</p>
          </div>
        ) : error || !project ? (
          <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30">
            <span className="material-symbols-outlined text-error text-4xl">error</span>
            <h3 className="text-lg font-bold text-white">Project not found</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">Could not resolve the specified project details from the registry database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Project Details Panel */}
            <div className="lg:col-span-7 space-y-6">
              <section className="bg-surface-container border border-outline rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {project.category}
                  </span>
                  <span className="text-[10px] text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                    Pending Verification
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{project.name}</h2>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {project.location}
                  </p>
                </div>

                <div className="h-px bg-outline"></div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Developer</h4>
                    <p className="text-sm font-semibold text-white">{project.developer}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Owner Wallet</h4>
                    <p className="text-sm font-mono text-primary font-bold break-all">{project.ownerWallet}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">Description</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {project.description || "No project description provided."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Technical Registry Data */}
              <section className="bg-surface-container border border-outline rounded-2xl p-6 space-y-4">
                <h3 className="font-headline-md text-base font-bold text-white">Registry Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Credits Requested</p>
                    <p className="text-lg font-black text-white mt-1">
                      {project.creditsRequested?.toLocaleString() || 0} <span className="text-xs font-normal text-on-surface-variant">tCO2e</span>
                    </p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Climate Score</p>
                    <p className="text-lg font-black text-secondary mt-1">
                      {project.climateScore || "N/A"}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Audit Verification Form */}
            <div className="lg:col-span-5 bg-surface-container border border-outline rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-headline-md text-lg font-bold text-white mb-1">Verification Audit</h3>
                <p className="text-xs text-on-surface-variant">Issue regulatory signature and set approved asset limits.</p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="approved-credits" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Approved Carbon Credits (tCO2e)
                  </label>
                  <div className="relative">
                    <input
                      id="approved-credits"
                      type="number"
                      placeholder={`e.g. ${project.creditsRequested}`}
                      value={approvedCredits}
                      onChange={(e) => setApprovedCredits(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setApprovedCredits(project.creditsRequested)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded hover:bg-primary/20 transition-all"
                    >
                      Use Max
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="audit-remarks" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Audit Remarks & Details
                  </label>
                  <textarea
                    id="audit-remarks"
                    rows={4}
                    placeholder="Provide details regarding the canopy index validation and audit checklist compliance..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={verifyMutation.isPending}
                    className="w-full bg-primary text-on-primary-container py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        Publishing Signature...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Publish Audit Approval
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="text-[10px] text-on-surface-variant leading-relaxed text-center">
                Approving this project will allow the asset owner to mint on-chain carbon tokens up to the approved threshold.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
