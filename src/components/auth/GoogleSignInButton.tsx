"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { auth } from "@/lib/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/productbacklog");
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: "Google Sign In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
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
    </>
  );
}
