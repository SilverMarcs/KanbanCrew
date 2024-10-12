// app/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { EmailSignIn } from "@/components/auth/EmailSignIn";
import { SignInStep } from "@/models/auth/steps";
import { ForgotPass } from "@/components/auth/ForgotPass";
import CreateAccount from "@/components/auth/CreateAccount";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [signInStep, setSignInStep] = useState<SignInStep>(SignInStep.EMAIL);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/productbacklog");
    }
  }, [user, router]);

  if (user) {
    return null; // or a loading spinner
  }

  const navigateToCreateAccount = () => {
    setSignInStep(SignInStep.CREATE_ACCOUNT);
  };

  // Conditional rendering based on the sign-in step
  if (signInStep === SignInStep.CREATE_ACCOUNT) {
    return <CreateAccount />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-background/80 p-8 rounded-lg backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to KanbanCrew</h1>
        <EmailSignIn />
        <div className="mt-4">
          <GoogleSignIn />
        </div>
        <ForgotPass />
        <Button onClick={navigateToCreateAccount} className="mt-4">
          Create an Account
        </Button>
      </div>
    </div>
  );
}