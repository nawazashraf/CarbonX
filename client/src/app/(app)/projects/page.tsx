"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectItem {
  id: string;
  name: string;
  location: string;
  status: "approved" | "pending" | "draft";
  credits: string;
  verificationDetail: string; // e.g. "98% Score" or "Tier 2 Audit" or "45% Completed"
  image: string;
  description: string;
  category: "Forestry" | "Energy" | "Ocean" | "Tech";
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    name: "Amazonia Reforestation",
    location: "Brazil, Pará Region",
    status: "approved",
    credits: "1.2M tCO2e",
    verificationDetail: "98% Score",
    category: "Forestry",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1eka-Uo3HgLTSctqczQh7SS2ViiR_3Qjm76_CRs4q6Os0h_x1xd0pddv-cTD-kR7FNR2dfCrkT6t23XJ6zjeFI8mqyIbQFufjHDivxO9LVOyWcRM11E5_RW81pifo7_3LHZCMV-7KeoxerbivHMrYdq4KQss5x-rxOGGRrkpGWbEHKCSBJFPuWjP5sUZm02si1NR9WIWkVX0tzH06SGwhKlIvGrlAlUHQMrWHrrZZ-ioSgC1mc7RtImumHWFCh9ZSF6zzLFiQwyg",
    description: "Aerial canopy reforestation in Pará region. High-trust carbon offsets verified by satellite imaging.",
  },
  {
    id: "proj-2",
    name: "Nordic Wind Cluster",
    location: "North Sea, Norway",
    status: "pending",
    credits: "840K tCO2e",
    verificationDetail: "Tier 2 Audit",
    category: "Energy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzIC5p-B4U2mNGqPEUVGEoy_-fDJcv96SnxGfV76i8-9cUhbyDcO57RQk-AOJLeU9rKyVChzw9MDiA169fgLTwXktNutidbqhKTx7JCZdxx3ZNCI3mODdKzsUeqwBiXKAyvBeq8b4P4C03Zf8MxXaJLZ_zNCnYSeb_1-uvNCXkygzyvkBPhmjNuo3ntj1Dfgayp8M04o9r0Lf-EQ-0eTBAtSbeskkfj0V29NICs0HxFdqAK8O7jyerXY0b88F-NVvdYlk_3pOnq1E",
    description: "Offshore wind farm cluster producing green electricity to offset grid reliance in northern Europe.",
  },
  {
    id: "proj-3",
    name: "Borneo Peatland",
    location: "Kalimantan, Indonesia",
    status: "draft",
    credits: "500K tCO2e",
    verificationDetail: "45%",
    category: "Forestry",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABHI_-PMKfWDhdwXK8BAnCy0NDTxxtbnMQvmHZAzG7KyZxjVhbm1b9Gqrz4PPsfL_bN6DkZOfAKJ9lttB5_nfUekp5ZB873eI7mdqKY1RF_Ferjb1jr4myC5zP6Olgn0OhkNhOwCRWtcobY0Sz_Xd_7kZ60dqpgwmZwqZJHwpQP0V2v70ibUe_2Jw9beAj7lPRR_e6mdfTpkeXgT-nJPA-E8Gql4-MEPFCt7DSEEYD-95eTB_u0he24rhueSwb-PcIzeTEBfVNCcw",
    description: "Swampland ecological preservation preventing degradation of ancient peat carbon reservoirs.",
  },
];

