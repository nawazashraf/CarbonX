import Link from "next/link";

export default function Footer() {
  return (
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
            © {new Date().getFullYear()} CarbonX Protocol. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12">
          <div className="flex flex-col gap-4">
            <p className="font-label-md text-xs text-text-primary uppercase tracking-widest font-semibold">
              Platform
            </p>

            <Link
              href="/marketplace"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Marketplace
            </Link>

            <Link
              href="/projects"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Projects
            </Link>

            <Link
              href="/docs"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Docs
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-label-md text-xs text-text-primary uppercase tracking-widest font-semibold">
              Community
            </p>

            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Twitter
            </a>

            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Discord
            </a>

            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              LinkedIn
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-label-md text-xs text-text-primary uppercase tracking-widest font-semibold">
              Legal
            </p>

            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}