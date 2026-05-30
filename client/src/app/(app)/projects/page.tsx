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
  creditsApproved: number;
  availableCredits: number;
  climateScore: number;
  description: string;
  createdAt: string;
}

export default function ProjectsDashboard() {
  const router = useRouter();
  const { data, isLoading, error } = useProjects();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "approved" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const projectsList = useMemo(() => {
    if (!data?.data && !Array.isArray(data)) return [];
    return Array.isArray(data) ? data : data.data || [];
  }, [data]);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((p: ProjectItem) => {
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "approved" && p.verified) ||
        (selectedFilter === "pending" && !p.verified);

      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [projectsList, selectedFilter, searchQuery]);

  const avgScore = useMemo(() => {
    const scored = projectsList.filter((p: ProjectItem) => p.verified);
    if (scored.length === 0) return 92;
    const sum = scored.reduce((acc: number, p: ProjectItem) => acc + (p.climateScore || 90), 0);
    return Math.round(sum / scored.length);
  }, [projectsList]);

  // Category image fallbacks
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
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-surface text-on-surface">
      
      {/* Mobile search bar */}
      <div className="md:hidden flex p-4 border-b border-outline gap-2 bg-surface-container-low">
        <div className="flex flex-1 items-center bg-surface-container border border-outline rounded-lg px-3 py-1.5 focus-within:border-primary transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
          <input
            className="bg-transparent border-none focus:outline-none text-sm w-full text-on-surface ml-2 placeholder:text-on-surface-variant"
            placeholder="Search projects..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sticky sidebar */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-80px)] w-64 border-r border-outline bg-surface-container p-6 gap-6 sticky top-20">
          <div>
            <h2 className="font-headline-md text-lg font-bold text-white">Project Filters</h2>
            <p className="text-xs text-on-surface-variant font-medium">Manage registry assets</p>
          </div>

          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                folder
              </span>
              <span className="text-sm">All Projects</span>
            </button>

            <button
              onClick={() => setSelectedFilter("approved")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left cursor-pointer ${
                selectedFilter === "approved"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined">check_circle</span>
              <span className="text-sm">Verified &amp; Active</span>
            </button>

            <button
              onClick={() => setSelectedFilter("pending")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left cursor-pointer ${
                selectedFilter === "pending"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined">hourglass_empty</span>
              <span className="text-sm">Pending Verification</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 flex flex-col gap-2 border-t border-outline">
            <button
              onClick={() => router.push("/projects/review")}
              className="w-full bg-[#1e2029] border border-outline text-white font-bold text-xs py-3 rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">rate_review</span>
              Auditor Board
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="grow p-6 lg:p-8 overflow-y-auto">
          
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline-md text-3xl font-extrabold tracking-tight text-white mb-1">
                Carbon Projects Registry
              </h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Connect and manage institutional environmental assets and tokenized offsets.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="hidden md:flex items-center bg-surface-container border border-outline rounded-xl px-3.5 py-2 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
                <input
                  className="bg-transparent border-none focus:outline-none text-xs w-48 text-on-surface ml-2 placeholder:text-on-surface-variant"
                  placeholder="Search projects..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={() => router.push("/projects/new")}
                className="bg-primary text-on-primary-container font-extrabold text-xs px-5 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10 ml-auto md:ml-0"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Submit Project
              </button>
            </div>
          </header>

          {/* Mobile Filter Bar */}
          <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-outline">
            {["all", "approved", "pending"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface-container text-on-surface-variant hover:text-white"
                }`}
              >
                {filter === "all" ? "All Projects" : filter === "approved" ? "Verified" : "Pending"}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-xs text-on-surface-variant animate-pulse font-bold tracking-widest uppercase">Fetching registry logs...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30 mb-8">
              <span className="material-symbols-outlined text-error text-4xl">error</span>
              <h3 className="text-lg font-bold text-white">Registry offline</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">Could not resolve assets database. Ensure the backend Express server is running.</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-outline rounded-2xl bg-surface-container-low/30 mb-8">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">
                folder_open
              </span>
              <h3 className="text-lg font-bold text-white mb-1">No Assets Registered</h3>
              <p className="text-xs text-on-surface-variant">
                No project registry files match the active filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filteredProjects.map((project: ProjectItem) => (
                <div
                  key={project._id}
                  onClick={() => router.push(`/projects/${project._id}`)}
                  className="bg-surface-graphite border border-[#2A2A2A] rounded-2xl overflow-hidden group hover:border-primary transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="h-40 overflow-hidden relative bg-[#111]">
                      <img
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                        src={getCategoryImage(project.category)}
                      />
                      
                      <div className="absolute top-4 right-4">
                        {project.verified ? (
                          <span className="bg-success/20 text-success border border-success/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                            Verified
                          </span>
                        ) : (
                          <span className="bg-warning/20 text-warning border border-warning/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary tracking-widest inline-block mb-3">
                        {project.category}
                      </span>
                      <h3 className="font-headline-md text-xl text-white group-hover:text-primary transition-colors font-bold mb-1 line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {project.location}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline">
                      <div>
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">
                          {project.verified ? "Climate Score" : "Status"}
                        </p>
                        <p className={`font-bold text-sm mt-0.5 ${project.verified ? "text-secondary" : "text-warning"}`}>
                          {project.verified ? `${project.climateScore}% Compliance` : "In Progress"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">
                          {project.verified ? "Approved Credits" : "Requested Credits"}
                        </p>
                        <p className="text-white font-bold text-sm mt-0.5">
                          {(project.verified ? project.creditsApproved : project.creditsRequested)?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Submit Zone CTA Card */}
              <div
                onClick={() => router.push("/projects/new")}
                className="bg-surface-container-low border-2 border-dashed border-[#2A2A2A] rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary transition-colors cursor-pointer group min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                </div>
                <h3 className="font-semibold text-sm text-white mb-1">Submit New Asset</h3>
                <p className="text-xs text-on-surface-variant text-center max-w-[200px] leading-relaxed">
                  Log a new project to start verification registry workflow
                </p>
              </div>
            </div>
          )}

          {/* Bottom Bento Box Stats */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 glass-panel border border-outline rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-surface-container"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    className="text-secondary transition-all duration-1000"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeDasharray="351.85"
                    strokeDashoffset={351.85 - (351.85 * avgScore) / 100}
                    strokeWidth="8"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline-md text-2xl text-white font-bold">{avgScore}</span>
                  <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Avg Index</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-headline-md text-lg font-bold text-white mb-1">Institutional Health Index</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Reflects the cumulative compliance performance, additionality metrics, and transparency rating of all verified registry projects.
                  </p>
                </div>

                <div className="flex gap-6 text-xs">
                  <div>
                    <span className="text-on-surface-variant">Threshold standard:</span>
                    <span className="text-success font-bold ml-1.5">&gt; 85% HSL</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">Audit method:</span>
                    <span className="text-primary font-bold ml-1.5">Sattelite Multispectral</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel border border-outline rounded-2xl p-6 flex flex-col justify-between gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Registered Volume</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{projectsList.length}</span>
                  <span className="text-xs text-on-surface-variant font-semibold">Total Assets</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Verified Active:</span>
                  <span className="text-white font-bold">{projectsList.filter((p: ProjectItem) => p.verified).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Pending Audits:</span>
                  <span className="text-warning font-bold">{projectsList.filter((p: ProjectItem) => !p.verified).length}</span>
                </div>
              </div>
            </div>

          </section>
        </main>
      </div>

    </div>
  );
}