export default function ProjectsDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "approved" | "pending" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Submit Modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");
  const [newProjectCredits, setNewProjectCredits] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState<"Forestry" | "Energy" | "Ocean" | "Tech">("Forestry");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<"idle" | "uploading" | "auditing" | "success">("idle");

  // Selected Detail Slide-over
  const [viewingDetailProject, setViewingDetailProject] = useState<ProjectItem | null>(null);

  // Filtered Projects List
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesFilter = selectedFilter === "all" || p.status === selectedFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, selectedFilter, searchQuery]);

  // Compute average score dynamically from approved ones (or just static 92 + changes)
  const avgScore = useMemo(() => {
    const scoredProjects = projects.filter((p) => p.status === "approved");
    if (scoredProjects.length === 0) return 90;
    // Extract score number from "X% Score"
    const sum = scoredProjects.reduce((acc, p) => {
      const match = p.verificationDetail.match(/(\d+)%/);
      const val = match ? parseInt(match[1]) : 90;
      return acc + val;
    }, 0);
    return Math.round(sum / scoredProjects.length);
  }, [projects]);

  // Handle mock document upload click
  const handleUploadClick = () => {
    if (uploadedFiles.length === 0) {
      setUploadedFiles(["carbon_offsets_v2_manifest.pdf", "spatial_coordinates.geojson"]);
    } else {
      setUploadedFiles([]);
    }
  };

  // Submit project action
  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newProjectLocation || !newProjectCredits) return;

    setSubmitState("uploading");

    setTimeout(() => {
      setSubmitState("auditing");

      setTimeout(() => {
        setSubmitState("success");

        // Add new project dynamically to list
        const newItem: ProjectItem = {
          id: `proj-${Date.now()}`,
          name: newProjectName,
          location: newProjectLocation,
          status: "pending",
          credits: newProjectCredits + " tCO2e",
          verificationDetail: "Initial Assessment",
          category: newProjectCategory,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDY2KLYhYENQo6KhTBWpAXA7q2InYGY95Xvmf81-MDT2sgcFPPtpel29K8ylPwx9JaVDU8VJF4Vrm6kkvPi21K2mRfcemwhIb65aXALCPGnXvzG7m3u3g00kp5iFCg2j0P7fimn7AQhARLLXJdaRtPKlPXWEykqv3OuCWbV6BrLr0haEZ7GWZEGrVMw20QGCcuontEX86kmrLSsDUuTXP1ZhbIsW5Uzk7cFYy1A-aptovom_9OGGGf2PwlW-YWjRrSKDajI7HHU_YU",
          description: `Tokenized project submission for ${newProjectCategory.toLowerCase()} conservation offsets located in ${newProjectLocation}. Undergoing AI verification audits.`,
        };

        setProjects((prev) => [newItem, ...prev]);

        // Clean up input fields
        setNewProjectName("");
        setNewProjectLocation("");
        setNewProjectCredits("");
        setUploadedFiles([]);
      }, 2000);
    }, 1500);
  };

  // Close Modal safely
  const handleCloseModal = () => {
    setIsSubmitModalOpen(false);
    setSubmitState("idle");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-surface text-on-surface">
      
      {/* SubHeader / Controls for Search */}
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
        
        {/* SideNavBar (Sticky sidebar) */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-80px)] w-64 border-r border-outline bg-surface-container p-6 gap-6 sticky top-20">
          <div>
            <h2 className="font-headline-md text-lg font-bold text-on-surface">Project Filters</h2>
            <p className="text-xs text-on-surface-variant font-medium">Manage submissions</p>
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
              <span className="text-sm">Active / Approved</span>
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
              <span className="text-sm">Pending Validation</span>
            </button>

            <button
              onClick={() => setSelectedFilter("draft")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left cursor-pointer ${
                selectedFilter === "draft"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined">edit_note</span>
              <span className="text-sm">Drafts</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 flex flex-col gap-1 border-t border-outline">
            <a
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-white transition-all text-sm font-semibold"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span>Settings</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-white transition-all text-sm font-semibold"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span>Help Center</span>
            </a>
            <button className="mt-4 w-full border border-outline text-on-surface font-semibold text-xs py-2.5 rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer">
              Support Center
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="grow p-6 lg:p-8 overflow-y-auto">
          
          {/* Header Row */}
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline-md text-3xl font-extrabold tracking-tight text-on-surface mb-1">
                My Carbon Projects
              </h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Overview of your carbon credit validation and registry submissions.
              </p>
            </div>

            {/* In-page Controls (Right-aligned Search / New Project) */}
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
                New Project
              </button>
            </div>
          </header>

          {/* Project Filters Mobile Bar */}
          <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-outline">
            {["all", "approved", "pending", "draft"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface-container text-on-surface-variant hover:text-white"
                }`}
              >
                {filter === "all" ? "All Projects" : filter}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-outline rounded-2xl bg-surface-container-low/30 mb-8">
              <span className="material-symbols-outlined text-[48px] text-text-secondary mb-4">
                folder_open
              </span>
              <h3 className="text-lg font-bold text-white mb-1">No Projects Found</h3>
              <p className="text-sm text-text-secondary">
                No submissions match your active search or sidebar filter selection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setViewingDetailProject(project)}
                  className="bg-surface-graphite border border-[#2A2A2A] rounded-2xl overflow-hidden group hover:border-primary transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="h-40 overflow-hidden relative">
                      <img
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={project.image}
                      />
                      
                      {/* Status Badges */}
                      <div className="absolute top-4 right-4">
                        {project.status === "approved" && (
                          <span className="bg-success/20 text-success border border-success/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                            Approved
                          </span>
                        )}
                        {project.status === "pending" && (
                          <span className="bg-warning/20 text-warning border border-warning/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            Pending
                          </span>
                        )}
                        {project.status === "draft" && (
                          <span className="bg-surface-container-highest/60 text-on-surface-variant border border-outline px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px]">edit_note</span>
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-headline-md text-xl text-on-surface group-hover:text-primary transition-colors font-bold mb-1">
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
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                          {project.status === "approved"
                            ? "Verification"
                            : project.status === "pending"
                            ? "Review Stage"
                            : "Completion"}
                        </p>
                        <p
                          className={`font-bold text-sm mt-0.5 ${
                            project.status === "approved"
                              ? "text-secondary"
                              : project.status === "pending"
                              ? "text-warning"
                              : "text-primary"
                          }`}
                        >
                          {project.verificationDetail}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                          {project.status === "draft" ? "Estimated Credits" : "Credits Registry"}
                        </p>
                        <p className="text-on-surface font-bold text-sm mt-0.5">{project.credits}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload Zone / CTA Card */}
              <div
                onClick={() => router.push("/projects/new")}
                className="bg-surface-container-low border-2 border-dashed border-[#2A2A2A] rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
                  <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                </div>
                <h3 className="font-semibold text-sm text-on-surface mb-1">Submit New Project</h3>
                <p className="text-xs text-on-surface-variant text-center max-w-50">
                  Drag manifest files here or click to open project uploader
                </p>
              </div>
            </div>
          )}

          {/* Stats Bento Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Avg Verification Score Widget */}
            <div className="lg:col-span-2 glass-panel border border-outline rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-surface-container-highest"
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
                  <span className="font-headline-md text-2xl text-on-surface font-bold">{avgScore}</span>
                  <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Avg Score</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-headline-md text-xl font-bold mb-1">Institutional Health Index</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Your active validation portfolio maintains a high verification score. This places your organization in the top 5% of global high-trust registries.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Validated Credits</p>
                    <p className="font-headline-md text-lg font-bold">4.2M</p>
                  </div>
                  <div className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Active Audits</p>
                    <p className="font-headline-md text-lg font-bold">03</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Bento Block */}
            <div className="bg-primary-container p-6 rounded-2xl flex flex-col justify-between overflow-hidden relative group cursor-pointer shadow-lg shadow-primary-container/10">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 group-hover:scale-105 transition-transform">
                auto_graph
              </span>
              <div>
                <h4 className="text-on-primary-container font-headline-md text-xl font-bold mb-1">Market Insights</h4>
                <p className="text-on-primary-container/85 text-xs">Carbon credit index: +2.4% price hike this week</p>
              </div>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer w-full mt-6">
                View Analytics
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-lowest border-t border-outline">
        <div className="flex flex-col md:items-start items-center gap-1 text-center md:text-left">
          <span className="font-headline-md text-lg font-bold text-on-surface">CarbonX</span>
          <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} CarbonX Institutional Portal. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#">Terms of Service</a>
          <a className="text-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#">Compliance Docs</a>
          <a className="text-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#">Contact Support</a>
        </div>
      </footer>

      {/* New Project Registration Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl z-10 border border-outline"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-outline">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">cloud_upload</span>
                  Submit New Carbon Project
                </h3>
                {(submitState === "idle" || submitState === "success") && (
                  <button
                    onClick={handleCloseModal}
                    className="material-symbols-outlined p-1 text-on-surface-variant hover:text-white rounded-lg cursor-pointer"
                  >
                    close
                  </button>
                )}
              </div>

              {submitState === "idle" && (
                <form onSubmit={handleSubmitProject} className="p-6 space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Project Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazonia Basin Conservation"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-container border border-outline rounded-xl text-sm focus:outline-none focus:border-primary text-white"
                    />
                  </div>

                  {/* Location field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pará, Brazil"
                      value={newProjectLocation}
                      onChange={(e) => setNewProjectLocation(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-container border border-outline rounded-xl text-sm focus:outline-none focus:border-primary text-white"
                    />
                  </div>

                  {/* Credits field */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Est. Credits (tCO2e)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 500K"
                        value={newProjectCredits}
                        onChange={(e) => setNewProjectCredits(e.target.value)}
                        className="w-full px-4 py-2.5 bg-surface-container border border-outline rounded-xl text-sm focus:outline-none focus:border-primary text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Category
                      </label>
                      <select
                        value={newProjectCategory}
                        onChange={(e) => setNewProjectCategory(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-surface-container border border-outline rounded-xl text-sm focus:outline-none focus:border-primary text-white cursor-pointer"
                      >
                        <option value="Forestry">Forestry</option>
                        <option value="Energy">Energy</option>
                        <option value="Ocean">Ocean</option>
                        <option value="Tech">Tech</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload documents mock area */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Validation Documents
                    </label>
                    <div
                      onClick={handleUploadClick}
                      className="border-2 border-dashed border-outline hover:border-primary transition-colors rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-surface-container/30"
                    >
                      <span className="material-symbols-outlined text-primary text-[28px] mb-2">upload_file</span>
                      <p className="text-xs text-on-surface font-semibold">Click to mock upload docs</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">PDF, GEOJSON, shapefiles up to 20MB</p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="p-3 bg-success/5 border border-success/35 rounded-xl flex flex-col gap-1.5 mt-2">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-success">
                            <span className="flex items-center gap-1.5 truncate max-w-70">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              {file}
                            </span>
                            <span className="text-[10px] opacity-75 font-semibold">Verified</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl brand-gradient font-bold text-xs text-on-primary uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Register & Start AI Audit
                  </button>
                </form>
              )}

              {(submitState === "uploading" || submitState === "auditing") && (
                <div className="p-12 text-center space-y-6 grow">
                  <div className="relative flex items-center justify-center mx-auto">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="absolute animate-pulse h-10 w-10 bg-primary/20 rounded-full"></div>
                  </div>
                  <div className="space-y-2 max-w-xs mx-auto">
                    <h4 className="text-base font-bold text-white">
                      {submitState === "uploading" ? "Uploading Project Manifests" : "Initiating Satellite Audit"}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {submitState === "uploading"
                        ? "Encrypting files and uploading metadata logs to CarbonX Registry network..."
                        : "Querying historical biomass indices and running multi-spectral canopy audit..."}
                    </p>
                  </div>
                </div>
              )}

              {submitState === "success" && (
                <div className="p-8 text-center space-y-6 grow">
                  <div className="mx-auto h-16 w-16 bg-success/15 rounded-full flex items-center justify-center border border-success/35 text-success shadow-[0_0_15px_rgba(34,197,94,0.25)]">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">Project Submitted!</h4>
                    <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                      The carbon manifest for <span className="text-primary font-bold">{newProjectName}</span> has been processed and logged as a pending submission. Registry auditors have been assigned.
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="w-full py-3 rounded-xl bg-surface-container-high border border-outline font-bold text-xs text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selected Project Detailed Information Drawer */}
      <AnimatePresence>
        {viewingDetailProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingDetailProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            {/* Slide-over Content Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.95 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-md h-full bg-[#13141a] border-l border-outline shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                  {viewingDetailProject.category}
                </span>
                <button
                  onClick={() => setViewingDetailProject(null)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-white p-1 cursor-pointer"
                >
                  close
                </button>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <img
                  alt={viewingDetailProject.name}
                  className="w-full h-full object-cover"
                  src={viewingDetailProject.image}
                />
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{viewingDetailProject.name}</h2>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-4">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {viewingDetailProject.location}
              </p>

              <div className="h-px bg-outline mb-6"></div>

              <div className="space-y-6 grow">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {viewingDetailProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-4 rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Credits</p>
                    <p className="text-sm font-bold text-white mt-1">{viewingDetailProject.credits}</p>
                  </div>
                  <div className="bg-surface-container p-4 rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Status</p>
                    <p className="text-sm font-bold capitalize text-white mt-1 flex items-center gap-1.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          viewingDetailProject.status === "approved"
                            ? "bg-success"
                            : viewingDetailProject.status === "pending"
                            ? "bg-warning"
                            : "bg-primary"
                        }`}
                      ></span>
                      {viewingDetailProject.status}
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container p-4 rounded-xl border border-outline space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Validation History</h4>
                  <div className="relative pl-6 border-l border-outline space-y-4 text-xs">
                    <div className="relative">
                      <div className="absolute -left-7.5 top-0.5 bg-[#13141a] p-0.5 text-success">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      </div>
                      <p className="font-bold text-white">Registry Upload Logged</p>
                      <p className="text-[10px] text-on-surface-variant">Manifests validated successfully.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-7.5 top-0.5 bg-[#13141a] p-0.5 text-success">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      </div>
                      <p className="font-bold text-white">AI Canopy Audit Complete</p>
                      <p className="text-[10px] text-on-surface-variant">Estimated carbon stock is verified.</p>
                    </div>

                    <div className="relative">
                      <div
                        className={`absolute -left-7.5 top-0.5 bg-[#13141a] p-0.5 ${
                          viewingDetailProject.status === "approved" ? "text-success" : "text-warning animate-pulse"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {viewingDetailProject.status === "approved" ? "verified" : "hourglass_empty"}
                        </span>
                      </div>
                      <p className="font-bold text-white">
                        {viewingDetailProject.status === "approved" ? "Approved & Issued" : "Verification In Progress"}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {viewingDetailProject.status === "approved"
                          ? "Approved by Verra Registry."
                          : "Awaiting final third-party verification report."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-outline">
                <button
                  onClick={() => setViewingDetailProject(null)}
                  className="w-full py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high font-bold text-xs uppercase tracking-wider text-white border border-outline cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
