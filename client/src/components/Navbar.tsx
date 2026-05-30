"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openConnectModal }) => {
        const connected = mounted && account && chain;

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="brand-gradient px-6 py-2.5 rounded-xl font-label-md text-sm text-on-primary font-bold shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all scale-95 active:scale-90 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                login
              </span>
              Connect Wallet
            </button>
          );
        }

        return (
          <button
            onClick={openAccountModal}
            className="brand-gradient px-6 py-2.5 rounded-xl font-label-md text-sm text-on-primary font-bold shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all scale-95 active:scale-90 cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              account_balance_wallet
            </span>

            {account.displayName}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

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
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="font-headline-md text-2xl font-bold tracking-tight text-primary hover:opacity-90 transition-opacity"
          >
            CarbonX
          </Link>

          <nav className="hidden md:flex gap-8">
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
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
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
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-label-md text-base transition-colors ${
                      active ? "text-primary font-bold" : "text-text-secondary"
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
