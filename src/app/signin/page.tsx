// app/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignIn() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/productbacklog");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

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

  const handleCreateAccount = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "members", user.uid), {
        avatarUrl: user.photoURL,
        firstName,
        lastName,
        email,
        hoursWorked: [],
      });
      setMessage(
        "Account created successfully. Please check your email to verify."
      );
      console.log("Account created successfully:", user.email);
    } catch (error) {
      if (error instanceof Error) {
        setError("Failed to create account: " + error.message);
      } else {
        setError("Failed to create account due to an unexpected issue.");
      }
      console.error("Error creating account:", error);
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    try {
      // await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden w-1/2 bg-muted flex-col justify-center lg:flex">
        <div className="px-8">
          <h1 className="text-4xl font-bold mb-6">Welcome to KanbanCrew</h1>
          <p className="text-lg mb-4">
            Streamline your project management with our intuitive Kanban board
            system.
          </p>

          <p className="text-sm text-muted-foreground font-semibold mt-2">
            Subtitle
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-card flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isCreateAccount ? "Create an account" : "Login"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isCreateAccount
                ? "Enter your details below to create your account"
                : "Enter your email to sign in to your account"}
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <div className="grid gap-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  {isCreateAccount && (
                    <>
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </>
                  )}
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
                  {(showPassword || isCreateAccount) && (
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  )}
                </div>
                <Button
                  onClick={
                    isCreateAccount
                      ? handleCreateAccount
                      : showPassword
                      ? handleSignIn
                      : () => setShowPassword(true)
                  }
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isCreateAccount
                    ? "Create Account"
                    : showPassword
                    ? "Sign In"
                    : "Next"}
                </Button>
              </div>
            </form>
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
          </div>
          {!isCreateAccount ? (
            <>
              <Button variant="link" onClick={() => setIsCreateAccount(true)}>
                Create Account
              </Button>
            </>
          ) : (
            <Button variant="link" onClick={() => setIsCreateAccount(false)}>
              Back to Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
