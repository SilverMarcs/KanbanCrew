// app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/app/Sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { BackgroundImage } from "@/components/BackgroundImage";
import { useAuthContext } from "@/contexts/AuthContext";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/signin";

  return (
    <ToastProvider>
      <BackgroundImage />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? "ml-16" : ""}`}>
          {children}
        </main>
      </div>
      <Toaster />
    </ToastProvider>
  );
}
