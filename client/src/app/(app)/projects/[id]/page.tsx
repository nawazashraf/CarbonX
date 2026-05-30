// "use client";

// import React, { useState, use } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useAccount, useWriteContract } from "wagmi";
// import { waitForTransactionReceipt } from "@wagmi/core";
// import { config } from "@/configs/wagmiConfig";
// import { CARBON_TOKEN_ADDRESS } from "@/lib/contract";
// import { carbonAbi } from "@/lib/abis/carbonAbi";
// import { getProject } from "@/api/projects";
// import { useMintCredits } from "@/hooks/credits/useMintCredits";
// import { useCreateListing } from "@/hooks/marketplace/useCreateListing";

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export default function ProjectDetailsPage({ params }: PageProps) {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const { id } = use(params);
//   const { address } = useAccount();

//   const { data: projectResponse, isLoading, error } = useQuery({
//     queryKey: ["project", id],
//     queryFn: () => getProject(id),
//   });

//   const project = projectResponse?.data || projectResponse;

//   const { writeContractAsync } = useWriteContract();
//   const mintMutation = useMintCredits();
//   const listMutation = useCreateListing();

//   // State
//   const [toastMessage, setToastMessage] = useState<string | null>(null);
//   const [isMintingOnChain, setIsMintingOnChain] = useState(false);
//   const [isListModalOpen, setIsListModalOpen] = useState(false);
//   const [creditsToList, setCreditsToList] = useState<number | "">("");
//   const [pricePerCredit, setPricePerCredit] = useState<number | "">("");

//   const showToast = (msg: string) => {
//     setToastMessage(msg);
//     setTimeout(() => {
//       setToastMessage(null);
//     }, 4000);
//   };

//   const handleMintCredits = async () => {
//     if (!address) {
//       showToast("Please connect your Web3 wallet first.");
//       return;
//     }
//     if (!project) return;

//     setIsMintingOnChain(true);
//     try {
//       showToast("Step 1/2: Submitting mint request to blockchain...");
//       // CarbonX Smart Contract verifyProject is the on-chain minting trigger
//       const contractId = project.contractProjectId || Math.floor(Math.random() * 1000) + 1;
//       const txHash = await writeContractAsync({
//         address: CARBON_TOKEN_ADDRESS,
//         abi: carbonAbi,
//         functionName: "verifyProject",
//         args: [BigInt(contractId), BigInt(project.creditsApproved)],
//       });

//       showToast("Step 2/2: Confirming transaction receipt...");
//       const receipt = await waitForTransactionReceipt(config, {
//         hash: txHash,
//       });

//       showToast("Syncing with carbon registry database...");
//       await mintMutation.mutateAsync({
//         projectId: project._id,
//         txHash: receipt.transactionHash,
//       });

//       showToast("Credits successfully minted onto your Web3 address!");
//       queryClient.invalidateQueries({ queryKey: ["project", id] });
//     } catch (err: any) {
//       showToast(err?.message || "Failed to mint carbon credits.");
//     } finally {
//       setIsMintingOnChain(false);
//     }
//   };

//   const handleListCreditsSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!address) {
//       showToast("Please connect your Web3 wallet first.");
//       return;
//     }
//     if (!creditsToList || Number(creditsToList) <= 0) {
//       showToast("Please enter a valid credit quantity.");
//       return;
//     }
//     if (Number(creditsToList) > project.availableCredits) {
//       showToast(`Cannot list more than the available balance: ${project.availableCredits}`);
//       return;
//     }
//     if (!pricePerCredit || Number(pricePerCredit) <= 0) {
//       showToast("Please enter a valid price per credit.");
//       return;
//     }

//     try {
//       setIsListModalOpen(false);
//       showToast("Step 1/3: Approving CarbonToken marketplace allowance...");

//       await listMutation.mutateAsync({
//         projectId: project._id,
//         creditsListed: Number(creditsToList),
//         pricePerCredit: Number(pricePerCredit),
//       });

//       showToast("Credits listed successfully on CarbonX Marketplace!");
//       setCreditsToList("");
//       setPricePerCredit("");
//       queryClient.invalidateQueries({ queryKey: ["project", id] });
//     } catch (err: any) {
//       showToast(err?.message || "Failed to list credits on marketplace.");
//     }
//   };

//   const getCategoryImage = (category: string) => {
//     switch (category) {
//       case "Forestry":
//         return "https://lh3.googleusercontent.com/aida-public/AB6AXuC1eka-Uo3HgLTSctqczQh7SS2ViiR_3Qjm76_CRs4q6Os0h_x1xd0pddv-cTD-kR7FNR2dfCrkT6t23XJ6zjeFI8mqyIbQFufjHDivxO9LVOyWcRM11E5_RW81pifo7_3LHZCMV-7KeoxerbivHMrYdq4KQss5x-rxOGGRrkpGWbEHKCSBJFPuWjP5sUZm02si1NR9WIWkVX0tzH06SGwhKlIvGrlAlUHQMrWHrrZZ-ioSgC1mc7RtImumHWFCh9ZSF6zzLFiQwyg";
//       case "Energy":
//         return "https://lh3.googleusercontent.com/aida-public/AB6AXuDzIC5p-B4U2mNGqPEUVGEoy_-fDJcv96SnxGfV76i8-9cUhbyDcO57RQk-AOJLeU9rKyVChzw9MDiA169fgLTwXktNutidbqhKTx7JCZdxx3ZNCI3mODdKzsUeqwBiXKAyvBeq8b4P4C03Zf8MxXaJLZ_zNCnYSeb_1-uvNCXkygzyvkBPhmjNuo3ntj1Dfgayp8M04o9r0Lf-EQ-0eTBAtSbeskkfj0V29NICs0HxFdqAK8O7jyerXY0b88F-NVvdYlk_3pOnq1E";
//       case "Ocean":
//         return "https://lh3.googleusercontent.com/aida-public/AB6AXuABHI_-PMKfWDhdwXK8BAnCy0NDTxxtbnMQvmHZAzG7KyZxjVhbm1b9Gqrz4PPsfL_bN6DkZOfAKJ9lttB5_nfUekp5ZB873eI7mdqKY1RF_Ferjb1jr4myC5zP6Olgn0OhkNhOwCRWtcobY0Sz_Xd_7kZ60dqpgwmZwqZJHwpQP0V2v70ibUe_2Jw9beAj7lPRR_e6mdfTpkeXgT-nJPA-E8Gql4-MEPFCt7DSEEYD-95eTB_u0he24rhueSwb-PcIzeTEBfVNCcw";
//       default:
//         return "https://lh3.googleusercontent.com/aida-public/AB6AXuDY2KLYhYENQo6KhTBWpAXA7q2InYGY95Xvmf81-MDT2sgcFPPtpel29K8ylPwx9JaVDU8VJF4Vrm6kkvPi21K2mRfcemwhIb65aXALCPGnXvzG7m3u3g00kp5iFCg2j0P7fimn7AQhARLLXJdaRtPKlPXWEykqv3OuCWbV6BrLr0haEZ7GWZEGrVMw20QGCcuontEX86kmrLSsDUuTXP1ZhbIsW5Uzk7cFYy1A-aptovom_9OGGGf2PwlW-YWjRrSKDajI7HHU_YU";
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-80px)] bg-surface text-on-surface p-6 lg:p-8 flex flex-col items-center pb-24">

