// app/signin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";

export default function SignIn() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/productbacklog");
    }
  }, [user, router]);

  if (user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-background/80 p-8 rounded-lg backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to KanbanCrew</h1>
        <GoogleSignIn />
      </div>
    </div>
  );
}
