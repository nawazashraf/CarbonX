import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans selection:bg-primary-container/30">
      <Navbar />

      <main className="grow flex flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
}