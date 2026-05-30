"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  {
    label: "Carbon Credits",
    href: "/marketplace",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Rankings",
    href: "/rankings",
  },
  {
    label: "Verification",
    href: "/verification",
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-400 items-center justify-between px-6 md:px-8 xl:px-12">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-black">
            C
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              CarbonX
            </h1>
            <p className="text-xs text-zinc-400">
              Carbon Credit Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Section */}
        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/5">
            Sign In
          </button>

          <button className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-black transition hover:scale-105">
            Connect Wallet
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white lg:hidden"
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="border-t border-white/10 bg-black/95 lg:hidden"
          >
            <div className="flex flex-col p-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-6 flex flex-col gap-3">
                <button className="rounded-xl border border-white/10 py-3 text-white">
                  Sign In
                </button>

                <button className="rounded-xl bg-emerald-500 py-3 font-semibold text-black">
                  Connect Wallet
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}