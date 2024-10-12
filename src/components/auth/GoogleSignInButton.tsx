"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { auth } from "@/lib/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/productbacklog");
    } catch (error) {
      console.error("Error signing in with Google", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={handleGoogleSignIn}>
        <Mail className="mr-2 h-4 w-4" /> Google
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
}
