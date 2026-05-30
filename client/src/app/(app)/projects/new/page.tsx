"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
import { config } from "@/configs/wagmiConfig";
import { CARBON_TOKEN_ADDRESS } from "@/lib/contract";
import { carbonAbi } from "@/lib/abis/carbonAbi";
import { useCreateProject } from "@/hooks/projects/useCreateProject";

interface DocumentItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "analyzing" | "verified";
  type: "pdf" | "image" | "geojson" | "other";
}

export default function UnifiedNewProjectWizard() {
  const router = useRouter();

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  // Unified Step Tracking (1 = Details, 2 = Documents, 3 = Verification, 4 = Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const createProjectMutation = useCreateProject();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 State: Project Information (Initially empty)
  const [projectName, setProjectName] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [creditsRequested, setCreditsRequested] = useState<number | "">("");
  const [coordinates, setCoordinates] = useState("3.4653° S, 62.2159° W");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Step 2 State: Documents (Empty by default)
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3 State: AI Validation Audit
  const [verificationState, setVerificationState] = useState<
    "idle" | "running" | "success"
  >("idle");
  const [verificationProgress, setVerificationProgress] = useState(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Step 4 State: Success Overlay Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Step 1 Coordinate picking interaction
  const handleSelectOnMap = () => {
    const lat = (Math.random() * 5 + 1).toFixed(4);
    const lng = (Math.random() * 10 + 60).toFixed(4);
    const coords = `${lat}° S, ${lng}° W`;
    setCoordinates(coords);
    showToast(`New GPS coordinates locked: ${coords}`);
  };

  // Step 3 Audit Progress Animation simulation
  const startVerificationAudit = () => {
    setVerificationState("running");
    setVerificationProgress(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verificationState === "running") {
      interval = setInterval(() => {
        setVerificationProgress((prev) => {
          const next = prev + 5;
          if (next >= 100) {
            clearInterval(interval);
            setVerificationState("success");
            showToast("AI Verification Certificate Issued!");
            return 100;
          }
          return next;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [verificationState]);

  // Step 2 Document Uploader handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (fileList: FileList) => {
    const newDocs: DocumentItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      let docType: "pdf" | "image" | "geojson" | "other" = "other";
      if (file.name.endsWith(".pdf")) docType = "pdf";
      else if (file.name.match(/\.(png|jpg|jpeg|tiff|tif)$/i))
        docType = "image";
      else if (file.name.endsWith(".geojson") || file.name.endsWith(".json"))
        docType = "geojson";

      newDocs.push({
        id: `doc-${Date.now()}-${i}`,
        name: file.name,
        size: sizeStr,
        progress: 10,
        status: "uploading",
        type: docType,
      });
    }

    setDocs((prev) => [...prev, ...newDocs]);
    showToast(`Added ${fileList.length} files to upload queue`);
  };

  const handleDelete = (id: string, name: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    showToast(`Deleted ${name}`);
  };

  // Simulate progress of uploading files
  useEffect(() => {
    const interval = setInterval(() => {
      setDocs((prevDocs) =>
        prevDocs.map((doc) => {
          if (doc.status === "uploading") {
            const nextProgress = Math.min(doc.progress + 20, 100);
            if (nextProgress === 100) {
              return { ...doc, progress: 0, status: "analyzing" };
            }
            return { ...doc, progress: nextProgress };
          }
          if (doc.status === "analyzing") {
            const nextProgress = Math.min(doc.progress + 15, 100);
            if (nextProgress === 100) {
              return { ...doc, progress: 100, status: "verified" };
            }
            return { ...doc, progress: nextProgress };
          }
          return doc;
        }),
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!projectName || !organization || !category || !description || !creditsRequested) {
        showToast("Please fill in all details before continuing");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (docs.length === 0) {
        showToast("Please provide at least one evidence document");
        return;
      }
      const hasUnverified = docs.some((d) => d.status !== "verified");
      if (hasUnverified) {
        showToast("Please wait for all documents to finish verification scans");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (verificationState !== "success") {
        showToast(
          "Please run and complete the AI Verification Audit before continuing",
        );
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.push("/projects");
    } else {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex flex-col justify-between relative pb-28">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1D1F27] border border-success/35 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-success font-semibold text-sm"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col items-center justify-start py-8 px-6 max-w-[1280px] w-full mx-auto">
        {/* Unified Stepper Progress Bar */}
        <div className="w-full max-w-[800px] mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Step {currentStep} of 4
            </span>
            <span className="text-xs font-bold text-on-surface-variant">
              {currentStep === 1 && "Project Information"}
              {currentStep === 2 && "Evidence Uploads"}
              {currentStep === 3 && "Verification Audit"}
              {currentStep === 4 && "Review & Submit"}
            </span>
          </div>

          <div className="h-1.5 w-full bg-[#1e2029] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(180,197,255,0.3)]"
              style={{ width: `${currentStep * 25}%` }}
            ></div>
          </div>

          <div className="flex justify-between mt-3 px-1 text-[10px] font-bold uppercase tracking-wider">
            <span
              className={
                currentStep >= 1 ? "text-primary" : "text-on-surface-variant/40"
              }
            >
              Details
            </span>
            <span
              className={
                currentStep >= 2 ? "text-primary" : "text-on-surface-variant/40"
              }
            >
              Documents
            </span>
            <span
              className={
                currentStep >= 3 ? "text-primary" : "text-on-surface-variant/40"
              }
            >
              Verification
            </span>
            <span
              className={
                currentStep >= 4 ? "text-primary" : "text-on-surface-variant/40"
              }
            >
              Review
            </span>
          </div>
        </div>

        {/* Dynamic Wizard Steps Renderer */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            {/* STEP 1: Details */}
            {currentStep === 1 && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-[640px] bg-surface-container rounded-2xl border border-outline p-8 shadow-2xl space-y-6"
              >
                <header>
                  <h1 className="font-headline-md text-3xl font-extrabold tracking-tight text-white mb-2">
                    Project Information
                  </h1>
                  <p className="text-sm text-on-surface-variant">
                    Enter basic details to begin your environmental project
                    verification.
                  </p>
                </header>

                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === "name"
                        ? "text-primary"
                        : "text-on-surface-variant"
                        }`}
                      htmlFor="p-name"
                    >
                      Project Name
                    </label>
                    <input
                      id="p-name"
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g. Amazonia Reforestation Unit 4"
                      className="bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === "org"
                        ? "text-primary"
                        : "text-on-surface-variant"
                        }`}
                      htmlFor="p-org"
                    >
                      Organization
                    </label>
                    <input
                      id="p-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      onFocus={() => setFocusedField("org")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Environmental Partners Ltd."
                      className="bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${focusedField === "category"
                        ? "text-primary"
                        : "text-on-surface-variant"
                        }`}
                      htmlFor="p-cat"
                    >
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="p-cat"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        onFocus={() => setFocusedField("category")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full appearance-none bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer"
                      >
                        <option value="" disabled>Select project category</option>
                        <option value="Forestry">Reforestation &amp; Conservation</option>
                        <option value="Energy">Renewable Energy</option>
                        <option value="Tech">Waste Management</option>
                        <option value="Ocean">Blue Carbon</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label 
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                        focusedField === "description" ? "text-primary" : "text-on-surface-variant"
                      }`}
                      htmlFor="p-desc"
                    >
                      Description
                    </label>
                    <textarea
                      id="p-desc"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onFocus={() => setFocusedField("description")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Describe the ecological impact and scope..."
                      className="bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label 
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                        focusedField === "credits" ? "text-primary" : "text-on-surface-variant"
                      }`}
                      htmlFor="p-credits"
                    >
                      Credits Requested (tCO2e)
                    </label>
                    <input
                      id="p-credits"
                      type="number"
                      value={creditsRequested}
                      onChange={(e) => setCreditsRequested(e.target.value === "" ? "" : Number(e.target.value))}
                      onFocus={() => setFocusedField("credits")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g. 10000"
                      className="bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Location Coordinates
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectOnMap}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Select on Map
                      </button>
                    </div>

                    <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-outline group bg-[#111] shadow-inner">
                      <img
                        alt="Map placeholder"
                        className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:brightness-50 transition-all duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkNVS6TXOZBVSbjKze3qw19hdeUm1vGCQsvN5XWXuMpUl3XkDOX9KqsTVWT5Jdc1TgNhTPtS6bu6MWd1yNupVAjmIrn0WYI77b1ctIKCxLXJdNVM6okHvkecEaUvJ2Je_7z7h9RUQMOFoXZ-KHfjlV2yhkGdHw2IdRc2MhymZOlyZUWwCfIZqpj9XlnwK0jcZLpq0Lb45eqS3yoayLkZHgL2hyj1Gu_6lo9XNh2tjheaXtvjb2QE_W9eq82hBmuh8_zNjFVlsC9Kk"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative">
                          <span
                            className="material-symbols-outlined text-primary text-4xl animate-bounce"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            location_on
                          </span>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/50 rounded-full blur-sm"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-outline">
                        <span className="text-[10px] font-mono text-primary font-bold">
                          {coordinates}
                        </span>
                      </div>
                    </div>
                  </div>
                </div >
              </motion.div >
            )
}

{/* STEP 2: Evidence & Documents */ }
{
  currentStep === 2 && (
    <motion.div
      key="step-docs"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-[800px] space-y-6"
    >
      <div>
        <h1 className="font-headline-md text-3xl font-extrabold tracking-tight text-white mb-2">
          Evidence &amp; Documentation
        </h1>
        <p className="text-sm text-on-surface-variant">
          Provide the technical proofs, satellite imagery, and
          methodology compliance documents required for validation
          registry.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center min-h-[250px] transition-all duration-300 group cursor-pointer ${dragActive
          ? "border-primary bg-primary/5 shadow-2xl"
          : "border-outline bg-surface-container hover:border-primary/50"
          }`}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-14 h-14 rounded-full bg-surface-container-low border border-outline flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-primary text-[28px]">
            cloud_upload
          </span>
        </div>
        <h3 className="font-headline-md text-lg font-bold mb-1 text-center">
          Drag &amp; drop files here
        </h3>
        <p className="text-[11px] text-on-surface-variant text-center max-w-[400px] mb-4 leading-relaxed">
          Support for PDF, GeoJSON, PNG, and TIFF. Individual files
          should not exceed 100MB.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary text-on-primary-container px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-95 transition-all cursor-pointer"
        >
          Select Files
        </button>
      </div>

      {/* Files list */}
      {docs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Uploaded Documents ({docs.length})
          </h4>

          <div className="space-y-3">
            <AnimatePresence>
              {docs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-surface-container border border-outline rounded-2xl p-4 flex items-center gap-4 shadow-sm overflow-hidden"
                >
                  <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-outline">
                    <span className="material-symbols-outlined text-primary">
                      {doc.type === "pdf"
                        ? "description"
                        : doc.type === "image"
                          ? "image"
                          : "map"}
                    </span>
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1 gap-2">
                      <span className="text-xs font-bold truncate text-white">
                        {doc.name}
                      </span>
                      {doc.status === "verified" && (
                        <span className="text-success text-xs font-bold flex items-center gap-1 shrink-0">
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            check_circle
                          </span>
                          Verified
                        </span>
                      )}
                      {doc.status === "analyzing" && (
                        <span className="text-warning text-xs font-bold flex items-center gap-1 shrink-0">
                          <span className="material-symbols-outlined text-[16px] animate-spin">
                            sync
                          </span>
                          Analyzing...
                        </span>
                      )}
                      {doc.status === "uploading" && (
                        <span className="text-primary text-xs font-bold shrink-0 animate-pulse">
                          Uploading {doc.progress}%
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${doc.status === "verified"
                          ? "bg-success w-full"
                          : doc.status === "analyzing"
                            ? "bg-primary w-[75%] animate-pulse"
                            : "bg-primary"
                          }`}
                        style={
                          doc.status === "uploading"
                            ? { width: `${doc.progress}%` }
                            : {}
                        }
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors p-1 rounded-lg cursor-pointer"
                  >
                    delete
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  )
}

{/* STEP 3: Verification Audit */ }
{
  currentStep === 3 && (
    <motion.div
      key="step-verify"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-[800px] space-y-6"
    >
      <div>
        <h1 className="font-headline-md text-3xl font-extrabold tracking-tight text-white mb-2">
          AI Validation Audit
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Run multispectral scanning on satellite mapping coordinate
          logs to initiate registry validation.
        </p>
      </div>

      <div className="bg-surface-container border border-outline p-8 rounded-2xl text-center space-y-6">
        {verificationState === "idle" && (
          <div className="space-y-6 py-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20">
              <span className="material-symbols-outlined text-[40px]">
                shield_heart
              </span>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">
                Ready for AI Satellite Audit
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Verify coordinates{" "}
                <span className="font-mono text-primary font-bold">
                  {coordinates}
                </span>{" "}
                and uploaded documentation layers against
                international canopy registries.
              </p>
            </div>
            <button
              onClick={startVerificationAudit}
              className="bg-primary text-on-primary-container px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                verified_user
              </span>
              Launch Registry Audit
            </button>
          </div>
        )}

        {verificationState === "running" && (
          <div className="space-y-6 py-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary"></div>
              <div className="absolute font-bold text-xs text-primary">
                {verificationProgress}%
              </div>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">
                Scanning Multispectral Layers
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed animate-pulse">
                Verifying vegetation indexes, matching canopy history,
                and locking blocks...
              </p>
            </div>
          </div>
        )}

        {verificationState === "success" && (
          <div className="space-y-6 py-4">
            <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mx-auto text-success border border-success/35 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <span
                className="material-symbols-outlined text-[40px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-extrabold text-white">
                AI Integrity Verification Passed
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Validation report successfully generated and logged in
                block ledger. Estimated carbon score matches standard
                compliance thresholds.
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl border border-outline text-left space-y-3 max-w-sm mx-auto">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">
                  Ledger Hash:
                </span>
                <span className="font-mono text-primary font-bold">
                  0x8aF...20bF
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">
                  Estimated Score:
                </span>
                <span className="text-success font-bold">
                  96% Compliance
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">
                  Status:
                </span>
                <span className="bg-warning/20 text-warning px-2.5 py-0.5 rounded text-[10px] font-bold">
                  Pending Registry Signature
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

{/* STEP 4: Review Summary */ }
{
  currentStep === 4 && (
    <motion.div
      key="step-review"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left"
    >
      {/* Left columns */}
      <div className="lg:col-span-8 space-y-6">
        {/* Overview Card */}
        <section className="bg-surface-container border border-outline rounded-2xl p-6 space-y-4">
          <h2 className="font-headline-md text-xl font-bold text-white tracking-tight">
            Project Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                Project Name
              </p>
              <p className="text-sm font-semibold text-white">
                {projectName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                Registry ID
              </p>
              <p className="text-sm font-mono text-primary font-bold">
                VER-BR-2024-882
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                Organization
              </p>
              <p className="text-sm text-white">
                {organization || "Not specified"}
              </p>
            </div>
          </div>
        </section>

        {/* Impact metrics Card */}
        <section className="bg-surface-container border border-outline rounded-2xl p-6 space-y-4">
          <h2 className="font-headline-md text-xl font-bold text-white tracking-tight">
            Impact Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline space-y-1">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Est. CO2 Offset
              </p>
              <p className="text-xl font-black text-primary">
                12,500{" "}
                <span className="text-xs font-semibold text-on-surface-variant">
                  tCO2e/yr
                </span>
              </p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline space-y-1">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Species Diversity
              </p>
              <p className="text-xl font-black text-tertiary">
                42{" "}
                <span className="text-xs font-semibold text-on-surface-variant">
                  Native
                </span>
              </p>
            </div>
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline space-y-1">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Local Jobs
              </p>
              <p className="text-xl font-black text-success">
                120{" "}
                <span className="text-xs font-semibold text-on-surface-variant">
                  FTEs
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Uploaded verified documents review */}
        <section className="bg-surface-container border border-outline rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-md text-xl font-bold text-white tracking-tight">
              Documents
            </h2>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-primary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                edit
              </span>
              Edit
            </button>
          </div>

          <div className="space-y-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    {doc.type === "pdf"
                      ? "description"
                      : doc.type === "image"
                        ? "image"
                        : "map"}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {doc.name}
                  </span>
                </div>
                <span className="text-success text-xs font-bold flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Verified
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar Readiness Assessment */}
      <div className="lg:col-span-4 bg-surface-container border border-outline rounded-2xl p-6 space-y-6">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
          Verification Readiness
        </h3>

        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-[#2A2A2A]"
              cx="80"
              cy="80"
              fill="transparent"
              r="70"
              stroke="currentColor"
              strokeWidth="10"
            ></circle>
            <circle
              className="text-primary transition-all duration-1000"
              cx="80"
              cy="80"
              fill="transparent"
              r="70"
              stroke="currentColor"
              strokeDasharray="439.82"
              strokeDashoffset="65.97"
              strokeLinecap="round"
              strokeWidth="10"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">
              85
            </span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Of 100
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-2.5 text-xs text-success font-semibold">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span>High-resolution satellite data provided</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-success font-semibold">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span>Additionality criteria met</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-warning font-semibold">
            <span className="material-symbols-outlined text-[18px]">
              info
            </span>
            <span>Financial audits pending review</span>
          </div>
        </div>

        <button
          onClick={async () => {
            if (!address) {
              showToast("Please connect your Web3 wallet first.");
              return;
            }
            setIsSubmitting(true);
            try {
              showToast("Step 1/2: Creating project on-chain...");
              const txHash = await writeContractAsync({
                address: CARBON_TOKEN_ADDRESS,
                abi: carbonAbi,
                functionName: "createProject",
                args: [projectName, coordinates, BigInt(creditsRequested)],
              });

              showToast("Step 2/2: Confirming blockchain transaction...");
              const receipt = await waitForTransactionReceipt(config, {
                hash: txHash,
              });

              showToast("Reading project count from contract...");
              const count = await readContract(config, {
                address: CARBON_TOKEN_ADDRESS,
                abi: carbonAbi,
                functionName: "projectCount",
              });

              const contractProjectId = Number(count);

              showToast("Synchronizing with registry database...");
              await createProjectMutation.mutateAsync({
                name: projectName,
                description,
                location: coordinates,
                category,
                developer: organization,
                ownerWallet: address.toLowerCase(),
                creditsRequested: Number(creditsRequested),
                contractProjectId,
              });
              setShowSuccessModal(true);
            } catch (err: any) {
              showToast(err?.message || err?.response?.data?.message || "Failed to submit project to registry.");
            } finally {
              setIsSubmitting(false);
            }
          }}
          disabled={isSubmitting}
          className="w-full bg-primary text-on-primary-container py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-primary/10 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              Submitting to Registry...
            </>
          ) : (
            "Submit for Certification"
          )}
        </button>

        <p className="text-center text-[10px] text-on-surface-variant leading-relaxed">
          By submitting, you agree to the CarbonX Institutional
          Compliance standards.
        </p>
      </div>
    </motion.div>
  )
}
          </AnimatePresence >
        </div >
      </main >

  {/* Global Unified Action Footer */ }
  < div className = "fixed bottom-0 left-0 w-full bg-surface/85 backdrop-blur-md border-t border-outline px-6 py-5 z-40" >
    <div className="max-w-[800px] mx-auto flex justify-between items-center">
      <button
        onClick={handleBack}
        className="text-on-surface-variant hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Back
      </button>

      <div className="flex gap-3">
        <button
          onClick={() =>
            showToast("Progress saved to draft registry dashboard")
          }
          className="px-5 py-2.5 rounded-xl border border-[#2a2a2a] hover:bg-[#1a1a1a] text-on-surface-variant hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          Save Draft
        </button>

        {currentStep < 4 && (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary-container hover:opacity-95 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
          >
            Continue
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        )}
      </div>
    </div>
      </div >

  {/* Success Modal Overlay */ }
  <AnimatePresence>
{
  showSuccessModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      ></motion.div>

      {/* Modal Body */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-[550px] bg-surface-container border border-outline rounded-2xl p-8 text-center shadow-2xl overflow-hidden"
      >
        <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/35 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <svg
            className="w-10 h-10 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></motion.path>
          </svg>
        </div>

        <h2 className="font-headline-md text-2xl font-extrabold text-white mb-2">
          Project Submitted Successfully
        </h2>

        <p className="text-xs text-on-surface-variant leading-relaxed mb-6 max-w-sm mx-auto">
          Your submission has been logged and queued for technical
          verification. You will receive an automated update once the
          first phase is complete.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-container-high p-4 rounded-xl border border-outline">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
              Submission ID
            </p>
            <p className="font-mono text-primary font-bold text-sm">
              CX-9928
            </p>
          </div>
          <div className="bg-[#282a32] p-4 rounded-xl border border-outline">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
              Est. Review Time
            </p>
            <p className="font-bold text-white text-sm">
              4-6 Business Days
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/projects")}
            className="flex-grow flex-1 bg-[#1e2029] border border-outline py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white hover:bg-outline transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              showToast("Tracking active submission state...");
              setTimeout(() => {
                router.push("/projects");
              }, 1000);
            }}
            className="flex-grow flex-1 bg-primary text-on-primary-container py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/10"
          >
            Track Progress
          </button>
        </div>
      </motion.div>
    </div>
  )
}
      </AnimatePresence >
    </div >
  );
}