//       {/* Toast popup */}
//       <AnimatePresence>
//         {toastMessage && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1D1F27] border border-primary/30 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-white font-semibold text-xs tracking-wide"
//           >
//             <span className="material-symbols-outlined text-[18px] text-primary">info</span>
//             {toastMessage}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="max-w-[1100px] w-full space-y-8 text-left">

//         {/* Back button */}
//         <button
//           onClick={() => router.push("/projects")}
//           className="text-on-surface-variant hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
//         >
//           <span className="material-symbols-outlined text-[18px]">arrow_back</span>
//           Back to Projects Registry
//         </button>

//         {isLoading ? (
//           <div className="py-24 flex flex-col items-center justify-center space-y-4">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             <p className="text-xs text-on-surface-variant animate-pulse font-bold tracking-widest uppercase">Fetching asset logs...</p>
//           </div>
//         ) : error || !project ? (
//           <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30">
//             <span className="material-symbols-outlined text-error text-[48px]">error</span>
//             <h3 className="text-lg font-bold text-white">Project not found</h3>
//             <p className="text-xs text-on-surface-variant">Ensure this project has been recorded in the database registry.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

//             {/* Left Content Column */}
//             <div className="lg:col-span-8 space-y-6">

//               {/* Image banner */}
//               <div className="h-64 rounded-2xl overflow-hidden relative bg-[#111] border border-outline shadow-xl">
//                 <img
//                   alt={project.name}
//                   className="w-full h-full object-cover opacity-75"
//                   src={getCategoryImage(project.category)}
//                 />

