"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { WelcomeSection } from "@/components/auth/WelcomeSection";
import { AuthenticationSection } from "@/components/auth/AuthenticationSection";

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
    <div className="flex h-screen">
      <WelcomeSection />
      <AuthenticationSection />
    </div>
  );
}
