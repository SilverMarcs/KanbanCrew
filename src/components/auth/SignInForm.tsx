"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { ForgotPasswordButton } from "./ForgotPasswordButton";
import { useToast } from "@/components/ui/use-toast";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        toast({
          title: "Account not found",
          description: "Please create an account first.",
          variant: "destructive",
        });
      } else if (signInMethods.includes("password")) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          router.push("/productbacklog");
        } catch (error) {
          console.error("Error signing in:", error);
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      } else if (signInMethods.includes("google.com")) {
        toast({
          title: "Google account",
          description:
            "This email is associated with a Google account. Please use Google Sign In.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking email methods:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {showPassword && (
            <Input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <ForgotPasswordButton isAdmin={false}/>
        </div>
        <Button
          onClick={showPassword ? handleSignIn : () => setShowPassword(true)}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {showPassword ? "Sign In" : "Next"}
        </Button>
      </div>
    </form>
  );
}