//                 <div className="absolute top-6 right-6">
//                   {project.verified ? (
//                     <span className="bg-success/20 text-success border border-success/30 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
//                       <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
//                         check_circle
//                       </span>
//                       Verified &amp; Certified
//                     </span>
//                   ) : (
//                     <span className="bg-warning/20 text-warning border border-warning/30 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
//                       <span className="material-symbols-outlined text-[16px]">schedule</span>
//                       Awaiting Registry Review
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Main project header info */}
//               <section className="bg-surface-container border border-outline rounded-2xl p-8 space-y-4 shadow-sm">
//                 <div className="flex justify-between items-start gap-4">
//                   <div>
//                     <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary tracking-widest inline-block mb-3">
//                       {project.category}
//                     </span>
//                     <h1 className="text-3xl font-headline-md font-black text-white leading-tight">
//                       {project.name}
//                     </h1>
//                     <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
//                       <span className="material-symbols-outlined text-[16px]">location_on</span>
//                       {project.location}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="h-px bg-outline my-6"></div>

//                 <div className="space-y-6 text-xs text-on-surface-variant leading-relaxed">
//                   <div>
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1.5">Developer</h4>
//                     <p className="text-sm font-semibold text-white">{project.developer}</p>
//                   </div>

//                   <div>
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1.5">Owner Address</h4>
//                     <p className="text-sm font-mono text-primary font-bold break-all">{project.ownerWallet}</p>
//                   </div>

//                   <div>
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Ecological Overview</h4>
//                     <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
//                       {project.description || "No project overview details have been declared."}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//             </div>

//             {/* Right Action Column */}
//             <div className="lg:col-span-4 space-y-6">

//               {/* Asset Management Widget */}
//               <section className="bg-surface-container border border-outline rounded-2xl p-6 space-y-6 shadow-sm">
//                 <div>
//                   <h3 className="font-headline-md text-lg font-bold text-white mb-1">Asset Control Center</h3>
//                   <p className="text-xs text-on-surface-variant font-medium">Token minting and listing manager.</p>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
//                     <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Climate Score Index</p>
//                     <p className="text-2xl font-black text-secondary mt-1">
//                       {project.climateScore || "Pending Verification"}
//                     </p>
//                   </div>

//                   <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
//                     <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Available Credits</p>
//                     <p className="text-2xl font-black text-white mt-1">
//                       {project.availableCredits?.toLocaleString() || 0} <span className="text-xs font-normal text-on-surface-variant">tCO2e</span>
//                     </p>
//                   </div>

//                   {project.verified && (
//                     <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
//                       <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Credits Approved</p>
//                       <p className="text-2xl font-black text-white mt-1">
//                         {project.creditsApproved?.toLocaleString() || 0} <span className="text-xs font-normal text-on-surface-variant">tCO2e</span>
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* State-based actions */}
//                 <div className="pt-2">
//                   {!project.verified ? (
//                     <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl text-center space-y-2">
//                       <span className="material-symbols-outlined text-warning text-xl">hourglass_empty</span>
//                       <p className="text-[11px] text-on-surface-variant leading-relaxed">
//                         This environmental asset is undergoing auditing. On-chain credit mint actions will activate once registry signature is published.
//                       </p>
//                     </div>
//                   ) : project.availableCredits === 0 ? (
//                     <button
//                       onClick={handleMintCredits}
//                       disabled={isMintingOnChain || mintMutation.isPending}
//                       className="w-full bg-primary text-on-primary-container py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
//                     >
//                       {isMintingOnChain || mintMutation.isPending ? (
//                         <>
//                           <span className="material-symbols-outlined text-sm animate-spin">sync</span>
//                           Minting On-Chain Tokens...
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined text-sm">token</span>
//                           Mint Approved Credits
//                         </>
//                       )}
//                     </button>
//                   ) : (
//                     <div className="space-y-3">
//                       <button
//                         onClick={() => setIsListModalOpen(true)}
//                         className="w-full bg-secondary text-on-secondary-container py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-secondary/10 flex items-center justify-center gap-2"
//                       >
//                         <span className="material-symbols-outlined text-sm">sell</span>
//                         List Credits on Marketplace
//                       </button>
//                       <p className="text-[10px] text-on-surface-variant text-center font-medium leading-relaxed">
//                         You can fractionalize and sell your verified credits on the open Web3 marketplace.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </section>

