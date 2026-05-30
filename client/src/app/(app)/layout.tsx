"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import WalletButton from "@/components/WalletButton";

// function WalletButton() {
//   return (
//     <ConnectButton.Custom>
//       {({
//         account,
//         chain,
//         mounted,
//         openAccountModal,
//         openConnectModal,
//       }) => {
//         const connected = mounted && account && chain;

//         return (
//           <button
//             onClick={
//               connected
//                 ? openAccountModal
//                 : openConnectModal
//             }
//             className="brand-gradient px-6 py-2.5 rounded-xl font-label-md text-sm text-on-primary font-bold shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all"
//           >
//             {connected
//               ? account.displayName
//               : "Connect Wallet"}
//           </button>
//         );
//       }}
//     </ConnectButton.Custom>
//   );
// }

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll for header background transparency change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Projects", href: "/projects" },
    { label: "Rankings", href: "/rankings" },
    { label: "Analytics", href: "/analytics" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans selection:bg-primary-container/30">
      {/* TopNavBar */}
      <header
        className={`sticky top-0 z-50 h-20 border-b border-border-slate transition-all duration-300 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-xl shadow-xl"
            : "bg-surface/80 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
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

          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined p-2 text-text-secondary hover:text-primary transition-all scale-95 active:scale-90 cursor-pointer">
              search
            </button>
            <WalletButton />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="material-symbols-outlined p-2 text-text-secondary hover:text-primary md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? "close" : "menu"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
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
                        active
                          ? "text-primary font-bold"
                          : "text-text-secondary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="grow flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-border-slate py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <Link
              href="/"
              className="font-headline-md text-2xl font-bold text-primary"
            >
              CarbonX
            </Link>
            <p className="font-body-md text-sm text-text-secondary max-w-xs">
              High-integrity carbon marketplace for the regenerative economy.
            </p>
            <p className="font-label-sm text-xs text-text-secondary opacity-80 mt-4">
              © {new Date().getFullYear()} CarbonX Protocol. All rights
              reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col gap-4">
              <p className="font-label-md text-xs text-text-primary uppercase tracking-widest font-semibold">
                Platform
              </p>
              <Link
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="/marketplace"
              >
                Marketplace
              </Link>
              <Link
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="/projects"
              >
                Projects
              </Link>
              <Link
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="/docs"
              >
                Docs
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-label-md text-xs text-text-primary uppercase tracking-widest font-semibold">
                Community
              </p>
              <a
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="#"
              >
                Twitter
              </a>
              <a
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="#"
              >
                Discord
              </a>
              <a
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="#"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-label-md text-xs text-text-primary uppercase tracking-widest font-semibold">
                Legal
              </p>
              <a
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-text-secondary hover:text-primary transition-colors text-sm"
                href="#"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
