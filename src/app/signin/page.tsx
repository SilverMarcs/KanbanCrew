"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { WelcomeSection } from "@/components/auth/WelcomeSection";
import { AuthenticationSection } from "@/components/auth/AuthenticationSection";
import { ToastProvider } from "@radix-ui/react-toast";

export default function SignIn() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/productbacklog");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen">
        <WelcomeSection />
        <AuthenticationSection />
      </div>
    </ToastProvider>
  );
}