//             </div>

//           </div>
//         )}

//       </div>

//       {/* List Credits Modal */}
//       {isListModalOpen && project && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="w-full max-w-md bg-surface-container border border-outline rounded-2xl p-6 shadow-2xl space-y-6 text-left"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="font-headline-md text-lg font-bold text-white">List Credits</h3>
//                 <p className="text-xs text-on-surface-variant">Publish credits to the open carbon market.</p>
//               </div>
//               <button
//                 onClick={() => setIsListModalOpen(false)}
//                 className="text-on-surface-variant hover:text-white cursor-pointer"
//               >
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             </div>

//             <form onSubmit={handleListCreditsSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
//                   Credits to List (tCO2e)
//                 </label>
//                 <input
//                   type="number"
//                   placeholder={`Max: ${project.availableCredits}`}
//                   value={creditsToList}
//                   onChange={(e) => setCreditsToList(e.target.value === "" ? "" : Number(e.target.value))}
//                   className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
//                   Price per Credit (USDC)
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="e.g. 15"
//                   value={pricePerCredit}
//                   onChange={(e) => setPricePerCredit(e.target.value === "" ? "" : Number(e.target.value))}
//                   className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={listMutation.isPending}
//                 className="w-full bg-secondary text-on-secondary-container py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 mt-4"
//               >
//                 {listMutation.isPending ? (
//                   <>
//                     <span className="material-symbols-outlined text-sm animate-spin">sync</span>
//                     Approving &amp; Listing...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-symbols-outlined text-sm">sell</span>
//                     Publish Market Listing
//                   </>
//                 )}
//               </button>
//             </form>
//           </motion.div>
//         </div>
//       )}

//     </div>
//   );
// }

