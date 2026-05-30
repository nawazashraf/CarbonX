"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/projects");
  }, [router]);

  return (
    <div className="p-8 text-zinc-400 text-center font-medium bg-black min-h-screen flex items-center justify-center">
      Redirecting to Projects dashboard...
    </div>
  );
}
