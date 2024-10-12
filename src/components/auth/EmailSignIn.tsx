// components/auth/EmailSignIn.tsx
import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInStep } from "@/models/auth/steps";

interface EmailSignInProps {
  signInStep: SignInStep;
  setSignInStep: (step: SignInStep) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const EmailSignIn: React.FC<EmailSignInProps> = ({
  signInStep,
  setSignInStep,
  email,
  setEmail,
}) => {
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleNextStep = async () => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      console.log(signInMethods);

      if (signInMethods.length === 0) {
        setSignInStep(SignInStep.NEW_USER);
      } else if (signInMethods.includes("password")) {
        setSignInStep(SignInStep.PASSWORD);
      } else if (signInMethods.includes("google.com")) {
        setSignInStep(SignInStep.GOOGLE_REQUIRED);
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create new member document
      const newMemberRef = doc(db, "members", user.uid);
      await setDoc(newMemberRef, {
        avatarUrl: "",
        firstName,
        lastName,
        email,
        hoursWorked: [],
      });
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred during sign up. Please try again.");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {signInStep === SignInStep.EMAIL && (
        <>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleNextStep}>Next</Button>
        </>
      )}
      {signInStep === SignInStep.PASSWORD && (
        <>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSignIn}>Sign In</Button>
        </>
      )}
      {signInStep === SignInStep.NEW_USER && (
        <>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mb-4"
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSignUp}>Sign Up</Button>
        </>
      )}
      {signInStep === SignInStep.GOOGLE_REQUIRED && (
        <p>
          This email is associated with a Google account. Please use Google Sign
          In.
        </p>
      )}
    </div>
  );
};
