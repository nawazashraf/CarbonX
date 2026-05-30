"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "@/hooks/projects/useProjects";

interface ProjectItem {
  _id: string;
  name: string;
  location: string;
  category: "Forestry" | "Energy" | "Ocean" | "Tech";
  developer: string;
  verified: boolean;
  creditsRequested: number;
  description: string;
  createdAt: string;
}

export default function ReviewDashboard() {
  const router = useRouter();
  const { data, isLoading, error } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");

  const pendingProjects = useMemo(() => {
    if (!data?.data && !Array.isArray(data)) return [];
    const list = Array.isArray(data) ? data : data.data || [];
    
    return list.filter((p: ProjectItem) => {
      const isUnverified = !p.verified;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.developer.toLowerCase().includes(searchQuery.toLowerCase());
      return isUnverified && matchesSearch;
    });
  }, [data, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface text-on-surface p-6 lg:p-8 flex flex-col items-center">
      <div className="max-w-[1200px] w-full space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-md text-3xl font-extrabold tracking-tight text-white mb-2">
              Registry Review Board
            </h1>
            <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Analyze pending environmental asset submissions, verify multispectral canopy logs, and issue carbon credit mint approvals.
            </p>
          </div>
          
          <div className="flex items-center bg-surface-container border border-outline rounded-xl px-3.5 py-2 focus-within:border-primary transition-colors w-full md:w-72">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
            <input
              className="bg-transparent border-none focus:outline-none text-xs w-full text-on-surface ml-2 placeholder:text-on-surface-variant"
              placeholder="Search pending reviews..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">policy</span>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Compliance Requirement</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              As an authorized CarbonX Registry Auditor, you are legally bound to verify the additionality, permanence, and double-counting prevention standards of each submission before approving credit issuance.
            </p>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-xs text-on-surface-variant animate-pulse font-bold tracking-widest uppercase">Loading pending audits...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30">
            <span className="material-symbols-outlined text-error text-4xl">error</span>
            <h3 className="text-lg font-bold text-white">Registry connection failure</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">Could not communicate with the backend ledger. Please verify your backend server status.</p>
          </div>
        ) : pendingProjects.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30">
            <span className="material-symbols-outlined text-success text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <h3 className="text-lg font-bold text-white">Review queue is clean</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">All projects have been processed. New submissions will automatically appear here once initiated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {pendingProjects.map((project: ProjectItem) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-graphite border border-[#2A2A2A] rounded-2xl p-6 hover:border-primary transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary tracking-widest">
                        {project.category}
                      </span>
                      <span className="text-[10px] text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning animate-ping"></span>
                        Unverified
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-3">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {project.location}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                        {project.description || "No project description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Credits Requested</p>
                        <p className="font-bold text-white mt-0.5">
                          {project.creditsRequested?.toLocaleString() || "Pending"} <span className="text-[10px] font-normal text-on-surface-variant">tCO2e</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Developer</p>
                        <p className="font-bold text-white mt-0.5 truncate max-w-40">{project.developer}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/projects/review/${project._id}`)}
                      className="w-full bg-primary text-on-primary-container font-extrabold text-xs py-3 rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
                    >
                      <span className="material-symbols-outlined text-sm">rate_review</span>
                      Conduct Verification Audit
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
