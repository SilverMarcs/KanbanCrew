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

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        setError(
          "No account found with this email. Please create an account first."
        );
      } else if (signInMethods.includes("password")) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          router.push("/productbacklog");
        } catch (error) {
          console.error("Error signing in:", error);
          setError("Invalid email or password. Please try again.");
        }
      } else if (signInMethods.includes("google.com")) {
        setError(
          "This email is associated with a Google account. Please use Google Sign In."
        );
      }
    } catch (error) {
      console.error("Error checking email methods:", error);
      setError("An error occurred. Please try again.");
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
          <ForgotPasswordButton />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
