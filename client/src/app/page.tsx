"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Count-up counter helper component
function Counter({ target, isFloat = false, duration = 2 }: { target: number; isFloat?: boolean; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out quartic
      const eased = 1 - Math.pow(1 - progress, 4);
      
      setCount(target * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {isFloat ? count.toFixed(1) : Math.floor(count)}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container/30">
      <Navbar />

      <main className="grow flex flex-col overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-16 overflow-hidden bg-radial-gradient">
          {/* Subtle Circuit/Glow Backgrounds */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[140px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0%,transparent_70%)] pointer-events-none"></div>
          </div>

          <div className="container max-w-[1280px] px-6 relative z-10 text-center flex flex-col items-center justify-center">
            
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
                CarbonX Institutional Protocol
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-headline-lg text-4xl sm:text-6xl md:text-[80px] md:leading-[1.1] max-w-4xl font-extrabold tracking-tight text-white mb-6"
            >
              The Future of <span className="text-primary font-extrabold">Environmental</span> Assets
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-body-md text-base md:text-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed"
            >
              Institutional-grade infrastructure for carbon credits, renewable energy certificates, and biodiversity assets on-chain.
            </motion.p>

            {/* Interactive Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center gap-4 z-20 mb-8"
            >
              <Link
                href="/marketplace"
                className="brand-gradient px-8 py-4 rounded-xl font-label-md text-sm text-on-primary font-bold shadow-2xl shadow-primary/20 hover:opacity-95 transition-all hover:scale-[1.02] active:scale-[0.98] text-center w-full sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href="/projects/new"
                className="border border-outline bg-surface-container/50 hover:bg-surface-container/80 px-8 py-4 rounded-xl font-label-md text-sm text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-center w-full sm:w-auto"
              >
                Register Asset
              </Link>
            </motion.div>

            {/* Floating Hero Token */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="mt-6 pointer-events-none"
            >
              <motion.img
                alt="Carbon Token"
                className="w-[280px] md:w-[420px] mx-auto filter drop-shadow-[0_0_60px_rgba(37,99,235,0.25)]"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 45,
                    repeat: Infinity,
                    ease: "linear",
                  }
                }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrO1a6-64PudoaRQn-tIwHqkAzMjof__7s07ntcqyaCIArp1e44BjO9SkxPBKu-9oAzzUakaefy8ybk-WY528MRiFIa6EgIDsbkzcJhnQGkHNd1C-83okF1NcrrGdG1vItaj07VIccFDfgm3I1KhbG2S6glbhUPMs8kqLgSpcCkeoO141JJl4Z3IBRC-XC8uZV-eEznmFOxlNgaKTZ4279dfeVfXYtzCNs-TeRzx5Hdyr7m95DobmNg8Qe1XHHgKUVp54xg_utbWY"
              />
            </motion.div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <span className="material-symbols-outlined text-3xl">expand_more</span>
          </div>
        </section>

        {/* Scroll Section 1: Engineered for Trust */}
        <section className="py-24 container max-w-[1280px] px-6 mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Gentle Scrolling rotating token */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1 relative h-[450px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-primary-container/5 rounded-full blur-[100px]"></div>
              <motion.img
                alt="Rotating Token"
                className="w-[360px] z-10 filter drop-shadow-[0_0_40px_rgba(37,99,235,0.15)]"
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrO1a6-64PudoaRQn-tIwHqkAzMjof__7s07ntcqyaCIArp1e44BjO9SkxPBKu-9oAzzUakaefy8ybk-WY528MRiFIa6EgIDsbkzcJhnQGkHNd1C-83okF1NcrrGdG1vItaj07VIccFDfgm3I1KhbG2S6glbhUPMs8kqLgSpcCkeoO141JJl4Z3IBRC-XC8uZV-eEznmFOxlNgaKTZ4279dfeVfXYtzCNs-TeRzx5Hdyr7m95DobmNg8Qe1XHHgKUVp54xg_utbWY"
              />
            </motion.div>

            {/* Right Side: Trust Core Principles */}
            <div className="order-1 lg:order-2 space-y-8 text-left">
              <div className="space-y-3">
                <span className="text-primary font-label-md text-xs uppercase tracking-widest font-bold">
                  Trust Architecture
                </span>
                <h2 className="font-headline-md text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Engineered for Global Trust
                </h2>
              </div>

              <div className="space-y-5">
                {[
                  {
                    title: "On-Chain Verification",
                    text: "Immutable proof of origin, data auditing, and tokenized retirement for every environmental credit registry transaction.",
                    icon: "verified"
                  },
                  {
                    title: "Real-Time Auditing",
                    text: "Multispectral satellite coordinate logs and registry audits ensure carbon sequestration values are checked 24/7.",
                    icon: "monitoring"
                  },
                  {
                    title: "Global Liquidity",
                    text: "Institutional-grade orderbooks and transparent pools providing deep liquidity for tokenized asset retirement.",
                    icon: "public"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="bg-surface-container/40 backdrop-blur-md border border-[#2A2A2A] hover:border-primary/50 transition-all duration-300 p-6 rounded-2xl flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline-sm text-base font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Scroll Section 2: Premium NFT Marketplace */}
        <section className="py-24 bg-surface-container/20 border-y border-outline/10 text-left">
          <div className="container max-w-[1280px] px-6 mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl space-y-3">
                <span className="text-primary font-label-md text-xs uppercase tracking-widest font-bold">
                  Asset Marketplace
                </span>
                <h2 className="font-headline-md text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Premium Environmental Asset NFTs
                </h2>
              </div>
              <Link 
                href="/marketplace"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-fixed-dim font-bold text-xs uppercase tracking-wider group transition-all shrink-0"
              >
                View Catalog 
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Project Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group cursor-pointer"
              >
                <div className="bg-surface-container/40 backdrop-blur-md border border-[#2A2A2A] hover:border-primary/50 transition-all duration-300 rounded-2xl overflow-hidden p-3 h-full flex flex-col justify-between">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4">
                    <img 
                      alt="Amazon Reforestation" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUC166RUEzk9DpOPnpXSHnw93PWWhaxndzKWgTNcfRzV2Mu4OJI83Hplt3XMNMrnnmLGLCgYNLNUaEKD3pAzSb-guVpmFxk1UnWOxpx62rxGGF6Ea9rviDTmfgzYcX0TBuvM_4mcv9hCel_mOU9GtX9Clspz8EqZZ79S4xhsuBkDZPdUnpGJE9nKHz_NMfPT2LlDkRZb5OVIHUU9BcR1RFkIzbKE4Df3jpRcTJl7u3Hq9SAa2j3glaJFPHnAmnkupUqOJ5oE7a2Ok"
                    />
                    <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-success font-label-sm text-[10px] flex items-center gap-1 border border-success/20">
                      <span className="material-symbols-outlined text-[14px]">verified</span> 
                      Verified
                    </div>
                  </div>
                  <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-sm text-base font-extrabold text-white mb-1">
                        Amazon Rainforest Vault
                      </h3>
                      <p className="text-xs text-on-surface-variant mb-4">
                        Maranhão, Brazil • 12,000 Hectares
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#2A2A2A] pt-4 mt-auto">
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">
                          Impact Index
                        </p>
                        <p className="text-xs font-bold text-primary">
                          +14% Canopy Recovery
                        </p>
                      </div>
                      <Link 
                        href="/marketplace"
                        className="bg-surface-container border border-[#2A2A2A] hover:bg-primary hover:text-on-primary px-4 py-2 rounded-lg text-xs font-bold transition-all"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Project Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="group cursor-pointer"
              >
                <div className="bg-surface-container/40 backdrop-blur-md border border-[#2A2A2A] hover:border-primary/50 transition-all duration-300 rounded-2xl overflow-hidden p-3 h-full flex flex-col justify-between">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4">
                    <img 
                      alt="Solaris Energy" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo8Ko6viPHxVhrtlMbYoIUlErJORGCTY82imBYIEZX9jOumLZMpLXLQ6gsRIrvhC4A66vveucwvxdkXMsxEPQ2-aRhAX9j9iRQ4C4JVPVjw8etS7hCbPX_X3xnwn99RQvzwL-wKR6RUiwvbZ-u6pfOb5V4oqg9CyMuq9g9CbNCcM45TqwtmyRDmVGsId0XEunbuuVvXRO5zd_Hg_GKPc0EaoukiZK072-ir2ocYeCRKmc57VkuF0D-1SrFafAiyhSpTD4KU9GLfzw"
                    />
                    <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-secondary font-label-sm text-[10px] flex items-center gap-1 border border-secondary/20">
                      <span className="material-symbols-outlined text-[14px]">bolt</span> 
                      Energy
                    </div>
                  </div>
                  <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-sm text-base font-extrabold text-white mb-1">
                        Solaris Project #001
                      </h3>
                      <p className="text-xs text-on-surface-variant mb-4">
                        Mojave Desert, USA • 500MW Capacity
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#2A2A2A] pt-4 mt-auto">
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">
                          Serial Range
                        </p>
                        <p className="text-xs font-bold text-secondary">
                          001 - 100
                        </p>
                      </div>
                      <Link 
                        href="/marketplace"
                        className="bg-surface-container border border-[#2A2A2A] hover:bg-secondary hover:text-on-secondary px-4 py-2 rounded-lg text-xs font-bold transition-all"
                      >
                        Trade
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Project Card 3: Register Asset CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group cursor-pointer"
              >
                <div className="bg-surface-container/40 backdrop-blur-md border border-dashed border-outline/65 hover:border-primary/50 transition-all duration-300 rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-8 space-y-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                      <span className="material-symbols-outlined text-[32px]">add_circle</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-headline-sm text-base font-bold text-white">Register Asset</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed max-w-[220px] mx-auto">
                        List your verified ecological restoration project on the CarbonX Registry.
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link
                      href="/projects/new"
                      className="block w-full text-center py-3 rounded-xl border border-outline hover:border-primary hover:text-primary transition-all text-xs font-bold"
                    >
                      Apply for Listing
                    </Link>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* Scroll Section 3: Global Scale Impact */}
        <section className="py-24 container max-w-[1280px] px-6 mx-auto">
          <div className="text-center mb-20 space-y-3">
            <h2 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Global Scale Impact
            </h2>
            <p className="text-xs text-on-surface-variant max-w-lg mx-auto leading-relaxed">
              Tracking verifiable environmental progress across our decentralized registry in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <div className="space-y-3">
              <div className="text-[64px] font-black text-primary leading-none tracking-tight">
                <Counter target={1.2} isFloat={true} />M
              </div>
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                Tons CO2 Offset
              </p>
              <div className="h-0.5 w-12 bg-primary/20 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="space-y-3">
              <div className="text-[64px] font-black text-secondary leading-none tracking-tight">
                <Counter target={3.4} isFloat={true} />M
              </div>
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                Trees Protected
              </p>
              <div className="h-0.5 w-12 bg-secondary/20 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="space-y-3">
              <div className="text-[64px] font-black text-primary leading-none tracking-tight">
                <Counter target={152} />
              </div>
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                Projects Verified
              </p>
              <div className="h-0.5 w-12 bg-primary/20 mx-auto mt-6 rounded-full"></div>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 max-w-[1280px] w-full mx-auto">
          <div className="bg-surface-container border border-outline rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.025)_0%,transparent_80%)] pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="font-headline-lg text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Transition to<br />Institutional Carbon?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/marketplace"
                  className="bg-primary text-on-primary px-10 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider hover:opacity-95 transition-opacity w-full sm:w-auto text-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/marketplace"
                  className="border border-[#2a2a2a] hover:bg-[#111] px-10 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-white transition-all w-full sm:w-auto text-center"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
