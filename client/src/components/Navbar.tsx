"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WalletButton from "@/components/WalletButton";

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Projects", href: "/projects" },
    { label: "Rankings", href: "/rankings" },
    { label: "Analytics", href: "/analytics" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 h-20 border-b border-border-slate transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-xl shadow-xl"
          : "bg-surface/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 lg:px-6">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="font-headline-md text-2xl font-bold tracking-tight text-primary hover:opacity-90 transition-opacity"
          >
            CarbonX
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-10">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-label-md text-sm transition-colors py-1 ${
                  active
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-3">
          <button className="material-symbols-outlined p-2 text-text-secondary hover:text-primary transition-all scale-95 active:scale-90 cursor-pointer">
            search
          </button>

          <WalletButton />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="material-symbols-outlined p-2 text-text-secondary hover:text-primary md:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? "close" : "menu"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border-slate bg-surface/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-label-md text-base transition-colors ${
                      active
                        ? "text-primary font-bold"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-4">
                <WalletButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}