"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getProject } from "@/api/projects";
import { useMintCredits } from "@/hooks/credits/useMintCredits";
import { useCreateListing } from "@/hooks/marketplace/useCreateListing";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = use(params);
  const { address } = useAccount();

  const {
    data: projectResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });

  const project = projectResponse?.data || projectResponse;

  // ─── Removed: useWriteContract, waitForTransactionReceipt, config, carbonAbi,
  //     CARBON_TOKEN_ADDRESS — none of these belong in the user-facing mint flow.
  //     verifyProject() carries `onlyOwner` in CarbonX.sol. Any non-owner wallet
  //     causes an EVM revert during gas estimation, which surfaces as "exceeds gas
  //     limit". The admin backend must call verifyProject() server-side (using the
  //     deployer private key) and store the resulting txHash on the project record.

  const mintMutation = useMintCredits();
  const listMutation = useCreateListing();

  // ── State ──────────────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [creditsToList, setCreditsToList] = useState<number | "">("");
  const [pricePerCredit, setPricePerCredit] = useState<number | "">("");

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ── Sync handler (DB only — no on-chain call) ──────────────────────────────
  //
  //  verifyProject() is onlyOwner and is called by the admin/backend wallet when
  //  an auditor approves a project. By the time `verified` is true in the UI the
  //  tokens are already in the project owner's wallet on-chain. This handler
  //  simply tells the backend to surface those credits as "available" in the DB
  //  so the listing flow can proceed.
  const handleSyncCredits = async () => {
    if (!address) {
      showToast("Please connect your Web3 wallet first.");
      return;
    }
    if (!project) return;

    setIsSyncing(true);
    try {
      showToast("Syncing verified credits with registry database...");

      await mintMutation.mutateAsync({
        projectId: project._id,
        // The admin stored this txHash when verifyProject() was called on-chain.
        // Adjust the field name to match your actual project schema if needed.
        txHash: project.mintTxHash ?? "",
      });

      showToast("Credits successfully synced to your account!");
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sync carbon credits.";
      showToast(message);
    } finally {
      setIsSyncing(false);
    }
  };

  // ── List handler ───────────────────────────────────────────────────────────
  //
  //  listCredits() in CarbonMarketplace.sol is NOT onlyOwner — the user wallet
  //  can call it freely. The contract pulls tokens via transferFrom so the user
  //  must first approve the marketplace address. That approval should be handled
  //  inside useCreateListing before it calls listCredits().
  const handleListCreditsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      showToast("Please connect your Web3 wallet first.");
      return;
    }
    if (!creditsToList || Number(creditsToList) <= 0) {
      showToast("Please enter a valid credit quantity.");
      return;
    }
    if (Number(creditsToList) > project.availableCredits) {
      showToast(
        `Cannot list more than the available balance: ${project.availableCredits}`,
      );
      return;
    }
    if (!pricePerCredit || Number(pricePerCredit) <= 0) {
      showToast("Please enter a valid price per credit.");
      return;
    }

    try {
      setIsListModalOpen(false);
      showToast("Step 1/2: Approving CarbonToken marketplace allowance...");

      await listMutation.mutateAsync({
        projectId: project._id,
        creditsListed: Number(creditsToList),
        pricePerCredit: Number(pricePerCredit),
      });

      showToast("Credits listed successfully on CarbonX Marketplace!");
      setCreditsToList("");
      setPricePerCredit("");
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to list credits on marketplace.";
      showToast(message);
    }
  };

  // ── Category image ─────────────────────────────────────────────────────────
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

  // ── Derived UI state ───────────────────────────────────────────────────────
  //
  //  Three distinct states drive the action area:
  //    1. !verified                    → pending audit notice
  //    2. verified + availableCredits === 0 → "Sync Credits" (DB sync only)
  //    3. verified + availableCredits > 0  → "List Credits" (on-chain listing)
  const isVerified = Boolean(project?.verified);
  const hasAvailableCredits = (project?.availableCredits ?? 0) > 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface text-on-surface p-6 lg:p-8 flex flex-col items-center pb-24">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1D1F27] border border-primary/30 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-white font-semibold text-xs tracking-wide"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              info
            </span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1100px] w-full space-y-8 text-left">
        {/* Back */}
        <button
          onClick={() => router.push("/projects")}
          className="text-on-surface-variant hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to Projects Registry
        </button>

        {/* Loading */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="text-xs text-on-surface-variant animate-pulse font-bold tracking-widest uppercase">
              Fetching asset logs...
            </p>
          </div>
        ) : error || !project ? (
          <div className="py-20 text-center space-y-4 border border-outline border-dashed rounded-2xl bg-surface-container-low/30">
            <span className="material-symbols-outlined text-error text-[48px]">
              error
            </span>
            <h3 className="text-lg font-bold text-white">Project not found</h3>
            <p className="text-xs text-on-surface-variant">
              Ensure this project has been recorded in the database registry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Left column ──────────────────────────────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Banner image */}
              <div className="h-64 rounded-2xl overflow-hidden relative bg-[#111] border border-outline shadow-xl">
                <img
                  alt={project.name}
                  className="w-full h-full object-cover opacity-75"
                  src={getCategoryImage(project.category)}
                />
                <div className="absolute top-6 right-6">
                  {isVerified ? (
                    <span className="bg-success/20 text-success border border-success/30 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      Verified &amp; Certified
                    </span>
                  ) : (
                    <span className="bg-warning/20 text-warning border border-warning/30 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      Awaiting Registry Review
                    </span>
                  )}
                </div>
              </div>

              {/* Project header */}
              <section className="bg-surface-container border border-outline rounded-2xl p-8 space-y-4 shadow-sm">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary tracking-widest inline-block mb-3">
                      {project.category}
                    </span>
                    <h1 className="text-3xl font-headline-md font-black text-white leading-tight">
                      {project.name}
                    </h1>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-[16px]">
                        location_on
                      </span>
                      {project.location}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-outline my-6" />

                <div className="space-y-6 text-xs text-on-surface-variant leading-relaxed">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1.5">
                      Developer
                    </h4>
                    <p className="text-sm font-semibold text-white">
                      {project.developer}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1.5">
                      Owner Address
                    </h4>
                    <p className="text-sm font-mono text-primary font-bold break-all">
                      {project.ownerWallet}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      Ecological Overview
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                      {project.description ||
                        "No project overview details have been declared."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* ── Right column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-6">
              <section className="bg-surface-container border border-outline rounded-2xl p-6 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-white mb-1">
                    Asset Control Center
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Token minting and listing manager.
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      Climate Score Index
                    </p>
                    <p className="text-2xl font-black text-secondary mt-1">
                      {project.climateScore || "Pending Verification"}
                    </p>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      Available Credits
                    </p>
                    <p className="text-2xl font-black text-white mt-1">
                      {(project.availableCredits ?? 0).toLocaleString()}{" "}
                      <span className="text-xs font-normal text-on-surface-variant">
                        tCO2e
                      </span>
                    </p>
                  </div>

                  {isVerified && (
                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                        Credits Approved
                      </p>
                      <p className="text-2xl font-black text-white mt-1">
                        {(project.creditsApproved ?? 0).toLocaleString()}{" "}
                        <span className="text-xs font-normal text-on-surface-variant">
                          tCO2e
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Action area ──────────────────────────────────────────── */}
                <div className="pt-2">
                  {/* State 1: awaiting admin verification */}
                  {!isVerified && (
                    <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl text-center space-y-2">
                      <span className="material-symbols-outlined text-warning text-xl">
                        hourglass_empty
                      </span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        This environmental asset is undergoing auditing. The
                        admin registry will mint on-chain credits once the
                        verification signature is published.
                      </p>
                    </div>
                  )}

                  {/* State 2: verified, credits not yet surfaced in DB */}
                  {isVerified && !hasAvailableCredits && (
                    <div className="space-y-3">
                      <button
                        onClick={handleSyncCredits}
                        disabled={isSyncing || mintMutation.isPending}
                        className="w-full bg-primary text-on-primary-container py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSyncing || mintMutation.isPending ? (
                          <>
                            <span className="material-symbols-outlined text-sm animate-spin">
                              sync
                            </span>
                            Syncing Registry...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">
                              token
                            </span>
                            Sync Approved Credits
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-on-surface-variant text-center font-medium leading-relaxed">
                        Credits were minted on-chain when the registry verified
                        your project. This syncs that balance to your account.
                      </p>
                    </div>
                  )}

                  {/* State 3: credits ready to list */}
                  {isVerified && hasAvailableCredits && (
                    <div className="space-y-3">
                      <button
                        onClick={() => setIsListModalOpen(true)}
                        className="w-full bg-secondary text-on-secondary-container py-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-secondary/10 flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">
                          sell
                        </span>
                        List Credits on Marketplace
                      </button>
                      <p className="text-[10px] text-on-surface-variant text-center font-medium leading-relaxed">
                        Fractionalize and sell your verified credits on the open
                        Web3 marketplace.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* ── List Credits Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isListModalOpen && project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-surface-container border border-outline rounded-2xl p-6 shadow-2xl space-y-6 text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-white">
                    List Credits
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Publish credits to the open carbon market.
                  </p>
                </div>
                <button
                  onClick={() => setIsListModalOpen(false)}
                  className="text-on-surface-variant hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleListCreditsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Credits to List (tCO2e)
                  </label>
                  <input
                    type="number"
                    placeholder={`Max: ${project.availableCredits}`}
                    value={creditsToList}
                    onChange={(e) =>
                      setCreditsToList(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Price per Credit (USDC)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={pricePerCredit}
                    onChange={(e) =>
                      setPricePerCredit(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={listMutation.isPending}
                  className="w-full bg-secondary text-on-secondary-container py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {listMutation.isPending ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">
                        sync
                      </span>
                      Approving &amp; Listing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">
                        sell
                      </span>
                      Publish Market Listing
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
