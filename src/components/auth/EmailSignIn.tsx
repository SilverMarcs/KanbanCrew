// components/auth/EmailSignIn.tsx
import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const EmailSignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length === 0) {
        setError("No account found with this email. Please create an account first.");
      } else if (signInMethods.includes("password")) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          console.error("Error signing in:", error);
          setError("Invalid email or password. Please try again.");
        }
      } else if (signInMethods.includes("google.com")) {
        setError("This email is associated with a Google account. Please use Google Sign In.");
      }
    } catch (error) {
      console.error("Error checking email methods:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSignIn} className="mb-2">Sign In</Button>
      <Button onClick={handleForgotPassword} variant="link" className="p-1">
        Forgot Password?
      </Button>
    </div>
  );
};
